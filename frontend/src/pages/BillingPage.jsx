import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar";

import PropertySidebar from "../components/sections/billing/PropertySidebar";
import CurrentMonthInvoice from "../components/sections/billing/CurrentMonthInvoice";
import PendingServices from "../components/sections/billing/PendingServices";
import ServiceHistory from "../components/sections/billing/ServiceHistory";

import ComplaintButton from "../components/sections/complaint/ComplaintButton";
import ComplaintList from "../components/sections/complaint/ComplaintList";

import {
  getBillingApartmentsForCurrentUser,
  getBookingsByAccountId,
  getServiceInvoices,
  getUtilitiesInvoicesByApartmentId,
} from "../services/billingService";
import { getMyAccount } from "../services/profileService";
import { getServices } from "../services/serviceService";

import "../styles/billing.css";

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const getMonthKey = (year, month) =>
  year && month ? `${year}-${String(month).padStart(2, "0")}` : "unknown";

const getInvoiceStatus = (status) =>
  Number(status) === 1
    ? { key: "paid", label: "Paid" }
    : { key: "unpaid", label: "Unpaid" };

const getBookingLabel = (booking) =>
  booking?.serviceResource?.service?.serviceName ||
  booking?.serviceResource?.serviceName ||
  booking?.serviceName ||
  null;

const sortByBillingPeriod = (items) =>
  [...items].sort((a, b) => {
    const yearA = Number(a?.billingYear ?? 0);
    const yearB = Number(b?.billingYear ?? 0);
    const monthA = Number(a?.billingMonth ?? 0);
    const monthB = Number(b?.billingMonth ?? 0);

    if (yearA !== yearB) return yearA - yearB;
    return monthA - monthB;
  });

const buildUtilityBills = (utilityInvoices, utilityRates) => {
  const sortedInvoices = sortByBillingPeriod(utilityInvoices);
  let electricityReading = 0;
  let waterReading = 0;

  return sortedInvoices.map((invoice) => {
    const status = getInvoiceStatus(invoice.status);
    const invoiceMonthKey = getMonthKey(
      invoice.billingYear,
      invoice.billingMonth
    );
    const createdAt = invoice.createdAt ? new Date(invoice.createdAt) : null;
    const electricityUsage = Number(invoice.totalElectricUsed ?? 0);
    const waterUsage = Number(invoice.totalWaterUsed ?? 0);

    const electricityRate =
      Number(utilityRates.electricity?.feePerUnit ?? 0) || 0;
    const waterRate = Number(utilityRates.water?.feePerUnit ?? 0) || 0;

    const electricityAmount = electricityUsage * electricityRate;
    const waterAmount = waterUsage * waterRate;

    const previousElectricityReading = electricityReading;
    const currentElectricityReading =
      previousElectricityReading + electricityUsage;

    const previousWaterReading = waterReading;
    const currentWaterReading = previousWaterReading + waterUsage;

    electricityReading = currentElectricityReading;
    waterReading = currentWaterReading;

    return {
      id: `utility-${invoice.id}`,
      source: "utility",
      name: `Utilities Invoice #${invoice.id}`,
      monthKey: invoiceMonthKey,
      dueDate: createdAt,
      amount: electricityAmount + waterAmount,
      statusKey: status.key,
      statusLabel: status.label,
      utilityDetails: {
        electricity: {
          label: "Electricity",
          unit: "kWh",
          previousReading: previousElectricityReading,
          currentReading: currentElectricityReading,
          rate: electricityRate,
          amount: electricityAmount,
          usage: electricityUsage,
        },
        water: {
          label: "Water",
          unit: "m3",
          previousReading: previousWaterReading,
          currentReading: currentWaterReading,
          rate: waterRate,
          amount: waterAmount,
          usage: waterUsage,
        },
      },
    };
  });
};

const buildServiceBillFromBooking = (booking, invoice) => {
  const status = getInvoiceStatus(invoice?.status ?? booking?.status);
  const sourceDate = invoice?.paymentDate
    ? new Date(invoice.paymentDate)
    : booking?.bookFrom
    ? new Date(booking.bookFrom)
    : booking?.bookAt
    ? new Date(booking.bookAt)
    : invoice?.createdAt
    ? new Date(invoice.createdAt)
    : null;

  return {
    id: invoice?.id
      ? `service-${invoice.id}`
      : `service-booking-${booking?.id ?? "unknown"}`,
    source: "service",
    name:
      getBookingLabel(booking || invoice?.bookingService) ||
      (invoice?.id
        ? `Service Invoice #${invoice.id}`
        : `Service Booking #${booking?.id}`),
    monthKey: sourceDate
      ? getMonthKey(sourceDate.getFullYear(), sourceDate.getMonth() + 1)
      : "unknown",
    dueDate: sourceDate,
    amount: Number(invoice?.amount ?? booking?.totalAmount ?? 0),
    statusKey: status.key,
    statusLabel: status.label,
  };
};

export default function BillingPage() {
  const [accountId, setAccountId] = useState(null);
  const [apartment, setApartment] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("billing");
  const [billingSubTab, setBillingSubTab] = useState("current");
  const [complaintRefreshKey, setComplaintRefreshKey] = useState(0);
  const [monthKey, setMonthKey] = useState("all");
  const [apartments, setApartments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceInvoiceWarning, setServiceInvoiceWarning] = useState("");

  const handleComplaintSuccess = () => {
    setComplaintRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const complaintToast = sessionStorage.getItem("billingComplaintToast");

    if (complaintToast === "success") {
      toast.success("Complaint submitted successfully");
      sessionStorage.removeItem("billingComplaintToast");
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadApartments = async () => {
      try {
        const [account, apartmentList] = await Promise.all([
          getMyAccount(),
          getBillingApartmentsForCurrentUser(),
        ]);

        if (!active) return;

        const normalizedApartments = apartmentList.map((item) => ({
          id: String(item.id),
          label: item.roomNumber ?? item.id,
          floorNumber: item.floorNumber,
        }));

        setAccountId(account.id);
        setApartments(normalizedApartments);
        setApartment((current) => {
          if (normalizedApartments.some((item) => item.id === current)) {
            return current;
          }
          return normalizedApartments[0]?.id || "";
        });
      } catch (error) {
        console.error(error);
        if (active) {
          toast.error("Failed to load billing data from backend");
          setAccountId(null);
          setApartments([]);
          setBills([]);
        }
      }
    };

    loadApartments();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadInvoices = async () => {
      if (!apartment || !accountId) {
        setBills([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [utilityInvoices, serviceInvoiceResponse, bookings, services] =
          await Promise.all([
            getUtilitiesInvoicesByApartmentId(apartment),
            getServiceInvoices(),
            getBookingsByAccountId(accountId),
            getServices(),
          ]);

        if (!active) return;

        const utilityRates = services.reduce(
          (acc, service) => {
            if (service.serviceCode === "ELEC_01") {
              acc.electricity = service;
            }

            if (service.serviceCode === "WAT_01") {
              acc.water = service;
            }

            return acc;
          },
          { electricity: null, water: null }
        );

        const bookingMap = new Map(
          bookings
            .filter((booking) => booking?.id)
            .map((booking) => [booking.id, booking])
        );
        const invoiceByBookingId = new Map(
          serviceInvoiceResponse.items
            .filter((invoice) => invoice?.bookingService?.id)
            .map((invoice) => [invoice.bookingService.id, invoice])
        );

        const utilityBills = buildUtilityBills(utilityInvoices, utilityRates);

        const serviceBills = bookings.map((booking) =>
          buildServiceBillFromBooking(
            booking,
            invoiceByBookingId.get(booking.id) ?? null
          )
        );

        const unlinkedServiceInvoices = serviceInvoiceResponse.items
          .filter((invoice) => {
            const bookingId = invoice?.bookingService?.id;
            return !bookingId || !bookingMap.has(bookingId);
          })
          .map((invoice) =>
            buildServiceBillFromBooking(invoice?.bookingService, invoice)
          );

        const allBills = [
          ...utilityBills,
          ...serviceBills,
          ...unlinkedServiceInvoices,
        ].sort((a, b) => {
          const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return timeB - timeA;
        });

        setServiceInvoiceWarning(
          serviceInvoiceResponse.restricted
            ? "Service invoice details are limited for this account, so the billing page is showing your real booking charges from the backend where invoice records are not accessible."
            : ""
        );
        setBills(allBills);
      } catch (error) {
        console.error(error);
        if (active) {
          toast.error("Failed to load invoices from backend");
          setBills([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInvoices();

    return () => {
      active = false;
    };
  }, [accountId, apartment]);

  const monthOptions = useMemo(() => {
    const optionMap = new Map();

    bills.forEach((bill) => {
      if (!bill.dueDate || bill.monthKey === "unknown") return;
      if (!optionMap.has(bill.monthKey)) {
        optionMap.set(bill.monthKey, {
          value: bill.monthKey,
          label: MONTH_FORMATTER.format(new Date(bill.dueDate)),
        });
      }
    });

    return Array.from(optionMap.values()).sort((a, b) =>
      b.value.localeCompare(a.value)
    );
  }, [bills]);

  useEffect(() => {
    if (monthKey === "all") return;

    const exists = monthOptions.some((item) => item.value === monthKey);
    if (!exists) {
      setMonthKey("all");
    }
  }, [monthKey, monthOptions]);

  const filteredBills = useMemo(() => {
    if (monthKey === "all") return bills;
    return bills.filter((bill) => bill.monthKey === monthKey);
  }, [bills, monthKey]);

  const summary = useMemo(() => {
    const totalDue = filteredBills
      .filter((bill) => bill.statusKey !== "paid")
      .reduce((sum, bill) => sum + bill.amount, 0);

    const unpaidBills = filteredBills.filter(
      (bill) => bill.statusKey !== "paid"
    ).length;

    const paidThisMonth = filteredBills
      .filter((bill) => bill.statusKey === "paid")
      .reduce((sum, bill) => sum + bill.amount, 0);

    return {
      totalDue,
      unpaidBills,
      paidThisMonth,
    };
  }, [filteredBills]);

  const allUnpaidBills = useMemo(() => {
    return bills
      .filter((bill) => bill.statusKey !== "paid")
      .sort((a, b) => {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return timeB - timeA;
      });
  }, [bills]);

  const chartData = useMemo(() => {
    const grouped = filteredBills.reduce((acc, bill) => {
      const current = acc.get(bill.name) ?? 0;
      acc.set(bill.name, current + bill.amount);
      return acc;
    }, new Map());

    return Array.from(grouped.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredBills]);

  const payments = useMemo(
    () =>
      filteredBills
        .filter((bill) => bill.statusKey === "paid")
        .map((bill) => ({
          id: bill.id,
          date: bill.dueDate,
          amount: bill.amount,
          method: bill.source === "service" ? "Service Invoice" : "Utilities Invoice",
        })),
    [filteredBills]
  );

  const formatCurrency = (value) => CURRENCY_FORMATTER.format(Number(value || 0));

  const formatDate = (value) => {
    if (!value) return "N/A";
    const parsedDate = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "N/A";
    return DATE_FORMATTER.format(parsedDate);
  };

  return (
    <>
      <Navbar />

      <div className="billing-page">
        <div className="container-xl billing-container p-3 d-flex flex-column flex-md-row gap-4 mb-5">
          <PropertySidebar
            apartments={apartments}
            selectedApartmentId={apartment}
            onSelectApartment={setApartment}
            activeMainTab={activeMainTab}
            onSelectMainTab={setActiveMainTab}
          />

          <div className="billing-content flex-grow-1" style={{ minWidth: 0 }}>
            {activeMainTab === "billing" && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="billing-title mb-0 fs-3 fw-bold text-dark">Billing Dashboard</h2>
                </div>

                <ul className="nav nav-tabs mb-4 px-2">
                  <li className="nav-item border-0">
                    <button
                      className={`nav-link fw-semibold rounded-top ${billingSubTab === "current" ? "active text-white" : "text-muted"}`}
                      style={{ 
                        backgroundColor: billingSubTab === "current" ? "#2e7d32" : "transparent",
                        border: billingSubTab === "current" ? "1px solid #2e7d32" : "none",
                        borderBottom: "none"
                      }}
                      onClick={() => setBillingSubTab("current")}
                    >
                      This Month
                    </button>
                  </li>
                  <li className="nav-item border-0">
                    <button
                      className={`nav-link fw-semibold rounded-top ${billingSubTab === "pending" ? "active text-white" : "text-muted"}`}
                      style={{ 
                        backgroundColor: billingSubTab === "pending" ? "#2e7d32" : "transparent",
                        border: billingSubTab === "pending" ? "1px solid #2e7d32" : "none",
                        borderBottom: "none"
                      }}
                      onClick={() => setBillingSubTab("pending")}
                    >
                      Pending Services
                    </button>
                  </li>
                  <li className="nav-item border-0">
                    <button
                      className={`nav-link fw-semibold rounded-top ${billingSubTab === "history" ? "active text-white" : "text-muted"}`}
                      style={{ 
                        backgroundColor: billingSubTab === "history" ? "#2e7d32" : "transparent",
                        border: billingSubTab === "history" ? "1px solid #2e7d32" : "none",
                        borderBottom: "none" 
                      }}
                      onClick={() => setBillingSubTab("history")}
                    >
                      Service History
                    </button>
                  </li>
                </ul>

                {serviceInvoiceWarning ? (
                  <div className="alert alert-warning my-3 shadow-sm">{serviceInvoiceWarning}</div>
                ) : null}

                {billingSubTab === "current" && (
                   <CurrentMonthInvoice 
                      bills={bills} 
                      formatCurrency={formatCurrency} 
                      formatDate={formatDate}
                   />
                )}

                {billingSubTab === "pending" && (
                   <PendingServices 
                      bills={allUnpaidBills}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      loading={loading}
                   />
                )}

                {billingSubTab === "history" && (
                  <ServiceHistory
                     apartment={apartment}
                     setApartment={setApartment}
                     monthKey={monthKey}
                     setMonthKey={setMonthKey}
                     apartments={apartments}
                     monthOptions={monthOptions}
                     summary={summary}
                     filteredBills={filteredBills}
                     chartData={chartData}
                     payments={payments}
                     formatCurrency={formatCurrency}
                     formatDate={formatDate}
                     loading={loading}
                  />
                )}
              </>
            )}

            {activeMainTab === "complaints" && (
              <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                  <h2 className="billing-title mb-0 fs-3 fw-bold text-dark">My Complaints</h2>
                  <ComplaintButton onSuccess={handleComplaintSuccess} />
                </div>
                <ComplaintList refreshKey={complaintRefreshKey} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

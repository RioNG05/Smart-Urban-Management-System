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
  getMandatoryServices
} from "../services/myHomeService";
import { getCurrentUser } from "../services/authService";

import "../styles/billing.css";

import {
  MONTH_FORMATTER,
  CURRENCY_FORMATTER,
  formatDate,
  buildUtilityBills,
  buildServiceBillFromBooking
} from "../utils/billingUtils";

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
          getCurrentUser(),
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
        const [utilityInvoices, serviceInvoiceResponse, bookings, mandatoryServices] =
          await Promise.all([
            getUtilitiesInvoicesByApartmentId(apartment),
            getServiceInvoices(),
            getBookingsByAccountId(accountId),
            getMandatoryServices(),
          ]);

        if (!active) return;

        const utilityRates = mandatoryServices.reduce(
          (acc, service) => {
            if (service.serviceCode === "ELEC_01") {
              acc.electricity = service;
            }

            if (service.serviceCode === "WAT_01") {
              acc.water = service;
            }

            if (service.serviceCode === "MNG_FEE") {
              acc.management = service;
            }

            return acc;
          },
          { electricity: null, water: null, management: null }
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
    const totalDue = bills
      .filter((bill) => bill.statusKey !== "paid")
      .reduce((sum, bill) => sum + bill.amount + (bill.managementFee || 0), 0);

    const unpaidBills = bills.filter(
      (bill) => bill.statusKey !== "paid"
    ).length;

    const paidThisMonth = bills
      .filter((bill) => bill.statusKey === "paid")
      .reduce((sum, bill) => sum + bill.amount + (bill.managementFee || 0), 0);

    return {
      totalDue,
      unpaidBills,
      paidThisMonth,
    };
  }, [bills]);

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
          date: bill.createdAt,
          amount: bill.amount,
          method: bill.source === "service" ? "Service Invoice" : "Mandatory Invoice",
        })),
    [filteredBills]
  );
  
  const formatCurrencyLocal = (value) => CURRENCY_FORMATTER.format(Number(value || 0));

  return (
    <>
      <Navbar />

      <div className="billing-page">
        <div className="container-fluid billing-container p-3 d-flex flex-column flex-md-row gap-4 mb-5">
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
                      formatCurrency={formatCurrencyLocal} 
                      formatDate={formatDate}
                   />
                )}

                {billingSubTab === "pending" && (
                   <PendingServices 
                      bills={allUnpaidBills}
                      formatCurrency={formatCurrencyLocal}
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
                     formatCurrency={formatCurrencyLocal}
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

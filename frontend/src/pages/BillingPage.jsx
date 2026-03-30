import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar";

import PropertySidebar from "../components/sections/billing/PropertySidebar";
import BillingSummary from "../components/sections/billing/BillingSummary";
import BillingTable from "../components/sections/billing/BillingTable";
import BillingChart from "../components/sections/billing/BillingChart";
import BillingFilters from "../components/sections/billing/BillingFilters";
import PaymentHistory from "../components/sections/billing/PaymentHistory";

import ComplaintButton from "../components/sections/complaint/ComplaintButton";
import ComplaintList from "../components/sections/complaint/ComplaintList";

import {
  getBillingApartmentsForCurrentUser,
  getBookingsByAccountId,
  getServiceInvoices,
  getUtilitiesInvoicesByApartmentId,
} from "../services/billingService";
import { getMyAccount } from "../services/profileService";

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

export default function BillingPage() {
  const [accountId, setAccountId] = useState(null);
  const [apartment, setApartment] = useState("");
  const [monthKey, setMonthKey] = useState("all");
  const [apartments, setApartments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceInvoiceWarning, setServiceInvoiceWarning] = useState("");

  useEffect(() => {
    const complaintToast = sessionStorage.getItem("billingComplaintToast");

    if (complaintToast === "success") {
      toast.success("Gui complaint thanh cong");
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
          toast.error("Khong the tai du lieu billing tu backend");
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
      if (!apartment) {
        setBills([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [utilityInvoices, serviceInvoiceResponse, bookings] = await Promise.all([
          getUtilitiesInvoicesByApartmentId(apartment),
          getServiceInvoices(),
          getBookingsByAccountId(accountId),
        ]);

        if (!active) return;

        const bookingMap = new Map(
          bookings
            .filter((booking) => booking?.id)
            .map((booking) => [booking.id, booking])
        );

        const utilityBills = utilityInvoices.map((invoice) => {
          const status = getInvoiceStatus(invoice.status);
          const invoiceMonthKey = getMonthKey(
            invoice.billingYear,
            invoice.billingMonth
          );
          const createdAt = invoice.createdAt
            ? new Date(invoice.createdAt)
            : null;

          return {
            id: `utility-${invoice.id}`,
            source: "utility",
            name: `Utilities Invoice #${invoice.id}`,
            monthKey: invoiceMonthKey,
            dueDate: createdAt,
            amount: Number(invoice.totalAmount ?? 0),
            statusKey: status.key,
            statusLabel: status.label,
          };
        });

        const serviceBills = serviceInvoiceResponse.items
          .filter((invoice) => {
            const bookingId = invoice?.bookingService?.id;
            return (
              bookingMap.has(bookingId) ||
              invoice?.bookingService?.account?.id === accountId
            );
          })
          .map((invoice) => {
            const status = getInvoiceStatus(invoice.status);
            const booking = bookingMap.get(invoice?.bookingService?.id);
            const paymentDate = invoice.paymentDate
              ? new Date(invoice.paymentDate)
              : booking?.bookFrom
              ? new Date(booking.bookFrom)
              : invoice.createdAt
              ? new Date(invoice.createdAt)
              : null;

            return {
              id: `service-${invoice.id}`,
              source: "service",
              name: getBookingLabel(booking) || `Service Invoice #${invoice.id}`,
              monthKey: paymentDate
                ? getMonthKey(
                    paymentDate.getFullYear(),
                    paymentDate.getMonth() + 1
                  )
                : "unknown",
              dueDate: paymentDate,
              amount: Number(invoice.amount ?? 0),
              statusKey: status.key,
              statusLabel: status.label,
            };
          });

        const fallbackServiceBills =
          serviceInvoiceResponse.restricted || serviceBills.length === 0
            ? bookings.map((booking) => {
                const status = getInvoiceStatus(booking.status);
                const bookingDate = booking?.bookFrom
                  ? new Date(booking.bookFrom)
                  : booking?.bookAt
                  ? new Date(booking.bookAt)
                  : null;

                return {
                  id: `service-booking-${booking.id}`,
                  source: "service",
                  name: getBookingLabel(booking) || `Service Booking #${booking.id}`,
                  monthKey: bookingDate
                    ? getMonthKey(
                        bookingDate.getFullYear(),
                        bookingDate.getMonth() + 1
                      )
                    : "unknown",
                  dueDate: bookingDate,
                  amount: Number(booking.totalAmount ?? 0),
                  statusKey: status.key,
                  statusLabel: status.label,
                };
              })
            : [];

        const allBills = [
          ...utilityBills,
          ...serviceBills,
          ...fallbackServiceBills,
        ].sort((a, b) => {
          const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return timeB - timeA;
        });

        setServiceInvoiceWarning(
          serviceInvoiceResponse.restricted
            ? "Service invoices are hidden because this account does not have permission to read them. Billing is temporarily using your service bookings as fallback data."
            : ""
        );
        setBills(allBills);
      } catch (error) {
        console.error(error);
        if (active) {
          toast.error("Khong the tai hoa don tu backend");
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
        <div className="billing-container">
          <PropertySidebar
            apartments={apartments}
            selectedApartmentId={apartment}
            onSelectApartment={setApartment}
          />

          <div className="billing-content">
            <h2 className="billing-title">Billing Dashboard</h2>

            {/* Report Issue Button */}
            <ComplaintButton />

            {/* Filters */}
            <BillingFilters
              apartment={apartment}
              setApartment={setApartment}
              monthKey={monthKey}
              setMonthKey={setMonthKey}
              apartments={apartments}
              months={monthOptions}
            />

            {serviceInvoiceWarning ? (
              <div className="billing-note">{serviceInvoiceWarning}</div>
            ) : null}

            <BillingSummary
              summary={summary}
              formatCurrency={formatCurrency}
            />

            <BillingTable
              bills={filteredBills}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              loading={loading}
            />

            <BillingChart
              data={chartData}
              formatCurrency={formatCurrency}
            />

            <PaymentHistory
              payments={payments}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />

            {/* Complaint Center */}
            <ComplaintList />
          </div>
        </div>
      </div>
    </>
  );
}

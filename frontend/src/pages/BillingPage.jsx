import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  FaFileInvoiceDollar,
  FaExclamationCircle,
  FaHome,
  FaWallet,
  FaHistory,
  FaCalendarCheck,
  FaCalendarAlt,
  FaTags,
  FaArrowUp,
  FaCreditCard,
  FaCalendarPlus
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";

import PropertySidebar from "../components/sections/billing/PropertySidebar";
import BillingSummary from "../components/sections/billing/BillingSummary";
import BillingPayableBreakdown from "../components/sections/billing/BillingPayableBreakdown";
import BillingPricingTable from "../components/sections/billing/BillingPricingTable";
import BillingTable from "../components/sections/billing/BillingTable";
import BillingChart from "../components/sections/billing/BillingChart";
import BillingFilters from "../components/sections/billing/BillingFilters";
import PaymentHistory from "../components/sections/billing/PaymentHistory";

import BookingChart from "../components/sections/booking/BookingChart";
import BookingPricingTable from "../components/sections/booking/BookingPricingTable";
import ServiceActivity from "../components/sections/booking/ServiceActivity";

import ComplaintButton from "../components/sections/complaint/ComplaintButton";
import ComplaintList from "../components/sections/complaint/ComplaintList";

import {
  getBillingApartmentsForCurrentUser,
  getUtilitiesInvoicesByApartmentId,
  getMandatoryServices,
  getServiceInvoices,
  getBookingsByAccountId
} from "../services/myHomeService";
import { getCurrentUser } from "../services/authService";
import { getServices, getBookingVisibleServices } from "../services/serviceService";

import {
  MONTH_FORMATTER,
  formatCurrency,
  formatDate,
  buildUtilityBills,
  buildServiceBillFromBooking
} from "../utils/billingUtils";

import "../styles/billing.css";

export default function BillingPage() {
  const [accountId, setAccountId] = useState(null);
  const [selection, setSelection] = useState({ type: "apartment", id: "" });
  const [monthKey, setMonthKey] = useState("all");
  const [apartments, setApartments] = useState([]);
  const [utilityBills, setUtilityBills] = useState([]);
  const [serviceBills, setServiceBills] = useState([]);
  const [allServices, setAllServices] = useState([]); // All bookable services (for Unit Rates)
  const [mandatoryRates, setMandatoryRates] = useState({
    electricity: null,
    water: null,
    management: null
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Service-specific filters
  const [serviceMonthKey, setServiceMonthKey] = useState("all");
  const [serviceFilterName, setServiceFilterName] = useState("all");
  const [serviceStatusFilter, setServiceStatusFilter] = useState("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  const location = useLocation();
  const navigate = useNavigate();
  const isVerifying = useRef(false);

  useEffect(() => {
    // Check for payment success toast in session storage after a reload
    const paymentToast = sessionStorage.getItem("paymentSuccessToast");
    if (paymentToast === "true") {
      toast.success("Payment successful!", {
        position: "top-right",
        style: {
          marginTop: "80px",
          backgroundColor: "#e8f5e9", // Elegant green background
          color: "#2e7d32",          // Deep green text
          fontWeight: "600",
          border: "1px solid #c8e6c9"
        }
      });
      sessionStorage.removeItem("paymentSuccessToast");
    }

    // Process VNPay return parameters
    const params = new URLSearchParams(location.search);
    const vnp_ResponseCode = params.get("vnp_ResponseCode");

    if (vnp_ResponseCode && !isVerifying.current) {
      isVerifying.current = true;
      const verifyPayment = async () => {
        try {
          const res = await api.get(`/payment/vnpay_return${window.location.search}`);
          if (res.data.code === 0 || res.data.code === 4) {
            if (res.data.code === 0) {
              toast.success("Payment successful!", {
                position: "top-right",
                autoClose: 5000,
                style: {
                  marginTop: "80px",
                  backgroundColor: "#e8f5e9", // Elegant green background
                  color: "#2e7d32",          // Deep green text
                  fontWeight: "600",
                  border: "1px solid #c8e6c9"
                }
              });
            }
            // Clean URL query without reloading the page
            navigate(location.pathname, { replace: true });
            // Refresh bills data
            setRefreshTrigger(prev => prev + 1);
          } else {
            toast.error("Payment failed or an error occurred.");
            navigate(location.pathname, { replace: true });
          }
        } catch (err) {
          console.error("Payment verification error", err);
          toast.error("An error occurred while validating the transaction.");
          navigate(location.pathname, { replace: true });
        } finally {
          // Release lock after a short delay in case of component remount
          setTimeout(() => { isVerifying.current = false; }, 1000);
        }
      };
      verifyPayment();
    }
  }, [location, navigate]);

  const onToggleBill = (billId, categories) => {
    setSelectedIds((prev) => {
      const allSubIds = categories.map(cat => `${billId}:${cat}`);
      const isFull = allSubIds.every(id => prev.includes(id));

      if (isFull) {
        return prev.filter(id => !allSubIds.includes(id));
      } else {
        const next = [...prev];
        allSubIds.forEach(id => {
          if (!next.includes(id)) next.push(id);
        });
        return next;
      }
    });
  };

  const onToggleSubItem = (billId, category) => {
    setSelectedIds((prev) => {
      const key = `${billId}:${category}`;
      return prev.includes(key) ? prev.filter(id => id !== key) : [...prev, key];
    });
  };

  const onToggleAllBookings = () => {
    const unpaidIds = payableBills
      .filter(bill => bill.source === "service")
      .map(bill => `${bill.id}:service`);

    if (unpaidIds.length === 0) return;

    const allCurrentlySelected = unpaidIds.every(id => selectedIds.includes(id));

    if (allCurrentlySelected) {
      setSelectedIds(prev => prev.filter(id => !unpaidIds.includes(id)));
    } else {
      setSelectedIds(prev => {
        const next = [...prev];
        unpaidIds.forEach(id => {
          if (!next.includes(id)) next.push(id);
        });
        return next;
      });
    }
  };

  const selectedApartmentLabel = useMemo(() => {
    if (selection.type === "service") return "Service Bookings";
    if (selection.type === "support") return "Support Center";
    const found = apartments.find(a => String(a.id) === String(selection.id));
    return found ? found.label : "Select Apartment";
  }, [apartments, selection]);

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

        const user = await getCurrentUser();
        // Defensive check: Try multiple potential ID fields often returned by /auth/accounts/me
        const actualAccountId = user?.id || user?.accountId || user?.results?.id;

        if (actualAccountId) {
          setAccountId(actualAccountId);
        }
        setApartments(normalizedApartments);
        setSelection((current) => {
          if (current.type === "apartment" && normalizedApartments.some((item) => item.id === current.id)) {
            return current;
          }
          if (current.type === "service") return current;
          return { type: "apartment", id: normalizedApartments[0]?.id || "" };
        });
      } catch (error) {
        console.error(error);
        if (active) {
          toast.error("Failed to load billing data");
          setAccountId(null);
          setApartments([]);
        }
      }
    };

    loadApartments();

    return () => {
      active = false;
    };
  }, []);

  /* Load Account-Wide Services & Bookings */
  useEffect(() => {
    let active = true;
    if (!accountId) return;

    const loadAccountServices = async () => {
      try {
        const [serviceInvoiceResponse, bookings] = await Promise.all([
          getServiceInvoices(),
          getBookingsByAccountId(accountId),
        ]);

        if (!active) return;

        const allServiceInvoices = serviceInvoiceResponse?.items || serviceInvoiceResponse || [];

        // Filter Service Invoices to only include those belonging to the current user
        const serviceInvoices = allServiceInvoices.filter(inv => {
          const booking = inv.bookingService;
          if (!booking) return false;

          const bookingAccountId = booking.account?.id || booking.accountId || booking.account;
          return String(bookingAccountId) === String(accountId);
        });

        const builtServiceBills = [
          ...serviceInvoices.map(inv => buildServiceBillFromBooking(inv.bookingService, inv)),
          ...bookings
            .filter(b => {
              if (!b || !b.id) return false;
              // Check if we already have an invoice for this booking ID
              return !serviceInvoices.some(inv => {
                const invBookingId = inv.bookingService?.id || inv.bookingServiceId || inv.bookingId;
                return String(invBookingId) === String(b.id);
              });
            })
            .map(b => buildServiceBillFromBooking(b, null))
        ].sort((a, b) => {
          const dateA = a.usageDate instanceof Date ? a.usageDate.getTime() : 0;
          const dateB = b.usageDate instanceof Date ? b.usageDate.getTime() : 0;
          return dateB - dateA;
        });

        if (active) {
          setServiceBills(builtServiceBills);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
        if (active) setServiceBills([]);
      }
    };

    loadAccountServices();
    return () => { active = false; };
  }, [accountId, refreshTrigger]);

  /* Load All Bookable Services list (for Unit Rates Table) */
  useEffect(() => {
    let active = true;
    const loadPricingList = async () => {
      try {
        const [svs, mandatory] = await Promise.all([
          getBookingVisibleServices(),
          getMandatoryServices()
        ]);
        if (!active) return;
        setAllServices(svs || []);

        // Build Utility Rates Mapping
        const mappedRates = (mandatory || []).reduce(
          (acc, service) => {
            if (service.serviceCode === "ELEC_01") acc.electricity = service;
            if (service.serviceCode === "WAT_01") acc.water = service;
            if (service.serviceCode === "MNG_FEE") acc.management = service;
            return acc;
          },
          { electricity: null, water: null, management: null }
        );
        setMandatoryRates(mappedRates);
      } catch (error) {
        console.error("Failed to load service pricing:", error);
      }
    };
    loadPricingList();
    return () => { active = false; };
  }, []);

  /* Load Apartment-Specific Utilities (Only if an apartment is selected) */
  useEffect(() => {
    let active = true;
    if (selection.type !== "apartment" || !selection.id || !accountId) {
      setUtilityBills([]);
      return;
    }

    const loadApartmentUtilities = async () => {
      setLoading(true);
      try {
        const utilityInvoices = await getUtilitiesInvoicesByApartmentId(selection.id);

        if (!active) return;

        const builtUtilityBills = buildUtilityBills(utilityInvoices, mandatoryRates);
        setUtilityBills(builtUtilityBills);
      } catch (error) {
        console.error("Failed to load apartment utilities:", error);
        if (active) setUtilityBills([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadApartmentUtilities();
    return () => { active = false; };
  }, [accountId, selection.id, refreshTrigger]);

  // Sequential consumption history synthesis
  const utilityIndicesMap = (utilityBills, type) => {
    if (type !== "apartment") return {};

    const sortedHistory = [...utilityBills]
      .filter(b => b.source === "utility")
      .sort((a, b) => {
        const dateA = a.usageDate ? new Date(a.usageDate).getTime() : 0;
        const dateB = b.usageDate ? new Date(b.usageDate).getTime() : 0;
        return dateA - dateB;
      });

    let runningElec = 0;
    let runningWater = 0;
    const historyMap = {};

    sortedHistory.forEach((bill) => {
      const elecUsed = Number(bill.utilityDetails?.electricity?.quantity ?? 0);
      const waterUsed = Number(bill.utilityDetails?.water?.quantity ?? 0);

      const prevElec = runningElec;
      const currElec = runningElec + elecUsed;
      const prevWater = runningWater;
      const currWater = runningWater + waterUsed;

      historyMap[bill.id] = {
        electricity: { prev: prevElec, curr: currElec },
        water: { prev: prevWater, curr: currWater }
      };

      runningElec = currElec;
      runningWater = currWater;
    });

    return historyMap;
  };

  const synthesizedHistory = useMemo(() => utilityIndicesMap(utilityBills, selection.type), [utilityBills, selection.type]);

  // Combine all bills for sorting and universal lists
  const bills = useMemo(() => {
    return [...utilityBills, ...serviceBills].sort((a, b) => {
      const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return timeB - timeA;
    });
  }, [utilityBills, serviceBills]);

  // Enrich bills with synthesized readings for the Detail/Table view
  const enrichedBills = useMemo(() => {
    return bills.map(bill => {
      if (bill.source !== "utility") return bill;
      const synth = synthesizedHistory[bill.id];
      if (!synth) return bill;

      return {
        ...bill,
        utilityDetails: {
          ...bill.utilityDetails,
          electricity: {
            ...bill.utilityDetails.electricity,
            previousReading: synth.electricity.prev,
            currentReading: synth.electricity.curr
          },
          water: {
            ...bill.utilityDetails.water,
            previousReading: synth.water.prev,
            currentReading: synth.water.curr
          }
        }
      };
    });
  }, [bills, synthesizedHistory]);

  const monthOptions = useMemo(() => {
    const optionMap = new Map();

    enrichedBills.forEach((bill) => {
      if (!bill.dueDate || bill.monthKey === "unknown") return;
      const dateObj = new Date(bill.dueDate);
      const label = MONTH_FORMATTER.format(dateObj);

      if (!optionMap.has(label)) {
        optionMap.set(label, {
          value: label,
          label: label,
          sortAt: dateObj.getTime(), // Store timestamp for sorting
        });
      }
    });

    return Array.from(optionMap.values()).sort((a, b) => b.sortAt - a.sortAt);
  }, [enrichedBills]);


  // Months available for Service Booking filtration
  const serviceMonthOptions = useMemo(() => {
    const optionMap = new Map();
    serviceBills.forEach((bill) => {
      const dateSource = bill.usageDate || bill.dueDate || bill.bookFrom || bill.createdAt;
      if (!dateSource) return;

      const dateObj = new Date(dateSource);
      if (isNaN(dateObj)) return;

      const label = MONTH_FORMATTER.format(dateObj);
      if (!optionMap.has(label)) {
        optionMap.set(label, { value: label, label: label, sortAt: dateObj.getTime() });
      }
    });
    return Array.from(optionMap.values()).sort((a, b) => b.sortAt - a.sortAt);
  }, [serviceBills]);

  // Service Name options specifically for Service Booking filtration
  const serviceNameOptions = useMemo(() => {
    const nameSet = new Set();
    serviceBills.forEach((bill) => {
      const name = bill.name || bill.title;
      if (name) nameSet.add(name);
    });
    return Array.from(nameSet).sort();
  }, [serviceBills]);

  const filteredBills = useMemo(() => {
    if (selection.type === "service") {
      // Apply service-specific filtering (Category + Month)
      return serviceBills.filter((bill) => {
        const matchesName = serviceFilterName === "all" ||
          (bill.name === serviceFilterName || bill.title === serviceFilterName);

        let matchesMonth = true;
        if (serviceMonthKey !== "all") {
          const dateSource = bill.usageDate || bill.dueDate || bill.bookFrom || bill.createdAt;
          if (!dateSource) matchesMonth = false;
          else {
            const label = MONTH_FORMATTER.format(new Date(dateSource));
            matchesMonth = (label === serviceMonthKey);
          }
        }

        const matchesPaymentStatus = serviceStatusFilter === "all" || bill.paymentStatusKey === serviceStatusFilter;
        const matchesBookingStatus = bookingStatusFilter === "all" || bill.bookingStatusKey === bookingStatusFilter;

        return matchesName && matchesMonth && matchesPaymentStatus && matchesBookingStatus;
      });
    }

    // Default Apartment Filtration: Show only Utilities (Electricity, Water, Management)
    const apartmentOnlyBills = enrichedBills.filter(bill => bill.source === "utility");

    if (monthKey === "all") return apartmentOnlyBills;
    return apartmentOnlyBills.filter((bill) => {
      if (!bill.dueDate) return false;
      const label = MONTH_FORMATTER.format(new Date(bill.dueDate));
      return label === monthKey;
    });
  }, [enrichedBills, serviceBills, monthKey, serviceMonthKey, serviceFilterName, serviceStatusFilter, bookingStatusFilter, selection.type]);

  const payableBills = useMemo(
    () => filteredBills.filter((bill) => bill.statusKey === "unpaid" && bill.bookingStatusKey === "approved"),
    [filteredBills]
  );

  const payableBreakdown = useMemo(() => {
    return filteredBills.reduce(
      (acc, bill) => {
        let invoiceAmt = 0;
        if (selection.type === "apartment" && bill.source === "utility") {
          const eAmt = Number(bill.utilityDetails?.electricity?.amount ?? 0);
          const wAmt = Number(bill.utilityDetails?.water?.amount ?? 0);
          const mAmt = Number(bill.managementFee ?? 0);

          acc.electricity += eAmt;
          acc.water += wAmt;
          acc.management += mAmt;
          invoiceAmt = (eAmt + wAmt + mAmt);
          acc.total += invoiceAmt;
          acc.hasInvoices = true;
        } else if (selection.type === "service" && bill.source === "service") {
          invoiceAmt = Number(bill.amount ?? 0);
          acc.service += invoiceAmt;
          acc.total += invoiceAmt;
          acc.hasInvoices = true;
        }

        if (bill.statusKey !== "paid") {
          acc.allPaid = false;
          acc.unpaidTotal += invoiceAmt;
        }

        return acc;
      },
      { electricity: 0, water: 0, management: 0, service: 0, total: 0, unpaidTotal: 0, allPaid: true, hasInvoices: false }
    );
  }, [filteredBills, selection]);

  const payablePricingRows = useMemo(() => {
    const utilityRows = [];
    const serviceRows = [];

    if (selection.type === "apartment") {
      const utilityAccumulator = filteredBills.reduce(
        (acc, bill) => {
          if (bill.source !== "utility") return acc;

          const elec = bill.utilityDetails?.electricity;
          const wat = bill.utilityDetails?.water;
          const synthesized = synthesizedHistory[bill.id] || {
            electricity: { prev: 0, curr: 0 },
            water: { prev: 0, curr: 0 }
          };

          if (elec) {
            acc.electricity.usage += Number(elec.quantity ?? 0);
            acc.electricity.amount += Number(elec.amount ?? 0);
            acc.electricity.rate = Number(elec.unitPrice ?? 0) || acc.electricity.rate;
            acc.electricity.prev = (acc.electricity.prev === null)
              ? synthesized.electricity.prev
              : Math.min(acc.electricity.prev, synthesized.electricity.prev);
            acc.electricity.curr = Math.max(acc.electricity.curr, synthesized.electricity.curr);
            if (!acc.electricity.billIds.includes(bill.id) && bill.statusKey !== "paid") acc.electricity.billIds.push(bill.id);
          }

          if (wat) {
            acc.water.usage += Number(wat.quantity ?? 0);
            acc.water.amount += Number(wat.amount ?? 0);
            acc.water.rate = Number(wat.unitPrice ?? 0) || acc.water.rate;
            acc.water.prev = (acc.water.prev === null)
              ? synthesized.water.prev
              : Math.min(acc.water.prev, synthesized.water.prev);
            acc.water.curr = Math.max(acc.water.curr, synthesized.water.curr);
            if (!acc.water.billIds.includes(bill.id) && bill.statusKey !== "paid") acc.water.billIds.push(bill.id);
          }

          if (Number(bill.managementFee ?? 0) > 0) {
            acc.management.amount += Number(bill.managementFee ?? 0);
            if (!acc.management.billIds.includes(bill.id) && bill.statusKey !== "paid") acc.management.billIds.push(bill.id);
          }

          return acc;
        },
        {
          electricity: { usage: 0, amount: 0, rate: 0, prev: null, curr: 0, billIds: [] },
          water: { usage: 0, amount: 0, rate: 0, prev: null, curr: 0, billIds: [] },
          management: { amount: 0, billIds: [] }
        }
      );

      if (utilityAccumulator.electricity.amount > 0) {
        utilityRows.push({
          id: "payable-electricity",
          category: "ELECTRICITY",
          subLabel: `Prev: ${utilityAccumulator.electricity.prev?.toLocaleString() ?? 0} kWh | Curr: ${utilityAccumulator.electricity.curr?.toLocaleString() ?? 0} kWh`,
          unitPriceLabel: `${formatCurrency(utilityAccumulator.electricity.rate || mandatoryRates.electricity?.basePrice || 0)}/kWh`,
          quantityLabel: `${utilityAccumulator.electricity.usage.toLocaleString()} kWh`,
          amount: utilityAccumulator.electricity.amount,
          billIds: utilityAccumulator.electricity.billIds,
        });
      }

      if (utilityAccumulator.water.amount > 0) {
        utilityRows.push({
          id: "payable-water",
          category: "WATER",
          subLabel: `Prev: ${utilityAccumulator.water.prev?.toLocaleString() ?? 0} m3 | Curr: ${utilityAccumulator.water.curr?.toLocaleString() ?? 0} m3`,
          unitPriceLabel: `${formatCurrency(utilityAccumulator.water.rate || mandatoryRates.water?.basePrice || 0)}/m3`,
          quantityLabel: `${utilityAccumulator.water.usage.toLocaleString()} m3`,
          amount: utilityAccumulator.water.amount,
          billIds: utilityAccumulator.water.billIds,
        });
      }

      if (utilityAccumulator.management.amount > 0) {
        utilityRows.push({
          id: "payable-management",
          category: "MANAGEMENT FEE",
          subLabel: "Monthly fixed service charge",
          unitPriceLabel: "N/A",
          quantityLabel: "Fixed",
          amount: utilityAccumulator.management.amount,
          billIds: utilityAccumulator.management.billIds,
        });
      }
    }

    if (selection.type === "service") {
      filteredBills.forEach(bill => {
        if (bill.source === "service") {
          serviceRows.push({
            key: `payable-service-${bill.id}`,
            label: bill.title || "Booking Service",
            category: "service",
            description: bill.description || "Service request",
            unitPriceLabel: "N/A",
            quantityLabel: "Request",
            amount: bill.amount,
            billIds: [bill.id]
          });
        }
      });
    }

    return { utilities: utilityRows, services: serviceRows };
  }, [filteredBills, selection, formatCurrency, synthesizedHistory, mandatoryRates]);

  const categoryRates = useMemo(() => {
    const rows = [];

    if (mandatoryRates.electricity) {
      rows.push({
        key: "electricity",
        label: "Electricity",
        unitType: "KWH",
        unitPrice: mandatoryRates.electricity.basePrice || 0
      });
    }

    if (mandatoryRates.water) {
      rows.push({
        key: "water",
        label: "Water",
        unitType: "M³",
        unitPrice: mandatoryRates.water.basePrice || 0
      });
    }

    if (mandatoryRates.management) {
      rows.push({
        key: "management",
        label: "Management Fee",
        unitType: "FIXED",
        unitPrice: mandatoryRates.management.basePrice || 0
      });
    }

    return rows;
  }, [mandatoryRates]);

  const chartData = useMemo(() => {
    if (selection.type === "apartment") {
      // Standard Single-bar Trend (Utilities)
      const grouped = bills.filter(b => b.source === "utility").reduce((acc, bill) => {
        const dateObj = new Date(bill.dueDate);
        if (isNaN(dateObj)) return acc;

        const label = MONTH_FORMATTER.format(dateObj);
        const current = acc.get(label) || {
          name: label,
          Electricity: 0,
          Water: 0,
          "Management Fee": 0,
          _timestamp: dateObj.getTime()
        };

        if (bill.utilityDetails) {
          current.Electricity += Number(bill.utilityDetails.electricity?.amount || 0);
          current.Water += Number(bill.utilityDetails.water?.amount || 0);
          current["Management Fee"] += Number(bill.utilityDetails.management?.amount || 0);
        } else {
          // Fallback if details are missing but amount is present
          current["Management Fee"] += Number(bill.amount || 0);
        }

        acc.set(label, current);
        return acc;
      }, new Map());

      const sortedData = Array.from(grouped.values())
        .sort((a, b) => a._timestamp - b._timestamp)
        .map(({ _timestamp, ...rest }) => rest);

      return {
        type: 'billing',
        data: sortedData,
        categories: ["Electricity", "Water", "Management Fee"]
      };
    } else {
      // Granular Stacked-bar Trend (Service Bookings)
      const monthlyMap = {};
      const serviceSet = new Set();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      serviceBills.forEach(b => {
        // Only include paid services in the Expenditure Distribution chart
        if (b.paymentStatusKey !== "paid") return;

        const sourceDate = b.dueDate || b.usageDate || b.bookFrom || b.bookAt;
        const date = sourceDate ? new Date(sourceDate) : null;
        if (!date || isNaN(date.getTime())) return;

        const monthLabel = `${months[date.getMonth()]} ${date.getFullYear()}`;
        const serviceName = b.name || "Other Service";

        if (!monthlyMap[monthLabel]) {
          monthlyMap[monthLabel] = { name: monthLabel, _timestamp: date.getTime() };
        }

        monthlyMap[monthLabel][serviceName] = (monthlyMap[monthLabel][serviceName] || 0) + Number(b.amount || 0);
        serviceSet.add(serviceName);
      });

      const sortedData = Object.values(monthlyMap)
        .sort((a, b) => a._timestamp - b._timestamp)
        .map(item => {
          const { _timestamp, ...rest } = item;
          return rest;
        })
        .slice(-6);

      return { type: 'booking', data: sortedData, categories: Array.from(serviceSet) };
    }
  }, [selection.type, bills, serviceBills]);

  const historicalBills = useMemo(() => {
    const now = new Date();
    // Start of current month (e.g., April 1st 2026 00:00:00)
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return enrichedBills.filter(bill => {
      const billDate = bill.dueDate ? new Date(bill.dueDate) : null;
      // Show only invoices strictly before the current month
      const isHistorical = billDate && billDate < startOfCurrentMonth;
      if (!isHistorical) return false;

      // Filter by context: Apartments show 'utility', Service Bookings show 'service'
      if (selection.type === "apartment") return bill.source === "utility";
      if (selection.type === "service") return bill.source === "service";
      return true;
    }).sort((a, b) => {
      const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return timeB - timeA;
    });
  }, [enrichedBills, selection.type]);

  const tabs = useMemo(() => {
    if (selection.type === "service") {
      return [
        { id: "overview", label: "Service Overview", icon: <FaFileInvoiceDollar /> },
        { id: "bookings", label: "Service Bookings", icon: <FaCalendarCheck /> },
      ];
    }

    return [
      { id: "overview", label: "Financial Overview", icon: <FaFileInvoiceDollar /> },
      { id: "billing", label: "My Home Billing", icon: <FaHome /> },
      { id: "history", label: "Payment History", icon: <FaHistory /> },
    ];
  }, [selection.type]);

  const [activeTab, setActiveTab] = useState("overview");

  // Ensure activeTab resets correctly when context switches
  useEffect(() => {
    if (selection.type === "service" && (activeTab === "billing" || activeTab === "activity")) {
      setActiveTab("bookings");
    } else if (selection.type === "apartment" && activeTab === "bookings") {
      setActiveTab("overview");
    }
  }, [selection.type, activeTab]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const totalSelected = useMemo(() => {
    return payableBills.reduce((acc, bill) => {
      let billSum = 0;
      if (bill.source === "service") {
        if (selectedIds.includes(`${bill.id}:service`)) billSum += bill.amount;
      } else {
        if (selectedIds.includes(`${bill.id}:electricity`)) billSum += (bill.utilityDetails?.electricity?.amount || 0);
        if (selectedIds.includes(`${bill.id}:water`)) billSum += (bill.utilityDetails?.water?.amount || 0);
        if (selectedIds.includes(`${bill.id}:management`)) billSum += (bill.managementFee || 0);
      }
      return acc + billSum;
    }, 0);
  }, [payableBills, selectedIds]);

  const handleServicePayment = async () => {
    try {
      const invoicesPayload = selectedIds
        .filter(id => id.endsWith(":service"))
        .map(id => {
          const match = String(id).match(/\d+/);
          if (!match) return null;
          const d = new Date();
          return {
            invoiceId: parseInt(match[0], 10),
            invoiceType: "SERVICES_INVOICE",
            invoiceMonth: d.getMonth() + 1,
            invoiceYear: d.getFullYear(),
          };
        })
        .filter(Boolean);

      if (invoicesPayload.length === 0) {
        toast.warn("No valid invoices selected.");
        return;
      }

      const res = await api.post("/payment/create", {
        orderInfo: `Fee payment - Service Bookings`,
        invoices: invoicesPayload
      });
      window.location.href = res.data.result.paymentUrl;
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to payment gateway.");
    }
  };

  return (
    <>
      <Navbar solid={true} />

      <div className="billing-page">
        <div className="billing-container">
          <PropertySidebar
            apartments={apartments}
            selectedSelection={selection}
            onSelect={setSelection}
          />

          <main className="billing-content">
            <header className="billing-banner">
              <div className="banner-overlay"></div>
              <div className="banner-content">
                <div className="banner-header">
                  <div className="banner-title-box">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Residential Dashboard
                    </motion.h1>
                    <p className="banner-subtitle">
                      Professional billing management for your properties.
                    </p>
                    {selection.type === 'support' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginTop: '20px' }}
                      >
                        <ComplaintButton onSuccess={() => { }} />
                      </motion.div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {selection.type === 'service' && (
                      <Link
                        to="/booking"
                        className="premium-action-btn"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 28px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                          boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '15px',
                          fontWeight: '700',
                          letterSpacing: '0.03em',
                          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(217, 119, 6, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.2)';
                        }}
                      >
                        <FaCalendarPlus style={{ fontSize: '18px' }} />
                        <span>New Booking</span>
                      </Link>
                    )}

                    {selection.type !== 'service' && (
                      <div className="banner-badge">
                        {selection.type === 'support' ? (
                          <FaExclamationCircle style={{ marginRight: "8px" }} />
                        ) : (
                          <FaHome style={{ marginRight: "8px" }} />
                        )}
                        {selectedApartmentLabel}
                      </div>
                    )}
                  </div>
                </div>

                {selection.type !== 'support' && (
                  <nav className="billing-tabs header-tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {tab.icon} {tab.label}
                        </span>
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="tab-indicator"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            </header>

            <AnimatePresence mode="wait">
              {selection.type === "support" ? (
                <motion.div
                  key="support-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="support-container"
                >
                  <div className="billing-panel" style={{ marginTop: '24px' }}>
                    <ComplaintList />
                  </div>
                </motion.div>
              ) : (activeTab === "billing" || activeTab === "bookings") && selection.type === "service" ? (
                <motion.div
                  key="service-bookings-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="billing-panel"
                >
                  <div className="billing-panel-header" style={{
                    marginBottom: "30px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #f1f5f9",
                    alignItems: "center"
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 className="section-title" style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                        Service Bookings
                      </h3>
                      <p className="billing-panel-subtitle" style={{ margin: "4px 0 0", color: "#64748b" }}>
                        Manage your requests and track booking expenditures.
                      </p>
                    </div>

                    {/* Consolidated Filters Row */}
                    <div className="service-filter-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Service Category
                        </label>
                        <select
                          className="premium-select"
                          value={serviceFilterName}
                          onChange={(e) => setServiceFilterName(e.target.value)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            fontSize: '13px',
                            fontWeight: '600',
                            backgroundColor: '#f8fafc',
                            color: '#334155',
                            cursor: 'pointer',
                            minWidth: '150px'
                          }}
                        >
                          <option value="all">All Services</option>
                          {serviceNameOptions.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Period
                        </label>
                        <select
                          className="premium-select"
                          value={serviceMonthKey}
                          onChange={(e) => setServiceMonthKey(e.target.value)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            fontSize: '13px',
                            fontWeight: '600',
                            backgroundColor: '#f8fafc',
                            color: '#334155',
                            cursor: 'pointer',
                            minWidth: '130px'
                          }}
                        >
                          <option value="all">All Months</option>
                          {serviceMonthOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Booking Status
                        </label>
                        <select
                          className="premium-select"
                          value={bookingStatusFilter}
                          onChange={(e) => setBookingStatusFilter(e.target.value)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            fontSize: '13px',
                            fontWeight: '600',
                            backgroundColor: '#f8fafc',
                            color: '#334155',
                            cursor: 'pointer',
                            minWidth: '130px'
                          }}
                        >
                          <option value="all">All Booking</option>
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="denied">Rejected</option>
                        </select>
                      </div>

                      <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Payment Status
                        </label>
                        <select
                          className="premium-select"
                          value={serviceStatusFilter}
                          onChange={(e) => setServiceStatusFilter(e.target.value)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            fontSize: '13px',
                            fontWeight: '600',
                            backgroundColor: '#f8fafc',
                            color: '#334155',
                            cursor: 'pointer',
                            minWidth: '120px'
                          }}
                        >
                          <option value="all">All Status</option>
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Action Bar */}
                  {totalSelected > 0 && (
                    <motion.div
                      className="modern-payment-summary full-row"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ margin: "0 0 24px 0", background: '#fdfbf7' }}
                    >
                      <div className="payment-summary-content">
                        <span className="total-label">Selected Booking Total:</span>
                        <span className="total-value">
                          {formatCurrency(totalSelected)}
                        </span>
                      </div>
                      <button
                        className="pay-selected-btn premium-btn"
                        onClick={handleServicePayment}
                      >
                        Pay Selected Items
                      </button>
                    </motion.div>
                  )}

                  <ServiceActivity
                    bookings={filteredBills}
                    selectedIds={selectedIds}
                    onToggleBill={onToggleBill}
                    onToggleAll={onToggleAllBookings}
                  />
                </motion.div>
              ) : activeTab === "billing" && selection.type === "apartment" ? (
                <motion.div
                  key="apartment-billing-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="billing-content"
                >
                  <BillingPayableBreakdown
                    totals={payableBreakdown}
                    pricingRows={payablePricingRows}
                    formatCurrency={formatCurrency}
                    apartmentLabel={selectedApartmentLabel}
                    monthKey={monthKey}
                    setMonthKey={setMonthKey}
                    months={monthOptions}
                  />
                </motion.div>
              ) : activeTab === "history" && selection.type === "apartment" ? (
                <motion.div
                  key="history-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="billing-panel"
                >
                  <h3 className="refined-section-title">Payment History</h3>
                  <PaymentHistory
                    payments={historicalBills}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                  />
                </motion.div>
              ) : activeTab === "pricing" && selection.type === "service" ? (
                <motion.div
                  key="pricing-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="billing-panel"
                >
                  <h3 className="refined-section-title">Service Unit Rates</h3>
                  <BookingPricingTable rates={allServices} />
                </motion.div>
              ) : activeTab === "overview" ? (
                <motion.div
                  key="overview-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="billing-content"
                >
                  <div className="billing-overview-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="billing-panel full-width">
                      <h3 className="refined-section-title">
                        {selection.type === 'service' ? "Expenditure Distribution" : "Monthly Trend"}
                      </h3>
                      {selection.type === 'service' ? (
                        <BookingChart
                          data={chartData.data || []}
                          categories={chartData.categories || []}
                          formatCurrency={formatCurrency}
                        />
                      ) : (
                        <BillingChart
                          data={chartData.data || []}
                          categories={chartData.categories || []}
                          formatCurrency={formatCurrency}
                        />
                      )}
                    </div>

                    <div className="billing-panel full-width">
                      <h3 className="refined-section-title">Service Unit Rates</h3>
                      {selection.type === 'service' ? (
                        <BookingPricingTable
                          rates={allServices}
                        />
                      ) : (
                        <BillingPricingTable
                          rates={categoryRates}
                          formatCurrency={formatCurrency}
                        />
                      )}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <div />
              )}
            </AnimatePresence>
          </main>
        </div>
        {/* Floating Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              className="back-to-top"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Back to top"
            >
              <FaArrowUp />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

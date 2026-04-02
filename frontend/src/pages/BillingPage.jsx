import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileInvoiceDollar,
  FaExclamationCircle,
  FaHome,
  FaWallet,
  FaHistory
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
import { getServices } from "../services/serviceService";

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
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggleBill = (billId, categories) => {
    setSelectedIds(prev => {
      const billKeys = categories.map(cat => `${billId}:${cat}`);
      const allSelected = billKeys.every(key => prev.includes(key));
      if (allSelected) {
        return prev.filter(id => !billKeys.includes(id));
      } else {
        return [...new Set([...prev, ...billKeys])];
      }
    });
  };

  const handleToggleSubItem = (billId, category) => {
    const key = `${billId}:${category}`;
    setSelectedIds(prev => 
      prev.includes(key) ? prev.filter(id => id !== key) : [...prev, key]
    );
  };

  const selectedApartmentLabel = useMemo(() => {
    if (selection.type === "service") return "Service Bookings";
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

        setAccountId(account.id);
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

        const serviceInvoices = serviceInvoiceResponse?.items || [];
        const builtServiceBills = [
          ...serviceInvoices.map(inv => buildServiceBillFromBooking(inv.bookingService, inv)),
          ...bookings
            .filter(b => !serviceInvoices.some(inv => inv.bookingService?.id === b.id))
            .map(b => buildServiceBillFromBooking(b, null))
        ];

        setServiceBills(builtServiceBills);
      } catch (error) {
        console.error("Failed to load services:", error);
        if (active) setServiceBills([]);
      }
    };

    loadAccountServices();
    return () => { active = false; };
  }, [accountId]);

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
        const [utilityInvoices, mandatoryServices] = await Promise.all([
          getUtilitiesInvoicesByApartmentId(selection.id),
          getMandatoryServices(),
        ]);

        if (!active) return;

        const utilityRates = mandatoryServices.reduce(
          (acc, service) => {
            if (service.serviceCode === "ELEC_01") acc.electricity = service;
            if (service.serviceCode === "WAT_01") acc.water = service;
            if (service.serviceCode === "MNG_FEE") acc.management = service;
            return acc;
          },
          { electricity: null, water: null, management: null }
        );

        const builtUtilityBills = buildUtilityBills(utilityInvoices, utilityRates);
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
  }, [accountId, selection.id]);

  // Combine all bills for sorting and universal lists
  const bills = useMemo(() => {
    return [...utilityBills, ...serviceBills].sort((a, b) => {
      const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return timeB - timeA;
    });
  }, [utilityBills, serviceBills]);

  const monthOptions = useMemo(() => {
    const optionMap = new Map();

    bills.forEach((bill) => {
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
    return bills.filter((bill) => {
      if (!bill.dueDate) return false;
      const label = MONTH_FORMATTER.format(new Date(bill.dueDate));
      return label === monthKey;
    });
  }, [bills, monthKey]);

  const payableBills = useMemo(
    () => filteredBills.filter((bill) => bill.statusKey !== "paid"),
    [filteredBills]
  );

  const payableBreakdown = useMemo(() => {
    return filteredBills.reduce(
      (acc, bill) => {
        if (bill.statusKey === "paid") return acc;

        // Filter by selection context
        if (selection.type === "apartment" && bill.source === "utility") {
           const eAmt = Number(bill.utilityDetails?.electricity?.amount ?? 0);
           const wAmt = Number(bill.utilityDetails?.water?.amount ?? 0);
           const mAmt = Number(bill.managementFee ?? 0);
           
           acc.electricity += eAmt;
           acc.water += wAmt;
           acc.management += mAmt;
           acc.total += (eAmt + wAmt + mAmt);
        } else if (selection.type === "service" && bill.source === "service") {
           acc.service += Number(bill.amount ?? 0);
           acc.total += Number(bill.amount ?? 0);
        }

        return acc;
      },
      { electricity: 0, water: 0, management: 0, service: 0, total: 0 }
    );
  }, [filteredBills, selection]);

  const payablePricingRows = useMemo(() => {
    const utilityRows = [];
    const serviceRows = [];

    if (selection.type === "apartment") {
      const utilityAccumulator = filteredBills.reduce(
        (acc, bill) => {
          if (bill.statusKey === "paid" || bill.source !== "utility") return acc;

          const elec = bill.utilityDetails?.electricity;
          const wat = bill.utilityDetails?.water;

          if (elec) {
            acc.electricity.usage += Number(elec.usage ?? 0);
            acc.electricity.amount += Number(elec.amount ?? 0);
            acc.electricity.rate = Number(elec.rate ?? 0) || acc.electricity.rate;
            acc.electricity.prev = (acc.electricity.prev === null) 
              ? Number(elec.previousReading ?? 0) 
              : Math.min(acc.electricity.prev, Number(elec.previousReading ?? 0));
            acc.electricity.curr = Math.max(acc.electricity.curr, Number(elec.currentReading ?? 0));
            if (!acc.electricity.billIds.includes(bill.id)) acc.electricity.billIds.push(bill.id);
          }

          if (wat) {
            acc.water.usage += Number(wat.usage ?? 0);
            acc.water.amount += Number(wat.amount ?? 0);
            acc.water.rate = Number(wat.rate ?? 0) || acc.water.rate;
            acc.water.prev = (acc.water.prev === null) 
              ? Number(wat.previousReading ?? 0) 
              : Math.min(acc.water.prev, Number(wat.previousReading ?? 0));
            acc.water.curr = Math.max(acc.water.curr, Number(wat.currentReading ?? 0));
            if (!acc.water.billIds.includes(bill.id)) acc.water.billIds.push(bill.id);
          }

          if (Number(bill.managementFee ?? 0) > 0) {
            acc.management.amount += Number(bill.managementFee ?? 0);
            if (!acc.management.billIds.includes(bill.id)) acc.management.billIds.push(bill.id);
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
          subLabel: `Prev: ${utilityAccumulator.electricity.prev?.toLocaleString() ?? 0} kWh | Curr: ${utilityAccumulator.electricity.curr?.toLocaleString()} kWh`,
          unitPriceLabel: `${formatCurrency(utilityAccumulator.electricity.rate)}/kWh`,
          quantityLabel: `${utilityAccumulator.electricity.usage.toLocaleString()} kWh`,
          amount: utilityAccumulator.electricity.amount,
          billIds: utilityAccumulator.electricity.billIds,
        });
      }

      if (utilityAccumulator.water.amount > 0) {
        utilityRows.push({
          id: "payable-water",
          category: "WATER",
          subLabel: `Prev: ${utilityAccumulator.water.prev?.toLocaleString() ?? 0} m3 | Curr: ${utilityAccumulator.water.curr?.toLocaleString()} m3`,
          unitPriceLabel: `${formatCurrency(utilityAccumulator.water.rate)}/m3`,
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
        if (bill.statusKey !== "paid" && bill.source === "service") {
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
  }, [filteredBills, selection, formatCurrency]);

  const categoryRates = useMemo(() => {
    const rows = [];
    const seen = new Set();

    bills.forEach(bill => {
      if (bill.utilityDetails) {
        Object.entries(bill.utilityDetails).forEach(([key, details]) => {
          if (!seen.has(key)) {
            seen.add(key);
            rows.push({
              key,
              label: details.label,
              unitType: details.unit,
              unitPrice: details.rate
            });
          }
        });
      }
    });

    return rows;
  }, [bills]);

  const chartData = useMemo(() => {
    const grouped = bills.reduce((acc, bill) => {
      const dateObj = new Date(bill.dueDate);
      if (isNaN(dateObj)) return acc;

      const label = MONTH_FORMATTER.format(dateObj);
      const current = acc.get(label) ?? 0;
      acc.set(label, current + (bill.amount || 0));
      return acc;
    }, new Map());

    return Array.from(grouped.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));
  }, [bills]);

  const payments = useMemo(
    () =>
      bills
        .filter((bill) => bill.statusKey === "paid")
        .map((bill) => ({
          id: bill.id,
          date: bill.dueDate,
          amount: bill.amount,
          method: bill.source === "utility" ? "Utility Payment" : "Service Payment",
        })),
    [bills]
  );

  const tabs = [
    { id: "overview", label: "Financial Overview", icon: <FaFileInvoiceDollar /> },
    { id: "billing", label: "My Home Billing", icon: <FaWallet /> },
    { id: "support", label: "Resident Support", icon: <FaExclamationCircle /> },
  ];

  const [activeTab, setActiveTab] = useState("billing");

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
                  </div>
                  <div className="banner-badge">
                    <FaHome style={{ marginRight: "8px" }} />
                    {selectedApartmentLabel}
                  </div>
                </div>
              </div>
            </header>

            <nav className="billing-tabs">
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

            <AnimatePresence mode="wait">
              {activeTab === "billing" ? (
                <motion.div
                  key="billing-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="billing-content"
                >

                  {/* APARTMENT BILLING VIEW (PROPERTY CONTEXT) */}
                  {selection.type === "apartment" && (
                    <motion.div
                      key="apartment-billing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
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
                  )}

                  {/* SERVICE BOOKING VIEW (PERSONAL SERVICE CONTEXT) */}
                  {selection.type === "service" && (
                    <motion.div
                      key="service-billing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="billing-panel"
                    >
                      <div className="billing-panel-header">
                        <div>
                          <h3 className="section-title">Service Management</h3>
                          <p className="billing-panel-subtitle">Manage and pay for your personal service bookings.</p>
                        </div>
                      </div>
                      <BillingTable
                        bills={payableBills}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        loading={loading}
                        selectedIds={selectedIds}
                        onToggleBill={handleToggleBill}
                        onToggleSubItem={handleToggleSubItem}
                        totalSelected={selectedIds.length}
                      />
                    </motion.div>
                  )}

                </motion.div>
              ) : activeTab === "overview" ? (
                <motion.div
                  key="overview-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="billing-content"
                >
                  <div className="summary-row">
                    <div className="billing-panel">
                      <h3 className="section-title" style={{ marginBottom: "20px" }}>Monthly Trend</h3>
                      <BillingChart
                        data={chartData}
                        formatCurrency={formatCurrency}
                      />
                    </div>
                    <div className="billing-panel">
                      <h3 className="section-title" style={{ marginBottom: "20px" }}>Unit Rates</h3>
                      <BillingPricingTable
                        rates={categoryRates}
                        formatCurrency={formatCurrency}
                      />
                    </div>
                  </div>

                  <div className="billing-panel">
                    <h3 className="section-title" style={{ marginBottom: "20px" }}>Payment History</h3>
                    <PaymentHistory
                      payments={payments}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="support-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="billing-content"
                >
                  <div className="billing-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 className="section-title">Resident Support</h3>
                      <p className="billing-panel-subtitle">Report issues for {selectedApartmentLabel}.</p>
                    </div>
                    <ComplaintButton apartmentId={selection.id} />
                  </div>

                  <div className="billing-panel">
                    <h3 className="section-title" style={{ marginBottom: "20px" }}>Recent Reports</h3>
                    <ComplaintList apartmentId={selection.id} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

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
  getMandatoryServices
} from "../services/billingService"; // Unified service name mapping from fe-quanganh
import { getMyAccount } from "../services/profileService";
import { getServices } from "../services/serviceService";

import {
  MONTH_FORMATTER,
  formatCurrency,
  formatDate,
  buildUtilityBills,
} from "../utils/billingUtils";

import "../styles/billing.css";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "support"
  const [accountId, setAccountId] = useState(null);
  const [apartment, setApartment] = useState("");
  const [monthKey, setMonthKey] = useState("all");
  const [apartments, setApartments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedApartmentLabel = useMemo(() => {
    const found = apartments.find(a => String(a.id) === String(apartment));
    return found ? found.label : "Select Apartment";
  }, [apartments, apartment]);

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
          toast.error("Failed to load billing data");
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
        const [utilityInvoices, services, mandatoryServices] = await Promise.all([
          getUtilitiesInvoicesByApartmentId(apartment),
          getServices(),
          getMandatoryServices(),
        ]);

        if (!active) return;

        // Use mandatory services for rates as seen in fe-quanganh logic
        const utilityRates = mandatoryServices.reduce(
          (acc, service) => {
            if (service.serviceCode === "ELEC_01") acc.electricity = service;
            if (service.serviceCode === "WAT_01") acc.water = service;
            if (service.serviceCode === "MNG_FEE") acc.management = service;
            return acc;
          },
          { electricity: null, water: null, management: null }
        );

        const utilityBills = buildUtilityBills(utilityInvoices, utilityRates);
        const allBills = [...utilityBills].sort((a, b) => {
          const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return timeB - timeA;
        });

        setBills(allBills);
      } catch (error) {
        console.error(error);
        if (active) {
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
      .reduce((sum, bill) => sum + bill.amount + (bill.managementFee || 0), 0);

    const unpaidBills = filteredBills.filter(
      (bill) => bill.statusKey !== "paid"
    ).length;

    const paidThisMonth = filteredBills
      .filter((bill) => bill.statusKey === "paid")
      .reduce((sum, bill) => sum + bill.amount + (bill.managementFee || 0), 0);

    return {
      totalDue,
      unpaidBills,
      paidThisMonth,
    };
  }, [filteredBills]);

  const payableBills = useMemo(
    () => filteredBills.filter((bill) => bill.statusKey !== "paid"),
    [filteredBills]
  );

  const payableBreakdown = useMemo(() => {
    return filteredBills.reduce(
      (acc, bill) => {
        if (bill.statusKey === "paid") return acc;

        if (bill.source === "utility" && bill.utilityDetails) {
          acc.electricity += Number(bill.utilityDetails.electricity?.amount ?? 0);
          acc.water += Number(bill.utilityDetails.water?.amount ?? 0);
        }

        acc.total += Number(bill.amount ?? 0) + Number(bill.managementFee ?? 0);
        return acc;
      },
      { electricity: 0, water: 0, service: 0, total: 0 }
    );
  }, [filteredBills]);

  const payablePricingRows = useMemo(() => {
    const rows = [];
    const utilityAccumulator = filteredBills.reduce(
      (acc, bill) => {
        if (bill.statusKey === "paid" || bill.source !== "utility") return acc;

        acc.electricity.usage += Number(
          bill.utilityDetails?.electricity?.usage ?? 0
        );
        acc.electricity.amount += Number(
          bill.utilityDetails?.electricity?.amount ?? 0
        );
        acc.electricity.rate =
          Number(bill.utilityDetails?.electricity?.rate ?? 0) || acc.electricity.rate;

        acc.water.usage += Number(bill.utilityDetails?.water?.usage ?? 0);
        acc.water.amount += Number(bill.utilityDetails?.water?.amount ?? 0);
        acc.water.rate =
          Number(bill.utilityDetails?.water?.rate ?? 0) || acc.water.rate;

        return acc;
      },
      {
        electricity: { usage: 0, amount: 0, rate: 0 },
        water: { usage: 0, amount: 0, rate: 0 },
      }
    );

    if (utilityAccumulator.electricity.amount > 0) {
      rows.push({
        key: "payable-electricity",
        label: "Electricity",
        description: "Usage based charges",
        unitPriceLabel: `${formatCurrency(utilityAccumulator.electricity.rate)}/kWh`,
        quantityLabel: `${utilityAccumulator.electricity.usage.toLocaleString()} kWh`,
        amount: utilityAccumulator.electricity.amount,
      });
    }

    if (utilityAccumulator.water.amount > 0) {
      rows.push({
        key: "payable-water",
        label: "Water",
        description: "Usage based charges",
        unitPriceLabel: `${formatCurrency(utilityAccumulator.water.rate)}/m3`,
        quantityLabel: `${utilityAccumulator.water.usage.toLocaleString()} m3`,
        amount: utilityAccumulator.water.amount,
      });
    }

    return rows;
  }, [filteredBills]);

  const categoryRates = useMemo(() => {
    const rows = [];
    const seen = new Set();

    filteredBills.forEach(bill => {
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
  }, [filteredBills]);

  const chartData = useMemo(() => {
    const grouped = filteredBills.reduce((acc, bill) => {
      const label = bill.monthKey;
      const current = acc.get(label) ?? 0;
      acc.set(label, current + bill.amount);
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
          method: bill.source === "utility" ? "Utility Payment" : "Service Payment",
        })),
    [filteredBills]
  );

  const tabs = [
    { id: "overview", label: "Financial Overview", icon: <FaFileInvoiceDollar /> },
    { id: "support", label: "Resident Support", icon: <FaExclamationCircle /> },
  ];

  return (
    <>
      <Navbar solid={true} />

      <div className="billing-page">
        <div className="billing-container">
          <PropertySidebar
            apartments={apartments}
            selectedApartmentId={apartment}
            onSelectApartment={setApartment}
          />

          <main className="billing-content">
            {/* HERO BANNER */}
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
                    Apartment {selectedApartmentLabel}
                  </div>
                </div>
              </div>
            </header>

            {/* TAB SYSTEM */}
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
              {activeTab === "overview" ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="billing-content"
                >
                  <div className="billing-filter-bar">
                    <div className="section-title">Billing Records</div>
                    <BillingFilters
                      apartment={apartment}
                      setApartment={setApartment}
                      monthKey={monthKey}
                      setMonthKey={setMonthKey}
                      apartments={apartments}
                      months={monthOptions}
                    />
                  </div>

                  <BillingSummary
                    summary={summary}
                    formatCurrency={formatCurrency}
                  />

                  <BillingPayableBreakdown
                    totals={payableBreakdown}
                    pricingRows={payablePricingRows}
                    formatCurrency={formatCurrency}
                  />

                  <div className="billing-panel">
                    <div className="billing-panel-header">
                      <div>
                        <h3 className="section-title">Invoice List</h3>
                        <p className="billing-panel-subtitle">View your pending utility invoices.</p>
                      </div>
                    </div>
                    <BillingTable
                      bills={payableBills}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      loading={loading}
                    />
                  </div>

                  <div className="summary-row">
                    <div className="billing-panel" style={{ gridColumn: "span 2" }}>
                      <h3 className="section-title" style={{ marginBottom: "20px" }}>Spending Analysis</h3>
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
                  key="support"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="billing-content"
                >
                  <div className="billing-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 className="section-title">Resident Support</h3>
                      <p className="billing-panel-subtitle">Report issues or send feedback.</p>
                    </div>
                    <ComplaintButton />
                  </div>
                  
                  <div className="billing-panel">
                    <h3 className="section-title" style={{ marginBottom: "20px" }}>My Reports</h3>
                    <ComplaintList />
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

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

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
      category: "utility",
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

export default function BillingPage() {
  const [accountId, setAccountId] = useState(null);
  const [apartment, setApartment] = useState("");
  const [monthKey, setMonthKey] = useState("all");
  const [apartments, setApartments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatCurrency = (value) => CURRENCY_FORMATTER.format(Number(value || 0));

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
      if (!apartment || !accountId) {
        setBills([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [utilityInvoices, services] = await Promise.all([
          getUtilitiesInvoicesByApartmentId(apartment),
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

        acc.total += Number(bill.amount ?? 0);
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
        description: "Electricity charges from utility invoices",
        unitPriceLabel:
          utilityAccumulator.electricity.rate > 0
            ? `${formatCurrency(utilityAccumulator.electricity.rate)} / kWh`
            : "N/A",
        quantityLabel: `${utilityAccumulator.electricity.usage.toLocaleString(
          "vi-VN"
        )} kWh`,
        amount: utilityAccumulator.electricity.amount,
      });
    }

    if (utilityAccumulator.water.amount > 0) {
      rows.push({
        key: "payable-water",
        label: "Water",
        description: "Water charges from utility invoices",
        unitPriceLabel:
          utilityAccumulator.water.rate > 0
            ? `${formatCurrency(utilityAccumulator.water.rate)} / m3`
            : "N/A",
        quantityLabel: `${utilityAccumulator.water.usage.toLocaleString(
          "vi-VN"
        )} m3`,
        amount: utilityAccumulator.water.amount,
      });
    }

    return rows;
  }, [filteredBills]);

  const categoryRates = useMemo(() => {
    const rows = [];
    const seen = new Set();

    const appendRate = (service, fallbackLabel) => {
      const key = `${service?.serviceCode || fallbackLabel}-${service?.id || ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      rows.push({
        key,
        label: fallbackLabel || service?.title || "Unnamed category",
        serviceCode: service?.serviceCode || null,
        unitType: service?.unitType || null,
        unitPrice:
          service?.feePerUnit === null || service?.feePerUnit === undefined
            ? null
            : Number(service.feePerUnit),
      });
    };

    const electricityBill = filteredBills.find((bill) => bill.utilityDetails);
    if (electricityBill?.utilityDetails?.electricity) {
      appendRate(
        {
          id: "electricity",
          serviceCode: "ELEC_01",
          unitType: electricityBill.utilityDetails.electricity.unit,
          feePerUnit: electricityBill.utilityDetails.electricity.rate,
        },
        "Electricity"
      );
    }

    if (electricityBill?.utilityDetails?.water) {
      appendRate(
        {
          id: "water",
          serviceCode: "WAT_01",
          unitType: electricityBill.utilityDetails.water.unit,
          feePerUnit: electricityBill.utilityDetails.water.rate,
        },
        "Water"
      );
    }

    return rows;
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
          method: "Utilities Invoice",
        })),
    [filteredBills]
  );

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

            <BillingSummary
              summary={summary}
              formatCurrency={formatCurrency}
            />

            <BillingPayableBreakdown
              totals={payableBreakdown}
              pricingRows={payablePricingRows}
              formatCurrency={formatCurrency}
            />

            <BillingTable
              bills={payableBills}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              loading={loading}
            />

            <BillingChart
              data={chartData}
              formatCurrency={formatCurrency}
            />

            <BillingPricingTable
              rates={categoryRates}
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

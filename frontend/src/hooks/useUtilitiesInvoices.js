import { useState, useEffect, useMemo } from "react";
import {
  getAllUtilitiesInvoices,
  getAllContracts,
  getAccounts,
  getResidents,
  getMandatoryServices,
  normalizeInvoices,
} from "../services/utilitiesInvoiceService";
import { paginateItems } from "../components/sections/manager/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Trả về tháng trước dạng { year, month } (1-indexed) */
export const getPreviousMonth = () => {
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();
  return { year, month };
};

const isLastMonth = (inv, prevMonth, prevYear) => {
  return (
    Number(inv.billingYear) === prevYear && Number(inv.billingMonth) === prevMonth
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

/**
 * Hook quản lý toàn bộ state cho trang Utilities Invoice:
 * - Fetch & normalize data từ backend
 * - Filter (tầng, phòng, trạng thái, tháng, năm) + Search (tên, SĐT)
 * - Quản lý Tabs (Last Month / All Month)
 * - Tính toán thống kê (Unpaid, Paid)
 * - Pagination & Modal
 */
const useUtilitiesInvoices = () => {
  // ── Data state ─────────────────────────────────────────────────────────────
  const [allInvoices, setAllInvoices] = useState([]);
  const [mandatoryServices, setMandatoryServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Tabs state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("lastMonth"); // "lastMonth" | "allMonth"

  // ── Filter & search state ──────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // ── Pagination state ───────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { year: prevYear, month: prevMonth } = getPreviousMonth();

  // ── Fetch all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [rawInvoices, accounts, residents, contracts, services] =
          await Promise.all([
            getAllUtilitiesInvoices(),
            getAccounts(),
            getResidents(),
            getAllContracts(),
            getMandatoryServices(),
          ]);

        setMandatoryServices(services);

        const normalized = normalizeInvoices({
          rawInvoices,
          accounts,
          residents,
          contracts,
        });

        setAllInvoices(normalized);
      } catch (err) {
        setError(
          err?.response?.data?.message ??
            "Could not load utilities invoices from backend."
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Tự động chuyển qua tab All Periods nếu tháng trước không có dữ liệu
  useEffect(() => {
    if (!isLoading && allInvoices.length > 0) {
      const lastMonthItems = allInvoices.filter(inv => isLastMonth(inv, prevMonth, prevYear));
      if (lastMonthItems.length === 0 && activeTab === "lastMonth") {
        setActiveTab("allMonth");
      }
    }
  }, [allInvoices, isLoading, prevMonth, prevYear]);

  // ── Stats Calculation (cho Last Month) ────────────────────────────────────
  const stats = useMemo(() => {
    const lastMonthItems = allInvoices.filter(inv => isLastMonth(inv, prevMonth, prevYear));
    const unpaid = lastMonthItems.filter(inv => Number(inv.status) === 0);
    const paid = lastMonthItems.filter(inv => Number(inv.status) === 1);

    return {
      unpaidCount: unpaid.length,
      unpaidAmount: unpaid.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0),
      paidAmount: paid.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0),
    };
  }, [allInvoices, prevMonth, prevYear]);

  // ── Filtering logic ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allInvoices;

    // 1. Tab-based filter
    if (activeTab === "lastMonth") {
      list = list.filter(inv => isLastMonth(inv, prevMonth, prevYear));
    } else {
      // All Month tab: áp dụng thêm bộ lọc Tháng/Năm
      if (selectedMonth !== "all") {
        list = list.filter(inv => Number(inv.billingMonth) === Number(selectedMonth));
      }
      if (selectedYear !== "all") {
        list = list.filter(inv => Number(inv.billingYear) === Number(selectedYear));
      }
    }

    // 2. Search & Common Filters (Floor, Room, Status)
    const kw = searchTerm.trim().toLowerCase();
    return list.filter((inv) => {
      if (filterFloor !== "all" && String(inv.floorNumber) !== filterFloor)
        return false;
      if (
        filterRoom &&
        !String(inv.apartmentLabel)
          .toLowerCase()
          .includes(filterRoom.toLowerCase())
      )
        return false;
      if (filterStatus !== "all" && String(inv.status) !== filterStatus)
        return false;
      if (kw) {
        const haystack = [inv.ownerName, inv.phone]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        if (!haystack.some((h) => h.includes(kw))) return false;
      }
      return true;
    });
  }, [allInvoices, activeTab, prevMonth, prevYear, searchTerm, filterFloor, filterRoom, filterStatus, selectedMonth, selectedYear]);

  // Reset pagination khi bộ lọc hoặc tab thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, filterFloor, filterRoom, filterStatus, selectedMonth, selectedYear]);

  // ── Options cho bộ lọc ──────────────────────────────────────────────────
  const floorOptions = useMemo(() => {
    const list = activeTab === "lastMonth" 
      ? allInvoices.filter(inv => isLastMonth(inv, prevMonth, prevYear))
      : allInvoices;
    return [
      ...new Set(
        list.map((i) => i.floorNumber).filter((f) => f !== "N/A" && f !== null)
      ),
    ].sort((a, b) => Number(a) - Number(b));
  }, [allInvoices, activeTab, prevMonth, prevYear]);

  const yearOptions = useMemo(() => {
    return [
      ...new Set(allInvoices.map(inv => inv.billingYear).filter(Boolean))
    ].sort((a, b) => b - a);
  }, [allInvoices]);

  const paginated = paginateItems(filtered, currentPage, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const clearFilters = () => {
    setFilterFloor("all");
    setFilterRoom("");
    setFilterStatus("all");
    setSearchTerm("");
    setSelectedMonth("all");
    setSelectedYear("all");
  };

  const hasActiveFilters =
    filterFloor !== "all" || 
    filterRoom || 
    filterStatus !== "all" || 
    searchTerm || 
    selectedMonth !== "all" || 
    selectedYear !== "all";

  return {
    // data
    invoices: allInvoices,
    mandatoryServices,
    isLoading,
    error,
    stats,
    // tabs
    activeTab,
    setActiveTab,
    // filter state + setters
    searchTerm,
    setSearchTerm,
    filterFloor,
    setFilterFloor,
    filterRoom,
    setFilterRoom,
    filterStatus,
    setFilterStatus,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    floorOptions,
    yearOptions,
    hasActiveFilters,
    clearFilters,
    // pagination
    currentPage,
    setCurrentPage,
    pageSize: PAGE_SIZE,
    paginated,
    totalPages,
    filtered,
    // modal
    selectedInvoice,
    setSelectedInvoice,
  };
};

export default useUtilitiesInvoices;

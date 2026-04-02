import React from "react";
import { 
  FaFileInvoiceDollar, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaWallet,
  FaCalendarAlt,
  FaHistory
} from "react-icons/fa";

import useUtilitiesInvoices, {
  getPreviousMonth,
} from "../../../hooks/useUtilitiesInvoices";

import InvoiceFilterBar from "./utilities-invoice/InvoiceFilterBar";
import InvoiceTable from "./utilities-invoice/InvoiceTable";
import InvoiceDetailModal from "./utilities-invoice/InvoiceDetailModal";

/** Format tiền VND */
const VND = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

// ─── Sub-component: Stats Card ──────────────────────────────
const StatCard = ({ title, value, icon, color, bg }) => (
  <div 
    style={{ 
      padding: '20px 24px', 
      background: 'white', 
      borderRadius: '16px', 
      boxShadow: 'var(--admin-shadow-sm)', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      border: '1px solid #f1f5f9',
      flex: '1 1 240px',
      transition: 'var(--admin-transition-fast)',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--admin-shadow-md)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
    }}
  >
    <div style={{ 
      width: '56px', 
      height: '56px', 
      borderRadius: '12px', 
      background: bg, 
      color: color, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: '22px' 
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
      <h3 style={{ margin: '4px 0 0', color: '#1e293b', fontSize: '24px', fontWeight: '900' }}>{value}</h3>
    </div>
  </div>
);

// ─── Main Page Component ──────────────────────────────────────────────────────

const UtilitiesInvoiceManager = () => {
  const {
    // data
    invoices,
    mandatoryServices,
    isLoading,
    error,
    stats,
    // tabs
    activeTab,
    setActiveTab,
    // filter
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
    pageSize,
    paginated,
    totalPages,
    filtered,
    // modal
    selectedInvoice,
    setSelectedInvoice,
  } = useUtilitiesInvoices();

  const { year: prevYear, month: prevMonth } = getPreviousMonth();

  // Tab styles logic
  const tabStyle = (isActive) => ({
    padding: '14px 28px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 800,
    color: isActive ? 'var(--admin-primary)' : '#64748b',
    borderBottom: isActive ? '3px solid var(--admin-primary)' : '3px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  });

  return (
    <div
      className="admin-lock-resident-container"
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      {/* ── Banner ── */}
      <div
        className="account-banner-container"
        style={{ marginBottom: 30 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
          <div className="account-banner-icon-box">
            <FaFileInvoiceDollar />
          </div>
          <div className="account-banner-info-group">
            <p>Access Control System</p> {/* Đổi Subtitle cho đồng bộ style hệ thống */}
            <h3>Utilities Invoice Management</h3>
          </div>
        </div>
        {/* Search Input đã chuyển sang Filter Bar */}
      </div>

      {/* ── Tabs Navigation ── */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '24px', 
        borderBottom: '1px solid #e2e8f0',
        padding: '0 4px'
      }}>
        <div 
          onClick={() => setActiveTab('lastMonth')}
          style={tabStyle(activeTab === 'lastMonth')}
        >
          <FaCalendarAlt /> Last Month
        </div>
        <div 
          onClick={() => setActiveTab('allMonth')}
          style={tabStyle(activeTab === 'allMonth')}
        >
          <FaHistory /> All Periods
        </div>
      </div>

      {/* ── Stats Cards (Chỉ hiển thị ở tab Last Month) ── */}
      {activeTab === 'lastMonth' && !isLoading && !error && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '20px', 
          marginBottom: '24px',
          animation: 'fadeInUp 0.4s ease-out' 
        }}>
          <StatCard 
            title="Unpaid Apartments" 
            value={stats.unpaidCount} 
            icon={<FaExclamationCircle />} 
            color="#ef4444" 
            bg="#fee2e2" 
          />
          <StatCard 
            title="Unpaid Amount" 
            value={VND(stats.unpaidAmount)} 
            icon={<FaWallet />} 
            color="#f59e0b" 
            bg="#fef3c7" 
          />
          <StatCard 
            title="Paid Amount" 
            value={VND(stats.paidAmount)} 
            icon={<FaCheckCircle />} 
            color="#10b981" 
            bg="#dcfce7" 
          />
        </div>
      )}

      {/* ── Filter Bar (Chứa Search Input) ── */}
      <InvoiceFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        filterFloor={filterFloor}
        setFilterFloor={setFilterFloor}
        filterRoom={filterRoom}
        setFilterRoom={setFilterRoom}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        floorOptions={floorOptions}
        yearOptions={yearOptions}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        totalFound={filtered.length}
      />

      {/* ── Error Notification ── */}
      {error && (
        <div
          className="admin-feedback error"
          style={{ marginBottom: 20, borderRadius: 12 }}
        >
          {error}
        </div>
      )}

      {/* ── Table Area ── */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <p style={{ fontSize: 16, fontWeight: 700 }}>Loading utilities invoices...</p>
        </div>
      ) : (
        <InvoiceTable
          paginated={paginated}
          filtered={filtered}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onViewDetail={setSelectedInvoice}
          prevMonth={activeTab === 'lastMonth' ? prevMonth : selectedMonth}
          prevYear={activeTab === 'lastMonth' ? prevYear : selectedYear}
          totalInvoices={invoices.length}
        />
      )}

      {/* ── Detail Modal ── */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          mandatoryServices={mandatoryServices}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default UtilitiesInvoiceManager;

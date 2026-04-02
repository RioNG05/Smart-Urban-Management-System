import React from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

/**
 * Thanh filter của trang Utilities Invoice.
 * Đã tích hợp thanh Search và tối ưu giao diện.
 */
const InvoiceFilterBar = ({
  searchTerm,
  setSearchTerm,
  activeTab,
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
  totalFound,
}) => {
  const selectStyle = {
    padding: "9px 12px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: 13,
    minWidth: 130,
    outline: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const searchWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 250px",
    maxWidth: "350px",
  };

  const clearBtnStyle = {
    padding: "9px 16px",
    background: "#e11d48", // Sắc đỏ từ badge unpaid
    border: "1px solid #e11d48",
    borderRadius: 8,
    color: "#fff1f2",     // Sắc sáng từ nền badge unpaid
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "20px",
        marginBottom: 24,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        boxShadow: "var(--admin-shadow-sm)",
        border: "1px solid #f1f5f9",
      }}
    >
      {/* ── Search Input (Moved here) ── */}
      <div style={searchWrapperStyle}>
        <FaSearch 
          style={{ 
            position: "absolute", 
            left: 14, 
            color: "#94a3b8", 
            fontSize: 14 
          }} 
        />
        <input
          type="text"
          placeholder="Search name, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 12px 9px 40px",
            borderRadius: 8,
            border: "1.5px solid #e2e8f0",
            background: "white",
            fontSize: 13,
            outline: "none",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--admin-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      <div style={{ width: 1, height: 24, background: "#e2e8f0", margin: "0 4px" }} />

      <FaFilter style={{ color: "var(--admin-primary)", fontSize: 13 }} />
      <span
        style={{
          fontWeight: 700,
          fontSize: 11,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Filters:
      </span>

      {/* Month/Year filters (Chỉ hiển thị khi ở tab "All Month") */}
      {activeTab === "allMonth" && (
        <>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Month {i + 1}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Years</option>
            {yearOptions.map((y) => (
              <option key={y} value={String(y)}>
                Year {y}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Floor filter */}
      <select
        value={filterFloor}
        onChange={(e) => setFilterFloor(e.target.value)}
        style={selectStyle}
      >
        <option value="all">All Floors</option>
        {floorOptions.map((f) => (
          <option key={f} value={String(f)}>
            Floor {f}
          </option>
        ))}
      </select>

      {/* Room number filter */}
      <input
        type="text"
        placeholder="Room (e.g. 301)"
        value={filterRoom}
        onChange={(e) => setFilterRoom(e.target.value)}
        style={{ ...selectStyle, minWidth: 100 }}
      />

      {/* Status filter */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        style={selectStyle}
      >
        <option value="all">All Status</option>
        <option value="0">Unpaid</option>
        <option value="1">Paid</option>
      </select>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={clearBtnStyle}
          onMouseEnter={(e) => (e.target.style.background = "#be123c")}
          onMouseLeave={(e) => (e.target.style.background = "#e11d48")}
        >
          Clear All
        </button>
      )}

      {/* Result count */}
      <div
        style={{
          marginLeft: "auto",
          fontSize: 12,
          color: "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {totalFound} Result{totalFound !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default InvoiceFilterBar;

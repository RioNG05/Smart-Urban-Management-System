import React from "react";
import { FaEye, FaFileInvoiceDollar, FaClipboardList } from "react-icons/fa";
import AdminPagination from "../../../common/AdminPagination";

/** Format tiền VND */
const VND = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

/**
 * Bảng hiển thị danh sách utilities invoices.
 * Đã tối ưu theo style chuẩn của ResidentAccount & PermissionManager:
 * - Border-left vàng đậm (6px)
 * - Padding wrapper thoáng (30px)
 * - Bo góc 24px
 * - Header nội bộ kèm Icon
 * - Footer tóm tắt số liệu
 */
const InvoiceTable = ({
  paginated,
  filtered,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onViewDetail,
  totalInvoices,
}) => {
  const displayItems = paginated;

  // Empty state theo style chuẩn
  if (filtered.length === 0) {
    return (
      <div
        className="admin-table-wrapper"
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "60px 20px",
          textAlign: "center",
          color: "#94a3b8",
          boxShadow: "var(--admin-shadow-md)",
          borderLeft: "6px solid var(--admin-primary)",
        }}
      >
        <FaFileInvoiceDollar
          style={{ fontSize: 48, marginBottom: 16, opacity: 0.2, color: "var(--admin-primary)" }}
        />
        <h4 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>
          No Invoices Found
        </h4>
        <p style={{ fontSize: 14 }}>
          {totalInvoices > 0 ? "Try adjusting your filters or search terms." : "No data available yet."}
        </p>
      </div>
    );
  }

  return (
    <section 
      className="admin-table-wrapper" 
      style={{ 
        borderLeft: '6px solid var(--admin-primary)',
        padding: '30px', 
        borderRadius: '24px',
        background: 'white',
        boxShadow: 'var(--admin-shadow-md)',
        marginBottom: '35px'
      }}
    >
      {/* ── Internal Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
        <FaClipboardList style={{ color: 'var(--admin-primary)', fontSize: '20px' }} />
        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px', color: '#1e293b' }}>
          Utilities Invoice List
        </h4>
      </div>

      {/* ── Table Scroll Area ── */}
      <div className="admin-table-scroll" style={{ overflow: "auto", overscrollBehavior: "contain", mixHeight:"800px" }}>
        <table className="admin-custom-table bordered">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '12%' }}>ROOM NO.</th>
              <th style={{ width: '10%' }}>FLOOR</th>
              <th style={{ width: '12%' }}>MONTH/YEAR</th>
              <th style={{ width: '18%' }}>OWNER</th>
              <th style={{ width: '15%' }}>PHONE</th>
              <th style={{ width: '13%' }}>TOTAL AMOUNT</th>
              <th style={{ width: '10%', textAlign: 'center' }}>STATUS</th>
              <th style={{ width: '12%', textAlign: "center" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((inv, idx) => (
              <tr key={inv.id}>
                {/* # */}
                <td style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>
                  {(currentPage - 1) * pageSize + idx + 1}
                </td>

                {/* Room No. */}
                <td>
                  <span
                    style={{
                      fontWeight: 800,
                      background: "var(--admin-primary-light)",
                      color: "var(--admin-primary)",
                      padding: "5px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  >
                    {inv.apartmentLabel}
                  </span>
                </td>

                {/* Floor */}
                <td style={{ color: "#64748b", fontWeight: 700 }}>
                  Floor {inv.floorNumber}
                </td>

                {/* Billing Month/Year */}
                <td style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                  {inv.billingMonth}/{inv.billingYear}
                </td>

                {/* Owner Name */}
                <td style={{ fontWeight: 700, color: "#1e293b" }}>
                  {inv.ownerName}
                </td>

                {/* Phone */}
                <td style={{ color: "#64748b", fontWeight: 600 }}>
                  {inv.phone}
                </td>

                {/* Total amount */}
                <td style={{ fontWeight: 800, color: "#0f172a", fontSize: '15px' }}>
                  {VND(inv.totalAmount)}
                </td>

                {/* Status */}
                <td style={{ textAlign: "center" }}>
                  <span
                    className={`status-badge ${
                      inv.status === 1 ? "paid" : "unpaid"
                    }`}
                    style={{ fontSize: '10px', padding: '4px 12px' }}
                  >
                    {inv.status === 1 ? "Paid" : "Unpaid"}
                  </span>
                </td>

                {/* Action button */}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="action-btn-styled"
                    onClick={() => onViewDetail(inv)}
                    title="View detail"
                    style={{
                      padding: "8px 12px",
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "10px",
                      color: "#64748b",
                      cursor: "pointer",
                      fontSize: "16px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--admin-primary)";
                      e.currentTarget.style.color = "var(--admin-primary)";
                      e.currentTarget.style.background = "var(--admin-primary-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.color = "#64748b";
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div style={{ 
        marginTop: '25px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 600 }}>
          Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} invoices
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={filtered.length}
          pageSize={pageSize}
          itemLabel="invoices"
        />
      </div>
    </section>
  );
};

export default InvoiceTable;

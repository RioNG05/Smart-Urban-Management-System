import React from "react";
import { FaTimes } from "react-icons/fa";

/** Format tiền VND */
const VND = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

/**
 * Modal xem chi tiết một utilities invoice.
 * Sub-component này hiển thị chi tiết số liệu điện/nước, đơn giá và tổng hợp chi phí.
 */
const InvoiceDetailModal = ({ invoice, mandatoryServices, onClose }) => {
  if (!invoice) return null;

  // Lấy đơn giá dịch vụ
  const elecService = mandatoryServices.find((s) => s.serviceCode === "ELEC_01");
  const waterService = mandatoryServices.find((s) => s.serviceCode === "WAT_01");
  const mgmtService = mandatoryServices.find((s) => s.serviceCode === "MNG_FEE");

  const elecUnit = Number(invoice.totalElectricUsed ?? 0);
  const waterUnit = Number(invoice.totalWaterUsed ?? 0);
  const elecPrice = Number(elecService?.basePrice ?? 0);
  const waterPrice = Number(waterService?.basePrice ?? 0);
  const mgmtFee = Number(mgmtService?.basePrice ?? 0);

  const elecCost = elecUnit * elecPrice;
  const waterCost = waterUnit * waterPrice;

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div
        className="invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 0 }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "#94a3b8",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              UTILITIES INVOICE — {invoice.billingMonth}/{invoice.billingYear}
            </p>
            <h3 style={{ color: "white", margin: 0, fontSize: "1.1rem" }}>
              Room {invoice.apartmentLabel}&nbsp;·&nbsp;Floor {invoice.floorNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              width: 36,
              height: 36,
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "24px 28px" }}>
          {/* Owner info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginBottom: 4,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Owner
              </p>
              <p style={{ fontWeight: 700, color: "#1e293b" }}>
                {invoice.ownerName}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginBottom: 4,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Phone
              </p>
              <p style={{ fontWeight: 700, color: "#1e293b" }}>
                {invoice.phone}
              </p>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #f1f5f9",
              margin: "0 0 20px",
            }}
          />

          {/* Breakdown - Made more visible */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 12,
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* Electric */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#64748b", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>
                  ⚡ Electric Usage
                </span>
                <span style={{ fontWeight: 800, color: "#f59e0b", fontSize: "1.25rem" }}>
                  {VND(elecCost)}
                </span>
              </div>
              <p style={{ fontSize: 15, color: "#1e293b", margin: 0, fontWeight: 700 }}>
                {elecUnit.toLocaleString()} kWh <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12, marginLeft: 6 }}>× {VND(elecPrice)}/kWh</span>
              </p>
            </div>

            <hr
              style={{
                border: "none",
                borderTop: "1px dashed #e2e8f0",
                margin: 0,
              }}
            />

            {/* Water */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#64748b", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>
                  💧 Water Usage
                </span>
                <span style={{ fontWeight: 800, color: "#3b82f6", fontSize: "1.25rem" }}>
                  {VND(waterCost)}
                </span>
              </div>
              <p style={{ fontSize: 15, color: "#1e293b", margin: 0, fontWeight: 700 }}>
                {waterUnit.toLocaleString()} m³ <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12, marginLeft: 6 }}>× {VND(waterPrice)}/m³</span>
              </p>
            </div>

            <hr
              style={{
                border: "none",
                borderTop: "1px dashed #e2e8f0",
                margin: 0,
              }}
            />

            {/* Management fee */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#64748b", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>
                🏢 Management Fee
              </span>
              <span style={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}>
                {VND(mgmtFee)}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="total-final-box" style={{ 
            marginTop: 24, 
            padding: "20px", 
            background: "#fffbeb", 
            borderRadius: 12, 
            border: "1px solid #fef3c7" 
          }}>
            <span style={{ color: "#92400e", fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>
              TOTAL AMOUNT
            </span>
            <p
              style={{
                margin: "4px 0 0",
                fontWeight: 900,
                fontSize: "1.75rem",
                color: "#0f172a",
              }}
            >
              {VND(invoice.totalAmount)}
            </p>
          </div>

          {/* Status - No icon */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <span
              className={`status-badge ${
                invoice.status === 1 ? "paid" : "unpaid"
              }`}
              style={{ fontSize: 13, padding: "6px 20px" }}
            >
              {invoice.status === 1 ? "Paid" : "Unpaid"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;

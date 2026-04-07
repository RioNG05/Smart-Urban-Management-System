import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaCheckSquare, FaRegSquare, FaBolt, FaTint, FaBuilding, FaFileInvoiceDollar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";

export default function BillingPayableBreakdown({
  totals = { electricity: 0, water: 0, management: 0, service: 0, total: 0 },
  pricingRows = { utilities: [], services: [] },
  formatCurrency,
  apartmentLabel,
  monthKey,
  setMonthKey,
  months = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    utilities: true,
    services: true,
  });

  const utilitiesRef = useRef(null);
  const servicesRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for payment success toast in session storage after a reload
    const paymentToast = sessionStorage.getItem("paymentSuccessToast");
    if (paymentToast === "true") {
      toast.success("Thanh toán thành công!", {
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

    if (vnp_ResponseCode) {
      const verifyPayment = async () => {
        try {
          const res = await api.get(`/payment/vnpay_return${window.location.search}`);
          if (res.data.status === 1) {
            // Set flag and reload to fetch updated bills
            sessionStorage.setItem("paymentSuccessToast", "true");
            window.location.href = window.location.pathname; 
          } else {
            toast.error("Thanh toán thất bại hoặc có lỗi xảy ra.");
            navigate(location.pathname, { replace: true });
          }
        } catch (err) {
          console.error("Lỗi xác minh thanh toán", err);
          toast.error("Có lỗi xảy ra khi xác thực giao dịch.");
          navigate(location.pathname, { replace: true });
        }
      };
      verifyPayment();
    }
  }, [location, navigate]);

  const toggleSection = (section) => {
    const isExpanding = !expanded[section];
    setExpanded((prev) => ({ ...prev, [section]: isExpanding }));
    
    if (isExpanding) {
      setTimeout(() => {
        const ref = section === "utilities" ? utilitiesRef : servicesRef;
        if (ref.current) {
          const yOffset = -80; // Offset for sticky navbar
          const element = ref.current;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150); // Delay to allow expansion animation to start
    }
  };

  const selectedMonthLabel = months.find(m => m.value === monthKey)?.label || "All";
  const renderRow = (row) => {
    return (
      <tr 
        key={row.id}
        className="utility-detail-row"
      >
        <td className="category-cell">
          <div className="category-name">{row.category}</div>
          {row.subLabel && <div className="category-sublabel">{row.subLabel}</div>}
        </td>
        <td className="cell-unit-price">
          {row.unitPriceLabel}
        </td>
        <td className="cell-quantity">
          {row.quantityLabel}
        </td>
        <td className="cell-amount">
          {formatCurrency(row.amount)}
        </td>
      </tr>
    );
  };

  const handlePayment = async (totals) => {
    try {
      const invoicesPayload = [];
      const { month: invoiceMonth, year: invoiceYear } = (() => {
        if (!monthKey || monthKey === "all") {
          const d = new Date();
          return { month: d.getMonth() + 1, year: d.getFullYear() };
        }
        const d = new Date(monthKey);
        return { month: d.getMonth() + 1, year: d.getFullYear() };
      })();

      const extractInvoices = (rows, type) => {
        if (!rows) return;
        rows.forEach(row => {
          row.billIds?.forEach(idStr => {
            const match = String(idStr).match(/\d+/);
            if (match) {
              const invId = parseInt(match[0], 10);
              if (!invoicesPayload.some(i => i.invoiceId === invId && i.invoiceType === type)) {
                invoicesPayload.push({
                  invoiceId: invId,
                  invoiceType: type,
                  invoiceMonth,
                  invoiceYear
                });
              }
            }
          });
        });
      };

      extractInvoices(pricingRows?.utilities, "UTILITIES_INVOICE");
      extractInvoices(pricingRows?.services, "SERVICES_INVOICE");

      if (invoicesPayload.length === 0) {
         toast.warn("Không tìm thấy mã hóa đơn hợp lệ.");
         return;
      }

      const res = await api.post("/payment/create", {
        orderInfo: `Thanh toan phi - ${apartmentLabel}`,
        invoices: invoicesPayload
      });
      window.location.href = res.data.result.paymentUrl;
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi kết nối tới cổng thanh toán.");
    }
  };
  return (
    <section className="billing-panel">
      <div className="billing-panel-header condensed">
        <div className="header-left">
          <h3 className="section-title main-title">Amount To Pay</h3>
        </div>

        {months?.length > 0 && (
          <div className="custom-dropdown-container">
            <div 
              className={`custom-dropdown-header ${isOpen ? 'active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="current-selection">{selectedMonthLabel}</span>
              <FaChevronDown className={`arrow-icon ${isOpen ? 'rotate' : ''}`} />
            </div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  className="custom-dropdown-menu"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 5, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div 
                    className={`dropdown-option ${monthKey === 'all' ? 'selected' : ''}`}
                    onClick={() => { setMonthKey('all'); setIsOpen(false); }}
                  >
                    All
                  </div>
                  {months.map((item) => (
                    <div 
                      key={item.value} 
                      className={`dropdown-option ${monthKey === item.value ? 'selected' : ''}`}
                      onClick={() => { setMonthKey(item.value); setIsOpen(false); }}
                    >
                      {item.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* PAYMENT SUMMARY - NOW IN ITS OWN FULL-WIDTH ROW */}
      <div className="modern-payment-summary full-row">
        <div className="payment-summary-content">
          <span className="total-label">Monthly Gross Total:</span>
          <span className="total-value">
            {formatCurrency(totals.total)}
          </span>
        </div>
        {!totals.hasInvoices ? null : totals.allPaid ? (
          <div className="paid-tag" style={{
            padding: "10px 24px",
            backgroundColor: "#2e7d32",
            color: "white",
            borderRadius: "6px",
            fontWeight: "600",
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 4px 10px rgba(46, 125, 50, 0.2)"
          }}>
            Paid
          </div>
        ) : (
          <button 
            className="pay-selected-btn premium-btn"
            onClick={() => handlePayment(totals)}
          >
            Pay Total Bill
          </button>
        )}
      </div>

      <div className="payable-breakdown-grid">
        <div className="payable-breakdown-card">
          <div className="card-icon elec">
            <FaBolt />
          </div>
          <div className="card-content">
            <span className="payable-breakdown-label">Electricity</span>
            <strong>{formatCurrency(totals.electricity)}</strong>
          </div>
        </div>

        <div className="payable-breakdown-card">
          <div className="card-icon water">
            <FaTint />
          </div>
          <div className="card-content">
            <span className="payable-breakdown-label">Water</span>
            <strong>{formatCurrency(totals.water)}</strong>
          </div>
        </div>

        <div className="payable-breakdown-card">
          <div className="card-icon management">
            <FaBuilding />
          </div>
          <div className="card-content">
            <span className="payable-breakdown-label">Management Fee</span>
            <strong>{formatCurrency(totals.management)}</strong>
          </div>
        </div>
      </div>

      <div className="bill-table">
        <table>
          <tbody>
            {/* MONTHLY UTILITIES SECTION */}
            {pricingRows?.utilities?.length > 0 && (
              <>
                <tr 
                  ref={utilitiesRef}
                  className="table-category-header clickable" 
                  onClick={() => toggleSection("utilities")}
                >
                  <td colSpan="5">
                    <div className="category-header-content">
                      <span>Detail Utilities ({apartmentLabel})</span>
                      {expanded.utilities ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expanded.utilities && (
                    <>
                      <tr className="inner-table-header">
                        <th>CATEGORY</th>
                        <th>UNIT PRICE</th>
                        <th>USAGE / QUANTITY</th>
                        <th style={{ textAlign: "right" }}>TOTAL PAYABLE</th>
                      </tr>
                      {pricingRows.utilities.map(renderRow)}
                    </>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* BOOKING SERVICES SECTION */}
            {pricingRows?.services?.length > 0 && (
              <>
                <tr 
                  ref={servicesRef}
                  className="table-category-header clickable" 
                  onClick={() => toggleSection("services")}
                >
                  <td colSpan="5">
                    <div className="category-header-content">
                      <span>Service Bookings</span>
                      {expanded.services ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expanded.services && (
                    <>
                      <tr className="inner-table-header">
                        <th>CATEGORY</th>
                        <th>UNIT PRICE</th>
                        <th>USAGE / QUANTITY</th>
                        <th style={{ textAlign: "right" }}>TOTAL PAYABLE</th>
                      </tr>
                      {pricingRows.services.map(renderRow)}
                    </>
                  )}
                </AnimatePresence>
              </>
            )}

            {(!pricingRows?.utilities?.length && !pricingRows?.services?.length) && (
              <tr>
                <td colSpan="5" className="billing-empty">
                  No payable categories found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

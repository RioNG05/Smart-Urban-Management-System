import React from "react";
import { toast } from "react-toastify";

export default function InvoiceSidebar({ 
  selectedBills, 
  allUnpaidBills, 
  formatCurrency, 
  onCheckout 
}) {
  const selectedCount = selectedBills.length;
  const totalSelectedDue = selectedBills.reduce((sum, b) => sum + (b.amount || 0), 0);
  
  // Calculate management fees if utilities exist
  const managementFeesTotal = selectedBills
    .filter(b => b.source === "utility")
    .reduce((sum, b) => sum + (b.managementFee || 0), 0);
    
  const grandTotal = totalSelectedDue + managementFeesTotal;
  
  // Outstanding calculates remaining total not selected
  const globalTotalDue = allUnpaidBills.reduce((sum, b) => sum + (b.amount || 0) + (b.source === "utility" ? (b.managementFee || 0) : 0), 0);
  const remainingDue = globalTotalDue - grandTotal;

  const handleCheckout = () => {
    if (selectedCount === 0) {
      toast.warn("Please select at least one bill to pay.");
      return;
    }
    if (onCheckout) onCheckout(selectedBills);
    else toast.info("Proceeding to checkout workflow...");
  };

  return (
    <div className="bg-white rounded p-4 mb-4" style={{ position: "sticky", top: "100px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
      <h3 className="fs-5 fw-bold mb-4 text-dark border-bottom pb-3">Order Summary</h3>
      
      <div className="d-flex justify-content-between mb-3 text-secondary">
        <span>Selected Items</span>
        <span className="fw-medium text-dark">{selectedCount}</span>
      </div>
      
      <div className="d-flex justify-content-between mb-3 text-secondary">
        <span>Subtotal</span>
        <span className="fw-medium text-dark">{formatCurrency(totalSelectedDue)}</span>
      </div>
      
      {managementFeesTotal > 0 && (
        <div className="d-flex justify-content-between mb-3 text-secondary">
          <span>Management Fees</span>
          <span className="fw-medium text-dark">{formatCurrency(managementFeesTotal)}</span>
        </div>
      )}
      
      <hr className="my-3 text-secondary" style={{ opacity: 0.15 }} />
      
      <div className="d-flex justify-content-between mb-4 fs-5 fw-bold text-dark">
        <span>Total Due</span>
        <span style={{ color: "#2e7d32" }}>{formatCurrency(grandTotal)}</span>
      </div>
      
      {globalTotalDue > 0 && (
        <div className="d-flex justify-content-between mb-4 small fw-medium text-muted">
          <span>Remaining Unpaid:</span>
          <span>{formatCurrency(remainingDue)}</span>
        </div>
      )}
      
      <button 
        className="btn w-100 py-3 fw-bold rounded shadow-sm text-white transition-all"
        onClick={handleCheckout}
        disabled={selectedCount === 0}
        style={{ 
          backgroundColor: selectedCount === 0 ? "#9ca3af" : "#2e7d32", 
          border: "none",
          fontSize: "1.1rem"
        }}
      >
        Check Out
      </button>
      
      {selectedCount === 0 && (
        <p className="text-center text-muted small mt-3 mb-0 fst-italic">
          Select bills to proceed with payment
        </p>
      )}
    </div>
  );
}

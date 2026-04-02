import React from "react";
import "../../../styles/billing.css"; // Ensure any specific overrides can act here

const BillingPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  itemLabel = "items",
}) => {
  if (totalPages <= 1) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const visiblePages = [];
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 2);

  for (let page = startPage; page <= endPage; page += 1) {
    visiblePages.push(page);
  }

  return (
    <div className="admin-pagination">
      <div className="admin-pagination-summary">
        Showing {startItem}-{endItem} of {totalItems} {itemLabel}
      </div>
      <div className="admin-pagination-controls">
        <button
          type="button"
          className="admin-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            className={`admin-pagination-btn ${page === currentPage ? "billing-active-page" : ""}`}
            style={page === currentPage ? { backgroundColor: '#2e7d32', color: '#fff', borderColor: '#2e7d32' } : {}}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="admin-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BillingPagination;

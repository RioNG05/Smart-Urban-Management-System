import { useState, useEffect } from "react";
import BillingPagination from "./BillingPagination";

export default function PaymentHistory({ payments, formatCurrency, formatDate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [payments]);

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPayments = payments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="payment-history">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h3 className="section-title fs-4 fw-bold mb-0">Payment History</h3>
      </div>

      <div className="admin-table-wrapper mb-3 border rounded shadow-sm">
        <table className="admin-custom-table align-middle">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.date)}</td>
                  <td className="fw-semibold text-success">{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className="badge bg-secondary">{payment.method}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-muted fst-italic">
                  No payment history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BillingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={payments.length}
        pageSize={ITEMS_PER_PAGE}
        itemLabel="payments"
      />
    </div>
  );
}

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
      <div className="bill-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Payment Category</th>
              <th style={{ textAlign: "right" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    {formatDate(payment.date)}
                  </td>
                  <td>
                    <span className="payment-badge">
                      {payment.method}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "700", color: "var(--primary-color)" }}>
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="billing-empty">
                  No payment history recorded.
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

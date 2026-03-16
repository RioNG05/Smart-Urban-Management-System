import { useState } from "react";

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Payment successful!");
    }, 2000);
  };

  return (
    <div className="payment-container">
      <button
        className={`pay-button ${loading ? "loading" : ""}`}
        onClick={handlePay}
      >
        {loading ? "Processing..." : "Pay Bills"}
      </button>
    </div>
  );
}

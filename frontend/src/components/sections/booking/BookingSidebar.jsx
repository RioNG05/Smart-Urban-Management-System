import React from "react";

const formatCurrencyLocal = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value));

const padNumber = (n) => String(n).padStart(2, "0");

const formatHour = (h) => {
  if (h == null) return null;
  if (h === 24) return "24:00";
  return `${padNumber(h)}:00`;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BookingSidebar({
  selectedService,
  selectedResource,
  survey,
  bookingAmount,
  canSubmit,
  isSubmitting,
  onSubmit,
  role,
}) {
  const { preferredDate, startHour, endHour, durationHours } = survey ?? {};

  const rows = [
    {
      label: "Service",
      value: selectedService?.title ?? null,
    },
    {
      label: "Resource",
      value: selectedResource
        ? `${selectedResource.resourceCode || `#${selectedResource.id}`} — ${
            selectedResource.location || "No location"
          }`
        : null,
    },
    {
      label: "Date",
      value: formatDisplayDate(preferredDate),
    },
    {
      label: "Start Time",
      value: formatHour(startHour),
    },
    {
      label: "End Time",
      value: formatHour(endHour),
    },
    {
      label: "Duration",
      value:
        durationHours != null
          ? `${durationHours} hour${durationHours > 1 ? "s" : ""}`
          : null,
    },
  ];

  return (
    <div className="booking-sidebar-panel">
      <div className="booking-sidebar-header">
        <span className="booking-step">Order Summary</span>
      </div>

      <div className="booking-sidebar-section">
        {rows.map(({ label, value }) => (
          <div key={label} className="booking-sidebar-row">
            <span className="booking-sidebar-label">{label}</span>
            <span className="booking-sidebar-value">
              {value ?? <span className="booking-sidebar-empty">Not selected</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="booking-sidebar-divider" />

      <div className="booking-sidebar-total">
        <span>Estimated Total</span>
        <span className="booking-sidebar-total-value">
          {bookingAmount != null ? (
            formatCurrencyLocal(bookingAmount)
          ) : (
            <span className="booking-sidebar-empty">—</span>
          )}
        </span>
      </div>

      <button
        type="submit"
        className="booking-submit-btn booking-submit-btn--full"
        disabled={!canSubmit || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? "Sending…" : "Send Booking"}
      </button>

      {role !== "USER" || (
        <p className="booking-submit-hint">
          Please sign in with a resident account to submit a booking.
        </p>
      )}
    </div>
  );
}

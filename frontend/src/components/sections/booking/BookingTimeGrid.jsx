import React from "react";

/**
 * BookingTimeGrid
 * Renders an hour-button grid from `startHour` to `endHour` (inclusive).
 * Buttons that are in `blockedHours` or `disabledHours` are shown grayed out.
 * The `selectedHour` is highlighted in gold.
 *
 * @param {object}  props
 * @param {string}  props.label          - "Booking Time" or "End Time"
 * @param {number|null} props.selectedHour - currently selected hour integer (8, 9, …)
 * @param {function} props.onSelect      - (hour: number) => void
 * @param {Set<number>} props.blockedHours  - hours already booked (from DB)
 * @param {Set<number>} [props.disabledHours] - additional client-side disabled hours
 * @param {number}  props.startHour      - first hour shown (inclusive), default 8
 * @param {number}  props.endHour        - last hour shown (inclusive), default 23
 */
export default function BookingTimeGrid({
  label,
  selectedHour,
  onSelect,
  blockedHours = new Set(),
  disabledHours = new Set(),
  startHour = 8,
  endHour = 23,
}) {
  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);

  const fmt = (h) => `${String(h).padStart(2, "0")}:00`;

  return (
    <div className="time-grid-wrapper">
      {label && <span className="booking-field-label">{label}</span>}
      <div className="time-grid">
        {hours.map((h) => {
          const isBlocked = blockedHours.has(h);
          const isDisabled = disabledHours.has(h) || isBlocked;
          const isSelected = selectedHour === h;

          let className = "time-slot";
          if (isSelected) className += " time-slot--selected";
          else if (isBlocked) className += " time-slot--booked";
          else if (isDisabled) className += " time-slot--disabled";

          return (
            <button
              key={h}
              type="button"
              className={className}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(h)}
              title={isBlocked ? "Already booked" : fmt(h)}
              aria-pressed={isSelected}
            >
              {fmt(h)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

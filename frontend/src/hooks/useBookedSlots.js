import { useMemo } from "react";

/**
 * Given all bookings and a resourceId + date,
 * returns a Set of integer hours (0-23) that are already occupied.
 *
 * Only bookings with status === 1 (Confirmed) block time slots.
 * Status 0 (Pending) and 2 (Cancelled) do NOT block slots.
 *
 * A confirmed booking blocks hours [bookFrom.hour, bookTo.hour - 1] inclusive.
 * e.g. a booking from 20:00 to 24:00 blocks hours 20, 21, 22, 23.
 */
export function useBookedSlots(allBookings, resourceId, date) {
  return useMemo(() => {
    if (!resourceId || !date || !allBookings?.length) return new Set();

    const blocked = new Set();

    allBookings.forEach((booking) => {
      // Only block for Confirmed bookings (status === 1)
      if (booking.status !== 1) return;
      if (booking.resourceId !== resourceId) return;

      const from = booking.bookFrom ? new Date(booking.bookFrom) : null;
      const to = booking.bookTo ? new Date(booking.bookTo) : null;
      if (!from || !to || isNaN(from) || isNaN(to)) return;

      // Only consider same date (use local date comparison)
      const fromYear = from.getFullYear();
      const fromMonth = from.getMonth();
      const fromDay = from.getDate();

      const [targetYear, targetMonth, targetDay] = date.split("-").map(Number);
      if (fromYear !== targetYear || fromMonth + 1 !== targetMonth || fromDay !== targetDay) return;

      // Block each integer hour [startHour .. endHour - 1] inclusive
      // e.g. 20:00 – 24:00 → blocks hours 20, 21, 22, 23
      const startH = from.getHours();
      // Handle endHour: if bookTo is midnight (00:00 next day), treat as hour 24
      let endH = to.getHours();
      if (endH === 0 && to.getDate() !== from.getDate()) endH = 24;

      for (let h = startH; h < endH; h++) {
        blocked.add(h);
      }
    });

    return blocked;
  }, [allBookings, resourceId, date]);
}


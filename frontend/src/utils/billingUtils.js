export const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => CURRENCY_FORMATTER.format(Number(value || 0));

const parseJavaDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (Array.isArray(val)) {
    // Spring Boot Jackson serialization: [year, month, day, hour, minute, second]
    return new Date(val[0], val[1] - 1, val[2], val[3] || 0, val[4] || 0, val[5] || 0);
  }
  if (typeof val === 'string' && val.includes(' ')) {
    return new Date(val.replace(' ', 'T'));
  }
  return new Date(val);
};

export const formatDate = (value) => {
  if (!value) return "N/A";
  const parsedDate = parseJavaDate(value);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";
  return DATE_FORMATTER.format(parsedDate);
};

export const getMonthKey = (year, month) =>
  year && month ? `${year}-${String(month).padStart(2, "0")}` : "unknown";

export const getInvoiceStatus = (status) =>
  Number(status) === 1
    ? { key: "paid", label: "Paid" }
    : { key: "unpaid", label: "Unpaid" };

export const getBookingLabel = (booking) =>
  booking?.serviceResource?.service?.serviceName ||
  booking?.serviceResource?.serviceName ||
  booking?.serviceName ||
  null;

export const sortByBillingPeriod = (items) =>
  [...items].sort((a, b) => {
    const yearA = Number(a?.billingYear ?? 0);
    const yearB = Number(b?.billingYear ?? 0);
    const monthA = Number(a?.billingMonth ?? 0);
    const monthB = Number(b?.billingMonth ?? 0);

    if (yearA !== yearB) return yearA - yearB;
    return monthA - monthB;
  });

export const buildUtilityBills = (utilityInvoices, utilityRates) => {
  const sortedInvoices = sortByBillingPeriod(utilityInvoices);
  let electricityReading = 0;
  let waterReading = 0;

  return sortedInvoices.map((invoice) => {
    const status = getInvoiceStatus(invoice.status);
    const invoiceMonthKey = getMonthKey(
      invoice.billingYear,
      invoice.billingMonth
    );
    const createdAt = invoice.createdAt ? parseJavaDate(invoice.createdAt) : null;
    const electricityUsage = Number(invoice.totalElectricUsed ?? 0);
    const waterUsage = Number(invoice.totalWaterUsed ?? 0);

    const electricityRate =
      Number(utilityRates.electricity?.basePrice ?? utilityRates.electricity?.feePerUnit ?? 0) || 0;
    const waterRate = Number(utilityRates.water?.basePrice ?? utilityRates.water?.feePerUnit ?? 0) || 0;
    const managementRate = Number(utilityRates.management?.basePrice ?? 500000) || 500000;

    const electricityAmount = electricityUsage * electricityRate;
    const waterAmount = waterUsage * waterRate;

    const previousElectricityReading = electricityReading;
    const currentElectricityReading =
      previousElectricityReading + electricityUsage;

    const previousWaterReading = waterReading;
    const currentWaterReading = previousWaterReading + waterUsage;

    electricityReading = currentElectricityReading;
    waterReading = currentWaterReading;

    return {
      id: `utility-${invoice.id}`,
      source: "utility",
      name: `Utilities Invoice #${invoice.id}`,
      monthKey: invoiceMonthKey,
      createdAt: createdAt,
      dueDate: createdAt,
      // Total amount fetched directly from database as requested
      amount: Number(invoice.totalAmount ?? 0),
      managementFee: managementRate,
      statusKey: status.key,
      statusLabel: status.label,
      utilityDetails: {
        electricity: {
          label: "Electricity",
          unit: "kWh",
          previousReading: previousElectricityReading,
          currentReading: currentElectricityReading,
          rate: electricityRate,
          amount: electricityAmount,
          usage: electricityUsage,
        },
        water: {
          label: "Water",
          unit: "m3",
          previousReading: previousWaterReading,
          currentReading: currentWaterReading,
          rate: waterRate,
          amount: waterAmount,
          usage: waterUsage,
        },
      },
    };
  });
};

export const buildServiceBillFromBooking = (booking, invoice) => {
  const status = getInvoiceStatus(invoice?.status ?? booking?.status);
  const createdAt = invoice?.createdAt ? parseJavaDate(invoice.createdAt) : null;
  const sourceDate = invoice?.paymentDate
    ? parseJavaDate(invoice.paymentDate)
    : booking?.bookFrom
    ? parseJavaDate(booking.bookFrom)
    : booking?.bookAt
    ? parseJavaDate(booking.bookAt)
    : createdAt;

  return {
    id: invoice?.id
      ? `service-${invoice.id}`
      : `service-booking-${booking?.id ?? "unknown"}`,
    source: "service",
    name:
      getBookingLabel(booking || invoice?.bookingService) ||
      (invoice?.id
        ? `Service Invoice #${invoice.id}`
        : `Service Booking #${booking?.id}`),
    monthKey: sourceDate
      ? getMonthKey(sourceDate.getFullYear(), sourceDate.getMonth() + 1)
      : "unknown",
    createdAt: createdAt,
    dueDate: sourceDate,
    amount: Number(invoice?.amount ?? booking?.totalAmount ?? 0),
    statusKey: status.key,
    statusLabel: status.label,
  };
};

export const isPreviousMonth = (dateObj) => {
  if (!dateObj) return false;
  const parsedDate = parseJavaDate(dateObj);
  if (Number.isNaN(parsedDate.getTime())) return false;
  const today = new Date();
  const targetYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const targetMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1; // 0-based

  return parsedDate.getFullYear() === targetYear && parsedDate.getMonth() === targetMonth;
};

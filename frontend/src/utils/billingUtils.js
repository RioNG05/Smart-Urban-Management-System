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

export const getServiceIcon = (serviceName) => {
  const name = serviceName?.toLowerCase() || "";
  
  const icons = {
    parking: "FaParking",
    bbq: "FaHamburger",
    electric: "FaBolt",
    water: "FaTint",
    shopping: "FaShoppingCart",
    mall: "FaShoppingCart",
    playground: "FaChild",
    children: "FaChild",
    gym: "FaDumbbell",
    yoga: "FaDumbbell",
    fitness: "FaDumbbell",
    education: "FaGraduationCap",
    school: "FaGraduationCap",
    system: "FaGraduationCap",
    hall: "FaUsers",
    community: "FaUsers",
    pool: "FaUmbrella",
    swim: "FaUmbrella",
    tennis: "FaTableTennis",
    sport: "FaTableTennis",
    golf: "FaGolfBall",
    sauna: "FaSpa",
    spa: "FaSpa",
    repair: "FaTools",
    fix: "FaTools"
  };

  const match = Object.keys(icons).find(key => name.includes(key));
  return match ? icons[match] : "FaBuilding";
};

export const getBookingStatusLabel = (status) => {
  const s = Number(status);
  if (s === 1) return { key: "approved", label: "Approved" };
  if (s === 2) return { key: "denied", label: "Denied" };
  return { key: "pending", label: "Pending Approval" };
};

export const getPaymentStatusLabel = (status) => {
  const s = Number(status || 0);
  if (s === 1) return { key: "paid", label: "Paid" };
  if (s === 2) return { key: "denied", label: "Rejected" };
  return { key: "unpaid", label: "Unpaid" };
};

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

export const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = parseJavaDate(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateStr = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${time}, ${dateStr}`;
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

  return sortedInvoices.map((invoice) => {
    const status = getInvoiceStatus(invoice.status);
    const invoiceMonthKey = getMonthKey(
      invoice.billingYear,
      invoice.billingMonth
    );
    const createdAt = invoice.createdAt ? parseJavaDate(invoice.createdAt) : null;

    // Mapping following Backend Entity (UtilitiesInvoice.java)
    const electricityQuantity = Number(invoice.totalElectricUsed ?? 0);
    const waterQuantity = Number(invoice.totalWaterUsed ?? 0);

    // Mapping following Backend Entity (MandatoryServices.java)
    const electricityRate = Number(utilityRates.electricity?.basePrice ?? 0);
    const waterRate = Number(utilityRates.water?.basePrice ?? 0);

    // Calculated amounts for items
    const electricityAmount = electricityQuantity * electricityRate;
    const waterAmount = waterQuantity * waterRate;

    // TOTAL AMOUNT: Fetched directly from database (the source of truth)
    const totalAmountFromDB = Number(invoice.totalAmount ?? 0);

    // MANAGEMENT FEE: Calculated as the balance to match the totalAmount exactly
    // This ensures Electricity + Water + Management = Total Amount recorded in DB
    const managementAmount = totalAmountFromDB - (electricityAmount + waterAmount);

    // Calculate a representative usage date (start of the billing month)
    const usageDate = new Date(invoice.billingYear, invoice.billingMonth - 1, 1);

    return {
      id: `utility-${invoice.id}`,
      source: "utility",
      name: `Utilities Invoice #${invoice.id}`,
      monthKey: invoiceMonthKey,
      createdAt: createdAt,
      dueDate: createdAt,
      usageDate: usageDate,
      paymentDate: invoice.paymentDate ? parseJavaDate(invoice.paymentDate) : createdAt,
      amount: totalAmountFromDB,
      statusKey: status.key,
      statusLabel: status.label,
      utilityDetails: {
        electricity: {
          label: "Electricity",
          unit: "kWh",
          quantity: electricityQuantity,
          unitPrice: electricityRate,
          amount: electricityAmount,
          usageDate: usageDate,
        },
        water: {
          label: "Water",
          unit: "m³",
          quantity: waterQuantity,
          unitPrice: waterRate,
          amount: waterAmount,
          usageDate: usageDate,
        },
        management: {
          label: "Management Fee",
          unit: "Fixed",
          quantity: 1,
          unitPrice: managementAmount,
          amount: managementAmount,
          usageDate: usageDate,
        },
      },
      managementFee: managementAmount,
    };
  });
};

export const buildServiceBillFromBooking = (booking, invoice) => {
  const status = getInvoiceStatus(invoice?.status ?? booking?.status);
  const createdAt = invoice?.createdAt ? parseJavaDate(invoice.createdAt) : null;
  const paymentDate = invoice?.paymentDate ? parseJavaDate(invoice.paymentDate) : null;

  const start = booking?.bookFrom ? parseJavaDate(booking.bookFrom) : null;
  const end = booking?.bookTo ? parseJavaDate(booking.bookTo) : null;

  const bookingCreatedAt = (booking?.bookAt || booking?.createdAt) ? parseJavaDate(booking.bookAt || booking.createdAt) : null;
  const effectiveCreatedAt = createdAt || bookingCreatedAt;

  const usageDate = start || effectiveCreatedAt;
  const displayDate = usageDate || paymentDate || effectiveCreatedAt;

  const totalAmount = Number(invoice?.amount ?? booking?.totalAmount ?? 0);
  const feePerUnit = Number(
    booking?.serviceResource?.service?.feePerUnit ??
    booking?.service?.feePerUnit ??
    totalAmount
  );

  // Calculate duration/quantity (Number of Hours)
  let quantity = 1;
  if (start && end) {
    const diffMs = end.getTime() - start.getTime();
    quantity = Math.max(1, Math.round(diffMs / (1000 * 60 * 60))); 
  }

  const unitPrice = feePerUnit;
  const amount = totalAmount; // Reverting to raw data as requested

  const bStatus = getBookingStatusLabel(booking?.status);
  const pStatus = getPaymentStatusLabel(invoice?.status ?? booking?.status); // fallback to booking status if no invoice

  const unitType = booking?.serviceResource?.service?.unitType ?? 
                   booking?.service?.unitType ?? "";

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
    monthKey: displayDate
      ? getMonthKey(displayDate.getFullYear(), displayDate.getMonth() + 1)
      : "unknown",
    createdAt: createdAt || bookingCreatedAt,
    dueDate: displayDate,
    usageDate: usageDate,
    paymentDate: paymentDate || (pStatus.key === 'paid' ? createdAt : null), 
    amount: amount,
    unitPrice: unitPrice,
    unitType: unitType,
    quantity: quantity,
    bookFrom: start,
    bookTo: end,
    statusKey: pStatus.key,
    statusLabel: pStatus.label,
    bookingStatusKey: bStatus.key,
    bookingStatusLabel: bStatus.label,
    paymentStatusKey: pStatus.key,
    paymentStatusLabel: pStatus.label,
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

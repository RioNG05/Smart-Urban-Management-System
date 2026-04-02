import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaCreditCard,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaSwimmingPool,
  FaDumbbell,
  FaFire,
  FaTableTennis,
  FaGolfBall,
  FaSpa,
  FaUsers,
  FaShoppingBag,
} from "react-icons/fa";
import { getAccounts, getResidents } from "../services/adminResidentService";
import {
  getAllBookings,
  getAllContracts,
  getAllServiceInvoices,
  updateBookingById,
} from "../services/adminService";
import AdminPagination from "../components/common/AdminPagination";

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const getServiceIcon = (service) => {
  if (service.includes("Pool")) return <FaSwimmingPool />;
  if (service.includes("Gym")) return <FaDumbbell />;
  if (service.includes("BBQ")) return <FaFire />;
  if (service.includes("Tennis")) return <FaTableTennis />;
  if (service.includes("Golf")) return <FaGolfBall />;
  if (service.includes("Sauna")) return <FaSpa />;
  if (service.includes("Community")) return <FaUsers />;
  if (service.includes("Shopping")) return <FaShoppingBag />;
  return <FaCalendarCheck />;
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return DATE_TIME_FORMATTER.format(parsed);
};

const toTimestamp = (value) => {
  if (!value) return 0;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const comparePriorityThenNewest = (
  leftPriority,
  rightPriority,
  leftTimestamp,
  rightTimestamp,
) => {
  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  return rightTimestamp - leftTimestamp;
};

const getBookingStatusMeta = (status) => {
  if (Number(status) === 1) return { label: "Approved", className: "approved" };
  if (Number(status) === 2) return { label: "Denied", className: "deny" };
  return { label: "Pending", className: "pending" };
};

const getBookingSortPriority = (status) => {
  if (Number(status) === 0) return 0;
  if (Number(status) === 1) return 1;
  if (Number(status) === 2) return 2;
  return 3;
};

const getInvoiceStatusMeta = (status) => {
  if (Number(status) === 1) return { label: "Paid", className: "paid" };
  return { label: "Unpaid", className: "unpaid" };
};

const getServiceNameFromBooking = (booking) =>
  booking?.serviceResource?.service?.serviceName ||
  booking?.serviceResource?.serviceName ||
  booking?.serviceName ||
  `Service #${booking?.resourceId ?? booking?.id ?? "N/A"}`;

const getResidentName = (accountId, residentMap, accountMap) =>
  residentMap.get(accountId)?.fullName ||
  accountMap.get(accountId)?.username ||
  `Account #${accountId ?? "N/A"}`;

const getApartmentLabel = (accountId, contractMap) =>
  contractMap.get(accountId)?.apartment?.roomNumber ||
  contractMap.get(accountId)?.apartmentId ||
  "N/A";

const buildBookingUpdatePayload = (bookingItem, nextStatus) => {
  const rawBooking = bookingItem?.raw ?? {};

  return {
    resourceId:
      rawBooking?.resourceId ?? rawBooking?.serviceResource?.id ?? null,
    accountId: rawBooking?.accountId ?? rawBooking?.account?.id ?? null,
    bookFrom: rawBooking?.bookFrom ?? null,
    bookTo: rawBooking?.bookTo ?? null,
    status: nextStatus,
    totalAmount:
      rawBooking?.totalAmount ??
      rawBooking?.amount ??
      bookingItem?.raw?.bookingService?.totalAmount ??
      null,
  };
};

const StaffServiceMainContent = ({ activeTab }) => {
  const [bookingFilter, setBookingFilter] = useState("All");
  const [feeFilter, setFeeFilter] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [serviceFees, setServiceFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [bookingPage, setBookingPage] = useState(1);
  const [feePage, setFeePage] = useState(1);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");
  const [feeStatusFilter, setFeeStatusFilter] = useState("All");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [bookingList, invoiceList, accounts, residents, contracts] =
        await Promise.all([
          getAllBookings(),
          getAllServiceInvoices(),
          getAccounts(),
          getResidents(),
          getAllContracts(),
        ]);

      const accountMap = new Map(
        accounts.map((account) => [account.id, account]),
      );
      const residentMap = new Map(
        residents.map((resident) => [
          resident?.account?.id ?? resident?.accountId,
          resident,
        ]),
      );
      const contractMap = new Map();

      contracts.forEach((contract) => {
        const accountId = contract?.account?.id ?? contract?.accountId;
        if (!accountId || contractMap.has(accountId)) return;
        contractMap.set(accountId, contract);
      });

      const normalizedBookings = bookingList.map((booking) => ({
        id: booking.id,
        resident: getResidentName(
          booking?.account?.id ?? booking?.accountId,
          residentMap,
          accountMap,
        ),
        service: getServiceNameFromBooking(booking),
        date: formatDateTime(booking?.bookFrom),
        time:
          booking?.bookFrom && booking?.bookTo
            ? `${formatDateTime(booking.bookFrom)} - ${formatDateTime(booking.bookTo)}`
            : "N/A",
        status: getBookingStatusMeta(booking?.status),
        sortPriority: getBookingSortPriority(booking?.status),
        sortTimestamp: toTimestamp(
          booking?.createdAt ||
          booking?.updatedAt ||
          booking?.bookFrom ||
          booking?.bookTo,
        ),
        raw: booking,
      }));

      const bookingMap = new Map(
        bookingList.map((booking) => [booking.id, booking]),
      );
      const normalizedFees = invoiceList.map((invoice) => {
        const booking = bookingMap.get(invoice?.bookingService?.id);
        const accountId =
          booking?.account?.id ??
          booking?.accountId ??
          invoice?.bookingService?.account?.id;

        return {
          id: invoice.id,
          resident: getResidentName(accountId, residentMap, accountMap),
          apartment: getApartmentLabel(accountId, contractMap),
          service: getServiceNameFromBooking(
            booking || invoice?.bookingService,
          ),
          amount: CURRENCY_FORMATTER.format(Number(invoice?.amount ?? 0)),
          status: getInvoiceStatusMeta(invoice?.status),
          date: formatDateTime(invoice?.paymentDate || invoice?.createdAt),
          sortPriority: Number(invoice?.status) === 1 ? 1 : 0,
          sortTimestamp: toTimestamp(
            invoice?.createdAt ||
            invoice?.updatedAt ||
            invoice?.paymentDate ||
            booking?.bookFrom,
          ),
        };
      });

      setBookings(normalizedBookings);
      setServiceFees(normalizedFees);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
        "Unable to load service bookings and fee statistics from backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const bookingCategories = useMemo(
    () => ["All", ...Array.from(new Set(bookings.map((item) => item.service)))],
    [bookings],
  );

  const feeCategories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(serviceFees.map((item) => item.service))),
    ],
    [serviceFees],
  );

  const filteredBookings = bookings.filter((booking) => {
    const matchesService = bookingFilter === "All" || booking.service === bookingFilter;
    const matchesStatus = bookingStatusFilter === "All" || booking.status.label === bookingStatusFilter;
    return matchesService && matchesStatus;
  });

  const filteredFees = serviceFees.filter((fee) => {
    const matchesService = feeFilter === "All" || fee.service === feeFilter;
    const matchesStatus = feeStatusFilter === "All" || fee.status.label === feeStatusFilter;
    return matchesService && matchesStatus;
  });

  const sortedBookings = [...filteredBookings].sort((left, right) =>
    comparePriorityThenNewest(
      left.sortPriority,
      right.sortPriority,
      left.sortTimestamp,
      right.sortTimestamp,
    ),
  );

  const sortedFees = [...filteredFees].sort((left, right) =>
    comparePriorityThenNewest(
      left.sortPriority,
      right.sortPriority,
      left.sortTimestamp,
      right.sortTimestamp,
    ),
  );

  useEffect(() => {
    setBookingPage(1);
  }, [bookingFilter, bookingStatusFilter, bookings.length]);

  useEffect(() => {
    setFeePage(1);
  }, [feeFilter, feeStatusFilter, serviceFees.length]);

  const paginatedBookings = sortedBookings.slice(
    (bookingPage - 1) * 8,
    bookingPage * 8,
  );
  const bookingTotalPages = Math.max(1, Math.ceil(sortedBookings.length / 8));

  const paginatedFees = sortedFees.slice((feePage - 1) * 8, feePage * 8);
  const feeTotalPages = Math.max(1, Math.ceil(sortedFees.length / 8));

  const handleStatusUpdate = async (bookingItem, nextStatus) => {
    try {
      setIsUpdating(true);
      await updateBookingById(
        bookingItem.id,
        buildBookingUpdatePayload(bookingItem, nextStatus),
      );
      await loadData();
    } catch (updateError) {
      setError(
        updateError?.response?.data?.message ||
        updateError?.response?.data?.error ||
        "Could not update booking status on the backend.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="staff-content-area" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {activeTab === "bookings" && (
        <div className="staff-tab-content">
          {/* MODERN BANNER */}
          <div className="account-banner-container" style={{ justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <div className="account-banner-icon-box">
                <FaCalendarCheck />
              </div>
              <div className="account-banner-info-group">
                <p>FACILITY BOOKING MANAGEMENT</p>
                <h3 style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  {filteredBookings.length} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Matching Requests</span>
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>FILTER STATUS</span>
              <select
                className="banner-status-select"
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Denied">Denied</option>
              </select>
            </div>
          </div>

          <div className="staff-sub-nav">
            {bookingCategories.map((category) => (
              <div
                key={category}
                className={`sub-nav-item ${bookingFilter === category ? "active" : ""}`}
                onClick={() => setBookingFilter(category)}
              >
                {category === "All" ? (
                  "All Services"
                ) : (
                  <>
                    {getServiceIcon(category)} {category}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="admin-table-wrapper gold-border" style={{ marginTop: '10px' }}>
            <div className="resident-list-header">
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCalendarCheck /> Amenity Booking Requests
              </h4>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-custom-table bordered">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>RESIDENT</th>
                    <th style={{ width: '18%' }}>SERVICE</th>
                    <th style={{ width: '18%' }}>START TIME</th>
                    <th style={{ width: '22%' }}>FULL SCHEDULE</th>
                    <th style={{ width: '12%', textAlign: "center" }}>STATUS</th>
                    <th style={{ width: '12%', textAlign: "center" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                        Fetching live booking requests...
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                        <FaInfoCircle style={{ marginRight: "10px" }} />
                        No booking requests found for {bookingFilter}.
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{booking.resident}</span>
                        </td>
                        <td>
                          <div className="service-row-item">
                            {getServiceIcon(booking.service)} {booking.service}
                          </div>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '13.5px' }}>{booking.date}</td>
                        <td style={{ color: '#64748b', fontSize: '13.5px' }}>{booking.time}</td>
                        <td style={{ textAlign: "center" }}>
                          <span className={`status-badge ${booking.status.className}`}>
                            {booking.status.label}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {booking.status.label === "Pending" ? (
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                              <button
                                className="action-btn-circle approve"
                                title="Approve Request"
                                onClick={() => handleStatusUpdate(booking, 1)}
                                disabled={isUpdating}
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="action-btn-circle deny"
                                title="Deny Request"
                                onClick={() => handleStatusUpdate(booking, 2)}
                                disabled={isUpdating}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <span className="action-processed-text">PROCESSED</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
              <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                Showing {filteredBookings.length > 0 ? ((bookingPage - 1) * 8) + 1 : 0}-{Math.min(bookingPage * 8, filteredBookings.length)} of {filteredBookings.length} records
              </div>
              <AdminPagination
                currentPage={bookingPage}
                totalPages={bookingTotalPages}
                onPageChange={setBookingPage}
                totalItems={filteredBookings.length}
                pageSize={8}
                itemLabel="bookings"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "fees" && (
        <div className="staff-tab-content">
          {/* MODERN BANNER */}
          <div className="account-banner-container" style={{ justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <div className="account-banner-icon-box">
                <FaCreditCard />
              </div>
              <div className="account-banner-info-group">
                <p>SERVICE FEE STATISTICS</p>
                <h3 style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  {filteredFees.length} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Matching Invoices</span>
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>PAYMENT STATE</span>
              <select
                className="banner-status-select"
                value={feeStatusFilter}
                onChange={(e) => setFeeStatusFilter(e.target.value)}
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="staff-sub-nav">
            {feeCategories.map((category) => (
              <div
                key={category}
                className={`sub-nav-item ${feeFilter === category ? "active" : ""}`}
                onClick={() => setFeeFilter(category)}
              >
                {category === "All" ? (
                  "All Services"
                ) : (
                  <>
                    {getServiceIcon(category)} {category}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="admin-table-wrapper gold-border" style={{ marginTop: '10px' }}>
            <div className="resident-list-header">
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCreditCard /> Service Revenue & Invoices
              </h4>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-custom-table bordered">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>RESIDENT</th>
                    <th style={{ width: '12%' }}>APARTMENT</th>
                    <th style={{ width: '20%' }}>SERVICE USED</th>
                    <th style={{ width: '15%' }}>AMOUNT</th>
                    <th style={{ width: '18%' }}>USAGE DATE</th>
                    <th style={{ width: '17%', textAlign: "center" }}>PAYMENT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                        Loading financial records...
                      </td>
                    </tr>
                  ) : filteredFees.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                        <FaInfoCircle style={{ marginRight: "10px" }} />
                        No fee records found for {feeFilter}.
                      </td>
                    </tr>
                  ) : (
                    paginatedFees.map((fee) => (
                      <tr key={fee.id}>
                        <td>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{fee.resident}</span>
                        </td>
                        <td>
                          <span className="apartment-tag-orange">{fee.apartment}</span>
                        </td>
                        <td>
                          <div className="service-row-item">
                            {getServiceIcon(fee.service)} {fee.service}
                          </div>
                        </td>
                        <td>
                          <span className="service-fee-amount">
                            {fee.amount.replace("₫", "đ")}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '13.5px' }}>{fee.date}</td>
                        <td style={{ textAlign: "center" }}>
                          <span className={`status-badge ${fee.status.className}`}>
                            {fee.status.label}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
              <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                Showing {filteredFees.length > 0 ? ((feePage - 1) * 8) + 1 : 0}-{Math.min(feePage * 8, filteredFees.length)} of {filteredFees.length} records
              </div>
              <AdminPagination
                currentPage={feePage}
                totalPages={feeTotalPages}
                onPageChange={setFeePage}
                totalItems={filteredFees.length}
                pageSize={8}
                itemLabel="fee records"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StaffServiceMainContent;

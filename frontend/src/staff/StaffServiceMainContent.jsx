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
  return <FaCalendarCheck />;
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return DATE_TIME_FORMATTER.format(parsed);
};

const getBookingStatusMeta = (status) => {
  if (Number(status) === 1) return { label: "Approved", className: "approved" };
  if (Number(status) === 2) return { label: "Denied", className: "deny" };
  return { label: "Pending", className: "pending" };
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

  const filteredBookings =
    bookingFilter === "All"
      ? bookings
      : bookings.filter((booking) => booking.service === bookingFilter);

  const filteredFees =
    feeFilter === "All"
      ? serviceFees
      : serviceFees.filter((fee) => fee.service === feeFilter);

  useEffect(() => {
    setBookingPage(1);
  }, [bookingFilter, bookings.length]);

  useEffect(() => {
    setFeePage(1);
  }, [feeFilter, serviceFees.length]);

  const paginatedBookings = filteredBookings.slice(
    (bookingPage - 1) * 8,
    bookingPage * 8,
  );
  const bookingTotalPages = Math.max(1, Math.ceil(filteredBookings.length / 8));

  const paginatedFees = filteredFees.slice((feePage - 1) * 8, feePage * 8);
  const feeTotalPages = Math.max(1, Math.ceil(filteredFees.length / 8));

  const handleStatusUpdate = async (bookingItem, nextStatus) => {
    try {
      setIsUpdating(true);
      await updateBookingById(bookingItem.id, { status: nextStatus });
      await loadData();
    } catch (updateError) {
      setError(
        updateError?.response?.data?.message ||
          "Could not update booking status on the backend.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="staff-content-area">
      {activeTab === "bookings" && (
        <div className="staff-tab-content">
          <div
            className="staff-form-container"
            style={{ borderLeft: "5px solid #c89b3c" }}
          >
            <h3>
              <FaCalendarCheck /> Amenity Booking Management
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Review and manage resident requests using live backend booking
              data.
            </p>

            {error ? (
              <div
                className="admin-feedback error"
                style={{ marginBottom: "16px" }}
              >
                {error}
              </div>
            ) : null}

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

            <div className="staff-table-scroll">
              <table className="admin-custom-table bordered">
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Service</th>
                    <th>Start Time</th>
                    <th>Schedule</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        Loading live backend bookings...
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          color: "#94a3b8",
                          padding: "40px",
                        }}
                      >
                        <FaInfoCircle style={{ marginRight: "10px" }} />
                        No bookings found for {bookingFilter}.
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong>{booking.resident}</strong>
                        </td>
                        <td>
                          <div className="service-row-item">
                            {getServiceIcon(booking.service)} {booking.service}
                          </div>
                        </td>
                        <td>{booking.date}</td>
                        <td>{booking.time}</td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            className={`status-badge ${booking.status.className}`}
                          >
                            {booking.status.label}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {booking.status.label === "Pending" ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                className="action-btn-circle approve"
                                title="Approve"
                                onClick={() => handleStatusUpdate(booking, 1)}
                                disabled={isUpdating}
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="action-btn-circle deny"
                                title="Deny"
                                onClick={() => handleStatusUpdate(booking, 2)}
                                disabled={isUpdating}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <span className="action-processed-text">
                              Processed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
      )}

      {activeTab === "fees" && (
        <div className="staff-tab-content">
          <div
            className="staff-form-container"
            style={{ borderLeft: "5px solid #c89b3c" }}
          >
            <h3>
              <FaCreditCard /> Service Fee Statistics
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Track facility usage fees and payment history from the backend
              service invoices.
            </p>

            {error ? (
              <div
                className="admin-feedback error"
                style={{ marginBottom: "16px" }}
              >
                {error}
              </div>
            ) : null}

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

            <div className="staff-table-scroll">
              <table className="admin-custom-table bordered">
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Apartment</th>
                    <th>Service Used</th>
                    <th>Amount</th>
                    <th>Usage Date</th>
                    <th style={{ textAlign: "center" }}>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        Loading live fee statistics...
                      </td>
                    </tr>
                  ) : filteredFees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          color: "#94a3b8",
                          padding: "40px",
                        }}
                      >
                        <FaInfoCircle style={{ marginRight: "10px" }} />
                        No fee records found for {feeFilter}.
                      </td>
                    </tr>
                  ) : (
                    paginatedFees.map((fee) => (
                      <tr key={fee.id}>
                        <td>
                          <strong>{fee.resident}</strong>
                        </td>
                        <td>{fee.apartment}</td>
                        <td>
                          <div className="service-row-item">
                            {getServiceIcon(fee.service)} {fee.service}
                          </div>
                        </td>
                        <td
                          style={{
                            fontWeight: "800",
                            color: "#0f172a",
                            fontSize: "15px",
                          }}
                        >
                          {fee.amount}
                        </td>
                        <td>{fee.date}</td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            className={`status-badge ${fee.status.className}`}
                          >
                            {fee.status.label}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
      )}
    </main>
  );
};

export default StaffServiceMainContent;

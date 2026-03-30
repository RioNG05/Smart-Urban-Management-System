import React, { useEffect, useMemo, useState } from "react";
import {
  FaUserPlus,
  FaHistory,
  FaExclamationCircle,
  FaShieldAlt,
  FaPhoneAlt,
  FaFireExtinguisher,
  FaAmbulance,
  FaUserTie,
} from "react-icons/fa";
import { getApartments } from "../services/apartmentService";
import {
  createVisitor,
  getAllStaff,
  getAllVisitors,
} from "../services/adminService";
import AdminPagination from "../components/common/AdminPagination";

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return DATE_TIME_FORMATTER.format(parsed);
};

const StaffSecurityMainContent = ({ activeTab }) => {
  const [visitors, setVisitors] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [visitorForm, setVisitorForm] = useState({
    visitorName: "",
    phoneNumber: "",
    apartmentId: "",
    staffId: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadVisitors = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [visitorList, apartmentList, staffList] = await Promise.all([
        getAllVisitors(),
        getApartments(),
        getAllStaff(),
      ]);

      setVisitors(visitorList);
      setApartments(apartmentList);
      setStaffMembers(staffList);
      setVisitorForm((current) => ({
        ...current,
        apartmentId: current.apartmentId || String(apartmentList[0]?.id ?? ""),
        staffId: current.staffId || String(staffList[0]?.id ?? ""),
      }));
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Unable to load visitor management data from backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "visitors") {
      loadVisitors();
    }
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [visitors.length]);

  const apartmentMap = useMemo(
    () =>
      new Map(apartments.map((apartment) => [String(apartment.id), apartment])),
    [apartments],
  );

  const staffMap = useMemo(
    () => new Map(staffMembers.map((staff) => [String(staff.id), staff])),
    [staffMembers],
  );

  const handleCheckIn = async () => {
    if (
      !visitorForm.visitorName ||
      !visitorForm.phoneNumber ||
      !visitorForm.apartmentId ||
      !visitorForm.staffId
    ) {
      setError("Please fill visitor name, phone number, apartment, and staff.");
      setSuccess("");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      await createVisitor({
        visitorName: visitorForm.visitorName,
        phoneNumber: visitorForm.phoneNumber,
        apartmentId: Number(visitorForm.apartmentId),
        staffId: Number(visitorForm.staffId),
        note: visitorForm.note,
      });

      setSuccess("Visitor check-in has been saved to backend.");
      setVisitorForm((current) => ({
        ...current,
        visitorName: "",
        phoneNumber: "",
        note: "",
      }));
      await loadVisitors();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          "Could not save visitor check-in to backend.",
      );
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const emergencyContacts = [
    { name: "Local Police", phone: "113", icon: <FaShieldAlt /> },
    { name: "Fire Department", phone: "114", icon: <FaFireExtinguisher /> },
    { name: "Ambulance", phone: "115", icon: <FaAmbulance /> },
    { name: "Building Manager", phone: "0836 160 161", icon: <FaUserTie /> },
  ];

  const paginatedVisitors = visitors.slice(
    (currentPage - 1) * 8,
    currentPage * 8,
  );
  const totalPages = Math.max(1, Math.ceil(visitors.length / 8));

  return (
    <main className="staff-content-area">
      {activeTab === "visitors" && (
        <div className="staff-tab-content">
          <div
            className="staff-form-container"
            style={{ borderLeft: "5px solid #c89b3c" }}
          >
            <h3>
              <FaUserPlus /> Register New Visitor
            </h3>

            {error ? (
              <div
                className="admin-feedback error"
                style={{ marginTop: "16px" }}
              >
                {error}
              </div>
            ) : null}
            {success ? (
              <div
                className="admin-feedback success"
                style={{ marginTop: "16px" }}
              >
                {success}
              </div>
            ) : null}

            <div className="staff-grid" style={{ marginTop: "20px" }}>
              <div className="form-group">
                <label>VISITOR NAME</label>
                <input
                  type="text"
                  placeholder="Full name..."
                  value={visitorForm.visitorName}
                  onChange={(event) =>
                    setVisitorForm((current) => ({
                      ...current,
                      visitorName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>PHONE NUMBER</label>
                <input
                  type="text"
                  placeholder="Phone number..."
                  value={visitorForm.phoneNumber}
                  onChange={(event) =>
                    setVisitorForm((current) => ({
                      ...current,
                      phoneNumber: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>VISIT APARTMENT</label>
                <select
                  value={visitorForm.apartmentId}
                  onChange={(event) =>
                    setVisitorForm((current) => ({
                      ...current,
                      apartmentId: event.target.value,
                    }))
                  }
                >
                  {apartments.map((apartment) => (
                    <option key={apartment.id} value={apartment.id}>
                      Room {apartment.roomNumber} - Floor{" "}
                      {apartment.floorNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>ASSIGNED STAFF</label>
                <select
                  value={visitorForm.staffId}
                  onChange={(event) =>
                    setVisitorForm((current) => ({
                      ...current,
                      staffId: event.target.value,
                    }))
                  }
                >
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.fullName || `Staff #${staff.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>PURPOSE / NOTE</label>
                <input
                  type="text"
                  placeholder="Visit purpose, delivery note, or context..."
                  value={visitorForm.note}
                  onChange={(event) =>
                    setVisitorForm((current) => ({
                      ...current,
                      note: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <button
              className="btn-add-resident"
              style={{ marginTop: "20px" }}
              onClick={handleCheckIn}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "SAVING..." : "CHECK-IN VISITOR"}
            </button>
          </div>

          <div className="staff-form-container" style={{ marginTop: "30px" }}>
            <h3>
              <FaHistory /> Visitor Logs
            </h3>
            <div className="staff-table-scroll">
              <table
                className="admin-custom-table bordered"
                style={{ marginTop: "20px" }}
              >
                <thead>
                  <tr>
                    <th>Visitor Name</th>
                    <th>Phone Number</th>
                    <th>Apartment</th>
                    <th>Assigned Staff</th>
                    <th>Purpose / Note</th>
                    <th>Created At</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        Loading visitor logs from backend...
                      </td>
                    </tr>
                  ) : visitors.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        No visitor logs found in backend.
                      </td>
                    </tr>
                  ) : (
                    paginatedVisitors.map((visitor) => {
                      const apartment = apartmentMap.get(
                        String(visitor?.apartment?.id ?? visitor?.apartmentId),
                      );
                      const staff = staffMap.get(
                        String(visitor?.staff?.id ?? visitor?.staffId),
                      );

                      return (
                        <tr key={visitor.id}>
                          <td>
                            <strong>{visitor.visitorName}</strong>
                          </td>
                          <td>{visitor.phoneNumber || "N/A"}</td>
                          <td>
                            {apartment
                              ? `Room ${apartment.roomNumber} - Floor ${apartment.floorNumber}`
                              : visitor?.apartment?.roomNumber ||
                                visitor?.apartmentId ||
                                "N/A"}
                          </td>
                          <td>
                            {staff?.fullName ||
                              visitor?.staff?.fullName ||
                              visitor?.staffId ||
                              "N/A"}
                          </td>
                          <td>{visitor.note || "N/A"}</td>
                          <td>
                            {formatDateTime(
                              visitor.createdAt || visitor.updatedAt,
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                background: "#fef3c7",
                                color: "#92400e",
                              }}
                            >
                              Registered
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={visitors.length}
              pageSize={8}
              itemLabel="visitors"
            />
          </div>
        </div>
      )}

      {activeTab === "incidents" && (
        <div className="staff-tab-content">
          <div className="staff-form-container">
            <h3>
              <FaExclamationCircle /> Incident Tracking
            </h3>
            <p style={{ color: "#64748b" }}>
              This tab is not part of the current admin integration scope.
            </p>
          </div>
        </div>
      )}

      {activeTab === "emergency" && (
        <div className="staff-tab-content">
          <div className="staff-grid">
            <div
              className="staff-form-container"
              style={{ borderTop: "5px solid #ef4444" }}
            >
              <h3>
                <FaExclamationCircle /> Emergency Contacts
              </h3>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "15px",
                      background: "#fff5f5",
                      borderRadius: "8px",
                      border: "1px solid #fee2e2",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div style={{ color: "#ef4444", fontSize: "1.2rem" }}>
                        {contact.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold" }}>{contact.name}</div>
                        <div
                          style={{
                            color: "#ef4444",
                            fontWeight: "800",
                            fontSize: "1.1rem",
                          }}
                        >
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        padding: "8px 15px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FaPhoneAlt /> CALL
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StaffSecurityMainContent;

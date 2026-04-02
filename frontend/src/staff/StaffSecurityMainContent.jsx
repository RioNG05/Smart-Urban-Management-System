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
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    <main className="staff-content-area" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {activeTab === "visitors" && (
        <div className="staff-tab-content">
          {/* NEW MODERN COMPACT BANNER WITH SEARCH */}
          <div className="account-banner-container" style={{ justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <div className="account-banner-icon-box">
                <FaUserPlus />
              </div>
              <div className="account-banner-info-group">
                <p>VISITOR ACCESS CONTROL</p>
                <h3 style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  {visitors.length} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Total visitors registered in logs</span>
                </h3>
              </div>
            </div>

            <button
              className={`admin-btn-add ${showCreateForm ? 'active' : ''}`}
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                width: 'auto',
                padding: '0 20px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '700',
                background: showCreateForm ? '#ef4444' : 'var(--admin-primary)',
                borderRadius: '10px'
              }}
            >
              {showCreateForm ? 'CLOSE FORM' : '+ REGISTER VISITOR'}
            </button>
          </div>

          {/* FORM SECTION - ISSUING ENTRY */}
          {showCreateForm && (
            <div
              className="staff-form-container"
              style={{
                padding: '45px',
                borderRadius: '28px',
                marginBottom: '40px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                background: 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  background: 'var(--admin-primary-light)',
                  color: 'var(--admin-primary)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  <FaShieldAlt />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, fontSize: '20px', color: 'var(--admin-text-main)' }}>
                    Secure Visitor Entry Registration
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                    Issuing temporary building access for authorized guest visitation.
                  </p>
                </div>
              </div>

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

              <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px 35px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>VISITOR FULL NAME</label>
                  <input
                    className="professional-form-input"
                    type="text"
                    placeholder="Enter full name..."
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
                  <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>CONTACT PHONE NUMBER</label>
                  <input
                    className="professional-form-input"
                    type="text"
                    placeholder="Enter phone number..."
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
                  <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>ASSIGNED APARTMENT</label>
                  <select
                    className="professional-form-input"
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
                        Unit {apartment.roomNumber} - Floor {apartment.floorNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>VISITATION PURPOSE / NOTE</label>
                  <input
                    className="professional-form-input"
                    type="text"
                    placeholder="Context (e.g. Delivery, Guest, Maintenance)..."
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '45px', borderTop: '1px solid var(--admin-border-soft)', paddingTop: '30px' }}>
                <button
                  className="admin-btn-add"
                  style={{
                    width: 'auto',
                    padding: '0 50px',
                    height: '52px',
                    fontSize: '15px',
                    fontWeight: 800,
                    borderRadius: '16px',
                    letterSpacing: '0.5px'
                  }}
                  onClick={handleCheckIn}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? "PROCESSING..." : "CHECK-IN VISITOR"}
                </button>
              </div>
            </div>
          )}

          <div className="admin-table-wrapper" style={{ marginTop: "30px", borderLeft: '6px solid #c98b3c' }}>
            <div className="resident-list-header">
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaHistory /> Visitor Access Logs
              </h4>
            </div>
            <div className="admin-table-scroll">
              <table
                className="admin-custom-table bordered"
              >

                <thead>
                  <tr>
                    <th>Visitor Name</th>
                    <th>Phone Number</th>
                    <th>Apartment</th>
                    <th>Purpose / Note</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        Loading visitor logs from backend...
                      </td>
                    </tr>
                  ) : visitors.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
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
                          <td>{visitor.note || "N/A"}</td>
                          <td>
                            {formatDateTime(
                              visitor.createdAt || visitor.updatedAt,
                            )}
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

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
  deleteVisitorById,
  updateVisitorById,
} from "../services/adminService";
import { getUser } from "../services/authService";
import api from "../services/api";
import AdminPagination from "../components/common/AdminPagination";
import { toast } from "react-toastify";

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

const toSafeArray = (value) => (Array.isArray(value) ? value : []);

const extractFirstJsonBlock = (text) => {
  if (typeof text !== "string") return text;

  const source = text.trim().replace(/^\uFEFF/, "");
  const startChar = source[0];

  if (startChar !== "[" && startChar !== "{") {
    return text;
  }

  const closingChar = startChar === "[" ? "]" : "}";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === startChar) {
      depth += 1;
      continue;
    }

    if (char === closingChar) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(0, index + 1);
      }
    }
  }

  return source;
};

const parseJsonString = (value) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value.trim().replace(/^\uFEFF/, ""));
  } catch {
    try {
      return JSON.parse(extractFirstJsonBlock(value));
    } catch {
      return value;
    }
  }
};

const extractCollection = (payload) => {
  const normalizedPayload = parseJsonString(payload);

  if (Array.isArray(normalizedPayload)) return normalizedPayload;
  if (Array.isArray(normalizedPayload?.result)) return normalizedPayload.result;
  if (Array.isArray(normalizedPayload?.content)) return normalizedPayload.content;
  if (Array.isArray(normalizedPayload?.data)) return normalizedPayload.data;
  if (Array.isArray(normalizedPayload?.items)) return normalizedPayload.items;
  return [];
};

const decodeJsonStringValue = (value) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(`"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
  } catch {
    return value;
  }
};

const extractVisitorsFromMalformedText = (text) => {
  if (typeof text !== "string") return [];

  const matches = text.matchAll(
    /"id":(\d+),"visitorName":"((?:\\.|[^"\\])*)","identityCard":"((?:\\.|[^"\\])*)","phoneNumber":"((?:\\.|[^"\\])*)","apartment":\{"id":(\d+),"roomNumber":(\d+),"floorNumber":(\d+)/g,
  );

  const visitorMap = new Map();

  for (const match of matches) {
    const [
      ,
      id,
      visitorName,
      identityCard,
      phoneNumber,
      apartmentId,
      roomNumber,
      floorNumber,
    ] = match;

    if (!visitorMap.has(id)) {
      visitorMap.set(id, {
        id: Number(id),
        visitorName: decodeJsonStringValue(visitorName),
        identityCard: decodeJsonStringValue(identityCard),
        phoneNumber: decodeJsonStringValue(phoneNumber),
        apartmentId: Number(apartmentId),
        apartment: {
          id: Number(apartmentId),
          roomNumber: Number(roomNumber),
          floorNumber: Number(floorNumber),
        },
        note: "",
      });
    }
  }

  return Array.from(visitorMap.values());
};

const extractStaffFromMalformedText = (text) => {
  if (typeof text !== "string") return [];

  const matches = text.matchAll(
    /"id":(\d+),"fullName":"((?:\\.|[^"\\])*)","gender":"((?:\\.|[^"\\])*)","dateOfBirth":"([^"]*)","identityId":"([^"]*)","account":\{"id":(\d+)/g,
  );

  const staffMap = new Map();

  for (const match of matches) {
    const [, id, fullName, gender, dateOfBirth, identityId, accountId] = match;

    if (!staffMap.has(id)) {
      staffMap.set(id, {
        id: Number(id),
        fullName: decodeJsonStringValue(fullName),
        gender: decodeJsonStringValue(gender),
        dateOfBirth,
        identityId,
        account: {
          id: Number(accountId),
        },
      });
    }
  }

  return Array.from(staffMap.values());
};

const getCurrentStaffId = (staffList) => {
  const currentUser = getUser();
  const currentAccountId = currentUser?.id;

  if (!currentAccountId) {
    return staffList[0]?.id ? String(staffList[0].id) : "";
  }

  const matchedStaff = staffList.find(
    (staff) => String(staff?.account?.id ?? "") === String(currentAccountId),
  );

  return matchedStaff?.id
    ? String(matchedStaff.id)
    : (staffList[0]?.id ? String(staffList[0].id) : "");
};

const StaffSecurityMainContent = ({ activeTab }) => {
  const [visitors, setVisitors] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [editingVisitorId, setEditingVisitorId] = useState(null);
  const [visitorForm, setVisitorForm] = useState({
    visitorName: "",
    identityCard: "",
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

  const isMalformedResponseSuccess = (error) =>
    String(error?.response?.data?.message ?? "").includes("Could not write JSON");

  const loadVisitors = async () => {
    try {
      setIsLoading(true);
      setError("");

      const visitorsRequest = api.get("/visitors", { skipAuth: true });
      const staffRequest = api.get("/staff", { skipAuth: true });
      const [visitorResult, apartmentResult, staffResult] = await Promise.allSettled([
        visitorsRequest,
        getApartments(),
        staffRequest,
      ]);

      const visitorRawText =
        visitorResult.status === "fulfilled" &&
        typeof visitorResult.value?.data === "string"
          ? visitorResult.value.data
          : null;
      const staffRawText =
        staffResult.status === "fulfilled" &&
        typeof staffResult.value?.data === "string"
          ? staffResult.value.data
          : null;
      const visitorRawData =
        visitorResult.status === "fulfilled"
          ? parseJsonString(visitorResult.value?.data)
          : null;
      const apartmentRawData =
        apartmentResult.status === "fulfilled"
          ? parseJsonString(apartmentResult.value)
          : null;
      const staffRawData =
        staffResult.status === "fulfilled"
          ? parseJsonString(staffResult.value)
          : null;

      const visitorList = toSafeArray(extractCollection(visitorRawData));
      const apartmentList = toSafeArray(
        apartmentResult.status === "fulfilled" ? apartmentRawData : [],
      );
      const parsedStaffList = toSafeArray(
        staffResult.status === "fulfilled" ? extractCollection(staffRawData) : [],
      );
      const fallbackVisitorList =
        visitorList.length === 0 ? extractVisitorsFromMalformedText(visitorRawText) : [];
      const fallbackStaffList =
        parsedStaffList.length === 0 ? extractStaffFromMalformedText(staffRawText) : [];
      const finalVisitorList = visitorList.length > 0 ? visitorList : fallbackVisitorList;
      const staffList = parsedStaffList.length > 0 ? parsedStaffList : fallbackStaffList;
      const currentStaffId = getCurrentStaffId(staffList);

      setVisitors(finalVisitorList);
      setApartments(apartmentList);
      setStaffMembers(staffList);
      setVisitorForm((current) => ({
        ...current,
        apartmentId: current.apartmentId || String(apartmentList[0]?.id ?? ""),
        staffId: current.staffId || currentStaffId,
      }));

      if (visitorResult.status === "rejected") {
        throw visitorResult.reason;
      }
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

  const handleCheckIn = async () => {
    if (
      !visitorForm.visitorName ||
      !visitorForm.identityCard ||
      !visitorForm.phoneNumber ||
      !visitorForm.apartmentId ||
      !visitorForm.staffId
    ) {
      setError("Please fill visitor name, identity card, phone number, apartment, and staff.");
      setSuccess("");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        visitorName: visitorForm.visitorName,
        identityCard: visitorForm.identityCard,
        phoneNumber: visitorForm.phoneNumber,
        apartmentId: Number(visitorForm.apartmentId),
        staffId: Number(visitorForm.staffId),
        note: visitorForm.note,
      };

      let createdVisitor = null;

      try {
        createdVisitor = await createVisitor(payload);
      } catch (requestError) {
        if (!isMalformedResponseSuccess(requestError)) {
          throw requestError;
        }
      }

      if (createdVisitor?.id) {
        setVisitors((current) => [createdVisitor, ...current]);
      } else {
        setVisitors((current) => [
          {
            id: `temp-${Date.now()}`,
            visitorName: payload.visitorName,
            identityCard: payload.identityCard,
            phoneNumber: payload.phoneNumber,
            apartmentId: payload.apartmentId,
            apartment: apartmentMap.get(String(payload.apartmentId)) ?? null,
            note: payload.note,
            checkInTime: new Date().toISOString(),
            isTemporary: true,
          },
          ...current,
        ]);
      }

      setSuccess("Visitor check-in has been saved to backend.");
      toast.success("Visitor check-in saved successfully.");
      setVisitorForm((current) => ({
        ...current,
        visitorName: "",
        identityCard: "",
        phoneNumber: "",
        note: "",
      }));
      setShowCreateForm(false);
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
        "Could not save visitor check-in to backend.",
      );
      setError(
        submitError?.response?.data?.message ||
        "Could not save visitor check-in to backend.",
      );
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditingVisitor = (visitor) => {
    setEditingVisitorId(visitor.id);
    setVisitorForm({
      visitorName: visitor?.visitorName ?? "",
      identityCard: visitor?.identityCard ?? "",
      phoneNumber: visitor?.phoneNumber ?? "",
      apartmentId: String(
        visitor?.apartmentId ?? visitor?.apartment?.id ?? apartments[0]?.id ?? "",
      ),
      staffId: String(visitorForm.staffId || getCurrentStaffId(staffMembers)),
      note: visitor?.note ?? "",
    });
    setShowCreateForm(true);
    setError("");
    setSuccess("");
  };

  const resetVisitorForm = () => {
    setEditingVisitorId(null);
    setVisitorForm((current) => ({
      ...current,
      visitorName: "",
      identityCard: "",
      phoneNumber: "",
      note: "",
      apartmentId: String(apartments[0]?.id ?? current.apartmentId ?? ""),
      staffId: String(current.staffId || getCurrentStaffId(staffMembers)),
    }));
  };

  const handleUpdateVisitor = async () => {
    if (!editingVisitorId) return;

    if (
      !visitorForm.visitorName ||
      !visitorForm.identityCard ||
      !visitorForm.phoneNumber ||
      !visitorForm.apartmentId
    ) {
      setError("Please fill visitor name, identity card, phone number, and apartment.");
      setSuccess("");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        visitorName: visitorForm.visitorName,
        identityCard: visitorForm.identityCard,
        phoneNumber: visitorForm.phoneNumber,
        apartmentId: Number(visitorForm.apartmentId),
        note: visitorForm.note,
      };

      try {
        await updateVisitorById(editingVisitorId, payload);
      } catch (requestError) {
        if (!isMalformedResponseSuccess(requestError)) {
          throw requestError;
        }
      }

      setVisitors((current) =>
        current.map((visitor) =>
          visitor.id === editingVisitorId
            ? {
                ...visitor,
                visitorName: payload.visitorName,
                identityCard: payload.identityCard,
                phoneNumber: payload.phoneNumber,
                apartmentId: payload.apartmentId,
                apartment: apartmentMap.get(String(payload.apartmentId)) ?? visitor.apartment ?? null,
                note: payload.note,
              }
            : visitor,
        ),
      );

      setSuccess("Visitor record updated.");
      toast.success("Visitor updated successfully.");
      resetVisitorForm();
      setShowCreateForm(false);
    } catch (updateError) {
      toast.error(
        updateError?.response?.data?.message ||
        "Could not update visitor record.",
      );
      setError(
        updateError?.response?.data?.message ||
        "Could not update visitor record.",
      );
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVisitor = async (visitorId) => {
    try {
      setError("");
      setSuccess("");
      if (!String(visitorId).startsWith("temp-")) {
        await deleteVisitorById(visitorId);
      }
      setVisitors((current) => current.filter((visitor) => visitor.id !== visitorId));
      setSuccess("Visitor record deleted.");
      toast.success("Visitor deleted successfully.");
      if (editingVisitorId === visitorId) {
        resetVisitorForm();
        setShowCreateForm(false);
      }
    } catch (deleteError) {
      toast.error(
        deleteError?.response?.data?.message ||
        "Could not delete visitor record.",
      );
      setError(
        deleteError?.response?.data?.message ||
        "Could not delete visitor record.",
      );
      setSuccess("");
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
              onClick={() => {
                if (showCreateForm) {
                  resetVisitorForm();
                }
                setShowCreateForm(!showCreateForm);
              }}
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

          {error ? (
            <div
              className="admin-feedback error"
              style={{ marginBottom: "20px" }}
            >
              {error}
            </div>
          ) : null}

          {success && !showCreateForm ? (
            <div
              className="admin-feedback success"
              style={{ marginBottom: "20px" }}
            >
              {success}
            </div>
          ) : null}

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
                    {editingVisitorId
                      ? "Update an existing visitor record."
                      : "Issuing temporary building access for authorized guest visitation."}
                  </p>
                  {staffMembers.length > 0 ? (
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--admin-primary)', fontWeight: 700 }}>
                      Check-in staff: {staffMembers.find((staff) => String(staff.id) === String(visitorForm.staffId))?.fullName || "Assigned automatically"}
                    </p>
                  ) : null}
                </div>
              </div>

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
                  <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>IDENTITY CARD / PASSPORT</label>
                  <input
                    className="professional-form-input"
                    type="text"
                    placeholder="Enter ID card or passport..."
                    value={visitorForm.identityCard}
                    onChange={(event) =>
                      setVisitorForm((current) => ({
                        ...current,
                        identityCard: event.target.value,
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
                    disabled={apartments.length === 0}
                    onChange={(event) =>
                      setVisitorForm((current) => ({
                        ...current,
                        apartmentId: event.target.value,
                      }))
                    }
                  >
                    {apartments.length === 0 ? (
                      <option value="">No apartment data available</option>
                    ) : null}
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
                  type="button"
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
                  disabled={
                    isSubmitting ||
                    isLoading ||
                    apartments.length === 0 ||
                    staffMembers.length === 0
                  }
                  onClick={editingVisitorId ? handleUpdateVisitor : handleCheckIn}
                >
                  {isSubmitting
                    ? "PROCESSING..."
                    : editingVisitorId
                      ? "UPDATE VISITOR"
                      : "CHECK-IN VISITOR"}
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
                    <th>Identity Card</th>
                    <th>Phone Number</th>
                    <th>Apartment</th>
                    <th>Purpose / Note</th>
                    <th>Created At</th>
                    <th>Actions</th>
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

                      return (
                        <tr key={visitor.id}>
                          <td>
                            <strong>{visitor.visitorName}</strong>
                          </td>
                          <td>{visitor.identityCard || "N/A"}</td>
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
                              visitor.checkInTime ||
                              visitor.createdAt ||
                              visitor.updatedAt,
                            )}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => startEditingVisitor(visitor)}
                                style={{
                                  border: "1px solid #cbd5e1",
                                  background: "#fff",
                                  borderRadius: "8px",
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVisitor(visitor.id)}
                                style={{
                                  border: "1px solid #fecaca",
                                  background: "#fff1f2",
                                  color: "#b91c1c",
                                  borderRadius: "8px",
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            </div>
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

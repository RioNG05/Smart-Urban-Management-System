import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom"; // THÊM NÀY ĐỂ KẾT NỐI VỚI SIDEBAR
import StaffServiceMainContent from "../staff/StaffServiceMainContent";
import StaffSecurityMainContent from "../staff/StaffSecurityMainContent";
import AdminPagination from "../components/common/AdminPagination";
import "../styles/admin.css";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaLock,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSyncAlt,
  FaCreditCard,
  FaFilter,
  FaEye,
  FaPlus,
  FaTimes,
  FaBuilding,
  FaLayerGroup,
  FaWrench,
  FaStar,
  FaComments,
  FaClock,
  FaRegCommentDots,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  FaFileContract,
  FaFileUpload,
  FaImage,
  FaChevronDown,
  FaUnlock,
  FaUserEdit,
  FaUserLock,
} from "react-icons/fa";
import {
  createAccount,
  createResident,
  deleteAccountById,
  deleteResidentById,
  getAccounts,
  getContractsByAccountId,
  getResidents,
  updateAccountById,
  updateResidentById,
} from "../services/adminResidentService";
import {
  getApartments,
  getApartmentTypes,
  createApartmentType,
  updateApartmentType,
  deleteApartmentType,
} from "../services/apartmentService";
import {
  createVisitor,
  getAllBookings,
  getAllComplaints,
  getAllContracts,
  getRepliesByComplaintId,
  getAllServiceInvoices,
  getAllStaff,
  getAllUtilitiesInvoices,
  getAllVisitors,
  getStayHistoryByApartmentId,
  createReply,
  updateBookingById,
  updateComplaintById,
  updateContractById,
} from "../services/adminService";
import api from "../services/api";
import { useAuth } from "../components/sections/auth/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const paginateItems = (items, page, pageSize) =>
  items.slice((page - 1) * pageSize, page * pageSize);

const formatAdminDateTime = (value) => {
  if (!value) return "N/A";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

const formatAdminDate = (value) => {
  if (!value) return "N/A";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(parsed);
};

const getComplaintOwnerId = (complaint) =>
  complaint?.madeByUser?.id ??
  complaint?.user?.id ??
  complaint?.userId ??
  complaint?.accountId ??
  complaint?.createdBy?.id ??
  complaint?.account?.id ??
  null;

const getReplyAuthorId = (reply) =>
  reply?.user?.id ??
  reply?.userId ??
  reply?.accountId ??
  reply?.createdBy?.id ??
  null;

const getComplaintTimestamp = (record) =>
  record?.createdAt ??
  record?.updatedAt ??
  record?.createAt ??
  record?.time ??
  record?.sentAt ??
  null;

const getAdminTimestampValue = (value) => {
  if (!value) return 0;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const normalizeApartmentTypeRecord = (type, index = 0) => ({
  id: type?.id ?? `apt-type-${Date.now()}-${index}`,
  name: type?.name ?? "",
  designSqrt: String(type?.designSqrt ?? ""),
  numberOfBedroom: String(type?.numberOfBedroom ?? ""),
  numberOfBathroom: String(type?.numberOfBathroom ?? ""),
  commonPriceForBuying: String(type?.commonPriceForBuying ?? ""),
  commonPriceForRent: String(type?.commonPriceForRent ?? ""),
  furnitureTypeId: String(
    type?.furnitureTypeId ?? type?.furnitureType?.id ?? "",
  ),
  furniture:
    type?.furniture ??
    type?.furnitureType?.description ??
    type?.furnitureType?.name ??
    "",
  overview: type?.overview ?? "",
  furnitureType: type?.furnitureType ?? null,
  source: type?.source ?? "backend",
  createdAt: type?.createdAt ?? new Date().toISOString(),
  updatedAt: type?.updatedAt ?? type?.createdAt ?? new Date().toISOString(),
});


// --- ADMIN ROLE MANAGER ---
const LegacyAdminRoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadRoles = async () => {
      try {
        setIsLoading(true);
        setError("");

        const accounts = await getAccounts();

        if (!active) return;

        const groupedRoles = Array.from(
          accounts
            .reduce((map, account) => {
              const roleName = account?.role?.roleName || "UNASSIGNED";
              const current = map.get(roleName) ?? {
                id: roleName,
                name: roleName,
                permissions: Array.isArray(account?.role?.permissions)
                  ? account.role.permissions
                  : [],
                totalAccounts: 0,
                activeAccounts: 0,
                lockedAccounts: 0,
              };

              current.totalAccounts += 1;
              if (account?.isActive === false) {
                current.lockedAccounts += 1;
              } else {
                current.activeAccounts += 1;
              }

              map.set(roleName, current);
              return map;
            }, new Map())
            .values(),
        ).sort((a, b) => b.totalAccounts - a.totalAccounts);

        setRoles(groupedRoles);
      } catch (loadError) {
        if (!active) return;

        setError(
          loadError?.response?.data?.message ||
          "Could not load real role data from backend accounts.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadRoles();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="role-manager-container">
      <section
        className="create-role-section"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1000')",
        }}
      >
        <div className="create-role-content">
          <h3>System Role Access Overview</h3>
          <p
            style={{
              color: "#e2e8f0",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            This screen now summarizes real backend accounts grouped by role.
            The current backend docs do not expose a standalone role CRUD API,
            so this admin page focuses on live access distribution instead of
            local fake role editing.
          </p>
          <div
            className="checkbox-group"
            style={{ flexWrap: "wrap", gap: "12px" }}
          >
            <span className="btn-perm active">
              Roles detected: {roles.length}
            </span>
            <span className="btn-perm active">
              Active accounts:{" "}
              {roles.reduce((sum, role) => sum + role.activeAccounts, 0)}
            </span>
            <span className="btn-perm active">
              Locked accounts:{" "}
              {roles.reduce((sum, role) => sum + role.lockedAccounts, 0)}
            </span>
          </div>
          {error && (
            <p
              style={{ color: "#fecaca", fontSize: "14px", marginTop: "16px" }}
            >
              {error}
            </p>
          )}
        </div>
      </section>
      <section className="role-list-section">
        <h4>Role & Access Matrix</h4>
        <div className="admin-table-wrapper">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <strong>{role.name}</strong>
                  </td>
                  <td>
                    <div className="permission-tags">
                      {role.permissions.map((p) => (
                        <span
                          key={p}
                          className={`badge badge-${p.toLowerCase()}`}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${role.status === "Active" ? "active" : "locked"}`}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-table-lock"
                        onClick={() => toggleLockRole(role.id)}
                      >
                        {role.status === "Active" ? "🔒 Lock" : "🔓 Unlock"}
                      </button>
                      <button
                        className="btn-table-delete"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        🗑️ Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export const AdminRoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    let active = true;

    const loadRoles = async () => {
      try {
        setIsLoading(true);
        setError("");

        const accounts = await getAccounts();

        if (!active) return;

        const groupedRoles = Array.from(
          accounts
            .reduce((map, account) => {
              const roleName = account?.role?.roleName || "UNASSIGNED";
              const current = map.get(roleName) ?? {
                id: roleName,
                name: roleName,
                permissions: Array.isArray(account?.role?.permissions)
                  ? account.role.permissions
                  : [],
                totalAccounts: 0,
                activeAccounts: 0,
                lockedAccounts: 0,
              };

              current.totalAccounts += 1;
              if (account?.isActive === false) {
                current.lockedAccounts += 1;
              } else {
                current.activeAccounts += 1;
              }

              map.set(roleName, current);
              return map;
            }, new Map())
            .values(),
        ).sort((a, b) => b.totalAccounts - a.totalAccounts);

        setRoles(groupedRoles);
      } catch (loadError) {
        if (!active) return;

        setError(
          loadError?.response?.data?.message ||
          "Could not load real role data from backend accounts.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadRoles();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [roles.length]);

  const paginatedRoles = paginateItems(roles, currentPage, pageSize);
  const totalPages = Math.max(1, Math.ceil(roles.length / pageSize));

  return (
    <div className="role-manager-container">
      <section
        className="create-role-section"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1000')",
        }}
      >
        <div className="create-role-content">
          <h3>System Role Access Overview</h3>
          <p
            style={{
              color: "#e2e8f0",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            This screen now summarizes real backend accounts grouped by role.
            The current backend docs do not expose a standalone role CRUD API,
            so this admin page focuses on live access distribution instead of
            local fake role editing.
          </p>
          <div
            className="checkbox-group"
            style={{ flexWrap: "wrap", gap: "12px" }}
          >
            <span className="btn-perm active">
              Roles detected: {roles.length}
            </span>
            <span className="btn-perm active">
              Active accounts:{" "}
              {roles.reduce((sum, role) => sum + role.activeAccounts, 0)}
            </span>
            <span className="btn-perm active">
              Locked accounts:{" "}
              {roles.reduce((sum, role) => sum + role.lockedAccounts, 0)}
            </span>
          </div>
          {error ? (
            <p
              style={{ color: "#fecaca", fontSize: "14px", marginTop: "16px" }}
            >
              {error}
            </p>
          ) : null}
        </div>
      </section>
      <section className="role-list-section">
        <h4>Role & Access Matrix</h4>
        <div className="admin-table-wrapper">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Permissions</th>
                <th>Accounts</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    Loading role data from backend...
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    No role-linked accounts were returned by the backend.
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role) => (
                  <tr key={role.id}>
                    <td>
                      <strong>{role.name}</strong>
                    </td>
                    <td>
                      <div className="permission-tags">
                        {(role.permissions.length > 0
                          ? role.permissions
                          : ["No permission list exposed by API"]
                        ).map((permission) => (
                          <span
                            key={permission}
                            className={`badge badge-${String(permission)
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")}`}
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong>{role.totalAccounts}</strong>
                    </td>
                    <td>
                      <span className="status-badge active">
                        {role.activeAccounts} active
                      </span>
                      <span
                        className="status-badge locked"
                        style={{ marginLeft: "8px" }}
                      >
                        {role.lockedAccounts} locked
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={roles.length}
          pageSize={pageSize}
          itemLabel="roles"
        />
      </section>
    </div>
  );
};

// --- ADMIN LOCK RESIDENT ---
export const AdminLockResident = () => {
  const emptyForm = {
    residentId: null,
    accountId: null,
    fullName: "",
    gender: "",
    dateOfBirth: "",
    identityId: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    isActive: true,
    apartment: "",
  };

  const [residents, setResidents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditMode(false);
  };

  const normalizeResidentRecord = (resident, accountMap, contractsMap) => {
    const accountId = resident?.account?.id ?? resident?.accountId ?? null;
    const account = accountMap.get(accountId) ?? resident?.account ?? null;
    const contracts = contractsMap.get(accountId) ?? [];

    return {
      residentId: resident?.id ?? null,
      accountId,
      fullName: resident?.fullName ?? "",
      gender: resident?.gender ?? "",
      dateOfBirth: resident?.dateOfBirth ?? "",
      identityId: resident?.identityId ?? "",
      phoneNumber: resident?.phoneNumber ?? "",
      email: account?.email ?? "",
      username: account?.username ?? "",
      roleName: account?.role?.roleName ?? "RESIDENT",
      isActive: account?.isActive ?? false,
      apartments: contracts.map((contract) => ({
        contractId: contract?.id,
        roomNumber:
          contract?.apartment?.roomNumber ?? contract?.apartmentId ?? "N/A",
        floorNumber: contract?.apartment?.floorNumber ?? null,
        contractType: contract?.contractType ?? "Unknown",
        status: contract?.status,
      })),
    };
  };

  const loadResidentData = async () => {
    setIsLoading(true);

    try {
      const [residentList, accountList] = await Promise.all([
        getResidents(),
        getAccounts(),
      ]);
      const accountMap = new Map(
        accountList.map((account) => [account.id, account]),
      );

      const contractResponses = await Promise.all(
        residentList.map(async (resident) => {
          const accountId = resident?.account?.id ?? resident?.accountId;

          if (!accountId) {
            return [null, []];
          }

          try {
            const contracts = await getContractsByAccountId(accountId);
            return [accountId, contracts];
          } catch (error) {
            return [accountId, []];
          }
        }),
      );

      const contractsMap = new Map(
        contractResponses.filter(([accountId]) => accountId !== null),
      );

      setResidents(
        residentList.map((resident) =>
          normalizeResidentRecord(resident, accountMap, contractsMap),
        ),
      );
      setFeedback({ type: "", message: "" });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Could not load resident list from backend.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResidentData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (resident) => {
    setFormData({
      residentId: resident.residentId,
      accountId: resident.accountId,
      fullName: resident.fullName,
      gender: resident.gender,
      dateOfBirth: resident.dateOfBirth,
      identityId: resident.identityId,
      phoneNumber: resident.phoneNumber,
      email: resident.email,
      username: resident.username,
      password: "",
      isActive: resident.isActive,
      apartment:
        resident.apartments.length > 0 ? resident.apartments[0].roomNumber : "",
    });
    setIsEditMode(true);
    setFeedback({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.identityId ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.username
    ) {
      setFeedback({
        type: "error",
        message:
          "Please enter full name, DOB, ID card, phone number, email and username.",
      });
      return false;
    }

    if (!isEditMode && !formData.password) {
      setFeedback({
        type: "error",
        message: "Creating a new resident requires an account password.",
      });
      return false;
    }

    if (!isEditMode && formData.password.length < 8) {
      setFeedback({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return false;
    }

    if (
      !isEditMode &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/.test(
        formData.password,
      )
    ) {
      setFeedback({
        type: "error",
        message:
          "Password must include uppercase, lowercase, number and special character.",
      });
      return false;
    }

    return true;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    let createdAccountId = null;

    try {
      if (isEditMode) {
        const accountPayload = {
          email: formData.email,
          username: formData.username,
          isActive: formData.isActive,
        };

        if (formData.password) {
          accountPayload.password = formData.password;
        }

        await updateAccountById(formData.accountId, accountPayload);
        await updateResidentById(formData.residentId, {
          fullName: formData.fullName,
          gender: formData.gender || null,
          dateOfBirth: formData.dateOfBirth,
          identityId: formData.identityId,
          phoneNumber: formData.phoneNumber,
        });

        setFeedback({
          type: "success",
          message: "Resident and account information updated successfully.",
        });
      } else {
        const account = await createAccount({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          isActive: formData.isActive,
        });
        createdAccountId = account.id;

        await createResident({
          fullName: formData.fullName,
          gender: formData.gender || null,
          dateOfBirth: formData.dateOfBirth,
          identityId: formData.identityId,
          phoneNumber: formData.phoneNumber,
          accountId: account.id,
        });

        setFeedback({
          type: "success",
          message: "New resident created and account linked successfully.",
        });
      }

      resetForm();
      await loadResidentData();
    } catch (error) {
      if (!isEditMode && createdAccountId) {
        try {
          await deleteAccountById(createdAccountId);
        } catch (rollbackError) {
          console.error("Rollback account creation failed:", rollbackError);
        }
      }

      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          "An error occurred while saving resident data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (resident) => {
    if (
      !window.confirm(
        `Are you sure you want to delete resident ${resident.fullName}?`,
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      await deleteResidentById(resident.residentId);

      if (resident.accountId) {
        await deleteAccountById(resident.accountId);
      }

      setFeedback({
        type: "success",
        message: "Resident and linked account deleted.",
      });

      if (formData.residentId === resident.residentId) {
        resetForm();
      }

      await loadResidentData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message || "Could not delete this resident.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLock = async (resident) => {
    if (!resident.accountId) {
      setFeedback({
        type: "error",
        message: "This resident does not have an account to lock/unlock.",
      });
      return;
    }

    const action = resident.isActive ? "Lock" : "Unlock";
    if (
      !window.confirm(
        `Are you sure you want to ${action} the account for resident ${resident.fullName}?`,
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      await updateAccountById(resident.accountId, {
        email: resident.email,
        username: resident.username,
        isActive: !resident.isActive,
      });

      setFeedback({
        type: "success",
        message: resident.isActive
          ? "Resident account locked."
          : "Resident account unlocked.",
      });

      await loadResidentData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message || "Could not change account status.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResidents = residents.filter((resident) => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      resident.fullName,
      resident.email,
      resident.username,
      resident.identityId,
      resident.phoneNumber,
      ...resident.apartments.map((apartment) => String(apartment.roomNumber)),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, residents.length]);

  const paginatedResidents = paginateItems(
    filteredResidents,
    currentPage,
    pageSize,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / pageSize),
  );

  return (
    <div className="admin-lock-resident-container">
      <div className="resident-stats-banner">
        <div className="stats-icon-box">
          <FaUsers />
        </div>
        <div className="stats-info">
          <p>Resident access control</p>
          <h3>
            {residents.length} <span>Residents from backend API</span>
          </h3>
        </div>
      </div>

      <section className="resident-form-section">
        <div className="form-header">
          {isEditMode ? <FaEdit /> : <FaUserPlus />}
          <span>
            {isEditMode
              ? "Update Resident Account"
              : "Issue New Resident Account"}
          </span>
        </div>

        {feedback.message && (
          <div
            className={`admin-feedback ${feedback.type === "error" ? "error" : "success"}`}
          >
            {feedback.message}
          </div>
        )}

        <div className="resident-grid-form">
          <div className="form-group">
            <label>OWNER NAME</label>
            <input
              type="text"
              value={formData.fullName}
              placeholder="Enter owner name"
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>USERNAME</label>
            <input
              type="text"
              value={formData.username}
              placeholder="Enter username"
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              value={formData.email}
              placeholder="Enter email address"
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>PHONE NUMBER</label>
            <input
              type="text"
              value={formData.phoneNumber}
              placeholder="Enter phone number"
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>GENDER</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>DATE OF BIRTH</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>APARTMENT NO.</label>
            <input
              type="text"
              value={formData.apartment}
              placeholder="Enter apartment number"
              onChange={(e) => handleInputChange("apartment", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{isEditMode ? "NEW PASSWORD (OPTIONAL)" : "PASSWORD"}</label>
            <input
              type="password"
              value={formData.password}
              placeholder={
                isEditMode
                  ? "Leave blank to keep current password"
                  : "Enter account password"
              }
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>
        </div>

        <div
          className="admin-lock-actions"
          style={{ display: "flex", gap: "15px" }}
        >
          <button
            className="btn-add-resident"
            onClick={handleAddOrUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "PROCESSING..."
              : isEditMode
                ? "CONFIRM UPDATE"
                : "ISSUE ACCOUNT"}
          </button>
          {isEditMode && (
            <button
              className="btn-cancel-resident"
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              CANCEL
            </button>
          )}
        </div>
      </section>

      <section className="admin-table-wrapper">
        <div className="admin-lock-header-row">
          <h3 className="admin-lock-section-title">Issued Accounts List</h3>
          <div className="admin-lock-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-custom-table bordered">
            <thead>
              <tr>
                <th>USERNAME</th>
                <th>OWNER</th>
                <th>APARTMENT</th>
                <th>GENDER</th>
                <th>DOB</th>

                <th>STATUS</th>
                <th style={{ textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#64748b",
                    }}
                  >
                    Loading data from server...
                  </td>
                </tr>
              ) : filteredResidents.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#64748b",
                    }}
                  >
                    No matching residents found.
                  </td>
                </tr>
              ) : (
                paginatedResidents.map((resident) => (
                  <tr
                    key={resident.residentId}
                    style={{
                      opacity: resident.isActive ? 1 : 0.7,
                      backgroundColor: resident.isActive
                        ? "transparent"
                        : "#f8fafc",
                    }}
                  >
                    <td>
                      <strong>{resident.username}</strong>
                    </td>
                    <td>{resident.fullName}</td>
                    <td>
                      {resident.apartments.length > 0 ? (
                        <span className="apartment-tag">
                          {resident.apartments[0].roomNumber}
                        </span>
                      ) : (
                        <span className="admin-subtle-text">N/A</span>
                      )}
                    </td>
                    <td>{resident.gender || "Other"}</td>
                    <td>{resident.dateOfBirth || "N/A"}</td>

                    <td>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          background: resident.isActive ? "#dcfce7" : "#fee2e2",
                          color: resident.isActive ? "#10b981" : "#ef4444",
                        }}
                      >
                        {resident.isActive ? "Active" : "Locked"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div className="action-flex">
                        <button
                          className="btn-table-edit"
                          onClick={() => handleEditClick(resident)}
                          disabled={isSubmitting}
                          title="Edit Account"
                        >
                          <FaUserEdit />
                        </button>
                        <button
                          className={
                            resident.isActive
                              ? "btn-reject-mini"
                              : "btn-approve-mini"
                          }
                          onClick={() => handleToggleLock(resident)}
                          disabled={isSubmitting}
                          title={
                            resident.isActive
                              ? "Lock Account"
                              : "Unlock Account"
                          }
                        >
                          {resident.isActive ? <FaLock /> : <FaUnlock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredResidents.length}
          pageSize={pageSize}
          itemLabel="residents"
        />
      </section>
    </div>
  );
};

export const AdminAccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not load accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // DYNAMIC ROLE DETECTION: Find all unique roles from the database
  const availableRoles = useMemo(() => {
    const roleMap = new Map();

    accounts.forEach(acc => {
      if (acc.role && acc.role.roleName) {
        const name = String(acc.role.roleName).toUpperCase();
        roleMap.set(name, {
          id: acc.role.id || null,
          name: name
        });
      }
    });

    return Array.from(roleMap.values()).sort((a, b) => (a.id || 99) - (b.id || 99));
  }, [accounts]);

  useEffect(() => {
    if (accounts.length > 0) {
      console.log("DEBUG: System Roles Detected:", availableRoles);
      console.log("DEBUG: Raw Accounts List:", accounts);
    }
  }, [accounts, availableRoles]);

  const handleToggleLock = async (account) => {
    const nextStatus = !account.isActive;
    const action = nextStatus ? "Unlock" : "Lock";

    if (!window.confirm(`Are you sure you want to ${action} account "${account.username}"?`)) return;

    try {
      setIsSubmitting(true);
      await updateAccountById(account.id, {
        isActive: nextStatus,
        username: account.username,
        email: account.email
      });
      setFeedback({ type: "success", message: `Account ${action}ed successfully.` });
      await loadAccounts();
    } catch (err) {
      setFeedback({ type: "error", message: err?.response?.data?.message || `Could not ${action} account.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (account, newRoleName) => {
    if (!newRoleName) return;
    if (!window.confirm(`Change role of "${account.username}" to ${newRoleName}?`)) return;

    // Find the correct role object from our detected list
    const roleInfo = availableRoles.find(r => r.name === newRoleName);

    try {
      setIsSubmitting(true);

      // We try a robust payload that includes both the ID and name
      // This increases compatibility with backends requiring role IDs
      const payload = {
        username: account.username,
        email: account.email,
        role: roleInfo.id ? { id: roleInfo.id, roleName: roleInfo.name } : { roleName: roleInfo.name }
      };

      console.log("SENDING UPDATE PAYLOAD:", payload);
      await updateAccountById(account.id, payload);

      setFeedback({ type: "success", message: "Role update command sent successfully." });

      // Force a slight delay before reload to give backend time to process
      setTimeout(() => loadAccounts(), 500);
    } catch (err) {
      setFeedback({ type: "error", message: err?.response?.data?.message || "Could not update role." });
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredAccounts = accounts.filter(acc => {
    const role = acc.role?.roleName?.toUpperCase() || "";
    if (role === "ADMIN" || role === "STAFF") return false;

    return (acc.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (acc.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (acc.role?.roleName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
  });

  const paginatedItems = paginateItems(filteredAccounts, currentPage, pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));

  return (
    <div className="admin-lock-resident-container">
      <div className="resident-stats-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
        <div className="stats-icon-box"><FaUsers /></div>
        <div className="stats-info">
          <p>Access Control System</p>
          <h3>Account & Role Management</h3>
        </div>
      </div>

      <section className="resident-list-section">
        <div className="list-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '20px' }}>
          <div className="admin-lock-search" style={{ flex: 1, margin: 0 }}>
            <FaSearch />
            <input
              type="text"
              placeholder="Search by username, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {feedback.message && (
            <div className={`admin-feedback ${feedback.type}`} style={{ margin: 0, padding: '10px 20px', borderRadius: '8px' }}>
              {feedback.message}
            </div>
          )}
        </div>

        {error && (
          <div className="admin-feedback error" style={{ marginBottom: "20px" }}>{error}</div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th style={{ minWidth: '180px' }}>Assign Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading accounts...</td></tr>
              ) : paginatedItems.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No accounts found.</td></tr>
              ) : (
                paginatedItems.map(account => {
                  const currentRoleName = (account.role?.roleName || "").toUpperCase();

                  return (
                    <tr key={account.id} style={{ opacity: account.isActive !== false ? 1 : 0.6 }}>
                      <td><strong>{account.username}</strong></td>
                      <td>{account.email}</td>
                      <td>
                        <select
                          className="role-selector"
                          value={currentRoleName}
                          onChange={(e) => handleRoleChange(account, e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            background: currentRoleName ? '#f0f9ff' : '#fef2f2',
                            fontWeight: '600',
                            width: '100%',
                            color: currentRoleName ? '#0369a1' : '#b91c1c'
                          }}
                        >
                          <option value="" disabled>-- DETECTING ROLE --</option>
                          {availableRoles.map(role => (
                            <option key={role.name} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge ${account.isActive !== false ? 'active' : 'locked'}`}>
                          {account.isActive !== false ? 'Active' : 'Locked'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className={`action-btn-circle ${account.isActive !== false ? 'deny' : 'approve'}`}
                          title={account.isActive !== false ? "Lock Account" : "Unlock Account"}
                          onClick={() => handleToggleLock(account)}
                          disabled={isSubmitting}
                        >
                          {account.isActive !== false ? <FaUserLock /> : <FaUnlock />}
                        </button>
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
          totalItems={filteredAccounts.length}
          pageSize={pageSize}
          itemLabel="accounts"
        />
      </section>
    </div>
  );
};

// --- TẠO HỢP ĐỒNG ---
export const AdminCreateContract = () => {
  const { user } = useAuth();

  const [apartmentInfo, setApartmentInfo] = useState(null);
  const [formData, setFormData] = useState({
    floorNumber: "",
    roomNumber: "",
    apartmentName: "",
    apartmentId: null,
    username: "",
    accountId: null,
    contractType: "Rent",
    startDate: "",
    endDate: "",
    monthlyRent: "",
  });

  const handleAddContract = async () => {
    console.log(user);
    const payload = {
      apartmentId: formData.apartmentId,
      accountId: formData.accountId,
      contractType: formData.contractType,
      startDate: formData.startDate,
      ...(formData.contractType === "Rent" && {
        endDate: formData.endDate,
        monthlyRent: Number(formData.monthlyRent),
      }),
      createdById: user.id,
      status: 1,
    };

    try {
      await api.post("/api/contracts", payload);
      alert("Thêm hợp đồng thành công!");
    } catch {
      alert("Lỗi khi thêm hợp đồng!");
    }
  };

  return (
    <div className="admin-lock-resident-container">
      <div
        className="resident-stats-banner"
        style={{
          background: "linear-gradient(135deg, #1a202c 0%, #4a5568 100%)",
        }}
      >
        <div className="stats-icon-box">
          <FaFileContract />
        </div>
        <div className="stats-info">
          <p>Hệ thống Quản lý Đô thị</p>
          <h3>Khởi tạo Hợp đồng Mới</h3>
        </div>
      </div>
      <section className="resident-form-section">
        <div className="form-header">
          <FaPlus /> <span>Biểu mẫu hợp đồng pháp lý</span>
        </div>

        {/* Contract Type - Radio */}
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label>Loại hợp đồng</label>
          <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="contractType"
                value="Rent"
                checked={formData.contractType === "Rent"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractType: e.target.value,
                    endDate: "",
                  })
                }
              />
              Cho thuê (Rent)
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="contractType"
                value="Sale"
                checked={formData.contractType === "Sale"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractType: e.target.value,
                    endDate: "",
                  })
                }
              />
              Sale Purchase (Sale)
            </label>
          </div>
        </div>

        <div className="resident-grid-form">
          {/* Floor */}
          <div className="form-group">
            <label>Floor</label>
            <input
              type="number"
              placeholder="Enter floor number..."
              value={formData.floorNumber}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  floorNumber: e.target.value,
                  roomNumber: "",
                  apartmentId: null,
                });
                setApartmentInfo(null);
              }}
            />
          </div>

          {/* Room Number */}
          <div className="form-group">
            <label>Room Number</label>
            <input
              type="number"
              placeholder="Enter room number..."
              value={formData.roomNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roomNumber: e.target.value,
                  apartmentId: null,
                })
              }
              onBlur={async () => {
                if (!formData.floorNumber || !formData.roomNumber) return;
                try {
                  const res = await api.post("/apartments/search-by-number", {
                    roomNumber: formData.roomNumber,
                    floorNumber: formData.floorNumber,
                  });
                  console.log(res);
                  setFormData((prev) => ({
                    ...prev,
                    apartmentId: res.data.result.id,
                  }));
                  setApartmentInfo(res.data.result);
                } catch {
                  alert("Room not found!");
                  setApartmentInfo(null);
                }
              }}
            />
          </div>

          {apartmentInfo && (
            <div
              className="apartment-info-card"
              style={{ gridColumn: "1 / -1" }}
            >
              <p>
                ✔ Found: <strong>{apartmentInfo.name}</strong> — Floor{" "}
                {apartmentInfo.floorNumber}, Room {apartmentInfo.roomNumber}
              </p>
              <p style={{ color: "green", fontSize: "13px" }}>
                Apartment ID: {apartmentInfo.id}
              </p>
            </div>
          )}

          {/* Username → accountId */}
          <div className="form-group">
            <label>Resident Username</label>
            <input
              type="text"
              placeholder="Enter username..."
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              onBlur={async () => {
                if (!formData.username) return;
                try {
                  const res = await api.get(
                    `/accounts/search-by-username/${formData.username}`,
                  );
                  console.log(res);
                  if (res?.data.result.id) {
                    setFormData((prev) => ({
                      ...prev,
                      accountId: res.data.result.id,
                    }));
                  } else {
                    alert("Account not found!");
                  }
                } catch {
                  alert("Error finding account!");
                }
              }}
            />
            {formData.accountId && (
              <small style={{ color: "green" }}>
                ✔ Account ID: {formData.accountId}
              </small>
            )}
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label>Contract Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          {/* End Date - only if Rent */}
          {formData.contractType === "Rent" && (
            <div className="form-group">
              <label>Contract End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          )}

          {/* Monthly Rent - only if Rent */}
          {formData.contractType === "Rent" && (
            <div className="form-group">
              <label>Monthly Rent (VND)</label>
              <input
                type="number"
                placeholder="E.g., 6000000"
                value={formData.monthlyRent}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyRent: e.target.value })
                }
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            className="btn-add-resident"
            style={{ width: "200px" }}
            onClick={handleAddContract}
          >
            Create Contract
          </button>
        </div>
      </section>
    </div>
  );
};

// --- XEM HỢP ĐỒNG (CARD) ---
const LegacyAdminPropertyManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [properties, setProperties] = useState([
    {
      id: "VH-101",
      owner: "Trần Phu Thanh Hung",
      people: 4,
      type: "Ownership",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    },
    {
      id: "VH-202",
      owner: "Nguyễn Thúy Hường",
      people: 2,
      type: "Rental",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
    },
  ]);

  const triggerUpload = (id, type) => {
    document.getElementById(`file-${type}-${id}`).click();
  };

  const handleInputChange = (id, field, value) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = (id) => {
    alert(`Contract for apartment ${id} has been updated successfully!`);
    setEditingId(null);
  };

  const filteredProperties = properties.filter((p) =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-reports-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h2 className="admin-page-title" style={{ margin: 0 }}>
          Apartment & Contract List
        </h2>

        <div
          className="admin-lock-search"
          style={{ margin: 0, minWidth: "320px" }}
        >
          <FaSearch style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by Apartment (e.g. VH-101)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: "100%",
              marginLeft: "10px",
            }}
          />
        </div>
      </div>

      <div className="admin-visual-grid">
        {filteredProperties.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            No contracts found matching "{searchTerm}".
          </p>
        ) : (
          filteredProperties.map((item) => (
            <div
              key={item.id}
              className="house-card hover-lift"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="card-inner">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "1.2rem", color: "white" }}>
                    Apt: {item.id}
                  </h3>
                  {editingId !== item.id && (
                    <button
                      onClick={() => setEditingId(item.id)}
                      style={{
                        background: "var(--admin-primary)",
                        border: "none",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "700",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 6px rgba(200, 155, 60, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#b08630";
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow =
                          "0 6px 12px rgba(176, 134, 48, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "var(--admin-primary)";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 6px rgba(200, 155, 60, 0.2)";
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>

                <div className="card-details">
                  {editingId === item.id ? (
                    <div
                      className="edit-input-group"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          color: "#cbd5e1",
                          fontSize: "12px",
                          marginBottom: "6px",
                          fontWeight: "600",
                        }}
                      >
                        OWNER / TENANT NAME
                      </label>
                      <input
                        type="text"
                        value={item.owner}
                        style={{
                          width: "100%",
                          marginBottom: "15px",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "none",
                          background: "white",
                          color: "#0f172a",
                        }}
                        onChange={(e) =>
                          handleInputChange(item.id, "owner", e.target.value)
                        }
                      />

                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              display: "block",
                              color: "#cbd5e1",
                              fontSize: "12px",
                              marginBottom: "6px",
                              fontWeight: "600",
                            }}
                          >
                            RESIDENTS
                          </label>
                          <input
                            type="number"
                            value={item.people}
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "6px",
                              border: "none",
                              background: "white",
                              color: "#0f172a",
                            }}
                            onChange={(e) =>
                              handleInputChange(
                                item.id,
                                "people",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              display: "block",
                              color: "#cbd5e1",
                              fontSize: "12px",
                              marginBottom: "6px",
                              fontWeight: "600",
                            }}
                          >
                            TYPE
                          </label>
                          <select
                            value={item.type}
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "6px",
                              border: "none",
                              background: "white",
                              color: "#0f172a",
                            }}
                            onChange={(e) =>
                              handleInputChange(item.id, "type", e.target.value)
                            }
                          >
                            <option value="Ownership">Ownership</option>
                            <option value="Rental">Rental</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: "8px 16px",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.5)",
                            color: "white",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) =>
                          (e.target.style.background =
                            "rgba(255,255,255,0.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background = "transparent")
                          }
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(item.id)}
                          style={{
                            padding: "8px 16px",
                            background: "var(--admin-primary)",
                            border: "none",
                            color: "white",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "800",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background = "#b08630")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background = "var(--admin-primary)")
                          }
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        style={{
                          color: "white",
                          marginBottom: "10px",
                          fontSize: "15px",
                        }}
                      >
                        👤 Owner: <strong>{item.owner}</strong>
                      </p>
                      <p style={{ color: "#cbd5e1", marginBottom: "10px" }}>
                        👨‍👩‍👧‍👦 Residents: {item.people} people
                      </p>
                      <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
                        📄 Type:{" "}
                        <span
                          style={{
                            padding: "4px 10px",
                            background:
                              item.type === "Ownership"
                                ? "rgba(59, 130, 246, 0.2)"
                                : "rgba(200, 155, 60, 0.2)",
                            color:
                              item.type === "Ownership" ? "#93c5fd" : "#fde047",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "800",
                          }}
                        >
                          {item.type}
                        </span>
                      </p>
                    </>
                  )}
                </div>

                {editingId !== item.id && (
                  <div
                    className="contract-toolbar"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      paddingTop: "15px",
                    }}
                  >
                    <div className="toolbar-left-icons">
                      <FaFileUpload
                        title="Upload Contract Document"
                        style={{
                          cursor: "pointer",
                          color: "#cbd5e1",
                          fontSize: "18px",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "white")}
                        onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                        onClick={() => triggerUpload(item.id, "doc")}
                      />
                      <input
                        type="file"
                        id={`file-doc-${item.id}`}
                        style={{ display: "none" }}
                      />
                      <FaImage
                        title="Upload Related Images"
                        style={{
                          cursor: "pointer",
                          color: "#cbd5e1",
                          fontSize: "18px",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "white")}
                        onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                        onClick={() => triggerUpload(item.id, "img")}
                      />
                      <input
                        type="file"
                        id={`file-img-${item.id}`}
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                    </div>
                    <button
                      className="toolbar-add-btn"
                      style={{
                        background: "white",
                        color: "#0f172a",
                        fontWeight: "800",
                        padding: "6px 16px",
                        borderRadius: "6px",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const AdminPropertyManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    contractType: "Residential",
    monthlyRent: "",
    endDate: "",
    status: "1",
  });
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [contractList, accounts, residents] = await Promise.all([
        getAllContracts(),
        getAccounts(),
        getResidents(),
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

      const normalizedContracts = contractList.map((contract) => {
        const accountId = contract?.account?.id ?? contract?.accountId;
        const account = accountMap.get(accountId) ?? contract?.account;
        const resident = residentMap.get(accountId);

        return {
          id: contract.id,
          apartmentId: contract?.apartment?.id ?? contract?.apartmentId ?? null,
          apartmentLabel:
            contract?.apartment?.roomNumber ??
            contract?.apartmentId ??
            `Apartment #${contract?.apartmentId ?? "N/A"}`,
          owner:
            resident?.fullName ||
            account?.username ||
            `Account #${accountId ?? "N/A"}`,
          username: account?.username || "N/A",
          contractType: contract?.contractType || "Residential",
          monthlyRent: contract?.monthlyRent ?? "",
          startDate: contract?.startDate || "",
          endDate: contract?.endDate || "",
          status: Number(contract?.status ?? 1),
        };
      });

      setContracts(normalizedContracts);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
        "Could not load live contract data from backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const filteredContracts = contracts.filter((contract) => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;

    return [
      contract.apartmentLabel,
      contract.owner,
      contract.username,
      contract.contractType,
      contract.startDate,
      contract.endDate,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, contracts.length]);

  const paginatedContracts = paginateItems(
    filteredContracts,
    currentPage,
    pageSize,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredContracts.length / pageSize),
  );

  const handleEdit = (contract) => {
    setEditingId(contract.id);
    setDraft({
      contractType: contract.contractType,
      monthlyRent: contract.monthlyRent ?? "",
      endDate: contract.endDate || "",
      status: String(contract.status),
    });
  };

  const handleSave = async (contractId) => {
    try {
      setIsSaving(true);
      setError("");

      await updateContractById(contractId, {
        contractType: draft.contractType,
        monthlyRent:
          draft.monthlyRent === "" ? null : Number(draft.monthlyRent),
        endDate: draft.endDate || null,
        status: Number(draft.status),
      });

      setEditingId(null);
      await loadContracts();
    } catch (saveError) {
      setError(
        saveError?.response?.data?.message ||
        "Could not update contract on backend.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-reports-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h2 className="admin-page-title" style={{ margin: 0 }}>
          Apartment & Contract List
        </h2>

        <div
          className="admin-lock-search"
          style={{ margin: 0, minWidth: "320px" }}
        >
          <FaSearch style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by apartment, owner, username..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: "100%",
              marginLeft: "10px",
            }}
          />
        </div>
      </div>

      {error ? (
        <div className="admin-feedback error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      ) : null}

      <div className="admin-visual-grid">
        {isLoading ? (
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            Loading live contracts from backend...
          </p>
        ) : filteredContracts.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            No contracts found matching "{searchTerm}".
          </p>
        ) : (
          paginatedContracts.map((item) => (
            <div
              key={item.id}
              className="house-card hover-lift"
              style={{
                background:
                  item.status === 1
                    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                    : "linear-gradient(135deg, #334155 0%, #475569 100%)",
              }}
            >
              <div className="card-inner">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "1.2rem", color: "white" }}>
                    Apt: {item.apartmentLabel}
                  </h3>
                  {editingId !== item.id && (
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        background: "var(--admin-primary)",
                        border: "none",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "700",
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>

                {editingId === item.id ? (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div
                      className="form-group"
                      style={{ marginBottom: "12px" }}
                    >
                      <label style={{ color: "#cbd5e1" }}>CONTRACT TYPE</label>
                      <input
                        type="text"
                        value={draft.contractType}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            contractType: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ marginBottom: "12px" }}
                    >
                      <label style={{ color: "#cbd5e1" }}>MONTHLY RENT</label>
                      <input
                        type="number"
                        value={draft.monthlyRent}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            monthlyRent: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ marginBottom: "12px" }}
                    >
                      <label style={{ color: "#cbd5e1" }}>END DATE</label>
                      <input
                        type="date"
                        value={draft.endDate}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            endDate: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ marginBottom: "16px" }}
                    >
                      <label style={{ color: "#cbd5e1" }}>STATUS</label>
                      <select
                        value={draft.status}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            status: event.target.value,
                          }))
                        }
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: "8px 16px",
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.5)",
                          color: "white",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(item.id)}
                        disabled={isSaving}
                        style={{
                          padding: "8px 16px",
                          background: "var(--admin-primary)",
                          border: "none",
                          color: "white",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "800",
                        }}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card-details">
                    <p
                      style={{
                        color: "white",
                        marginBottom: "10px",
                        fontSize: "15px",
                      }}
                    >
                      Owner / Tenant: <strong>{item.owner}</strong>
                    </p>
                    <p style={{ color: "#cbd5e1", marginBottom: "10px" }}>
                      Username: {item.username}
                    </p>
                    <p style={{ color: "#cbd5e1", marginBottom: "10px" }}>
                      Type: {item.contractType}
                    </p>
                    <p style={{ color: "#cbd5e1", marginBottom: "10px" }}>
                      Start: {item.startDate || "N/A"}
                    </p>
                    <p style={{ color: "#cbd5e1", marginBottom: "10px" }}>
                      End: {item.endDate || "Open-ended"}
                    </p>
                    <p style={{ color: "#cbd5e1", marginBottom: "0" }}>
                      Rent:{" "}
                      <strong>
                        {item.monthlyRent === "" || item.monthlyRent === null
                          ? "N/A"
                          : new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(Number(item.monthlyRent))}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredContracts.length}
        pageSize={pageSize}
        itemLabel="contracts"
      />
    </div>
  );
};

// --- SERVICE & SECURITY MODULES (Reused from Staff) ---
export const AdminBookingManager = () => (
  <div className="admin-reports-container">
    <StaffServiceMainContent activeTab="bookings" />
  </div>
);
export const AdminServiceFeeStats = () => (
  <div className="admin-reports-container">
    <StaffServiceMainContent activeTab="fees" />
  </div>
);
export const AdminVisitorManager = () => (
  <div className="admin-reports-container">
    <StaffSecurityMainContent activeTab="visitors" />
  </div>
);

export const AdminComplaintManager = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const loadComplaintData = async ({ keepSelection = true } = {}) => {
    setIsLoading(true);

    try {
      const [complaintList, accountList, residentList, contractList, apartmentList] =
        await Promise.all([
          getAllComplaints(),
          getAccounts(),
          getResidents(),
          getAllContracts(),
          getApartments(),
        ]);

      const accountsMap = new Map(
        accountList.map((account) => [String(account.id), account]),
      );
      const residentsMap = new Map(
        residentList.map((resident) => [
          String(resident?.account?.id ?? resident?.accountId ?? resident?.id),
          resident,
        ]),
      );
      const apartmentMap = new Map(
        apartmentList.map((apartment) => [String(apartment.id), apartment]),
      );
      const contractsByAccount = contractList.reduce((map, contract) => {
        const accountId = contract?.account?.id ?? contract?.accountId;
        if (!accountId) return map;

        const key = String(accountId);
        const current = map.get(key) ?? [];
        current.push(contract);
        map.set(key, current);
        return map;
      }, new Map());

      const replyResults = await Promise.all(
        complaintList.map(async (complaint) => {
          try {
            const replies = await getRepliesByComplaintId(complaint?.id);
            return [complaint?.id, replies];
          } catch {
            return [complaint?.id, []];
          }
        }),
      );

      const repliesMap = new Map(replyResults);

      const normalizedComplaints = complaintList
        .map((complaint) => {
          const ownerId = getComplaintOwnerId(complaint);
          const ownerKey = ownerId !== null ? String(ownerId) : null;
          const account =
            (ownerKey ? accountsMap.get(ownerKey) : null) ??
            complaint?.madeByUser ??
            complaint?.user ??
            complaint?.account ??
            null;
          const resident =
            (ownerKey ? residentsMap.get(ownerKey) : null) ??
            complaint?.resident ??
            null;
          const contracts = ownerKey ? contractsByAccount.get(ownerKey) ?? [] : [];
          const sortedContracts = [...contracts].sort(
            (a, b) =>
              new Date(b?.startDate || 0).getTime() -
              new Date(a?.startDate || 0).getTime(),
          );
          const activeContract =
            sortedContracts.find((contract) => Number(contract?.status ?? 1) === 1) ??
            sortedContracts[0] ??
            null;
          const apartmentId =
            complaint?.apartment?.id ??
            complaint?.apartmentId ??
            activeContract?.apartment?.id ??
            activeContract?.apartmentId ??
            null;
          const apartment =
            (apartmentId !== null ? apartmentMap.get(String(apartmentId)) : null) ??
            complaint?.apartment ??
            activeContract?.apartment ??
            null;
          const replies = (repliesMap.get(complaint?.id) ?? []).map((reply) => ({
            ...reply,
            authorId: getReplyAuthorId(reply),
            authorName:
              reply?.user?.fullName ??
              reply?.user?.username ??
              reply?.createdBy?.fullName ??
              reply?.createdBy?.username ??
              "Staff/Admin",
            createdLabel: formatAdminDateTime(getComplaintTimestamp(reply)),
          }))
            .sort(
              (a, b) =>
                getAdminTimestampValue(getComplaintTimestamp(a)) -
                getAdminTimestampValue(getComplaintTimestamp(b)),
            );
          const createdAt = getComplaintTimestamp(complaint);
          const latestReplyAt =
            replies.length > 0
              ? getComplaintTimestamp(replies[replies.length - 1])
              : null;
          const lastActivityAt = latestReplyAt ?? createdAt;
          const status = replies.length > 0 ? "replied" : "new";

          return {
            ...complaint,
            ownerId,
            ownerName:
              resident?.fullName ??
              account?.fullName ??
              account?.username ??
              complaint?.fullName ??
              complaint?.residentName ??
              "Unknown resident",
            ownerEmail: account?.email ?? complaint?.email ?? "N/A",
            ownerPhone:
              resident?.phoneNumber ??
              account?.phoneNumber ??
              complaint?.phoneNumber ??
              "N/A",
            apartmentLabel:
              apartment?.roomNumber ??
              complaint?.roomNumber ??
              complaint?.apartmentNumber ??
              "Unassigned",
            floorNumber: apartment?.floorNumber ?? null,
            createdAt,
            createdLabel: formatAdminDateTime(createdAt),
            updatedLabel: formatAdminDateTime(
              complaint?.updatedAt ?? complaint?.modifiedAt,
            ),
            replies,
            replyCount: replies.length,
            latestReplyAt,
            latestReplyLabel:
              latestReplyAt !== null
                ? formatAdminDateTime(latestReplyAt)
                : "No replies yet",
            lastActivityAt,
            lastActivityLabel: formatAdminDateTime(lastActivityAt),
            status,
            statusLabel: status === "replied" ? "Replied" : "Pending review",
            sortPriority: status === "replied" ? 1 : 0,
            sortTimestamp: getAdminTimestampValue(lastActivityAt),
          };
        })
        .sort((a, b) => {
          if (a.sortPriority !== b.sortPriority) {
            return a.sortPriority - b.sortPriority;
          }

          return b.sortTimestamp - a.sortTimestamp;
        });

      setComplaints(normalizedComplaints);
      setFeedback({ type: "", message: "" });

      if (!keepSelection) {
        setSelectedComplaintId(normalizedComplaints[0]?.id ?? null);
        return;
      }

      setSelectedComplaintId((prev) => {
        if (prev && normalizedComplaints.some((complaint) => complaint.id === prev)) {
          return prev;
        }
        return normalizedComplaints[0]?.id ?? null;
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Could not load complaints from the backend.",
      });
      setComplaints([]);
      setSelectedComplaintId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaintData({ keepSelection: false });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, complaints.length]);

  useEffect(() => {
    setReplyDraft("");
  }, [selectedComplaintId]);

  const filteredComplaints = complaints
    .filter((complaint) => {
      const matchesStatus =
        statusFilter === "all" ? true : complaint.status === statusFilter;
      const keyword = searchTerm.trim().toLowerCase();
      const matchesSearch =
        keyword.length === 0
          ? true
          : [
            complaint.content,
            complaint.ownerName,
            complaint.ownerEmail,
            complaint.ownerPhone,
            complaint.apartmentLabel,
          ].some((value) =>
            String(value ?? "").toLowerCase().includes(keyword),
          );

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (a.sortPriority !== b.sortPriority) {
        return a.sortPriority - b.sortPriority;
      }

      return b.sortTimestamp - a.sortTimestamp;
    });

  const paginatedComplaints = paginateItems(
    filteredComplaints,
    currentPage,
    pageSize,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredComplaints.length / pageSize),
  );
  const selectedComplaint =
    complaints.find((complaint) => complaint.id === selectedComplaintId) ?? null;
  const newCount = complaints.filter((complaint) => complaint.status === "new").length;
  const repliedCount = complaints.filter(
    (complaint) => complaint.status === "replied",
  ).length;
  const latestComplaintDate =
    complaints.length > 0 ? formatAdminDate(complaints[0].lastActivityAt) : "N/A";

  const handleSubmitReply = async () => {
    if (!selectedComplaint || !replyDraft.trim()) {
      setFeedback({
        type: "error",
        message: "Please choose a complaint and enter a reply.",
      });
      return;
    }

    if (!user?.id) {
      setFeedback({
        type: "error",
        message:
          "Could not identify the current admin account for this reply. Please sign in again.",
      });
      return;
    }

    setIsSubmittingReply(true);
    setFeedback({ type: "", message: "" });

    try {
      await createReply({
        content: replyDraft.trim(),
        complaintId: selectedComplaint.id,
        userId: user.id,
      });

      try {
        await updateComplaintById(selectedComplaint.id, {
          content: selectedComplaint.content,
        });
      } catch {
        // Complaint status is inferred from replies, so reply creation is enough.
      }

      setReplyDraft("");
      await loadComplaintData();
      setFeedback({
        type: "success",
        message: "Reply sent and complaint data refreshed successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message || "Failed to send reply.",
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="admin-reports-container">
      <section
        className="create-role-section"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(12,74,110,0.88)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200')",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="create-role-content">
          <h3>Complaint Command Center</h3>
          <p
            style={{
              color: "#dbeafe",
              lineHeight: "1.7",
              maxWidth: "780px",
              marginBottom: "22px",
            }}
          >
            Track resident issues in real time, prioritize unanswered reports,
            and send responses directly from the admin workspace.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              {
                icon: <FaComments />,
                label: "Total complaints",
                value: complaints.length,
                accent: "#38bdf8",
              },
              {
                icon: <FaExclamationTriangle />,
                label: "Pending review",
                value: newCount,
                accent: "#c98b3c",
              },
              {
                icon: <FaRegCommentDots />,
                label: "Replied",
                value: repliedCount,
                accent: "#22c55e",
              },
              {
                icon: <FaClock />,
                label: "Latest activity",
                value: latestComplaintDate,
                accent: "#c084fc",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "18px",
                  padding: "18px 20px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    background: item.accent,
                    color: "#0f172a",
                    marginBottom: "12px",
                    fontSize: "18px",
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontSize: "13px", color: "#cbd5e1" }}>{item.label}</div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#fff",
                    marginTop: "6px",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {feedback.message ? (
        <div className={`admin-feedback ${feedback.type}`} style={{ marginTop: "22px" }}>
          {feedback.message}
        </div>
      ) : null}

      <section
        className="staff-form-container"
        style={{ marginTop: "22px", padding: "24px", overflow: "hidden" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(340px, 0.85fr)",
            gap: "22px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              className="admin-lock-header-row"
              style={{ marginBottom: "18px", alignItems: "center" }}
            >
              <div>
                <h3 style={{ marginBottom: "6px", color: "#0f172a" }}>
                  Complaint Queue
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Filter by status and search by resident, apartment, phone, or complaint content.
                </p>
              </div>
              <button
                type="button"
                className="btn-submit"
                onClick={() => loadComplaintData()}
                disabled={isLoading}
                style={{ minWidth: "120px" }}
              >
                {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 220px",
                gap: "14px",
                marginBottom: "18px",
              }}
            >
              <div style={{ position: "relative" }}>
                <FaSearch
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search complaints by resident, apartment, phone, or content..."
                  style={{
                    width: "100%",
                    padding: "13px 14px 13px 40px",
                    borderRadius: "12px",
                    border: "1px solid #dbe3f0",
                    background: "#f8fafc",
                    outline: "none",
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "12px",
                  border: "1px solid #dbe3f0",
                  background: "#f8fafc",
                  outline: "none",
                }}
              >
                <option value="all">All statuses</option>
                <option value="new">Pending review</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-custom-table bordered">
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Apartment</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "28px" }}>
                        Loading complaints from the backend...
                      </td>
                    </tr>
                  ) : filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "28px" }}>
                        No complaints match the current filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        onClick={() => setSelectedComplaintId(complaint.id)}
                        style={{
                          cursor: "pointer",
                          background:
                            complaint.id === selectedComplaintId
                              ? "rgba(201, 139, 60, 0.08)"
                              : undefined,
                        }}
                      >
                        <td>
                          <strong>{complaint.ownerName}</strong>
                          <div style={{ color: "#64748b", fontSize: "11px", marginTop: "4px", wordBreak: "break-all" }}>
                            {complaint.ownerEmail}
                          </div>
                        </td>
                        <td>
                          <strong>Room {complaint.apartmentLabel}</strong>
                          <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                            {complaint.floorNumber ? `Floor ${complaint.floorNumber}` : "Floor unknown"}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${complaint.status === "replied" ? "active" : "locked"
                              }`}
                          >
                            {complaint.statusLabel}
                          </span>
                          <div style={{ color: "#64748b", fontSize: "12px", marginTop: "6px" }}>
                            {complaint.replyCount} replies
                          </div>
                        </td>
                        <td>{complaint.latestReplyLabel}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredComplaints.length}
              pageSize={pageSize}
              itemLabel="complaints"
            />
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "22px",
              minHeight: "760px",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
            }}
          >
            {!selectedComplaint ? (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  color: "#64748b",
                  padding: "30px",
                }}
              >
                Select a complaint from the left to review details and reply.
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#e0f2fe",
                        color: "#0369a1",
                        borderRadius: "999px",
                        padding: "6px 12px",
                        fontWeight: "700",
                        fontSize: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <FaComments />
                      Ticket #{selectedComplaint.id}
                    </div>
                    <h3 style={{ marginBottom: "6px", color: "#0f172a" }}>
                      {selectedComplaint.ownerName}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "#64748b",
                        fontSize: "14px",
                        display: "none",
                      }}
                    >
                      Phong {selectedComplaint.apartmentLabel} • {selectedComplaint.ownerPhone}
                    </p>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                      Room {selectedComplaint.apartmentLabel} | {selectedComplaint.ownerPhone}
                    </p>
                  </div>
                  <span
                    className={`status-badge ${selectedComplaint.status === "replied" ? "active" : "locked"
                      }`}
                  >
                    {selectedComplaint.statusLabel}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.43fr 0.57fr",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  {[
                    { label: "Submitted", value: selectedComplaint.createdLabel },
                    {
                      label:
                        selectedComplaint.status === "new"
                          ? "Awaiting reply"
                          : "Last reply",
                      value:
                        selectedComplaint.status === "new"
                          ? "Not replied yet"
                          : selectedComplaint.latestReplyLabel,
                    },
                    { label: "Email", value: selectedComplaint.ownerEmail },
                    { label: "Reply count", value: selectedComplaint.replyCount },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "14px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                        {item.label}
                      </div>
                      <div style={{ color: "#0f172a", fontWeight: "700", lineHeight: "1.5", wordBreak: "break-all" }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    color: "#e2e8f0",
                    borderRadius: "18px",
                    padding: "18px",
                    marginBottom: "18px",
                  }}
                >
                  <div style={{ fontSize: "12px", letterSpacing: "0.08em", color: "#7dd3fc" }}>
                    RESIDENT MESSAGE
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      lineHeight: "1.75",
                      fontSize: "15px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedComplaint.content}
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#0f172a" }}>Reply history</h4>
                    <span style={{ color: "#64748b", fontSize: "13px" }}>
                      {selectedComplaint.replyCount} items
                    </span>
                  </div>

                  <div
                    style={{
                      maxHeight: "260px",
                      overflowY: "auto",
                      display: "grid",
                      gap: "12px",
                      paddingRight: "4px",
                    }}
                  >
                    {selectedComplaint.replies.length === 0 ? (
                      <div
                        style={{
                          border: "1px dashed #cbd5e1",
                          borderRadius: "14px",
                          padding: "18px",
                          color: "#64748b",
                          background: "#fff",
                        }}
                      >
                        This complaint has not been answered yet. You can send the first reply below.
                      </div>
                    ) : (
                      selectedComplaint.replies.map((reply) => (
                        <div
                          key={reply.id}
                          style={{
                            background: "#fff",
                            border: "1px solid #dbeafe",
                            borderLeft: "4px solid #38bdf8",
                            borderRadius: "14px",
                            padding: "14px 16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "10px",
                              marginBottom: "8px",
                              color: "#0f172a",
                              fontWeight: "700",
                            }}
                          >
                            <span>{reply.authorName}</span>
                            <span style={{ color: "#64748b", fontSize: "12px" }}>
                              {reply.createdLabel}
                            </span>
                          </div>
                          <div style={{ color: "#334155", lineHeight: "1.65", whiteSpace: "pre-wrap" }}>
                            {reply.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "18px",
                  }}
                >
                  <h4 style={{ marginTop: 0, marginBottom: "12px", color: "#0f172a" }}>
                    Send a new reply
                  </h4>
                  <textarea
                    value={replyDraft}
                    onChange={(event) => setReplyDraft(event.target.value)}
                    rows={6}
                    placeholder="Write your response to the resident..."
                    style={{
                      width: "100%",
                      resize: "vertical",
                      borderRadius: "14px",
                      border: "1px solid #dbe3f0",
                      padding: "14px 16px",
                      background: "#fff",
                      outline: "none",
                      lineHeight: "1.65",
                    }}
                  />
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ color: "#64748b", fontSize: "12px" }}>
                      The reply will be sent using the currently signed-in admin account.
                    </span>
                    <button
                      type="button"
                      className="btn-submit"
                      onClick={handleSubmitReply}
                      disabled={isSubmittingReply}
                    >
                      {isSubmittingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- ADMIN APARTMENT LAYOUT (FINAL VERSION) ---
export const AdminApartmentLayout = () => {
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);
  const [chargesPage, setChargesPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [floorSearch, setFloorSearch] = useState("");
  const [baseData, setBaseData] = useState({
    apartments: [],
    contracts: [],
    accounts: [],
    residents: [],
    utilities: [],
    serviceInvoices: [],
    bookings: [],
  });
  const [stayHistory, setStayHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const [
          apartments,
          contracts,
          accounts,
          residents,
          utilities,
          serviceInvoices,
          bookings,
        ] = await Promise.all([
          getApartments(),
          getAllContracts(),
          getAccounts(),
          getResidents(),
          getAllUtilitiesInvoices(),
          getAllServiceInvoices(),
          getAllBookings(),
        ]);
        if (!active) return;
        setBaseData({
          apartments,
          contracts,
          accounts,
          residents,
          utilities,
          serviceInvoices,
          bookings,
        });
      } catch (loadError) {
        if (!active) return;
        setError(loadError?.response?.data?.message || "Could not load apartment layout data.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadStayHistory = async () => {
      if (!selectedApartmentId) {
        setStayHistory([]);
        return;
      }
      try {
        setIsDetailLoading(true);
        const history = await getStayHistoryByApartmentId(selectedApartmentId);
        if (active) setStayHistory(history);
      } catch {
        if (active) setStayHistory([]);
      } finally {
        if (active) setIsDetailLoading(false);
      }
    };
    loadStayHistory();
    return () => { active = false; };
  }, [selectedApartmentId]);

  useEffect(() => {
    setChargesPage(1);
    setHistoryPage(1);
  }, [selectedApartmentId]);

  const apartmentMap = new Map(baseData.apartments.map((a) => [a.id, a]));
  const accountMap = new Map(baseData.accounts.map((a) => [a.id, a]));
  const residentMap = new Map(
    baseData.residents.map((r) => [r?.account?.id ?? r?.accountId, r]),
  );
  const bookingMap = new Map(baseData.bookings.map((b) => [b.id, b]));

  const floors = Array.from(
    baseData.apartments
      .reduce((map, apt) => {
        const f = apt.floorNumber ?? 0;
        const curr = map.get(f) ?? [];
        curr.push(apt);
        map.set(f, curr);
        return map;
      }, new Map())
      .entries(),
  ).sort((a, b) => Number(b[0]) - Number(a[0]));

  const filteredFloors = floors.filter(([floorNum]) =>
    floorSearch === "" || String(floorNum).includes(floorSearch)
  );

  const selectedApartment = selectedApartmentId ? apartmentMap.get(selectedApartmentId) : null;
  const relatedContracts = baseData.contracts
    .filter(c => (c?.apartment?.id ?? c?.apartmentId) === selectedApartmentId)
    .sort((a, b) => new Date(b?.startDate || 0).getTime() - new Date(a?.startDate || 0).getTime());

  const activeContract = relatedContracts.find(c => Number(c?.status ?? 1) === 1) || relatedContracts[0] || null;
  const activeAccountId = activeContract?.account?.id ?? activeContract?.accountId ?? null;
  const activeResident = activeAccountId ? residentMap.get(activeAccountId) : null;
  const activeAccount = activeAccountId ? accountMap.get(activeAccountId) : null;

  const relatedUtilities = baseData.utilities
    .filter(inv => (inv?.apartment?.id ?? inv?.apartmentId) === selectedApartmentId)
    .sort((a, b) => {
      const keyA = `${a?.billingYear}-${String(a?.billingMonth).padStart(2, "0")}`;
      const keyB = `${b?.billingYear}-${String(b?.billingMonth).padStart(2, "0")}`;
      return keyB.localeCompare(keyA);
    });

  const relatedServiceInvoices = baseData.serviceInvoices
    .filter((inv) => {
      const booking = bookingMap.get(inv?.bookingService?.id);
      const bAccountId = booking?.account?.id ?? booking?.accountId ?? inv?.bookingService?.account?.id;
      return bAccountId === activeAccountId;
    })
    .sort((a, b) => new Date(b?.paymentDate || b?.createdAt || 0).getTime() - new Date(a?.paymentDate || a?.createdAt || 0).getTime());

  const now = new Date();
  const currentMonthRows = [];
  const currentUtility = relatedUtilities.find(inv => Number(inv?.billingMonth) === now.getMonth() + 1 && Number(inv?.billingYear) === now.getFullYear()) || relatedUtilities[0];

  if (currentUtility) {
    currentMonthRows.push({ name: "Electricity Bill", detail: `M ${currentUtility.billingMonth}/${currentUtility.billingYear}`, amount: Number(currentUtility.totalElectricUsed ?? 0), status: Number(currentUtility.status ?? 0) === 1 ? "Paid" : "Unpaid" });
    currentMonthRows.push({ name: "Water Bill", detail: `M ${currentUtility.billingMonth}/${currentUtility.billingYear}`, amount: Number(currentUtility.totalWaterUsed ?? 0), status: Number(currentUtility.status ?? 0) === 1 ? "Paid" : "Unpaid" });
  }

  const transactionHistory = [
    ...relatedUtilities.map(inv => ({ id: `u-${inv.id}`, month: `${String(inv.billingMonth).padStart(2, "0")}/${inv.billingYear}`, payer: activeResident?.fullName || activeAccount?.username || "N/A", total: Number(inv?.totalAmount ?? Number(inv?.totalElectricUsed ?? 0) + Number(inv?.totalWaterUsed ?? 0)), status: Number(inv?.status ?? 0) === 1 ? "Paid" : "Unpaid" })),
    ...relatedServiceInvoices.map(inv => ({ id: `s-${inv.id}`, month: (inv?.paymentDate || inv?.createdAt || "").slice(0, 7) || "N/A", payer: activeResident?.fullName || activeAccount?.username || "N/A", total: Number(inv?.amount ?? 0), status: Number(inv?.status ?? 0) === 1 ? "Paid" : "Unpaid" })),
  ];

  const paginatedCharges = paginateItems(currentMonthRows, chargesPage, 6);
  const chargesTotalPages = Math.ceil(currentMonthRows.length / 6) || 1;
  const paginatedHistory = paginateItems(transactionHistory, historyPage, 8);
  const historyTotalPages = Math.ceil(transactionHistory.length / 8) || 1;

  return (
    <div className="admin-apartment-layout-wrapper">
      {error && <div className="admin-feedback error" style={{ marginBottom: "20px" }}>{error}</div>}

      {!selectedApartmentId ? (
        <div className="staff-form-container building-container" style={{ padding: "0 5px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", padding: "10px 5px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.02em" }}>VinaHouse Building</h3>
              <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: "14px" }}>Visualized apartment occupation and structural layout.</p>
            </div>
            <div style={{ position: "relative", width: "260px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
              <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px" }} />
              <input
                type="text"
                placeholder="Find floor (e.g. 10)..."
                value={floorSearch}
                onChange={(e) => setFloorSearch(e.target.value)}
                style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#c98b3c"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <div
            style={{
              maxHeight: "max(600px, calc(100vh - 280px))",
              overflowY: "auto",
              borderRadius: "20px",
              paddingRight: "12px",
              paddingBottom: "20px",
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 transparent"
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "120px 0" }}>
                <FaSyncAlt className="spin" style={{ fontSize: "40px", color: "#c98b3c", marginBottom: "15px" }} />
                <p style={{ color: "#64748b", fontWeight: "600" }}>Architectural sync in progress...</p>
              </div>
            ) : filteredFloors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px", background: "#f8fafc", borderRadius: "16px", border: "2px dashed #e2e8f0" }}>
                <p style={{ color: "#64748b", margin: 0 }}>No floor data matches your search.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {filteredFloors.map(([floor, apts]) => (
                  <div
                    key={floor}
                    style={{
                      display: "flex",
                      gap: "24px",
                      padding: "24px",
                      background: "white",
                      borderRadius: "20px",
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        minWidth: "72px",
                        padding: "12px 8px",
                        background: "#c98b3c",
                        color: "#ffffff",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "900",
                        fontSize: "12px",
                        letterSpacing: "0.05em",
                        border: "1px solid #b47d32",
                        boxShadow: "0 4px 10px rgba(201, 139, 60, 0.15)"
                      }}
                    >
                      <span style={{ fontSize: "10px", opacity: 0.9, marginBottom: "2px" }}>FLOOR</span>
                      <span style={{ fontSize: "20px" }}>{floor}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px", flexGrow: 1 }}>
                      {apts.sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber)).map(apt => {
                        const occupied = baseData.contracts.some(c => (c?.apartment?.id ?? c?.apartmentId) === apt.id && Number(c?.status ?? 1) === 1);
                        return (
                          <div
                            key={apt.id}
                            onClick={() => setSelectedApartmentId(apt.id)}
                            style={{
                              padding: "14px 10px",
                              textAlign: "center",
                              borderRadius: "14px",
                              border: occupied ? "1px solid #fde68a" : "1px solid #f1f5f9",
                              cursor: "pointer",
                              background: occupied ? "#fffbeb" : "#fff",
                              color: occupied ? "#c98b3c" : "#475569",
                              fontWeight: "800",
                              fontSize: "15px",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              position: "relative",
                              boxShadow: occupied ? "none" : "inset 0 0 0 1px rgba(0,0,0,0.02)"
                            }}
                            className="apt-box-hover"
                          >
                            {apt.roomNumber}
                            <div style={{ fontSize: "10px", marginTop: "4px", opacity: 0.6, fontWeight: "600" }}>
                              {occupied ? "OCCUPIED" : "VACANT"}
                            </div>
                            {occupied && (
                              <div style={{ position: "absolute", top: "6px", right: "6px", width: "6px", height: "6px", background: "#c98b3c", borderRadius: "50%" }}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="staff-form-container apartment-detail-view" style={{ minHeight: "80vh" }}>
          <button onClick={() => setSelectedApartmentId(null)} className="btn-back">← Back to Layout</button>
          {selectedApartment && (
            <>
              <h3 style={{ marginTop: "15px", fontSize: "24px", fontWeight: "800", color: "var(--admin-primary)" }}>Apartment Details: {selectedApartment.roomNumber}</h3>
              <div style={{ background: "#f8fafc", padding: "25px", borderRadius: "12px", marginTop: "20px" }}>
                <p><strong>Floor:</strong> {selectedApartment.floorNumber}</p>
                <p><strong>Tenant:</strong> {activeResident?.fullName || activeAccount?.username || "No active contract"}</p>
                <p><strong>Residents:</strong> {isDetailLoading ? "..." : stayHistory.filter(i => !i?.moveOut).length} people</p>
              </div>
              <h4 style={{ marginTop: "35px", marginBottom: "15px", fontWeight: "800" }}>Current Charges</h4>
              <div className="admin-table-wrapper" style={{ padding: 0, border: "none" }}>
                <table className="admin-custom-table bordered">
                  <thead><tr><th>DESCRIPTION</th><th>DETAIL</th><th>AMOUNT (VND)</th><th>STATUS</th></tr></thead>
                  <tbody>{currentMonthRows.length === 0 ? <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>No charge data found.</td></tr> : paginatedCharges.map(r => <tr key={`${r.name}-${r.detail}`}><td>{r.name}</td><td>{r.detail}</td><td style={{ fontWeight: "bold" }}>{new Intl.NumberFormat("vi-VN").format(r.amount)}</td><td style={{ color: r.status === "Paid" ? "#10b981" : "#ef4444", fontWeight: "700" }}>{r.status}</td></tr>)}</tbody>
                </table>
              </div>
              <AdminPagination currentPage={chargesPage} totalPages={chargesTotalPages} onPageChange={setChargesPage} totalItems={currentMonthRows.length} pageSize={6} itemLabel="charges" />
              <h4 style={{ marginTop: "35px", marginBottom: "15px", fontWeight: "800" }}>Transaction History</h4>
              <div className="admin-table-wrapper" style={{ padding: 0, border: "none" }}>
                <table className="admin-custom-table bordered">
                  <thead><tr><th>MONTH</th><th>PAYER</th><th>TOTAL (VND)</th><th>STATUS</th></tr></thead>
                  <tbody>{transactionHistory.length === 0 ? <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>No history found.</td></tr> : paginatedHistory.map(i => <tr key={i.id}><td>{i.month}</td><td>{i.payer}</td><td style={{ fontWeight: "bold" }}>{new Intl.NumberFormat("vi-VN").format(i.total)}</td><td style={{ color: i.status === "Paid" ? "#10b981" : "#ef4444", fontWeight: "bold" }}>{i.status}</td></tr>)}</tbody>
                </table>
              </div>
              <AdminPagination currentPage={historyPage} totalPages={historyTotalPages} onPageChange={setHistoryPage} totalItems={transactionHistory.length} pageSize={8} itemLabel="transactions" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const AdminApartmentTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTypes = async () => {
    try {
      setIsLoading(true);
      const data = await getApartmentTypes();
      setTypes(data || []);
    } catch (err) {
      setError("Failed to load apartment types from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  return (
    <div className="admin-reports-container">
      <div className="resident-stats-banner" style={{ borderLeft: "5px solid var(--admin-primary)", borderRadius: "16px", padding: "30px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "25px", background: "white", boxShadow: "var(--admin-shadow-md)" }}>
        <div className="stats-icon-box" style={{ background: "var(--admin-primary-light)", color: "var(--admin-primary)", fontSize: "28px", padding: "20px", borderRadius: "14px" }}>
          <FaLayerGroup />
        </div>
        <div className="stats-info">
          <p style={{ color: "var(--admin-text-muted)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Apartment Specification Metrics</p>
          <h3 style={{ color: "var(--admin-text-main)", fontSize: "24px", fontWeight: "900" }}>{types.length} Classification Types</h3>
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "var(--admin-shadow-lg)" }}>
        <div className="form-header" style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaLayerGroup style={{ color: "var(--admin-primary)" }} />
          <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--admin-text-main)" }}>Apartment Configuration Matrix</span>
        </div>

        {error && <div className="admin-feedback error" style={{ marginBottom: "20px" }}>{error}</div>}

        <div className="staff-table-scroll">
          <table className="admin-custom-table bordered">
            <thead>
              <tr>
                <th>TYPE ID</th>
                <th>CLASSIFICATION</th>
                <th>DIMENSION (m²)</th>
                <th>CHAMBERS</th>
                <th>RENTING PRICE (VND)</th>
                <th style={{ textAlign: "center" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "60px" }}>Synchronizing configuration data...</td></tr>
              ) : types.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>Inventory empty. No types found.</td></tr>
              ) : (
                types.map((type) => (
                  <tr key={type.id} style={{ transition: "all 0.15s" }}>
                    <td style={{ fontWeight: "600", fontSize: "13px" }}>#{type.id}</td>
                    <td style={{ fontWeight: "900", color: "var(--admin-primary)", fontSize: "15px" }}>{type.typeName}</td>
                    <td style={{ fontWeight: "700" }}>{type.area} m²</td>
                    <td>{type.roomCount || "0"} rooms</td>
                    <td style={{ fontWeight: "800", color: "#10b981" }}>{new Intl.NumberFormat("vi-VN").format(type.rentPrice || 0)}</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ padding: "4px 12px", background: "var(--admin-success-light)", color: "var(--admin-success)", borderRadius: "20px", fontSize: "11px", fontWeight: "800" }}>ACTIVE</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

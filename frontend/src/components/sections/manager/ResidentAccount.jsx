import React, { useState, useEffect } from "react";
import { FaUsers, FaEdit, FaUserPlus, FaSearch, FaLock, FaUnlock, FaUserEdit } from "react-icons/fa";
import AdminPagination from "../../common/AdminPagination";
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
} from "../../../services/adminResidentService";
import { paginateItems } from "./utils";

const ResidentAccount = () => {
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
      <div className="admin-lock-resident-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* NEW MODERN COMPACT BANNER WITH SEARCH */}
        <div className="account-banner-container" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div className="account-banner-icon-box">
              <FaUsers />
            </div>
            <div className="account-banner-info-group">
              <p>RESIDENT ACCESS CONTROL</p>
              <h3 style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                {residents.length} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Residents from backend API</span>
              </h3>
            </div>
          </div>

          <div className="account-banner-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
  
        {/* FORM SECTION - ISSUING NEW ACCOUNT */}
        <section className="staff-form-container" style={{ padding: '35px', borderRadius: '24px', marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            {isEditMode ? <FaEdit style={{ color: 'var(--admin-primary)', fontSize: '22px' }} /> : <FaUserPlus style={{ color: 'var(--admin-primary)', fontSize: '22px' }} />}
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px' }}>
               {isEditMode ? "Update Resident Account" : "Issue New Resident Account"}
            </h4>
          </div>
  
          {feedback.message && (
            <div className={`admin-feedback ${feedback.type === "error" ? "error" : "success"}`} style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '25px' }}>
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
              <label>ID CARD / PASSPORT</label>
              <input
                type="text"
                value={formData.identityId}
                placeholder="Enter 12-digit ID number"
                onChange={(e) => handleInputChange("identityId", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>USERNAME</label>
              <input
                type="text"
                value={formData.username}
                placeholder="meomeomeo"
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
                placeholder="........"
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
          </div>
  
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              className="admin-btn-add"
              style={{ width: 'auto', padding: '14px 40px' }}
              onClick={handleAddOrUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : isEditMode ? "CONFIRM UPDATE" : "ISSUE ACCOUNT"}
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
  
        {/* LIST SECTION - ISSUED ACCOUNTS */}
        <section className="admin-table-wrapper" style={{ borderLeft: '6px solid #c98b3c' }}>
          <div className="resident-list-header">
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px' }}>Issued Accounts List</h4>
          </div>
  
          <div className="admin-table-scroll">
            <table className="admin-custom-table bordered">
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>USERNAME</th>
                  <th style={{ width: '18%' }}>OWNER</th>
                  <th style={{ width: '10%' }}>APARTMENT</th>
                  <th style={{ width: '10%' }}>GENDER</th>
                  <th style={{ width: '12%' }}>DOB</th>
                  <th style={{ width: '15%' }}>ID CARD</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>STATUS</th>
                  <th style={{ width: '13%', textAlign: "center" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="8" style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>Loading resident data...</td></tr>
                ) : filteredResidents.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>No matching residents found.</td></tr>
                ) : (
                  paginatedResidents.map((resident) => (
                    <tr key={resident.residentId} style={{ opacity: resident.isActive ? 1 : 0.65 }}>
                      <td><span style={{ fontWeight: 800, fontSize: '14px' }}>{resident.username}</span></td>
                      <td><span style={{ color: 'var(--admin-text-main)', fontSize: '14px' }}>{resident.fullName}</span></td>
                      <td>
                        {resident.apartments.length > 0 ? (
                          <span className="apartment-tag-orange">
                            {resident.apartments[0].roomNumber}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>N/A</span>
                        )}
                      </td>
                      <td>{resident.gender || "Other"}</td>
                      <td><span style={{ fontSize: '13px' }}>{resident.dateOfBirth || "N/A"}</span></td>
                      <td><span style={{ fontSize: '13px', color: '#64748b' }}>{resident.identityId || "N/A"}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge ${resident.isActive ? 'approved' : 'denied'}`} style={{ fontSize: '10px', padding: '4px 10px' }}>
                          {resident.isActive ? "ACTIVE" : "LOCKED"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button
                            className="action-btn-styled"
                            onClick={() => handleEditClick(resident)}
                            disabled={isSubmitting}
                            title="Edit Resident"
                          >
                            <FaUserEdit style={{ color: '#64748b' }} />
                          </button>
                          <button
                            className="action-btn-styled"
                            style={{ color: resident.isActive ? 'var(--admin-danger)' : 'var(--admin-success)' }}
                            onClick={() => handleToggleLock(resident)}
                            disabled={isSubmitting}
                            title={resident.isActive ? "Lock Account" : "Unlock Account"}
                          >
                            {resident.isActive ? <FaUnlock /> : <FaLock />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredResidents.length)} of {filteredResidents.length} residents
            </div>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredResidents.length}
              pageSize={pageSize}
              itemLabel="residents"
            />
          </div>
        </section>
      </div>
    );
  };

  export default ResidentAccount;

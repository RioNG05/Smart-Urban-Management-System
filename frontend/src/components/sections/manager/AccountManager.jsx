import React, { useState, useEffect, useMemo } from "react";
import { FaUsers, FaSearch, FaUserLock, FaUnlock } from "react-icons/fa";
import AdminPagination from "../../common/AdminPagination";
import { getAccounts, updateAccountById } from "../../../services/adminResidentService";
import { paginateItems } from "./utils";

const AccountManager = () => {
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

  export default AccountManager;

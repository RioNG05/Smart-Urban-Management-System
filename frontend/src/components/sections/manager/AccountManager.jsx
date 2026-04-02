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
          roleId: roleInfo.id
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
      <div className="admin-lock-resident-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* MODERN COMPACT BANNER WITH SEARCH */}
        <div className="account-banner-container" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div className="account-banner-icon-box">
              <FaUsers />
            </div>
            <div className="account-banner-info-group">
              <p>Access Control System</p>
              <h3>Account & Role Management</h3>
            </div>
          </div>

          <div className="account-banner-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
  
        <section className="resident-list-section" style={{ marginTop: '30px' }}>
          {feedback.message && (
            <div className={`admin-feedback ${feedback.type}`} style={{ marginBottom: '25px', padding: '12px 20px', borderRadius: '12px' }}>
              {feedback.message}
            </div>
          )}
  
          {error && (
            <div className="admin-feedback error" style={{ marginBottom: "20px" }}>{error}</div>
          )}
  
          <div className="admin-table-wrapper" style={{ borderLeft: '6px solid var(--admin-primary)' }}>
            <div className="admin-table-scroll">
              <table className="admin-custom-table bordered">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>USERNAME</th>
                    <th style={{ width: '25%' }}>EMAIL</th>
                    <th style={{ width: '30%' }}>ASSIGN ROLE</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>STATUS</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}>Loading accounts...</td></tr>
                  ) : paginatedItems.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}>No accounts found.</td></tr>
                  ) : (
                    paginatedItems.map(account => {
                      const currentRoleName = (account.role?.roleName || "").toUpperCase();
    
                      return (
                        <tr key={account.id} style={{ opacity: account.isActive !== false ? 1 : 0.6 }}>
                          <td><span style={{ fontWeight: 800, fontSize: '14px' }}>{account.username}</span></td>
                          <td><span style={{ color: 'var(--admin-text-muted)', fontSize: '13.5px' }}>{account.email}</span></td>
                          <td>
                            <select
                              className="role-selector-modern"
                              value={currentRoleName}
                              onChange={(e) => handleRoleChange(account, e.target.value)}
                              disabled={isSubmitting}
                            >
                              <option value="" disabled>-- SELECT ROLE --</option>
                              {availableRoles.map(role => (
                                <option key={role.name} value={role.name}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`status-badge ${account.isActive !== false ? 'approved' : 'denied'}`} style={{ fontSize: '10px', padding: '4px 10px' }}>
                              {account.isActive !== false ? 'ACTIVE' : 'LOCKED'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="action-btn-styled"
                              style={{ 
                                color: account.isActive !== false ? 'var(--admin-danger)' : 'var(--admin-success)'
                              }}
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
          </div>
  
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredAccounts.length)} of {filteredAccounts.length} accounts
            </div>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredAccounts.length}
              pageSize={pageSize}
              itemLabel="accounts"
            />
          </div>
        </section>
      </div>
    );
  };

  export default AccountManager;

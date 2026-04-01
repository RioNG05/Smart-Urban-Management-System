import React, { useState, useEffect, useMemo } from "react";
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaUsers, 
  FaLock, 
  FaSearch, 
  FaKey,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import AdminPagination from "../../common/AdminPagination";
import { getAccounts } from "../../../services/adminResidentService";
import { paginateItems } from "./utils";

const PermissionManager = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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
          "Could not load role data from the server.",
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

  const paginatedRoles = paginateItems(roles, currentPage, pageSize);
  const totalPages = Math.max(1, Math.ceil(roles.length / pageSize));

  const stats = useMemo(() => {
    return {
      totalRoles: roles.length,
      activeUsers: roles.reduce((sum, r) => sum + r.activeAccounts, 0),
      lockedUsers: roles.reduce((sum, r) => sum + r.lockedAccounts, 0),
    };
  }, [roles]);

  return (
    <div className="admin-content-area" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* COMPACT BANNER SECTION - Based on user's reference image */}
      <header className="role-banner-container">
        <h2 className="role-banner-title">System Role Access Overview</h2>
        <p className="role-banner-desc">
          This screen now summarizes real backend accounts grouped by role. 
          The current backend docs do not expose a standalone role CRUD API, 
          so this admin page focuses on live access distribution instead of local fake role editing.
        </p>

        <div className="role-pill-group">
          <div className="role-stat-pill">
            <FaUserShield /> Roles Detected: <span>{stats.totalRoles}</span>
          </div>
          <div className="role-stat-pill">
            <FaUsers /> Active Accounts: <span>{stats.activeUsers}</span>
          </div>
          <div className="role-stat-pill">
            <FaLock /> Locked Accounts: <span>{stats.lockedUsers}</span>
          </div>
        </div>
      </header>

      {/* Main Table section */}
      <section className="admin-table-wrapper" style={{ borderLeft: '6px solid var(--admin-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <FaShieldAlt style={{ color: 'var(--admin-primary)', fontSize: '1.4rem' }} />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Role & Access Matrix</h4>
        </div>

        {error && (
            <div className="admin-feedback error" style={{ marginBottom: '20px' }}>
                <FaExclamationCircle /> {error}
            </div>
        )}

        <div className="admin-table-scroll">
          <table className="admin-custom-table bordered">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Role Name</th>
                <th style={{ width: '45%' }}>Linked Permissions</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Accounts</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ color: 'var(--admin-text-muted)' }}>Loading system role data...</div>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ color: 'var(--admin-text-muted)' }}>
                      No system roles found.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role) => (
                  <tr key={role.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', background: 'var(--admin-primary-light)', borderRadius: '8px', color: 'var(--admin-primary)' }}>
                            <FaKey />
                        </div>
                        <strong style={{ fontSize: '15px' }}>{role.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="permission-tags">
                        {(role.permissions.length > 0
                          ? role.permissions
                          : ["No explicit permission list detail"]
                        ).map((permission) => {
                          const permStr = String(permission).toLowerCase();
                          let badgeClass = "badge-view";
                          if (permStr.includes("create") || permStr.includes("add")) badgeClass = "badge-create";
                          if (permStr.includes("read") || permStr.includes("list") || permStr.includes("get")) badgeClass = "badge-read";
                          if (permStr.includes("update") || permStr.includes("edit") || permStr.includes("put")) badgeClass = "badge-update";
                          if (permStr.includes("delete") || permStr.includes("remove")) badgeClass = "badge-delete";
                          
                          return (
                            <span key={permission} className={`status-badge ${badgeClass}`}>
                              {permission}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800 }}>{role.totalAccounts}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-success)', fontSize: '13px', fontWeight: 700 }} title="Active Accounts">
                            <FaCheckCircle /> {role.activeAccounts}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: role.lockedAccounts > 0 ? 'var(--admin-danger)' : 'var(--admin-text-muted)', fontSize: '13px', fontWeight: 700 }} title="Locked Accounts">
                            <FaLock /> {role.lockedAccounts}
                        </div>
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
          totalItems={roles.length}
          pageSize={pageSize}
          itemLabel="roles"
        />
      </section>
    </div>
  );
};

export default PermissionManager;

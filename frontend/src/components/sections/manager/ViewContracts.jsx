import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import AdminPagination from "../../common/AdminPagination";
import { getAllContracts, updateContractById } from "../../../services/adminService";
import { getAccounts, getResidents } from "../../../services/adminResidentService";
import { paginateItems } from "./utils";

const ViewContracts = () => {
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

  export default ViewContracts;

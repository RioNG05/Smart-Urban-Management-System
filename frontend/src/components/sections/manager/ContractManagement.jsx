import React, { useState, useEffect } from "react";
import {
    FaSearch, FaEdit, FaFileContract, FaPlus, FaMinus, FaBuilding, FaClipboardList
} from "react-icons/fa";
import AdminPagination from "../../common/AdminPagination";
import { getAllContracts, updateContractById } from "../../../services/adminService";
import { getAccounts, getResidents } from "../../../services/adminResidentService";
import { paginateItems } from "./utils";
import { useAuth } from "../auth/AuthContext";
import api from "../../../services/api";

const ContractManagement = () => {
    const { user } = useAuth();

    // --- SHARED STATE ---
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // --- VIEW / LISTING STATE ---
    const [contracts, setContracts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState({
        contractType: "Rent",
        monthlyRent: "",
        endDate: "",
        status: "1",
    });

    // --- CREATE FORM STATE ---
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [apartmentInfo, setApartmentInfo] = useState(null);
    const [createFormData, setCreateFormData] = useState({
        floorNumber: "",
        roomNumber: "",
        username: "",
        accountId: null,
        apartmentId: null,
        contractType: "Rent",
        startDate: "",
        endDate: "",
        monthlyRent: "",
    });

    // --- LOAD DATA ---
    const loadContracts = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [contractList, accounts, residents] = await Promise.all([
                getAllContracts(),
                getAccounts(),
                getResidents(),
            ]);

            const accountMap = new Map(accounts.map((acc) => [acc.id, acc]));
            const residentMap = new Map(
                residents.map((res) => [res?.account?.id ?? res?.accountId, res])
            );

            const normalized = contractList.map((contract) => {
                const accountId = contract?.account?.id ?? contract?.accountId;
                const account = accountMap.get(accountId) ?? contract?.account;
                const resident = residentMap.get(accountId);

                return {
                    id: contract.id,
                    apartmentId: contract?.apartment?.id ?? contract?.apartmentId ?? null,
                    apartmentLabel: contract?.apartment?.roomNumber ?? contract?.apartmentId ?? "N/A",
                    floor: contract?.apartment?.floorNumber ?? "N/A",
                    owner: resident?.fullName || account?.username || "Unknown",
                    username: account?.username || "N/A",
                    contractType: contract?.contractType || "Rent",
                    monthlyRent: contract?.monthlyRent ?? "",
                    startDate: contract?.startDate || "",
                    endDate: contract?.endDate || "",
                    status: Number(contract?.status ?? 1),
                };
            });

            setContracts(normalized);
        } catch (err) {
            setError(err?.response?.data?.message || "Could not load contract data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadContracts(); }, []);

    // --- FILTERING & PAGINATION ---
    const filteredContracts = contracts.filter((c) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        return (
            c.apartmentLabel.toString().toLowerCase().includes(query) ||
            c.owner.toLowerCase().includes(query) ||
            c.username.toLowerCase().includes(query) ||
            c.contractType.toLowerCase().includes(query)
        );
    });

    useEffect(() => { setCurrentPage(1); }, [searchTerm, contracts.length]);

    const paginatedContracts = paginateItems(filteredContracts, currentPage, pageSize);
    const totalPages = Math.max(1, Math.ceil(filteredContracts.length / pageSize));

    // --- CREATE ACTIONS ---
    const handleAddContract = async () => {
        if (!createFormData.apartmentId || !createFormData.accountId || !createFormData.startDate) {
            alert("Please fill in Floor, Room, Username and Start Date.");
            return;
        }

        const payload = {
            apartmentId: createFormData.apartmentId,
            accountId: createFormData.accountId,
            contractType: createFormData.contractType,
            startDate: createFormData.startDate,
            ...(createFormData.contractType === "Rent" && {
                endDate: createFormData.endDate,
                monthlyRent: Number(createFormData.monthlyRent),
            }),
            createdById: user.id,
            status: 1,
        };

        try {
            setIsSaving(true);
            await api.post("/contracts", payload);
            alert("Contract created successfully!");
            setShowCreateForm(false);
            setCreateFormData({
                floorNumber: "", roomNumber: "", username: "", accountId: null, apartmentId: null,
                contractType: "Rent", startDate: "", endDate: "", monthlyRent: "",
            });
            setApartmentInfo(null);
            await loadContracts();
        } catch (err) {
            console.error("Error creating contract:", err);
            const msg = err?.response?.data?.message || "Error creating contract!";
            alert(msg);
        } finally {
            setIsSaving(false);
        }
    };

    // --- EDIT ACTIONS ---
    const handleEdit = (c) => {
        setEditingId(c.id);
        setDraft({
            contractType: c.contractType,
            monthlyRent: c.monthlyRent ?? "",
            endDate: c.endDate || "",
            status: String(c.status),
        });
    };

    const handleSaveEdit = async (contractId) => {
        try {
            setIsSaving(true);
            await updateContractById(contractId, {
                contractType: draft.contractType,
                monthlyRent: draft.monthlyRent === "" ? null : Number(draft.monthlyRent),
                endDate: draft.endDate || null,
                status: Number(draft.status),
            });
            setEditingId(null);
            await loadContracts();
        } catch (err) {
            alert(err?.response?.data?.message || "Could not update contract.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-lock-resident-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>

            {/* BANNER WITH SEARCH AND TOGGLE */}
            <div className="account-banner-container" style={{ justifyContent: 'space-between', marginBottom: '35px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <div className="account-banner-icon-box">
                        <FaFileContract />
                    </div>
                    <div className="account-banner-info-group">
                        <p>REAL ESTATE OPERATIONS</p>
                        <h3>Contract Management</h3>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="account-banner-search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search contracts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={`admin-btn-add ${showCreateForm ? 'active' : ''}`}
                        style={{
                            width: 'auto',
                            padding: '0 18px',
                            height: '38px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            fontWeight: '700',
                            background: showCreateForm ? '#ef4444' : 'var(--admin-primary)',
                            borderRadius: '10px'
                        }}
                    >
                        {showCreateForm ? <><FaMinus /> CLOSE FORM</> : <><FaPlus /> ADD NEW CONTRACT</>}
                    </button>
                </div>
            </div>

            {error && <div className="admin-feedback error" style={{ marginBottom: "20px" }}>{error}</div>}

            {/* CREATE FORM (CONDITIONAL) */}
            {showCreateForm && (
                <section className="staff-form-container" style={{
                    padding: '45px',
                    borderRadius: '28px',
                    marginBottom: '40px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                    background: 'white'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
                                <FaFileContract />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '20px', color: 'var(--admin-text-main)' }}>
                                    Official Legal Contract Registration
                                </h4>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                                    Registering a new resident contract for legal security and occupancy management.
                                </p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--admin-text-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Contract Category
                            </label>
                            <div className="contract-type-pill-container" style={{ marginLeft: 'auto' }}>
                                <button
                                    className={`contract-type-pill ${createFormData.contractType === 'Rent' ? 'active' : ''}`}
                                    onClick={() => setCreateFormData({ ...createFormData, contractType: 'Rent', endDate: '' })}
                                >
                                    RENTAL (RENT)
                                </button>
                                <button
                                    className={`contract-type-pill ${createFormData.contractType === 'Sale' ? 'active' : ''}`}
                                    onClick={() => setCreateFormData({ ...createFormData, contractType: 'Sale', endDate: '' })}
                                >
                                    PURCHASE (SALE)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Property and Resident */}
                    <div className="form-section-title">
                        <FaBuilding /> PROPERTY & RESIDENT ASSIGNMENT
                    </div>
                    <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px 35px', marginBottom: '40px' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>FLOOR LEVEL</label>
                            <input
                                className="professional-form-input"
                                type="number" placeholder="Enter floor..." value={createFormData.floorNumber}
                                onChange={(e) => setCreateFormData({ ...createFormData, floorNumber: e.target.value, roomNumber: "", apartmentId: null })}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>ROOM NUMBER</label>
                            <input
                                className="professional-form-input"
                                type="number" placeholder="Enter room..." value={createFormData.roomNumber}
                                onChange={(e) => setCreateFormData({ ...createFormData, roomNumber: e.target.value, apartmentId: null })}
                                onBlur={async () => {
                                    if (!createFormData.floorNumber || !createFormData.roomNumber) return;
                                    try {
                                        const res = await api.post("/apartments/search-by-number", {
                                            roomNumber: createFormData.roomNumber, floorNumber: createFormData.floorNumber
                                        });
                                        setCreateFormData(prev => ({ ...prev, apartmentId: res.data.result.id }));
                                        setApartmentInfo(res.data.result);
                                    } catch {
                                        alert("Apartment not found!");
                                        setApartmentInfo(null);
                                    }
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>RESIDENT USERNAME</label>
                            <input
                                className="professional-form-input"
                                type="text" placeholder="Enter system username..." value={createFormData.username}
                                onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                                onBlur={async () => {
                                    if (!createFormData.username) return;
                                    try {
                                        const res = await api.get(`/accounts/search-by-username/${createFormData.username}`);
                                        if (res?.data.result.id) {
                                            setCreateFormData(prev => ({ ...prev, accountId: res.data.result.id }));
                                        } else { alert("Account not found!"); }
                                    } catch { alert("Search error!"); }
                                }}
                            />
                        </div>
                    </div>

                    {/* Section 2: Financial and Timing Terms */}
                    <div className="form-section-title">
                        <FaClipboardList /> CONTRACTUAL TERMS & FINANCIALS
                    </div>
                    <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px 35px' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>EFFECTIVE START DATE</label>
                            <input className="professional-form-input" type="date" value={createFormData.startDate} onChange={(e) => setCreateFormData({ ...createFormData, startDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>EXPIRATION DATE</label>
                            <input
                                className="professional-form-input"
                                type="date" value={createFormData.endDate} disabled={createFormData.contractType !== "Rent"}
                                onChange={(e) => setCreateFormData({ ...createFormData, endDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>MONTHLY RENTAL FEE (VND)</label>
                            <input
                                className="professional-form-input"
                                type="number" placeholder="Enter amount..." value={createFormData.monthlyRent} disabled={createFormData.contractType !== "Rent"}
                                onChange={(e) => setCreateFormData({ ...createFormData, monthlyRent: e.target.value })}
                            />
                        </div>
                    </div>

                    {apartmentInfo && (
                        <div style={{
                            marginTop: '30px',
                            padding: '15px 25px',
                            background: 'var(--admin-primary-light)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: '1px solid rgba(200, 155, 60, 0.1)'
                        }}>
                            <div style={{ color: 'var(--admin-primary)', fontSize: '18px' }}>✔</div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                                PROPERTY IDENTIFIED:
                                <strong style={{ marginLeft: '8px', color: 'var(--admin-primary)' }}>
                                    {apartmentInfo.name}
                                </strong>
                                <span style={{ marginLeft: '10px', opacity: 0.7, fontWeight: 500 }}>
                                    (Floor {apartmentInfo.floorNumber}, Room {apartmentInfo.roomNumber})
                                </span>
                            </span>
                        </div>
                    )}

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
                            onClick={handleAddContract}
                            disabled={isSaving}
                        >
                            {isSaving ? "PROCESSING REGISTRATION..." : "CREATE CONTRACT"}
                        </button>
                    </div>
                </section>
            )}

            {/* LIST SECTION */}
            <div className="admin-visual-grid">
                {isLoading ? (
                    <p>Loading contracts...</p>
                ) : filteredContracts.length === 0 ? (
                    <p>Empty results.</p>
                ) : (
                    paginatedContracts.map((item) => (
                        <div key={item.id} className="house-card hover-lift" style={{
                            background: item.status === 1 ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #334155 0%, #475569 100%)"
                        }}>
                            <div className="card-inner">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaBuilding style={{ color: 'var(--admin-primary)' }} />
                                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "white", fontWeight: 800 }}>
                                            Room {item.apartmentLabel}
                                        </h3>
                                    </div>
                                    {editingId !== item.id && (
                                        <button onClick={() => handleEdit(item)} className="admin-action-btn-small">
                                            <FaEdit /> Edit
                                        </button>
                                    )}
                                </div>

                                {editingId === item.id ? (
                                    <div className="compact-edit-form">
                                        <div className="form-group small">
                                            <label>TYPE</label>
                                            <select value={draft.contractType} onChange={(e) => setDraft({ ...draft, contractType: e.target.value })}>
                                                <option value="Rent">Rent</option>
                                                <option value="Sale">Sale</option>
                                            </select>
                                        </div>
                                        <div className="form-group small">
                                            <label>RENT (VND)</label>
                                            <input type="number" value={draft.monthlyRent} onChange={(e) => setDraft({ ...draft, monthlyRent: e.target.value })} />
                                        </div>
                                        <div className="form-group small">
                                            <label>END DATE</label>
                                            <input type="date" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} />
                                        </div>
                                        <div className="form-group small">
                                            <label>STATUS</label>
                                            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                                            <button onClick={() => setEditingId(null)} className="btn-cancel-small">Cancel</button>
                                            <button onClick={() => handleSaveEdit(item.id)} disabled={isSaving} className="btn-save-small">
                                                {isSaving ? "..." : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card-details">
                                        <div style={{ display: 'flex', gap: '15px', marginBottom: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <span className="detail-label">RESIDENT</span>
                                                <p className="detail-value">{item.owner}</p>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <span className="detail-label">TYPE</span>
                                                <p className="detail-value" style={{ color: item.contractType === 'Rent' ? '#38bdf8' : '#fbbf24' }}>{item.contractType}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <span className="detail-label">TERM</span>
                                                <p className="detail-value" style={{ fontSize: '11px' }}>{item.startDate} — {item.endDate || 'Present'}</p>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <span className="detail-label">PRICE/PH</span>
                                                <p className="detail-value">
                                                    {item.monthlyRent ? Number(item.monthlyRent).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
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

export default ContractManagement;

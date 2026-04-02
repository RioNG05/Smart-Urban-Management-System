import React, { useState, useEffect } from "react";
import { FaHistory, FaSearch, FaRegBuilding, FaCheckCircle, FaHistory as FaClock } from "react-icons/fa";
import AdminPagination from "../../common/AdminPagination";
import { getAllContracts } from "../../../services/adminService";
import { getAccounts, getResidents } from "../../../services/adminResidentService";
import { paginateItems } from "./utils";

const StayHistoryManager = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError("");

            const [cList, accList, resList] = await Promise.all([
                getAllContracts().catch(() => []), 
                getAccounts().catch(() => []), 
                getResidents().catch(() => [])
            ]);

            const accMap = {};
            if (Array.isArray(accList)) {
                accList.forEach(a => { if (a && a.id) accMap[String(a.id)] = a; });
            }

            const resMap = {};
            if (Array.isArray(resList)) {
                resList.forEach(r => {
                    const rid = r?.accountId || r?.account?.id || r?.id;
                    if (rid) resMap[String(rid)] = r;
                });
            }

            const processed = (Array.isArray(cList) ? cList : [])
                .filter(c => c && c.id)
                .map(c => {
                    const uid = String(c.accountId || c.account?.id || "");
                    const user = accMap[uid] || c.account || {};
                    const resident = resMap[uid] || {};

                    return {
                        id: String(c.id),
                        name: resident.fullName || user.username || user.fullName || "Resident #" + String(c.id).slice(-4),
                        idCard: resident.identityId || "N/A",
                        phone: resident.phoneNumber || "N/A",
                        room: c.apartment?.roomNumber || c.apartmentId || "N/A",
                        type: c.contractType || "Occupancy",
                        start: c.startDate || "N/A",
                        end: c.endDate || "Present",
                        isActive: Number(c.status) === 1,
                        sortKey: c.startDate ? new Date(c.startDate).getTime() : 0
                    };
                });

            processed.sort((a, b) => {
                if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
                return (b.sortKey || 0) - (a.sortKey || 0);
            });

            setRecords(processed);
        } catch (err) {
            console.error("FAIL:", err);
            setError("Unable to load history data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const filtered = records.filter(r => {
        const q = (searchTerm || "").toLowerCase().trim();
        if (!q) return true;
        return String(r.name).toLowerCase().includes(q) || 
               String(r.room).toLowerCase().includes(q) ||
               String(r.type).toLowerCase().includes(q) ||
               String(r.idCard).toLowerCase().includes(q) ||
               String(r.phone).toLowerCase().includes(q);
    });

    const paginated = paginateItems(filtered, currentPage, pageSize);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    return (
        <div className="admin-lock-resident-container" style={{ animation: 'fadeIn 0.3s ease-in' }}>
            {/* BANNER SECTION */}
            <div className="account-banner-container" style={{ justifyContent: 'space-between', marginBottom: '35px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <div className="account-banner-icon-box">
                        <FaClock />
                    </div>
                    <div className="account-banner-info-group">
                        <p>RESIDENTIAL MANAGEMENT</p>
                        <h3>Stay At History</h3>
                    </div>
                </div>

                <div className="account-banner-search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search residents, rooms, ID, phone..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            {error && <div className="admin-feedback error" style={{ marginBottom: '20px' }}>{error}</div>}

            <div className="staff-form-container gold-border" style={{ minHeight: '400px' }}>
                <div className="admin-table-scroll">
                    <table className="admin-custom-table bordered">
                        <thead>
                            <tr>
                                <th>RESIDENT NAME</th>
                                <th>ID CARD</th>
                                <th>PHONE</th>
                                <th>APARTMENT</th>
                                <th>TYPE</th>
                                <th>PERIOD</th>
                                <th style={{ textAlign: 'center' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading records...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>No history records found.</td></tr>
                            ) : (
                                paginated.map((r) => (
                                    <tr key={`stay-${r.id}`}>
                                        <td style={{ fontWeight: '700', color: '#0f172a' }}>{r.name}</td>
                                        <td style={{ fontSize: '13px', color: '#64748b' }}>{r.idCard}</td>
                                        <td style={{ fontSize: '13px', color: '#64748b' }}>{r.phone}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c98b3c', fontWeight: 'bold' }}>
                                                <FaRegBuilding /> {r.room}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                                                background: String(r.type).toLowerCase().includes('buy') ? '#f0f9ff' : '#fdf4ff',
                                                color: String(r.type).toLowerCase().includes('buy') ? '#0369a1' : '#86198f'
                                            }}>{r.type}</span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: '#64748b' }}>{r.start} — {r.end}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`status-badge ${r.isActive ? 'approved' : 'denied'}`}>
                                                {r.isActive ? <FaCheckCircle /> : <FaClock />}
                                                {r.isActive ? "Active" : "Past"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <AdminPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filtered.length}
                        pageSize={pageSize}
                        itemLabel="records"
                    />
                )}
            </div>
        </div>
    );
};

export default StayHistoryManager;

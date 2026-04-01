import React, { useState, useEffect } from "react";
import { FaSearch, FaSyncAlt, FaBuilding, FaDoorOpen, FaUserAlt, FaHistory, FaCreditCard, FaLayerGroup, FaPercentage } from "react-icons/fa";
import AdminPagination from "../../common/AdminPagination";
import {
  getApartments,
} from "../../../services/apartmentService";
import {
  getAllContracts,
  getAllUtilitiesInvoices,
  getAllServiceInvoices,
  getAllBookings,
  getStayHistoryByApartmentId,
} from "../../../services/adminService";
import { getAccounts, getResidents } from "../../../services/adminResidentService";
import { paginateItems } from "./utils";

const ApartmentLayout = () => {
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
  
    const totalApartments = baseData.apartments.length;
    const occupiedApartments = baseData.contracts.filter(c => Number(c?.status ?? 1) === 1).length;
    const occupancyRate = totalApartments > 0 ? ((occupiedApartments / totalApartments) * 100).toFixed(1) : 0;
  
    return (
      <div className="admin-apartment-layout-wrapper">
        {error && <div className="admin-feedback error" style={{ marginBottom: "20px" }}>{error}</div>}
  
        {!selectedApartmentId ? (
          <div className="apartment-layout-main">
            
            {/* Professional Banner Header */}
            <div className="apt-layout-banner">
              <div className="apt-layout-banner-title">VinaHouse Building</div>
              <p className="apt-layout-banner-desc">
                Comprehensive architectural visualization of apartment occupancy and building structural layout. 
                Manage assets and monitor real-time availability across all floors.
              </p>
              
              <div className="apt-stats-pills">
                <div className="apt-stat-pill">
                  <FaLayerGroup /> Total Floors: <span>{floors.length}</span>
                </div>
                <div className="apt-stat-pill">
                  <FaBuilding /> Total Apartments: <span>{totalApartments}</span>
                </div>
                <div className="apt-stat-pill">
                  <FaPercentage /> Occupancy: <span>{occupancyRate}%</span>
                </div>
              </div>

              {/* Integrated Search */}
              <div style={{ position: "absolute", bottom: "30px", right: "40px", width: "260px" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search by floor..."
                    value={floorSearch}
                    onChange={(e) => setFloorSearch(e.target.value)}
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px 12px 42px", 
                      borderRadius: "12px", 
                      border: "1px solid rgba(255,255,255,0.1)", 
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      fontSize: "14px", 
                      outline: "none", 
                      backdropFilter: "blur(10px)"
                    }}
                  />
                  <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.7)", zIndex: 1, pointerEvents: "none", fontSize: "16px" }} />
                </div>
              </div>
            </div>
  
            <div
              style={{
                maxHeight: "calc(100vh - 380px)",
                overflowY: "auto",
                paddingRight: "10px",
                paddingBottom: "40px",
                scrollbarWidth: "thin"
              }}
            >
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "120px 0" }}>
                  <FaSyncAlt className="spin" style={{ fontSize: "40px", color: "var(--admin-primary)", marginBottom: "15px" }} />
                  <p style={{ color: "var(--admin-text-muted)", fontWeight: "600" }}>Synchronizing building data...</p>
                </div>
              ) : filteredFloors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px", background: "#f8fafc", borderRadius: "16px", border: "2px dashed #e2e8f0" }}>
                  <p style={{ color: "#64748b", margin: 0 }}>No floor data matches your search query.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                  {filteredFloors.map(([floor, apts]) => (
                    <div key={floor} className="floor-card">
                      <div className="floor-badge">
                        <span className="label">FLOOR</span>
                        <span className="number">{floor}</span>
                      </div>
  
                      <div className="apt-item-grid">
                        {apts.sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber)).map(apt => {
                          const occupied = baseData.contracts.some(c => (c?.apartment?.id ?? c?.apartmentId) === apt.id && Number(c?.status ?? 1) === 1);
                          return (
                            <div
                              key={apt.id}
                              onClick={() => setSelectedApartmentId(apt.id)}
                              className={`apt-box ${occupied ? 'occupied' : ''}`}
                            >
                              <div className="apt-number">{apt.roomNumber}</div>
                              <div className={`apt-status-tag ${occupied ? 'occupied' : 'vacant'}`}>
                                {occupied ? "Occupied" : "Vacant"}
                              </div>
                              <div className="apt-indicator"></div>
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
          <div className="apartment-detail-view-container">
            <button 
              onClick={() => setSelectedApartmentId(null)} 
              className="btn-action-dark" 
              style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px" }}
            >
              ← Return to Building Layout
            </button>

            {selectedApartment && (
              <div style={{ animation: "slideUp 0.4s ease-out" }}>
                <div className="apt-detail-header-card">
                  <div className="apt-detail-title-group">
                    <h3>Apartment {selectedApartment.roomNumber}</h3>
                    <div className="apt-detail-badge">
                      <FaBuilding /> Floor {selectedApartment.floorNumber}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={`status-badge ${activeContract && Number(activeContract.status) === 1 ? 'approved' : 'pending'}`} style={{ padding: "10px 20px", fontSize: "13px" }}>
                      {activeContract && Number(activeContract.status) === 1 ? 'LIVE CONTRACT' : 'NO ACTIVE CONTRACT'}
                    </div>
                  </div>
                </div>

                <div className="apt-summary-grid">
                  <div className="apt-summary-card">
                    <div className="icon"><FaUserAlt /></div>
                    <div className="info">
                      <div className="label">Primary Tenant</div>
                      <div className="value">{activeResident?.fullName || activeAccount?.username || "Vacant"}</div>
                    </div>
                  </div>
                  <div className="apt-summary-card">
                    <div className="icon"><FaDoorOpen /></div>
                    <div className="info">
                      <div className="label">Occupancy Status</div>
                      <div className="value">{isDetailLoading ? "..." : `${stayHistory.filter(i => !i?.moveOut).length} Residents`}</div>
                    </div>
                  </div>
                  <div className="apt-summary-card">
                    <div className="icon"><FaCreditCard /></div>
                    <div className="info">
                      <div className="label">Monthly Charges</div>
                      <div className="value">{new Intl.NumberFormat("vi-VN").format(currentMonthRows.reduce((acc, curr) => acc + curr.amount, 0))} VND</div>
                    </div>
                  </div>
                </div>

                <div className="staff-form-container" style={{ padding: "30px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <FaCreditCard style={{ color: "var(--admin-primary)", fontSize: "20px" }} />
                    <h4 style={{ margin: 0, fontWeight: "800", fontSize: "18px" }}>Current Billing Cycle</h4>
                  </div>
                  <div className="admin-table-wrapper" style={{ padding: 0, border: "none", boxShadow: "none", marginBottom: 0 }}>
                    <table className="admin-custom-table">
                      <thead>
                        <tr>
                          <th>DESCRIPTION</th>
                          <th>DETAIL</th>
                          <th>AMOUNT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMonthRows.length === 0 ? (
                          <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "var(--admin-text-muted)" }}>No billing data for the current cycle.</td></tr>
                        ) : (
                          paginatedCharges.map(r => (
                            <tr key={`${r.name}-${r.detail}`}>
                              <td style={{ fontWeight: "600" }}>{r.name}</td>
                              <td>{r.detail}</td>
                              <td style={{ fontWeight: "800", color: "var(--admin-text-main)" }}>{new Intl.NumberFormat("vi-VN").format(r.amount)} VND</td>
                              <td>
                                <span className={`status-badge ${r.status === "Paid" ? 'approved' : 'denied'}`}>
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <AdminPagination currentPage={chargesPage} totalPages={chargesTotalPages} onPageChange={setChargesPage} totalItems={currentMonthRows.length} pageSize={6} itemLabel="charges" />
                </div>

                <div className="staff-form-container" style={{ padding: "30px", marginTop: "30px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <FaHistory style={{ color: "var(--admin-primary)", fontSize: "20px" }} />
                    <h4 style={{ margin: 0, fontWeight: "800", fontSize: "18px" }}>Unified Transaction History</h4>
                  </div>
                  <div className="admin-table-wrapper" style={{ padding: 0, border: "none", boxShadow: "none", marginBottom: 0 }}>
                    <table className="admin-custom-table">
                      <thead>
                        <tr>
                          <th>MONTH</th>
                          <th>PAYER</th>
                          <th>TOTAL AMOUNT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionHistory.length === 0 ? (
                          <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "var(--admin-text-muted)" }}>No transaction history found.</td></tr>
                        ) : (
                          paginatedHistory.map(i => (
                            <tr key={i.id}>
                              <td>{i.month}</td>
                              <td style={{ fontWeight: "600" }}>{i.payer}</td>
                              <td style={{ fontWeight: "800" }}>{new Intl.NumberFormat("vi-VN").format(i.total)} VND</td>
                              <td>
                                <span className={`status-badge ${i.status === "Paid" ? 'approved' : 'denied'}`}>
                                  {i.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <AdminPagination currentPage={historyPage} totalPages={historyTotalPages} onPageChange={setHistoryPage} totalItems={transactionHistory.length} pageSize={8} itemLabel="transactions" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default ApartmentLayout;

import React, { useState, useEffect } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
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

  export default ApartmentLayout;

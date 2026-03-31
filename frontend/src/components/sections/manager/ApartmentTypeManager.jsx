import React, { useState, useEffect } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { getApartmentTypes } from "../../../services/apartmentService";

const ApartmentTypeManager = () => {
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

  export default ApartmentTypeManager;

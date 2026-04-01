import React, { useState } from "react";
import { FaFileContract, FaPlus } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import api from "../../../services/api";

const CreateContract = () => {
    const { user } = useAuth();
  
    const [apartmentInfo, setApartmentInfo] = useState(null);
    const [formData, setFormData] = useState({
      floorNumber: "",
      roomNumber: "",
      apartmentName: "",
      apartmentId: null,
      username: "",
      accountId: null,
      contractType: "Rent",
      startDate: "",
      endDate: "",
      monthlyRent: "",
    });
  
    const handleAddContract = async () => {
      const payload = {
        apartmentId: formData.apartmentId,
        accountId: formData.accountId,
        contractType: formData.contractType,
        startDate: formData.startDate,
        ...(formData.contractType === "Rent" && {
          endDate: formData.endDate,
          monthlyRent: Number(formData.monthlyRent),
        }),
        createdById: user.id,
        status: 1,
      };
  
      try {
        await api.post("/api/contracts", payload);
        alert("Contract created successfully!");
      } catch {
        alert("Error creating contract!");
      }
    };
  
    return (
      <div className="admin-lock-resident-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* NEW MODERN COMPACT BANNER */}
        <div className="account-banner-container">
          <div className="account-banner-icon-box">
            <FaFileContract />
          </div>
          <div className="account-banner-info-group">
            <p>URBAN MANAGEMENT SYSTEM</p>
            <h3>Initialize New Contract</h3>
          </div>
        </div>
  
        {/* FULL WIDTH LEGAL CONTRACT FORM */}
        <section className="staff-form-container" style={{ padding: '40px', borderRadius: '24px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
            <FaPlus style={{ color: 'var(--admin-primary)', fontSize: '20px' }} />
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '18px' }}>Legal Contract Form</h4>
          </div>
  
          {/* Contract Type Selection */}
          <div style={{ marginBottom: '35px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#334155', letterSpacing: '0.5px' }}>CONTRACT TYPE</label>
            <div style={{ display: 'flex', gap: '60px', marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="contractType"
                  value="Rent"
                  checked={formData.contractType === "Rent"}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--admin-primary)' }}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value, endDate: "" })}
                />
                RENTAL (RENT)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="contractType"
                  value="Sale"
                  checked={formData.contractType === "Sale"}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--admin-primary)' }}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value, endDate: "" })}
                />
                SALE PURCHASE (SALE)
              </label>
            </div>
          </div>
  
          {/* Form Grid Layout (3 Columns) */}
          <div className="resident-grid-form" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px 35px' }}>
            {/* Row 1 */}
            <div className="form-group">
              <label>FLOOR</label>
              <input
                type="number"
                placeholder="Enter floor number..."
                value={formData.floorNumber}
                onChange={(e) => {
                  setFormData({ ...formData, floorNumber: e.target.value, roomNumber: "", apartmentId: null });
                  setApartmentInfo(null);
                }}
              />
            </div>
            <div className="form-group">
              <label>ROOM NUMBER</label>
              <input
                type="number"
                placeholder="Enter room number..."
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value, apartmentId: null })}
                onBlur={async () => {
                  if (!formData.floorNumber || !formData.roomNumber) return;
                  try {
                    const res = await api.post("/apartments/search-by-number", {
                      roomNumber: formData.roomNumber,
                      floorNumber: formData.floorNumber,
                    });
                    setFormData((prev) => ({ ...prev, apartmentId: res.data.result.id }));
                    setApartmentInfo(res.data.result);
                  } catch {
                    alert("Room not found!");
                    setApartmentInfo(null);
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>RESIDENT USERNAME</label>
              <input
                type="text"
                placeholder="Enter username..."
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                onBlur={async () => {
                  if (!formData.username) return;
                  try {
                    const res = await api.get(`/accounts/search-by-username/${formData.username}`);
                    if (res?.data.result.id) {
                      setFormData((prev) => ({ ...prev, accountId: res.data.result.id }));
                    } else {
                      alert("Account not found!");
                    }
                  } catch {
                    alert("Error finding account!");
                  }
                }}
              />
              {formData.accountId && <small style={{ color: "var(--admin-success)", fontWeight: 700, marginTop: '5px' }}>✔ ACCOUNT ID: {formData.accountId}</small>}
            </div>
  
            {/* Row 2 */}
            <div className="form-group">
              <label>CONTRACT START DATE</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label>CONTRACT END DATE</label>
              <input
                type="date"
                disabled={formData.contractType !== "Rent"}
                style={{ opacity: formData.contractType !== "Rent" ? 0.5 : 1 }}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label>MONTHLY RENT (VND)</label>
              <input
                type="number"
                disabled={formData.contractType !== "Rent"}
                style={{ opacity: formData.contractType !== "Rent" ? 0.5 : 1 }}
                placeholder="E.g., 6000000"
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
              />
            </div>
          </div>
  
          {apartmentInfo && (
            <div className="admin-feedback success" style={{ marginTop: '0', marginBottom: '30px', padding: '15px 25px', borderRadius: '14px', borderLeft: '4px solid var(--admin-success)' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#065f46' }}>
                ✔ ROOM DETECTED: <strong>{apartmentInfo.name}</strong> (Floor {apartmentInfo.floorNumber}, Room {apartmentInfo.roomNumber})
              </p>
            </div>
          )}
  
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <button
              className="admin-btn-add"
              style={{ width: "220px", padding: '14px 0' }}
              onClick={handleAddContract}
            >
              CREATE CONTRACT
            </button>
          </div>
        </section>
      </div>
    );
  };
  
  export default CreateContract;

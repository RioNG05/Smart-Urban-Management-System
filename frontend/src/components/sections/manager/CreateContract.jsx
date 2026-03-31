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
      <div className="admin-lock-resident-container">
        <div
          className="resident-stats-banner"
          style={{
            background: "linear-gradient(135deg, #1a202c 0%, #4a5568 100%)",
          }}
        >
          <div className="stats-icon-box">
            <FaFileContract />
          </div>
          <div className="stats-info">
            <p>Urban Management System</p>
            <h3>Initialize New Contract</h3>
          </div>
        </div>
        <section className="resident-form-section">
          <div className="form-header">
            <FaPlus /> <span>Legal Contract Form</span>
          </div>
  
          {/* Contract Type - Radio */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label>Contract Type</label>
            <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="contractType"
                  value="Rent"
                  checked={formData.contractType === "Rent"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contractType: e.target.value,
                      endDate: "",
                    })
                  }
                />
                Rental (Rent)
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="contractType"
                  value="Sale"
                  checked={formData.contractType === "Sale"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contractType: e.target.value,
                      endDate: "",
                    })
                  }
                />
                Sale Purchase (Sale)
              </label>
            </div>
          </div>
  
          <div className="resident-grid-form">
            {/* Floor */}
            <div className="form-group">
              <label>Floor</label>
              <input
                type="number"
                placeholder="Enter floor number..."
                value={formData.floorNumber}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    floorNumber: e.target.value,
                    roomNumber: "",
                    apartmentId: null,
                  });
                  setApartmentInfo(null);
                }}
              />
            </div>
  
            {/* Room Number */}
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="number"
                placeholder="Enter room number..."
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roomNumber: e.target.value,
                    apartmentId: null,
                  })
                }
                onBlur={async () => {
                  if (!formData.floorNumber || !formData.roomNumber) return;
                  try {
                    const res = await api.post("/apartments/search-by-number", {
                      roomNumber: formData.roomNumber,
                      floorNumber: formData.floorNumber,
                    });
                    setFormData((prev) => ({
                      ...prev,
                      apartmentId: res.data.result.id,
                    }));
                    setApartmentInfo(res.data.result);
                  } catch {
                    alert("Room not found!");
                    setApartmentInfo(null);
                  }
                }}
              />
            </div>
  
            {apartmentInfo && (
              <div
                className="apartment-info-card"
                style={{ gridColumn: "1 / -1" }}
              >
                <p>
                  ✔ Found: <strong>{apartmentInfo.name}</strong> — Floor{" "}
                  {apartmentInfo.floorNumber}, Room {apartmentInfo.roomNumber}
                </p>
                <p style={{ color: "green", fontSize: "13px" }}>
                  Apartment ID: {apartmentInfo.id}
                </p>
              </div>
            )}
  
            {/* Username → accountId */}
            <div className="form-group">
              <label>Resident Username</label>
              <input
                type="text"
                placeholder="Enter username..."
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                onBlur={async () => {
                  if (!formData.username) return;
                  try {
                    const res = await api.get(
                      `/accounts/search-by-username/${formData.username}`,
                    );
                    if (res?.data.result.id) {
                      setFormData((prev) => ({
                        ...prev,
                        accountId: res.data.result.id,
                      }));
                    } else {
                      alert("Account not found!");
                    }
                  } catch {
                    alert("Error finding account!");
                  }
                }}
              />
              {formData.accountId && (
                <small style={{ color: "green" }}>
                  ✔ Account ID: {formData.accountId}
                </small>
              )}
            </div>
  
            {/* Start Date */}
            <div className="form-group">
              <label>Contract Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
  
            {/* End Date - only if Rent */}
            {formData.contractType === "Rent" && (
              <div className="form-group">
                <label>Contract End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            )}
  
            {/* Monthly Rent - only if Rent */}
            {formData.contractType === "Rent" && (
              <div className="form-group">
                <label>Monthly Rent (VND)</label>
                <input
                  type="number"
                  placeholder="E.g., 6000000"
                  value={formData.monthlyRent}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyRent: e.target.value })
                  }
                />
              </div>
            )}
          </div>
  
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              className="btn-add-resident"
              style={{ width: "200px" }}
              onClick={handleAddContract}
            >
              Create Contract
            </button>
          </div>
        </section>
      </div>
    );
  };
  
  export default CreateContract;

import React, { useState, useEffect } from "react";
import { FaLayerGroup, FaPlus, FaUndo, FaSyncAlt, FaEdit, FaTrash, FaCheckCircle, FaBuilding } from "react-icons/fa";
import { getApartmentTypes, createApartmentType, deleteApartmentType } from "../../../services/apartmentService";

const ApartmentTypeManager = () => {
    const [types, setTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Form state
    const initialForm = {
      typeName: "",
      area: "",
      roomCount: "",
      bathroomCount: "",
      buyPrice: "",
      rentPrice: "",
      furniture: "None",
      shortDescription: ""
    };
    const [formData, setFormData] = useState(initialForm);

    const loadTypes = async () => {
      try {
        setIsLoading(true);
        const data = await getApartmentTypes();
        setTypes(data || []);
      } catch (err) {
        setError("Failed to load apartment types.");
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadTypes();
    }, []);

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
      setFormData(initialForm);
      setError("");
    };

    const handleAddType = async () => {
      if (!formData.typeName || !formData.area) {
        setError("Type Name and Area are required.");
        return;
      }
      try {
        setIsSubmitting(true);
        await createApartmentType({
          ...formData,
          area: Number(formData.area),
          roomCount: Number(formData.roomCount),
          bathroomCount: Number(formData.bathroomCount),
          buyPrice: Number(formData.buyPrice),
          rentPrice: Number(formData.rentPrice)
        });
        handleReset();
        await loadTypes();
      } catch (err) {
        setError("Error creating apartment type.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this type?")) return;
      try {
        await deleteApartmentType(id);
        await loadTypes();
      } catch (err) {
        alert("Error deleting type.");
      }
    };

    const filteredTypes = types.filter(t => 
      t.typeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="admin-lock-resident-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* MODERN COMPACT BANNER */}
        <div className="account-banner-container" style={{ justifyContent: 'space-between', marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div className="account-banner-icon-box" style={{ background: 'rgba(201, 139, 60, 0.15)', color: 'var(--admin-primary)' }}>
              <FaBuilding />
            </div>
            <div className="account-banner-info-group">
              <p style={{ letterSpacing: '2px' }}>MASTER CATALOG SYSTEM</p>
              <h3 style={{ fontSize: '24px' }}>Apartment Types & Specifications</h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="status-pill" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', padding: '10px 20px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>
              {types.length} CLASSIFICATIONS
            </div>
            <button 
              className="action-btn-styled" 
              onClick={loadTypes} 
              title="Refresh Data"
              style={{ background: 'white', color: '#0f172a', width: '45px', height: '45px', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            >
              <FaSyncAlt />
            </button>
          </div>
        </div>

        {/* TOP EQUAL SPLIT SECTION: FORM & PREVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1400px', margin: '0 auto 50px auto', alignItems: 'stretch' }}>
          
          {/* LEFT: VERTICAL FORM COLUMN */}
          <div className="staff-form-container" style={{ background: '#ffffff', padding: '35px', borderRadius: '28px', border: '1px solid #eef2f7', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Type Name */}
              <div className="form-group">
                <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>TYPE NAME</label>
                <input 
                  type="text" 
                  placeholder="e.g., Sky Garden, Cozy Studio..." 
                  style={{ height: '45px', fontSize: '13.5px', borderRadius: '12px' }}
                  value={formData.typeName}
                  onChange={(e) => handleInputChange('typeName', e.target.value)}
                />
              </div>

              {/* Area */}
              <div className="form-group">
                <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>AREA (SQM)</label>
                <input 
                  type="number" 
                  placeholder="e.g., 75" 
                  style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                />
              </div>

              {/* Layout Row: Bedrooms & Bathrooms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>BEDROOMS</label>
                  <input 
                    type="number" 
                    placeholder="2" 
                    style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                    value={formData.roomCount}
                    onChange={(e) => handleInputChange('roomCount', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>BATHROOMS</label>
                  <input 
                    type="number" 
                    placeholder="1" 
                    style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                    value={formData.bathroomCount}
                    onChange={(e) => handleInputChange('bathroomCount', e.target.value)}
                  />
                </div>
              </div>

              {/* Price Row: Buy & Rent */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>BUY PRICE (VND)</label>
                  <input 
                    type="number" 
                    placeholder="2,500,000,000" 
                    style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                    value={formData.buyPrice}
                    onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>RENT PRICE (VND)</label>
                  <input 
                    type="number" 
                    placeholder="12,000,000" 
                    style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                    value={formData.rentPrice}
                    onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Furniture */}
              <div className="form-group">
                <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>FURNITURE LEVEL</label>
                <select 
                  style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                  value={formData.furniture}
                  onChange={(e) => handleInputChange('furniture', e.target.value)}
                >
                  <option value="None">None (Basic Shell)</option>
                  <option value="Basic">Standard Furnishing</option>
                  <option value="Full">Fully Furnished</option>
                  <option value="Luxury">Premium Luxury</option>
                </select>
              </div>
            </div>

            {error && <p style={{ color: '#e11d48', fontSize: '12px', fontWeight: 700, marginTop: '15px', padding: '8px 12px', background: '#fff1f2', borderRadius: '8px' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}>
              <button className="admin-btn-add" style={{ flex: 1, height: '50px', borderRadius: '14px', fontWeight: 800, fontSize: '13px' }} onClick={handleAddType} disabled={isSubmitting}>
                {isSubmitting ? 'PROCESSING...' : 'ADD NEW CLASSIFICATION'}
              </button>
              <button 
                onClick={handleReset}
                style={{ height: '50px', padding: '0 30px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                RESET
              </button>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW CARD (50%) */}
          <div style={{ position: 'sticky', top: '110px', height: 'fit-content' }}>
            <div className="house-card" style={{ background: '#0f172a', padding: '40px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', minHeight: '660px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                <FaLayerGroup style={{ color: 'var(--admin-primary)', fontSize: '16px' }} />
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>LIVE PREVIEW</span>
              </div>
              
              <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'white', margin: '0 0 10px 0' }}>{formData.typeName || 'New apartment type'}</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: '1.6', marginBottom: '35px' }}>Preview the exact catalog entry that will be visible in the resident inventory.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '22px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 1 }}>AREA</p>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{formData.area || '--'} <span style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>sqm</span></p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '22px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 1 }}>LAYOUT</p>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{formData.roomCount || '0'}BR / {formData.bathroomCount || '0'}BA</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '22px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 1 }}>MARKET PRICE</p>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#ffc107', margin: 0, textShadow: '0 0 25px rgba(255, 193, 7, 0.4)' }}>{formData.buyPrice ? new Intl.NumberFormat('vi-VN').format(formData.buyPrice) : '--'}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '22px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 1 }}>MONTHLY RENT</p>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#ffc107', margin: 0, textShadow: '0 0 25px rgba(255, 193, 7, 0.4)' }}>{formData.rentPrice ? new Intl.NumberFormat('vi-VN').format(formData.rentPrice) : '--'}</p>
                </div>
              </div>

              <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '30px', marginTop: 'auto' }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 900, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 1 }}>DESCRIPTION OVERVIEW</p>
                <textarea 
                  placeholder="Summarize the key features..." 
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    borderRadius: '20px', 
                    padding: '22px', 
                    color: '#ffffff', 
                    fontSize: '15px', 
                    minHeight: '140px', 
                    resize: 'none', 
                    outline: 'none', 
                    lineHeight: '1.6', 
                    fontWeight: 600,
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                  }}
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: TYPE LIST */}
        <div className="admin-table-wrapper" style={{ borderLeft: '6px solid var(--admin-primary)', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ margin: 0, fontWeight: 900, color: '#0f172a' }}>Type List</h3>
            <div className="account-search-field" style={{ width: '320px' }}>
              <input 
                type="text" 
                placeholder="Search types..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-custom-table bordered">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>TYPE</th>
                  <th style={{ width: '10%' }}>AREA</th>
                  <th style={{ width: '15%' }}>LAYOUT</th>
                  <th style={{ width: '20%' }}>PRICE (BUY/RENT)</th>
                  <th style={{ width: '20%' }}>DETAIL</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "60px" }}>Loading type catalog...</td></tr>
                ) : filteredTypes.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "60px" }}>No apartment types found.</td></tr>
                ) : (
                  filteredTypes.map((type) => (
                    <tr key={type.id}>
                      <td><span style={{ fontWeight: 800, fontSize: '14.5px', color: '#0f172a' }}>{type.typeName}</span></td>
                      <td><span style={{ fontWeight: 600 }}>{type.area} sqm</span></td>
                      <td><span style={{ fontSize: '13px' }}>{type.roomCount || 0} BR / {type.bathroomCount || 0} BA</span></td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>
                          <span style={{ color: '#64748b', fontSize: '11px' }}>B:</span> {new Intl.NumberFormat('vi-VN').format(type.buyPrice || 0)}<br/>
                          <span style={{ color: '#64748b', fontSize: '11px' }}>R:</span> <span style={{ color: 'var(--admin-primary)' }}>{new Intl.NumberFormat('vi-VN').format(type.rentPrice || 0)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '250px' }}>
                          <strong style={{ color: '#334155' }}>{type.furniture}</strong><br/>
                          {type.shortDescription || 'No description provided.'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button className="action-btn-styled" title="Edit"><FaEdit /></button>
                          <button className="action-btn-styled" style={{ color: 'var(--admin-danger)' }} onClick={() => handleDelete(type.id)} title="Delete"><FaTrash /></button>
                        </div>
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

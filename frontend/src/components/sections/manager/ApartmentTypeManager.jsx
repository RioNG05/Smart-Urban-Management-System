import React, { useState, useEffect } from "react";
import { FaLayerGroup, FaSyncAlt, FaEdit, FaTrash, FaBuilding } from "react-icons/fa";
import { getApartmentTypes, createApartmentType, updateApartmentType, deleteApartmentType, getApartmentsByTypeId } from "../../../services/apartmentService";
import { normalizeApartmentTypeRecord } from "./utils";

const ApartmentTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Filter states
  const [filterFurniture, setFilterFurniture] = useState("all");
  const [filterBedrooms, setFilterBedrooms] = useState("all");
  const [filterBathrooms, setFilterBathrooms] = useState("all");
  const [filterAreaRange, setFilterAreaRange] = useState("all");
  const [filterBuyPriceRange, setFilterBuyPriceRange] = useState("all");
  const [filterRentPriceRange, setFilterRentPriceRange] = useState("all");

  // Form state
  const initialForm = {
    name: "",
    designSqrt: "",
    numberOfBedroom: "",
    numberOfBathroom: "",
    commonPriceForBuying: "",
    commonPriceForRent: "",
    furnitureTypeId: "0",
    overview: ""
  };
  const [formData, setFormData] = useState(initialForm);

  const loadTypes = async () => {
    try {
      setIsLoading(true);
      const data = await getApartmentTypes();
      setTypes((data || []).map((item, index) => normalizeApartmentTypeRecord(item, index)));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load apartment types.");
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
    setEditingTypeId(null);
    setError("");
    setShowModal(false);
  };

  const buildPayload = () => ({
    name: formData.name.trim(),
    designSqrt: Number(formData.designSqrt),
    numberOfBedroom: Number(formData.numberOfBedroom || 0),
    numberOfBathroom: Number(formData.numberOfBathroom || 0),
    commonPriceForBuying: Number(formData.commonPriceForBuying || 0),
    commonPriceForRent: Number(formData.commonPriceForRent || 0),
    furnitureTypeId: Number(formData.furnitureTypeId),
    overview: formData.overview.trim()
  });

  const handleEdit = (type) => {
    setEditingTypeId(type.id);
    setFormData({
      name: type.name ?? "",
      designSqrt: type.designSqrt ?? "",
      numberOfBedroom: type.numberOfBedroom ?? "",
      numberOfBathroom: type.numberOfBathroom ?? "",
      commonPriceForBuying: type.commonPriceForBuying ?? "",
      commonPriceForRent: type.commonPriceForRent ?? "",
      furnitureTypeId: type.furnitureTypeId || "0",
      overview: type.overview ?? ""
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.designSqrt) {
      setError("Type name and area are required.");
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      const payload = buildPayload();

      if (editingTypeId) {
        await updateApartmentType(editingTypeId, payload);
      } else {
        await createApartmentType(payload);
      }

      handleReset();
      await loadTypes();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (editingTypeId
          ? "Error updating apartment type."
          : "Error creating apartment type."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      const apartments = await getApartmentsByTypeId(id);

      if ((apartments || []).length > 0) {
        setError("This apartment type is still being used by apartments, so it cannot be deleted.");
        return;
      }

      if (!window.confirm("Are you sure you want to delete this type?")) return;
      await deleteApartmentType(id);
      if (editingTypeId === id) {
        handleReset();
      }
      await loadTypes();
    } catch (err) {
      const serverMessage = err?.response?.data?.message?.trim();
      const fallbackMessage =
        "This apartment type could not be deleted because it is still linked to existing data.";

      setError(
        serverMessage &&
          !serverMessage.toLowerCase().includes("could not execute statement")
          ? serverMessage
          : fallbackMessage,
      );
    }
  };

  const getFurnitureLabel = (id) => {
    switch (String(id)) {
      case "0": return "Basic Shell";
      case "1": return "Standard";
      case "2": return "Fully Furnished";
      case "3": return "Premium";
      case "4": return "Luxury";
      default: return "Unknown";
    }
  };

  const isFiltered =
    filterFurniture !== "all" ||
    filterBedrooms !== "all" ||
    filterBathrooms !== "all" ||
    filterAreaRange !== "all" ||
    filterBuyPriceRange !== "all" ||
    filterRentPriceRange !== "all";

  const filteredTypes = types.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFurniture = filterFurniture === "all" || String(t.furnitureTypeId) === filterFurniture;
    const matchBedrooms = filterBedrooms === "all" || String(t.numberOfBedroom) === filterBedrooms;
    const matchBathrooms = filterBathrooms === "all" || String(t.numberOfBathroom) === filterBathrooms;

    // Area Range logic
    let matchArea = filterAreaRange === "all";
    if (!matchArea) {
      const val = Number(t.designSqrt);
      if (filterAreaRange === "under_50") matchArea = val < 50;
      else if (filterAreaRange === "50_to_100") matchArea = val >= 50 && val <= 100;
      else if (filterAreaRange === "100_to_150") matchArea = val > 100 && val <= 150;
      else if (filterAreaRange === "over_150") matchArea = val > 150;
    }

    // Buying Price Logic
    let matchBuyPrice = filterBuyPriceRange === "all";
    if (!matchBuyPrice) {
      const val = Number(t.commonPriceForBuying);
      if (filterBuyPriceRange === "under_2b") matchBuyPrice = val < 2000000000;
      else if (filterBuyPriceRange === "2b_to_5b") matchBuyPrice = val >= 2000000000 && val <= 5000000000;
      else if (filterBuyPriceRange === "5b_to_10b") matchBuyPrice = val > 5000000000 && val <= 10000000000;
      else if (filterBuyPriceRange === "over_10b") matchBuyPrice = val > 10000000000;
    }

    // Rent Price Logic
    let matchRentPrice = filterRentPriceRange === "all";
    if (!matchRentPrice) {
      const val = Number(t.commonPriceForRent);
      if (filterRentPriceRange === "under_10m") matchRentPrice = val < 10000000;
      else if (filterRentPriceRange === "10m_to_20m") matchRentPrice = val >= 10000000 && val <= 20000000;
      else if (filterRentPriceRange === "20m_to_50m") matchRentPrice = val > 20000000 && val <= 50000000;
      else if (filterRentPriceRange === "over_50m") matchRentPrice = val > 50000000;
    }

    return matchSearch && matchFurniture && matchBedrooms && matchBathrooms && matchArea && matchBuyPrice && matchRentPrice;
  });

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



      {/* FILTER BAR SECTION */}
      <div style={{
        background: '#ffffff',
        padding: '20px 25px',
        borderRadius: '20px',
        border: '1px solid #eef2f7',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'end'
      }}>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '130px' }}>
          <label style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Furniture</label>
          <select
            style={{ height: '40px', fontSize: '12px', borderRadius: '10px', width: '100%' }}
            value={filterFurniture}
            onChange={(e) => setFilterFurniture(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="0">Basic Shell</option>
            <option value="1">Standard</option>
            <option value="2">Fully Furnished</option>
            <option value="3">Premium</option>
            <option value="4">Luxury</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '130px' }}>
          <label style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Bedrooms</label>
          <select
            style={{ height: '40px', fontSize: '12px', borderRadius: '10px', width: '100%' }}
            value={filterBedrooms}
            onChange={(e) => setFilterBedrooms(e.target.value)}
          >
            <option value="all">Any BR</option>
            <option value="1">1 BR</option>
            <option value="2">2 BR</option>
            <option value="3">3 BR</option>
            <option value="4">4+ BR</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '130px' }}>
          <label style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Bathrooms</label>
          <select
            style={{ height: '40px', fontSize: '12px', borderRadius: '10px', width: '100%' }}
            value={filterBathrooms}
            onChange={(e) => setFilterBathrooms(e.target.value)}
          >
            <option value="all">Any BA</option>
            <option value="1">1 BA</option>
            <option value="2">2 BA</option>
            <option value="3">3+ BA</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '130px' }}>
          <label style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Area Range</label>
          <select
            style={{ height: '40px', fontSize: '12px', borderRadius: '10px', width: '100%' }}
            value={filterAreaRange}
            onChange={(e) => setFilterAreaRange(e.target.value)}
          >
            <option value="all">All Areas</option>
            <option value="under_50">&lt; 50 sqm</option>
            <option value="50_to_100">50 - 100 sqm</option>
            <option value="100_to_150">100 - 150 sqm</option>
            <option value="over_150">&gt; 150 sqm</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '130px' }}>
          <label style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Buy Price</label>
          <select
            style={{ height: '40px', fontSize: '12px', borderRadius: '10px', width: '100%' }}
            value={filterBuyPriceRange}
            onChange={(e) => setFilterBuyPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under_2b">&lt; 2B VND</option>
            <option value="2b_to_5b">2B - 5B VND</option>
            <option value="5b_to_10b">5B - 10B VND</option>
            <option value="over_10b">&gt; 10B VND</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '130px' }}>
          <label style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Rent Price</label>
          <select
            style={{ height: '40px', fontSize: '12px', borderRadius: '10px', width: '100%' }}
            value={filterRentPriceRange}
            onChange={(e) => setFilterRentPriceRange(e.target.value)}
          >
            <option value="all">All Rents</option>
            <option value="under_10m">&lt; 10M VND</option>
            <option value="10m_to_20m">10M - 20M VND</option>
            <option value="20m_to_50m">20M - 50M VND</option>
            <option value="over_50m">&gt; 50M VND</option>
          </select>
        </div>

        {isFiltered && (
          <button
            onClick={() => {
              setFilterFurniture("all");
              setFilterBedrooms("all");
              setFilterBathrooms("all");
              setFilterAreaRange("all");
              setFilterBuyPriceRange("all");
              setFilterRentPriceRange("all");
            }}
            style={{
              height: '32px',
              padding: '0 15px',
              borderRadius: '8px',
              border: 'none',
              background: '#fb7185', // Elegant Rose/Red
              color: 'white',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 10px rgba(251, 113, 133, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            CLEAR
          </button>
        )}
      </div>

      {/* BOTTOM SECTION: TYPE LIST */}
      <div className="admin-table-wrapper" style={{ borderLeft: '6px solid var(--admin-primary)', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 style={{ margin: 0, fontWeight: 900, color: '#0f172a' }}>Apartment Type Catalog</h3>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {/* SEARCH BOX RELOCATED HERE & NARROWED */}
            <div className="account-search-field" style={{ height: '50px', width: '400px' }}>
              <input
                type="text"
                placeholder="Search types by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: '40px', fontSize: '13px', borderRadius: '12px' }}
              />
            </div>
            <button
              className="admin-btn-add"
              style={{ height: '50px', padding: '0 25px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setShowModal(true)}
            >
              <FaLayerGroup /> CREATE
            </button>
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
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "60px" }}>No apartment types match your criteria.</td></tr>
              ) : (
                filteredTypes.map((type) => (
                  <tr key={type.id}>
                    <td><span style={{ fontWeight: 800, fontSize: '14.5px', color: '#0f172a' }}>{type.name}</span></td>
                    <td><span style={{ fontWeight: 600 }}>{type.designSqrt} sqm</span></td>
                    <td><span style={{ fontSize: '13px' }}>{type.numberOfBedroom || 0} BR / {type.numberOfBathroom || 0} BA</span></td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>
                        <span style={{ color: '#64748b', fontSize: '11px' }}>B:</span> {new Intl.NumberFormat('vi-VN').format(type.commonPriceForBuying || 0)}<br />
                        <span style={{ color: '#64748b', fontSize: '11px' }}>R:</span> <span style={{ color: 'var(--admin-primary)' }}>{new Intl.NumberFormat('vi-VN').format(type.commonPriceForRent || 0)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '250px' }}>
                        <strong style={{ color: '#334155' }}>{type.furniture}</strong><br />
                        {type.overview || 'No description provided.'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button className="action-btn-styled" title="Edit" onClick={() => handleEdit(type)}><FaEdit /></button>
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

      {/* FORM MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '40px'
        }}>
          <div style={{
            background: '#f8fafc',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            borderRadius: '32px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 50px 100px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '30px 40px', borderBottom: '1px solid #eef2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{editingTypeId ? 'Edit Apartment Type' : 'Create New Apartment Type'}</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>Fill in the details to manage your catalog classification.</p>
              </div>
              <button
                onClick={handleReset}
                style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '12px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>

                {/* LEFT: FORM */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>TYPE NAME</label>
                    <input
                      type="text"
                      placeholder="e.g., Sky Garden, Cozy Studio..."
                      style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>AREA (SQM)</label>
                      <input
                        type="number"
                        placeholder="75"
                        style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                        value={formData.designSqrt}
                        onChange={(e) => handleInputChange('designSqrt', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>FURNITURE LEVEL</label>
                      <select
                        style={{ height: '50px', fontSize: '14px', borderRadius: '14px', width: '100%' }}
                        value={formData.furnitureTypeId}
                        onChange={(e) => handleInputChange('furnitureTypeId', e.target.value)}
                      >
                        <option value="0">None (Basic Shell)</option>
                        <option value="1">Standard Furnishing</option>
                        <option value="2">Fully Furnished</option>
                        <option value="3">Premium</option>
                        <option value="4">Luxury</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>BEDROOMS</label>
                      <input
                        type="number"
                        placeholder="2"
                        style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                        value={formData.numberOfBedroom}
                        onChange={(e) => handleInputChange('numberOfBedroom', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>BATHROOMS</label>
                      <input
                        type="number"
                        placeholder="1"
                        style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                        value={formData.numberOfBathroom}
                        onChange={(e) => handleInputChange('numberOfBathroom', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>BUY PRICE (VND)</label>
                      <input
                        type="number"
                        placeholder="2,500,000,000"
                        style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                        value={formData.commonPriceForBuying}
                        onChange={(e) => handleInputChange('commonPriceForBuying', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>RENT PRICE (VND)</label>
                      <input
                        type="number"
                        placeholder="12,000,000"
                        style={{ height: '50px', fontSize: '14px', borderRadius: '14px' }}
                        value={formData.commonPriceForRent}
                        onChange={(e) => handleInputChange('commonPriceForRent', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>DESCRIPTION (OVERVIEW)</label>
                    <textarea
                      placeholder="Detailed description of features, location, and amenities..."
                      style={{ height: '120px', fontSize: '14px', borderRadius: '14px', width: '100%', padding: '15px', resize: 'none' }}
                      value={formData.overview}
                      onChange={(e) => handleInputChange('overview', e.target.value)}
                    />
                  </div>
                </div>

                {/* RIGHT: PREVIEW */}
                <div>
                  <div style={{ background: '#0f172a', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <FaLayerGroup style={{ color: 'var(--admin-primary)', fontSize: '14px' }} />
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>LIVE PREVIEW</span>
                    </div>

                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'white', margin: '0 0 10px 0' }}>{formData.name || 'Untitled Type'}</h3>

                    {/* ADDED FURNITURE TYPE IN PREVIEW */}
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--admin-primary)', background: 'rgba(201, 139, 60, 0.1)', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                        {getFurnitureLabel(formData.furnitureTypeId)}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 800, marginBottom: '5px' }}>AREA</p>
                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{formData.designSqrt || '--'} <span style={{ fontSize: '10px', fontWeight: 400 }}>sqm</span></p>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 800, marginBottom: '5px' }}>LAYOUT</p>
                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{formData.numberOfBedroom || '0'}BR / {formData.numberOfBathroom || '0'}BA</p>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 800, marginBottom: '10px' }}>ESTIMATED PRICING</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Purchase:</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffc107' }}>{formData.commonPriceForBuying ? new Intl.NumberFormat('vi-VN').format(formData.commonPriceForBuying) + ' ₫' : '--'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Rental:</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffc107' }}>{formData.commonPriceForRent ? new Intl.NumberFormat('vi-VN').format(formData.commonPriceForRent) + ' ₫' : '--'}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '25px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px', minHeight: '100px' }}>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 800, marginBottom: '8px' }}>OVERVIEW</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.5' }}>{formData.overview || 'No description provided.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '25px 40px', borderTop: '1px solid #eef2f7', display: 'flex', gap: '15px', justifyContent: 'flex-end', background: 'white' }}>
              {error && <div style={{ color: '#e11d48', fontSize: '12px', fontWeight: 700, marginRight: 'auto', alignSelf: 'center' }}>{error}</div>}
              <button
                onClick={handleReset}
                style={{ padding: '0 25px', height: '48px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                CANCEL
              </button>
              <button
                className="admin-btn-add"
                style={{ padding: '0 40px', height: '48px', borderRadius: '14px', fontWeight: 800, fontSize: '13px' }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SAVING...' : editingTypeId ? 'UPDATE TYPE' : 'CREATE TYPE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentTypeManager;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaConciergeBell,
  FaTimes,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";
import {
  createService,
  createServiceResource,
  deleteService,
  deleteServiceResource,
  getBookingVisibilityMap,
  getServiceResources,
  getServices,
  removeServiceBookingVisibility,
  setServiceBookingVisibility,
  updateServiceResource,
  updateService,
  uploadServiceImage,
  uploadServiceResourceImage,
} from "../../../services/serviceService";
import AdminPagination from "../../common/AdminPagination";

const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const initialForm = {
  serviceName: "",
  serviceCode: "",
  feePerUnit: "",
  unitType: "",
  description: "",
  imageUrl: "",
  isBookable: true,
};

const initialResourceForm = {
  resourceCode: "",
  location: "",
  isAvailable: true,
};

const ServiceResourceModal = ({
  open,
  service,
  resources,
  formData,
  imagePreviewUrl,
  editingId,
  isSubmitting,
  onClose,
  onChange,
  onImageChange,
  onEdit,
  onDelete,
  onSubmit,
}) => {
  if (!open || !service) return null;

  return (
    <div className="service-resource-modal-overlay" onClick={onClose}>
      <div
        className="service-resource-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="service-resource-modal-header">
          <div>
            <p className="service-resource-modal-kicker">SERVICE RESOURCE</p>
            <h3>{service.title}</h3>
            <span>Manage resources used on booking for this service.</span>
          </div>
          <button
            type="button"
            className="action-btn-styled"
            onClick={onClose}
            title="Close Resource Manager"
          >
            <FaTimes />
          </button>
        </div>

        <div className="service-resource-modal-body">
          <section className="service-resource-form-panel">
            <div className="service-resource-form-header">
              <h4>{editingId ? "Edit resource" : "Create resource"}</h4>
              <p>{editingId ? "Update this resource" : "Add a new resource"}</p>
            </div>

            <div className="service-manager-form-grid">
              <div className="form-group">
                <label>Resource code</label>
                <input
                  type="text"
                  value={formData.resourceCode}
                  onChange={(event) =>
                    onChange("resourceCode", event.target.value)
                  }
                  placeholder="POOL-A1"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(event) => onChange("location", event.target.value)}
                  placeholder="Block A - Level 2"
                />
              </div>

              <div className="form-group">
                <label>Resource image</label>
                <input type="file" accept="image/*" onChange={onImageChange} />
                <span className="service-manager-upload-note">
                  Upload an image from your computer for this booking resource.
                </span>
                {imagePreviewUrl ? (
                  <div className="service-manager-image-preview service-resource-image-preview">
                    <img src={imagePreviewUrl} alt="Resource preview" />
                  </div>
                ) : null}
              </div>

              <label className="service-manager-checkbox">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(event) =>
                    onChange("isAvailable", event.target.checked)
                  }
                />
                Available for booking
              </label>
            </div>

            <div className="service-resource-form-actions">
              <button
                type="button"
                className="admin-btn-add"
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : editingId
                    ? "Update Resource"
                    : "Create Resource"}
              </button>
              <button
                type="button"
                className="service-resource-cancel-btn"
                onClick={() => {
                  onChange("resourceCode", "");
                  onChange("location", "");
                  onChange("isAvailable", true);
                  onEdit(null);
                }}
              >
                Reset
              </button>
            </div>
          </section>

          <section className="service-resource-list-panel">
            <div className="service-resource-list-header">
              <h4>Existing resources</h4>
              <span>{resources.length} records</span>
            </div>

            <div className="service-resource-list">
              {resources.length === 0 ? (
                <div className="service-resource-empty">
                  No resources have been created for this service yet.
                </div>
              ) : (
                resources.map((resource) => (
                  <div key={resource.id} className="service-resource-card">
                    {resource.imageUrl ? (
                      <img
                        src={resource.imageUrl}
                        alt={
                          resource.resourceCode || `Resource #${resource.id}`
                        }
                        className="service-resource-card-thumb"
                      />
                    ) : null}
                    <div className="service-resource-card-main">
                      <div className="service-resource-card-title">
                        {resource.resourceCode || `Resource #${resource.id}`}
                      </div>
                      <div className="service-resource-card-location">
                        {resource.location || "No location"}
                      </div>
                    </div>
                    <span
                      className={`status-badge ${
                        resource.isAvailable ? "approved" : "denied"
                      }`}
                    >
                      {resource.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    <div className="service-manager-action-group">
                      <button
                        type="button"
                        className="action-btn-styled"
                        title="Edit Resource"
                        onClick={() => onEdit(resource)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="action-btn-styled"
                        title="Delete Resource"
                        style={{ color: "var(--admin-danger)" }}
                        onClick={() => onDelete(resource.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [bookingVisibility, setBookingVisibility] = useState({});
  const [formData, setFormData] = useState(initialForm);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [activeResourceService, setActiveResourceService] = useState(null);
  const [allResources, setAllResources] = useState([]);
  const [resourceFormData, setResourceFormData] = useState(initialResourceForm);
  const [resourceImageFile, setResourceImageFile] = useState(null);
  const [resourceImagePreviewUrl, setResourceImagePreviewUrl] = useState("");
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [isResourceSubmitting, setIsResourceSubmitting] = useState(false);
  const pageSize = 6;
  const imageInputRef = useRef(null);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [items, resources] = await Promise.all([
        getServices(),
        getServiceResources(),
      ]);
      setServices(items);
      setAllResources(resources);
      setBookingVisibility(getBookingVisibilityMap());
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Could not load services from backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return services;

    return services.filter((service) =>
      [
        service.title,
        service.serviceCode,
        service.unitType,
        service.description,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [searchTerm, services]);

  const visibleOnBookingCount = useMemo(
    () =>
      services.filter(
        (service) => bookingVisibility[String(service.id)] !== false,
      ).length,
    [bookingVisibility, services],
  );

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const paginatedServices = useMemo(
    () =>
      filteredServices.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, filteredServices],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, services.length]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResourceInputChange = (field, value) => {
    setResourceFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(initialForm);
    setSelectedImageFile(null);
    setImagePreviewUrl("");
    setEditingId(null);
    setIsFormVisible(false);
    setError("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleResourceReset = () => {
    setResourceFormData(initialResourceForm);
    setResourceImageFile(null);
    setResourceImagePreviewUrl("");
    setEditingResourceId(null);
  };

  const validateForm = () => {
    if (
      !formData.serviceName.trim() ||
      !formData.serviceCode.trim() ||
      formData.feePerUnit === "" ||
      !formData.unitType.trim() ||
      !formData.description.trim() ||
      (!formData.imageUrl.trim() && !selectedImageFile)
    ) {
      return "Please complete all required service fields.";
    }

    if (Number.isNaN(Number(formData.feePerUnit))) {
      return "Fee per unit must be a valid number.";
    }

    return "";
  };

  const buildPayload = () => ({
    serviceName: formData.serviceName,
    serviceCode: formData.serviceCode,
    feePerUnit: formData.feePerUnit,
    unitType: formData.unitType,
    description: formData.description,
    imageUrl: formData.imageUrl,
    isBookable: formData.isBookable,
  });

  const handleSubmit = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      let nextImageUrl = formData.imageUrl;

      if (selectedImageFile) {
        nextImageUrl = await uploadServiceImage(
          selectedImageFile,
          `${formData.serviceCode || formData.serviceName || "service"}-${Date.now()}`,
        );
      }

      if (editingId) {
        await updateService(editingId, {
          ...buildPayload(),
          imageUrl: nextImageUrl,
        });
        toast.success("Service updated successfully.");
      } else {
        const createdService = await createService({
          ...buildPayload(),
          imageUrl: nextImageUrl,
        });
        setServiceBookingVisibility(createdService.id, true);
        toast.success("Service created successfully.");
      }

      handleReset();
      await loadServices();
    } catch (submitError) {
      const message =
        submitError?.response?.data?.message ||
        (editingId
          ? "Could not update this service."
          : "Could not create this service.");
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClick = () => {
    setFormData(initialForm);
    setSelectedImageFile(null);
    setImagePreviewUrl("");
    setEditingId(null);
    setError("");
    setIsFormVisible(true);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      serviceName: service.title ?? "",
      serviceCode: service.serviceCode ?? "",
      feePerUnit: service.feePerUnit ?? "",
      unitType: service.unitType ?? "",
      description: service.description ?? "",
      imageUrl: service.imageUrl ?? service.image ?? "",
      isBookable: service.isBookable === true,
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(service.imageUrl ?? service.image ?? "");
    setError("");
    setIsFormVisible(true);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImageFile(null);
      setImagePreviewUrl(formData.imageUrl || "");
      return;
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      setError("");
      await deleteService(serviceId);
      const nextMap = removeServiceBookingVisibility(serviceId);
      setBookingVisibility(nextMap);
      toast.success("Service deleted successfully.");
      if (editingId === serviceId) {
        handleReset();
      }
      await loadServices();
    } catch (deleteError) {
      const message =
        deleteError?.response?.data?.message ||
        "This service could not be deleted.";
      setError(message);
      toast.error(message);
    }
  };

  const handleBookingVisibilityToggle = (serviceId) => {
    const nextVisibility = bookingVisibility[String(serviceId)] === false;
    const nextMap = setServiceBookingVisibility(serviceId, nextVisibility);
    setBookingVisibility(nextMap);
    toast.success(
      nextVisibility
        ? "Service is now visible on booking."
        : "Service has been hidden from booking.",
    );
  };

  const openResourceModal = (service) => {
    setActiveResourceService(service);
    setIsResourceModalOpen(true);
    handleResourceReset();
  };

  const closeResourceModal = () => {
    setIsResourceModalOpen(false);
    setActiveResourceService(null);
    handleResourceReset();
  };

  const handleEditResource = (resource) => {
    if (!resource) {
      handleResourceReset();
      return;
    }

    setEditingResourceId(resource.id);
    setResourceFormData({
      resourceCode: resource.resourceCode ?? "",
      location: resource.location ?? "",
      isAvailable: resource.isAvailable !== false,
    });
    setResourceImageFile(null);
    setResourceImagePreviewUrl(resource.imageUrl || "");
  };

  const handleResourceImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResourceImageFile(null);
      return;
    }

    setResourceImageFile(file);
    setResourceImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      await deleteServiceResource(resourceId);
      toast.success("Service resource deleted successfully.");
      handleResourceReset();
      await loadServices();
    } catch (deleteError) {
      toast.error(
        deleteError?.response?.data?.message ||
          "Could not delete this service resource.",
      );
    }
  };

  const handleSubmitResource = async () => {
    if (!activeResourceService?.id) return;

    if (
      !resourceFormData.resourceCode.trim() ||
      !resourceFormData.location.trim()
    ) {
      toast.error("Please complete resource code and location.");
      return;
    }

    const normalizedResourceCode = resourceFormData.resourceCode
      .trim()
      .toLowerCase();
    const hasDuplicateResourceCode = activeServiceResources.some(
      (resource) =>
        resource.id !== editingResourceId &&
        String(resource.resourceCode ?? "")
          .trim()
          .toLowerCase() === normalizedResourceCode,
    );

    if (hasDuplicateResourceCode) {
      toast.error("Resource code already exists for this service.");
      return;
    }

    try {
      setIsResourceSubmitting(true);

      const payload = {
        ...resourceFormData,
        serviceId: activeResourceService.id,
      };

      if (editingResourceId) {
        await updateServiceResource(editingResourceId, payload);
        if (resourceImageFile) {
          await uploadServiceResourceImage(
            editingResourceId,
            resourceImageFile,
            payload.location || payload.resourceCode || "",
          );
        }
        toast.success("Service resource updated successfully.");
      } else {
        const createdResource = await createServiceResource(payload);
        if (resourceImageFile && createdResource?.id) {
          await uploadServiceResourceImage(
            createdResource.id,
            resourceImageFile,
            payload.location || payload.resourceCode || "",
          );
        }
        toast.success("Service resource created successfully.");
      }

      handleResourceReset();
      await loadServices();
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
          (editingResourceId
            ? "Could not update this service resource."
            : "Could not create this service resource."),
      );
    } finally {
      setIsResourceSubmitting(false);
    }
  };

  const activeServiceResources = useMemo(() => {
    if (!activeResourceService?.id) return [];
    return allResources.filter(
      (resource) =>
        Number(resource.serviceId) === Number(activeResourceService.id),
    );
  }, [activeResourceService, allResources]);

  return (
    <div
      className="admin-lock-resident-container service-manager-page"
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      <div
        className="account-banner-container"
        style={{ justifyContent: "space-between", marginBottom: "35px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <div className="account-banner-icon-box">
            <FaConciergeBell />
          </div>
          <div className="account-banner-info-group">
            <p style={{ letterSpacing: "2px" }}>SERVICE CATALOG CONTROL</p>
            <h3 style={{ fontSize: "24px" }}>Service Management</h3>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            className="status-pill"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.6)",
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {visibleOnBookingCount}/{services.length} AVAILABLE
          </div>
          <button
            type="button"
            className="admin-btn-add"
            onClick={handleCreateClick}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaPlus />
            Create
          </button>
          <button
            className="action-btn-styled"
            onClick={loadServices}
            title="Refresh Services"
            style={{
              background: "white",
              color: "#0f172a",
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      <div className="service-manager-layout">
        {isFormVisible ? (
          <section className="staff-form-container service-manager-form-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 800,
                    letterSpacing: "1px",
                  }}
                >
                  {editingId ? "UPDATE SERVICE" : "NEW SERVICE"}
                </p>
                <h3 style={{ margin: "6px 0 0", color: "#0f172a" }}>
                  {editingId ? "Edit service details" : "Create a new service"}
                </h3>
              </div>
              <button
                type="button"
                className="action-btn-styled"
                title="Close Form"
                onClick={handleReset}
              >
                <FaTimes />
              </button>
            </div>

            <div className="service-manager-form-grid">
              <div className="form-group">
                <label>Service name</label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(event) =>
                    handleInputChange("serviceName", event.target.value)
                  }
                  placeholder="Enter service name"
                />
              </div>

              <div className="service-manager-two-column">
                <div className="form-group">
                  <label>Service code</label>
                  <input
                    type="text"
                    value={formData.serviceCode}
                    onChange={(event) =>
                      handleInputChange("serviceCode", event.target.value)
                    }
                    placeholder="SV-POOL"
                  />
                </div>

                <div className="form-group">
                  <label>Unit type</label>
                  <input
                    type="text"
                    value={formData.unitType}
                    onChange={(event) =>
                      handleInputChange("unitType", event.target.value)
                    }
                    placeholder="hour"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fee per unit</label>
                <input
                  type="number"
                  min="0"
                  value={formData.feePerUnit}
                  onChange={(event) =>
                    handleInputChange("feePerUnit", event.target.value)
                  }
                  placeholder="150000"
                />
              </div>

              <div className="form-group">
                <label>Service image</label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                <span className="service-manager-upload-note">
                  Choose an image from your computer. The file will be uploaded
                  automatically when you save.
                </span>
                {imagePreviewUrl || formData.imageUrl ? (
                  <div className="service-manager-image-preview">
                    <img
                      src={imagePreviewUrl || formData.imageUrl}
                      alt={formData.serviceName || "Service preview"}
                    />
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    handleInputChange("description", event.target.value)
                  }
                  placeholder="Describe the service..."
                  rows={5}
                  className="service-manager-textarea"
                />
              </div>

              <label className="service-manager-checkbox">
                <input
                  type="checkbox"
                  checked={formData.isBookable}
                  onChange={(event) =>
                    handleInputChange("isBookable", event.target.checked)
                  }
                />
                Bookable on the system
              </label>
            </div>

            {error ? (
              <div
                style={{
                  marginTop: "18px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "#fff1f2",
                  color: "#be123c",
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                className="admin-btn-add"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting
                  ? "Processing..."
                  : editingId
                    ? "Update Service"
                    : "Create Service"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                  padding: "0 20px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>
          </section>
        ) : null}

        <section
          className="admin-table-wrapper service-manager-table-card"
          style={{ borderLeft: "6px solid var(--admin-primary)" }}
        >
          <div className="service-manager-table-toolbar">
            <div>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Service list</h3>
            </div>
            <div className="account-search-field service-manager-search">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-scroll service-manager-table-scroll">
            <table className="admin-custom-table bordered service-manager-table">
              <thead>
                <tr>
                  <th style={{ width: "34%" }}>SERVICE</th>
                  <th style={{ width: "16%" }}>CODE</th>
                  <th style={{ width: "16%" }}>PRICE</th>
                  <th style={{ width: "12%" }}>UNIT</th>
                  <th style={{ width: "22%" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "50px 0" }}
                    >
                      Loading services...
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "50px 0" }}
                    >
                      No services found.
                    </td>
                  </tr>
                ) : (
                  paginatedServices.map((service) => {
                    const visibleOnBooking =
                      bookingVisibility[String(service.id)] !== false;

                    return (
                      <tr key={service.id}>
                        <td>
                          <div className="service-manager-service-cell">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.title}
                                className="service-manager-thumb"
                              />
                            ) : null}
                            <div className="service-manager-service-meta">
                              <div className="service-manager-service-title">
                                {service.title}
                              </div>
                              <div className="service-manager-service-desc">
                                {service.description || "No description"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{service.serviceCode || "N/A"}</td>
                        <td>
                          {service.feePerUnit != null
                            ? CURRENCY_FORMATTER.format(
                                Number(service.feePerUnit),
                              )
                            : "N/A"}
                        </td>
                        <td>{service.unitType || "N/A"}</td>
                        <td>
                          <div className="service-manager-action-group">
                            <button
                              type="button"
                              className={`action-btn-circle ${
                                visibleOnBooking ? "approve" : "deny"
                              }`}
                              title={
                                visibleOnBooking
                                  ? "Hide from booking page"
                                  : "Show on booking page"
                              }
                              onClick={() =>
                                handleBookingVisibilityToggle(service.id)
                              }
                            >
                              {visibleOnBooking ? <FaEye /> : <FaEyeSlash />}
                            </button>
                            <button
                              type="button"
                              className="action-btn-styled"
                              title="Manage Service Resources"
                              onClick={() => openResourceModal(service)}
                            >
                              <FaBoxOpen />
                            </button>
                            <button
                              type="button"
                              className="action-btn-styled"
                              title="Edit Service"
                              onClick={() => handleEdit(service)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="action-btn-styled"
                              title="Delete Service"
                              style={{ color: "var(--admin-danger)" }}
                              onClick={() => handleDelete(service.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="service-manager-pagination-row">
            <div
              style={{
                fontSize: "13px",
                color: "var(--admin-text-muted)",
                fontWeight: 500,
              }}
            >
              Showing{" "}
              {filteredServices.length > 0
                ? (currentPage - 1) * pageSize + 1
                : 0}
              -{Math.min(currentPage * pageSize, filteredServices.length)} of{" "}
              {filteredServices.length} services
            </div>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredServices.length}
              pageSize={pageSize}
              itemLabel="services"
            />
          </div>
        </section>
      </div>

      <ServiceResourceModal
        open={isResourceModalOpen}
        service={activeResourceService}
        resources={activeServiceResources}
        formData={resourceFormData}
        imagePreviewUrl={resourceImagePreviewUrl}
        editingId={editingResourceId}
        isSubmitting={isResourceSubmitting}
        onClose={closeResourceModal}
        onChange={handleResourceInputChange}
        onImageChange={handleResourceImageChange}
        onEdit={handleEditResource}
        onDelete={handleDeleteResource}
        onSubmit={handleSubmitResource}
      />
    </div>
  );
};

export default ServiceManager;

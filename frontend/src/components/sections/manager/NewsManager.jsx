import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaNewspaper,
  FaPlus,
  FaSyncAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import AdminPagination from "../../common/AdminPagination";
import {
  createNews,
  deleteNews,
  getNewsList,
  updateNews,
  uploadNewsImage,
} from "../../../services/newsService";
import { canManageNews, isStaffPortalRole } from "../../../admin/adminAccess";

const initialForm = {
  title: "",
  imageUrl: "",
  content: "",
};

const NewsManager = () => {
  const { user, role } = useAuth();
  const readOnly = isStaffPortalRole(role) && !canManageNews(role);
  const fileInputRef = useRef(null);
  const [articles, setArticles] = useState([]);
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
  const pageSize = 6;

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getNewsList();
      const sortedArticles = [...data].sort((a, b) => {
        const first = new Date(b.lastUpdateRaw ?? 0).getTime();
        const second = new Date(a.lastUpdateRaw ?? 0).getTime();
        return first - second || Number(b.id ?? 0) - Number(a.id ?? 0);
      });
      setArticles(sortedArticles);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          "Could not load news articles from backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return articles;

    return articles.filter((article) =>
      [article.title, article.author, article.desc, article.content]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [articles, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, articles.length]);

  useEffect(() => {
    if (!imagePreviewUrl.startsWith("blob:")) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const paginatedArticles = useMemo(
    () =>
      filteredArticles.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, filteredArticles],
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(initialForm);
    setSelectedImageFile(null);
    setImagePreviewUrl("");
    setEditingId(null);
    setIsFormVisible(false);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!user?.id) {
      return "Could not identify the current account to publish this article.";
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      return "Please enter the article title and content.";
    }

    return "";
  };

  const buildPayload = () => ({
    title: formData.title,
    imageUrl: formData.imageUrl,
    content: formData.content,
    userId: user.id,
  });

  const buildUploadName = () => {
    const normalizedTitle = String(formData.title ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `news-${normalizedTitle || "article"}-${Date.now()}`;
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedImageFile(null);
      setImagePreviewUrl(formData.imageUrl || "");
      return;
    }

    if (!String(file.type ?? "").startsWith("image/")) {
      const message = "Please choose a valid image file.";
      setError(message);
      setSelectedImageFile(null);
      setImagePreviewUrl(formData.imageUrl || "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.error(message);
      return;
    }

    setError("");
    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

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
        nextImageUrl = await uploadNewsImage(
          selectedImageFile,
          buildUploadName(),
        );
      }

      const payload = {
        ...buildPayload(),
        imageUrl: nextImageUrl,
      };

      if (editingId) {
        await updateNews(editingId, payload);
        toast.success("Article updated successfully.");
      } else {
        await createNews(payload);
        toast.success("Article created successfully.");
      }

      handleReset();
      await loadArticles();
    } catch (submitError) {
      const message =
        submitError?.response?.data?.message ||
        (editingId
          ? "Could not update this article."
          : "Could not create this article.");
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClick = () => {
    if (readOnly) return;

    setFormData(initialForm);
    setSelectedImageFile(null);
    setImagePreviewUrl("");
    setEditingId(null);
    setError("");
    setIsFormVisible(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (article) => {
    if (readOnly) return;

    setEditingId(article.id);
    setFormData({
      title: article.title ?? "",
      imageUrl: article.image ?? "",
      content: article.content ?? "",
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(article.image ?? "");
    setError("");
    setIsFormVisible(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (articleId) => {
    if (readOnly) return;

    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      setError("");
      await deleteNews(articleId);
      toast.success("Article deleted successfully.");
      if (editingId === articleId) {
        handleReset();
      }
      await loadArticles();
    } catch (deleteError) {
      const message =
        deleteError?.response?.data?.message ||
        "This article could not be deleted.";
      setError(message);
      toast.error(message);
    }
  };

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
            <FaNewspaper />
          </div>
          <div className="account-banner-info-group">
            <p style={{ letterSpacing: "2px" }}>CONTENT PUBLISHING CONTROL</p>
            <h3 style={{ fontSize: "24px" }}>News Management</h3>
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
            {articles.length} ARTICLES
          </div>
          {!readOnly ? (
            <button
              type="button"
              className="admin-btn-add"
              onClick={handleCreateClick}
              style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
            >
              <FaPlus />
              Create
            </button>
          ) : null}
          <button
            className="action-btn-styled"
            onClick={loadArticles}
            title="Refresh Articles"
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

      {readOnly ? (
        <div className="admin-feedback" style={{ marginBottom: "24px", borderRadius: "14px" }}>
          You do not have permission to edit news. This screen is available in view-only mode.
        </div>
      ) : null}

      <div className="service-manager-layout">
        {!readOnly && isFormVisible ? (
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
                  {editingId ? "UPDATE ARTICLE" : "NEW ARTICLE"}
                </p>
                <h3 style={{ margin: "6px 0 0", color: "#0f172a" }}>
                  {editingId ? "Edit article details" : "Create a news article"}
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
                <label>Article title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) =>
                    handleInputChange("title", event.target.value)
                  }
                  placeholder="Enter article title"
                />
              </div>

              <div className="form-group">
                <label>Article image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {selectedImageFile
                    ? `Selected: ${selectedImageFile.name}`
                    : "Choose an image from your computer. If you do not choose a new file while editing, the current image will be kept."}
                </p>
                {imagePreviewUrl ? (
                  <div style={{ marginTop: "14px" }}>
                    <img
                      src={imagePreviewUrl}
                      alt="Article preview"
                      style={{
                        width: "100%",
                        maxWidth: "280px",
                        height: "180px",
                        objectFit: "contain",
                        background: "#f8fafc",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(event) =>
                    handleInputChange("content", event.target.value)
                  }
                  placeholder="Write the news content..."
                  rows={10}
                  className="service-manager-textarea"
                />
              </div>
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
                    ? "Update Article"
                    : "Create Article"}
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
              <h3 style={{ margin: 0, color: "#0f172a" }}>Article list</h3>
            </div>
            <div className="account-search-field service-manager-search">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-scroll service-manager-table-scroll">
            <table className="admin-custom-table bordered service-manager-table">
              <thead>
                <tr>
                  <th style={{ width: "46%" }}>ARTICLE</th>
                  <th style={{ width: "20%" }}>AUTHOR</th>
                  <th style={{ width: "14%" }}>UPDATED</th>
                  <th style={{ width: readOnly ? "10%" : "20%" }}>
                    {readOnly ? "MODE" : "ACTION"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "50px 0" }}
                    >
                      Loading articles...
                    </td>
                  </tr>
                ) : filteredArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "50px 0" }}
                    >
                      No articles found.
                    </td>
                  </tr>
                ) : (
                  paginatedArticles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <div className="service-manager-service-cell">
                          {article.image ? (
                            <img
                              src={article.image}
                              alt={article.title}
                              className="service-manager-thumb"
                            />
                          ) : null}
                          <div className="service-manager-service-meta">
                            <div className="service-manager-service-title">
                              {article.title}
                            </div>
                            <div className="service-manager-service-desc">
                              {article.desc || "No summary available."}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{article.author || "Vinhomes Team"}</td>
                      <td>{article.date || "Updating..."}</td>
                      <td>
                        {readOnly ? (
                          <span className="status-badge badge-view">View only</span>
                        ) : (
                          <div className="service-manager-action-group">
                            <button
                              type="button"
                              className="action-btn-styled"
                              title="Edit Article"
                              onClick={() => handleEdit(article)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="action-btn-styled"
                              title="Delete Article"
                              style={{ color: "var(--admin-danger)" }}
                              onClick={() => handleDelete(article.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
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
              {filteredArticles.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              -{Math.min(currentPage * pageSize, filteredArticles.length)} of{" "}
              {filteredArticles.length} articles
            </div>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredArticles.length}
              pageSize={pageSize}
              itemLabel="articles"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsManager;

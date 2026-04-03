import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaChevronRight, FaInbox, FaRegCheckCircle, FaClock } from "react-icons/fa";
import ComplaintDetail from "./ComplaintDetail";
import { useAuth } from "../auth/AuthContext";

export default function ComplaintList({ refreshKey = 0 }) {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { user } = useAuth();

  useEffect(() => {
    setSelected(null);
  }, [user?.id, refreshKey]);

  useEffect(() => {
    if (!user?.id) {
      setComplaints([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.get("http://localhost:8080/api/complaints")
      .then((res) => {
        const ownComplaints = res.data.filter((complaint) => {
          const complaintOwnerId =
            complaint.madeByUser?.id ??
            complaint.user?.id ??
            complaint.userId ??
            complaint.accountId ??
            complaint.createdBy?.id;

          return String(complaintOwnerId) === String(user.id);
        });

        // SORT: Newest first
        const sorted = ownComplaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComplaints(sorted);
      })
      .catch(err => {
        console.error("Failed to fetch complaints:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id, refreshKey]);

  // Handle filter changes - reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, yearFilter]);

  // Derived filtered results
  const filteredComplaints = complaints.filter(c => {
    if (!c.createdAt) return true;
    const date = new Date(c.createdAt);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const matchesMonth = monthFilter === "all" || String(month) === String(monthFilter);
    const matchesYear = yearFilter === "all" || String(year) === String(yearFilter);

    return matchesMonth && matchesYear;
  });

  // Pagination Logic
  const totalItems = filteredComplaints.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  // Generate unique years from data for filter
  const availableYears = [...new Set(complaints.map(c => {
    if (!c.createdAt) return null;
    return new Date(c.createdAt).getFullYear();
  }).filter(y => y !== null))].sort((a, b) => b - a);

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && complaints.length === 0) {
    return (
      <div className="complaint-list" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-list">
      {/* Dynamic Filter Bar */}
      {complaints.length > 0 && (
        <div className="resident-support-filters">
          <div className="support-filter-item">
            <label>Month</label>
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              <option value="all">All Months</option>
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="support-filter-item">
            <label>Year</label>
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="all">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(monthFilter !== "all" || yearFilter !== "all") && (
            <button className="reset-filter-link" onClick={() => { setMonthFilter("all"); setYearFilter("all"); }}>
              Reset Filters
            </button>
          )}
        </div>
      )}

      {paginatedComplaints.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="billing-empty-info"
          style={{ padding: '60px', background: 'white', border: '1px solid #f1f5f9' }}
        >
          <FaInbox style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
          <h4 style={{ color: '#1e293b', fontWeight: '700' }}>No Requests Found</h4>
          <p style={{ color: '#64748b' }}>
            {complaints.length > 0 ? "Try adjusting your filters to see more results." : "You haven't submitted any support requests yet."}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="resident-complaints-wrapper">
            <AnimatePresence>
              {paginatedComplaints.map((c, index) => {
                const matchesSelected = selected && selected.id === c.id;
                const isReplied = c.replies && c.replies.length > 0;
                
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div 
                      className={`resident-complaint-card ${matchesSelected ? 'active-selection' : ''}`}
                      onClick={() => setSelected(matchesSelected ? null : c)}
                      style={{ 
                        borderLeft: matchesSelected ? '6px solid var(--primary-color)' : '1px solid #f1f5f9',
                        background: matchesSelected ? '#fffdf9' : 'white'
                      }}
                    >
                      <div className="resident-complaint-info">
                        <div className="resident-complaint-preview">
                          {c.content}
                        </div>
                        <div className="resident-complaint-meta">
                          <span className="resident-complaint-date">
                            <FaCalendarAlt style={{ fontSize: '12px' }} /> {formatDate(c.createdAt)}
                          </span>
                          <span className={`resident-status-pill ${isReplied ? 'resident-status-replied' : 'resident-status-unread'}`}>
                            {isReplied ? (
                              <><FaRegCheckCircle /> Replied</>
                            ) : (
                              <><FaClock /> Opened</>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="complaint-action-icon">
                        <FaChevronRight style={{ 
                          color: matchesSelected ? 'var(--primary-color)' : '#cbd5e1',
                          transform: matchesSelected ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.3s ease'
                        }} />
                      </div>
                    </div>
                    
                    {/* Expanded Detail View */}
                    <AnimatePresence>
                      {matchesSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ComplaintDetail complaint={c} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="support-pagination">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft /> Previous
              </button>
              
              <span className="pagination-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>

              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

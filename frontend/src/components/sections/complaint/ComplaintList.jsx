import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaExclamationCircle, FaCheckCircle, FaClock, FaChevronRight, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ComplaintDetail from "./ComplaintDetail";
import { useAuth } from "../auth/AuthContext";
import { formatDate, formatDateTime } from "../../../utils/billingUtils";

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

export default function ComplaintList({ refreshKey = 0 }) {
  const [complaints, setComplaints] = useState([]);
  const [replies, setReplies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    setSelectedId(null);
  }, [user?.id, refreshKey]);

  useEffect(() => {
    if (!user?.id) {
      setComplaints([]);
      setReplies([]);
      return;
    }

    // Fetch both complaints and replies to determine "Replied" status
    Promise.all([
      axios.get("http://localhost:8080/api/complaints"),
      axios.get("http://localhost:8080/api/replies")
    ]).then(([complaintsRes, repliesRes]) => {
      const ownComplaints = complaintsRes.data.filter((complaint) => {
        const complaintOwnerId =
          complaint.madeByUser?.id ??
          complaint.user?.id ??
          complaint.userId ??
          complaint.accountId ??
          complaint.createdBy?.id;

        return String(complaintOwnerId) === String(user.id);
      }).sort((a, b) => (b.id || 0) - (a.id || 0));

      setComplaints(ownComplaints);
      setReplies(repliesRes.data || []);
    }).catch(err => {
      console.error("Failed to fetch complaint data:", err);
      // Fallback or empty state already handled
    });
  }, [user?.id, refreshKey]);

  const monthOptions = useMemo(() => {
    const options = new Map();
    complaints.forEach((c) => {
      if (!c.createdAt) return;
      const date = new Date(c.createdAt);
      const label = MONTH_FORMATTER.format(date);
      if (!options.has(label)) {
        options.set(label, { value: label, label, sortAt: date.getTime() });
      }
    });
    return Array.from(options.values()).sort((a, b) => b.sortAt - a.sortAt);
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesMonth = monthFilter === "all" || (c.createdAt && MONTH_FORMATTER.format(new Date(c.createdAt)) === monthFilter);
      
      if (statusFilter === "all") return matchesMonth;
      
      const hasResponse = replies.some(r => r.complaint?.id === c.id);
      
      if (statusFilter === "pending") return matchesMonth && !hasResponse;
      if (statusFilter === "closed") return matchesMonth && hasResponse;
      
      return matchesMonth;
    });
  }, [complaints, replies, monthFilter, statusFilter]);

  const getStatusInfo = (complaintId) => {
    // A complaint is "Replied" if it has at least one reply in the replies list
    const hasResponse = replies.some(r => r.complaint?.id === complaintId);
    
    if (hasResponse) return { label: "Replied", class: "closed", icon: <FaCheckCircle /> };
    return { label: "Pending", class: "pending", icon: <FaClock /> };
  };

  return (
    <div className="complaint-list-container">
      <div className="list-filter-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f1f5f9' 
      }}>
        <h3 className="refined-section-title" style={{ margin: 0, flex: 1, paddingRight: '32px' }}>
          YOUR REQUESTS
        </h3>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              <FaFilter style={{ marginRight: '6px' }} /> Period
            </span>
            <select
              className="premium-select"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: '#f8fafc',
                color: '#334155',
                cursor: 'pointer',
                minWidth: '130px'
              }}
            >
              <option value="all">All Months</option>
              {monthOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              Status
            </span>
            <select
              className="premium-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: '#f8fafc',
                color: '#334155',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="closed">Replied</option>
            </select>
          </div>
        </div>
      </div>

      <div className="complaint-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredComplaints.length === 0 ? (
          <div className="billing-empty">
            {monthFilter === "all" && statusFilter === "all" 
              ? "No requests found." 
              : "No requests found matching the current filters."}
          </div>
        ) : (
          filteredComplaints.map((c) => {
            const statusInfo = getStatusInfo(c.id);
            const isSelected = selectedId === c.id;
            const dateStr = c.createdAt ? formatDateTime(c.createdAt) : "Recently";

            return (
              <div key={c.id} className="complaint-accordion-item">
                <motion.div
                  className={`complaint-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedId(isSelected ? null : c.id)}
                  whileHover={{ x: isSelected ? 0 : 4 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: isSelected ? '0' : '8px' }}
                >
                  <div className="complaint-icon-box">
                    {statusInfo.icon}
                  </div>
                  <div className="complaint-card-content">
                    <div className="complaint-text">{c.content}</div>
                    <div className="complaint-meta">
                      <span className={`complaint-status ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                      <span className="complaint-time">{dateStr}</span>
                      <span className="complaint-id">#{c.id}</span>
                    </div>
                  </div>
                  <div className={`complaint-arrow ${isSelected ? 'rotate' : ''}`}>
                    <FaChevronRight />
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: -1 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="conversation-nested-wrapper"
                      style={{ overflow: 'hidden' }}
                    >
                      <ComplaintDetail complaint={c} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

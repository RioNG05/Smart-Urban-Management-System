import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaHeadset, FaClock } from "react-icons/fa";

export default function ComplaintDetail({ complaint }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!complaint?.id) return;
    
    setLoading(true);
    // Returning to original endpoint and client-side filtering as requested
    axios.get("http://localhost:8080/api/replies")
      .then((res) => {
        const filtered = res.data.filter((r) => r.complaint && r.complaint.id === complaint.id);
        setReplies(filtered);
      })
      .catch(err => {
        console.error("Failed to fetch replies:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [complaint?.id]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="resident-conversation-container">
      <div className="resident-section-title" style={{ marginTop: 0, marginBottom: '24px' }}>
        History & Response
      </div>

      <div className="resident-conversation-thread">
        {/* Original Message from User */}
        <div className="resident-message-bubble resident-user-msg shadow-sm">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.8 }}>
            <FaUser style={{ fontSize: '10px' }} /> <strong>You</strong>
          </div>
          {complaint.content}
          <span className="resident-message-time">
            <FaClock style={{ fontSize: '9px' }} /> {formatTime(complaint.createdAt)}
          </span>
        </div>

        {/* Loading indicator for replies */}
        {loading && (
          <div className="text-center p-3">
            <div className="spinner-border spinner-border-sm text-muted" role="status"></div>
          </div>
        )}

        {/* Staff Replies */}
        {replies.length === 0 && !loading && (
          <div style={{ alignSelf: 'center', margin: '20px 0', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
            Waiting for staff response...
          </div>
        )}

        {replies.map((r) => (
          <div key={r.id} className="resident-message-bubble resident-staff-msg shadow-sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-color)' }}>
              <FaHeadset style={{ fontSize: '10px' }} /> <strong>Staff Response</strong>
            </div>
            {r.content}
            <span className="resident-message-time">
               <FaClock style={{ fontSize: '9px' }} /> {formatTime(r.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

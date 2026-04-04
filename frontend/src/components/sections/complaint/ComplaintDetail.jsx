import { useEffect, useState } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import { formatDate, formatDateTime } from "../../../utils/billingUtils";

export default function ComplaintDetail({ complaint }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/replies").then((res) => {
      const filtered = res.data.filter((r) => r.complaint?.id === complaint.id);
      setReplies(filtered);
    });
  }, [complaint]);

  return (
    <div className="conversation-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Resident (User) message - TOP of conversation, RIGHT side */}
        <div className="message-bubble user">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800' }}>MY REQUEST</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{complaint.createdAt ? formatDateTime(complaint.createdAt) : ""}</div>
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{complaint.content}</div>
        </div>

        {/* Support Team (Admin) messages - BELOW request, LEFT side */}
        {replies.map((r) => (
          <div key={r.id} className="message-bubble admin">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '800' }}>SUPPORT TEAM</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{r.createdAt ? formatDateTime(r.createdAt) : ""}</div>
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{r.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

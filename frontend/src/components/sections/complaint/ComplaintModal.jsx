import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";

export default function ComplaintModal({ open, setOpen, onSuccess }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  const submitComplaint = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.warning("Please enter your complaint description");
      return;
    }

    if (!userId) {
      toast.error("User information not found");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/complaints", {
        content: trimmedContent,
        userId,
      });

      setContent("");
      setOpen(false);
      toast.success("Complaint submitted successfully");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="resident-modal-overlay" onClick={() => setOpen(false)}>
      <div className="resident-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="resident-modal-header">
          <h3>Report Issue</h3>
          <button className="resident-modal-close" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="resident-textarea-wrapper">
          <textarea
            className="resident-textarea"
            placeholder="Please describe the issue in detail (e.g., location, time, nature of problem)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="resident-modal-footer">
          <button 
            className="resident-modal-cancel" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>

          <button 
            className="resident-report-btn" 
            onClick={submitComplaint}
            disabled={loading}
            style={{ padding: '12px 32px' }}
          >
            {loading ? (
              "Sending..."
            ) : (
              <><FaPaperPlane style={{ fontSize: '14px' }} /> Send Report</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import { createNotification } from "../../../services/notificationService";

export default function ComplaintModal({ open, setOpen, onSuccess }) {
  const [content, setContent] = useState("");
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

    try {
      await axios.post("http://localhost:8080/api/complaints", {
        content: trimmedContent,
        userId,
      });

      try {
        const requesterLabel =
          user?.fullName || user?.username || user?.email || `account #${userId}`;

        await createNotification({
          targetRole: "MANAGER",
          title: "New complaint submitted",
          message: `${requesterLabel} submitted a new complaint. Open Complaints to review and respond.`,
          type: "COMPLAINT_REVIEW_REQUIRED",
          relatedUrl: "/admin/complaints",
        });
      } catch (notificationError) {
        console.error("Failed to create admin complaint notification", notificationError);
      }

      setContent("");
      setOpen(false);
      toast.success("Complaint submitted successfully");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit complaint");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="premium-modal-overlay">
          <motion.div 
            className="premium-modal-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="modal-header">
              <h3>Report New Issue</h3>
              <button className="close-modal-btn" onClick={() => setOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ marginBottom: '15px', fontSize: '14px', color: '#64748b' }}>
                Please describe the issue you are experiencing. Our support team will review it as soon as possible.
              </p>
              <textarea
                className="modal-textarea"
                placeholder="Ex: The hallway light on the 4th floor is flickering..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="submit-button" onClick={submitComplaint}>
                Submit Request
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

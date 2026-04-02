import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

export default function ComplaintModal({ open, setOpen, onSuccess, apartmentId }) {
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
        apartmentId: Number(apartmentId)
      });

      setContent("");
      setOpen(false);
      toast.success("Complaint submitted successfully");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit complaint");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Report Issue</h3>

        <textarea
          placeholder="Describe the issue..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={() => setOpen(false)}>
            Cancel
          </button>

          <button className="submit-btn" onClick={submitComplaint}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

export default function ComplaintModal({ open, setOpen }) {
  const [content, setContent] = useState("");

  const userId = 7; // sau này lấy từ auth context

  const submitComplaint = async () => {
    try {
      await axios.post("http://localhost:8080/api/complaints", {
        content,
        userId,
      });

      alert("Complaint sent");

      setContent("");
      setOpen(false);
    } catch (err) {
      console.error(err);

      alert("Failed to send complaint");
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

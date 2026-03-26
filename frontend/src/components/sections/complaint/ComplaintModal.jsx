import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

export default function ComplaintModal({ open, setOpen }) {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const userId = user?.id;

  const submitComplaint = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.warning("Vui long nhap noi dung complaint");
      return;
    }

    if (!userId) {
      toast.error("Khong tim thay thong tin nguoi dung");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/complaints", {
        content: trimmedContent,
        userId,
      });

      setContent("");
      setOpen(false);
      sessionStorage.setItem("billingComplaintToast", "success");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Gui complaint that bai");
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

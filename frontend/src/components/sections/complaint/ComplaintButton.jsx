import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import ComplaintModal from "./ComplaintModal";

export default function ComplaintButton({ onSuccess }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="resident-report-btn" onClick={() => setOpen(true)}>
        <FaExclamationCircle /> Report Issue
      </button>

      <ComplaintModal open={open} setOpen={setOpen} onSuccess={onSuccess} />
    </>
  );
}

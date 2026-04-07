import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import ComplaintModal from "./ComplaintModal";

export default function ComplaintButton({ onSuccess }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        className="pay-selected-btn premium-btn" 
        style={{ 
          backgroundColor: '#c98b3c',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }} 
        onClick={() => setOpen(true)}
      >
        <FaExclamationCircle />
        <span>Report Issue</span>
      </button>

      <ComplaintModal open={open} setOpen={setOpen} onSuccess={onSuccess} />
    </>
  );
}

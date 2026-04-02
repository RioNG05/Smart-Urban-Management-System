import { useState } from "react";
import ComplaintModal from "./ComplaintModal";

export default function ComplaintButton({ onSuccess }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="report-button" onClick={() => setOpen(true)}>
        Report Issue
      </button>

      <ComplaintModal open={open} setOpen={setOpen} onSuccess={onSuccess} />
    </>
  );
}

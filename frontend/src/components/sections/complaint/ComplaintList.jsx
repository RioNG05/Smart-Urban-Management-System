import { useEffect, useState } from "react";
import axios from "axios";
import ComplaintDetail from "./ComplaintDetail";
import { useAuth } from "../auth/AuthContext";

export default function ComplaintList({ refreshKey = 0, apartmentId }) {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setSelected(null);
  }, [user?.id, refreshKey]);

  useEffect(() => {
    if (!user?.id) {
      setComplaints([]);
      return;
    }

    axios.get("http://localhost:8080/api/complaints").then((res) => {
      const ownComplaints = res.data.filter((complaint) => {
        const complaintOwnerId =
          complaint.madeByUser?.id ??
          complaint.user?.id ??
          complaint.userId ??
          complaint.accountId ??
          complaint.createdBy?.id;

        const isOwner = String(complaintOwnerId) === String(user.id);
        const matchesApartment = !apartmentId || String(complaint.apartmentId) === String(apartmentId);
        
        return isOwner && matchesApartment;
      });

      setComplaints(ownComplaints);
    });
  }, [user?.id, refreshKey]);

  return (
    <div className="complaint-list">
      {complaints.length === 0 && (
        <div className="alert alert-info border-0 rounded-3 shadow-sm">
          Bạn chưa gửi complaint nào.
        </div>
      )}

      <div className="list-group shadow-sm rounded-3">
        {complaints.map((c) => (
          <button
            key={c.id}
            type="button"
            className="list-group-item list-group-item-action p-3"
            onClick={() => setSelected(c)}
          >
            {c.content}
          </button>
        ))}
      </div>

      {selected && <ComplaintDetail complaint={selected} />}
    </div>
  );
}

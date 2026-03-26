import { useEffect, useState } from "react";
import axios from "axios";
import ComplaintDetail from "./ComplaintDetail";
import { useAuth } from "../auth/AuthContext";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setSelected(null);
  }, [user?.id]);

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

        return String(complaintOwnerId) === String(user.id);
      });

      setComplaints(ownComplaints);
    });
  }, [user?.id]);

  return (
    <div className="complaint-list">
      <h3 className="section-title">My Complaints</h3>

      {complaints.length === 0 && (
        <div className="complaint-item">Ban chua gui complaint nao.</div>
      )}

      {complaints.map((c) => (
        <div
          key={c.id}
          className="complaint-item"
          onClick={() => setSelected(c)}
        >
          {c.content}
        </div>
      ))}

      {selected && <ComplaintDetail complaint={selected} />}
    </div>
  );
}

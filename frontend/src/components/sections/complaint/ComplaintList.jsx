import { useEffect, useState } from "react";
import axios from "axios";
import ComplaintDetail from "./ComplaintDetail";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/complaints").then((res) => {
      setComplaints(res.data);
    });
  }, []);

  return (
    <div className="complaint-list">
      <h3 className="section-title">My Complaints</h3>

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

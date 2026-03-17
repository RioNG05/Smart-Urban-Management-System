import { useEffect, useState } from "react";
import axios from "axios";

export default function ComplaintDetail({ complaint }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/replies").then((res) => {
      const filtered = res.data.filter((r) => r.complaint.id === complaint.id);

      setReplies(filtered);
    });
  }, [complaint]);

  return (
    <div className="complaint-detail">
      <h4>Conversation</h4>

      <div className="complaint-message user">{complaint.content}</div>

      {replies.map((r) => (
        <div key={r.id} className="complaint-message admin">
          {r.content}
        </div>
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";

export default function NewsSidebar({ items = [] }) {
  return (
    <aside className="news-detail-sidebar">
      <h3>Related Articles</h3>

      {items.length === 0 ? (
        <p className="text-muted mb-0">No related articles yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/news/${item.id}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

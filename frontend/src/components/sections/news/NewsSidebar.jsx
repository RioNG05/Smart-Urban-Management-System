import { Link } from "react-router-dom";

const related = [
  { id: 2, title: "Top Livable Urban Areas in Hanoi" },
  { id: 3, title: "Is Real Estate Investment Worth It in 2026?" },
  { id: 4, title: "Areas with the Fastest Property Price Growth" },
];

export default function NewsSidebar() {
  return (
    <aside className="news-detail-sidebar">
      <h3>Related Articles</h3>

      <ul>
        {related.map((item) => (
          <li key={item.id}>
            <Link to={`/news/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

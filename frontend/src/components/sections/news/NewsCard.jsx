import { Link } from "react-router-dom";

export default function NewsCard({ news }) {
  return (
    <Link to={`/news/${news.id}`} className="news-card">
      <div className="news-card-image">
        <img src={news.image} alt={news.title} />
      </div>

      <div className="news-card-content">
        <h3 className="news-title">{news.title}</h3>

        <p>{news.desc}</p>

        <span className="news-date">{news.date}</span>
      </div>
    </Link>
  );
}

import { Link } from "react-router-dom";

export default function NewsSection({ newsItems = [] }) {
  return (
    <section className="section home-news-section">
      <div className="home-section-heading">
        <span className="home-section-kicker">Newest Updates</span>
        <h2>Latest news from the community</h2>
        <p>Stay updated with the newest announcements, activities, and development highlights.</p>
      </div>

      <div className="home-news-grid">
        {newsItems.map((news) => (
          <Link key={news.id} to={`/news/${news.id}`} className="home-news-card">
            <div className="home-news-card__image">
              <img src={news.image} alt={news.title} />
            </div>

            <div className="home-news-card__content">
              <span className="home-news-card__date">{news.date}</span>
              <h3>{news.title}</h3>
              <p>{news.desc}</p>
              <span className="home-section-link">Read article</span>
            </div>
          </Link>
        ))}
      </div>

      {!newsItems.length ? (
        <div className="home-empty-state">No news articles are available yet.</div>
      ) : null}
    </section>
  );
}

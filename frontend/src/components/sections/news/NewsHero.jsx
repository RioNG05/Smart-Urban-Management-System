const NEWS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80";

export default function NewsHero() {
  return (
    <section
      className="news-hero"
      style={{ backgroundImage: `url("${NEWS_HERO_IMAGE}")` }}
    >
      <div className="news-hero-content">
        <h1>Real Estate News</h1>
        <p>
          Stay updated with market trends, investment insights, and the latest
          property project information
        </p>
      </div>
    </section>
  );
}

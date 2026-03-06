const categories = [
  "Market",
  "Projects",
  "Buying & Selling Guide",
  "Feng Shui",
  "Finance",
];

export default function NewsCategories() {
  return (
    <section className="news-categories">
      {categories.map((c, i) => (
        <button key={i} className="news-category">
          {c}
        </button>
      ))}
    </section>
  );
}

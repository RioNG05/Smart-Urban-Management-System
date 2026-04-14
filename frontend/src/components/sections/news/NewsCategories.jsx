const categories = [
  "Security",
  "Gym",
  "Buying",
  "Selling",
  "Feng Shui",
  "Finance",
];

export default function NewsCategories({ activeTag, onTagSelect }) {
  const handleClick = (tag) => {
    onTagSelect(activeTag === tag ? "" : tag);
  };

  return (
    <section className="news-categories">
      <button
        type="button"
        className={`news-category ${activeTag === "" ? "active" : ""}`}
        onClick={() => onTagSelect("")}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`news-category ${activeTag === category ? "active" : ""}`}
          onClick={() => handleClick(category)}
        >
          #{category}
        </button>
      ))}
    </section>
  );
}

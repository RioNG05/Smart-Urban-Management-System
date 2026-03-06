import NewsCard from "./NewsCard";
import NewsSidebar from "./NewsSidebar";

const newsData = [
  {
    id: 1,
    title: "Hanoi Apartment Prices Surge",
    desc: "The real estate market is experiencing significant growth...",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    date: "10/03/2026",
  },
  {
    id: 2,
    title: "Most Livable Urban Areas in Hanoi",
    desc: "A list of the most livable urban areas in Hanoi...",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    date: "08/03/2026",
  },
  {
    id: 3,
    title: "Is Real Estate Investment Worth It in 2026?",
    desc: "Experts share their insights on the 2026 property market...",
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
    date: "06/03/2026",
  },
];

export default function NewsList() {
  return (
    <section className="news-container">
      <div className="news-main">
        {newsData.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      <NewsSidebar />
    </section>
  );
}

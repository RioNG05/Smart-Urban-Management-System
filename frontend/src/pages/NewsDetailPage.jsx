import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import NewsContent from "../components/sections/news/NewsContent";
import NewsSidebar from "../components/sections/news/NewsSidebar";

import "../styles/news-detail.css";

export default function NewsDetailPage() {
  const { id } = useParams();

  const article = {
    id,
    title: "Hanoi Apartment Prices Surge in 2026",
    author: "Admin",
    date: "12/03/2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    content: `
      The real estate market in Hanoi is experiencing significant growth
      in the apartment segment. According to experts, housing demand in
      the eastern area of the city has increased rapidly in recent months.
      
      Projects in Gia Lam and Dong Anh are becoming investment hotspots
      thanks to the rapid development of transportation infrastructure.
    `,
  };

  return (
    <>
      <Navbar />

      <div className="news-detail-container">
        <div className="news-detail-main">
          <NewsContent article={article} />
        </div>

        <NewsSidebar />
      </div>

      <Footer />
    </>
  );
}

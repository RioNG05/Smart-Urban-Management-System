import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import NewsSidebar from "./NewsSidebar";

// Xóa khi dùng API thật, tạm thời dùng làm dữ liệu mẫu
const fallbackNewsData = [
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
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // [BACKEND API INTEGRATION POINT]
    // Đây là nơi sẽ gọi API để lấy danh sách tin tức từ Database
    // Ví dụ: GET /api/news

    const fetchNews = async () => {
      try {
        setIsLoading(true);
        // Bỏ khi có API:
        /*
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNewsList(data);
        */

        // Giả lập lấy dữ liệu mẫu (Xóa phần này khi dùng API thật)
        setNewsList(fallbackNewsData);
        setIsLoading(false);

      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Could not load news at this time.");
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="news-container">
      <div className="news-main">
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading news...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!isLoading && !error && newsList.length === 0 && (
          <div className="alert alert-info" role="alert">
            No news available at the moment.
          </div>
        )}

        {!isLoading && !error && newsList.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      <NewsSidebar />
    </section>
  );
}

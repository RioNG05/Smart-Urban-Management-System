import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import NewsContent from "../components/sections/news/NewsContent";
import NewsSidebar from "../components/sections/news/NewsSidebar";

import "../styles/news-detail.css";

// Dữ liệu mẫu (sẽ xóa khi có DB thật)
const dummyArticles = {
  "1": {
    id: "1",
    title: "Hanoi Apartment Prices Surge in 2026",
    author: "Admin",
    date: "10/03/2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    content: "The real estate market in Hanoi is experiencing significant growth in the apartment segment. According to experts, housing demand in the eastern area of the city has increased rapidly in recent months. Projects in Gia Lam and Dong Anh are becoming investment hotspots.",
  },
  "2": {
    id: "2",
    title: "Most Livable Urban Areas in Hanoi",
    author: "Editor",
    date: "08/03/2026",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    content: "When it comes to livability, certain districts in Hanoi stand out due to their green spaces, modern amenities, and community facilities. Areas like Tay Ho and Ecopark remain top choices for families looking for a balanced lifestyle.",
  },
  "3": {
    id: "3",
    title: "Is Real Estate Investment Worth It in 2026?",
    author: "Finance Expert",
    date: "06/03/2026",
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
    content: "With shifting economic policies, many investors are wondering if 2026 is the right time to buy property. Analysts suggest that while quick flips might be riskier, long-term investments in developing suburban areas still offer solid returns.",
  }
};

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // [BACKEND API INTEGRATION POINT] 
    // Gọi API lấy chi tiết bài viết: GET /api/news/${id}

    const fetchArticleDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Bỏ khi có API:
        /*
        const response = await fetch(\`/api/news/\${id}\`);
        if (!response.ok) {
          if (response.status === 404) throw new Error("Article not found");
          throw new Error("Failed to fetch article details");
        }
        const data = await response.json();
        setArticle(data);
        */

        // Giả lập lấy dữ liệu mẫu (Xóa khi có API)
        const foundArticle = dummyArticles[id];
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError("Article not found.");
        }
        setIsLoading(false);

      } catch (err) {
        console.error("Error fetching article details:", err);
        setError(err.message || "Could not load article details.");
        setIsLoading(false);
      }
    };

    fetchArticleDetail();
  }, [id]);

  return (
    <>
      <Navbar />

      <div className="news-detail-container" style={{ minHeight: '80vh' }}>
        <div className="news-detail-main">
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading article details...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center my-5 py-4" role="alert">
              <h4 className="alert-heading">Oops!</h4>
              <p>{error}</p>
              <button className="btn btn-outline-danger mt-3" onClick={() => navigate('/news')}>
                Back to News List
              </button>
            </div>
          )}

          {!isLoading && !error && article && (
            <NewsContent article={article} />
          )}
        </div>

        <NewsSidebar />
      </div>

      <Footer />
    </>
  );
}

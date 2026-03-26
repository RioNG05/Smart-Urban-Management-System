import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import NewsContent from "../components/sections/news/NewsContent";
import NewsSidebar from "../components/sections/news/NewsSidebar";
import { getNewsById, getNewsList } from "../services/newsService";
import "../styles/news-detail.css";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [articleData, newsList] = await Promise.all([
          getNewsById(id),
          getNewsList(),
        ]);

        setArticle(articleData);
        setRelatedArticles(
          newsList.filter((item) => String(item.id) !== String(id)).slice(0, 5)
        );
      } catch (err) {
        console.error("Error fetching article details:", err);

        if (err?.response?.status === 404) {
          setError("Article not found.");
        } else {
          setError("Could not load article details.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleDetail();
  }, [id]);

  return (
    <>
      <Navbar solid={true} />

      <div className="news-detail-container" style={{ minHeight: "80vh" }}>
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
              <button
                className="btn btn-outline-danger mt-3"
                onClick={() => navigate("/news")}
              >
                Back to News List
              </button>
            </div>
          )}

          {!isLoading && !error && article && <NewsContent article={article} />}
        </div>

        <NewsSidebar items={relatedArticles} />
      </div>

      <Footer />
    </>
  );
}

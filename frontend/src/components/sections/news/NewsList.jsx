import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import NewsSidebar from "./NewsSidebar";
import { getNewsList } from "../../../services/newsService";

const normalizeKeyword = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function NewsList({ activeTag = "" }) {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getNewsList();
        setNewsList(data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Could not load news at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const normalizedTag = normalizeKeyword(activeTag);
  const filteredNews = newsList.filter((news) => {
    if (!normalizedTag) return true;

    const searchableText = normalizeKeyword(
      `${news.title} ${news.desc} ${news.content} ${news.author}`
    );

    return searchableText.includes(normalizedTag);
  });

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

        {!isLoading && !error && newsList.length > 0 && filteredNews.length === 0 && (
          <div className="alert alert-warning" role="alert">
            No articles matched the tag <strong>#{activeTag}</strong>.
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredNews.map((news) => <NewsCard key={news.id} news={news} />)}
      </div>

      <NewsSidebar items={newsList.slice(0, 5)} />
    </section>
  );
}

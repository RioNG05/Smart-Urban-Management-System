import React, { useEffect, useMemo, useState } from "react";
import NewsCard from "./NewsCard";
import NewsSidebar from "./NewsSidebar";
import { getNewsList } from "../../../services/newsService";
import Pagination from "../../common/Pagination";

const ITEMS_PER_PAGE = 6;

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
  const [currentPage, setCurrentPage] = useState(1);

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
  const filteredNews = useMemo(
    () =>
      newsList.filter((news) => {
        if (!normalizedTag) return true;

        const searchableText = normalizeKeyword(
          `${news.title} ${news.desc} ${news.content} ${news.author}`
        );

        return searchableText.includes(normalizedTag);
      }),
    [newsList, normalizedTag]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTag]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [safeCurrentPage, currentPage]);

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
          paginatedNews.map((news) => <NewsCard key={news.id} news={news} />)}

        {!isLoading && !error && filteredNews.length > 0 ? (
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        ) : null}
      </div>

      <NewsSidebar items={newsList.slice(0, 5)} />
    </section>
  );
}

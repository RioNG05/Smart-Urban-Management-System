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

export default function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  const normalizedSearch = normalizeKeyword(searchTerm);
  const filteredNews = useMemo(
    () =>
      newsList.filter((news) => {
        if (!normalizedSearch) return true;

        const searchableText = normalizeKeyword(
          `${news.title} ${news.desc} ${news.content} ${news.author}`
        );

        return searchableText.includes(normalizedSearch);
      }),
    [newsList, normalizedSearch]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
        <div className="search-bar mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 shadow-none"
              placeholder="Search news by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
            No articles matched your search for <strong>"{searchTerm}"</strong>.
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

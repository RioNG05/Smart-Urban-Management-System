import api from "./api";

const FALLBACK_NEWS_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

const getPayload = (data) => data?.result ?? data;

const formatDate = (value) => {
  if (!value) return "Updating...";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "Updating...";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
};

const buildExcerpt = (content) => {
  if (!content) return "Read the latest update from Vinhomes news.";

  const normalizedContent = content.replace(/\s+/g, " ").trim();
  if (normalizedContent.length <= 120) return normalizedContent;

  return `${normalizedContent.slice(0, 117).trim()}...`;
};

export const normalizeNewsItem = (item) => ({
  id: item?.id,
  title: item?.title || "Untitled article",
  content: item?.content || "",
  desc: buildExcerpt(item?.content),
  image: item?.imageUrl || FALLBACK_NEWS_IMAGE,
  date: formatDate(item?.lastUpdate),
  lastUpdateRaw: item?.lastUpdate || null,
  author:
    item?.createdByUser?.username ||
    item?.createdByUser?.email ||
    "Vinhomes Team",
});

export const getNewsList = async () => {
  const res = await api.get("/news");
  const payload = getPayload(res.data);

  if (!Array.isArray(payload)) return [];

  return payload.map(normalizeNewsItem);
};

export const getNewsById = async (id) => {
  const res = await api.get(`/news/${id}`);
  return normalizeNewsItem(getPayload(res.data));
};

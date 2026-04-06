import api from "./api";

const getPayload = (data) => data?.result ?? data;
const toArray = (value) => (Array.isArray(value) ? value : []);

const parseDate = (value) => {
  if (!value) return null;

  const normalized = String(value).includes("T")
    ? value
    : String(value).replace(" ", "T");
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const normalizeNotification = (item) => ({
  id: item?.id ?? null,
  title: item?.title || "Notification",
  message: item?.message || "",
  type: item?.type || "GENERAL",
  isRead: Boolean(item?.isRead),
  relatedUrl: item?.relatedUrl || null,
  createdAt: item?.createdAt || null,
  createdDate: parseDate(item?.createdAt),
});

export const getNotificationsByUser = async (userId) => {
  if (!userId) return [];

  const res = await api.get(`/notifications/user/${userId}`);
  return toArray(getPayload(res.data)).map(normalizeNotification);
};

export const getNotificationsByRole = async (role) => {
  if (!role) return [];

  const res = await api.get(`/notifications/role/${role}`);
  return toArray(getPayload(res.data)).map(normalizeNotification);
};

export const createNotification = async (payload = {}) => {
  const res = await api.post("/notifications", {
    receiverId: payload.receiverId ?? null,
    targetRole: payload.targetRole ?? null,
    title: payload.title || "Notification",
    message: payload.message || "",
    type: payload.type || "GENERAL",
    relatedUrl: payload.relatedUrl ?? null,
  });

  const created = getPayload(res.data);
  return created ? normalizeNotification(created) : null;
};

export const getUnreadNotificationCount = async (userId) => {
  if (!userId) return 0;

  const res = await api.get(`/notifications/user/${userId}/unread/count`);
  const payload = getPayload(res.data);
  return Number(payload ?? 0);
};

export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) return null;

  const res = await api.put(`/notifications/${notificationId}/read`);
  const payload = getPayload(res.data);
  return payload ? normalizeNotification(payload) : null;
};

export const markAllNotificationsAsRead = async (userId) => {
  if (!userId) return null;

  const res = await api.put(`/notifications/user/${userId}/read-all`);
  return getPayload(res.data);
};

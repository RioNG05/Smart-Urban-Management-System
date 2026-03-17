import api from "./api";

/* account info */
export const getMyAccount = async () => {
  const res = await api.get("/auth/accounts/me");
  return res.data.result;
};

/* resident profile */
export const getMyProfile = async () => {
  const res = await api.get("/auth/profile/me");
  return res.data.result;
};

/* update account */
export const updateAccount = async (id, data) => {
  const res = await api.put(`/accounts/${id}`, data);
  return res.data;
};

/* update resident */
export const updateResident = async (id, data) => {
  const res = await api.put(`/residents/${id}`, data);
  return res.data;
};

import api from "./api";

export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  const token = res.data.result.token;

  localStorage.setItem("token", token);

  return token;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/accounts/me");

  return res.data.result;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

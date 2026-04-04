import api from "./api";

export const getApartments = async () => {
  const res = await api.get("/apartments", { skipAuth: true });
  return res.data.result;
};

export const getApartmentById = async (id) => {
  const res = await api.get(`/apartments/${id}`, { skipAuth: true });
  return res.data.result;
};

export const getApartmentsByTypeId = async (id) => {
  const res = await api.get(`/apartments/type/${id}`, { skipAuth: true });
  return res.data.result;
};

export const getApartmentTypes = async () => {
  const res = await api.get("/apartments/type", { skipAuth: true });
  return res.data.result;
};

export const getApartmentTypeImages = async () => {
  const res = await api.get("/images/apartment-type", { skipAuth: true });
  return res.data?.result ?? res.data ?? [];
};

export const getApartmentTypeById = async (id) => {
  const res = await api.get(`/apartments/type/${id}`, { skipAuth: true });
  return res.data.result;
};

export const createApartmentType = async (payload) => {
  const res = await api.post("/apartments/type", payload);
  return res.data.result;
};

export const updateApartmentType = async (id, payload) => {
  const res = await api.put(`/apartments/type/${id}`, payload);
  return res.data.result;
};

export const deleteApartmentType = async (id) => {
  const res = await api.delete(`/apartments/type/${id}`);
  return res.data;
};

import api from "./api";

export const getApartments = async () => {
  const res = await api.get("/apartments");
  return res.data.result;
};

export const getApartmentById = async (id) => {
  const res = await api.get(`/apartments/${id}`);
  return res.data.result;
};

export const getApartmentTypes = async () => {
  const res = await api.get("/apartments/type");
  return res.data.result;
};

export const getApartmentTypeById = async (id) => {
  const res = await api.get(`/apartments/type/${id}`);
  return res.data.result;
};

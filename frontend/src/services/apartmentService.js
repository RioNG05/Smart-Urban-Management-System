import api from "./api";

export const getApartments = async () => {
  const res = await api.get("/apartments");
  return res.data.result;
};

export const getApartmentTypes = async () => {
  const res = await api.get("/apartments/type");
  return res.data.result;
};

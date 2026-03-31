import api from "./api";
import { serviceCatalog } from "../data/serviceCatalog";

const getPayload = (data) => data?.result ?? data;

const normalizeKey = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

const catalogById = new Map(serviceCatalog.map((item) => [item.id, item]));
const catalogByTitle = new Map(
  serviceCatalog.map((item) => [normalizeKey(item.title), item])
);
const defaultCatalogItem = serviceCatalog[0] ?? {
  image: null,
  tagline: "Resident-ready service booking.",
  areas: [],
};

const getCatalogMatch = (item) =>
  catalogByTitle.get(normalizeKey(item?.serviceName)) ??
  catalogByTitle.get(normalizeKey(item?.title)) ??
  catalogById.get(item?.id) ??
  defaultCatalogItem;

const formatFee = (feePerUnit, unitType) => {
  if (feePerUnit === null || feePerUnit === undefined || feePerUnit === "") {
    return null;
  }

  const numericFee = Number(feePerUnit);
  const formattedFee = Number.isNaN(numericFee)
    ? String(feePerUnit)
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(numericFee);

  return unitType ? `${formattedFee} per ${unitType}` : formattedFee;
};

export const normalizeServiceItem = (item) => {
  const formattedFee = formatFee(item?.feePerUnit, item?.unitType);
  const catalogItem = getCatalogMatch(item);

  return {
    id: item?.id,
    title: item?.serviceName || "Unnamed service",
    desc:
      formattedFee
        ? `Current service fee: ${formattedFee}. Contact the management team for booking details and availability.`
        : "Contact the management team for booking details and availability.",
    image: item?.imageUrl || catalogItem?.image || null,
    tagline: catalogItem?.tagline || "Resident-ready service booking.",
    areas: Array.isArray(catalogItem?.areas) ? catalogItem.areas : [],
    serviceCode: item?.serviceCode || null,
    feePerUnit: item?.feePerUnit ?? null,
    unitType: item?.unitType || null,
  };
};

export const getServices = async () => {
  const res = await api.get("/services");
  const payload = getPayload(res.data);

  if (!Array.isArray(payload)) return [];

  return payload.map(normalizeServiceItem);
};

export const normalizeServiceResource = (item) => ({
  id: item?.id ?? null,
  resourceCode: item?.resourceCode || "",
  location: item?.location || "",
  isAvailable: item?.isAvailable ?? false,
  serviceId: item?.service?.id ?? item?.serviceId ?? null,
  serviceName: item?.service?.serviceName || item?.serviceName || "",
});

export const getServiceResources = async () => {
  const res = await api.get("/service-resource");
  const payload = getPayload(res.data);

  if (!Array.isArray(payload)) return [];

  return payload.map(normalizeServiceResource);
};

export const createBooking = async (payload) => {
  const res = await api.post("/bookings", payload);
  return getPayload(res.data);
};

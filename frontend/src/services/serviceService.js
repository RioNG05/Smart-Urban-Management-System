import api from "./api";
import { serviceCatalog } from "../data/serviceCatalog";

const getPayload = (data) => data?.result ?? data;
const BOOKING_VISIBILITY_STORAGE_KEY = "serviceBookingVisibility";
const RESOURCE_IMAGE_STORAGE_KEY = "serviceResourceImages";
const toArray = (value) => (Array.isArray(value) ? value : []);

const requestWithAuthFallback = async (
  config,
  { retryOnBadRequest = true } = {},
) => {
  try {
    return await api({
      ...config,
      skipAuth: false,
    });
  } catch (error) {
    const status = error?.response?.status;
    const shouldRetry =
      status === 401 || status === 403 || (retryOnBadRequest && status === 400);

    if (!shouldRetry) {
      throw error;
    }

    return api({
      ...config,
      skipAuth: true,
      headers: {
        ...(config.headers ?? {}),
        Authorization: undefined,
      },
    });
  }
};

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

const resolveImageUrl = (...values) =>
  values.find(
    (value) => typeof value === "string" && value.trim().length > 0
  ) || null;

const firstImageFromSource = (value) => {
  if (Array.isArray(value)) {
    return value.find(
      (item) => typeof item === "string" && item.trim().length > 0
    ) || null;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .find(Boolean) || null;
  }

  return null;
};

const collectImageUrls = (...sources) => {
  const urls = sources.flatMap((source) => {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (typeof source === "string") return source.split(",");
    return [];
  });

  return [...new Set(
    urls
      .map((value) => String(value ?? "").trim())
      .filter(Boolean)
  )];
};

export const normalizeServiceItem = (item) => {
  const formattedFee = formatFee(item?.feePerUnit, item?.unitType);
  const catalogItem = getCatalogMatch(item);

  return {
    id: item?.id,
    title: item?.serviceName || "Unnamed service",
    serviceName: item?.serviceName || "Unnamed service",
    desc:
      formattedFee
        ? `Current service fee: ${formattedFee}. Contact the management team for booking details and availability.`
        : "Contact the management team for booking details and availability.",
    description: item?.description || null,
    imageUrl: item?.imageUrl || item?.image || item?.thumbnailUrl || null,
    image: resolveImageUrl(
      item?.imageUrl,
      item?.image,
      item?.thumbnailUrl,
      catalogItem?.image
    ),
    tagline: catalogItem?.tagline || "Resident-ready service booking.",
    areas: Array.isArray(catalogItem?.areas) ? catalogItem.areas : [],
    imageUrls: collectImageUrls(
      item?.imageUrls,
      item?.images,
      item?.gallery,
      item?.galleryImages,
      item?.imageUrl,
      item?.image,
      item?.thumbnailUrl
    ),
    serviceCode: item?.serviceCode || null,
    feePerUnit: item?.feePerUnit ?? null,
    unitType: item?.unitType || null,
    isBookable: item?.isBookable === true || item?.bookable === true,
  };
};

export const getServices = async () => {
  const res = await api.get("/services");
  const payload = getPayload(res.data);

  if (!Array.isArray(payload)) return [];

  return payload.map(normalizeServiceItem);
};

const parseBookingVisibilityMap = () => {
  if (typeof window === "undefined") return {};

  try {
    const rawValue = window.localStorage.getItem(BOOKING_VISIBILITY_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeBookingVisibilityMap = (value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    BOOKING_VISIBILITY_STORAGE_KEY,
    JSON.stringify(value),
  );
};

export const getBookingVisibilityMap = () => parseBookingVisibilityMap();

export const isServiceVisibleOnBooking = (serviceId) => {
  const visibilityMap = parseBookingVisibilityMap();
  return visibilityMap[String(serviceId)] !== false;
};

export const setServiceBookingVisibility = (serviceId, isVisible) => {
  const visibilityMap = parseBookingVisibilityMap();
  visibilityMap[String(serviceId)] = Boolean(isVisible);
  writeBookingVisibilityMap(visibilityMap);
  return visibilityMap;
};

const parseResourceImageMap = () => {
  if (typeof window === "undefined") return {};

  try {
    const rawValue = window.localStorage.getItem(RESOURCE_IMAGE_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeResourceImageMap = (value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    RESOURCE_IMAGE_STORAGE_KEY,
    JSON.stringify(value),
  );
};

export const getServiceResourceImageMap = () => parseResourceImageMap();

export const setServiceResourceImage = (resourceId, imageUrl) => {
  const imageMap = parseResourceImageMap();
  imageMap[String(resourceId)] = String(imageUrl ?? "").trim();
  writeResourceImageMap(imageMap);
  return imageMap;
};

export const removeServiceResourceImage = (resourceId) => {
  const imageMap = parseResourceImageMap();
  delete imageMap[String(resourceId)];
  writeResourceImageMap(imageMap);
  return imageMap;
};

export const removeServiceBookingVisibility = (serviceId) => {
  const visibilityMap = parseBookingVisibilityMap();
  delete visibilityMap[String(serviceId)];
  writeBookingVisibilityMap(visibilityMap);
  return visibilityMap;
};

export const getBookingVisibleServices = async () => {
  const services = await getServices();
  return services.filter((service) => isServiceVisibleOnBooking(service.id));
};

const buildServicePayload = (payload = {}) => ({
  serviceName: String(payload.serviceName ?? "").trim(),
  serviceCode: String(payload.serviceCode ?? "").trim(),
  feePerUnit: payload.feePerUnit === "" || payload.feePerUnit == null
    ? null
    : Number(payload.feePerUnit),
  unitType: String(payload.unitType ?? "").trim(),
  description: String(payload.description ?? "").trim(),
  imageUrl: String(payload.imageUrl ?? "").trim(),
  isBookable: Boolean(payload.isBookable),
});

export const createService = async (payload) => {
  const res = await api.post("/services", buildServicePayload(payload));
  return normalizeServiceItem(getPayload(res.data));
};

export const updateService = async (id, payload) => {
  const res = await api.put(`/services/${id}`, buildServicePayload(payload));
  return normalizeServiceItem(getPayload(res.data));
};

export const deleteService = async (id) => {
  const res = await api.delete(`/services/${id}`);
  return getPayload(res.data);
};

export const uploadServiceImage = async (file, name = "service-image") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const res = await api.post("/image/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    skipAuth: true,
  });

  return getPayload(res.data)?.url || "";
};

export const normalizeServiceResource = (item) => ({
  ...(function () {
    const resourceImageMap = parseResourceImageMap();
    const storedImage = resourceImageMap[String(item?.id)] || null;
    return {
  id: item?.id ?? null,
  resourceCode: item?.resourceCode || "",
  location: item?.location || "",
  isAvailable: item?.isAvailable ?? false,
  serviceId: item?.service?.id ?? item?.serviceId ?? null,
  serviceName: item?.service?.serviceName || item?.serviceName || "",
  imageUrl: resolveImageUrl(
    storedImage,
    firstImageFromSource(item?.imageUrls),
    item?.imageUrl,
    item?.image,
    item?.thumbnailUrl,
    item?.service?.imageUrl,
    item?.service?.image,
    item?.service?.thumbnailUrl
  ),
  imageUrls: collectImageUrls(
    storedImage,
    item?.imageUrls,
    item?.images,
    item?.gallery,
    item?.galleryImages,
    item?.imageUrl,
    item?.image,
    item?.thumbnailUrl,
    item?.service?.imageUrls,
    item?.service?.images,
    item?.service?.gallery,
    item?.service?.galleryImages,
    item?.service?.imageUrl,
    item?.service?.image,
    item?.service?.thumbnailUrl
  ),
    };
  })(),
});

export const getServiceResourceImages = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/images/service-resource",
  });

  return toArray(res.data).map((item) => ({
    id: item?.id ?? null,
    serviceResourceId: item?.serviceResourceId ?? null,
    imageUrl: String(item?.imageUrl ?? "").trim(),
    description: item?.description ?? null,
  })).filter((item) => item.serviceResourceId != null && item.imageUrl);
};

export const getServiceResources = async () => {
  const [resourceRes, imageItems] = await Promise.all([
    requestWithAuthFallback({
      method: "get",
      url: "/service-resource",
    }),
    getServiceResourceImages().catch(() => []),
  ]);

  const imagesByResourceId = imageItems.reduce((map, item) => {
    const key = String(item.serviceResourceId);
    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(item.imageUrl);
    return map;
  }, new Map());

  return toArray(getPayload(resourceRes.data)).map((item) =>
    normalizeServiceResource({
      ...item,
      imageUrls: collectImageUrls(
        imagesByResourceId.get(String(item?.id)) ?? [],
        item?.imageUrls,
        item?.images,
        item?.gallery,
        item?.galleryImages,
        item?.imageUrl,
      ),
      imageUrl: resolveImageUrl(
        item?.imageUrl,
        firstImageFromSource(imagesByResourceId.get(String(item?.id)) ?? []),
      ),
    })
  );
};

const buildServiceResourcePayload = (payload = {}) => ({
  resourceCode: String(payload.resourceCode ?? "").trim(),
  location: String(payload.location ?? "").trim(),
  serviceId:
    payload.serviceId === "" || payload.serviceId == null
      ? null
      : Number(payload.serviceId),
  isAvailable: Boolean(payload.isAvailable),
});

export const createServiceResource = async (payload) => {
  const res = await requestWithAuthFallback({
    method: "post",
    url: "/service-resource",
    data: buildServiceResourcePayload(payload),
  }, { retryOnBadRequest: false });
  return normalizeServiceResource(getPayload(res.data));
};

export const updateServiceResource = async (id, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/service-resource/${id}`,
    data: buildServiceResourcePayload(payload),
  }, { retryOnBadRequest: false });
  return normalizeServiceResource(getPayload(res.data));
};

export const deleteServiceResource = async (id) => {
  const res = await requestWithAuthFallback({
    method: "delete",
    url: `/service-resource/${id}`,
  }, { retryOnBadRequest: false });
  return getPayload(res.data);
};

export const uploadServiceResourceImage = async (
  resourceId,
  file,
  description = "",
) => {
  const formData = new FormData();
  formData.append("serviceResourceId", resourceId);
  formData.append("file", file);
  if (description) {
    formData.append("description", description);
  }

  const res = await api.post("/images/service-resource", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return typeof res.data === "string"
    ? res.data
    : getPayload(res.data)?.url || "";
};

export const createBooking = async (payload) => {
  const res = await api.post("/bookings", payload);
  return getPayload(res.data);
};

export const getAllBookings = async () => {
  try {
    const res = await api.get("/bookings");
    const payload = getPayload(res.data);
    if (!Array.isArray(payload)) return [];
    return payload.map((item) => ({
      id: item?.id,
      resourceId: item?.bookingService?.serviceResource?.id ?? item?.resourceId ?? null,
      accountId: item?.bookingService?.account?.id ?? item?.accountId ?? null,
      bookFrom: item?.bookFrom ?? item?.bookingService?.bookFrom ?? null,
      bookTo: item?.bookTo ?? item?.bookingService?.bookTo ?? null,
      status: item?.status ?? item?.bookingService?.status ?? null,
    }));
  } catch {
    return [];
  }
};

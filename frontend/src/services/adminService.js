import api from "./api";

const extractFirstJsonBlock = (text) => {
  if (typeof text !== "string") return text;

  const source = text.trim().replace(/^\uFEFF/, "");
  const startChar = source[0];

  if (startChar !== "[" && startChar !== "{") {
    return text;
  }

  const closingChar = startChar === "[" ? "]" : "}";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === startChar) {
      depth += 1;
      continue;
    }

    if (char === closingChar) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(0, index + 1);
      }
    }
  }

  return source;
};

const parsePossibleJson = (value) => {
  if (typeof value !== "string") return value;

  const normalized = value.trim().replace(/^\uFEFF/, "");
  const candidate = extractFirstJsonBlock(normalized);

  try {
    return JSON.parse(candidate);
  } catch {
    return value;
  }
};

const getPayload = (data) => {
  const normalizedData = parsePossibleJson(data);
  return normalizedData?.result ?? normalizedData;
};

const toArray = (value) => {
  const normalizedValue = parsePossibleJson(value);

  if (Array.isArray(normalizedValue)) return normalizedValue;
  if (Array.isArray(normalizedValue?.content)) return normalizedValue.content;
  if (Array.isArray(normalizedValue?.data)) return normalizedValue.data;
  if (Array.isArray(normalizedValue?.items)) return normalizedValue.items;
  return [];
};

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

export const getAllContracts = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/contracts",
  });

  return toArray(getPayload(res.data));
};

export const updateContractById = async (contractId, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/contracts/${contractId}`,
    data: payload,
  });

  return getPayload(res.data);
};

export const getAllBookings = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/bookings",
  });

  return toArray(getPayload(res.data));
};

export const updateBookingById = async (bookingId, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/bookings/${bookingId}`,
    data: payload,
  }, { retryOnBadRequest: false });

  return getPayload(res.data);
};

export const getAllVisitors = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/visitors",
  });

  return toArray(getPayload(res.data));
};

export const createVisitor = async (payload) => {
  const res = await requestWithAuthFallback({
    method: "post",
    url: "/visitors",
    data: payload,
  });

  return getPayload(res.data);
};

export const updateVisitorById = async (visitorId, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/visitors/${visitorId}`,
    data: payload,
  });

  return getPayload(res.data);
};

export const deleteVisitorById = async (visitorId) => {
  const res = await requestWithAuthFallback({
    method: "delete",
    url: `/visitors/${visitorId}`,
  }, { retryOnBadRequest: false });

  return getPayload(res?.data);
};

export const getAllStaff = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/staff",
  });

  return toArray(getPayload(res.data));
};

export const getAllComplaints = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/complaints",
  });

  return toArray(getPayload(res.data));
};

export const updateComplaintById = async (complaintId, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/complaints/${complaintId}`,
    data: payload,
  });

  return getPayload(res.data);
};

export const getRepliesByComplaintId = async (complaintId) => {
  if (!complaintId) return [];

  const res = await requestWithAuthFallback({
    method: "get",
    url: `/replies/complaint/${complaintId}`,
  });

  return toArray(getPayload(res.data));
};

export const createReply = async (payload) => {
  const res = await requestWithAuthFallback({
    method: "post",
    url: "/replies",
    data: payload,
  });

  return getPayload(res.data);
};

export const getAllUtilitiesInvoices = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/utilities-invoice",
  });

  return toArray(getPayload(res.data));
};

export const getAllServiceInvoices = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/service-invoice",
  });

  return toArray(getPayload(res.data));
};

export const getStayHistoryByApartmentId = async (apartmentId) => {
  if (!apartmentId) return [];

  const res = await requestWithAuthFallback({
    method: "get",
    url: `/stay-at-history/apartment/${apartmentId}`,
  });

  return toArray(getPayload(res.data));
};

export const getStayHistoryByResidentId = async (residentId) => {
  if (!residentId) return [];

  const res = await requestWithAuthFallback({
    method: "get",
    url: `/stay-at-history/resident/${residentId}`,
  });

  return toArray(getPayload(res.data));
};

export const createStayAtHistory = async (payload) => {
  const res = await requestWithAuthFallback({
    method: "post",
    url: "/stay-at-history",
    data: payload,
  });

  return getPayload(res.data);
};

export const updateStayAtHistoryById = async (stayHistoryId, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/stay-at-history/${stayHistoryId}`,
    data: payload,
  });

  return getPayload(res.data);
};

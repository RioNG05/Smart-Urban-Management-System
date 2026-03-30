import api from "./api";

const getPayload = (data) => data?.result ?? data;

const toArray = (value) => (Array.isArray(value) ? value : []);

const requestWithAuthFallback = async (config) => {
  try {
    return await api({
      ...config,
      skipAuth: false,
    });
  } catch (error) {
    const status = error?.response?.status;

    if (status !== 400 && status !== 401 && status !== 403) {
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
  });

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

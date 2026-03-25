import api from "./api";

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

export const getResidents = async () => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: "/residents",
  });
  return res.data.result ?? [];
};

export const getAccounts = async () => {
  try {
    const res = await requestWithAuthFallback({
      method: "get",
      url: "/accounts",
    });
    console.log("ACCOUNTS RES:", res);
    return res.data.result ?? [];
  } catch (e) {
    console.error("ACCOUNTS ERROR:", e.response?.data);
    throw e;
  }
};

export const getContractsByAccountId = async (accountId) => {
  const res = await requestWithAuthFallback({
    method: "get",
    url: `/contracts/list/account/${accountId}`,
  });
  return res.data.result ?? [];
};

export const createAccount = async (payload) => {
  const res = await requestWithAuthFallback({
    method: "post",
    url: "/accounts",
    data: payload,
  });
  return res.data.result;
};

export const updateAccountById = async (accountId, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/accounts/${accountId}`,
    data: payload,
  });
  return res.data.result;
};

export const deleteAccountById = async (accountId) => {
  const res = await requestWithAuthFallback({
    method: "delete",
    url: `/accounts/${accountId}`,
  });
  return res.data.result;
};

export const createResident = async (payload) => {
  const res = await requestWithAuthFallback({
    method: "post",
    url: "/residents",
    data: payload,
  });
  return res.data.result;
};

export const updateResidentById = async (residentId, payload) => {
  const res = await requestWithAuthFallback({
    method: "put",
    url: `/residents/${residentId}`,
    data: payload,
  });
  return res.data.result;
};

export const deleteResidentById = async (residentId) => {
  const res = await requestWithAuthFallback({
    method: "delete",
    url: `/residents/${residentId}`,
  });
  return res.data.result;
};

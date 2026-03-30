import api from "./api";
import { getMyAccount } from "./profileService";
import { getContractsByAccountId } from "./adminResidentService";

const toArray = (value) => (Array.isArray(value) ? value : []);

export const getBillingApartmentsForCurrentUser = async () => {
  const account = await getMyAccount();
  const contracts = await getContractsByAccountId(account.id);

  const apartments = contracts
    .map((contract) => contract?.apartment)
    .filter(Boolean)
    .reduce((acc, apartment) => {
      if (!acc.some((item) => item.id === apartment.id)) {
        acc.push(apartment);
      }
      return acc;
    }, []);

  return apartments;
};

export const getUtilitiesInvoicesByApartmentId = async (apartmentId) => {
  if (!apartmentId) return [];

  const res = await api.get(`/utilities-invoice/apartment/${apartmentId}`);
  return toArray(res.data?.result);
};

export const getServiceInvoices = async () => {
  try {
    const res = await api.get("/service-invoice");
    return {
      items: toArray(res.data?.result),
      restricted: false,
    };
  } catch (error) {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      return {
        items: [],
        restricted: true,
      };
    }

    throw error;
  }
};

export const getBookingsByAccountId = async (accountId) => {
  if (!accountId) return [];

  const res = await api.get(`/bookings/account/${accountId}`);
  return toArray(res.data);
};

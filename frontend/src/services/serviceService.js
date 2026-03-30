import api from "./api";

const getPayload = (data) => data?.result ?? data;

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

  return {
    id: item?.id,
    title: item?.serviceName || "Unnamed service",
    desc:
      formattedFee
        ? `Current service fee: ${formattedFee}. Contact the management team for booking details and availability.`
        : "Contact the management team for booking details and availability.",
    image: item?.imageUrl || null,
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

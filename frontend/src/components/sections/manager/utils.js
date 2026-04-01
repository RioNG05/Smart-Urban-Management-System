export const paginateItems = (items, page, pageSize) =>
  items.slice((page - 1) * pageSize, page * pageSize);

export const formatAdminDateTime = (value) => {
  if (!value) return "N/A";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export const formatAdminDate = (value) => {
  if (!value) return "N/A";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(parsed);
};

export const getComplaintOwnerId = (complaint) =>
  complaint?.madeByUser?.id ??
  complaint?.user?.id ??
  complaint?.userId ??
  complaint?.accountId ??
  complaint?.createdBy?.id ??
  complaint?.account?.id ??
  null;

export const getReplyAuthorId = (reply) =>
  reply?.user?.id ??
  reply?.userId ??
  reply?.accountId ??
  reply?.createdBy?.id ??
  null;

export const getComplaintTimestamp = (record) =>
  record?.createdAt ??
  record?.updatedAt ??
  record?.createAt ??
  record?.time ??
  record?.sentAt ??
  null;

export const getAdminTimestampValue = (value) => {
  if (!value) return 0;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

export const normalizeApartmentTypeRecord = (type, index = 0) => ({
  id: type?.id ?? `apt-type-${Date.now()}-${index}`,
  name: type?.name ?? "",
  designSqrt: String(type?.designSqrt ?? ""),
  numberOfBedroom: String(type?.numberOfBedroom ?? ""),
  numberOfBathroom: String(type?.numberOfBathroom ?? ""),
  commonPriceForBuying: String(type?.commonPriceForBuying ?? ""),
  commonPriceForRent: String(type?.commonPriceForRent ?? ""),
  furnitureTypeId: String(
    type?.furnitureTypeId ?? type?.furnitureType?.id ?? "",
  ),
  furniture:
    type?.furniture ??
    type?.furnitureType?.description ??
    type?.furnitureType?.name ??
    "",
  overview: type?.overview ?? "",
  furnitureType: type?.furnitureType ?? null,
  source: type?.source ?? "backend",
  createdAt: type?.createdAt ?? new Date().toISOString(),
  updatedAt: type?.updatedAt ?? type?.createdAt ?? new Date().toISOString(),
});

const DEFAULT_MAP_LOCATION = "Vinhomes Ocean Park, Gia Lam, Ha Noi";

export const formatPrice = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "Lien he";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

export const getImageByTypeName = (name = "") => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("studio")) {
    return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
  }

  if (normalizedName.includes("villa") || normalizedName.includes("penthouse")) {
    return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80";
  }

  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
};

const normalizeFurniture = (furniture) => {
  if (furniture === 1 || furniture === true) {
    return "Co noi that co ban";
  }

  if (furniture === 0 || furniture === false) {
    return "Ban giao tho";
  }

  return "Dang cap nhat";
};

const normalizeStatus = (status) => {
  if (status === 1) {
    return "Da co chu";
  }

  if (status === 0) {
    return "Dang mo ban";
  }

  return "Dang cap nhat";
};

const formatPostedDate = (createdAt) => {
  if (!createdAt) {
    return "Dang cap nhat";
  }

  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Dang cap nhat";
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
};

const buildLocationLabel = (roomNumber, floorNumber) => {
  const parts = [];

  if (roomNumber !== undefined && roomNumber !== null) {
    parts.push(`Phong ${roomNumber}`);
  }

  if (floorNumber !== undefined && floorNumber !== null) {
    parts.push(`Tang ${floorNumber}`);
  }

  return parts.length ? parts.join(", ") : "Dang cap nhat";
};

export const mapApartmentToProperty = (apartment = {}, apartmentType = {}) => {
  const buyPrice =
    apartment.specificPriceForBuying ?? apartmentType.commonPriceForBuying;
  const rentPrice =
    apartment.specificPriceForRenting ?? apartmentType.commonPriceForRent;
  const displayPrice = buyPrice ?? rentPrice;
  const area = Number(apartmentType.designSqrt ?? 0);
  const pricePerSquareMeter =
    displayPrice && area > 0 ? Math.round(Number(displayPrice) / area) : null;
  const title =
    apartmentType.name || `Can ho ${apartment.roomNumber ?? apartment.id}`;
  const image = getImageByTypeName(apartmentType.name);
  const locationLabel = buildLocationLabel(
    apartment.roomNumber ?? apartment.id,
    apartment.floorNumber,
  );
  const fullLocation = `${locationLabel}, ${DEFAULT_MAP_LOCATION}`;

  return {
    id: apartment.id,
    title,
    location: locationLabel,
    fullLocation,
    bedrooms: apartmentType.numberOfBedroom ?? 0,
    bathrooms: apartmentType.numberOfBathroom ?? 0,
    area,
    price: formatPrice(displayPrice),
    rawPrice: Number(displayPrice ?? 0),
    rentPrice: formatPrice(rentPrice),
    buyPrice: formatPrice(buyPrice),
    image,
    images: [image],
    statusLabel: normalizeStatus(apartment.status),
    rawStatus: apartment.status,
    isAvailable: apartment.status === 0,
    sortPrice: Number(displayPrice ?? 0),
    roomNumber: apartment.roomNumber ?? apartment.id,
    floorNumber: apartment.floorNumber ?? "Dang cap nhat",
    direction: apartment.direction || "Dang cap nhat",
    propertyType: "Apartment",
    overview: apartmentType.overview || "Dang cap nhat",
    furniture: normalizeFurniture(apartmentType.furniture),
    legalStatus: "Dang cap nhat",
    pricePerSquareMeter: formatPrice(pricePerSquareMeter),
    postedDate: formatPostedDate(apartmentType.createdAt),
    hasMapLocation: true,
  };
};

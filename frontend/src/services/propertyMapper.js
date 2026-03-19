const DEFAULT_LOCATION = "Vinhomes Ocean Park, Gia Lam, Ha Noi";

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

  return {
    id: apartment.id,
    title,
    location: `Tang ${apartment.floorNumber ?? "?"}, ${DEFAULT_LOCATION}`,
    fullLocation: DEFAULT_LOCATION,
    bedrooms: apartmentType.numberOfBedroom ?? 0,
    bathrooms: apartmentType.numberOfBathroom ?? 0,
    area,
    price: formatPrice(displayPrice),
    rawPrice: Number(displayPrice ?? 0),
    rentPrice: formatPrice(rentPrice),
    buyPrice: formatPrice(buyPrice),
    image: getImageByTypeName(apartmentType.name),
    statusLabel: normalizeStatus(apartment.status),
    rawStatus: apartment.status,
    isAvailable: apartment.status === 0,
    sortPrice: Number(displayPrice ?? 0),
    roomNumber: apartment.roomNumber ?? apartment.id,
    floorNumber: apartment.floorNumber ?? "Dang cap nhat",
    direction: apartment.direction || "Dang cap nhat",
    propertyType: "Apartment",
    overview:
      apartmentType.overview ||
      `Can ho so ${apartment.roomNumber ?? apartment.id} tai ${DEFAULT_LOCATION}.`,
    furniture: normalizeFurniture(apartmentType.furniture),
    legalStatus: "So hong/san sang giao dich",
    pricePerSquareMeter: formatPrice(pricePerSquareMeter),
    postedDate: new Intl.DateTimeFormat("vi-VN").format(new Date()),
  };
};

const DEFAULT_MAP_LOCATION = "Vinhomes Ocean Park, Gia Lam, Ha Noi";

const pickFirstValidImage = (...candidates) =>
  candidates
    .flatMap((candidate) => {
      if (Array.isArray(candidate)) {
        return candidate;
      }

      return [candidate];
    })
    .map((value) => String(value ?? "").trim())
    .find(Boolean) || null;

const normalizeImageValue = (item) => {
  if (!item) {
    return null;
  }

  if (typeof item === "string") {
    return item.trim() || null;
  }

  if (typeof item === "object") {
    return pickFirstValidImage(item.imageUrl, item.url, item.src, item.image);
  }

  return null;
};

const collectImageUrls = (...sources) => {
  const imageUrls = sources
    .flatMap((source) => {
      if (!source) {
        return [];
      }

      return Array.isArray(source) ? source : [source];
    })
    .map(normalizeImageValue)
    .filter(Boolean);

  return [...new Set(imageUrls)];
};

const getApartmentTypeImageKey = (imageRecord = {}) => {
  const directId =
    imageRecord.apartmentTypeId ??
    imageRecord.typeId ??
    imageRecord.apartmentTypeID ??
    imageRecord.apartment_type_id;

  if (directId !== undefined && directId !== null && directId !== "") {
    return String(directId);
  }

  const nestedId =
    imageRecord.apartmentType?.id ??
    imageRecord.apartmentType?.apartmentTypeId ??
    imageRecord.type?.id;

  if (nestedId !== undefined && nestedId !== null && nestedId !== "") {
    return String(nestedId);
  }

  return null;
};

export const buildApartmentTypeImageMap = (imageRecords = []) =>
  imageRecords.reduce((imageMap, imageRecord) => {
    const apartmentTypeKey = getApartmentTypeImageKey(imageRecord);
    const imageUrl = normalizeImageValue(imageRecord);

    if (!apartmentTypeKey || !imageUrl) {
      return imageMap;
    }

    const existingImages = imageMap.get(apartmentTypeKey) ?? [];
    imageMap.set(apartmentTypeKey, [...existingImages, imageUrl]);
    return imageMap;
  }, new Map());

export const createApartmentTypeImageMap = (
  apartmentTypes = [],
  imageRecords = [],
) => {
  const explicitImageMap = buildApartmentTypeImageMap(imageRecords);

  if (explicitImageMap.size > 0) {
    return explicitImageMap;
  }

  const normalizedImages = collectImageUrls(imageRecords);

  if (!apartmentTypes.length || !normalizedImages.length) {
    return new Map();
  }

  if (normalizedImages.length % apartmentTypes.length !== 0) {
    return new Map();
  }

  const chunkSize = normalizedImages.length / apartmentTypes.length;
  const sortedApartmentTypes = [...apartmentTypes].sort(
    (a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0),
  );

  return sortedApartmentTypes.reduce((imageMap, apartmentType, index) => {
    const startIndex = index * chunkSize;
    const images = normalizedImages.slice(startIndex, startIndex + chunkSize);

    if (apartmentType?.id !== undefined && images.length) {
      imageMap.set(String(apartmentType.id), images);
    }

    return imageMap;
  }, new Map());
};

export const getApartmentTypeImages = (
  apartmentType = {},
  apartmentTypeImageMap,
) => {
  const apartmentTypeId =
    apartmentType.id ??
    apartmentType.apartmentTypeId ??
    apartmentType.apartmentType?.id;

  const mappedImages =
    apartmentTypeId !== undefined && apartmentTypeId !== null
      ? apartmentTypeImageMap?.get(String(apartmentTypeId)) ?? []
      : [];

  return collectImageUrls(
    apartmentType.imageUrls,
    apartmentType.images,
    apartmentType.gallery,
    apartmentType.photos,
    apartmentType.imageUrl,
    apartmentType.image,
    apartmentType.thumbnailUrl,
    mappedImages,
  );
};

export const formatPrice = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "Contact for price";
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
    return "Basic furnished";
  }

  if (furniture === 0 || furniture === false) {
    return "Unfurnished";
  }

  return "Updating";
};

const normalizeStatus = (status) => {
  if (status === 1) {
    return "Occupied";
  }

  if (status === 0) {
    return "Now Selling";
  }

  return "Updating";
};

const formatPostedDate = (createdAt) => {
  if (!createdAt) {
    return "Updating";
  }

  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Updating";
  }

  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const buildLocationLabel = (roomNumber, floorNumber) => {
  const parts = [];

  if (roomNumber !== undefined && roomNumber !== null) {
    parts.push(`Room ${roomNumber}`);
  }

  if (floorNumber !== undefined && floorNumber !== null) {
    parts.push(`Floor ${floorNumber}`);
  }

  return parts.length ? parts.join(", ") : "Updating";
};

export const mapApartmentTypeToCard = (
  apartmentType = {},
  apartmentTypeImageMap,
) => {
  const images = getApartmentTypeImages(apartmentType, apartmentTypeImageMap);
  const fallbackImage = getImageByTypeName(apartmentType.name);

  return {
    id: apartmentType.id,
    name: apartmentType.name || "Apartment type",
    description: apartmentType.overview || "Details are being updated.",
    image: pickFirstValidImage(images, fallbackImage),
    images: images.length ? images : [fallbackImage],
    bedrooms: apartmentType.numberOfBedroom ?? 0,
    bathrooms: apartmentType.numberOfBathroom ?? 0,
    area: apartmentType.designSqrt ?? null,
  };
};

export const mapApartmentToProperty = (
  apartment = {},
  apartmentType = {},
  apartmentTypeImageMap,
) => {
  const buyPrice =
    apartment.specificPriceForBuying ?? apartmentType.commonPriceForBuying;
  const rentPrice =
    apartment.specificPriceForRenting ?? apartmentType.commonPriceForRent;
  const displayPrice = buyPrice ?? rentPrice;
  const area = Number(apartmentType.designSqrt ?? 0);
  const pricePerSquareMeter =
    displayPrice && area > 0 ? Math.round(Number(displayPrice) / area) : null;
  const title =
    apartmentType.name || `Apartment ${apartment.roomNumber ?? apartment.id}`;
  const apartmentImages = getApartmentTypeImages(
    apartmentType,
    apartmentTypeImageMap,
  );
  const fallbackImage = getImageByTypeName(apartmentType.name);
  const image = pickFirstValidImage(apartmentImages, fallbackImage);
  const locationLabel = buildLocationLabel(
    apartment.roomNumber ?? apartment.id,
    apartment.floorNumber,
  );
  const fullLocation = `${locationLabel}, ${DEFAULT_MAP_LOCATION}`;

  return {
    id: apartment.id,
    apartmentTypeId: apartment.apartmentTypeId ?? apartment.apartmentType?.id ?? null,
    apartmentTypeName: apartmentType.name || "Updating",
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
    images: apartmentImages.length ? apartmentImages : [image],
    statusLabel: normalizeStatus(apartment.status),
    rawStatus: apartment.status,
    isAvailable: apartment.status === 0,
    sortPrice: Number(displayPrice ?? 0),
    roomNumber: apartment.roomNumber ?? apartment.id,
    floorNumber: apartment.floorNumber ?? "Updating",
    direction: apartment.direction || "Updating",
    propertyType: "Apartment",
    overview: apartmentType.overview || "Updating",
    furniture: normalizeFurniture(apartmentType.furniture),
    legalStatus: "Updating",
    pricePerSquareMeter: formatPrice(pricePerSquareMeter),
    postedDate: formatPostedDate(apartmentType.createdAt),
    hasMapLocation: true,
  };
};

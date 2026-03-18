import React, { useEffect, useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import {
  getApartments,
  getApartmentTypes,
} from "../../../services/apartmentService.js";

const formatPrice = (value) => {
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

const getImageByTypeName = (name = "") => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("studio")) {
    return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
  }

  if (normalizedName.includes("villa") || normalizedName.includes("penthouse")) {
    return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80";
  }

  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
};

const mapProperties = (apartments = [], apartmentTypes = []) => {
  const apartmentTypeMap = new Map(
    apartmentTypes.map((apartmentType) => [apartmentType.id, apartmentType]),
  );

  return apartments.map((apartment) => {
    const apartmentType =
      apartment.apartmentType ??
      apartmentTypeMap.get(
        apartment.apartmentTypeId ?? apartment.apartmentType?.id,
      ) ??
      {};

    const buyPrice =
      apartment.specificPriceForBuying ?? apartmentType.commonPriceForBuying;
    const rentPrice =
      apartment.specificPriceForRenting ?? apartmentType.commonPriceForRent;

    return {
      id: apartment.id,
      title: apartmentType.name || `Can ho ${apartment.roomNumber ?? apartment.id}`,
      location: `Tang ${apartment.floorNumber ?? "?"}, Vinhomes`,
      bedrooms: apartmentType.numberOfBedroom ?? 0,
      bathrooms: apartmentType.numberOfBathroom ?? 0,
      area: apartmentType.designSqrt ?? 0,
      price: formatPrice(buyPrice ?? rentPrice),
      image: getImageByTypeName(apartmentType.name),
      statusLabel: apartment.status === 1 ? "Da ban" : "Dang mo ban",
      sortPrice: Number(buyPrice ?? rentPrice ?? 0),
    };
  });
};

function PropertyGrid({ view, sortBy, onCountChange }) {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // [BACKEND API INTEGRATION POINT]
    // Goi API lay danh sach can ho: GET /api/apartments
    // Goi API lay danh sach loai can ho: GET /api/apartments/type

    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [apartments, apartmentTypes] = await Promise.all([
          getApartments(),
          getApartmentTypes(),
        ]);

        setProperties(mapProperties(apartments, apartmentTypes));
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Could not load property list at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const sortedProperties = useMemo(() => {
    const nextProperties = [...properties];

    if (sortBy === "price-asc") {
      return nextProperties.sort((a, b) => a.sortPrice - b.sortPrice);
    }

    if (sortBy === "price-desc") {
      return nextProperties.sort((a, b) => b.sortPrice - a.sortPrice);
    }

    return nextProperties.sort((a, b) => b.id - a.id);
  }, [properties, sortBy]);

  useEffect(() => {
    if (typeof onCountChange === "function") {
      onCountChange(sortedProperties.length);
    }
  }, [sortedProperties, onCountChange]);

  if (isLoading) {
    return (
      <div className="property-feedback">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="property-feedback-text">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (sortedProperties.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No properties available at the moment.
      </div>
    );
  }

  return (
    <div className={`property-grid ${view}`}>
      {sortedProperties.map((item) => (
        <PropertyCard key={item.id} property={item} view={view} />
      ))}
    </div>
  );
}

export default PropertyGrid;

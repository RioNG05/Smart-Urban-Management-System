import React, { useEffect, useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import Pagination from "../../common/Pagination";
import {
  getApartments,
  getApartmentTypeImages,
  getApartmentTypes,
} from "../../../services/apartmentService.js";
import {
  createApartmentTypeImageMap,
  mapApartmentToProperty,
} from "../../../services/propertyMapper.js";

const ITEMS_PER_PAGE = 20;

const mapProperties = (
  apartments = [],
  apartmentTypes = [],
  apartmentTypeImageMap,
) => {
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

    return mapApartmentToProperty(apartment, apartmentType, apartmentTypeImageMap);
  });
};

function PropertyGrid({
  view,
  sortBy,
  selectedApartmentType,
  onCountChange,
  onAvailableCountChange,
  onPageMetaChange,
  onApartmentTypeOptionsChange,
}) {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [apartments, apartmentTypes, apartmentTypeImages] = await Promise.all([
          getApartments(),
          getApartmentTypes(),
          getApartmentTypeImages(),
        ]);
        const apartmentTypeImageMap = createApartmentTypeImageMap(
          apartmentTypes,
          apartmentTypeImages,
        );

        if (typeof onApartmentTypeOptionsChange === "function") {
          onApartmentTypeOptionsChange(apartmentTypes);
        }

        setProperties(
          mapProperties(apartments, apartmentTypes, apartmentTypeImageMap),
        );
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Could not load property list at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [onApartmentTypeOptionsChange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedApartmentType]);

  const sortedProperties = useMemo(() => {
    const filteredProperties = properties.filter((property) => {
      if (!property.isAvailable) {
        return false;
      }

      if (selectedApartmentType === "all") {
        return true;
      }

      return String(property.apartmentTypeId) === selectedApartmentType;
    });

    const nextProperties = [...filteredProperties];

    if (sortBy === "price-asc") {
      return nextProperties.sort((a, b) => a.sortPrice - b.sortPrice);
    }

    if (sortBy === "price-desc") {
      return nextProperties.sort((a, b) => b.sortPrice - a.sortPrice);
    }

    return nextProperties.sort((a, b) => b.id - a.id);
  }, [properties, sortBy, selectedApartmentType]);

  const totalPages = Math.max(1, Math.ceil(sortedProperties.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startOffset = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = sortedProperties.slice(
    startOffset,
    startOffset + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [safeCurrentPage, currentPage]);

  useEffect(() => {
    if (typeof onCountChange === "function") {
      onCountChange(sortedProperties.length);
    }
  }, [sortedProperties, onCountChange]);

  useEffect(() => {
    if (typeof onAvailableCountChange === "function") {
      onAvailableCountChange(sortedProperties.length);
    }
  }, [sortedProperties, onAvailableCountChange]);

  useEffect(() => {
    if (typeof onPageMetaChange === "function") {
      onPageMetaChange({
        currentPage: safeCurrentPage,
        totalPages,
        startIndex: sortedProperties.length ? startOffset + 1 : 0,
        endIndex: Math.min(startOffset + ITEMS_PER_PAGE, sortedProperties.length),
      });
    }
  }, [
    safeCurrentPage,
    totalPages,
    startOffset,
    sortedProperties.length,
    onPageMetaChange,
  ]);

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
    <div className="property-grid-section">
      <div className={`property-grid ${view}`}>
        {paginatedProperties.map((item) => (
          <PropertyCard key={item.id} property={item} view={view} />
        ))}
      </div>

      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default PropertyGrid;

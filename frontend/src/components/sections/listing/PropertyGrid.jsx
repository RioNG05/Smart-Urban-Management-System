import React, { useEffect, useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import {
  getApartments,
  getApartmentTypes,
} from "../../../services/apartmentService.js";
import { mapApartmentToProperty } from "../../../services/propertyMapper.js";

const ITEMS_PER_PAGE = 20;

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

    return mapApartmentToProperty(apartment, apartmentType);
  });
};

function PropertyGrid({
  view,
  sortBy,
  statusFilter,
  onCountChange,
  onAvailableCountChange,
  onPageMetaChange,
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

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, statusFilter]);

  const sortedProperties = useMemo(() => {
    const filteredProperties = properties.filter((property) => {
      if (statusFilter === "available") {
        return property.isAvailable;
      }

      if (statusFilter === "unavailable") {
        return !property.isAvailable;
      }

      return true;
    });

    const nextProperties = [...filteredProperties];

    if (sortBy === "price-asc") {
      return nextProperties.sort((a, b) => a.sortPrice - b.sortPrice);
    }

    if (sortBy === "price-desc") {
      return nextProperties.sort((a, b) => b.sortPrice - a.sortPrice);
    }

    return nextProperties.sort((a, b) => b.id - a.id);
  }, [properties, sortBy, statusFilter]);

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
      onAvailableCountChange(
        properties.filter((property) => property.isAvailable).length,
      );
    }
  }, [properties, onAvailableCountChange]);

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

      <div className="pagination-bar">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={safeCurrentPage === 1}
        >
          Previous
        </button>

        <div className="pagination-pages">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                className={`pagination-page ${
                  page === safeCurrentPage ? "active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className="pagination-btn"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={safeCurrentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PropertyGrid;

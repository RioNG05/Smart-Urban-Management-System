import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/product.css";

import Header from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Breadcrumb from "../components/sections/product/Breadcrumb";
import Gallery from "../components/sections/product/Gallery";
import ProductHeader from "../components/sections/product/ProductHeader";
import ProductMeta from "../components/sections/product/ProductMeta";
import Description from "../components/sections/product/Description";
import Features from "../components/sections/product/Features";
import LegalInfo from "../components/sections/product/LegalInfo";
import MapSection from "../components/sections/product/MapSection";
import SimilarProperties from "../components/sections/product/SimilarProperties";
import ContactSidebar from "../components/sections/product/ContactSidebar";
import {
  getApartmentById,
  getApartments,
  getApartmentTypeImages,
  getApartmentTypes,
} from "../services/apartmentService";
import {
  createApartmentTypeImageMap,
  mapApartmentToProperty,
} from "../services/propertyMapper";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apartment = await getApartmentById(id);
        const apartmentTypeId =
          apartment.apartmentTypeId ?? apartment.apartmentType?.id;
        const [apartments, apartmentTypes, apartmentTypeImages] = await Promise.all([
          getApartments(),
          getApartmentTypes(),
          getApartmentTypeImages(),
        ]);
        const apartmentTypeImageMap = createApartmentTypeImageMap(
          apartmentTypes,
          apartmentTypeImages,
        );

        const apartmentTypeMap = new Map(
          apartmentTypes.map((item) => [item.id, item]),
        );

        const apartmentType =
          apartment.apartmentType ?? apartmentTypeMap.get(apartmentTypeId) ?? {};

        setProperty(
          mapApartmentToProperty(apartment, apartmentType, apartmentTypeImageMap),
        );

        setRelatedProperties(
          apartments
            .filter((item) => item.id !== Number(id))
            .slice(0, 3)
            .map((item) =>
              mapApartmentToProperty(
                item,
                item.apartmentType ??
                  apartmentTypeMap.get(item.apartmentTypeId ?? item.apartmentType?.id) ??
                  {},
                apartmentTypeImageMap,
              ),
            ),
        );
      } catch (err) {
        console.error("Error fetching property detail:", err);
        setError("Could not load property detail at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="detail-container">
          <div className="property-feedback">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="property-feedback-text">Loading property detail...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <div className="detail-container">
          <div className="alert alert-danger" role="alert">
            {error || "Property detail is unavailable."}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="detail-container">
        <Breadcrumb title={property.title} />

        <Gallery property={property} />

        <div className="detail-main">
          <div className="detail-left">
            <ProductHeader property={property} />
            <ProductMeta property={property} />
            <Description property={property} />
            <Features property={property} />
            <LegalInfo property={property} />
            <MapSection property={property} />
            <SimilarProperties properties={relatedProperties} />
          </div>

          <div className="detail-right">
            <ContactSidebar property={property} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;

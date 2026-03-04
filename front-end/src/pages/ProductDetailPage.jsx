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

const ProductDetailPage = () => {
  return (
    <>
      <Header />

      <div className="detail-container">
        <Breadcrumb />

        <Gallery />

        <div className="detail-main">
          {/* LEFT CONTENT */}
          <div className="detail-left">
            <ProductHeader />
            <ProductMeta />
            <Description />
            <Features />
            <LegalInfo />
            {/* <MapSection /> */}
            <SimilarProperties />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="detail-right">
            <ContactSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;

import { FaRegHeart, FaShareAlt } from "react-icons/fa";

const ProductHeader = ({ property }) => {
  return (
    <div className="product-header">
      <div className="header-left">
        <h1 className="product-title">{property.title}</h1>
        <p className="product-location">{property.fullLocation}</p>
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <FaShareAlt />
        </button>
        <button className="icon-btn">
          <FaRegHeart />
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;

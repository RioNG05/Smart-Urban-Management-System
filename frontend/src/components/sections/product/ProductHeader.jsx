import { FaShareAlt, FaRegHeart } from "react-icons/fa";

const ProductHeader = () => {
  return (
    <div className="product-header">
      <div className="header-left">
        <h1 className="product-title">
          Latest update: Best-priced apartments in 2026 with no brokerage fee
          and clear legal status at Vinahouse Ocean Park
        </h1>

        <p className="product-location">Duong Xa Commune, Gia Lam, Hanoi</p>
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

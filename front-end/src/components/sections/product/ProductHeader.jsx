import { FaShareAlt, FaRegHeart } from "react-icons/fa";

const ProductHeader = () => {
  return (
    <div className="product-header">
      <div className="header-left">
        <h1 className="product-title">
          Cập nhật quỹ hàng rẻ nhất 2026 miễn phí môi giới, pháp lý rõ ràng tại
          Vinhomes Ocean Park
        </h1>

        <p className="product-location">Xã Dương Xá, Gia Lâm, Hà Nội</p>
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

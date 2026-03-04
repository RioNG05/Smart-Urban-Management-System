import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <div className="breadcrumb">
      <Link to="/">Trang chủ</Link>
      <span className="separator">›</span>

      <Link to="/market">Bán</Link>
      <span className="separator">›</span>

      <Link to="/market?type=chung-cu">Căn hộ chung cư</Link>
      <span className="separator">›</span>

      <span className="current">Vinhomes Ocean Park Gia Lâm</span>
    </div>
  );
};

export default Breadcrumb;

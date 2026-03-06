import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <span className="separator">›</span>

      <Link to="/market">Buy</Link>
      <span className="separator">›</span>

      <Link to="/market?type=chung-cu">Apartment</Link>
      <span className="separator">›</span>

      <span className="current">VinaHouse</span>
    </div>
  );
};

export default Breadcrumb;

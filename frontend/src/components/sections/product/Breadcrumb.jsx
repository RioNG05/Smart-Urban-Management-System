import { Link } from "react-router-dom";

const Breadcrumb = ({ title }) => {
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <span className="separator">/</span>

      <Link to="/market">Buy</Link>
      <span className="separator">/</span>

      <Link to="/market">Apartment</Link>
      <span className="separator">/</span>

      <span className="current">{title || "Property detail"}</span>
    </div>
  );
};

export default Breadcrumb;

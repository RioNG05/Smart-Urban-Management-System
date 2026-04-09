import { Link } from "react-router-dom";

const ContactSidebar = ({ property }) => {
  return (
    <div className="contact-sidebar">
      <div className="agent-details">
        <div className="agent-name">Product Consultation</div>
        <div className="agent-status">{property.title}</div>
        <div className="agent-status">Room {property.roomNumber}</div>
      </div>

      <Link to="/contact" className="btn-call">
        Contact Consultant
      </Link>

      <Link to="/market" className="btn-message">
        View More Listings
      </Link>

      <div className="quick-contact">
        <Link to="/services" className="btn-submit">
          Explore Services
        </Link>
      </div>
    </div>
  );
};

export default ContactSidebar;

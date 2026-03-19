import { Link } from "react-router-dom";

function PropertyCard({ property, view }) {
  return (
    <Link to={`/product/${property.id}`} className={`property-card ${view}`}>
      <div className="property-image">
        <img src={property.image} alt={property.title} />
        <span className="tag">{property.statusLabel}</span>
      </div>

      <div className="property-content">
        <div className="property-card__eyebrow">
          <span className="property-chip">{property.propertyType}</span>
          <span className="property-room">Room {property.roomNumber}</span>
        </div>

        <h3>{property.title}</h3>
        <p className="location">{property.location}</p>

        <div className="property-meta">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} m2</span>
        </div>

        <div className="property-card__footer">
          <div className="price-block">
            <div className="price">{property.price}</div>
            <div className="price-caption">Sale listing</div>
          </div>
          <div className="property-arrow">Details</div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;

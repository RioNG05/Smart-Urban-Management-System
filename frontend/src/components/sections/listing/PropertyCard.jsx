function PropertyCard({ property, view }) {
  return (
    <div className={`property-card ${view}`}>
      <div className="property-image">
        <img src={property.image} alt={property.title} />
        <span className="tag">{property.statusLabel}</span>
      </div>

      <div className="property-content">
        <h3>{property.title}</h3>
        <p className="location">{property.location}</p>

        <div className="property-meta">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} m2</span>
        </div>

        <div className="price">{property.price}</div>
      </div>
    </div>
  );
}

export default PropertyCard;

function PropertyCard({ property, view }) {
  return (
    <div className={`property-card ${view}`}>
      <div className="property-image">
        <img src={property.image} alt="" />
        <span className="tag">For Sale</span>
      </div>

      <div className="property-content">
        <h3>{property.title}</h3>
        <p className="location">{property.location}</p>

        <div className="property-meta">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} m²</span>
        </div>

        <div className="price">{property.price}</div>
      </div>
    </div>
  );
}

export default PropertyCard;

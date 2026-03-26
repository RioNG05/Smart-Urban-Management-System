const Features = ({ property }) => {
  const features = [
    { label: "Property Type", value: property.propertyType },
    { label: "Area", value: `${property.area} m2` },
    { label: "Bedrooms", value: `${property.bedrooms} rooms` },
    { label: "Bathrooms", value: `${property.bathrooms} rooms` },
    { label: "Direction", value: property.direction },
    { label: "Interior Status", value: property.furniture },
    { label: "Floor", value: `${property.floorNumber}` },
    { label: "Room Number", value: `${property.roomNumber}` },
    { label: "Posted Date", value: property.postedDate },
    { label: "Ownership Status", value: property.statusLabel },
  ];

  return (
    <div className="product-features">
      <h2 className="section-title">Property Features</h2>

      <div className="features-grid">
        {features.map((item, index) => (
          <div key={index} className="feature-item">
            <span className="feature-label">{item.label}</span>
            <span className="feature-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;

const Features = () => {
  const features = [
    { label: "Property Type", value: "Apartment" },
    { label: "Area", value: "75 m²" },
    { label: "Bedrooms", value: "2 rooms" },
    { label: "Bathrooms", value: "2 rooms" },
    { label: "Direction", value: "Southeast" },
    { label: "Balcony Direction", value: "Northwest" },
    { label: "Interior Status", value: "Basic interior" },
    { label: "Floor", value: "Mid floor" },
    { label: "Legal Status", value: "Red book (Ownership certificate)" },
    { label: "Posted Date", value: "03/03/2026" },
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

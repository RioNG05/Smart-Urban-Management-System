import { useState } from "react";

const Description = ({ property }) => {
  const [expanded, setExpanded] = useState(false);

  const sections = [
    property.overview !== "Updating" ? property.overview : null,
    `Room number: ${property.roomNumber}`,
    `Floor: ${property.floorNumber}`,
    `Area: ${property.area} m2`,
    `${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms`,
    `Direction: ${property.direction}`,
    `Interior status: ${property.furniture}`,
  ].filter(Boolean);

  const content = sections.join("\n\n");

  const shortText = content.slice(0, 350);

  return (
    <div className="product-description">
      <h2 className="section-title">Description</h2>

      <p className="description-content">{expanded ? content : shortText}</p>

      {content.length > 350 && (
        <button className="toggle-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default Description;

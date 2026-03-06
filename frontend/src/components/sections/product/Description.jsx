import { useState } from "react";

const Description = () => {
  const [expanded, setExpanded] = useState(false);

  const content = `
Latest update of the best-priced apartment listings at Vinhomes Ocean Park, Gia Lam.

- Apartment area: 75m² with 2 bedrooms and 2 bathrooms.
- Mid-floor unit with a clear internal view.
- Basic interior provided by the developer.
- Clear legal status, ready for transaction.

Full internal amenities available: large lake, green parks, shopping malls, and international schools.

Bank loan support up to 70% of the apartment value.
Accurate information guaranteed. No brokerage fee.
  `;

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

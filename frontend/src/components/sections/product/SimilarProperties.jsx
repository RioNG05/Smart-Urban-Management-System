import { Link } from "react-router-dom";

const SimilarProperties = ({ properties = [] }) => {
  if (!properties.length) {
    return null;
  }

  return (
    <div className="similar-properties">
      <h2 className="section-title">Similar Listings</h2>

      <div className="similar-grid">
        {properties.map((item) => (
          <Link
            to={`/product/${item.id}`}
            key={item.id}
            className="similar-card"
          >
            <div className="card-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="card-content">
              <div className="card-price">{item.price}</div>
              <div className="card-title">{item.title}</div>
              <div className="card-meta">
                {item.area} m2 • {item.fullLocation}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;

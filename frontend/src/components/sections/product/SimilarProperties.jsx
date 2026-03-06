import { Link } from "react-router-dom";

const properties = [
  {
    id: 1,
    title: "2-Bedroom Apartment at Vinhomes Ocean Park – Great Price",
    price: "2.1 billion VND",
    area: "70 m²",
    location: "Gia Lam, Hanoi",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: 2,
    title: "Apartment for Sale with Lake View",
    price: "2.5 billion VND",
    area: "78 m²",
    location: "Gia Lam, Hanoi",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  },
  {
    id: 3,
    title: "Owner Selling Fully Furnished Apartment",
    price: "2.3 billion VND",
    area: "75 m²",
    location: "Gia Lam, Hanoi",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  },
];

const SimilarProperties = () => {
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
                {item.area} • {item.location}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;

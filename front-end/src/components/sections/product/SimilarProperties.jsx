import { Link } from "react-router-dom";

const properties = [
  {
    id: 1,
    title: "Căn hộ 2PN Vinhomes Ocean Park giá tốt",
    price: "2,1 tỷ",
    area: "70 m²",
    location: "Gia Lâm, Hà Nội",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: 2,
    title: "Bán căn hộ view hồ điều hòa",
    price: "2,5 tỷ",
    area: "78 m²",
    location: "Gia Lâm, Hà Nội",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  },
  {
    id: 3,
    title: "Chính chủ bán căn hộ full nội thất",
    price: "2,3 tỷ",
    area: "75 m²",
    location: "Gia Lâm, Hà Nội",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  },
];

const SimilarProperties = () => {
  return (
    <div className="similar-properties">
      <h2 className="section-title">Tin đăng tương tự</h2>

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

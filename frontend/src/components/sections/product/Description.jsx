import { useState } from "react";

const Description = ({ property }) => {
  const [expanded, setExpanded] = useState(false);

  const content = `
${property.overview}

- So phong: ${property.roomNumber}
- Tang: ${property.floorNumber}
- Dien tich: ${property.area} m2
- ${property.bedrooms} phong ngu va ${property.bathrooms} phong tam
- Huong can ho: ${property.direction}
- Noi that: ${property.furniture}

Day la thong tin chi tiet duoc ghep tu san pham rao ban va loai can ho de hien thi day du hon tren trang chi tiet.
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

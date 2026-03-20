import { useState } from "react";
import { getImageByTypeName } from "../../../services/propertyMapper";

const Gallery = ({ property }) => {
  const images = [
    property.image || getImageByTypeName(property.propertyType),
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
  ];
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="gallery-wrapper">
      <div className="gallery-grid">
        <div className="gallery-main">
          <img src={mainImage} alt={property.title} />
        </div>

        <div className="gallery-side">
          {images.slice(1, 5).map((img, index) => (
            <div
              key={index}
              className="gallery-thumb"
              onClick={() => setMainImage(img)}
            >
              <img src={img} alt={`${property.title} ${index + 1}`} />
              {index === 3 && <div className="overlay">Xem tat ca anh</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

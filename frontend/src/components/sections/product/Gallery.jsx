import { useEffect, useState } from "react";
import { getImageByTypeName } from "../../../services/propertyMapper";

const Gallery = ({ property }) => {
  const primaryImage =
    property.images?.find(Boolean) ||
    property.image ||
    getImageByTypeName(property.propertyType);
  const images = property.images?.filter(Boolean)?.length
    ? property.images.filter(Boolean)
    : [primaryImage];
  const [mainImage, setMainImage] = useState(primaryImage);

  useEffect(() => {
    setMainImage(primaryImage);
  }, [primaryImage, property.id]);

  return (
    <div className="gallery-wrapper">
      <div className="gallery-grid">
        <div className="gallery-main">
          <img src={mainImage} alt={property.title} />
        </div>

        {images.length > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default Gallery;

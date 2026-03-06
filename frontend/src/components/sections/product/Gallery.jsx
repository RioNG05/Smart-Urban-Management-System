import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
];

const Gallery = () => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="gallery-wrapper">
      <div className="gallery-grid">
        {/* MAIN IMAGE */}
        <div className="gallery-main">
          <img src={mainImage} alt="property" />
        </div>

        {/* RIGHT IMAGES */}
        <div className="gallery-side">
          {images.slice(1, 5).map((img, index) => (
            <div
              key={index}
              className="gallery-thumb"
              onClick={() => setMainImage(img)}
            >
              <img src={img} alt="thumb" />
              {index === 3 && <div className="overlay">Xem tất cả ảnh</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

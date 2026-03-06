import PropertyCard from "./PropertyCard";

const properties = Array.from({ length: 9 }).map((_, i) => ({
  id: i,
  title: "Vinhouse Ocean Park",
  location: "Gia Lâm, Hà Nội",
  bedrooms: 3,
  bathrooms: 2,
  area: 85,
  price: "3.2 B",
  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
}));

function PropertyGrid({ view }) {
  return (
    <div className={`property-grid ${view}`}>
      {properties.map((item) => (
        <PropertyCard key={item.id} property={item} view={view} />
      ))}
    </div>
  );
}

export default PropertyGrid;

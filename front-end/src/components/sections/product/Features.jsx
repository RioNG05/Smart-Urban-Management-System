const Features = () => {
  const features = [
    { label: "Loại hình", value: "Căn hộ chung cư" },
    { label: "Diện tích", value: "75 m²" },
    { label: "Số phòng ngủ", value: "2 phòng" },
    { label: "Số phòng tắm", value: "2 phòng" },
    { label: "Hướng nhà", value: "Đông Nam" },
    { label: "Ban công", value: "Tây Bắc" },
    { label: "Tình trạng nội thất", value: "Nội thất cơ bản" },
    { label: "Tầng", value: "Tầng trung" },
    { label: "Pháp lý", value: "Sổ đỏ" },
    { label: "Thời gian đăng", value: "03/03/2026" },
  ];

  return (
    <div className="product-features">
      <h2 className="section-title">Đặc điểm bất động sản</h2>

      <div className="features-grid">
        {features.map((item, index) => (
          <div key={index} className="feature-item">
            <span className="feature-label">{item.label}</span>
            <span className="feature-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;

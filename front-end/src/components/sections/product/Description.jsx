import { useState } from "react";

const Description = () => {
  const [expanded, setExpanded] = useState(false);

  const content = `
Cập nhật quỹ hàng giá tốt nhất tại Vinhomes Ocean Park Gia Lâm.

- Căn hộ diện tích 75m² thiết kế 2 phòng ngủ, 2 phòng tắm.
- Tầng trung, view nội khu thoáng mát.
- Nội thất cơ bản bàn giao chủ đầu tư.
- Pháp lý rõ ràng, sẵn sàng giao dịch.

Tiện ích nội khu đầy đủ: hồ điều hòa, công viên cây xanh, trung tâm thương mại, trường học quốc tế.

Hỗ trợ vay ngân hàng lên tới 70% giá trị căn hộ.
Cam kết thông tin chính xác, miễn phí môi giới.
  `;

  const shortText = content.slice(0, 350);

  return (
    <div className="product-description">
      <h2 className="section-title">Thông tin mô tả</h2>

      <p className="description-content">{expanded ? content : shortText}</p>

      {content.length > 350 && (
        <button className="toggle-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

export default Description;

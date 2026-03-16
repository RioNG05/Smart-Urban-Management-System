const ContactSidebar = () => {
  return (
    <div className="contact-sidebar">
      <div className="agent-info">
        <img
          src="https://i.pravatar.cc/100"
          alt="agent"
          className="agent-avatar"
        />

        <div className="agent-details">
          <div className="agent-name">Nguyễn Văn A</div>
          <div className="agent-status">● Đang hoạt động</div>
        </div>
      </div>

      <button className="btn-call">📞 Gọi điện</button>

      <button className="btn-message">💬 Nhắn tin</button>

      <div className="quick-contact">
        <input type="text" placeholder="Nhập số điện thoại của bạn" />
        <button className="btn-submit">Gửi liên hệ</button>
      </div>
    </div>
  );
};

export default ContactSidebar;

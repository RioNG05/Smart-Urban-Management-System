const ContactSidebar = ({ property }) => {
  return (
    <div className="contact-sidebar">
      <div className="agent-info">
        <img
          src="https://i.pravatar.cc/100"
          alt="agent"
          className="agent-avatar"
        />

        <div className="agent-details">
          <div className="agent-name">Sales Office</div>
          <div className="agent-status">Dang hoat dong</div>
        </div>
      </div>

      <button className="btn-call">Goi dien</button>

      <button className="btn-message">Nhan tin</button>

      <div className="quick-contact">
        <input
          type="text"
          placeholder={`Nhan tu van cho phong ${property.roomNumber}`}
        />
        <button className="btn-submit">Gui lien he</button>
      </div>
    </div>
  );
};

export default ContactSidebar;

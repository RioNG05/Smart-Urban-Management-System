const ContactSidebar = ({ property }) => {
  return (
    <div className="contact-sidebar">
      <div className="agent-details">
        <div className="agent-name">Product Consultation</div>
        <div className="agent-status">{property.title}</div>
        <div className="agent-status">Phong {property.roomNumber}</div>
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

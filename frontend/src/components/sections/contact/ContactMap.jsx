export default function ContactMap() {
  return (
    <div className="contact-map-card">
      <span className="contact-page-label">Location</span>
      <h2>Meet us at the VINAHOUSE experience center.</h2>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14898.887854619375!2d105.740889!3d21.003781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345383f98cba47%3A0x7d6c6e7592cf3cb4!2sVinhomes%20Smart%20City%20T%C3%A2y%20M%E1%BB%97!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
        className="contact-map-frame"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="VINAHOUSE Contact Location"
      ></iframe>
    </div>
  );
}

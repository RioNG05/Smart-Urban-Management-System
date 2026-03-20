import ContactMap from "./ContactMap";
import ContactSupport from "./ContactSupport";

export default function ContactDetails() {
  return (
    <section className="contact-page-details">
      <div className="contact-page-detailsGrid">
        <ContactSupport />
        <ContactMap />
      </div>
    </section>
  );
}

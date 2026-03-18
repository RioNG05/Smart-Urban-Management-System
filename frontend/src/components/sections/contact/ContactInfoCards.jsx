import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const contactCards = [
  {
    id: 1,
    icon: <FaPhoneAlt />,
    title: "Call Our Team",
    content: "+84 123 456 789",
    description: "Speak with our consultants for project details and viewing support.",
  },
  {
    id: 2,
    icon: <FaEnvelope />,
    title: "Email Us",
    content: "admin@citysmart.com",
    description: "Send us your questions and we will respond with tailored advice.",
  },
  {
    id: 3,
    icon: <FaMapMarkerAlt />,
    title: "Visit Showroom",
    content: "Vina City, Ha Noi, Viet Nam",
    description: "Experience the master plan, sample units, and on-site guidance.",
  },
];

export default function ContactInfoCards() {
  return (
    <section className="contact-page-overview">
      <div className="contact-page-grid">
        {contactCards.map((item) => (
          <article className="contact-info-card" key={item.id}>
            <div className="contact-info-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p className="contact-info-main">{item.content}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

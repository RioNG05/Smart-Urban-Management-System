import { FaClock, FaHeadset } from "react-icons/fa";

const supportHighlights = [
  {
    id: 1,
    icon: <FaClock />,
    title: "Working Hours",
    text: "Monday - Sunday, 8:00 AM - 8:00 PM",
  },
  {
    id: 2,
    icon: <FaHeadset />,
    title: "Resident Support",
    text: "Fast support for consultation, booking, and community questions.",
  },
];

export default function ContactSupport() {
  return (
    <div className="contact-support-panel">
      <span className="contact-page-label">Why Contact Us</span>
      <h2>Dedicated support for buyers, residents, and visitors.</h2>
      <p>
        Our team can help you book a visit, explain project amenities, guide
        you through available units, or answer resident service questions.
      </p>

      <div className="contact-support-list">
        {supportHighlights.map((item) => (
          <div className="contact-support-item" key={item.id}>
            <div className="contact-support-icon">{item.icon}</div>
            <div>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Elevating Urban Living</h1>
        <p>
          Discover world-class residential communities designed for modern
          lifestyles.
        </p>
        <button onClick={() => navigate("/market")}>Discover Projects</button>
      </div>
    </section>
  );
}

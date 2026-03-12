export default function AboutSection() {
  return (
    <section className="section about-section">
      <div className="about-container">
        {/* Left Side: Images */}
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000"
            alt="Modern Architecture"
            className="main-img"
          />
          <div className="experience-badge">
            <span className="years">15+</span>
            <span className="text">Years<br />Experience</span>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="about-content">
          <span className="section-label">Our Story</span>
          <h2>Elevating the Standard of Urban Living</h2>
          <p className="about-description">
            At VINAHOUSE, we go beyond simply building properties; we craft
            sustainable urban communities that redefine modern living architecture.
            Our commitment is deeply rooted in blending aesthetic luxury with
            innovative, eco-friendly infrastructure.
          </p>
          <p className="about-description">
            For over a decade, we have been shaping skylines and developing
            masterpieces across Vietnam, delivering excellence and uncompromising
            quality to thousands of families and businesses.
          </p>

          <div className="about-stats">
            <div className="stat-item">
              <h3>200+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat-item">
              <h3>15B+</h3>
              <p>Investment Capital</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Industry Awards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

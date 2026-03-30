import { Link } from "react-router-dom";

export default function ProjectsSection({ apartmentTypes = [] }) {
  return (
    <section className="section home-projects-section">
      <div className="home-section-heading">
        <span className="home-section-kicker">Featured Apartments</span>
        <h2>Discover 3 apartment types highlighted from the latest backend data</h2>
        <p>
          Browse apartment layouts with core details, overview content, and visuals tailored to
          each type.
        </p>
      </div>

      <div className="project-grid">
        {apartmentTypes.map((apartmentType) => (
          <article key={apartmentType.id} className="card project-card">
            <div className="project-card-image">
              <img src={apartmentType.image} alt={apartmentType.name} />
            </div>

            <div className="project-card-content">
              <div className="project-card-meta">
                <span>{apartmentType.bedrooms} bedrooms</span>
                <span>{apartmentType.bathrooms} bathrooms</span>
                {apartmentType.area ? <span>{apartmentType.area} m2</span> : null}
              </div>

              <h3>{apartmentType.name}</h3>
              <p>{apartmentType.description}</p>

              <Link to="/market" className="home-section-link">
                View apartments
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!apartmentTypes.length ? (
        <div className="home-empty-state">No apartment types are available yet.</div>
      ) : null}
    </section>
  );
}

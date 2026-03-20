function PropertyHero() {
  return (
    <section className="market-hero">
      <div className="market-hero__backdrop"></div>

      <div className="market-hero__content">
        <div className="market-banner">
          <div className="market-banner__copy">
            <span className="market-banner__label">Vinhomes Market</span>
            <h1>Premium apartment collection</h1>
            <p>Clean layout. Faster browsing. Focused on sale listings.</p>
          </div>

          <div className="market-banner__visual">
            <div className="market-banner__glass">
              <span>Featured</span>
              <strong>Modern urban living</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PropertyHero;

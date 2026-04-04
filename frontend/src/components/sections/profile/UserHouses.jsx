export default function UserHouses({ houses, loading = false }) {
  if (loading) {
    return (
      <div className="houses-card">
        <h2 className="house-title">My Houses</h2>
        <p className="progress-text">Loading billing progress...</p>
      </div>
    );
  }

  if (!houses.length) {
    return (
      <div className="houses-card">
        <h2 className="house-title">My Houses</h2>
        <p className="progress-text">No apartment billing data available yet.</p>
      </div>
    );
  }

  return (
    <div className="houses-card">
      <h2 className="house-title">My Houses</h2>

      <div className="house-list">
        {houses.map((house) => {
          return (
            <div key={house.id} className="house-item">
              <div className="house-header">
                <h4>{house.name}</h4>
                <span className="house-price">{house.totalCostLabel}</span>
              </div>

              <p className="house-deadline">Deadline: {house.deadline}</p>

              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${house.progress}%` }}
                ></div>
              </div>

              <p className="progress-text">Payment Progress: {house.progress}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

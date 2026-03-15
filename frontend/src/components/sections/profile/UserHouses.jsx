export default function UserHouses({ houses }) {
  return (
    <div className="houses-card">
      <h2 className="house-title">My Houses</h2>

      <div className="house-list">
        {houses.map((house) => {
          const progress = Math.floor(Math.random() * 100); // demo progress

          return (
            <div key={house.id} className="house-item">
              <div className="house-header">
                <h4>{house.name}</h4>
                <span className="house-price">
                  ${house.totalCost.toLocaleString()}
                </span>
              </div>

              <p className="house-deadline">Deadline: {house.deadline}</p>

              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="progress-text">Payment Progress: {progress}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

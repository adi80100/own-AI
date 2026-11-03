const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>

      <div className="stat-icon">
        <Icon size={25} />
      </div>
    </div>
  );
};

export default StatCard;
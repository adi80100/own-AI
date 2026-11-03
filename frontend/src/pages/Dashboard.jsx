import {
  Database,
  Layers,
  Search,
  Zap,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { useVectors } from "../context/VectorContext.jsx";

const Dashboard = () => {
        const { vectors, loading, error } = useVectors();

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your vector database.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Vectors"
           value={loading ? "..." : vectors.length}
          icon={Database}
        />

        <StatCard
          title="Algorithms"
          value="3"
          icon={Layers}
        />

        <StatCard
          title="Searches"
          value="0"
          icon={Search}
        />

        <StatCard
          title="Database Status"
            value={loading ? "Loading" : error ? "Offline" : "Active"}
          icon={Zap}
        />
      </div>
    </div>
  );
};

export default Dashboard;
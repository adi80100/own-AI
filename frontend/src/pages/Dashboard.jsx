
import {
  Database,
  Layers,
  Search,
  Zap,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { useVectors } from "../context/VectorContext.jsx";
import VectorCharts from "../components/VectorCharts.jsx";

const Dashboard = () => {
  const { vectors, loading, error } = useVectors();

  const dimensions =
    vectors.length > 0 ? vectors[0].values.length : 0;

  const categories = new Set(
    vectors.map(
      (vector) => vector.metadata?.category || "Uncategorized"
    )
  ).size;

  return (
    <div className="dashboard">

      {/* Dashboard Heading */}
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your vector database.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">

        <StatCard
          title="Total Vectors"
          value={loading ? "..." : vectors.length}
          icon={Database}
        />

        <StatCard
          title="Dimensions"
          value={loading ? "..." : dimensions}
          icon={Layers}
        />

        <StatCard
          title="Categories"
          value={loading ? "..." : categories}
          icon={Search}
        />

        <StatCard
          title="Database Status"
          value={loading ? "Loading" : error ? "Offline" : "Active"}
          icon={Zap}
        />

      </div>

      {/* Vector Analytics */}
      {!loading && !error && <VectorCharts />}

    </div>
  );
};

export default Dashboard;

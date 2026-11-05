
import { Database, Layers, Hash, Tags } from "lucide-react";
import { useVectors } from "../context/VectorContext.jsx";

const DatabaseStats = () => {
    const { vectors } = useVectors();

    const totalVectors = vectors.length;

    // Get vector dimensions
    const dimensions = vectors.length > 0
        ? vectors[0].values.length
        : 0;

    // Get unique categories
    const categories = new Set(
        vectors.map(vector =>
            vector.metadata?.category || "Uncategorized"
        )
    );

    const totalCategories = categories.size;

    // Calculate total vector values
    const totalValues = vectors.reduce(
        (total, vector) => total + vector.values.length,
        0
    );

    const stats = [
        {
            title: "Total Vectors",
            value: totalVectors,
            icon: Database
        },
        {
            title: "Dimensions",
            value: dimensions,
            icon: Layers
        },
        {
            title: "Total Values",
            value: totalValues,
            icon: Hash
        },
        {
            title: "Categories",
            value: totalCategories,
            icon: Tags
        }
    ];

    return (
        <div className="stats-grid">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div className="stat-card" key={stat.title}>
                        <div className="stat-icon">
                            <Icon size={22} />
                        </div>

                        <div>
                            <p>{stat.title}</p>
                            <h2>{stat.value}</h2>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DatabaseStats;

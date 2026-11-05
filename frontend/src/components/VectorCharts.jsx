
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import { useVectors } from "../context/VectorContext.jsx";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#9333ea", "#ef4444"];

const VectorCharts = () => {
    const { vectors } = useVectors();

    // Count vectors by category
    const categoryCount = vectors.reduce((acc, vector) => {
        const category = vector.metadata?.category || "Uncategorized";

        acc[category] = (acc[category] || 0) + 1;

        return acc;
    }, {});

    const chartData = Object.entries(categoryCount).map(
        ([category, count]) => ({
            category,
            count
        })
    );

    return (
        <div className="charts-grid">

            {/* Bar Chart */}
            <div className="chart-card">
                <h2>Vectors by Category</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="chart-card">
                <h2>Category Distribution</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="category"
                            outerRadius={100}
                            label
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={entry.category}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default VectorCharts;

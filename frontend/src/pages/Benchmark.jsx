
import { useState } from "react";
import { benchmarkVectors } from "../api/vectorApi.js";

const Benchmark = () => {
    const [query, setQuery] = useState("");
    const [k, setK] = useState(3);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBenchmark = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setResults([]);

            const rawValues = query.split(",").map(v => v.trim());

            if (rawValues.some(v => v === "")) {
                throw new Error("Enter comma-separated numbers correctly");
            }

            const queryVector = rawValues.map(Number);

            if (!queryVector.every(Number.isFinite)) {
                throw new Error("Enter valid numeric values");
            }

            const response = await benchmarkVectors({
                queryVector,
                k: Number(k)
            });

            // Adjust this path if your backend response differs.
            setResults(response.data.data);
        } catch (error) {
            setError(
                error.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <div className="page-heading">
                <div>
                    <h1>Algorithm Benchmark</h1>
                    <p>Compare vector search algorithm performance.</p>
                </div>
            </div>

            <div className="edit-vector-container">
                <form onSubmit={handleBenchmark}>
                    <label>Query Vector</label>

                    <input
                        type="text"
                        placeholder="0.2, 0.5, 0.8"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />

                    <label>Number of Results (K)</label>

                    <input
                        type="number"
                        min="1"
                        value={k}
                        onChange={(e) => setK(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Benchmarking..." : "Run Benchmark"}
                    </button>
                </form>
            </div>

            {error && <p className="error-message">{error}</p>}

            {results.length > 0 && (
                <div className="vector-table-container">
                    <h2>Benchmark Results</h2>

                    <table className="vector-table">
                        <thead>
                            <tr>
                                <th>Algorithm</th>
                                <th>Execution Time (ms)</th>
                                <th>Results Found</th>
                            </tr>
                        </thead>

                        <tbody>
                            {results.map((item, index) => (
                                <tr key={item.algorithm || index}>
                                    <td>{item.algorithm}</td>
                                    <td>
                                        {Number(item.executionTimeMs).toFixed(4)}
                                    </td>
                                    <td>{item.results?.length ?? 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Benchmark;

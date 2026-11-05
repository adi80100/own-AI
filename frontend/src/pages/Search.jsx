
import { useState } from "react";
import { searchVectors } from "../api/vectorApi.js";

const Search = () => {
    const [query, setQuery] = useState("");
    const [algorithm, setAlgorithm] = useState("bruteForce");
    const [k, setK] = useState(3);

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
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
                throw new Error("Query must contain valid numbers");
            }

            const response = await searchVectors({
                queryVector,
                k: Number(k),
                algorithm
            });

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
                    <h1>Vector Search</h1>
                    <p>Find similar vectors using search algorithms.</p>
                </div>
            </div>

            <div className="edit-vector-container">
                <form onSubmit={handleSearch}>
                    <label>Query Vector</label>

                    <input
                        type="text"
                        placeholder="0.2, 0.5, 0.8"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />

                    <label>Search Algorithm</label>

                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                    >
                        <option value="bruteForce">Brute Force</option>
                        <option value="kdTree">KD-Tree</option>
                        <option value="hnsw">HNSW</option>
                    </select>

                    <label>Number of Results (K)</label>

                    <input
                        type="number"
                        min="1"
                        value={k}
                        onChange={(e) => setK(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search Vectors"}
                    </button>
                </form>
            </div>

            {error && <p className="error-message">{error}</p>}

            {results.length > 0 && (
                <div className="vector-table-container">
                    <h2>Search Results</h2>

                    <table className="vector-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Vector Values</th>
                                <th>Text</th>
                                <th>Category</th>
                                <th>Distance</th>
                            </tr>
                        </thead>

                        <tbody>
                            {results.map((item, index) => (
                                <tr key={item.id ?? index}>
                                    <td>{item.id}</td>
                                    <td>{item.values?.join(", ")}</td>
                                    <td>{item.metadata?.text || "-"}</td>
                                    <td>{item.metadata?.category || "-"}</td>
                                    <td>
                                        {item.distance?.toFixed(4) ?? "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && results.length === 0 && !error && (
                <p>Enter a query vector to start searching.</p>
            )}
        </div>
    );
};

export default Search;

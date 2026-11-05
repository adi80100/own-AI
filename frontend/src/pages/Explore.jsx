
import { useState, useEffect } from "react";
import {
    getPaginatedVectors,
    searchMetadata
} from "../api/vectorApi.js";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const Explore = () => {
    const [vectors, setVectors] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [category, setCategory] = useState("");
    const [text, setText] = useState("");

    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPaginatedVectors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPaginatedVectors({
                page,
                limit,
                ...(category && { category })
            });

            const data = response.data?.data;

            const vectorList = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setVectors(vectorList);
            setTotalPages(data?.totalPages ?? response.data?.totalPages ?? 1);
        } catch (error) {
            setError(
                error.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleMetadataSearch = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await searchMetadata({
                ...(text && { text }),
                ...(category && { category })
            });

            // Metadata search returns matching vectors.
            setVectors(response.data.data);
            setTotalPages(1);
        } catch (error) {
            setError(
                error.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setText("");
        setCategory("");
        setPage(1);
    };

    useEffect(() => {
        fetchPaginatedVectors();
    }, [page, limit, category]);

    return (
        <div className="dashboard">
            <div className="page-heading">
                <div>
                    <h1>Explore Vectors</h1>
                    <p>Browse and filter your stored vectors.</p>
                </div>
            </div>

            <div className="edit-vector-container">
                <form onSubmit={handleMetadataSearch}>
                    <input
                        type="text"
                        placeholder="Search vector text..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Filter by category..."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <button type="submit">
                        Search Metadata
                    </button>

                    <button type="button" onClick={handleReset}>
                        Reset
                    </button>
                </form>

                <div>
                    <label>Vectors per page: </label>

                    <select
                        value={limit}
                        onChange={(e) => {
                            setPage(1);
                            setLimit(Number(e.target.value));
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Loading vectors...</p>
            ) : (
                <div className="vector-table-container">
                    <table className="vector-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Values</th>
                                <th>Text</th>
                                <th>Category</th>
                            </tr>
                        </thead>

                        <tbody>
                            {vectors.map((vector) => (
                                <tr key={vector.id}>
                                    <td>{vector.id}</td>
                                    <td>{vector.values.join(", ")}</td>
                                    <td>{vector.metadata?.text || "-"}</td>
                                    <td>{vector.metadata?.category || "-"}</td>
                                </tr>
                            ))}

                            {(!Array.isArray(vectors) ||  vectors.length === 0)&& (
                                <tr>
                                    <td colSpan="4">No vectors found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination">
                <button
                    disabled={page === 1 || loading || text.trim() !== ""}
                    onClick={() => setPage(page - 1)}
                >
                    <ArrowLeftIcon/>
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages || loading || text.trim() !== ""}
                    onClick={() => setPage(page + 1)}
                >
                    <ArrowRightIcon/>
                </button>
            </div>
        </div>
    );
};

export default Explore;

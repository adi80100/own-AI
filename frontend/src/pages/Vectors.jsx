import { useVectors } from "../context/VectorContext.jsx";
import { deleteVector } from "../api/vectorApi.js";
import { Trash2, RefreshCw } from "lucide-react";
import AddVectors from "../components/AddVectors.jsx";

const Vectors = () => {
    const { vectors, loading, error, fetchVectors } = useVectors();

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this vector?"
        );

        if (!confirmDelete) return;

        try {
            await deleteVector(id);

            await fetchVectors();

            alert("Vector deleted successfully!");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete vector"
            );
        }
    };

    if (loading) return <h2>Loading vectors...</h2>;

    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard">
            <AddVectors/>
            <div className="page-heading">
                <div>
                    <h1>Vector Management</h1>
                    <p>Manage your stored vectors.</p>
                </div>

                <button onClick={fetchVectors}>
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="vector-table-container">
                <table className="vector-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vector Values</th>
                            <th>Text</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {vectors.map((vector) => (
                            <tr key={vector.id}>
                                <td>{vector.id}</td>

                                <td>{vector.values.join(", ")}</td>

                                <td>{vector.metadata?.text}</td>

                                <td>{vector.metadata?.category}</td>

                                <td>
                                    <button
                                        title="Delete"
                                        onClick={() =>
                                            handleDelete(vector.id)
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {vectors.length === 0 && (
                            <tr>
                                <td colSpan="5">
                                    No vectors found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Vectors;
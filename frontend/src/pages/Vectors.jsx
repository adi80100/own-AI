
import { useState } from "react";
import { useVectors } from "../context/VectorContext.jsx";
import { deleteVector } from "../api/vectorApi.js";
import { Trash2, RefreshCw, Pencil } from "lucide-react";

import AddVectors from "../components/AddVectors.jsx";
import EditVector from "../components/EditVector.jsx";

const Vectors = () => {
    const { vectors, loading, error, fetchVectors } = useVectors();

    const [selectedVector, setSelectedVector] = useState(null);

    // Delete vector
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

    // Select vector for editing
    const handleEdit = (vector) => {
        setSelectedVector(vector);
    };

    if (loading) return <h2>Loading vectors...</h2>;

    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard">

            {/* Add Vector Form */}
            <AddVectors />

            {/* Page Heading */}
            <div className="page-heading">
                <div>
                    <h1>Vector Management</h1>
                    <p>Manage your stored vectors.</p>
                </div>

                <button className="refresh-btn" onClick={fetchVectors}>
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Edit Vector Form */}
            {selectedVector && (
                <EditVector
                    vector={selectedVector}
                    onClose={() => setSelectedVector(null)}
                />
            )}

            {/* Vector Table */}
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

                                <td>{vector.metadata?.text || "-"}</td>

                                <td>{vector.metadata?.category || "-"}</td>

                                <td className="tableData">
                                    {/* Edit Button */}
                                    <button
                                        className="refresh-btn"
                                        title="Edit"
                                        onClick={() => handleEdit(vector)}
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                    className="refresh-btn"
                                        title="Delete"
                                        onClick={() => handleDelete(vector.id)}
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

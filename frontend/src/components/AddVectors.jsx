import { useState } from "react";
import { insertVector } from "../api/vectorApi.js";
import { useVectors } from "../context/VectorContext.jsx";

const AddVectors = () => {
    const { fetchVectors } = useVectors();

    const [formData, setFormData] = useState({
        id: "",
        values: "",
        text: "",
        category: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const vectorData = {
                id: Number(formData.id),
                values: formData.values
                    .split(",")
                    .map((value) => Number(value.trim())),
                metadata: {
                    text: formData.text,
                    category: formData.category
                }
            };

            await insertVector(vectorData);

            await fetchVectors();

            alert("Vector inserted successfully!");

            setFormData({
                id: "",
                values: "",
                text: "",
                category: ""
            });

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to insert vector"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-vector-container">
            <h2>Add New Vector</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="number"
                    name="id"
                    placeholder="Vector ID"
                    value={formData.id}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="values"
                    placeholder="Values: 0.2, 0.5, 0.8"
                    value={formData.values}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="text"
                    placeholder="Description"
                    value={formData.text}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Vector"}
                </button>

            </form>
        </div>
    );
};

export default AddVectors;
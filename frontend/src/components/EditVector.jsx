import { useState, useEffect } from "react";
import { updateVector } from "../api/vectorApi.js";
import { useVectors } from "../context/VectorContext.jsx";

const EditVector = ({ vector, onClose }) => {
  const { fetchVectors } = useVectors();

  const [formData, setFormData] = useState({
    values: "",
    text: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);

  // Fill the form with existing vector data
  useEffect(() => {
    if (vector) {
      setFormData({
        values: vector.values.join(", "),
        text: vector.metadata?.text || "",
        category: vector.metadata?.category || ""
      });
    }
  }, [vector]);

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

      const rawValues = formData.values.split(",").map(v => v.trim());

      if (rawValues.some(v => v === "")) {
        throw new Error("Enter comma-separated numbers correctly");
      }

      const values = rawValues.map(Number);

      if (!values.every(Number.isFinite)) {
        throw new Error("Vector values must be valid numbers");
      }

      const updatedData = {
        values,
        metadata: {
          text: formData.text,
          category: formData.category
        }
      };

      await updateVector(vector.id, updatedData);
      await fetchVectors();

      alert("Vector updated successfully!");
      onClose();

    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!vector) return null;

  return (
    <div className="edit-vector-container">
      <h2>Edit Vector #{vector.id}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="values"
          value={formData.values}
          onChange={handleChange}
          placeholder="Values: 0.2, 0.5, 0.8"
          required
        />

        <input
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </button>

        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditVector;
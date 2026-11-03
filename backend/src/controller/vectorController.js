
import VectorDB from "../database/VectorDB.js";

const db = new VectorDB();

// POST: Insert vector
export const insertVector = (req, res) => {
    try {
        const { id, values, metadata } = req.body;

        if (id === undefined || id === null ||
            !Array.isArray(values) ||
            values.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ID and valid vector values are required"
            });
        }

        const vector = db.insert(id, values, metadata || {});

        return res.status(201).json({
            success: true,
            message: "Vector inserted successfully",
            data: vector
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET: Fetch all vectors
export const getAllVectors = (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            count: db.getSize(),
            data: db.getAll()
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET: Fetch vector by ID
export const getVectorById = (req, res) => {
    try {
        const { id } = req.params;

        const vector = db.getById(id);

        // IDs may be numbers or strings
        const result = vector || db.getById(
            Number.isNaN(Number(id)) ? id : Number(id)
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Vector not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// POST: Search similar vectors
export const searchVectors = (req, res) => {
    try {
        const {
            queryVector,
            algorithm = "bruteForce",
            k = 3
        } = req.body;

        if (!Array.isArray(queryVector)) {
            return res.status(400).json({
                success: false,
                message: "Query vector is required"
            });
        }

        const results = db.search(queryVector, {
            algorithm,
            k
        });

        return res.status(200).json({
            success: true,
            algorithm,
            count: results.length,
            data: results
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


export const insertMultipleVectors = (req, res) => {
    try {
        const { vectors } = req.body;

        if (!Array.isArray(vectors) || vectors.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of vectors"
            });
        }

        // Validate all vectors before inserting
        for (const vector of vectors) {
            if (
                vector.id === undefined ||
                vector.id === null ||
                !Array.isArray(vector.values) ||
                vector.values.length === 0 ||
                !vector.values.every(Number.isFinite)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vector data"
                });
            }
        }

        // Insert vectors
        const insertedVectors = [];

        for (const vector of vectors) {
            const inserted = db.insert(
                vector.id,
                vector.values,
                vector.metadata || {}
            );

            insertedVectors.push(inserted);
        }

        return res.status(201).json({
            success: true,
            message: "Vectors inserted successfully",
            count: insertedVectors.length,
            data: insertedVectors
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


export const deleteVector = (req, res) => {
    try {
        const { id } = req.params;

        const deletedVector = db.delete(
            Number.isNaN(Number(id)) ? id : Number(id)
        );

        return res.status(200).json({
            success: true,
            message: "Vector deleted successfully",
            data: deletedVector
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateVector = (req, res) => {
    try {
        const { id } = req.params;
        const { values, metadata } = req.body;

        if (!Array.isArray(values)) {
            return res.status(400).json({
                success: false,
                message: "Vector values are required"
            });
        }

        const vectorId = Number.isNaN(Number(id))
            ? id
            : Number(id);

        const updatedVector = db.update(
            vectorId,
            values,
            metadata
        );

        return res.status(200).json({
            success: true,
            message: "Vector updated successfully",
            data: updatedVector
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
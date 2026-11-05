

import KnowledgeDB from "../database/KnowledgeDB.js";
import { generateEmbedding } from "../services/embeddingService.js";


const knowledgeDB = new KnowledgeDB();

export const addKnowledge = async (req, res) => {
    try {
        const { title, category = "", content } = req.body;

        // Validate input
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        // Generate embedding using Ollama
        const embedding = await generateEmbedding(content);

        // Insert into knowledge database
        const knowledge = knowledgeDB.insert({
            title,
            category,
            content,
            embedding
        });

        return res.status(201).json({
            success: true,
            message: "Knowledge added successfully",
            data: {
                id: knowledge.id,
                title: knowledge.title,
                category: knowledge.category,
                content: knowledge.content,
                dimensions: knowledge.embedding.length,
                createdAt: knowledge.createdAt
            }
        });

    } catch (error) {
        console.error("Add Knowledge Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add knowledge"
        });
    }
};

 export const searchKnowledge = async (req, res) => {
    try {
        const { query, k = 3 } = req.body;

        if (!query || typeof query !== "string" || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        // Generate embedding for the user's question
        const queryEmbedding = await generateEmbedding(query);

        // Search knowledge database
        const results = knowledgeDB.search(
            queryEmbedding,
            Number(k)
        );

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error) {
        console.error("Knowledge Search Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




// Get all knowledge entries
export const getAllKnowledge = (req, res) => {
    try {
        const knowledge = knowledgeDB.getAll();

        return res.status(200).json({
            success: true,
            count: knowledge.length,
            data: knowledge.map(({ embedding, ...item }) => item)
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

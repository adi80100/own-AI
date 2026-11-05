
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(
    __dirname,
    "../../data/knowledge.json"
);

class KnowledgeDB {
    constructor() {
        this.knowledge = [];
        this.dimensions = null;

        this.loadFromDisk();
    }

    // Insert new knowledge
    insert({ title, category = "", content, embedding }) {

        if (!title || typeof title !== "string" || !title.trim()) {
            throw new Error("Title is required");
        }

        if (!content || typeof content !== "string" || !content.trim()) {
            throw new Error("Content is required");
        }

        if (!Array.isArray(embedding) || embedding.length === 0) {
            throw new Error("Invalid embedding");
        }

        if (!embedding.every(Number.isFinite)) {
            throw new Error("Embedding must contain finite numbers");
        }

        // Ensure all embeddings have matching dimensions
        if (
            this.dimensions !== null &&
            embedding.length !== this.dimensions
        ) {
            throw new Error("Embedding dimensions must match");
        }

        const knowledge = {
            id: randomUUID(),
            title: title.trim(),
            category: category.trim(),
            content: content.trim(),
            embedding,
            createdAt: new Date().toISOString()
        };

        if (this.dimensions === null) {
            this.dimensions = embedding.length;
        }

        this.knowledge.push(knowledge);

        try {
            this.saveToDisk();
        } catch (error) {
            this.knowledge.pop();

            if (this.knowledge.length === 0) {
                this.dimensions = null;
            }

            throw error;
        }

        return knowledge;
    }

    // Get all knowledge
    getAll() {
        return this.knowledge;
    }

    // Get knowledge by ID
    getById(id) {
        return this.knowledge.find(
            (item) => item.id === id
        );
    }

    // Get total knowledge entries
    getSize() {
        return this.knowledge.length;
    }

    // Save knowledge to JSON
    saveToDisk() {
        try {
            fs.mkdirSync(path.dirname(DATA_PATH), {
                recursive: true
            });

            const data = JSON.stringify(
                this.knowledge,
                null,
                2
            );

            fs.writeFileSync(DATA_PATH, data, {
                encoding: "utf-8"
            });

            console.log("Knowledge database saved successfully!");

        } catch (error) {
            console.error("Knowledge save failed:", error.message);
            throw error;
        }
    }

    // Load knowledge from JSON
    loadFromDisk() {
        try {
            if (!fs.existsSync(DATA_PATH)) {
                return;
            }

            const data = fs.readFileSync(DATA_PATH, "utf-8");
            const parsedData = JSON.parse(data);

            if (!Array.isArray(parsedData)) {
                throw new Error("Invalid knowledge database format");
            }

            const dimensions = parsedData[0]?.embedding?.length ?? null;

            const ids = new Set();

            for (const item of parsedData) {

                if (
                    !item.id ||
                    !item.title ||
                    !item.content ||
                    !Array.isArray(item.embedding) ||
                    item.embedding.length === 0 ||
                    !item.embedding.every(Number.isFinite)
                ) {
                    throw new Error("Invalid stored knowledge");
                }

                if (item.embedding.length !== dimensions) {
                    throw new Error("Stored embedding dimensions do not match");
                }

                if (ids.has(item.id)) {
                    throw new Error("Duplicate knowledge IDs found");
                }

                ids.add(item.id);
            }

            this.knowledge = parsedData;
            this.dimensions = dimensions;

            console.log(
                `Loaded ${this.knowledge.length} knowledge entries`
            );

        } catch (error) {
            throw new Error(
                `Failed to load knowledge: ${error.message}`
            );
        }
    }


    search(queryEmbedding, k = 3) {
    if (
        !Array.isArray(queryEmbedding) ||
        queryEmbedding.length === 0 ||
        !queryEmbedding.every(Number.isFinite)
    ) {
        throw new Error("Invalid query embedding");
    }

    if (
        this.dimensions !== null &&
        queryEmbedding.length !== this.dimensions
    ) {
        throw new Error("Embedding dimensions must match");
    }

    if (!Number.isInteger(k) || k < 1) {
        throw new Error("k must be a positive integer");
    }

    if (this.knowledge.length === 0) {
        return [];
    }

    // Calculate cosine similarity
    const cosineSimilarity = (a, b) => {
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            magnitudeA += a[i] ** 2;
            magnitudeB += b[i] ** 2;
        }

        const denominator = Math.sqrt(magnitudeA) *
                            Math.sqrt(magnitudeB);

        if (denominator === 0) return 0;

        return dotProduct / denominator;
    };

    const results = this.knowledge.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        content: item.content,
        score: cosineSimilarity(queryEmbedding, item.embedding)
    }));

    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
    }

}

export default KnowledgeDB;

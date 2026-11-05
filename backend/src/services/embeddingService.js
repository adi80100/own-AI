
const OLLAMA_URL =
    process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const EMBEDDING_MODEL =
    process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

export const generateEmbedding = async (text) => {
    try {
        if (!text || typeof text !== "string" || !text.trim()) {
            throw new Error("Text is required to generate embedding");
        }

        const response = await fetch(`${OLLAMA_URL}/api/embed`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: EMBEDDING_MODEL,
                input: text
            })
        });

        if (!response.ok) {
            throw new Error(
                `Ollama embedding failed: ${response.status}`
            );
        }

        const data = await response.json();

        const embedding = data.embeddings?.[0];

        if (!Array.isArray(embedding) || embedding.length === 0) {
            throw new Error("Invalid embedding returned by Ollama");
        }

        return embedding;

    } catch (error) {
        console.error("Embedding Error:", error.message);
        throw error;
    }
};

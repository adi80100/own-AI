import "dotenv/config";
import { generateEmbedding } from "./services/embeddingService.js";

const test = async () => {
    try {
        const text = "React is a JavaScript library.";

        const embedding = await generateEmbedding(text);

        console.log("Embedding generated successfully!");
        console.log("Dimensions:", embedding.length);
        console.log("First 5 values:", embedding.slice(0, 5));

    } catch (error) {
        console.error(error.message);
    }
};

test();
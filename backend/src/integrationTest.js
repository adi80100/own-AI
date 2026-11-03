
import VectorDB from "./database/VectorDB.js";

const db = new VectorDB();

// Insert sample vectors
db.insert(1, [0.2, 0.5, 0.8], {
    text: "JavaScript programming"
});

db.insert(2, [0.3, 0.6, 0.9], {
    text: "Java backend development"
});

db.insert(3, [0.9, 0.1, 0.2], {
    text: "Python machine learning"
});

db.insert(4, [0.4, 0.7, 0.8], {
    text: "Node.js backend development"
});

db.insert(5, [0.8, 0.2, 0.3], {
    text: "Machine learning with Python"
});

// Query vector
const query = [0.25, 0.55, 0.85];

// Brute Force
console.log("\n--- BRUTE FORCE ---");

const bruteResults = db.search(query, {
    algorithm: "bruteForce",
    k: 3
});

console.log(bruteResults);

// KD-Tree
console.log("\n--- KD TREE ---");

const kdResults = db.search(query, {
    algorithm: "kdTree",
    k: 3
});

console.log(kdResults);

// HNSW
console.log("\n--- HNSW ---");

const hnswResults = db.search(query, {
    algorithm: "hnsw",
    k: 3
});

console.log(hnswResults);

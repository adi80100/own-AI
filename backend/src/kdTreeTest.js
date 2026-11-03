
import VectorDB from "./database/VectorDB.js";
import KDTree from "./algorithms/KDTree.js";

const db = new VectorDB();

// Insert vectors
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

// Query vector
const queryVector = [0.25, 0.55, 0.85];

// Build KD-Tree
const kdTree = new KDTree(db.getAll());

// Search nearest vectors
const results = kdTree.search(queryVector, 2);

console.log("KD-Tree Search Results:");
console.log(results);

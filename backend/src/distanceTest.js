
import VectorDB from "./database/VectorDB.js";
import BruteForce from "./algorithms/BruteForce.js";

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

// Query vector
const queryVector = [0.25, 0.55, 0.85];

// Create search engine
const searchEngine = new BruteForce(db.getAll());

// Search nearest vectors
const results = searchEngine.search(queryVector, 2);

console.log("Search Results:");
console.log(results);

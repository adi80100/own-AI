
import VectorDB from "./database/VectorDB.js";
import HNSW from "./algorithms/HNSW.js";

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

db.insert(5, [0.8, 0.2, 0.3], {
    text: "Machine learning with Python"
});

// Create HNSW index
const hnsw = new HNSW(4, 20, 10, 3);

// Insert vectors into HNSW
for (const vector of db.getAll()) {
    hnsw.insert(vector);
}

// Search
const query = [0.25, 0.55, 0.85];

const results = hnsw.search(query, 2,20);

console.log("HNSW Search Results:");
console.log(results);

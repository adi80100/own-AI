
import VectorDB from "./database/VectorDB.js";

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

// Display database
console.log("All vectors:", db.getAll());

console.log("Database size:", db.getSize());

console.log("Vector with ID 2:", db.getById(2));

import Vector from "./Vector.js";
import BruteForce from "../algorithms/BruteForce.js";
import KDTree from "../algorithms/KDTree.js";
import HNSW from "../algorithms/HNSW.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateVector } from "../utils/validateVector.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, "../../data/vectors.json");
console.log("DATABASE PATH:", DATA_PATH);
class VectorDB {
  constructor() {
    this.vectors = [];
    this.dimensions = null;

    this.bruteForce = null;
    this.kdTree = null;
    this.hnsw = null;

    this.loadFromDisk();
  }

  insert(id, values, metadata = {}) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("Invalid vector");
    }

    if (!values.every(Number.isFinite)) {
      throw new Error("Vector must contain finite numbers");
    }

    if (this.vectors.some((vector) => vector.id === id)) {
      throw new Error("Vector ID already exists");
    }

    if (this.dimensions !== null && values.length !== this.dimensions) {
      throw new Error("Vector dimensions must match");
    }

    validateVector(values)

    const vector = new Vector(id, values, metadata);

    if (this.dimensions === null) {
      this.dimensions = values.length;
    }

    this.vectors.push(vector);

    try {
      this.saveToDisk();
    } catch (error) {
      this.vectors.pop();

      if (this.vectors.length === 0) {
        this.dimensions = null;
      }

      throw error;
    }

    // Invalidate indexes
    this.bruteForce = null;
    this.kdTree = null;
    this.hnsw = null;

    return vector;
  }

  getAll() {
    return this.vectors;
  }

  getById(id) {
    return this.vectors.find((vector) => vector.id === id);
  }

  getSize() {
    return this.vectors.length;
  }

  buildIndex(algorithm) {
    if (this.vectors.length === 0) {
      throw new Error("Database is empty");
    }

    switch (algorithm) {
      case "bruteForce":
        this.bruteForce = new BruteForce(this.vectors);
        break;

      case "kdTree":
        this.kdTree = new KDTree(this.vectors);
        break;

      case "hnsw":
        this.hnsw = new HNSW(4, 20, 10, 3);

        for (const vector of this.vectors) {
          this.hnsw.insert(vector);
        }
        break;

      default:
        throw new Error("Invalid search algorithm");
    }
  }

  search(queryVector, options = {}) {
    const { algorithm = "bruteForce", k = 3 } = options;

    if (
      !Array.isArray(queryVector) ||
      queryVector.length !== this.dimensions ||
      !queryVector.every(Number.isFinite)
    ) {
      throw new Error("Invalid query vector");
    }

    if (!Number.isInteger(k) || k < 1) {
      throw new Error("k must be a positive integer");
    }

    if (this.vectors.length === 0) {
      return [];
    }

    if (algorithm === "bruteForce") {
      const engine = this.bruteForce || new BruteForce(this.vectors);

      return engine.search(queryVector, k);
    }

    if (algorithm === "kdTree") {
      if (!this.kdTree) {
        this.buildIndex("kdTree");
      }

      return this.kdTree.search(queryVector, k);
    }

    if (algorithm === "hnsw") {
      if (!this.hnsw) {
        this.buildIndex("hnsw");
      }

      return this.hnsw.search(queryVector, k);
    }

    throw new Error("Invalid search algorithm");
  }

  saveToDisk() {
    try {
      console.log("Saving database...");
      console.log("Path:", DATA_PATH);
      console.log("Total vectors:", this.vectors.length);

      fs.mkdirSync(path.dirname(DATA_PATH), {
        recursive: true,
      });

      const data = JSON.stringify(this.vectors, null, 2);

      fs.writeFileSync(DATA_PATH, data, {
        encoding: "utf-8",
        flag: "w",
      });

      console.log("File exists:", fs.existsSync(DATA_PATH));
      console.log("File size:", fs.statSync(DATA_PATH).size);
      console.log("Saved successfully!");
    } catch (error) {
      console.error("File writing failed:", error);
      throw error;
    }
  }

  loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_PATH)) {
        return;
      }

      const data = fs.readFileSync(DATA_PATH, "utf-8");

      const parsedData = JSON.parse(data);

      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid vector database format");
      }

      const loadedVectors = parsedData.map((item) => {
        if (
          item.id === undefined ||
          item.id === null ||
          !Array.isArray(item.values) ||
          item.values.length === 0 ||
          !item.values.every(Number.isFinite)
        ) {
          throw new Error("Invalid stored vector");
        }

        return new Vector(item.id, item.values, item.metadata || {});
      });

      const dimensions = loadedVectors[0]?.values.length ?? null;

      if (loadedVectors.some((vector) => vector.values.length !== dimensions)) {
        throw new Error("Stored vector dimensions do not match");
      }

      const ids = new Set(loadedVectors.map((vector) => vector.id));

      if (ids.size !== loadedVectors.length) {
        throw new Error("Duplicate vector IDs found");
      }

      this.vectors = loadedVectors;
      this.dimensions = dimensions;

      console.log(`Loaded ${this.vectors.length} vectors from disk`);
    } catch (error) {
      throw new Error(`Failed to load vectors: ${error.message}`);
    }
  }

  delete(id) {
    const index = this.vectors.findIndex((vector) => vector.id === id);

    if (index === -1) {
      throw new Error("Vector not found");
    }

    // Remove vector from memory
    const [deletedVector] = this.vectors.splice(index, 1);

    const previousDimensions = this.dimensions;

    if (this.vectors.length === 0) {
      this.dimensions = null;
    }

    try {
      // Save updated database
      this.saveToDisk();
    } catch (error) {
      // Rollback if saving fails
      this.vectors.splice(index, 0, deletedVector);
      this.dimensions = previousDimensions;
      throw error;
    }

    // Invalidate indexes
    this.bruteForce = null;
    this.kdTree = null;
    this.hnsw = null;

    return deletedVector;
  }

  update(id, values, metadata) {
    // Find vector
    const index = this.vectors.findIndex((vector) => vector.id === id);

    if (index === -1) {
      throw new Error("Vector not found");
    }

    validateVector(values)

    // Validate vector values
    if (
      !Array.isArray(values) ||
      values.length === 0 ||
      !values.every(Number.isFinite)
    ) {
      throw new Error("Invalid vector values");
    }

    // Dimensions must remain consistent
    if (values.length !== this.dimensions) {
      throw new Error("Vector dimensions must match");
    }

    const oldVector = this.vectors[index];

    const updatedVector = new Vector(
      id,
      values,
      metadata ?? oldVector.metadata,
    );

    // Update in memory
    this.vectors[index] = updatedVector;

    try {
      // Persist updated database
      this.saveToDisk();
    } catch (error) {
      // Rollback if saving fails
      this.vectors[index] = oldVector;
      throw error;
    }

    // Invalidate old indexes
    this.bruteForce = null;
    this.kdTree = null;
    this.hnsw = null;

    return updatedVector;
  }

  getPaginated(options = {}) {
    const {
        page = 1,
        limit = 10,
        category
    } = options;

    // Validate pagination
    if (!Number.isInteger(page) || page < 1) {
        throw new Error("Page must be a positive integer");
    }

    if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("Limit must be a positive integer");
    }

    // Apply category filtering
    let filteredVectors = this.vectors;

    if (category) {
        filteredVectors = filteredVectors.filter(
            (vector) =>
                vector.metadata?.category?.toLowerCase() ===
                category.toLowerCase()
        );
    }

    // Calculate pagination
    const total = filteredVectors.length;
    const startIndex = (page - 1) * limit;

    const data = filteredVectors.slice(
        startIndex,
        startIndex + limit
    );

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

searchByMetadata(filters = {}) {
    const { text, category } = filters;

    let results = this.vectors;

    // Filter by text
    if (text) {
        results = results.filter((vector) =>
            vector.metadata?.text
                ?.toLowerCase()
                .includes(text.toLowerCase())
        );
    }

    // Filter by category
    if (category) {
        results = results.filter((vector) =>
            vector.metadata?.category
                ?.toLowerCase() === category.toLowerCase()
        );
    }

    return results;
}

benchmark(queryVector, k = 3) {
    if (this.vectors.length === 0) {
        throw new Error("Database is empty");
    }

    validateVector(queryVector);

    if (queryVector.length !== this.dimensions) {
        throw new Error("Vector dimensions must match");
    }

    if (!Number.isInteger(k) || k < 1) {
        throw new Error("k must be a positive integer");
    }

    const algorithms = [
        "bruteForce",
        "kdTree",
        "hnsw"
    ];

    // Build indexes before measuring search time
    for (const algorithm of algorithms) {
        this.buildIndex(algorithm);
    }

    const results = {};

    for (const algorithm of algorithms) {
        const startTime = performance.now();

        const searchResults = this.search(
            queryVector,
            { algorithm, k }
        );

        const endTime = performance.now();

        results[algorithm] = {
            executionTimeMs: Number(
                (endTime - startTime).toFixed(4)
            ),
            results: searchResults
        };
    }

    return results;
}
}

export default VectorDB;

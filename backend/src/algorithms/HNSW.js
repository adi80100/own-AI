
import { euclideanDistance } from "../utils/distance.js";

class HNSW {

    constructor(M = 4, efConstruction = 20, efSearch = 10, maxLevel = 3) {
        this.M = M;
        this.efConstruction = efConstruction;
        this.efSearch = efSearch;
        this.maxLevel = maxLevel;

        this.nodes = new Map();
        this.entryPoint = null;
        this.currentMaxLevel = -1;
    }

    randomLevel() {
        let level = 0;

        while (
            level < this.maxLevel &&
            Math.random() < 0.5
        ) {
            level++;
        }

        return level;
    }

    createNode(vector) {
        const level = this.randomLevel();

        return {
            vector,
            level,
            neighbors: Array.from(
                { length: level + 1 },
                () => new Set()
            )
        };
    }

    getDistance(vectorA, vectorB) {
        return euclideanDistance(
            vectorA.values,
            vectorB.values
        );
    }


    greedySearch(query, entryId, layer) {
        let currentId = entryId;
        let currentDistance = this.getDistance(
            query,
            this.nodes.get(currentId).vector
        );

        let changed = true;

        while (changed) {
            changed = false;

            const currentNode = this.nodes.get(currentId);

            for (const neighborId of currentNode.neighbors[layer]) {
                const neighbor = this.nodes.get(neighborId);

                const distance = this.getDistance(
                    query,
                    neighbor.vector
                );

                if (distance < currentDistance) {
                    currentId = neighborId;
                    currentDistance = distance;
                    changed = true;
                }
            }
        }

        return currentId;
    }

    searchLayer(query, entryIds, ef, layer) {
        const visited = new Set();
        const candidates = [];
        const results = [];

        for (const id of entryIds) {
            if (!this.nodes.has(id)) continue;

            const distance = this.getDistance(
                query,
                this.nodes.get(id).vector
            );

            const candidate = { id, distance };

            candidates.push(candidate);
            results.push(candidate);
            visited.add(id);
        }

        const sortByDistance = (a, b) =>
            a.distance - b.distance;

        while (candidates.length > 0) {
            candidates.sort(sortByDistance);

            const current = candidates.shift();

            results.sort(sortByDistance);

            if (
                results.length >= ef &&
                current.distance > results[results.length - 1].distance
            ) {
                break;
            }

            const node = this.nodes.get(current.id);

            for (const neighborId of node.neighbors[layer]) {
                if (visited.has(neighborId)) continue;

                visited.add(neighborId);

                const neighbor = this.nodes.get(neighborId);

                const distance = this.getDistance(
                    query,
                    neighbor.vector
                );

                const worstDistance =
                    results.length < ef
                        ? Infinity
                        : results[results.length - 1].distance;

                if (distance < worstDistance || results.length < ef) {
                    const candidate = {
                        id: neighborId,
                        distance
                    };

                    candidates.push(candidate);
                    results.push(candidate);

                    results.sort(sortByDistance);

                    if (results.length > ef) {
                        results.pop();
                    }
                }
            }
        }

        return results.sort(sortByDistance);
    }

    connectNodes(idA, idB, layer) {
        const nodeA = this.nodes.get(idA);
        const nodeB = this.nodes.get(idB);

        nodeA.neighbors[layer].add(idB);
        nodeB.neighbors[layer].add(idA);
    }

    pruneConnections(nodeId, layer) {
        const node = this.nodes.get(nodeId);
        const neighbors = [...node.neighbors[layer]];

        if (neighbors.length <= this.M) return;

        neighbors.sort((a, b) => {
            const distanceA = this.getDistance(
                node.vector,
                this.nodes.get(a).vector
            );

            const distanceB = this.getDistance(
                node.vector,
                this.nodes.get(b).vector
            );

            return distanceA - distanceB;
        });

        const keep = new Set(neighbors.slice(0, this.M));

        for (const neighborId of neighbors) {
            if (!keep.has(neighborId)) {
                node.neighbors[layer].delete(neighborId);
                this.nodes
                    .get(neighborId)
                    .neighbors[layer]
                    .delete(nodeId);
            }
        }
    }

    insert(vector) {
        if (!vector || !Array.isArray(vector.values)) {
            throw new Error("Invalid vector");
        }

        if (vector.values.length === 0 ||
            !vector.values.every(Number.isFinite)) {
            throw new Error("Invalid vector values");
        }

        if (this.nodes.has(vector.id)) {
            throw new Error("Vector ID already exists");
        }

        if (this.nodes.size > 0) {
            const existing = this.nodes.values().next().value;

            if (existing.vector.values.length !== vector.values.length) {
                throw new Error("Vector dimensions must match");
            }
        }

        const node = this.createNode(vector);
        const id = vector.id;

        this.nodes.set(id, node);

        // First node becomes the entry point
        if (this.entryPoint === null) {
            this.entryPoint = id;
            this.currentMaxLevel = node.level;
            return;
        }

        let currentEntry = this.entryPoint;

        // Search upper layers
        for (
            let layer = this.currentMaxLevel;
            layer > node.level;
            layer--
        ) {
            currentEntry = this.greedySearch(
                vector,
                currentEntry,
                layer
            );
        }

        // Insert into each layer supported by the new node
        for (
            let layer = Math.min(node.level, this.currentMaxLevel);
            layer >= 0;
            layer--
        ) {
            const candidates = this.searchLayer(
                vector,
                [currentEntry],
                this.efConstruction,
                layer
            );

            const selected = candidates.slice(0, this.M);

            for (const candidate of selected) {
                this.connectNodes(id, candidate.id, layer);
                this.pruneConnections(candidate.id, layer);
            }

            this.pruneConnections(id, layer);

            if (selected.length > 0) {
                currentEntry = selected[0].id;
            }
        }

        // Update entry point if the new node has a higher layer
        if (node.level > this.currentMaxLevel) {
            this.entryPoint = id;
            this.currentMaxLevel = node.level;
        }
    }

    search(queryVector, k = 3, ef = this.efSearch) {
        if (this.entryPoint === null) {
            return [];
        }

        if (
            !Array.isArray(queryVector) ||
            queryVector.length !==
                this.nodes.get(this.entryPoint).vector.values.length
        ) {
            throw new Error("Query dimensions must match");
        }

        if (!queryVector.every(Number.isFinite)) {
            throw new Error("Query must contain finite numbers");
        }

        if (!Number.isInteger(k) || k < 1) {
            throw new Error("k must be a positive integer");
        }

        if (!Number.isInteger(ef) || ef < 1) {
            throw new Error("ef must be a positive integer");
        }

        let currentEntry = this.entryPoint;

        // Navigate from top layer to layer 1
        for (
            let layer = this.currentMaxLevel;
            layer > 0;
            layer--
        ) {
            currentEntry = this.greedySearch(
                { values: queryVector },
                currentEntry,
                layer
            );
        }

        // Perform wider search at layer 0
        const candidates = this.searchLayer(
            { values: queryVector },
            [currentEntry],
            Math.max(k, ef),
            0
        );

        return candidates.slice(0, k).map(result => {
            const vector = this.nodes.get(result.id).vector;

            return {
                id: vector.id,
                distance: result.distance,
                metadata: vector.metadata
            };
        });
    }
}

export default HNSW;


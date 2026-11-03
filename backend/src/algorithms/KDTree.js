
import { euclideanDistance } from "../utils/distance.js";

class KDTree {
    constructor(vectors) {
        this.dimensions = vectors[0]?.values.length || 0;
        this.root = this.buildTree(vectors, 0);
    }

    buildTree(vectors, depth) {
        if (vectors.length === 0) {
            return null;
        }

        // Select dimension (axis)
        const axis = depth % this.dimensions;

        // Sort vectors using selected dimension
        const sorted = [...vectors].sort(
            (a, b) => a.values[axis] - b.values[axis]
        );

        // Find median
        const medianIndex = Math.floor(sorted.length / 2);

        const node = {
            vector: sorted[medianIndex],
            axis: axis,
            left: this.buildTree(
                sorted.slice(0, medianIndex),
                depth + 1
            ),
            right: this.buildTree(
                sorted.slice(medianIndex + 1),
                depth + 1
            )
        };

        return node;
    }


    search(queryVector, k = 1) {
        if (queryVector.length !== this.dimensions) {
            throw new Error("Query dimensions must match");
        }

        if (!Number.isInteger(k) || k < 1) {
            throw new Error("k must be a positive integer");
        }

        const best = [];

        const searchTree = (node) => {
            if (!node) return;

            const vector = node.vector;

            // Calculate distance from query to current node
            const distance = euclideanDistance(
                queryVector,
                vector.values
            );

            best.push({
                id: vector.id,
                distance,
                metadata: vector.metadata
            });

            // Keep only the nearest k results
            best.sort((a, b) => a.distance - b.distance);

            if (best.length > k) {
                best.pop();
            }

            // Determine which subtree to visit first
            const axis = node.axis;

            const difference =
                queryVector[axis] - vector.values[axis];

            const nearBranch =
                difference <= 0 ? node.left : node.right;

            const farBranch =
                difference <= 0 ? node.right : node.left;

            // Search the closer subtree first
            searchTree(nearBranch);

            // Visit the other subtree if it could contain
            // a closer vector
            const worstDistance =
                best.length < k
                    ? Infinity
                    : best[best.length - 1].distance;

            if (Math.abs(difference) <= worstDistance) {
                searchTree(farBranch);
            }
        };

        searchTree(this.root);

        return best;
    }
}

export default KDTree;


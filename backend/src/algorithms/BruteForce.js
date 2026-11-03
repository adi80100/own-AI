
import { euclideanDistance } from "../utils/distance.js";

class BruteForce {

    constructor(vectors) {
        this.vectors = vectors;
    }

    search(queryVector, k = 3) {

        const results = [];

        for (const vector of this.vectors) {

            const distance = euclideanDistance(
                queryVector,
                vector.values
            );

            results.push({
                id: vector.id,
                distance: distance,
                metadata: vector.metadata
            });
        }

        // Sort by smallest distance
        results.sort((a, b) => a.distance - b.distance);

        // Return top K results
        return results.slice(0, k);
    }
}

export default BruteForce;

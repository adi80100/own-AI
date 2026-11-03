
export const euclideanDistance = (vectorA, vectorB) => {

    if (vectorA.length !== vectorB.length) {
        throw new Error("Vector dimensions must match");
    }

    let sum = 0;

    for (let i = 0; i < vectorA.length; i++) {
        const difference = vectorA[i] - vectorB[i];

        sum += difference * difference;
    }

    return Math.sqrt(sum);
};



export const manhattanDistance = (vectorA, vectorB) => {
    if (vectorA.length !== vectorB.length) {
        throw new Error("Vector dimensions must match");
    }

    let sum = 0;

    for (let i = 0; i < vectorA.length; i++) {
        sum += Math.abs(vectorA[i] - vectorB[i]);
    }

    return sum;
};


export const cosineSimilarity = (vectorA, vectorB) => {
    if (vectorA.length !== vectorB.length) {
        throw new Error("Vector dimensions must match");
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];

        magnitudeA += vectorA[i] * vectorA[i];
        magnitudeB += vectorB[i] * vectorB[i];
    }

    const denominator = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);

    if (denominator === 0) {
        return 0;
    }

    return dotProduct / denominator;
};

export const validateVector = (values) => {
    if (!Array.isArray(values)) {
        throw new Error("Vector values must be an array");
    }

    if (values.length === 0) {
        throw new Error("Vector cannot be empty");
    }

    if (!values.every(Number.isFinite)) {
        throw new Error("Vector must contain only finite numbers");
    }

    return true;
};
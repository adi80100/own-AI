class Vector{
    constructor(id,values,metadata={}){

        if (!Array.isArray(values) || values.length === 0) {
            throw new Error("Vector must contain numeric values");
        }

        if (!values.every(value => Number.isFinite(value))) {
            throw new Error("Vector values must be finite numbers");
        }

        this.id = id;
        this.values = [...values];
        this.metadata = metadata;

    }
    getDimensions() {
        return this.values.length;
    }
}

export default Vector
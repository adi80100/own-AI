import api from "./axios.js"

const insertVector = (data)=>{return api.post("/vectors",data)};

const getAllVectors = ()=>{return api.get("/vectors")}

const getVectorById = (id)=>{return api.get(`/vectors/${id}`)}

const updateVector = (id,data)=>{return api.put(`/vectors/${id}`, data)}

 const deleteVector =  (id) => {
    return api.delete(`/vectors/${id}`);

};

// Search vectors
 const searchVectors =  (data) => {
    return api.post("/vectors/search", data);

};

// Benchmark algorithms
 const benchmarkVectors =  (benchmarkData) => {
    return api.post("/vectors/benchmark", benchmarkData);

};

// Paginated vectors
 const getPaginatedVectors = async (params) => {
    return  api.get("/vectors/paginate", { params });

};

// Metadata search
 const searchMetadata =  (params) => {
    return  api.get("/vectors/metadata/search", { params });

};

export {insertVector,getAllVectors,getPaginatedVectors,getVectorById,searchMetadata,benchmarkVectors,deleteVector,searchVectors,updateVector,}
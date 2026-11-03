import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { getAllVectors } from "../api/vectorApi.js";


export const VectorContext = createContext();

export const VectorProvider = ({children})=>{

    const [vectors,setVectors] = useState([])
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("")

    const fetchVectors = async()=>{
        try {
            setLoading(true)
            const res = await getAllVectors();
            setVectors(res.data.data)
            setError("");

        } catch (error) {
            console.log(error)
            setError(error.response?.data?.message||err.message)
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchVectors()
    },[])

    return (
        <VectorContext.Provider  value={{
                vectors,
                setVectors,
                loading,
                error,
                fetchVectors
            }}>
                {children}
        </VectorContext.Provider>
    )
}

export const useVectors = ()=>{
    return useContext(VectorContext)
}

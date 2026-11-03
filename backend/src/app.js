import express from "express"
import cors from "cors"
import vectorRoutes from "./routes/vectorRoutes.js"

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Your Own AI - Vector Database"
    });
});

app.use("/api/vectors", vectorRoutes);


export default app
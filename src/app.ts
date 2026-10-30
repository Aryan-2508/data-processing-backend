import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json())

app.get("/health", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Data Processing Backend is running successfully"
    })
})

export default app;
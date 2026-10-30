import express from "express";
import dotenv from "dotenv";
import analyticsRoutes from "./routes/analytics.routes";

dotenv.config();

const app = express();

app.use(express.json())

app.use("/api/analytics", analyticsRoutes);

app.get("/health", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Data Processing Backend is running successfully"
    })
})

export default app;
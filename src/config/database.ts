import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
    try {
        const mongoUri = process.env.MONGO_URI

        if(!mongoUri) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        
        await mongoose.connect(mongoUri);
        console.log("Connected to the database successfully");
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

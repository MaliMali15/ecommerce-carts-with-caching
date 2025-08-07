import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"
import { redis } from "../redis.js";

const connectDB = async () => {
    try {
        await redis.connect()
        const pong = await redis.ping()
        console.log(`Redis connected. ${pong}`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB connected. DB Host:${connectionInstance.connection.host}`);
        
        
        
    } catch (error) {
        console.log("Something went wrong while connecting either Database or Redis", error);
        process.exit(1)
    }
}

export default connectDB
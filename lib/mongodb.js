import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error("Please provide MONGO_URL in the environment variables");
}
let isConnected = false;
export default async function connectDB() {
  if (isConnected) return;
  try {
    console.log("connecting");
    await mongoose.connect(MONGO_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Connection error:", error);
  }
}

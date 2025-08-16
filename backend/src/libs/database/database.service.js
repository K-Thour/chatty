import mongoose from "mongoose";
import MongoDBConfig from "./database.config.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      MongoDBConfig.uri,
      MongoDBConfig.options,
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

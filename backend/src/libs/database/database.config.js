import dotenv from "dotenv";
dotenv.config();
const MongoDBConfig = {
  uri: process.env.MONGODB_URI || "",
  options: {},
};

export default MongoDBConfig;

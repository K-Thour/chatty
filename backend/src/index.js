import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import database from "./libs/database/index.js";
import { setupSwagger } from "./libs/swagger/swagger.js";
import cors from "cors";

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const baseUrl = "api/v1";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
app.use(`/${baseUrl}/auth`, routes.authRoutes);
app.use(`/${baseUrl}/user`, routes.userRoutes);

app.listen(port, async () => {
  await database.connectDB();
  console.log(`Server is running on port ${port}`);
});

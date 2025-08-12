import express from "express";
const router = express.Router();
import middlewares from "../middlewares/index.js";
import controllers from "../controllers/index.js";

router.put("/update", middlewares.protect, controllers.user.updateProfile);

router.get("/profile", middlewares.protect, controllers.user.getProfile);

export default router;

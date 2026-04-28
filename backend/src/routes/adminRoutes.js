import express from "express";
import { getDashboardStats } from "../controller/adminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Dashboard admin stats
router.get("/dashboard", adminMiddleware, getDashboardStats);

export default router;
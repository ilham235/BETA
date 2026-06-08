import express from "express";
import { changePassword, getUserInfo, getUsers, login } from "../controller/authController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, getUserInfo);
router.put("/password", authMiddleware, changePassword);
router.get("/users", adminMiddleware, getUsers);

export default router;
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import penugasanRoutes from "./routes/penugasanRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 DEBUG: Log SEMUA incoming requests
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("   Headers:", req.headers);
  console.log("   Body:", req.body);
  next();
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

console.log("Mounting routes...");
app.use("/api/auth", authRoutes);
console.log("Auth routes mounted");
app.use("/api/penugasan", penugasanRoutes);
console.log("Penugasan routes mounted");

// Debug middleware
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Not found", path: req.path });
});

export default app;
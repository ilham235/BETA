import dotenv from "dotenv";
import app from "./src/app.js";
import { ensureOBStatusColumn } from "./src/models/penugasanModel.js";
import { ensureUserStatusColumn } from "./src/models/userModel.js";

dotenv.config();

let server;

const startServer = async () => {
  try {
    await ensureUserStatusColumn();
    await ensureOBStatusColumn();
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...");
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
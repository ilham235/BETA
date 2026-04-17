import express from "express";
import {
    createNewLaporan,
    createNewOB,
    createNewPenugasan,
    createNewRuangan,
    deleteExistingPenugasan,
    getLaporan,
    getOB,
    getPenugasan,
    getPenugasanById,
    getRuangan,
    updateExistingPenugasan
} from "../controller/penugasanController.js";

const router = express.Router();

// 🔍 DEBUG: Log ke route penugasan
router.use((req, res, next) => {
  console.log(`🎯 Penugasan Route: ${req.method} ${req.path}`);
  next();
});

// PENUGASAN ROUTES
router.get("/", getPenugasan);
router.get("/:id", getPenugasanById);
router.post("/", createNewPenugasan);
router.put("/:id", updateExistingPenugasan);
router.delete("/:id", deleteExistingPenugasan);

// OB ROUTES
router.get("/ob/all", getOB);
router.post("/ob", createNewOB);

// RUANGAN ROUTES
router.get("/ruangan/all", getRuangan);
router.post("/ruangan", createNewRuangan);

// LAPORAN ROUTES
router.get("/laporan/all", getLaporan);
router.post("/laporan", createNewLaporan);

export default router;

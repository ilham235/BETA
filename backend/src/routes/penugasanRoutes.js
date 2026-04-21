import express from "express";
import {
    createNewLaporan,
    createNewOB,
    createNewPenugasan,
    createNewRuangan,
    deleteExistingPenugasan,
    getLaporan,
    getLaporanByPenugasan,
    getOB,
    getPenugasan,
    getPenugasanById,
    getRuangan,
    updateExistingPenugasan,
    updateLaporanController
} from "../controller/penugasanController.js";

const router = express.Router();

// 🔍 DEBUG: Log ke route penugasan
router.use((req, res, next) => {
  console.log(`🎯 Penugasan Route: ${req.method} ${req.path}`);
  next();
});

// LAPORAN ROUTES - HARUS DIDEFINISIKAN PERTAMA (MORE SPECIFIC ROUTES FIRST!)
console.log("🔧 Registering LAPORAN routes...");
router.get("/laporan/all", getLaporan);
console.log("✅ Registered: GET /laporan/all");
router.post("/laporan", createNewLaporan);
console.log("✅ Registered: POST /laporan");
router.put("/laporan/:id_laporan", updateLaporanController);
console.log("✅ Registered: PUT /laporan/:id_laporan");
router.get("/laporan/:id_penugasan", getLaporanByPenugasan);
console.log("✅ Registered: GET /laporan/:id_penugasan");

// OB ROUTES
router.get("/ob/all", getOB);
router.post("/ob", createNewOB);

// RUANGAN ROUTES
router.get("/ruangan/all", getRuangan);
router.post("/ruangan", createNewRuangan);

// PENUGASAN ROUTES - GENERIC ROUTES COME LAST
router.get("/", getPenugasan);
router.post("/", createNewPenugasan);
router.get("/:id", getPenugasanById);
router.put("/:id", updateExistingPenugasan);
router.delete("/:id", deleteExistingPenugasan);

export default router;

import express from "express";
import {
    createNewOB,
    createNewPenugasan,
    createNewRuangan,
    deleteExistingPenugasan,
    getOB,
    getPenugasan,
    getPenugasanById,
    getRuangan,
    updateExistingPenugasan
} from "../controller/penugasanController.js";

const router = express.Router();

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

export default router;

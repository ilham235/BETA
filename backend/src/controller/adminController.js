import { findAllArea } from "../models/areaModel.js";
import { findAllPenugasan } from "../models/penugasanModel.js";
import { getAllUsers } from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const users = await getAllUsers();
    const penugasan = await findAllPenugasan();
    const area = await findAllArea();

    res.json({
      success: true,
      data: {
        total_user: users.length,
        total_tugas: penugasan.length,
        total_area: area.length,
        recent_activities: []
      }
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
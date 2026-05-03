import {
    createShift,
    deleteShift,
    findAllShift,
    findShiftById,
    updateShift
} from "../models/shiftModel.js";

export const getAllShift = async (req, res) => {
  try {
    const shift = await findAllShift();
    res.json({
      success: true,
      data: shift
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getShiftById = async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await findShiftById(id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: shift
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createNewShift = async (req, res) => {
  try {
    const data = req.body;

    if (!data.nama_shift) {
      return res.status(400).json({
        success: false,
        message: "Nama shift harus diisi"
      });
    }

    if (!data.jam_mulai) {
      return res.status(400).json({
        success: false,
        message: "Jam mulai harus diisi"
      });
    }

    if (!data.jam_selesai) {
      return res.status(400).json({
        success: false,
        message: "Jam selesai harus diisi"
      });
    }

    const shift = await createShift(data);
    res.status(201).json({
      success: true,
      message: "Shift berhasil dibuat",
      data: shift
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateExistingShift = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingShift = await findShiftById(id);
    if (!existingShift) {
      return res.status(404).json({
        success: false,
        message: "Shift tidak ditemukan"
      });
    }

    const shift = await updateShift(id, data);
    res.json({
      success: true,
      message: "Shift berhasil diupdate",
      data: shift
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteExistingShift = async (req, res) => {
  try {
    const { id } = req.params;

    const existingShift = await findShiftById(id);
    if (!existingShift) {
      return res.status(404).json({
        success: false,
        message: "Shift tidak ditemukan"
      });
    }

    await deleteShift(id);
    res.json({
      success: true,
      message: "Shift berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Alias exports for consistency
export { createNewShift as createShift, deleteExistingShift as deleteShift, updateExistingShift as updateShift };
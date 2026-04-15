import {
    createOB,
    createPenugasan,
    createRuangan,
    deletePenugasan,
    findAllOB,
    findAllPenugasan,
    findAllRuangan,
    findPenugasanById,
    updatePenugasan
} from "../models/penugasanModel.js";

// PENUGASAN CRUD
export const getPenugasan = async (req, res) => {
  try {
    const penugasan = await findAllPenugasan();
    res.json({
      success: true,
      data: penugasan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getPenugasanById = async (req, res) => {
  try {
    const { id } = req.params;
    const penugasan = await findPenugasanById(id);

    if (!penugasan) {
      return res.status(404).json({
        success: false,
        message: "Penugasan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: penugasan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createNewPenugasan = async (req, res) => {
  try {
    const data = req.body;

    console.log("📥 Data diterima di backend:", data);

    // Validasi input - hanya id_user dan tanggal_awal yang wajib
    if (!data.id_user || !data.tanggal_awal) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap. Pastikan id_user dan tanggal_awal diisi"
      });
    }

    // Generate kode pengerjaan jika tidak ada
    if (!data.kode_pengerjaan) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      data.kode_pengerjaan = `P${year}${month}${day}-${Date.now().toString().slice(-4)}`;
    }

    const penugasan = await createPenugasan(data);
    res.status(201).json({
      success: true,
      message: "Penugasan berhasil dibuat",
      data: penugasan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateExistingPenugasan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const penugasan = await updatePenugasan(id, data);
    if (!penugasan) {
      return res.status(404).json({
        success: false,
        message: "Penugasan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Penugasan berhasil diupdate",
      data: penugasan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteExistingPenugasan = async (req, res) => {
  try {
    const { id } = req.params;
    const penugasan = await deletePenugasan(id);

    if (!penugasan) {
      return res.status(404).json({
        success: false,
        message: "Penugasan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Penugasan berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// OB (Orang Bersih) CRUD
export const getOB = async (req, res) => {
  try {
    const ob = await findAllOB();
    res.json({
      success: true,
      data: ob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createNewOB = async (req, res) => {
  try {
    const data = req.body;

    if (!data.nama_ob) {
      return res.status(400).json({
        success: false,
        message: "Nama OB harus diisi"
      });
    }

    const ob = await createOB(data);
    res.status(201).json({
      success: true,
      message: "OB berhasil dibuat",
      data: ob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// RUANGAN CRUD
export const getRuangan = async (req, res) => {
  try {
    const ruangan = await findAllRuangan();
    res.json({
      success: true,
      data: ruangan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createNewRuangan = async (req, res) => {
  try {
    const data = req.body;

    if (!data.nama_ruangan) {
      return res.status(400).json({
        success: false,
        message: "Nama ruangan harus diisi"
      });
    }

    const ruangan = await createRuangan(data);
    res.status(201).json({
      success: true,
      message: "Ruangan berhasil dibuat",
      data: ruangan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

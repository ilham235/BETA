import {
    createLaporan,
    createOB,
    createPenugasan,
    createRuangan,
    deletePenugasan,
    findAllLaporan,
    findAllOB,
    findAllPenugasan,
    findAllRuangan,
    findLaporanByPenugasan,
    findPenugasanById,
    updateLaporan,
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

// LAPORAN CRUD
export const getLaporan = async (req, res) => {
  try {
    const tanggal = req.query.tanggal;
    const laporan = await findAllLaporan(tanggal);
    res.json({
      success: true,
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getLaporanByPenugasan = async (req, res) => {
  try {
    const { id_penugasan } = req.params;
    const tanggal = req.query.tanggal;
    const laporan = await findLaporanByPenugasan(id_penugasan, tanggal);
    
    if (!laporan) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan untuk penugasan ini"
      });
    }

    res.json({
      success: true,
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createNewLaporan = async (req, res) => {
  try {
    const data = req.body;

    console.log("📥 Body yang diterima di controller:", JSON.stringify(data, null, 2));

    // Validasi minimal: hanya id_penugasan, tanggal, dan status_kehadiran yang wajib
    if (!data.id_penugasan || !data.tanggal || !data.status_kehadiran) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap. Pastikan id_penugasan, tanggal, dan status_kehadiran diisi"
      });
    }

    // Log semua field untuk debugging
    console.log("✅ Field yang akan disimpan:");
    console.log("  - id_penugasan:", data.id_penugasan, "type:", typeof data.id_penugasan);
    console.log("  - tanggal:", data.tanggal, "type:", typeof data.tanggal);
    console.log("  - shift:", data.shift, "type:", typeof data.shift);
    console.log("  - status_kehadiran:", data.status_kehadiran, "type:", typeof data.status_kehadiran);
    console.log("  - person_assigned:", data.person_assigned, "type:", typeof data.person_assigned);
    console.log("  - nilai:", data.nilai, "type:", typeof data.nilai);
    console.log("  - id_user_pengawas:", data.id_user_pengawas, "type:", typeof data.id_user_pengawas);
    console.log("  - foto_path length:", data.foto_path ? data.foto_path.length : "null");

    const laporan = await createLaporan(data);
    res.status(201).json({
      success: true,
      message: "Laporan berhasil dibuat",
      data: laporan
    });
  } catch (error) {
    console.error("❌ Error creating laporan:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error detail:", error.detail);
    console.error("Full error:", error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      detail: error.detail || "Unknown error"
    });
  }
};

// Update Laporan
export const updateLaporanController = async (req, res) => {
  try {
    const { id_laporan } = req.params;
    const data = req.body;

    console.log("� ========== UPDATE LAPORAN ==========");
    console.log("🔄 Request params:", req.params);
    console.log("🔄 ID Laporan dari params:", id_laporan);
    console.log("🔄 Request body:", JSON.stringify(data, null, 2));
    console.log("🔄 Full URL:", req.originalUrl);
    console.log("🔄 Method:", req.method);
    console.log("🔄 =====================================");

    if (!id_laporan || id_laporan === 'undefined') {
      return res.status(400).json({
        success: false,
        message: "ID Laporan tidak valid atau undefined",
        receivedId: id_laporan
      });
    }

    const laporan = await updateLaporan(id_laporan, data);
    res.json({
      success: true,
      message: "Laporan berhasil diupdate",
      data: laporan
    });
  } catch (error) {
    console.error("❌ Error updating laporan:");
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

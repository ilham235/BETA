import pool from "../config/db.js";

export const findAllPenugasan = async () => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        u.username,
        u.nama_lengkap,
        o.nama_ob,
        o.kontak,
        r.nama_ruangan,
        r.lantai,
        r.detail_pekerjaan
      FROM penugasan p
      LEFT JOIN users u ON p.id_user = u.id_user
      LEFT JOIN ob o ON p.id_ob = o.id_ob
      LEFT JOIN ruangan r ON p.id_ruangan = r.id_ruangan
      ORDER BY p.tanggal_awal DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Error finding all penugasan:", error);
    throw error;
  }
};

export const findPenugasanById = async (id) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        u.username,
        u.nama_lengkap,
        o.nama_ob,
        o.kontak,
        r.nama_ruangan,
        r.lantai,
        r.detail_pekerjaan
      FROM penugasan p
      LEFT JOIN users u ON p.id_user = u.id_user
      LEFT JOIN ob o ON p.id_ob = o.id_ob
      LEFT JOIN ruangan r ON p.id_ruangan = r.id_ruangan
      WHERE p.id_penugasan = $1
    `, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding penugasan by id:", error);
    throw error;
  }
};

export const createPenugasan = async (data) => {
  try {
    console.log("📊 Insert Query - Data yang akan disimpan:", {
      id_user: data.id_user,
      id_ob: data.id_ob,
      id_ruangan: data.id_ruangan,
      tanggal_awal: data.tanggal_awal,
      tanggal_akhir: data.tanggal_akhir,
      kode_pengerjaan: data.kode_pengerjaan,
      shift: data.shift,
      deskripsi: data.deskripsi,
      rolling_mingguan: data.rolling_mingguan
    });

    const result = await pool.query(`
      INSERT INTO penugasan (
        id_user, id_ob, id_ruangan, tanggal_awal, tanggal_akhir,
        kode_pengerjaan, shift, deskripsi, rolling_mingguan
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.id_user,
      data.id_ob,
      data.id_ruangan,
      data.tanggal_awal,
      data.tanggal_akhir,
      data.kode_pengerjaan,
      data.shift || null,
      data.deskripsi || null,
      data.rolling_mingguan || false
    ]);
    console.log("✅ Data berhasil disimpan:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating penugasan:", error);
    throw error;
  }
};

export const updatePenugasan = async (id, data) => {
  try {
    console.log("📊 Update Query - ID:", id, "Data yang akan diupdate:", {
      id_user: data.id_user,
      id_ob: data.id_ob,
      id_ruangan: data.id_ruangan,
      tanggal_awal: data.tanggal_awal,
      tanggal_akhir: data.tanggal_akhir,
      kode_pengerjaan: data.kode_pengerjaan,
      shift: data.shift,
      deskripsi: data.deskripsi,
      rolling_mingguan: data.rolling_mingguan
    });

    const result = await pool.query(`
      UPDATE penugasan SET
        id_user = $1,
        id_ob = $2,
        id_ruangan = $3,
        tanggal_awal = $4,
        tanggal_akhir = $5,
        kode_pengerjaan = $6,
        shift = $7,
        deskripsi = $8,
        rolling_mingguan = $9
      WHERE id_penugasan = $10
      RETURNING *
    `, [
      data.id_user,
      data.id_ob,
      data.id_ruangan,
      data.tanggal_awal,
      data.tanggal_akhir,
      data.kode_pengerjaan,
      data.shift || null,
      data.deskripsi || null,
      data.rolling_mingguan || false,
      id
    ]);
    console.log("✅ Data berhasil diupdate:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating penugasan:", error);
    throw error;
  }
};

export const deletePenugasan = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM penugasan WHERE id_penugasan = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting penugasan:", error);
    throw error;
  }
};

// OB (Orang Bersih) functions
export const findAllOB = async () => {
  try {
    const result = await pool.query("SELECT * FROM ob ORDER BY nama_ob");
    return result.rows;
  } catch (error) {
    console.error("Error finding all OB:", error);
    throw error;
  }
};

export const createOB = async (data) => {
  try {
    const result = await pool.query(
      "INSERT INTO ob (nama_ob, kontak) VALUES ($1, $2) RETURNING *",
      [data.nama_ob, data.kontak]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating OB:", error);
    throw error;
  }
};

// Ruangan functions
export const findAllRuangan = async () => {
  try {
    const result = await pool.query("SELECT * FROM ruangan ORDER BY nama_ruangan");
    return result.rows;
  } catch (error) {
    console.error("Error finding all ruangan:", error);
    throw error;
  }
};

export const createRuangan = async (data) => {
  try {
    const result = await pool.query(
      "INSERT INTO ruangan (nama_ruangan, lantai, detail_pekerjaan) VALUES ($1, $2, $3) RETURNING *",
      [data.nama_ruangan, data.lantai, data.detail_pekerjaan]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating ruangan:", error);
    throw error;
  }
};

// LAPORAN functions
export const findAllLaporan = async () => {
  try {
    const result = await pool.query(`
      SELECT
        l.*,
        p.kode_pengerjaan,
        p.deskripsi as deskripsi_penugasan,
        o.nama_ob,
        r.nama_ruangan,
        r.lantai
      FROM laporan l
      LEFT JOIN penugasan p ON l.id_penugasan = p.id_penugasan
      LEFT JOIN ob o ON p.id_ob = o.id_ob
      LEFT JOIN ruangan r ON p.id_ruangan = r.id_ruangan
      ORDER BY l.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Error finding all laporan:", error);
    throw error;
  }
};

export const findLaporanByPenugasan = async (id_penugasan) => {
  try {
    const result = await pool.query(`
      SELECT
        l.*,
        p.kode_pengerjaan,
        p.deskripsi as deskripsi_penugasan,
        o.nama_ob,
        r.nama_ruangan,
        r.lantai
      FROM laporan l
      LEFT JOIN penugasan p ON l.id_penugasan = p.id_penugasan
      LEFT JOIN ob o ON p.id_ob = o.id_ob
      LEFT JOIN ruangan r ON p.id_ruangan = r.id_ruangan
      WHERE l.id_penugasan = $1
      ORDER BY l.created_at DESC
      LIMIT 1
    `, [id_penugasan]);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding laporan by penugasan:", error);
    throw error;
  }
};

export const createLaporan = async (data) => {
  try {
    console.log("📊 createLaporan - Data yang akan disimpan:", {
      id_penugasan: data.id_penugasan,
      id_user_pengawas: data.id_user_pengawas,
      tanggal: data.tanggal,
      shift: data.shift,
      status_kehadiran: data.status_kehadiran,
      person_assigned: data.person_assigned,
      nilai: data.nilai,
      catatan: data.catatan,
      foto_path_exists: !!data.foto_path
    });

    const result = await pool.query(`
      INSERT INTO laporan (
        id_penugasan, id_user_pengawas, tanggal, shift,
        status_kehadiran, person_assigned, nilai, catatan, foto_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      data.id_penugasan,
      data.id_user_pengawas || null,
      data.tanggal,
      data.shift || null,
      data.status_kehadiran,
      data.person_assigned,
      data.nilai || null,
      data.catatan || null,
      data.foto_path || null
    ]);
    
    console.log("✅ Laporan berhasil disimpan ke DB:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error creating laporan:", error);
    throw error;
  }
};

// Update Laporan
export const updateLaporan = async (id_laporan, data) => {
  try {
    console.log("📊 updateLaporan - Data yang akan diupdate:", {
      id_laporan,
      id_user_pengawas: data.id_user_pengawas,
      shift: data.shift,
      status_kehadiran: data.status_kehadiran,
      person_assigned: data.person_assigned,
      nilai: data.nilai,
      catatan: data.catatan,
      foto_path_exists: !!data.foto_path
    });

    // Build dynamic UPDATE query berdasarkan field yang ada
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (data.shift !== undefined) {
      updateFields.push(`shift = $${paramCount++}`);
      updateValues.push(data.shift || null);
    }
    if (data.status_kehadiran !== undefined) {
      updateFields.push(`status_kehadiran = $${paramCount++}`);
      updateValues.push(data.status_kehadiran);
    }
    if (data.person_assigned !== undefined) {
      updateFields.push(`person_assigned = $${paramCount++}`);
      updateValues.push(data.person_assigned);
    }
    if (data.nilai !== undefined) {
      updateFields.push(`nilai = $${paramCount++}`);
      updateValues.push(data.nilai || null);
    }
    if (data.catatan !== undefined) {
      updateFields.push(`catatan = $${paramCount++}`);
      updateValues.push(data.catatan || null);
    }
    if (data.id_user_pengawas !== undefined) {
      updateFields.push(`id_user_pengawas = $${paramCount++}`);
      updateValues.push(data.id_user_pengawas || null);
    }
    if (data.foto_path !== undefined) {
      updateFields.push(`foto_path = $${paramCount++}`);
      updateValues.push(data.foto_path || null);
    }

    // Add id_laporan sebagai parameter terakhir
    updateValues.push(id_laporan);

    if (updateFields.length === 0) {
      throw new Error("Tidak ada field untuk diupdate");
    }

    const query = `
      UPDATE laporan 
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id_laporan = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, updateValues);
    
    if (result.rows.length === 0) {
      throw new Error(`Laporan dengan ID ${id_laporan} tidak ditemukan`);
    }

    console.log("✅ Laporan berhasil diupdate:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error updating laporan:", error);
    throw error;
  }
};

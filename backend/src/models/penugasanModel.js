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
    const result = await pool.query(`
      INSERT INTO penugasan (
        id_user, id_ob, id_ruangan, tanggal_awal, tanggal_akhir,
        kode_pengerjaan, rolling_mingguan
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      data.id_user,
      data.id_ob,
      data.id_ruangan,
      data.tanggal_awal,
      data.tanggal_akhir,
      data.kode_pengerjaan,
      data.rolling_mingguan || false
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating penugasan:", error);
    throw error;
  }
};

export const updatePenugasan = async (id, data) => {
  try {
    const result = await pool.query(`
      UPDATE penugasan SET
        id_user = $1,
        id_ob = $2,
        id_ruangan = $3,
        tanggal_awal = $4,
        tanggal_akhir = $5,
        kode_pengerjaan = $6,
        rolling_mingguan = $7
      WHERE id_penugasan = $8
      RETURNING *
    `, [
      data.id_user,
      data.id_ob,
      data.id_ruangan,
      data.tanggal_awal,
      data.tanggal_akhir,
      data.kode_pengerjaan,
      data.rolling_mingguan || false,
      id
    ]);
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

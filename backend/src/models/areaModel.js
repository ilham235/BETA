import pool from "../config/db.js";

export const findAllArea = async () => {
  try {
    const result = await pool.query("SELECT * FROM area ORDER BY nama");
    return result.rows;
  } catch (error) {
    console.error("Error finding all area:", error);
    throw error;
  }
};

export const findAreaById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM area WHERE id_area = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding area by id:", error);
    throw error;
  }
};

export const createArea = async (data) => {
  try {
    const result = await pool.query(
      "INSERT INTO area (nama, deskripsi, status) VALUES ($1, $2, $3) RETURNING *",
      [data.nama, data.deskripsi, data.status || "aktif"]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating area:", error);
    throw error;
  }
};

export const updateArea = async (id, data) => {
  try {
    const result = await pool.query(
      "UPDATE area SET nama = $1, deskripsi = $2, status = $3 WHERE id_area = $4 RETURNING *",
      [data.nama, data.deskripsi, data.status, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating area:", error);
    throw error;
  }
};

export const deleteArea = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM area WHERE id_area = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting area:", error);
    throw error;
  }
};
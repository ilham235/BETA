import pool from "../config/db.js";

export const findUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE TRIM(username) = $1",
      [username]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id_user = $1",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user by id:", error);
    throw error;
  }
};

export const createUser = async (username, password, role = "user") => {
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id_user, username, role",
      [username, password, role]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const result = await pool.query(
      "SELECT id_user, username, role FROM users"
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};
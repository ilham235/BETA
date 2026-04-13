import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserById, findUserByUsername, getAllUsers } from "../models/userModel.js";

// LOGIN
export const login = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Username dan password harus diisi" 
      });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User tidak ditemukan" 
      });
    }

    // Bandingkan password dengan hash yang disimpan di database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ 
        success: false,
        message: "Password salah" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id_user, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id_user,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// GET USER INFO (Protected route)
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User tidak ditemukan" 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id_user,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// GET ALL USERS (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import readline from "readline";
import pool from "../config/db.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function addUser() {
  try {
    console.log("\n========== ADD USER MANUAL ==========\n");

    let username = await question("Username: ");
    const password = await question("Password: ");
    const nama_lengkap = await question("Nama Lengkap (opsional): ");
    const role = await question('Role (user/admin) [default: user]: ') || "user";

    username = username?.trim();

    // Validasi
    if (!username || !password) {
      console.log("❌ Username dan password harus diisi!");
      rl.close();
      process.exit(1);
    }

    if (!["user", "admin"].includes(role)) {
      console.log("❌ Role harus 'user' atau 'admin'!");
      rl.close();
      process.exit(1);
    }

    // Cek apakah username sudah ada
    const existing = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existing.rows.length > 0) {
      console.log("❌ Username sudah terdaftar!");
      rl.close();
      process.exit(1);
    }

    // Hash password dengan bcrypt (salt rounds: 10)
    console.log("\n⏳ Proses hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const result = await pool.query(
      "INSERT INTO users (username, password, nama_lengkap, role) VALUES ($1, $2, $3, $4) RETURNING id_user, username, nama_lengkap, role",
      [username, hashedPassword, nama_lengkap || null, role]
    );

    console.log("\n✅ User berhasil ditambahkan!");
    console.log("User Details:");
    console.log(JSON.stringify(result.rows[0], null, 2));
    console.log("\n=====================================\n");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    rl.close();
    process.exit(1);
  }
}

addUser();

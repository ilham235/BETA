# ⚡ Quick Start - Sistem Login JWT

Panduan cepat untuk setup dan menjalankan sistem login JWT.

## 📌 Prerequisites

- Node.js v16+
- PostgreSQL v12+
- npm atau yarn

---

## 1️⃣ Setup Database (5 menit)

### Windows (Windows Terminal)
```bash
psql -U postgres
```

### macOS/Linux (Terminal)
```bash
sudo -u postgres psql
```

### Di PostgreSQL Interactive Shell, jalankan:
```sql
CREATE DATABASE beta_db;
\c beta_db
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_username ON users(username);
```

**Keluar dari PostgreSQL:** `\q`

---

## 2️⃣ Setup Backend (5 menit)

### Terminal 1 - Backend

```bash
cd c:\Project\BETA\backend

# Copy env template
copy .env.example .env

# Edit .env dengan text editor Anda
# Penting: Update DB_PASSWORD dan JWT_SECRET
```

**File `.env`:**
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=beta_db
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:5173
```

```bash
# Install dependencies
npm install

# Jalankan server
npm start
```

✅ **Backend ready!** Server running at `http://localhost:5000`

---

## 3️⃣ Tambah User (2 menit)

### Terminal 2 - Add User

```bash
cd c:\Project\BETA\backend

# Jalankan script tambah user
node src/utils/addUser.js
```

**Input saat diminta:**
```
Username: admin
Password: admin123
Role (user/admin) [default: user]: admin
```

✅ **User berhasil ditambahkan!**

---

## 4️⃣ Setup Frontend (3 menit)

### Terminal 3 - Frontend

```bash
cd c:\Project\BETA\frontend

# Copy env template (opsional)
copy .env.example .env.local

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

✅ **Frontend ready!** Running at `http://localhost:5173`

---

## 5️⃣ Test Login ✅

### Buka Browser

Jalankan: `http://localhost:5173/login`

**Masukkan credentials:**
- Username: `admin`
- Password: `admin123`

**Expected:** Redirect ke Dashboard ✅

---

## 🎯 Summary - 3 Terminal Berjalan

```
Terminal 1: npm start                    (Backend)
Terminal 2: npm run dev                  (Frontend)
Terminal 3: Untuk scripts/testing
```

---

## 🐛 Jika Error

### "Cannot connect to database"
```
✓ Pastikan PostgreSQL running
✓ Cek credentials di .env
✓ Cek DB_HOST dan DB_PORT
```

### "Login gagal"
```
✓ Pastikan user sudah ditambahkan dengan script addUser.js
✓ Cek username dan password benar (case-sensitive)
✓ Lihat console backend untuk error details
```

### "CORS Error"
```
✓ Pastikan backend running di port 5000
✓ Pastikan FRONTEND_URL di .env backend benar
✓ Restart backend server
```

---

## 📖 Dokumentasi Lengkap

Baca `AUTHENTICATION_SETUP.md` untuk dokumentasi detail.

---

## 🚀 Selesai!

Sistem login JWT Anda sudah siap digunakan! 🎉

Next steps:
1. Buat lebih banyak user dengan script `addUser.js`
2. Baca AUTHENTICATION_SETUP.md untuk detail API endpoints
3. Integrasikan dengan halaman dashboard dan routes lainnya

---

**Happy Coding!** 💻

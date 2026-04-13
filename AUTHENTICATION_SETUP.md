# 🔐 Sistem Login JWT dengan Hash & Salt

Dokumentasi lengkap untuk implementasi sistem autentikasi JWT dengan bcrypt hash dan salt pada project BETA.

## 📋 Daftar Isi
1. [Setup Database](#setup-database)
2. [Setup Backend](#setup-backend)
3. [Setup Frontend](#setup-frontend)
4. [Menambah User Manual](#menambah-user-manual)
5. [Flow Autentikasi](#flow-autentikasi)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)

---

## 🗄️ Setup Database

### 1. Buat Database PostgreSQL

```sql
CREATE DATABASE beta_db;
```

### 2. Buat Tabel Users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buat index untuk performa
CREATE INDEX idx_username ON users(username);
```

### 3. Verifikasi Tabel

```sql
\dt users
```

---

## 🚀 Setup Backend

### 1. Copy Environment File

```bash
cd backend
cp .env.example .env
```

### 2. Konfigurasi .env

Buka `backend/.env` dan sesuaikan dengan konfigurasi lokal Anda:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=beta_db
DB_PASSWORD=your_password
DB_PORT=5432

# Server Configuration
PORT=5000

# JWT Configuration - GANTI INI DENGAN SECRET YANG KUAT!
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# CORS Configuration (Frontend URL)
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Jalankan Server

```bash
npm start
```

atau dengan nodemon untuk development:

```bash
npx nodemon server.js
```

Server akan berjalan di: `http://localhost:5000`

---

## 🎨 Setup Frontend

### 1. Copy Environment File

```bash
cd frontend
cp .env.example .env.local
```

### 2. Konfigurasi .env.local (opsional)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Jalankan Frontend

Development server:
```bash
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

---

## 👤 Menambah User Manual

Karena belum ada halaman admin, gunakan script CLI untuk menambah user secara manual.

### 1. Jalankan Script AddUser

```bash
cd backend
node src/utils/addUser.js
```

### 2. Masukkan Data User

Script akan meminta input interaktif:

```
========== ADD USER MANUAL ==========

Username: admin
Password: password123
Role (user/admin) [default: user]: admin
```

### 3. Verifikasi User

```bash
# Query di database
psql -U postgres -d beta_db -c "SELECT id, username, role, created_at FROM users;"
```

### Contoh User Input

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: `admin`

**Regular User:**
- Username: `user1`
- Password: `password123`
- Role: `user`

---

## 🔑 Flow Autentikasi

### Login Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       │ POST /api/auth/login
       │ { username, password }
       ▼
┌──────────────┐      1. Cari user di DB
│   Backend    │      2. Hash password yang dikirim
└──────┬───────┘      3. Bandingkan dengan hash di DB
       │              4. Jika cocok, generate JWT
       │              5. Return token
       │
       │ Response
       │ { token, user }
       ▼
┌─────────────────────┐
│ localStorage.token  │
└─────────────────────┘
       │
       │ Header: "Authorization: Bearer {token}"
       ▼
  [Protected Route]
```

### Request Protected Route

```
Frontend Request:
GET /api/auth/me
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Backend:
1. Validasi JWT signature
2. Validasi token belum expired
3. Extract userId dari token
4. Return user data
```

---

## 📡 API Endpoints

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Password salah"
}
```

---

### 2. Get Current User Info

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

---

### 3. Get All Users (Admin Only)

**Endpoint:** `GET /api/auth/users`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "username": "user1",
      "role": "user",
      "created_at": "2024-01-15T10:35:00Z"
    }
  ]
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Akses ditolak. Hanya admin yang bisa mengakses resource ini"
}
```

---

## 🧪 Testing dengan Postman/cURL

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get User Info

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Users (Admin)

```bash
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

---

## 🔐 Keamanan

### Hash & Salt Implementation

Password di-hash menggunakan **bcrypt** dengan:
- **Salt rounds:** 10
- **Algorithm:** bcrypt (Blowfish)
- **Stored length:** 60 characters

```javascript
// Backend - Hash password saat user ditambah
const hashedPassword = await bcrypt.hash(password, 10);

// Backend - Validasi password saat login
const match = await bcrypt.compare(password, hashedPassword);
```

### JWT Configuration

- **Algorithm:** HS256 (HMAC SHA-256)
- **Expiration:** 7 hari
- **Secret:** Simpan di .env, JANGAN di-commit ke git

### Best Practices

1. ✅ Password di-hash dengan salt sebelum disimpan ke database
2. ✅ Token JWT tersimpan di localStorage frontend
3. ✅ Token dikirim di Authorization header untuk setiap request protected
4. ✅ Admin middleware untuk route tertentu
5. ✅ CORS terkonfigurasi dengan benar
6. ✅ Environment variables untuk secret keys

---

## ⚙️ Struktur Project

### Backend
```
backend/
├── server.js                    # Entry point
├── src/
│   ├── app.js                   # Express app configuration
│   ├── config/
│   │   └── db.js                # Database connection
│   ├── controller/
│   │   └── authController.js    # Login, getUserInfo, getUsers
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT validation
│   │   └── adminMiddleware.js   # Admin role check
│   ├── models/
│   │   └── userModel.js         # Database queries
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoints
│   └── utils/
│       └── addUser.js           # CLI untuk tambah user
├── .env.example                 # Environment template
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point dengan AuthProvider
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state management
│   ├── service/
│   │   └── api.js               # Axios instance & API calls
│   ├── components/
│   │   └── ProtectedRoute.jsx   # Route protection
│   └── pages/
│       └── Login.jsx            # Login page (updated)
├── .env.example                 # Environment template
└── package.json
```

---

## 🐛 Troubleshooting

### 1. "User tidak ditemukan"
**Solusi:** Pastikan username sudah ditambahkan ke database menggunakan script `addUser.js`

### 2. "Password salah"
**Solusi:** Password case-sensitive. Cek kembali username dan password yang benar.

### 3. "Token tidak ditemukan"
**Solusi:** Pastikan header Authorization ada: `Authorization: Bearer {token}`

### 4. "TypeError: Cannot read property 'split' of undefined"
**Solusi:** Format header yang salah. Gunakan: `Authorization: Bearer {token}` (ada space)

### 5. CORS Error
**Solusi:** 
- Pastikan backend CORS sudah dikonfigurasi
- Update `CORS_ORIGIN` di .env backend
- Pastikan frontend URL sesuai dengan CORS config

### 6. "Token sudah expired"
**Solusi:** Login ulang untuk mendapatkan token baru. Token JWT expire dalam 7 hari.

### 7. Database Connection Error
**Solusi:**
- Pastikan PostgreSQL running
- Cek credentials di .env
- Pastikan database `beta_db` sudah dibuat
- Pastikan tabel `users` sudah dibuat

---

## 📚 Referensi

- [bcrypt NPM](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken NPM](https://www.npmjs.com/package/jsonwebtoken)
- [Express.js Documentation](https://expressjs.com/)
- [React Router Documentation](https://reactrouter.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🎉 Next Steps

Setelah sistem login berhasil:

1. **Buat Admin Dashboard** untuk manage users (create, edit, delete)
2. **Implement refresh token** untuk security yang lebih baik
3. **Add 2FA** (Two-Factor Authentication) untuk security tambahan
4. **Setup email verification** untuk password reset
5. **Add audit logs** untuk track user activities

---

## 📞 Support

Jika ada masalah atau pertanyaan, silahkan hubungi tim development.

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0

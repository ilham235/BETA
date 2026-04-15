-- Membuat table OB (Orang Bersih)
CREATE TABLE IF NOT EXISTS ob (
  id_ob SERIAL PRIMARY KEY,
  nama_ob VARCHAR(100) UNIQUE NOT NULL,
  kontak VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat table ruangan
CREATE TABLE IF NOT EXISTS ruangan (
  id_ruangan SERIAL PRIMARY KEY,
  nama_ruangan VARCHAR(100) NOT NULL,
  lantai VARCHAR(10) NOT NULL,
  detail_pekerjaan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(nama_ruangan, lantai)
);

-- Membuat table penugasan
CREATE TABLE IF NOT EXISTS penugasan (
  id_penugasan SERIAL PRIMARY KEY,
  id_user INTEGER,
  id_ob INTEGER,
  id_ruangan INTEGER,
  tanggal_awal DATE NOT NULL,
  tanggal_akhir DATE NOT NULL,
  kode_pengerjaan VARCHAR(50) UNIQUE,
  shift VARCHAR(20),
  deskripsi TEXT,
  rolling_mingguan BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat table laporan
CREATE TABLE IF NOT EXISTS laporan (
  id_laporan SERIAL PRIMARY KEY,
  id_penugasan INTEGER,
  tanggal DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat index untuk performa
CREATE INDEX IF NOT EXISTS idx_penugasan_user ON penugasan(id_user);
CREATE INDEX IF NOT EXISTS idx_penugasan_ob ON penugasan(id_ob);
CREATE INDEX IF NOT EXISTS idx_penugasan_ruangan ON penugasan(id_ruangan);
CREATE INDEX IF NOT EXISTS idx_laporan_penugasan ON laporan(id_penugasan);
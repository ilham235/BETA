import pool from "../src/config/db.js";

const runMigration = async () => {
  try {
    console.log("🔄 Memulai migration: add_laporan_snapshots");
    
    // 1. Cek apakah kolom sudah ada
    console.log("📋 Mengecek kolom snapshot...");
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='laporan' AND column_name='snapshot_kode_pengerjaan'
    `);
    
    if (columnCheck.rows.length > 0) {
      console.log("✅ Kolom snapshot sudah ada. Skipping...");
      process.exit(0);
    }
    
    // 2. Tambahkan kolom snapshot
    console.log("➕ Menambahkan kolom snapshot...");
    await pool.query(`
      ALTER TABLE laporan
      ADD COLUMN IF NOT EXISTS snapshot_kode_pengerjaan VARCHAR(50),
      ADD COLUMN IF NOT EXISTS snapshot_deskripsi_penugasan TEXT,
      ADD COLUMN IF NOT EXISTS snapshot_nama_ob VARCHAR(100),
      ADD COLUMN IF NOT EXISTS snapshot_kontak_ob VARCHAR(20),
      ADD COLUMN IF NOT EXISTS snapshot_nama_ruangan VARCHAR(100),
      ADD COLUMN IF NOT EXISTS snapshot_lantai VARCHAR(10),
      ADD COLUMN IF NOT EXISTS snapshot_nama_tugas VARCHAR(100),
      ADD COLUMN IF NOT EXISTS snapshot_username_user VARCHAR(50),
      ADD COLUMN IF NOT EXISTS snapshot_nama_lengkap_user VARCHAR(100)
    `);
    console.log("✅ Kolom snapshot berhasil ditambahkan");
    
    // 3. Populate existing data dengan snapshot dari penugasan terkait
    console.log("🔄 Populating existing laporan dengan snapshot data...");
    const result = await pool.query(`
      UPDATE laporan l
      SET
        snapshot_kode_pengerjaan = p.kode_pengerjaan,
        snapshot_deskripsi_penugasan = p.deskripsi,
        snapshot_nama_ob = o.nama_ob,
        snapshot_kontak_ob = o.kontak,
        snapshot_nama_ruangan = r.nama_ruangan,
        snapshot_lantai = r.lantai,
        snapshot_nama_tugas = t.nama_tugas,
        snapshot_username_user = u.username,
        snapshot_nama_lengkap_user = u.nama_lengkap
      FROM penugasan p
      LEFT JOIN ob o ON p.id_ob = o.id_ob
      LEFT JOIN ruangan r ON p.id_ruangan = r.id_ruangan
      LEFT JOIN tugas t ON p.id_tugas = t.id_tugas
      LEFT JOIN users u ON p.id_user = u.id_user
      WHERE l.id_penugasan = p.id_penugasan
    `);
    
    console.log(`✅ Migration selesai! ${result.rowCount} laporan records sudah di-update dengan snapshot data`);
    console.log("📝 Data laporan sekarang immutable - tidak akan berubah meski penugasan/area berubah");
    
  } catch (error) {
    console.error("❌ Error menjalankan migration:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migration
runMigration();

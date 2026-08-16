# Migrations

Directory untuk database migration scripts.

## Running Migrations

### Add Laporan Snapshots (Data Immutability)

```bash
node migrations/add_laporan_snapshots.js
```

Tujuan: Menambahkan snapshot columns ke tabel laporan agar data laporan tidak berubah meski penugasan/area berubah.

**Kapan jalankan:**
- Setelah pull code terbaru
- Sebelum restart backend
- Satu kali per environment (aman untuk dijalankan berkali-kali)

**Apa yang dilakukan:**
1. Mengecek apakah snapshot columns sudah ada
2. Menambahkan snapshot columns jika belum ada
3. Populate existing laporan data dengan snapshot dari penugasan terkait

---

**Important:** Selalu jalankan migrations sebelum memulai development atau deployment.

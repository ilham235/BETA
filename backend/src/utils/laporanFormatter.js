/**
 * Helper function untuk memformat laporan data dengan snapshot
 * Mengubah snapshot columns menjadi format yang sama seperti sebelumnya (dengan JOIN)
 */

export const formatLaporanWithSnapshot = (laporanRow) => {
  if (!laporanRow) return null;
  
  return {
    ...laporanRow,
    // Dari snapshot (immutable)
    kode_pengerjaan: laporanRow.snapshot_kode_pengerjaan,
    deskripsi_penugasan: laporanRow.snapshot_deskripsi_penugasan,
    nama_ob: laporanRow.snapshot_nama_ob,
    kontak_ob: laporanRow.snapshot_kontak_ob,
    nama_ruangan: laporanRow.snapshot_nama_ruangan,
    lantai: laporanRow.snapshot_lantai,
    nama_tugas: laporanRow.snapshot_nama_tugas,
    detail_pekerjaan: laporanRow.snapshot_nama_tugas, // Alias untuk kompatibilitas
    username: laporanRow.snapshot_username_user,
    nama_lengkap: laporanRow.snapshot_nama_lengkap_user
  };
};

/**
 * Format array of laporan records
 */
export const formatLaporanListWithSnapshot = (laporanRows) => {
  if (!Array.isArray(laporanRows)) return [];
  return laporanRows.map(row => formatLaporanWithSnapshot(row));
};

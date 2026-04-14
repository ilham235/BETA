-- Insert data OB yang sesuai dengan dropdown frontend
INSERT INTO ob (nama_ob, kontak) VALUES ('Udin Mujadi', '081234567890') ON CONFLICT (nama_ob) DO NOTHING;
INSERT INTO ob (nama_ob, kontak) VALUES ('Ahmad Suryadi', '081234567891') ON CONFLICT (nama_ob) DO NOTHING;

-- Insert data ruangan yang sesuai dengan dropdown frontend
INSERT INTO ruangan (nama_ruangan, lantai, detail_pekerjaan) VALUES ('Toilet', '1', 'Kuras dan sikat toilet') ON CONFLICT (nama_ruangan, lantai) DO NOTHING;
INSERT INTO ruangan (nama_ruangan, lantai, detail_pekerjaan) VALUES ('Kantor', '1', 'Pel dan sapu lantai') ON CONFLICT (nama_ruangan, lantai) DO NOTHING;
INSERT INTO ruangan (nama_ruangan, lantai, detail_pekerjaan) VALUES ('Ruang Rapat', '2', 'Bersihkan meja dan kursi') ON CONFLICT (nama_ruangan, lantai) DO NOTHING;
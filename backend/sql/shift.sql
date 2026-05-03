-- Tabel shift untuk Kelola Shift
CREATE TABLE IF NOT EXISTS shift (
    id_shift SERIAL PRIMARY KEY,
    nama_shift VARCHAR(100) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data shift default
INSERT INTO shift (nama_shift, jam_mulai, jam_selesai) VALUES 
('Pagi', '06:00:00', '14:00:00'),
('Siang', '14:00:00', '22:00:00'),
('Malam', '22:00:00', '06:00:00')
ON CONFLICT DO NOTHING;
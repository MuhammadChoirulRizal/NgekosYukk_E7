-- Database: ngekos_db
CREATE DATABASE IF NOT EXISTS ngekos_db;
USE ngekos_db;

-- Tabel 1: pemilik_kos (Utama)
CREATE TABLE IF NOT EXISTS pemilik_kos (
    id_pemilik INT AUTO_INCREMENT PRIMARY KEY,
    nama_pemilik VARCHAR(100) NOT NULL,
    no_hp VARCHAR(15) NOT NULL,
    alamat TEXT NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabel 2: penyewa (Pendukung)
CREATE TABLE IF NOT EXISTS penyewa (
    id_penyewa INT AUTO_INCREMENT PRIMARY KEY,
    nama_penyewa VARCHAR(100) NOT NULL,
    no_hp VARCHAR(15) NOT NULL
);

-- Tabel 3: kamar (Pendukung)
CREATE TABLE IF NOT EXISTS kamar (
    id_kamar INT AUTO_INCREMENT PRIMARY KEY,
    jenis_kamar VARCHAR(50) NOT NULL,
    deskripsi TEXT,
    status_kamar ENUM('tersedia', 'terisi', 'maintenance') DEFAULT 'tersedia',
    harga DECIMAL(10,2) NOT NULL,
    id_penyewa INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_penyewa) REFERENCES penyewa(id_penyewa) ON DELETE SET NULL
);

-- Insert data dummy untuk pemilik_kos
INSERT INTO pemilik_kos (nama_pemilik, no_hp, alamat, password) VALUES
('Admin Ngekos', '081234567890', 'Jl. Contoh No. 123, Yogyakarta', '$2b$10$YourHashedPasswordHere');

-- Insert data dummy untuk penyewa
INSERT INTO penyewa (nama_penyewa, no_hp) VALUES
('Budi Santoso', '081298765432'),
('Sari Dewi', '081312345678'),
('Ahmad Fauzi', '081423456789');

-- Insert data dummy untuk kamar
INSERT INTO kamar (jenis_kamar, deskripsi, status_kamar, harga, id_penyewa) VALUES
('Standard', 'Kamar dengan kasur single, meja, lemari', 'tersedia', 1500000.00, NULL),
('Deluxe', 'Kamar dengan AC, TV, kamar mandi dalam', 'terisi', 2500000.00, 1),
('Premium', 'Kamar luas dengan dapur kecil, AC, TV LED', 'tersedia', 3500000.00, NULL),
('Economy', 'Kamar simple dengan ventilasi baik', 'maintenance', 1200000.00, NULL);
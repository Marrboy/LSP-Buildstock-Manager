-- Database JWP Bookstock Manager
-- Import lewat phpMyAdmin / XAMPP

DROP DATABASE IF EXISTS jwp_buildstock_manager;
CREATE DATABASE jwp_buildstock_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jwp_buildstock_manager;

CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL DEFAULT 'password123',
  role ENUM('Admin', 'Super Admin') NOT NULL DEFAULT 'Admin',
  status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  avatar TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  unit_type VARCHAR(30) NOT NULL,
  min_stock INT NOT NULL DEFAULT 10,
  price INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_categories
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE stock_transactions (
  id VARCHAR(50) PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  type ENUM('MASUK', 'KELUAR') NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  reference_person VARCHAR(150) NOT NULL,
  transaction_date DATE NOT NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_transactions_products
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_transactions_product_id ON stock_transactions(product_id);
CREATE INDEX idx_transactions_type ON stock_transactions(type);
CREATE INDEX idx_transactions_date ON stock_transactions(transaction_date);

INSERT INTO users (id, name, email, password, role, status, avatar) VALUES
('user-1', 'Budi Santoso', 'admin@toko-jwp.com', 'password123', 'Super Admin', 'Aktif', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'),
('user-2', 'Ahmad Wijaya', 'ahmad@toko-jwp.com', 'password123', 'Admin', 'Aktif', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'),
('user-3', 'Siti Rahmawati', 'siti@toko-jwp.com', 'password123', 'Admin', 'Aktif', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop');

INSERT INTO categories (id, code, name, description, created_at) VALUES
('cat-1', 'FIK', 'Fiksi & Sastra', 'Novel populer, sastra Indonesia, terjemahan, dan bacaan best seller.', '2026-05-01 08:00:00'),
('cat-2', 'EDU', 'Pendidikan & Sekolah', 'Buku pelajaran, latihan soal, modul sekolah, dan buku penunjang belajar.', '2026-05-01 08:30:00'),
('cat-3', 'KID', 'Anak & Remaja', 'Buku cerita anak, komik edukasi, aktivitas mewarnai, dan bacaan remaja.', '2026-05-01 09:00:00'),
('cat-4', 'BIS', 'Bisnis & Pengembangan Diri', 'Buku bisnis, manajemen, finansial, produktivitas, dan motivasi.', '2026-05-02 10:00:00'),
('cat-5', 'REF', 'Referensi & Akademik', 'Kamus, ensiklopedia, buku kampus, dan referensi profesional.', '2026-05-02 11:30:00'),
('cat-6', 'STA', 'Stationery & Perlengkapan', 'Buku tulis, pulpen, pensil, map, kertas, dan perlengkapan sekolah/kantor.', '2026-05-03 14:00:00');

INSERT INTO products (id, code, name, category_id, stock, unit_type, min_stock, price, created_at) VALUES
('prod-1', 'FIK-LB01', 'Novel Laut Bercerita', 'cat-1', 45, 'EKSEMPLAR', 10, 115000, '2026-05-01 09:12:00'),
('prod-2', 'FIK-BS02', 'Novel Best Seller Terjemahan', 'cat-1', 8, 'EKSEMPLAR', 10, 98000, '2026-05-01 09:15:00'),
('prod-3', 'EDU-MTK10', 'Buku Latihan Matematika SMA Kelas 10', 'cat-2', 125, 'EKSEMPLAR', 10, 72000, '2026-05-01 09:45:00'),
('prod-4', 'EDU-TRY12', 'Paket Try Out UTBK 2026', 'cat-2', 5, 'SET', 10, 135000, '2026-05-01 09:48:00'),
('prod-5', 'KID-CRT01', 'Cerita Anak Nusantara Bergambar', 'cat-3', 85, 'EKSEMPLAR', 10, 58000, '2026-05-01 10:10:00'),
('prod-6', 'KID-KOM02', 'Komik Edukasi Sains Anak', 'cat-3', 35, 'EKSEMPLAR', 10, 46000, '2026-05-01 10:15:00'),
('prod-7', 'BIS-AH01', 'Atomic Habits Edisi Terjemahan', 'cat-4', 4, 'EKSEMPLAR', 10, 108000, '2026-05-02 10:45:00'),
('prod-8', 'REF-KAM01', 'Kamus Inggris Indonesia Lengkap', 'cat-5', 18, 'EKSEMPLAR', 10, 89000, '2026-05-02 12:00:00'),
('prod-9', 'STA-BT38', 'Buku Tulis 38 Lembar Isi 10', 'cat-6', 4500, 'PACK', 100, 42000, '2026-05-03 14:15:00'),
('prod-10', 'STA-PEN01', 'Pulpen Gel Hitam Box Isi 12', 'cat-6', 7, 'BOX', 10, 36000, '2026-05-03 14:20:00');

INSERT INTO stock_transactions
(id, invoice_number, type, product_id, quantity, reference_person, transaction_date, notes, created_at) VALUES
('trx-1', 'BM-20260510-001', 'MASUK', 'prod-1', 50, 'Distributor Buku Nusantara', '2026-05-10', 'Pengiriman stok novel mingguan', '2026-05-10 09:30:00'),
('trx-2', 'BM-20260512-001', 'MASUK', 'prod-3', 100, 'Penerbit Edukasi Mandiri', '2026-05-12', 'Restock buku latihan sekolah', '2026-05-12 10:15:00'),
('trx-3', 'BM-20260515-001', 'MASUK', 'prod-6', 40, 'Distributor Komik Edukasi', '2026-05-15', 'Restock komik edukasi anak', '2026-05-15 11:00:00'),
('trx-4', 'BM-20260520-001', 'MASUK', 'prod-9', 5000, 'Pemasok Stationery Sentosa', '2026-05-20', 'Pengadaan buku tulis awal semester', '2026-05-20 15:45:00'),
('trx-5', 'BK-20260522-001', 'KELUAR', 'prod-1', 5, 'Pelanggan Member - Hendra Wijaya', '2026-05-22', 'Pembelian novel untuk koleksi pribadi', '2026-05-22 13:00:00'),
('trx-6', 'BK-20260525-001', 'KELUAR', 'prod-9', 500, 'Sekolah Cendekia Abadi', '2026-05-25', 'Pembelian perlengkapan semester baru', '2026-05-25 14:30:00'),
('trx-7', 'BK-20260528-001', 'KELUAR', 'prod-6', 5, 'Pelanggan Retail - Siti Rahma', '2026-05-28', 'Pembelian komik edukasi anak', '2026-05-28 10:00:00'),
('trx-8', 'BK-20260601-001', 'KELUAR', 'prod-4', 15, 'Bimbel Prestasi Cilandak', '2026-06-01', 'Paket try out untuk kelas persiapan', '2026-06-01 11:15:00');

DELIMITER //

CREATE TRIGGER trg_stock_transactions_before_insert
BEFORE INSERT ON stock_transactions
FOR EACH ROW
BEGIN
  DECLARE current_stock INT DEFAULT 0;

  IF NEW.quantity <= 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Quantity transaksi harus lebih besar dari 0';
  END IF;

  SELECT stock INTO current_stock
  FROM products
  WHERE id = NEW.product_id
  FOR UPDATE;

  IF NEW.type = 'KELUAR' AND NEW.quantity > current_stock THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Stok tidak mencukupi untuk transaksi barang keluar';
  END IF;
END//

CREATE TRIGGER trg_stock_transactions_after_insert
AFTER INSERT ON stock_transactions
FOR EACH ROW
BEGIN
  IF NEW.type = 'MASUK' THEN
    UPDATE products
    SET stock = stock + NEW.quantity
    WHERE id = NEW.product_id;
  ELSE
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
  END IF;
END//

DELIMITER ;

CREATE VIEW vw_low_stock_products AS
SELECT
  p.id,
  p.code,
  p.name,
  c.name AS category_name,
  p.stock,
  p.min_stock,
  p.unit_type,
  p.price
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.stock < p.min_stock;


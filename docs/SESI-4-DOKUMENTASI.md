# Dokumentasi Tugas Pelatihan Sesi 4

## Identitas Aplikasi

Nama aplikasi: JWP Bookstock Manager

Studi kasus: Sistem inventori toko buku untuk mengelola kategori, katalog produk, stok masuk, stok keluar, laporan mutasi, dan akun admin.

Stack implementasi:
- Frontend: React 19, Vite, Tailwind CSS, lucide-react
- Backend: Express.js
- Database: MySQL / MariaDB
- File database mentah: `database/jwp_buildstock_manager.sql`
- ERD mentah: `database/erd-jwp-implementasi.svg`

## Cara Menjalankan

1. Install dependency.

   ```bash
   npm install
   ```

2. Import database melalui phpMyAdmin atau MySQL CLI.

   ```sql
   SOURCE database/jwp_buildstock_manager.sql;
   ```

3. Salin konfigurasi environment.

   ```bash
   copy .env.example .env
   ```

4. Jalankan API.

   ```bash
   npm run api
   ```

5. Jalankan frontend.

   ```bash
   npm run dev
   ```

6. Buka aplikasi di browser.

   ```text
   http://localhost:3000
   ```

Catatan: Jika API MySQL belum aktif, frontend tetap bisa menampilkan data contoh untuk kebutuhan preview. Operasi simpan CRUD dan transaksi membutuhkan API serta database.

## Akun Penguji

| Nama | Email | Password | Role | Status |
| --- | --- | --- | --- | --- |
| Budi Santoso | admin@toko-jwp.com | password123 | Super Admin | Aktif |
| Ahmad Wijaya | ahmad@toko-jwp.com | password123 | Admin | Aktif |
| Siti Rahmawati | siti@toko-jwp.com | password123 | Admin | Nonaktif |

## Daftar Halaman Yang Diimplementasikan

1. Login admin
2. Dashboard analytics
3. Persediaan buku real-time
4. Form buku masuk
5. Form buku keluar
6. Master kategori
7. Form tambah/edit kategori
8. Master katalog buku/produk
9. Form tambah/edit produk
10. Manajemen pengguna
11. Form tambah/edit pengguna
12. Laporan persediaan dan mutasi
13. Ubah profil pengguna
14. Ubah password
15. Rancangan sistem / blueprint

## Ringkasan Fitur

- Login admin dengan validasi email, password, dan status akun.
- Dashboard statistik total produk, stok masuk, stok keluar, stok rendah, grafik transaksi, serta tabel 5 stok terendah dan tertinggi.
- Monitoring stok dengan pencarian, filter kategori, filter status stok, dan ekspor CSV.
- Pencatatan barang masuk dan keluar dengan nomor invoice otomatis.
- Validasi barang keluar agar kuantitas tidak melebihi stok tersedia.
- CRUD kategori dengan proteksi hapus jika kategori masih dipakai produk.
- CRUD produk dengan proteksi hapus jika produk sudah memiliki transaksi.
- CRUD pengguna khusus Super Admin.
- Laporan mutasi dengan filter tanggal, tipe transaksi, produk, pencarian, print, dan ekspor CSV.
- Halaman profil dan ubah password dipisah sesuai rancangan halaman.
- Blueprint sistem berisi deskripsi halaman, wireframe, struktur database, relasi tabel, alur proses, dan saran teknologi.

## Data Mentah Yang Disertakan

| Jenis Mentahan | Lokasi |
| --- | --- |
| Source frontend | `src/` |
| Source backend API | `server.js` |
| SQL database | `database/jwp_buildstock_manager.sql` |
| ERD SVG | `database/erd-jwp-implementasi.svg` |
| Data awal fallback | `src/initialData.ts` |
| Dokumentasi sesi 4 | `docs/SESI-4-DOKUMENTASI.md` |
| Dokumen Word sesi 4 | `docs/Laporan_Target_Sesi_4_JWP_Bookstock_Manager.docx` |
| Build hasil produksi | `dist/` setelah menjalankan `npm run build` |

## Daftar Capture Yang Disarankan

Simpan hasil screenshot ke folder dokumentasi atau laporan akhir dengan nama berikut:

| No | Halaman | Nama File Capture |
| --- | --- | --- |
| 1 | Login | `capture-01-login.png` |
| 2 | Dashboard | `capture-02-dashboard.png` |
| 3 | Persediaan Buku | `capture-03-persediaan.png` |
| 4 | Buku Masuk | `capture-04-buku-masuk.png` |
| 5 | Buku Keluar | `capture-05-buku-keluar.png` |
| 6 | Master Kategori | `capture-06-master-kategori.png` |
| 7 | Form Kategori | `capture-07-form-kategori.png` |
| 8 | Master Produk | `capture-08-master-produk.png` |
| 9 | Form Produk | `capture-09-form-produk.png` |
| 10 | Manajemen Pengguna | `capture-10-pengguna.png` |
| 11 | Form Pengguna | `capture-11-form-pengguna.png` |
| 12 | Laporan Mutasi | `capture-12-laporan.png` |
| 13 | Ubah Profil | `capture-13-profil.png` |
| 14 | Ubah Password | `capture-14-password.png` |
| 15 | Blueprint Sistem | `capture-15-blueprint.png` |

## Pemeriksaan Akhir

Perintah verifikasi:

```bash
npm run lint
npm run build
```

Kriteria selesai:
- Semua halaman rancangan tersedia pada navigasi.
- CRUD master data terhubung ke API.
- Transaksi stok masuk/keluar memperbarui data lewat database.
- Laporan dapat dicetak dan diekspor CSV.
- Database mentah dan ERD tersedia di folder `database/`.
- Dokumentasi penggunaan dan daftar capture tersedia di folder `docs/`.

# JWP Bookstock Manager

Aplikasi inventori toko buku untuk tugas pelatihan sesi 4. Sistem ini mencakup login admin, dashboard, persediaan, transaksi buku masuk/keluar, master kategori, master produk, manajemen pengguna, laporan, profil, password, dan blueprint rancangan sistem.

## Jalankan Aplikasi

```bash
npm install
npm run api
npm run dev
```

Frontend berjalan di `http://localhost:3000` dan API berjalan di `http://localhost:4000`.

## Database

Import file SQL berikut melalui phpMyAdmin atau MySQL CLI:

```text
database/jwp_buildstock_manager.sql
```

Gunakan `.env.example` sebagai acuan konfigurasi koneksi database.

## Akun Penguji

```text
Email    : admin@toko-jwp.com
Password : password123
Role     : Super Admin
```

## Dokumentasi Tugas

Dokumentasi lengkap sesi 4, daftar halaman, file mentah, dan daftar capture ada di:

```text
docs/SESI-4-DOKUMENTASI.md
```

Panduan belajar kode, penjelasan fungsi tiap file, alur frontend-API-database,
dan latihan perubahan studi kasus ada di:

```text
docs/PANDUAN-BELAJAR-KODE.md
```

## Verifikasi

```bash
npm run lint
npm run build
```

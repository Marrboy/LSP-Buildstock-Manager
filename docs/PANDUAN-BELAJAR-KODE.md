# Panduan Belajar Kode JWP Bookstock Manager

Dokumen ini adalah komentar pendamping source code. Tujuannya bukan sekadar
menjelaskan hasil akhir, tetapi membantu memahami fungsi setiap bagian kode,
alur data, alasan validasi, dan bagian yang perlu diubah jika studi kasus ujian
berbeda.

## 1. Gambaran Besar

Aplikasi memakai arsitektur tiga lapis:

```text
Pengguna
   |
   v
React/Vite (tampilan dan state)
   |
   | HTTP JSON
   v
Express API (validasi dan aturan bisnis)
   |
   | SQL parameterized query
   v
MySQL (penyimpanan, relasi, dan trigger stok)
```

Alur paling penting:

```text
Klik Simpan Transaksi
-> IncomingOutgoingForm.handleSubmitTrx()
-> App.handleAddTransaction()
-> apiRequest("/transactions")
-> POST /api/transactions
-> INSERT stock_transactions
-> trigger MySQL mengubah products.stock
-> API mengirim data terbaru
-> applyData() memperbarui state React
-> React merender ulang dashboard, stok, dan laporan
```

## 2. Peta Folder

| File/folder | Fungsi |
| --- | --- |
| `src/main.tsx` | Titik masuk frontend dan tempat `<App />` dipasang ke HTML. |
| `src/App.tsx` | Pusat state, komunikasi API, login, CRUD, dan pemilih halaman. |
| `src/types.ts` | Kontrak bentuk data TypeScript. |
| `src/initialData.ts` | Data contoh ketika API/MySQL tidak dapat dihubungi. |
| `src/components/` | Komponen tampilan untuk setiap halaman. |
| `src/index.css` | Font, tema Tailwind, warna body, dan scrollbar global. |
| `server.js` | REST API Express dan validasi server. |
| `database/jwp_buildstock_manager.sql` | Tabel, relasi, data awal, trigger, dan view. |
| `vite.config.ts` | Konfigurasi plugin React, Tailwind, alias, dan dev server. |

## 3. Kamus Syntax Dasar

### Import

```tsx
import React, { useState } from 'react';
```

- `import` mengambil kode dari modul lain.
- `React` menyediakan fitur React.
- `{ useState }` mengambil named export bernama `useState`.
- `from 'react'` menunjukkan sumber modul.

```tsx
import { Product } from '../types';
```

Baris ini mengambil interface `Product`. Interface hanya dipakai TypeScript
untuk memeriksa bentuk data saat development, bukan menjadi objek baru saat
aplikasi berjalan.

### Interface props

```tsx
interface ReportsProps {
  transactions: StockTransaction[];
  products: Product[];
}
```

- `interface ReportsProps` membuat kontrak input komponen.
- `StockTransaction[]` berarti array transaksi.
- `Product[]` berarti array produk.
- React akan memberi peringatan TypeScript jika komponen dipanggil dengan
  bentuk props yang salah.

### State

```tsx
const [search, setSearch] = useState('');
```

- `search` adalah nilai state saat ini.
- `setSearch` adalah fungsi untuk mengubah nilai.
- `useState('')` memberi nilai awal string kosong.
- Saat setter dipanggil, React menjadwalkan render ulang.
- State dipakai untuk data yang dapat berubah dan harus terlihat di UI.

### Event

```tsx
onChange={(event) => setSearch(event.target.value)}
```

- `onChange` berjalan saat isi input berubah.
- `event.target.value` mengambil teks terbaru dari input.
- `setSearch(...)` menyimpan teks itu ke state.

```tsx
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
};
```

`preventDefault()` mencegah browser me-refresh halaman ketika form dikirim.
React kemudian dapat memproses form menggunakan JavaScript.

### Transformasi array

```tsx
products.filter(product => product.stock <= product.min_stock);
```

`filter` membuat array baru yang hanya berisi produk stok rendah.

```tsx
transactions.reduce((total, transaction) => total + transaction.quantity, 0);
```

`reduce` menggabungkan banyak nilai menjadi satu total. Angka `0` adalah nilai
awal accumulator.

```tsx
[...products].sort((a, b) => a.stock - b.stock);
```

- `[...products]` menyalin array agar props asli tidak dimutasi.
- `sort` mengurutkan stok dari kecil ke besar.
- Untuk urutan besar ke kecil, gunakan `b.stock - a.stock`.

### Conditional rendering

```tsx
{error && <p>{error}</p>}
```

Elemen `<p>` hanya dirender jika `error` memiliki nilai.

```tsx
{isIncoming ? 'Stok Masuk' : 'Stok Keluar'}
```

Operator ternary memilih nilai pertama saat kondisi benar dan nilai kedua saat
kondisi salah.

## 4. `src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
```

1. Mengambil `StrictMode` untuk membantu menemukan pola React yang tidak aman.
2. Mengambil `createRoot` untuk menjalankan React 19 di browser.
3. Mengambil komponen utama aplikasi.
4. Memuat CSS global.

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

1. `document.getElementById('root')` mencari elemen root di `index.html`.
2. Tanda `!` memberi tahu TypeScript bahwa elemen tersebut pasti ada.
3. `createRoot(...)` membuat root React.
4. `.render(...)` menampilkan aplikasi.
5. `<StrictMode>` hanya alat pemeriksaan development, bukan halaman tambahan.

## 5. `src/types.ts`

### `Category`

Mewakili pengelompokan produk. `id` dipakai sebagai primary key, sedangkan
`code` dipakai sebagai kode pendek dan prefix SKU.

### `Product`

Mewakili buku atau barang:

- `category_id` menghubungkan produk ke kategori.
- `stock` adalah jumlah tersedia sekarang.
- `unit_type` menjelaskan satuan, misalnya `EKSEMPLAR`, `SET`, atau `BOX`.
- `min_stock` adalah batas peringatan stok rendah.
- `price` disimpan sebagai bilangan bulat rupiah.

### `StockTransaction`

Mewakili satu mutasi persediaan:

- `type: 'MASUK' | 'KELUAR'` membatasi nilai hanya pada dua pilihan.
- `product_id` menunjuk produk yang berubah.
- `quantity` adalah jumlah perubahan, selalu positif.
- Arah perubahan ditentukan oleh `type`, bukan tanda negatif pada quantity.

### `User` dan `UserPayload`

`User` adalah data pengguna publik tanpa password. `UserPayload` adalah bentuk
data untuk tambah/edit pengguna dan boleh memiliki password.

### `ActivePage`

Union type ini membatasi nama halaman. Salah ketik seperti `'dashbord'` akan
ditolak TypeScript karena tidak ada dalam daftar.

## 6. `src/App.tsx`

`App` adalah pengatur utama. Komponen lain fokus pada tampilan dan mengirim
aksi kembali ke `App` melalui callback.

### Konfigurasi API

```tsx
const API_URL = 'http://localhost:4000/api';
```

Semua endpoint Express diawali URL ini. Untuk production sebaiknya nilai
dipindahkan ke environment variable, misalnya `VITE_API_URL`.

### `apiRequest<T>()`

```tsx
const apiRequest = async <T,>(path: string, options: RequestInit = {}): Promise<T>
```

- `<T,>` adalah generic, yaitu tipe hasil yang diharapkan pemanggil.
- `path` adalah bagian endpoint, misalnya `/products`.
- `options` berisi method, body, dan header fetch.
- `Promise<T>` berarti fungsi asynchronous akan menghasilkan data bertipe `T`.

Urutan kerja:

1. Gabungkan `API_URL` dan `path`.
2. Pasang header JSON.
3. Tunggu response.
4. Jika status bukan 2xx, ambil pesan error server dan lempar `Error`.
5. Jika berhasil, ubah JSON response menjadi object JavaScript.

### State utama

| State | Isi |
| --- | --- |
| `categories` | Data kategori dari database/fallback. |
| `products` | Data produk dan stok terbaru. |
| `transactions` | Riwayat barang masuk/keluar. |
| `users` | Daftar pengguna publik. |
| `currentUser` | Pengguna yang sedang login atau `null`. |
| `activePage` | Halaman yang sedang ditampilkan. |
| `isLoading` | Penanda proses bootstrap awal. |

### `applyData()`

Menerima satu paket data bootstrap dan mengisi empat state sekaligus. Fungsi
ini menghindari pengulangan setter setelah transaksi atau load awal.

### `useEffect()` inisialisasi

Effect dengan dependency `[]` berjalan setelah komponen pertama kali dipasang.

1. Memanggil `GET /api/bootstrap`.
2. Memulihkan user dari `localStorage`.
3. Jika API gagal, memakai `INITIAL_*` agar preview tetap dapat dibuka.
4. `finally` selalu mematikan loading, baik request sukses maupun gagal.

Fallback hanya cocok untuk demo. Operasi simpan tetap memerlukan API dan MySQL.

### Login

`handleLogin(email, password)`:

1. Mengirim data ke `POST /api/auth/login`.
2. Server memvalidasi email, password, dan status.
3. User publik disimpan ke state dan `localStorage`.
4. Halaman dipindahkan ke dashboard.
5. Jika server benar-benar tidak terjangkau, aplikasi dapat memakai akun data
   contoh untuk keperluan preview.

### CRUD

Pola tambah:

```text
komponen form -> callback App -> POST API -> server INSERT
-> server mengirim record -> state ditambah -> tabel render ulang
```

Pola edit:

```text
komponen form -> callback App -> PUT API -> server UPDATE
-> server mengirim record -> map mengganti item dengan id sama
```

Pola hapus:

```text
konfirmasi UI -> DELETE API -> aturan relasi diperiksa server
-> state difilter atau bootstrap dimuat ulang
```

### Pemilih halaman

`renderActivePageContent()` memakai `switch(activePage)`. Setiap `case`
mengembalikan satu komponen dan props yang dibutuhkannya. Ini adalah navigasi
berbasis state, bukan React Router.

### Stok rendah

```tsx
const lowStockCount = products.filter(
  product => product.stock <= product.min_stock
).length;
```

Aturan frontend memakai `<=`. Perhatikan bahwa view SQL saat ini memakai `<`.
Jika stok tepat sama dengan batas minimum, UI menganggap rendah tetapi view SQL
tidak. Untuk konsistensi, ubah view SQL menjadi `WHERE p.stock <= p.min_stock`.

## 7. Komponen Halaman

### `Login.tsx`

- Menyimpan email, password, pesan error, dan status submit.
- `handleLoginSubmit` mencegah refresh, memvalidasi input, lalu menunggu
  callback `onLogin`.
- `selectQuickAdmin` mengisi form dari akun contoh.
- Tombol blueprint memanggil `onViewDesignFirst` tanpa login.

### `Sidebar.tsx`

- Menu dikelompokkan menjadi master, transaksi, office, dan settings.
- `.map()` mengubah array konfigurasi menu menjadi tombol.
- Klik menu memanggil `setActivePage(item.id)`.
- Badge stok rendah menerima nilai dari `App`, sehingga satu sumber data dipakai
  oleh sidebar dan navbar.

### `Navbar.tsx`

- `getPageTitle` mengubah kode halaman menjadi judul manusiawi.
- `getBreadcrumbs` membentuk jejak navigasi.
- Tanggal dan waktu diformat dengan locale `id-ID`.
- Tombol cepat mengubah `activePage` ke form masuk/keluar.

### `Dashboard.tsx`

- `filter + reduce` menghitung total stok masuk dan keluar.
- Salinan produk diurutkan untuk mencari lima stok terendah/tertinggi.
- `lowStockProducts` memakai perbandingan stok terhadap batas tiap produk.
- Transaksi terbaru dipakai untuk grafik sederhana.
- Dashboard tidak mengubah database; semua nilai merupakan turunan props.

Catatan: jumlah produk kategori pada dua kartu masih memakai ID hardcoded
`cat-1` dan `cat-2`. Jika ID kategori berubah, kartu tersebut perlu dibuat
dinamis berdasarkan kode atau data kategori.

### `Inventory.tsx`

- Memiliki filter pencarian, kategori, dan status stok.
- `getStockStatus` menentukan label serta warna.
- `filteredProducts` menggabungkan semua kondisi filter.
- `exportCSV` membuat teks CSV, membungkusnya dalam `Blob`, membuat URL sementara,
  lalu memicu download browser.

### `IncomingOutgoingForm.tsx`

Satu komponen dipakai untuk dua kasus melalui prop `type`.

- `getTodayInputValue` mengoreksi timezone agar input tanggal tidak mundur satu
  hari akibat konversi UTC.
- `buildInvoiceNumber` membentuk `BM-YYYYMMDD-XXXX` atau `BK-YYYYMMDD-XXXX`.
- `useEffect([type])` membuat invoice dan mereset form saat jenis transaksi
  berubah.
- `targetProduct` mencari detail produk yang dipilih.
- `handleSubmitTrx` memvalidasi produk, quantity, pemasok/penerima, dan stok.
- Callback API tetap divalidasi lagi di server dan trigger database.

Validasi berlapis penting:

```text
Frontend: memberi feedback cepat
Server: melindungi API dari request buatan/manual
Database trigger: melindungi integritas stok pada level terakhir
```

### `CategoryMaster.tsx`

- Mode tampilan: daftar, form tambah/edit, atau detail.
- `editingId === null` berarti tambah; jika berisi ID berarti edit.
- Kode dinormalisasi menjadi huruf kapital.
- Duplikasi dicek di frontend dan server.
- Hapus ditolak jika kategori masih dipakai produk.
- Foreign key `ON DELETE RESTRICT` menjadi perlindungan database terakhir.

### `ProductMaster.tsx`

- Menyimpan state filter dan field produk.
- `autofillSKU` memakai kode kategori sebagai prefix.
- `parseNumberInput` mencegah nilai angka di bawah minimum.
- Saat edit, kode SKU dinonaktifkan agar identitas produk stabil.
- Produk yang sudah memiliki transaksi tidak boleh dihapus.
- `getProductTransactions` menampilkan riwayat pada panel detail.

Untuk sistem audit yang lebih ketat, stok pada form edit sebaiknya tidak dapat
diubah langsung. Semua perubahan stok seharusnya hanya melalui transaksi.

### `UserManagement.tsx`

- Secara rancangan, hanya Super Admin yang seharusnya mengelola user.
- Implementasi saat ini belum memasang guard role pada halaman dan belum
  memverifikasi session/role di endpoint server. Jadi pembatasan tersebut masih
  menjadi kebutuhan production, bukan perlindungan yang sudah aktif.
- Password wajib dan dikonfirmasi saat menambah pengguna.
- Email duplikat dicek pada UI dan server.
- Akun bawaan tidak dapat dihapus.
- Akun aktif harus dinonaktifkan sebelum dihapus.

Catatan keamanan: project latihan masih menyimpan password teks biasa. Sistem
production wajib memakai hash seperti Argon2 atau bcrypt, session/JWT yang aman,
otorisasi server per role, rate limiting, dan cookie `HttpOnly`.

### `Reports.tsx`

- `useMemo` mencari tanggal transaksi paling awal.
- Filter menggabungkan tipe, produk, rentang tanggal, dan kata kunci.
- `reduce` menghitung total masuk/keluar setelah filter diterapkan.
- CSV hanya berisi data yang sedang terfilter.
- `escapeCSV` menggandakan tanda kutip agar teks aman di format CSV.
- `window.print()` membuka dialog cetak browser.

### `ProfileSettings.tsx`

- Mode `profile` dan `password` menentukan panel yang terlihat.
- Profil memvalidasi nama dan email sebelum memanggil callback.
- Password memvalidasi field kosong, password lama, panjang, dan konfirmasi.

Catatan: pemeriksaan password lama masih berbasis nilai demo. Pada production,
password lama harus dikirim ke endpoint khusus dan diverifikasi terhadap hash
di server, bukan diperiksa di frontend.

### `SystemDesign.tsx`

- Menyimpan tab aktif dan wireframe aktif.
- Konten blueprint bersifat presentasional.
- Tidak mengakses API atau mengubah database.

## 8. `server.js`

### Koneksi database

`mysql.createPool` membuat kumpulan koneksi yang dapat dipakai ulang. Pool lebih
efisien daripada membuka koneksi baru untuk setiap request.

Environment penting:

| Variable | Fungsi |
| --- | --- |
| `API_PORT` | Port Express, default `4000`. |
| `DB_HOST` | Alamat MySQL. |
| `DB_PORT` | Port MySQL, default `3306`. |
| `DB_USER` | User database. |
| `DB_PASSWORD` | Password database. |
| `DB_NAME` | Nama database. |
| `FRONTEND_URL` | Origin frontend yang diizinkan CORS. |

### Middleware

- `express.json()` membaca request body JSON.
- Middleware CORS memeriksa origin.
- Request `OPTIONS` dijawab `204` untuk preflight browser.
- `next()` meneruskan request ke route berikutnya.

### Helper

| Helper | Fungsi |
| --- | --- |
| `nowSql()` | Membuat timestamp format MySQL. |
| `normalizeText()` | Mengubah nilai menjadi string dan membuang spasi tepi. |
| `normalizeUpper()` | Normalisasi teks lalu ubah ke kapital. |
| `sendDbError()` | Mengirim HTTP 500. |
| `sendBadRequest()` | Mengirim HTTP 400 untuk input salah. |
| `sendConflict()` | Mengirim HTTP 409 untuk konflik aturan/data. |
| `getBootstrapData()` | Mengambil semua data awal frontend. |
| `getUserByEmail()` | Mencari satu user dengan email case-insensitive. |
| `toPublicUser()` | Menghapus password sebelum user dikirim ke browser. |

### Endpoint

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/health` | Memeriksa koneksi API dan database. |
| GET | `/api/bootstrap` | Mengambil kategori, produk, transaksi, dan user. |
| POST | `/api/auth/login` | Memvalidasi login. |
| POST | `/api/categories` | Menambah kategori. |
| PUT | `/api/categories/:id` | Mengubah kategori. |
| DELETE | `/api/categories/:id` | Menghapus kategori kosong. |
| POST | `/api/products` | Menambah produk. |
| PUT | `/api/products/:id` | Mengubah produk. |
| DELETE | `/api/products/:id` | Menghapus produk tanpa transaksi. |
| POST | `/api/transactions` | Mencatat mutasi stok. |
| POST | `/api/users` | Menambah user. |
| PUT | `/api/users/:id` | Mengubah user/password. |
| DELETE | `/api/users/:id` | Menghapus user yang diizinkan. |

Query memakai placeholder `?`:

```js
pool.query('SELECT id FROM products WHERE id = ?', [productId]);
```

Nilai dikirim terpisah dari teks SQL. Ini lebih aman terhadap SQL injection
daripada menyusun query dengan template string.

### Arti status HTTP

| Status | Arti di project |
| --- | --- |
| `200` | Request berhasil. |
| `201` | Data baru berhasil dibuat. |
| `204` | Preflight CORS berhasil tanpa body. |
| `400` | Input tidak lengkap/tidak valid. |
| `401` | Email atau password salah. |
| `403` | Akun nonaktif/tidak diizinkan. |
| `409` | Konflik, misalnya kode duplikat atau stok kurang. |
| `500` | Error database/server. |

## 9. Database dan Trigger

### Relasi

```text
categories (1) ------ (N) products
products   (1) ------ (N) stock_transactions
users berdiri sendiri untuk autentikasi/admin
```

- Satu kategori dapat memiliki banyak produk.
- Satu produk dapat memiliki banyak transaksi.
- `ON DELETE RESTRICT` mencegah parent dihapus saat child masih ada.
- Index mempercepat filter berdasarkan kategori, produk, tipe, dan tanggal.

### Trigger sebelum insert

`trg_stock_transactions_before_insert`:

1. Menolak quantity nol/negatif.
2. Membaca stok produk dengan `FOR UPDATE`.
3. Baris produk dikunci selama transaksi database.
4. Menolak barang keluar yang melebihi stok.

`FOR UPDATE` membantu mencegah dua request bersamaan sama-sama membaca stok lama
dan mengeluarkan barang berlebihan.

### Trigger setelah insert

`trg_stock_transactions_after_insert`:

- Jika `MASUK`, `stock = stock + quantity`.
- Jika `KELUAR`, `stock = stock - quantity`.

Keuntungan trigger: perubahan stok tetap terjadi walaupun transaksi dibuat oleh
API lain atau query SQL manual. Kerugiannya: developer harus mengetahui bahwa
INSERT memiliki efek samping.

### View stok rendah

`vw_low_stock_products` menyatukan produk dan kategori lalu menampilkan produk
di bawah batas stok. View dapat diperlakukan seperti tabel baca:

```sql
SELECT * FROM vw_low_stock_products;
```

## 10. Latihan Mengubah Studi Kasus

Gunakan pola ini saat soal ujian mengganti domain.

### Kasus gudang umum

| Toko buku | Gudang |
| --- | --- |
| Product/buku | Barang |
| Category | Jenis barang |
| Penerbit | Supplier |
| Pelanggan | Divisi/penerima |
| EKSEMPLAR | PCS/KG/LITER |

Struktur program hampir tidak berubah. Ubah label UI, data awal, kategori, dan
satuan.

### Kasus perpustakaan

Perubahan lebih besar:

- `products` menjadi `books`.
- `stock` menjadi jumlah eksemplar tersedia.
- `stock_transactions` menjadi `borrowings`.
- Tambah `member_id`, `borrow_date`, `due_date`, dan `return_date`.
- Tipe transaksi dapat menjadi `PINJAM` dan `KEMBALI`.
- Validasi stok tetap dapat dipakai untuk mencegah peminjaman saat buku habis.

### Kasus apotek

Tambahkan tabel batch karena obat yang sama dapat memiliki tanggal kedaluwarsa
berbeda:

```text
products -> product_batches -> stock_transactions
```

Field tambahan: `batch_number`, `expired_at`, `purchase_price`, dan `supplier_id`.
Barang keluar sebaiknya mengikuti FEFO, yaitu tanggal kedaluwarsa terdekat
keluar lebih dulu.

### Kasus peminjaman aset sekolah

- Produk menjadi aset.
- Quantity sering bernilai satu.
- Tambahkan `asset_condition`, `borrower_id`, `return_deadline`, dan
  `returned_at`.
- Status aset lebih penting daripada total stok: tersedia, dipinjam, rusak,
  atau hilang.

## 11. Pertanyaan Ujian yang Mungkin Muncul

### Mengapa state disimpan di `App`?

Karena banyak halaman membutuhkan data yang sama. Dengan satu sumber state,
perubahan transaksi langsung terlihat di dashboard, inventory, produk, dan
laporan.

### Mengapa validasi dilakukan tiga kali?

Frontend untuk pengalaman pengguna, server untuk keamanan API, dan database
untuk integritas data.

### Mengapa tidak mengubah stok langsung di React?

State browser bukan sumber kebenaran permanen. Stok harus diubah atomik di
database agar konsisten untuk semua pengguna.

### Apa beda props dan state?

Props dikirim dari parent dan dibaca komponen. State dimiliki komponen dan dapat
diubah melalui setter.

### Mengapa memakai `Omit` dan `Partial`?

- `Omit<Product, 'id'>` membuat tipe baru tanpa field tertentu.
- `Partial<Product>` membuat semua field opsional untuk operasi edit.

### Mengapa memakai `async/await`?

Request jaringan dan query database membutuhkan waktu. `await` menunggu hasil
tanpa memblokir seluruh aplikasi.

### Apa fungsi `try/catch/finally`?

- `try`: kode yang mungkin gagal.
- `catch`: menangani kegagalan.
- `finally`: selalu berjalan, biasanya untuk mematikan loading.

## 12. Titik Peningkatan Production

Project ini sesuai untuk latihan, tetapi sebelum production perlu:

1. Hash password dan endpoint autentikasi berbasis session/JWT.
2. Otorisasi role pada setiap endpoint sensitif.
3. Pindahkan URL API ke environment variable.
4. Gunakan transaction database eksplisit untuk operasi penting.
5. Tambahkan pagination untuk tabel besar.
6. Tambahkan schema validation seperti Zod/Joi.
7. Tambahkan test unit, API integration test, dan end-to-end test.
8. Hindari edit stok langsung dari form produk.
9. Samakan aturan stok rendah frontend dan SQL.
10. Tambahkan audit log pengguna yang membuat perubahan.

## 13. Urutan Belajar yang Disarankan

1. Baca `types.ts` untuk memahami bentuk data.
2. Baca `main.tsx` untuk melihat titik masuk.
3. Baca state dan `apiRequest` di `App.tsx`.
4. Ikuti satu alur login dari `Login.tsx` sampai route Express.
5. Ikuti satu alur transaksi sampai trigger SQL.
6. Pelajari `filter`, `map`, `reduce`, dan `sort` di dashboard/laporan.
7. Pelajari pola CRUD kategori, lalu bandingkan dengan produk dan user.
8. Coba ganti studi kasus dengan tabel pada bagian latihan.

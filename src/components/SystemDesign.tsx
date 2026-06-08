/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Database, 
  GitCommit, 
  Cpu, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Key,
  Download,
  Upload,
  BarChart4,
  Check
} from 'lucide-react';

export default function SystemDesign() {
  const [activeTab, setActiveTab] = useState<'halaman' | 'wireframe' | 'database' | 'alur' | 'teknologi'>('halaman');
  const [activeWireframe, setActiveWireframe] = useState<'login' | 'dashboard' | 'inventory' | 'forms' | 'users'>('dashboard');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-indigo-950 p-6 md:p-8 text-white relative">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none hidden md:block">
          <Database size={240} className="translate-x-12 translate-y-6" />
        </div>
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/20 backdrop-blur-xs mb-3">
            <Layers size={12} /> Blueprint Arsitektur Aplikasi
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Rancangan Sistem Toko Buku JWP</h1>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
            Dokumentasi lengkap desain basis data, deskripsi modul antarmuka, alur proses transaksi inventori, dan rekomendasi tumpukan teknologi (technology stack) berskala industri.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-2 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveTab('halaman');
            setActiveWireframe('dashboard');
          }}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'halaman'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={16} />
          1-2. Deskripsi & Komponen Halaman
        </button>
        <button
          onClick={() => setActiveTab('wireframe')}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'wireframe'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers size={16} />
          Wireframe & Tata Letak Halaman
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'database'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database size={16} />
          3-5. Struktur & Relasi Database
        </button>
        <button
          onClick={() => setActiveTab('alur')}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'alur'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GitCommit size={16} />
          6-9. Alur Proses Sistem
        </button>
        <button
          onClick={() => setActiveTab('teknologi')}
          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'teknologi'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Cpu size={16} />
          10. Saran Teknologi (Laravel & Tailwind)
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 md:p-8">
        
        {/* TAB 1: DESKRIPSI & KOMPONEN HALAMAN */}
        {activeTab === 'halaman' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-6">Penjelasan 14 Halaman Sistem Inventori</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card Halaman */}
              {[
                {
                  id: 1,
                  title: "1. Halaman Login",
                  desc: "Gerbang utama autentikasi admin sebelum mengakses sistem inventori.",
                  components: ["Logo Toko", "Form Email & Password", "Validasi Error", "Ingat Saya", "Tombol Masuk"]
                },
                {
                  id: 2,
                  title: "2. Dashboard Utama",
                  desc: "Pusat informasi ringkas kinerja toko, visualisasi real-time, dan status kritis barang.",
                  components: ["Card Statistik (Total Barang, Masuk, Keluar)", "Grafik Tren Bulanan", "Tabel 5 Stok Terendah & Tertinggi", "Indikator Alert Stok Rendah"]
                },
                {
                  id: 3,
                  title: "3. Persediaan Buku",
                  desc: "Halaman monitoring real-time seluruh stok buku, referensi, dan stationery beserta status ketersediaannya.",
                  components: ["Daftar Tabel Stok", "Pencarian Cepat", "Status indikator (Tersedia / Rendah)", "Ekspor data persediaan"]
                },
                {
                  id: 4,
                  title: "4. Form Buku Masuk",
                  desc: "Form pencatatan transaksi penambahan stok buku yang dipasok oleh penerbit atau distributor.",
                  components: ["Nomor Invoice Otomatis", "Dropdown Pilih Produk", "Input Jumlah Masuk", "Input Pemasok/Distributor", "Pemberitahuan Berhasil"]
                },
                {
                  id: 5,
                  title: "5. Form Buku Keluar",
                  desc: "Form pencatatan pengurangan stok untuk penjualan pelanggan, member, sekolah, atau komunitas.",
                  components: ["Nomor Invoice BK", "Dropdown Pilih Barang", "Cek Validasi Stok Sisa", "Input Jumlah Keluar", "Input Penerima/Instansi", "Tombol Verifikasi"]
                },
                {
                  id: 6,
                  title: "6. Master Kategori Barang",
                  desc: "Manajemen pengelompokan jenis buku dan produk seperti fiksi, pendidikan, referensi, dan stationery.",
                  components: ["Tabel Kategori", "Pencarian", "Tombol Tambah", "Aksi Edit & Hapus Kategori"]
                },
                {
                  id: 7,
                  title: "7. Form Tambah/Edit Kategori",
                  desc: "Input data penamaan kategori baru untuk penggolongan katalog toko buku JWP secara dinamis.",
                  components: ["Kode Kategori Auto-generasi", "Input Nama Kategori", "Input Deskripsi Kategori", "Tombol Simpan & Batal"]
                },
                {
                  id: 8,
                  title: "8. Master Daftar Buku",
                  desc: "Manajemen katalog seluruh item barang yang dapat dijual atau diadakan dalam toko.",
                  components: ["Tabel Katalog Barang lengkap harga satuan", "Filter Kategori", "Aksi Detail, Ubah, Hapus"]
                },
                {
                  id: 9,
                  title: "9. Form Tambah/Edit Barang",
                  desc: "Input spesifikasi buku atau produk mulai dari harga, satuan unit, hingga batas stok minimum.",
                  components: ["Input Kode SKU", "Pilih Kategori", "Nama Buku/Produk", "Satuan (Eksemplar, Pack, Set)", "Initial Stok & Harga", "Batas Stok Rendah"]
                },
                {
                  id: 10,
                  title: "10. Manajemen Pengguna",
                  desc: "Pengaturan akun admin & super admin yang berhak melakukan pengelolaan operasional harian.",
                  components: ["Daftar Akun", "Status Keaktifan", "Role Permission", "Aksi Suspend/Edit"]
                },
                {
                  id: 11,
                  title: "11. Form Tambah/Edit Pengguna",
                  desc: "Form penugasan admin atau staff toko baru dengan enkripsi kredensial yang aman.",
                  components: ["Input Nama", "Email Instansi", "Pilihan Dropdown Role (Admin / Super Admin)", "Password Awal", "Status Aktif/Mati"]
                },
                {
                  id: 12,
                  title: "12. Laporan Persediaan",
                  desc: "Halaman kustomisasi ekspor laporan arus transaksi toko buku periodik berdasarkan filter.",
                  components: ["Filter Jenis (Masuk/Keluar/Semua)", "Tanggal Mulai & Akhir", "Tabel Rekap Transaksi", "Tombol Print & Ekspor CSV"]
                },
                {
                  id: 13,
                  title: "13. Ubah Profil",
                  desc: "Pembaruan informasi dasar milik admin yang sedang login ke sistem.",
                  components: ["Upload Foto Avatar", "Ubah Nama Pengguna", "Ubah Alamat Email", "Indikator Sesi Login"]
                },
                {
                  id: 14,
                  title: "14. Ubah Password",
                  desc: "Proteksi keamanan sandi akun periodik untuk mencegah peretasan akses sistem.",
                  components: ["Input Password Lama", "Input Password Baru", "Input Konfirmasi Sandi Baru", "Validasi Kekuatan Password"]
                }
              ].map((h) => (
                <div key={h.id} className="p-5 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-2xs transition-all bg-slate-50/30">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">{h.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Halaman {h.id}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{h.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {h.components.map((comp, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* TAB 2: STRUKTUR & RELASI DATABASE */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-6">Skema Database Relasional JWP Inventory</h2>
            
            {/* Database Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Table 1: users */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="bg-slate-900 text-white p-3 font-mono text-xs flex justify-between items-center">
                  <span>📂 Table: <strong className="text-emerald-400">users</strong></span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Autentikasi & Akun</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 font-semibold grid grid-cols-3">
                    <span>Field Name</span>
                    <span>Data Type</span>
                    <span>Constraint</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-indigo-600 font-semibold">id</span>
                    <span>BIGINT (unsigned)</span>
                    <span className="text-[10px] font-bold text-amber-600">PRIMARY KEY, AUTO_INCREMENT</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">name</span>
                    <span>VARCHAR(255)</span>
                    <span>NOT NULL</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">email</span>
                    <span>VARCHAR(255)</span>
                    <span className="text-[10px] text-teal-600 font-bold">UNIQUE, INDEX</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 text-slate-400">
                    <span className="font-mono">password</span>
                    <span>VARCHAR(255)</span>
                    <span>NOT NULL (Encrypted HASH)</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">role</span>
                    <span>ENUM('Admin', 'Super Admin')</span>
                    <span>DEFAULT 'Admin'</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">status</span>
                    <span>ENUM('Aktif', 'Nonaktif')</span>
                    <span>DEFAULT 'Aktif'</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">avatar</span>
                    <span>VARCHAR(255)</span>
                    <span className="text-slate-400">NULLABLE</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 text-slate-400">
                    <span className="font-mono">timestamps</span>
                    <span>TIMESTAMP</span>
                    <span>created_at, updated_at</span>
                  </div>
                </div>
              </div>

              {/* Table 2: categories */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="bg-slate-900 text-white p-3 font-mono text-xs flex justify-between items-center">
                  <span>📂 Table: <strong className="text-emerald-400">categories</strong></span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Master Kategori</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 font-semibold grid grid-cols-3">
                    <span>Field Name</span>
                    <span>Data Type</span>
                    <span>Constraint</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-indigo-600 font-semibold">id</span>
                    <span>BIGINT (unsigned)</span>
                    <span className="text-[10px] font-bold text-amber-600">PRIMARY KEY, AUTO_INCREMENT</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">code</span>
                    <span>VARCHAR(50)</span>
                    <span className="text-[10px] text-teal-600 font-bold">UNIQUE, INDEX</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">name</span>
                    <span>VARCHAR(150)</span>
                    <span>NOT NULL</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">description</span>
                    <span>TEXT</span>
                    <span className="text-slate-400">NULLABLE</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 text-slate-400">
                    <span className="font-mono">timestamps</span>
                    <span>TIMESTAMP</span>
                    <span>created_at, updated_at</span>
                  </div>
                </div>
              </div>

              {/* Table 3: products */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="bg-slate-900 text-white p-3 font-mono text-xs flex justify-between items-center">
                  <span>📂 Table: <strong className="text-emerald-400">products</strong></span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Master Katalog Barang</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 font-semibold grid grid-cols-3">
                    <span>Field Name</span>
                    <span>Data Type</span>
                    <span>Constraint</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-indigo-600 font-semibold">id</span>
                    <span>BIGINT (unsigned)</span>
                    <span className="text-[10px] font-bold text-amber-600">PRIMARY KEY, AUTO_INCREMENT</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">code</span>
                    <span>VARCHAR(100)</span>
                    <span className="text-[10px] text-teal-600 font-bold">UNIQUE, INDEX</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">name</span>
                    <span>VARCHAR(255)</span>
                    <span>NOT NULL, INDEX</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 bg-indigo-50/20">
                    <span className="font-mono text-slate-900 font-semibold">category_id</span>
                    <span>BIGINT (unsigned)</span>
                    <span className="text-[10px] font-bold text-indigo-600">FOREIGN KEY (categories.id), ON DELETE RESTRICT</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-green-700 font-medium">stock</span>
                    <span>INT</span>
                    <span>DEFAULT 0, NOT NULL</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">unit_type</span>
                    <span>VARCHAR(50)</span>
                    <span>NOT NULL (EKSEMPLAR, PACK, SET, dll)</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 text-amber-700">
                    <span className="font-mono">min_stock</span>
                    <span>INT</span>
                    <span>DEFAULT 10 (Stok Kritis)</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono font-medium">price</span>
                    <span>DECIMAL(15,2)</span>
                    <span>NOT NULL</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 text-slate-400">
                    <span className="font-mono">timestamps</span>
                    <span>TIMESTAMP</span>
                    <span>created_at, updated_at</span>
                  </div>
                </div>
              </div>

              {/* Table 4: transactions */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="bg-slate-900 text-white p-3 font-mono text-xs flex justify-between items-center">
                  <span>📂 Table: <strong className="text-emerald-400">transactions</strong></span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Mutasi Stok Toko Buku</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 font-semibold grid grid-cols-3">
                    <span>Field Name</span>
                    <span>Data Type</span>
                    <span>Constraint</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-indigo-600 font-semibold">id</span>
                    <span>BIGINT (unsigned)</span>
                    <span className="text-[10px] font-bold text-amber-600">PRIMARY KEY, AUTO_INCREMENT</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">invoice_number</span>
                    <span>VARCHAR(100)</span>
                    <span className="text-[10px] text-teal-600 font-bold">UNIQUE, INDEX</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 font-semibold text-rose-600">
                    <span className="font-mono">type</span>
                    <span>ENUM('MASUK', 'KELUAR')</span>
                    <span>NOT NULL</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 bg-indigo-50/20">
                    <span className="font-mono text-slate-900 font-semibold">product_id</span>
                    <span>BIGINT (unsigned)</span>
                    <span className="text-[10px] font-bold text-indigo-600">FOREIGN KEY (products.id), RESTRICT</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">quantity</span>
                    <span>INT</span>
                    <span>NOT NULL (&gt; 0)</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-slate-700">reference_person</span>
                    <span>VARCHAR(255)</span>
                    <span>NOT NULL (Pemasok / Pelanggan)</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono text-slate-700">transaction_date</span>
                    <span>DATE</span>
                    <span>NOT NULL, INDEX</span>
                  </div>
                  <div className="p-3 grid grid-cols-3">
                    <span className="font-mono">notes</span>
                    <span>TEXT</span>
                    <span className="text-slate-400">NULLABLE</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 text-slate-400">
                    <span className="font-mono">timestamps</span>
                    <span>TIMESTAMP</span>
                    <span>created_at, updated_at</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Entity Relationship Diagram representation */}
            <div className="bg-slate-55 bg-indigo-950/5 border border-indigo-100 p-6 rounded-2xl md:mt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4">
                <GitCommit className="text-indigo-600" size={18} /> Visualisasi Relasi Antar Tabel (Entity Relations)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <div className="font-mono font-bold text-indigo-700 border-b pb-2 mb-2">categories</div>
                  <span className="text-slate-500 font-mono">id (PK)</span>
                  <div className="my-2 text-indigo-600 font-bold text-base">&darr;</div>
                  <div className="text-[10px] bg-indigo-50 text-indigo-700 font-bold py-1 px-2 rounded inline-block">One to Many (1 : N)</div>
                  <div className="my-2 text-indigo-600 font-bold text-base">&darr;</div>
                  <span className="text-slate-500 font-mono text-green-700">products.category_id (FK)</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <div className="font-mono font-bold text-indigo-700 border-b pb-2 mb-2">products</div>
                  <span className="text-slate-500 font-mono">id (PK)</span>
                  <div className="my-2 text-indigo-600 font-bold text-base">&darr;</div>
                  <div className="text-[10px] bg-indigo-50 text-indigo-700 font-bold py-1 px-2 rounded inline-block">One to Many (1 : N)</div>
                  <div className="my-2 text-indigo-600 font-bold text-base">&darr;</div>
                  <span className="text-slate-500 font-mono text-green-700">transactions.product_id (FK)</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <h4 className="font-bold text-slate-900 mb-2">Aturan Integritas Data (Integrity Rules):</h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-650 leading-relaxed text-[11px]">
                    <li><strong>ON DELETE RESTRICT</strong> pada <code className="bg-slate-100 p-0.5 rounded">products.category_id</code> mencegah kategori terhapus saat masih digunakan produk.</li>
                    <li><strong>RESTRICT</strong> pada <code className="bg-slate-100 p-0.5 rounded">transactions.product_id</code> mencegah produk yang sudah memiliki riwayat transaksi sengaja/tidak sengaja dihapus dari katalog fisik.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALUR PROSES SISTEM */}
        {activeTab === 'alur' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-6">Alur Proses Toko Buku & Transaksi</h2>
            
            {/* 6. Alur LOGIN */}
            <div className="relative pl-6 border-l-2 border-slate-200">
              <span className="absolute -left-[11px] top-0.5 bg-indigo-600 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">1</span>
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">Alur Proses Autentikasi Admin (Login)</h3>
              <p className="mt-1 text-xs text-slate-500">Prosedur masuk pintu gerbang utama aplikasi yang terproteksi.</p>
              
              <div className="mt-4 flex flex-col md:flex-row items-stretch gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 1: Input Kredensial</strong>
                  <span className="text-slate-600 text-[11px]">Admin memasukkan email @toko-jwp.com dan sandi pada form login aman.</span>
                </div>
                <div className="flex items-center justify-center text-slate-400">
                  <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 2: Validasi & Cek DB</strong>
                  <span className="text-slate-600 text-[11px]">Backend memeriksa email, sandi, dan status akun aktif pada tabel users.</span>
                </div>
                <div className="flex items-center justify-center text-slate-400">
                  <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 3: Aktifkan Sesi Admin</strong>
                  <span className="text-slate-600 text-[11px]">Jika akun aktif, data admin disimpan sebagai sesi aplikasi dan diarahkan ke Dashboard.</span>
                </div>
              </div>
            </div>

            {/* 7. Alur BARANG MASUK */}
            <div className="relative pl-6 border-l-2 border-slate-200">
              <span className="absolute -left-[11px] top-0.5 bg-indigo-600 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">2</span>
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">Alur Proses Buku Masuk (Stok Bertambah)</h3>
              <p className="mt-1 text-xs text-slate-500">Penerimaan pasokan buku dari pemasok, penerbit, atau distributor yang menaikkan persediaan fisik.</p>
              
              <div className="mt-4 flex flex-col md:flex-row items-stretch gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 1: Input Invoice & Qty</strong>
                  <span className="text-slate-600 text-[11px]">Petunjuk memasukkan data buku/produk, jumlah, serta data pemasok pengirim.</span>
                </div>
                <div className="flex items-center justify-center text-slate-400">
                  <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 2: Database Transaction</strong>
                  <span className="text-slate-600 text-[11px]">Tabel <code className="bg-slate-100 p-0.5">transactions</code> mencatat mutasi berkas riwayat baru.</span>
                </div>
                <div className="flex items-center justify-center text-slate-400">
                  <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex-1">
                  <strong className="block text-emerald-900 mb-1">Step 3: Trigger Auto-Increment</strong>
                  <span className="text-emerald-700 text-[11px] font-medium">Stok pada tabel `products` langsung ditambahkan otomatis secara atomic.</span>
                </div>
              </div>
            </div>

            {/* 8. Alur BARANG KELUAR */}
            <div className="relative pl-6 border-l-2 border-slate-200 bg-red-50/20 p-4 rounded-xl">
              <span className="absolute -left-[11px] top-4 bg-indigo-700 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">3</span>
              <h3 className="font-bold text-rose-950 text-base flex items-center gap-2">Alur Proses Buku Keluar (Stok Berkurang + Cek Validasi)</h3>
              <p className="mt-1 text-xs text-rose-800">Operasional penjualan atau pengeluaran buku dengan validasi saldo stok agar terhindar dari stok minus.</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-3xs">
                  <strong className="block text-slate-900 mb-1">1. Isi Form Logistik</strong>
                  <span className="text-slate-600 text-[11px]">Pilih barang, isi penerima, dan masukkan jumlah keluar yang diinginkan.</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <strong className="block text-amber-900 mb-1 flex items-center gap-1"><AlertCircle size={14} /> 2. Cek Sisa Saldo Stok</strong>
                  <span className="text-amber-700 text-[11px]">Sistem mendeteksi apakah: <br /> <code className="bg-white/50 px-1 py-0.5 rounded text-amber-950">QtyKeluar &gt; StokTersedia</code>.</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <strong className="block text-rose-950 mb-1 flex items-center gap-1"><AlertCircle size={14} strokeWidth={3} /> 3. Tolak Jika Kurang</strong>
                  <span className="text-rose-800 text-[11px]">Jika stok tidak mencukupi, simpan ditolak dan memunculkan pop-up kesalahan merah seketika.</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <strong className="block text-emerald-900 mb-1">4. Deduksi & Kurangi Stok</strong>
                  <span className="text-emerald-700 text-[11px]">Bila aman, transaksi diterbitkan, dan jumlah stok barang dikurangi secara otomatis.</span>
                </div>
              </div>
            </div>

            {/* 9. Alur LAPORAN */}
            <div className="relative pl-6 border-l-2 border-slate-200">
              <span className="absolute -left-[11px] top-0.5 bg-indigo-600 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">4</span>
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">Alur Proses Penyusunan Laporan Mutasi</h3>
              <p className="mt-1 text-xs text-slate-500">Penyusunan akuntabilitas pembukuan barang untuk pemilik toko / audit harian.</p>
              
              <div className="mt-4 flex flex-col md:flex-row items-stretch gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 1: Set Filter Rentang</strong>
                  <span className="text-slate-600 text-[11px]">Gunakan opsi tipe transaksi (Masuk, Keluar, Semua) dan tentukan tanggal target awal-akhir.</span>
                </div>
                <div className="flex items-center justify-center text-slate-400">
                  <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 2: Kompilasi & Agregasi</strong>
                  <span className="text-slate-600 text-[11px]">DB melakukan filtering query dengan kondisi SQL `WHERE` dan melakukan join barang.</span>
                </div>
                <div className="flex items-center justify-center text-slate-400">
                  <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                  <strong className="block text-slate-900 mb-1">Step 3: Print / Ekspor CSV</strong>
                  <span className="text-slate-600 text-[11px]">Laporan dapat dicetak atau diunduh sebagai data mentah CSV untuk evaluasi pimpinan.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: SARAN TEKNOLOGI */}
        {activeTab === 'teknologi' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-6">Rekomendasi Arsitektur Teknologi Toko Buku JWP</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
              
              {/* Laravel framework card */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-red-50/10">
                <div className="text-red-600 border border-red-200 bg-red-50 rounded-lg p-2.5 w-max mb-4">
                  <span className="font-extrabold text-sm font-mono">LARAVEL 11</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">Mengapa Back-end Laravel?</h3>
                <ul className="space-y-2 text-slate-650 leading-relaxed text-[11px]">
                  <li className="flex items-start gap-1"><Check size={14} className="text-red-600 shrink-0 mt-0.5" /> <strong>Eloquent ORM</strong> yang memudahkan relasi database rumit seperti <code className="bg-red-50 rounded px-1 text-red-700">belongsTo</code> dan <code className="bg-red-50 rounded px-1 text-red-700">hasMany</code>.</li>
                  <li className="flex items-start gap-1"><Check size={14} className="text-red-600 shrink-0 mt-0.5" /> <strong>Database Transaction</strong> built-in (<code className="bg-red-50 rounded px-1 text-red-700">DB::transaction</code>) guna mencegah corrupt jika proses stok & transaksi mandek di tengah jalan.</li>
                  <li className="flex items-start gap-1"><Check size={14} className="text-red-600 shrink-0 mt-0.5" /> Keamanan autentikasi instan bawaan menggunakan <strong>Laravel Breeze</strong> atau <strong>Sanctum</strong>.</li>
                </ul>
              </div>

              {/* Tailwind framework card */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-sky-50/10">
                <div className="text-sky-600 border border-sky-200 bg-sky-50 rounded-lg p-2.5 w-max mb-4">
                  <span className="font-extrabold text-sm font-mono text-cyan-500">TAILWIND CSS</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">Mengapa Front-end Tailwind?</h3>
                <ul className="space-y-2 text-slate-650 leading-relaxed text-[11px]">
                  <li className="flex items-start gap-1"><Check size={14} className="text-sky-600 shrink-0 mt-0.5" /> <strong>Sistem Grid & Flexbox</strong> responsif yang fleksibel agar berjalan mulus di HP / tablet staff toko.</li>
                  <li className="flex items-start gap-1"><Check size={14} className="text-sky-600 shrink-0 mt-0.5" /> Custom Utility Classes yang sangat ringan, mengurangi ukuran bundle CSS produksi secara signifikan.</li>
                  <li className="flex items-start gap-1"><Check size={14} className="text-sky-600 shrink-0 mt-0.5" /> Visual palette warna yang konsisten untuk memberikan suasana premium minimalis tanpa beban aset gambar.</li>
                </ul>
              </div>

              {/* Database & Infrastructure card */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-emerald-50/10">
                <div className="text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-lg p-2.5 w-max mb-4">
                  <span className="font-extrabold text-sm font-mono">DATABASE Stack</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">Basis Data & Pendukung</h3>
                <ul className="space-y-2 text-slate-650 leading-relaxed text-[11px]">
                  <li className="flex items-start gap-1"><Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /> <strong>MariaDB / PostgreSQL</strong> sebagai basis data relasional andal untuk operasional inventori berskala besar.</li>
                  <li className="flex items-start gap-1"><Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /> <strong>Vite</strong> sebagai modul bundler front-end kilat yang optimal untuk membangun aset Javascript modern.</li>
                  <li className="flex items-start gap-1"><Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /> Library <strong>maatwebsite/excel</strong> dan <strong>barryvdh/laravel-dompdf</strong> untuk melayani print berkas invoice dan ekspor laporan mutasi.</li>
                </ul>
              </div>

            </div>
            
            {/* Visual PHP Laravel controller code snippet to show real production standard */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-6 bg-slate-900 text-slate-300 p-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-slate-400 text-[11px] flex items-center gap-1"><FileText size={12} /> app/Http/Controllers/StockController.php (Sample Logic)</span>
                <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-950 px-2 py-0.5 rounded">Bukan Mock • Standard Laravel</span>
              </div>
              <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[11px] text-emerald-400">
{`<?php
namespace App\\Http\\Controllers;
use App\\Models\\Product;
use App\\Models\\StockTransaction;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class StockController extends Controller {
    public function storeBarangKeluar(Request $request) {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'reference_person' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $product = Product::lockForUpdate()->findOrFail($request->product_id);

            // ATURAN SISTEM: Amankan saldo stok
            if ($product->stock < $request->quantity) {
                return response()->json(['error' => 'Saldo stok tidak mencukupi!'], 422);
            }

            // Kurangi stok produk secara langsung
            $product->decrement('stock', $request->quantity);

            // Rekam transaksi mutasi keluar
            StockTransaction::create([
                'invoice_number' => 'BK-' . now()->format('Ymd') . '-' . rand(100, 999),
                'type' => 'KELUAR',
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'reference_person' => $request->reference_person,
                'transaction_date' => now()->toDateString(),
            ]);

            return response()->json(['success' => 'Transaksi barang keluar berhasil disimpan!']);
        });
    }
}`}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Product, StockTransaction, User } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    code: 'FIK',
    name: 'Fiksi & Sastra',
    description: 'Novel populer, sastra Indonesia, terjemahan, dan bacaan best seller.',
    created_at: '2026-05-01 08:00:00',
  },
  {
    id: 'cat-2',
    code: 'EDU',
    name: 'Pendidikan & Sekolah',
    description: 'Buku pelajaran, latihan soal, modul sekolah, dan buku penunjang belajar.',
    created_at: '2026-05-01 08:30:00',
  },
  {
    id: 'cat-3',
    code: 'KID',
    name: 'Anak & Remaja',
    description: 'Buku cerita anak, komik edukasi, aktivitas mewarnai, dan bacaan remaja.',
    created_at: '2026-05-01 09:00:00',
  },
  {
    id: 'cat-4',
    code: 'BIS',
    name: 'Bisnis & Pengembangan Diri',
    description: 'Buku bisnis, manajemen, finansial, produktivitas, dan motivasi.',
    created_at: '2026-05-02 10:00:00',
  },
  {
    id: 'cat-5',
    code: 'REF',
    name: 'Referensi & Akademik',
    description: 'Kamus, ensiklopedia, buku kampus, dan referensi profesional.',
    created_at: '2026-05-02 11:30:00',
  },
  {
    id: 'cat-6',
    code: 'STA',
    name: 'Stationery & Perlengkapan',
    description: 'Buku tulis, pulpen, pensil, map, kertas, dan perlengkapan sekolah/kantor.',
    created_at: '2026-05-03 14:00:00',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'FIK-LB01',
    name: 'Novel Laut Bercerita',
    category_id: 'cat-1',
    stock: 45,
    unit_type: 'EKSEMPLAR',
    min_stock: 10,
    price: 115000,
    created_at: '2026-05-01 09:12:00',
  },
  {
    id: 'prod-2',
    code: 'FIK-BS02',
    name: 'Novel Best Seller Terjemahan',
    category_id: 'cat-1',
    stock: 8, // LOW STOCK!
    unit_type: 'EKSEMPLAR',
    min_stock: 10,
    price: 98000,
    created_at: '2026-05-01 09:15:00',
  },
  {
    id: 'prod-3',
    code: 'EDU-MTK10',
    name: 'Buku Latihan Matematika SMA Kelas 10',
    category_id: 'cat-2',
    stock: 125, // HIGH STOCK
    unit_type: 'EKSEMPLAR',
    min_stock: 10,
    price: 72000,
    created_at: '2026-05-01 09:45:00',
  },
  {
    id: 'prod-4',
    code: 'EDU-TRY12',
    name: 'Paket Try Out UTBK 2026',
    category_id: 'cat-2',
    stock: 5, // LOW STOCK!
    unit_type: 'SET',
    min_stock: 10,
    price: 135000,
    created_at: '2026-05-01 09:48:00',
  },
  {
    id: 'prod-5',
    code: 'KID-CRT01',
    name: 'Cerita Anak Nusantara Bergambar',
    category_id: 'cat-3',
    stock: 85,
    unit_type: 'EKSEMPLAR',
    min_stock: 10,
    price: 58000,
    created_at: '2026-05-01 10:10:00',
  },
  {
    id: 'prod-6',
    code: 'KID-KOM02',
    name: 'Komik Edukasi Sains Anak',
    category_id: 'cat-3',
    stock: 35,
    unit_type: 'EKSEMPLAR',
    min_stock: 10,
    price: 46000,
    created_at: '2026-05-01 10:15:00',
  },
  {
    id: 'prod-7',
    code: 'BIS-AH01',
    name: 'Atomic Habits Edisi Terjemahan',
    category_id: 'cat-4',
    stock: 4, // LOW STOCK!
    unit_type: 'EKSEMPLAR',
    min_stock: 10,
    price: 108000,
    created_at: '2026-05-02 10:45:00',
  },
  {
    id: 'prod-8',
    code: 'REF-KAM01',
    name: 'Kamus Inggris Indonesia Lengkap',
    category_id: 'cat-5',
    stock: 18,
    unit_type: 'EKSEMPLAR',
    min_stock: 10,
    price: 89000,
    created_at: '2026-05-02 12:00:00',
  },
  {
    id: 'prod-9',
    code: 'STA-BT38',
    name: 'Buku Tulis 38 Lembar Isi 10',
    category_id: 'cat-6',
    stock: 4500, // HIGH STOCK!
    unit_type: 'PACK',
    min_stock: 100, // special threshold
    price: 42000,
    created_at: '2026-05-03 14:15:00',
  },
  {
    id: 'prod-10',
    code: 'STA-PEN01',
    name: 'Pulpen Gel Hitam Box Isi 12',
    category_id: 'cat-6',
    stock: 7, // LOW STOCK!
    unit_type: 'BOX',
    min_stock: 10,
    price: 36000,
    created_at: '2026-05-03 14:20:00',
  }
];

export const INITIAL_TRANSACTIONS: StockTransaction[] = [
  // Masuk
  {
    id: 'trx-1',
    invoice_number: 'BM-20260510-001',
    type: 'MASUK',
    product_id: 'prod-1',
    quantity: 50,
    reference_person: 'Distributor Buku Nusantara',
    transaction_date: '2026-05-10',
    notes: 'Pengiriman stok novel mingguan',
    created_at: '2026-05-10 09:30:00',
  },
  {
    id: 'trx-2',
    invoice_number: 'BM-20260512-001',
    type: 'MASUK',
    product_id: 'prod-3',
    quantity: 100,
    reference_person: 'Penerbit Edukasi Mandiri',
    transaction_date: '2026-05-12',
    notes: 'Restock buku latihan sekolah',
    created_at: '2026-05-12 10:15:00',
  },
  {
    id: 'trx-3',
    invoice_number: 'BM-20260515-001',
    type: 'MASUK',
    product_id: 'prod-6',
    quantity: 40,
    reference_person: 'Distributor Komik Edukasi',
    transaction_date: '2026-05-15',
    notes: 'Restock komik edukasi anak',
    created_at: '2026-05-15 11:00:00',
  },
  {
    id: 'trx-4',
    invoice_number: 'BM-20260520-001',
    type: 'MASUK',
    product_id: 'prod-9',
    quantity: 5000,
    reference_person: 'Pemasok Stationery Sentosa',
    transaction_date: '2026-05-20',
    notes: 'Pengadaan buku tulis awal semester',
    created_at: '2026-05-20 15:45:00',
  },
  // Keluar
  {
    id: 'trx-5',
    invoice_number: 'BK-20260522-001',
    type: 'KELUAR',
    product_id: 'prod-1',
    quantity: 5,
    reference_person: 'Pelanggan Member - Hendra Wijaya',
    transaction_date: '2026-05-22',
    notes: 'Pembelian novel untuk koleksi pribadi',
    created_at: '2026-05-22 13:00:00',
  },
  {
    id: 'trx-6',
    invoice_number: 'BK-20260525-001',
    type: 'KELUAR',
    product_id: 'prod-9',
    quantity: 500,
    reference_person: 'Sekolah Cendekia Abadi',
    transaction_date: '2026-05-25',
    notes: 'Pembelian perlengkapan semester baru',
    created_at: '2026-05-25 14:30:00',
  },
  {
    id: 'trx-7',
    invoice_number: 'BK-20260528-001',
    type: 'KELUAR',
    product_id: 'prod-6',
    quantity: 5,
    reference_person: 'Pelanggan Retail - Siti Rahma',
    transaction_date: '2026-05-28',
    notes: 'Pembelian komik edukasi anak',
    created_at: '2026-05-28 10:00:00',
  },
  {
    id: 'trx-8',
    invoice_number: 'BK-20260601-001',
    type: 'KELUAR',
    product_id: 'prod-4',
    quantity: 15,
    reference_person: 'Bimbel Prestasi Cilandak',
    transaction_date: '2026-06-01',
    notes: 'Paket try out untuk kelas persiapan',
    created_at: '2026-06-01 11:15:00',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Budi Santoso',
    email: 'admin@toko-jwp.com',
    role: 'Super Admin',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'user-2',
    name: 'Ahmad Wijaya',
    email: 'ahmad@toko-jwp.com',
    role: 'Admin',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: 'user-3',
    name: 'Siti Rahmawati',
    email: 'siti@toko-jwp.com',
    role: 'Admin',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  }
];

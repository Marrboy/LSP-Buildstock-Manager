/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Search, 
  X, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Product, Category, StockTransaction } from '../types';

interface ProductMasterProps {
  products: Product[];
  categories: Category[];
  transactions: StockTransaction[];
  onAddProduct: (prod: Omit<Product, 'id' | 'created_at'>) => void;
  onEditProduct: (id: string, updated: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductMaster({ 
  products, 
  categories, 
  transactions,
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}: ProductMasterProps) {
  
  const [search, setSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Slide form state
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [unitType, setUnitType] = useState('EKSEMPLAR');
  const [price, setPrice] = useState<number>(50000);
  const [minStock, setMinStock] = useState<number>(10);
  
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingId(null);
    setDetailProduct(null);
    setCode('');
    setName('');
    setCategoryId(categories[0]?.id || '');
    setStock(0);
    setUnitType('EKSEMPLAR');
    setPrice(50000);
    setMinStock(10);
    setErrorLocal(null);
    setIsOpenForm(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingId(prod.id);
    setDetailProduct(null);
    setCode(prod.code);
    setName(prod.name);
    setCategoryId(prod.category_id);
    setStock(prod.stock);
    setUnitType(prod.unit_type);
    setPrice(prod.price);
    setMinStock(prod.min_stock);
    setErrorLocal(null);
    setIsOpenForm(true);
  };

  const openDetailProduct = (prod: Product) => {
    setIsOpenForm(false);
    setEditingId(null);
    setErrorLocal(null);
    setDetailProduct(prod);
  };

  const autofillSKU = (catId: string) => {
    if (!catId) return;
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      const codePrf = cat.code.toUpperCase();
      const numRange = Math.floor(10 + Math.random() * 90);
      setCode(`${codePrf}-BRG${numRange}`);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);

    if (!code.trim() || !name.trim() || !categoryId || !unitType.trim()) {
      setErrorLocal('Semua field wajib diisi (Kode SKU, Nama, Kategori, Satuan)!');
      return;
    }

    if (!Number.isFinite(stock) || !Number.isFinite(price) || !Number.isFinite(minStock) || stock < 0 || price <= 0 || minStock <= 0) {
      setErrorLocal('Stok awal, Harga Jual, dan Ambang Minimal harus bernilai positif!');
      return;
    }

    if (editingId) {
      onEditProduct(editingId, {
        code: code.toUpperCase(),
        name,
        category_id: categoryId,
        stock,
        unit_type: unitType.toUpperCase(),
        price,
        min_stock: minStock
      });
    } else {
      // Check duplicate code
      const codeExists = products.some(p => p.code.toLowerCase() === code.trim().toLowerCase());
      if (codeExists) {
        setErrorLocal('Kode SKU Barang ini sudah didaftarkan pada produk lain!');
        return;
      }

      onAddProduct({
        code: code.toUpperCase(),
        name,
        category_id: categoryId,
        stock,
        unit_type: unitType.toUpperCase(),
        price,
        min_stock: minStock
      });
    }

    setIsOpenForm(false);
  };

  const confirmDelete = (prod: Product) => {
    const transactionCount = transactions.filter(trx => trx.product_id === prod.id).length;

    if (transactionCount > 0) {
      window.alert(`Produk '${prod.name}' tidak dapat dihapus karena sudah memiliki ${transactionCount} riwayat transaksi.`);
      return;
    }

    const confirm = window.confirm(`Hapus item buku/produk '${prod.name}' dari katalog Toko Buku JWP?`);
    if (confirm) {
      onDeleteProduct(prod.id);
      if (detailProduct?.id === prod.id) {
        setDetailProduct(null);
      }
    }
  };

  // Get Category Info
  const getCatDetails = (catId: string) => {
    return categories.find(c => c.id === catId);
  };

  // Filter
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCatFilter === 'all' || p.category_id === selectedCatFilter;
    return matchSearch && matchCat;
  });

  const getProductTransactions = (productId: string) => {
    return transactions.filter(trx => trx.product_id === productId);
  };

  const parseNumberInput = (value: string, minimum: number) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? minimum : Math.max(minimum, parsed);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Katalog Daftar Buku & Stationery JWP</h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh buku, referensi, dan stationery yang dijual. Atur harga eceran serta stok minimum di sini.
          </p>
        </div>
        <div>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md active:scale-[0.98] transition-all"
          >
            <Plus size={14} /> Daftarkan Buku/Produk Baru
          </button>
        </div>
      </div>

      {/* Grid containing table list & Side edit/add panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Table & Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden xl:col-span-3">
          
          {/* Table Header Filter controls */}
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
              <input 
                type="text" 
                placeholder="Cari SKU atau nama barang..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 text-slate-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">Filter Grup:</span>
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 focus:outline-hidden"
              >
                <option value="all">Tampilkan Semua Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Table list */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-4">SKU / Kode</th>
                  <th className="p-4">Nama Buku / Produk</th>
                  <th className="p-4">Golongan Kategori</th>
                  <th className="p-4 text-right">Stok</th>
                  <th className="p-4">Satuan</th>
                  <th className="p-4 text-right">Harga Satuan</th>
                  <th className="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const catObj = getCatDetails(p.category_id);
                    const isLow = p.stock <= p.min_stock;
                    return (
                      <tr key={p.id} className={`hover:bg-slate-50/40 transition-colors ${isLow ? 'bg-rose-50/10' : ''}`}>
                        <td className="p-4 font-mono text-[11px] font-bold text-slate-500">{p.code}</td>
                        <td className="p-4 font-bold text-slate-900">{p.name}</td>
                        <td className="p-4 text-slate-500 font-semibold">{catObj ? catObj.name : 'Umum'}</td>
                        <td className={`p-4 text-right font-extrabold text-sm ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                          {p.stock}
                        </td>
                        <td className="p-4 text-slate-400 font-semibold">{p.unit_type}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-800">
                          Rp {p.price.toLocaleString('id-ID')}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => openDetailProduct(p)}
                              title="Detail Barang"
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => openEditForm(p)}
                              title="Edit Detail Barang"
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => confirmDelete(p)}
                              title="Hapus Barang"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-12 text-slate-400">
                      Tidak ditemukan data buku atau stationery dalam katalog yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Side Panel: Interactive Insert & Update form */}
        {isOpenForm ? (
          <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-md space-y-4 animate-fade-in relative text-xs">
            
            <div className="flex items-center justify-between border-b pb-3 border-indigo-100 mb-2">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                {editingId ? 'Edit Barang JWP' : 'Registrasi Barang Baru'}
              </span>
              <button 
                onClick={() => setIsOpenForm(false)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {errorLocal && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-[11px] rounded-lg flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorLocal}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Pilih Kategori Buku / Produk
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    autofillSKU(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="">-- PILIH KATEGORI --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>[{c.code}] {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1 flex items-center justify-between">
                  <span>Kode SKU / SKU Code</span>
                  {!editingId && (
                    <button
                      type="button"
                      onClick={() => autofillSKU(categoryId)}
                      className="text-[9px] text-indigo-600 font-bold hover:underline"
                    >
                      Acak Kode SKU
                    </button>
                  )}
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: SEM-TR40"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={!!editingId} // block code modification in edit state
                  className="w-full px-3.5 py-2.5 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Nama Lengkap Buku / Produk
                </label>
                <input 
                  type="text"
                  placeholder="Novel, buku pelajaran, atau stationery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                    Satuan Unit
                  </label>
                  <input 
                    type="text"
                    placeholder="EKSEMPLAR, PACK, SET"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                    Stok Tersedia
                  </label>
                  <input 
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseNumberInput(e.target.value, 0))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                    Harga Jual Satuan
                  </label>
                  <input 
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseNumberInput(e.target.value, 1))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                    Ambang Stok Rendah
                  </label>
                  <input 
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(parseNumberInput(e.target.value, 1))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-amber-600 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenForm(false)}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Daftarkan Buku/Produk'}
                </button>
              </div>

            </form>

          </div>
        ) : detailProduct ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4 text-xs">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText size={12} /> Detail Barang
                </span>
                <h3 className="text-sm font-bold text-slate-950 mt-1 leading-tight">{detailProduct.name}</h3>
                <span className="font-mono text-[10px] text-slate-400">{detailProduct.code}</span>
              </div>
              <button
                onClick={() => setDetailProduct(null)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Kategori</span>
                <strong className="block mt-1 text-slate-900">{getCatDetails(detailProduct.category_id)?.name || 'Umum'}</strong>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Satuan</span>
                <strong className="block mt-1 text-slate-900">{detailProduct.unit_type}</strong>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Stok Saat Ini</span>
                <strong className={`block mt-1 ${detailProduct.stock <= detailProduct.min_stock ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {detailProduct.stock.toLocaleString('id-ID')} {detailProduct.unit_type}
                </strong>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Stok Minimum</span>
                <strong className="block mt-1 text-amber-600">{detailProduct.min_stock.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-3">
              <span className="text-[10px] text-indigo-500 font-bold uppercase">Harga Satuan</span>
              <strong className="block mt-1 text-indigo-950 font-mono">Rp {detailProduct.price.toLocaleString('id-ID')}</strong>
            </div>

            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Riwayat Transaksi Terakhir
              </div>
              <div className="divide-y divide-slate-100">
                {getProductTransactions(detailProduct.id).slice(0, 5).map(trx => (
                  <div key={trx.id} className="px-3 py-2 flex items-center justify-between gap-3">
                    <div>
                      <span className={`font-bold ${trx.type === 'MASUK' ? 'text-emerald-700' : 'text-rose-600'}`}>{trx.type}</span>
                      <span className="text-slate-400 font-mono ml-2">{trx.transaction_date}</span>
                    </div>
                    <strong className="text-slate-900">{trx.quantity.toLocaleString('id-ID')}</strong>
                  </div>
                ))}
                {getProductTransactions(detailProduct.id).length === 0 && (
                  <div className="px-3 py-4 text-center text-slate-400">Belum ada riwayat transaksi barang.</div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => openEditForm(detailProduct)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Edit Barang
              </button>
              <button
                onClick={() => confirmDelete(detailProduct)}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center flex flex-col justify-center items-center">
            <HelpCircle className="text-slate-400 mb-3" size={28} />
            <h4 className="font-bold text-xs text-slate-700">Editor Katalog Cepat</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-relaxed">
              Tekan ikon pensil pada baris tabel sebelah kiri, atau buat produk baru seperti novel, buku pelajaran, dan stationery.
            </p>
            <button
              onClick={openAddForm}
              className="mt-4 px-3.5 py-2 rounded-xl text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all active:scale-95"
            >
              + Daftarkan Buku/Produk Baru
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

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
  FolderTree, 
  Search, 
  X, 
  FileText,
  Bookmark,
  Sparkles,
  AlertCircle,
  Hash
} from 'lucide-react';
import { Category, Product } from '../types';

interface CategoryMasterProps {
  categories: Category[];
  products: Product[];
  onAddCategory: (cat: Omit<Category, 'id' | 'created_at'>) => void;
  onEditCategory: (id: string, updated: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategoryMaster({ 
  categories, 
  products,
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory 
}: CategoryMasterProps) {
  
  // Search query
  const [search, setSearch] = useState('');

  // Form states (Add/Edit is handled via a clean, slide-over modal side panel inside the page)
  const [isOpenPanel, setIsOpenPanel] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailCategory, setDetailCategory] = useState<Category | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const openAddFlow = () => {
    setEditingId(null);
    setDetailCategory(null);
    setCode('');
    setName('');
    setDescription('');
    setErrorLocal(null);
    setIsOpenPanel(true);
  };

  const openEditFlow = (cat: Category) => {
    setEditingId(cat.id);
    setDetailCategory(null);
    setCode(cat.code);
    setName(cat.name);
    setDescription(cat.description);
    setErrorLocal(null);
    setIsOpenPanel(true);
  };

  const openDetailFlow = (cat: Category) => {
    setIsOpenPanel(false);
    setEditingId(null);
    setErrorLocal(null);
    setDetailCategory(cat);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);

    if (!code.trim() || !name.trim()) {
      setErrorLocal('Kode Kategori & Nama Kategori wajib diisi!');
      return;
    }

    if (code.length > 5) {
      setErrorLocal('Kode Kategori maksimal terdiri dari 5 karakter saja!');
      return;
    }

    if (editingId) {
      // Edit
      onEditCategory(editingId, {
        code: code.toUpperCase(),
        name,
        description
      });
    } else {
      // Add
      // Check duplicate code
      const codeExists = categories.some(c => c.code.toLowerCase() === code.toLowerCase());
      if (codeExists) {
        setErrorLocal('Kode Kategori ini sudah digunakan dalam sistem inventori!');
        return;
      }

      onAddCategory({
        code: code.toUpperCase(),
        name,
        description
      });
    }

    setIsOpenPanel(false);
  };

  const confirmDelete = (cat: Category) => {
    const productCount = products.filter(product => product.category_id === cat.id).length;

    if (productCount > 0) {
      window.alert(`Kategori '${cat.name}' tidak dapat dihapus karena masih digunakan oleh ${productCount} produk.`);
      return;
    }

    const confirm = window.confirm(
      `Hapus Kategori '${cat.name}'? Data kategori yang sudah dihapus tidak dapat dikembalikan.`
    );
    if (confirm) {
      onDeleteCategory(cat.id);
      if (detailCategory?.id === cat.id) {
        setDetailCategory(null);
      }
    }
  };

  // Filter list
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Kategori Buku & Produk Toko Buku JWP</h2>
          <p className="text-xs text-slate-500 mt-1">
            Grup klasifikasi untuk menyusun, menyaring, dan menganalisis pergerakan stok buku harian.
          </p>
        </div>
        <div>
          <button 
            onClick={openAddFlow}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md active:scale-[0.98] transition-all"
          >
            <Plus size={14} /> Tambah Kategori Baru
          </button>
        </div>
      </div>

      {/* Main Table and sidebar panel wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Categories List table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden xl:col-span-2">
          
          {/* List Search header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <FolderTree size={12} /> Total {categories.length} Kategori Terdaftar
            </span>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={12} />
              <input 
                type="text" 
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4 w-24">Kode</th>
                  <th className="p-4">Nama Kategori</th>
                  <th className="p-4">Deskripsi Singkat</th>
                  <th className="p-4 text-center">Aksi Kendali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50/10 w-24 rounded-xs">
                        {cat.code}
                      </td>
                      <td className="p-4 font-bold text-slate-900">{cat.name}</td>
                      <td className="p-4 text-slate-500 leading-normal">{cat.description || '-'}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetailFlow(cat)}
                            title="Detail Kategori"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => openEditFlow(cat)}
                            title="Edit Kategori"
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => confirmDelete(cat)}
                            title="Hapus Kategori"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-12 text-slate-400">
                      Tidak ditemukan kategori toko buku JWP yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Collapsible Add/Edit panel integrated directly into view for seamless workflow */}
        {isOpenPanel ? (
          <div className="bg-white p-5 rounded-2xl border border-indigo-200/60 shadow-md space-y-4 animate-fade-in relative">
            
            {/* Ribbon banner indicating mode */}
            <div className="flex items-center justify-between border-b pb-3 border-indigo-100">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                {editingId ? 'Edit Kategori JWP' : 'Registrasi Kategori Baru'}
              </span>
              <button 
                onClick={() => setIsOpenPanel(false)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {errorLocal && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-lg flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorLocal}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Kode Kategori (SKU Prefix)
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: SEM, BES, KAY"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={!!editingId} // Disable code edit to maintain database logical index integrity
                  className="w-full px-3.5 py-2.5 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-hidden focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block leading-tight">Maksimal 5 karakter unik kapital. Identitas ini dipakai untuk prefix Kode SKU barang.</span>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Nama Kategori
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Fiksi & Sastra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Deskripsi Kategori
                </label>
                <textarea 
                  rows={3}
                  placeholder="Tulis penjelasan kategorisasi barang..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenPanel(false)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer text-center"
                >
                  {editingId ? 'Ubah Kategori' : 'Simpan Kategori'}
                </button>
              </div>
            </form>

          </div>
        ) : detailCategory ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText size={12} /> Detail Kategori
                </span>
                <h3 className="text-sm font-bold text-slate-950 mt-1">{detailCategory.name}</h3>
              </div>
              <button
                onClick={() => setDetailCategory(null)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Kode</span>
                <strong className="block mt-1 font-mono text-indigo-700">{detailCategory.code}</strong>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Jumlah Produk</span>
                <strong className="block mt-1 text-slate-900">
                  {products.filter(product => product.category_id === detailCategory.id).length} Item
                </strong>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Deskripsi</span>
              <p className="mt-1 text-slate-600 leading-relaxed">{detailCategory.description || '-'}</p>
            </div>

            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Hash size={11} /> Produk Terkait
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {products.filter(product => product.category_id === detailCategory.id).slice(0, 5).map(product => (
                  <div key={product.id} className="px-3 py-2 flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-800">{product.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{product.code}</span>
                  </div>
                ))}
                {products.filter(product => product.category_id === detailCategory.id).length === 0 && (
                  <div className="px-3 py-4 text-center text-slate-400">Belum ada produk pada kategori ini.</div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => openEditFlow(detailCategory)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer text-xs"
              >
                Edit Kategori
              </button>
              <button
                onClick={() => confirmDelete(detailCategory)}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold cursor-pointer text-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-950/5 border border-indigo-100/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <Bookmark className="text-indigo-600/60 mb-3" size={32} />
            <h4 className="font-bold text-xs text-indigo-950">Kelola Penggolongan Barang</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-normal">
              Gunakan panel kendali untuk mengubah atau menambah jenis kategori. Kode kategori akan menjadi prefix SKU buku/produk.
            </p>
            <button
              onClick={openAddFlow}
              className="mt-4 px-3.5 py-2 rounded-xl text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
            >
              + Buka Form Cepat
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

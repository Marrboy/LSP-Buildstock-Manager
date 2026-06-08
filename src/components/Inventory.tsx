/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  ShieldAlert,
  CheckCircle2,
  Download,
  Plus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Product, Category } from '../types';

interface InventoryProps {
  products: Product[];
  categories: Category[];
  setActivePage: React.Dispatch<React.SetStateAction<any>>;
}

export default function Inventory({ products, categories, setActivePage }: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'normal'>('all');

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'Umum';
  };

  const getCategoryCode = (catId: string) => {
    return categories.find(c => c.id === catId)?.code || 'GEN';
  };

  const getStockStatus = (prod: Product) => {
    if (prod.stock <= 0) {
      return {
        label: 'Tidak Tersedia',
        className: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: ShieldAlert,
      };
    }

    if (prod.stock <= prod.min_stock) {
      return {
        label: 'Stok Minimum',
        className: 'bg-rose-100 text-rose-700 border-rose-200',
        icon: ShieldAlert,
      };
    }

    return {
      label: 'Tersedia',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    };
  };

  const filteredProducts = products.filter((prod) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = prod.name.toLowerCase().includes(query) || prod.code.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'all' || prod.category_id === selectedCategory;
    const isLowStock = prod.stock <= prod.min_stock;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && isLowStock) ||
      (stockFilter === 'normal' && !isLowStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const exportCSV = () => {
    const header = "KODE SKU,NAMA BARANG,KATEGORI,STOK,SATUAN,HARGA SATUAN,STATUS\n";
    const dataRows = filteredProducts.map(p => {
      const stockStatus = getStockStatus(p).label;
      return `"${p.code}","${p.name.replace(/"/g, '""')}","${getCategoryName(p.category_id)}",${p.stock},"${p.unit_type}",${p.price},"${stockStatus}"`;
    }).join("\n");

    const blob = new Blob([header + dataRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Persediaan_JWP_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Ketersediaan Stok Buku Real-Time</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau stok terakhir dan status ketersediaan barang. Barang di bawah ambang minimum ditandai otomatis.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActivePage('incoming_form')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
          >
            <TrendingUp size={14} /> Buku Masuk
          </button>
          <button
            onClick={() => setActivePage('outgoing_form')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
          >
            <TrendingDown size={14} /> Buku Keluar
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer shadow-3xs active:scale-[0.98] transition-all border border-slate-200/50"
          >
            <Download size={14} /> Ekspor Data Stok (.CSV)
          </button>
          <button
            onClick={() => setActivePage('products')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md active:scale-[0.98] transition-all"
          >
            <Plus size={14} /> Kelola Katalog Barang
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Pencarian Barang</label>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Cari SKU atau nama barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Filter Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 transition-all"
          >
            <option value="all">Semua Kategori ({categories.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Kondisi Persediaan</label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 transition-all font-semibold"
          >
            <option value="all">Semua Kondisi</option>
            <option value="low">Stok Minimum</option>
            <option value="normal">Tersedia</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-4 w-28">KODE SKU</th>
                <th className="p-4">NAMA BUKU / PRODUK</th>
                <th className="p-4">KATEGORI</th>
                <th className="p-4 text-right">STOK TERAKHIR</th>
                <th className="p-4">SATUAN/UNIT</th>
                <th className="p-4 text-right">HARGA SATUAN</th>
                <th className="p-4 text-center">STATUS PERSEDIAAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const stockStatus = getStockStatus(prod);
                  const StatusIcon = stockStatus.icon;
                  const isLow = prod.stock <= prod.min_stock;

                  return (
                    <tr key={prod.id} className={`hover:bg-slate-50/40 transition-colors ${isLow ? 'bg-rose-50/15' : ''}`}>
                      <td className="p-4 font-mono text-[11px] font-bold text-slate-500">{prod.code}</td>
                      <td className="p-4 font-bold text-slate-900 leading-tight">{prod.name}</td>
                      <td className="p-4 text-slate-500">
                        <span className="font-semibold">{getCategoryCode(prod.category_id)}</span> - {getCategoryName(prod.category_id)}
                      </td>
                      <td className={`p-4 text-right font-extrabold text-sm ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                        {prod.stock.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-slate-500 font-semibold">{prod.unit_type}</td>
                      <td className="p-4 text-right font-mono font-semibold text-slate-800">
                        Rp {prod.price.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${stockStatus.className}`}>
                          <StatusIcon size={12} /> {stockStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-12 text-slate-400">
                    Tidak ditemukan data buku atau stationery yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

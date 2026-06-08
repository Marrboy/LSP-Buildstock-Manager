/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldAlert, 
  Sparkles, 
  ListCheck, 
  Layers, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Award,
  Users
} from 'lucide-react';
import { Product, StockTransaction, Category } from '../types';

interface DashboardProps {
  products: Product[];
  transactions: StockTransaction[];
  categories: Category[];
  setActivePage: React.Dispatch<React.SetStateAction<any>>;
}

export default function Dashboard({ products, transactions, categories, setActivePage }: DashboardProps) {
  
  // 1. Math totals
  const totalProducts = products.length;
  
  const totalIncomingStok = transactions
    .filter(t => t.type === 'MASUK')
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalOutgoingStok = transactions
    .filter(t => t.type === 'KELUAR')
    .reduce((sum, t) => sum + t.quantity, 0);

  // 2. Identify 5 lowest stock items
  const sortedLowestStock = [...products]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  // 3. Identify 5 highest stock items
  const sortedHighestStock = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  const lowStockProducts = products.filter(p => p.stock <= p.min_stock);
  const highestStockProduct = sortedHighestStock[0];

  // Get full category name for a product
  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'Kategori Umum';
  };

  // 4. Custom SVG Chart - transaction volumes grouped by daily or types on the recent 5 transaction entries
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
    .slice(-6); // last 6 entries

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner Message */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wide inline-flex items-center gap-1.5 mb-2">
            <Sparkles size={11} /> Beroperasi Secara Real-Time
          </span>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Selamat Datang di Terminal Inventori JWP</h2>
          <p className="text-xs text-slate-500 mt-1">
            Data stok toko buku terintegrasi secara otomatis. Transaksi yang Anda masukkan memperbarui saldo secara instan.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActivePage('incoming_form')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
          >
            <TrendingUp size={14} /> + Stok Masuk
          </button>
          <button 
            onClick={() => setActivePage('outgoing_form')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
          >
            <TrendingDown size={14} /> - Stok Keluar
          </button>
        </div>
      </div>

      {/* Cards Statistik sesuai target Sesi 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        
        {/* Card 1: Total Produk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Katalog Buku & Produk</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalProducts} <span className="text-xs font-normal text-slate-400">Item</span></h3>
            <p className="text-[10px] text-slate-500 mt-1.5">Terklasifikasi dalam <strong className="text-indigo-600">{categories.length} Kategori</strong></p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        {/* Card 2: Total Stok Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Akumulasi Stok Masuk</span>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">+{totalIncomingStok.toLocaleString('id-ID')}</h3>
            <p className="text-[10px] text-slate-500 mt-1.5">Penambahan dari pemasok dan penerbit</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Card 3: Total Stok Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Akumulasi Stok Keluar</span>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1">-{totalOutgoingStok.toLocaleString('id-ID')}</h3>
            <p className="text-[10px] text-slate-500 mt-1.5">Dikeluarkan untuk penjualan retail/sekolah</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
        </div>

        {/* Card 4: Stok Minimum */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Stok Minimum</span>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{lowStockProducts.length}</h3>
            <p className="text-[10px] text-slate-500 mt-1.5">Barang di bawah / sama ambang stok</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
        </div>

        {/* Card 5: Stok Tertinggi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Produk Terbanyak</span>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">
              {highestStockProduct ? highestStockProduct.stock.toLocaleString('id-ID') : 0}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1.5 truncate" title={highestStockProduct?.name}>
              {highestStockProduct?.name || 'Belum ada barang'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Award size={24} />
          </div>
        </div>

      </div>

      {/* Main Core Section: Chart & Statistics breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Dynamic SVG Transactions Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Visualisasi Tren Transaksi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Laporan fluktuasi stok buku masuk & keluar terkini.</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> Masuk</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span> Keluar</span>
            </div>
          </div>

          {/* Elegant Custom SVGA Chart Panel */}
          <div className="relative h-60 w-full bg-slate-50 rounded-xl p-4 flex flex-col justify-between border border-slate-100 overflow-hidden">
            <div className="absolute inset-0 grid grid-rows-4 divide-y divide-slate-100/80 px-4 py-6 pointer-events-none">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            {/* Bars Column representing the transactions volume */}
            <div className="flex-1 flex items-end justify-around relative z-10 pt-4 px-2">
              {recentTransactions.map((trx, idx) => {
                const maxVal = Math.max(...recentTransactions.map(t => t.quantity), 1);
                // normalize height to max 120px
                const barHeight = Math.max((trx.quantity / maxVal) * 110, 15);
                const isIncoming = trx.type === 'MASUK';

                return (
                  <div key={trx.id} className="flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 whitespace-nowrap">
                      <span className="font-bold">{trx.type}: {trx.quantity}</span><br />
                      <span className="text-[8px] text-slate-300 font-mono">{trx.invoice_number}</span>
                    </div>

                    {/* Colored bar columns */}
                    <div 
                      style={{ height: `${barHeight}px` }}
                      className={`w-8 rounded-t-xs transition-all duration-300 transform group-hover:scale-y-105 ${
                        isIncoming 
                          ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/20' 
                          : 'bg-gradient-to-t from-rose-500 to-red-400 shadow-sm shadow-rose-500/20'
                      }`}
                    ></div>

                    {/* Small tag inside */}
                    <span className="text-[8px] font-extrabold text-slate-700 mt-1.5 font-mono">
                      {trx.quantity > 1000 ? `${(trx.quantity / 1000).toFixed(1)}k` : trx.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom X-Labels */}
            <div className="border-t border-slate-200 pt-2 flex justify-around text-[10px] text-slate-400 font-mono relative z-10 px-2 mt-1">
              {recentTransactions.map((trx) => (
                <div key={trx.id} className="text-center w-12 truncate font-medium text-slate-500" title={trx.transaction_date}>
                  {trx.transaction_date.substring(5)}
                </div>
              ))}
            </div>

          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 text-[11px] text-indigo-800 leading-normal">
            <strong>Analisis Sistem:</strong> Aktivitas pengadaan didominasi oleh buku pelajaran, novel, dan stationery (<code className="bg-white/80 px-1 py-0.5 rounded border border-indigo-200/50">+{totalIncomingStok} unit</code>). Arus barang keluar mengikuti pembelian retail, sekolah, dan member toko.
          </div>
        </div>

        {/* Right Side: Quick Alerts or Information statistics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-4">Maturity Status</span>
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-950">Sistem Proteksi Out of Stock</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Sistem menolak mutasi jika pengeluaran &gt; stok.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <ListCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-950">Aturan Ambang Stok Minimum</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Pemberian otomatis tanda 'Stok Rendah' sesuai batas tiap produk.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Ringkasan Toko Buku JWP</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px]">Fiksi Cukup</span>
                <strong className="text-slate-900 text-sm">
                  {products.filter(p => p.category_id === 'cat-1' && p.stock >= 10).length} Item
                </strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px]">Pendidikan Cukup</span>
                <strong className="text-slate-900 text-sm">
                  {products.filter(p => p.category_id === 'cat-2' && p.stock >= 10).length} Item
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5 Terendah vs 5 Tertinggi Tables grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table 1: 5 Stok Terendah */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="bg-rose-50/40 p-4 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-rose-600" size={16} />
              <h3 className="font-bold text-rose-950 text-xs md:text-sm uppercase tracking-wide">5 Stok Terendah (Status Kritis)</h3>
            </div>
            <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100/50 px-2 py-0.5 rounded">Prioritas Restock</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold">
                  <th className="p-3">Kode SKU</th>
                  <th className="p-3">Nama Buku / Produk</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3 text-right">Sisa Stok</th>
                  <th className="p-3 text-center">Indikator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedLowestStock.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono text-[11px] font-semibold text-slate-500">{prod.code}</td>
                    <td className="p-3 font-medium text-slate-900">{prod.name}</td>
                    <td className="p-3 text-slate-500">{getCategoryName(prod.category_id)}</td>
                    <td className="p-3 text-right font-bold text-rose-600">{prod.stock} {prod.unit_type}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prod.stock <= prod.min_stock 
                          ? 'bg-rose-100 text-rose-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {prod.stock <= prod.min_stock ? 'Stok Minimum' : 'Aman'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: 5 Stok Tertinggi */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="bg-emerald-50/40 p-4 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-600" size={16} />
              <h3 className="font-bold text-emerald-950 text-xs md:text-sm uppercase tracking-wide">5 Stok Tertinggi (Lancar Aman)</h3>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded">Ready Stock</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold">
                  <th className="p-3">Kode SKU</th>
                  <th className="p-3">Nama Buku / Produk</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3 text-right">Sisa Stok</th>
                  <th className="p-3 text-center">Indikator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedHighestStock.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono text-[11px] font-semibold text-slate-500">{prod.code}</td>
                    <td className="p-3 font-medium text-slate-900">{prod.name}</td>
                    <td className="p-3 text-slate-500">{getCategoryName(prod.category_id)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{prod.stock} {prod.unit_type}</td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Melimpah
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

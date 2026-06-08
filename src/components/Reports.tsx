/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Printer,
  Search,
  Download
} from 'lucide-react';
import { StockTransaction, Product } from '../types';

interface ReportsProps {
  transactions: StockTransaction[];
  products: Product[];
}

const getTodayInputValue = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

export default function Reports({ transactions, products }: ReportsProps) {
  const firstTransactionDate = useMemo(() => {
    const dates = transactions
      .map(transaction => transaction.transaction_date)
      .filter(Boolean)
      .sort();

    return dates[0] || getTodayInputValue();
  }, [transactions]);

  const [filterType, setFilterType] = useState<'ALL' | 'MASUK' | 'KELUAR'>('ALL');
  const [startDate, setStartDate] = useState(firstTransactionDate);
  const [endDate, setEndDate] = useState(getTodayInputValue());
  const [selectedProductId, setSelectedProductId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getProdName = (pId: string) => {
    return products.find(p => p.id === pId)?.name || 'Buku / Produk Toko';
  };

  const getProdCode = (pId: string) => {
    return products.find(p => p.id === pId)?.code || 'SKU-UNKNOWN';
  };

  const getProdUnit = (pId: string) => {
    return products.find(p => p.id === pId)?.unit_type || 'UNIT';
  };

  const filteredTransactions = transactions.filter(t => {
    const matchType = filterType === 'ALL' || t.type === filterType;
    const matchProduct = selectedProductId === 'ALL' || t.product_id === selectedProductId;
    const dateObj = new Date(t.transaction_date);
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);
    const matchDate = dateObj >= startObj && dateObj <= endObj;

    const query = searchQuery.toLowerCase();
    const prodName = getProdName(t.product_id).toLowerCase();
    const prodCode = getProdCode(t.product_id).toLowerCase();
    const matchQuery = !query.trim() ||
      prodName.includes(query) ||
      prodCode.includes(query) ||
      t.invoice_number.toLowerCase().includes(query) ||
      t.reference_person.toLowerCase().includes(query);

    return matchType && matchProduct && matchDate && matchQuery;
  });

  const totalInQty = filteredTransactions
    .filter(t => t.type === 'MASUK')
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalOutQty = filteredTransactions
    .filter(t => t.type === 'KELUAR')
    .reduce((sum, t) => sum + t.quantity, 0);

  const exportCSV = () => {
    const escapeCSV = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const header = [
      'No Invoice',
      'Tanggal',
      'Tipe',
      'Kode SKU',
      'Nama Produk',
      'Quantity',
      'Satuan',
      'Pemasok/Penerima',
      'Catatan'
    ].join(',');

    const rows = filteredTransactions.map((transaction) => [
      transaction.invoice_number,
      transaction.transaction_date,
      transaction.type,
      getProdCode(transaction.product_id),
      getProdName(transaction.product_id),
      transaction.quantity,
      getProdUnit(transaction.product_id),
      transaction.reference_person,
      transaction.notes || '-'
    ].map(escapeCSV).join(','));

    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Mutasi_JWP_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Laporan Rekapitulasi & Mutasi Toko Buku</h2>
          <p className="text-xs text-slate-500 mt-1">
            Unduh berkas laporan mutasi pasokan penerbit/distributor dan penjualan toko buku JWP.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-sm transition-all"
          >
            <Download size={14} /> Ekspor CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shadow-3xs transition-all border border-slate-200"
          >
            <Printer size={14} /> Cetak Laporan
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-semibold text-slate-700">
        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Jenis Arus Transaksi</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Transaksi (Masuk & Keluar)</option>
            <option value="MASUK">Hanya Buku/Produk Masuk (Stok In)</option>
            <option value="KELUAR">Hanya Buku/Produk Keluar (Stok Out)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Buku / Produk</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Produk</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>[{product.code}] {product.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar size={11} /> Rentang Awal Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar size={11} /> Rentang Akhir Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Pencarian Kata Kunci</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Cari invoice, pemasok, pelanggan, buku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Acuan Terpilih</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{filteredTransactions.length} Transaksi</h4>
          </div>
          <FileText className="text-slate-400" size={18} />
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Kuantitas Masuk</span>
            <h4 className="text-sm font-extrabold text-emerald-700 mt-1">+{totalInQty.toLocaleString('id-ID')} Unit</h4>
          </div>
          <TrendingUp className="text-emerald-500" size={18} />
        </div>

        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Kuantitas Keluar</span>
            <h4 className="text-sm font-extrabold text-rose-700 mt-1">-{totalOutQty.toLocaleString('id-ID')} Unit</h4>
          </div>
          <TrendingDown className="text-rose-500" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden print:border-none print:shadow-none">
        <div className="hidden print:block p-6 text-center border-b">
          <h1 className="text-lg font-bold">LAPORAN MUTASI BUKU & PRODUK TOKO BUKU JWP</h1>
          <p className="text-xs text-slate-500 mt-0.5">Filter Periode: {startDate} s/d {endDate} | Jenis: {filterType}</p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="p-4">No. Invoice</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Nama Buku / Produk (SKU)</th>
                <th className="p-4 text-right">Qty Kuantitas</th>
                <th className="p-4">Pemasok / Penerima</th>
                <th className="p-4">Catatan Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => {
                  const isIncoming = t.type === 'MASUK';

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 font-mono text-[11px] font-bold text-slate-900">{t.invoice_number}</td>
                      <td className="p-4 font-mono text-slate-500 whitespace-nowrap">{t.transaction_date}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                          isIncoming
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {isIncoming ? 'STOK MASUK' : 'STOK KELUAR'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-950">{getProdName(t.product_id)}</div>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">{getProdCode(t.product_id)}</span>
                      </td>
                      <td className={`p-4 text-right font-extrabold ${isIncoming ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {isIncoming ? '+' : '-'}{t.quantity.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">{getProdUnit(t.product_id)}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 leading-tight">{t.reference_person}</td>
                      <td className="p-4 text-slate-400 italic max-w-xs truncate" title={t.notes}>{t.notes || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-12 text-slate-400">
                    Tidak ditemukan riwayat mutasi buku/produk pada periode yang ditentukan.
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

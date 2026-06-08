/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Hash, 
  Calendar, 
  FileText,
  Boxes
} from 'lucide-react';
import { Product, StockTransaction } from '../types';

interface IncomingOutgoingFormProps {
  type: 'MASUK' | 'KELUAR';
  products: Product[];
  onAddTransaction: (trx: Omit<StockTransaction, 'id' | 'created_at'>) => Promise<void>;
  setActivePage: React.Dispatch<React.SetStateAction<any>>;
}

const getTodayInputValue = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

const buildInvoiceNumber = (type: 'MASUK' | 'KELUAR', date: string) => {
  const codePrefix = type === 'MASUK' ? 'BM' : 'BK';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${codePrefix}-${date.replace(/-/g, '')}-${randomSuffix}`;
};

export default function IncomingOutgoingForm({ 
  type, 
  products, 
  onAddTransaction,
  setActivePage 
}: IncomingOutgoingFormProps) {
  
  // Form State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [referencePerson, setReferencePerson] = useState('');
  const [transactionDate, setTransactionDate] = useState(getTodayInputValue());
  const [notes, setNotes] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status message
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Generate invoice number on component mount or type change
  useEffect(() => {
    setInvoiceNumber(buildInvoiceNumber(type, transactionDate));
    
    // Reset Form
    setSelectedProductId('');
    setQuantity('');
    setReferencePerson('');
    setNotes('');
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [type]);

  // Handle selected product detail tracking
  const targetProduct = products.find(p => p.id === selectedProductId);

  // Handle transaction submission
  const handleSubmitTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!selectedProductId) {
      setErrorMsg('Anda wajib menentukan buku atau produk toko terlebih dahulu!');
      return;
    }

    if (!quantity || quantity <= 0) {
      setErrorMsg('Pilih kuantitas transaksi yang valid (harus lebih besar dari 0)!');
      return;
    }

    if (!referencePerson.trim()) {
      setErrorMsg(
        type === 'MASUK' 
          ? 'Mohon isi nama pemasok, penerbit, atau distributor barang masuk!' 
          : 'Mohon isi nama pelanggan / penerima buku!'
      );
      return;
    }

    // Aturan sistem: Tolak jika barang keluar melebihi stok tersedia
    if (type === 'KELUAR' && targetProduct) {
      if (quantity > targetProduct.stock) {
        setErrorMsg(
          `Sistem menolak buku/produk keluar! Jumlah pengeluaran (${quantity} unit) melebihi persediaan yang tersedia saat ini (${targetProduct.stock} ${targetProduct.unit_type}).`
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onAddTransaction({
        invoice_number: invoiceNumber,
        type: type,
        product_id: selectedProductId,
        quantity: Number(quantity),
        reference_person: referencePerson,
        transaction_date: transactionDate,
        notes: notes
      });

      setSuccessMsg(
        type === 'MASUK' 
          ? `Transaksi stok masuk sukses! Persediaan '${targetProduct?.name}' otomatis bertambah.`
          : `Transaksi stok keluar diproses! Persediaan '${targetProduct?.name}' otomatis berkurang.`
      );

      setSelectedProductId('');
      setQuantity('');
      setReferencePerson('');
      setNotes('');
      setInvoiceNumber(buildInvoiceNumber(type, transactionDate));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaksi gagal disimpan';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold ${
            type === 'MASUK' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            {type === 'MASUK' ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {type === 'MASUK' ? 'Formulir Pencatatan Buku Masuk' : 'Formulir Pengeluaran Buku (Stock-out)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {type === 'MASUK' 
                ? 'Tambah persediaan toko buku secara instan melalui pemasok, penerbit, atau distributor.'
                : 'Catat penjualan/pengeluaran buku dengan validasi sisa inventori otomatis.'}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Notification Banners */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-3xs">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Kesalahan Validasi Sistem</h4>
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3 shadow-3xs">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Berhasil Disimpan</h4>
            <p className="leading-relaxed">{successMsg}</p>
            <div className="pt-2 flex gap-3 text-[10px] font-bold">
              <button 
                onClick={() => setActivePage('inventory')}
                className="text-emerald-700 hover:text-emerald-900 underline"
              >
                Lihat Sisa Persediaan
              </button>
              <button 
                onClick={() => setActivePage('dashboard')}
                className="text-emerald-700 hover:text-emerald-900 underline"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmitTrx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
        
        {/* Invoice and Date Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Hash size={12} /> No. Invoice (Auto-generate)
            </label>
            <input 
              type="text" 
              value={invoiceNumber}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar size={12} /> Tanggal Transaksi
            </label>
            <input 
              type="date" 
              value={transactionDate}
              onChange={(e) => {
                setTransactionDate(e.target.value);
                setInvoiceNumber(buildInvoiceNumber(type, e.target.value));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-mono focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Product selector dropdown with current sisa stock display */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Boxes size={14} className="text-slate-400" /> Pilih Buku / Produk Toko Buku JWP
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500 transition-all font-semibold"
          >
            <option value="">-- PILIH BUKU / PRODUK --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                [{p.code}] {p.name} (Sisa Stok: {p.stock} {p.unit_type})
              </option>
            ))}
          </select>

          {/* Sisa Stock Warning Bubble */}
          {targetProduct && (
            <div className="mt-3.5 flex items-center justify-between text-xs p-3 rounded-lg border bg-white shadow-3xs border-slate-100">
              <span className="text-slate-500">Stok Tersedia Saat Ini:</span>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-sm ${targetProduct.stock <= targetProduct.min_stock ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {targetProduct.stock} {targetProduct.unit_type}
                </span>
                {targetProduct.stock <= targetProduct.min_stock && (
                  <span className="text-[9px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.5 rounded uppercase">Stok Rendah</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quantities & supplier/customer input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              Jumlah Kuantitas ({targetProduct?.unit_type || 'Unit'})
            </label>
            <input 
              type="number" 
              placeholder="0"
              value={quantity}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                const val = e.target.value === '' || Number.isNaN(parsedValue) ? '' : Math.max(0, parsedValue);
                setQuantity(val);
                setErrorMsg(null);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              {type === 'MASUK' ? 'Pemasok / Penerbit / Distributor' : 'Pelanggan / Penerima Buku'}
            </label>
            <input 
              type="text" 
              placeholder={type === 'MASUK' ? "Contoh: Distributor Buku Nusantara" : "Contoh: Pelanggan Member / Sekolah"}
              value={referencePerson}
              onChange={(e) => setReferencePerson(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Catatan Tambahan */}
        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <FileText size={12} /> Catatan Keterangan
          </label>
          <textarea 
            rows={3}
            placeholder="Tambahkan catatan keterangan transaksi..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Submission Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md transform active:scale-[0.99] ${
            type === 'MASUK' 
              ? 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 shadow-emerald-500/10' 
              : 'bg-rose-600 hover:bg-rose-500 disabled:bg-slate-400 shadow-rose-600/10'
          }`}
        >
          {isSubmitting ? 'Menyimpan Transaksi...' : type === 'MASUK' ? 'Simpan & Tambah Stok Masuk' : 'Verifikasi & Kurangi Stok Keluar'}
        </button>

      </form>

    </div>
  );
}

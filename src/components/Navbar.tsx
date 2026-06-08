/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldAlert, 
  TrendingDown,
  PlusCircle,
  Clock
} from 'lucide-react';
import { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  lowStockCount: number;
  currentUser: { name: string; role: string; email: string } | null;
}

export default function Navbar({ activePage, setActivePage, lowStockCount, currentUser }: NavbarProps) {
  
  const getPageTitle = (page: ActivePage) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard Analytics';
      case 'inventory':
        return 'Persediaan Buku Real-Time';
      case 'incoming_form':
        return 'Pencatatan Buku Masuk (Stok In)';
      case 'outgoing_form':
        return 'Pencatatan Buku Keluar (Stok Out)';
      case 'categories':
        return 'Master Kategori Buku';
      case 'products':
        return 'Master Katalog Daftar Buku';
      case 'users':
        return 'Manajemen Akun Pengguna';
      case 'reports':
        return 'Laporan Distribusi & Mutasi Persediaan';
      case 'profile':
        return 'Konfigurasi Profil Akun';
      case 'password':
        return 'Keamanan & Ubah Password';
      case 'system_design':
        return 'Blueprint Rancangan Arsitektur Sistem';
      default:
        return 'Inventori Toko Buku JWP';
    }
  };

  const getBreadcrumbs = (page: ActivePage) => {
    const main = "Sistem Toko Buku";
    switch (page) {
      case 'dashboard':
        return [main, "Dashboard Utama"];
      case 'inventory':
        return [main, "Persediaan", "Stok Buku"];
      case 'incoming_form':
        return [main, "Transaksi", "Form Buku Masuk"];
      case 'outgoing_form':
        return [main, "Transaksi", "Form Buku Keluar"];
      case 'categories':
        return [main, "Master Data", "Kategori"];
      case 'products':
        return [main, "Master Data", "Katalog Buku"];
      case 'users':
        return [main, "Hak Akses", "Pengguna"];
      case 'reports':
        return [main, "Pembukuan", "Laporan Mutasi"];
      case 'profile':
        return [main, "Pengaturan", "Sesi Profil"];
      case 'password':
        return [main, "Keamanan", "Reset Sandi"];
      case 'system_design':
        return [main, "Dokumentasi", "Rancangan Arsitektur"];
      default:
        return [main];
    }
  };

  const breadcrumbs = getBreadcrumbs(activePage);

  // Print current date beautifully in Indonesian
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40 select-none">
      
      {/* Search & Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span>{crumb}</span>
              {idx < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none mt-1">
          {getPageTitle(activePage)}
        </h1>
      </div>

      {/* Action shortcuts & Notifications */}
      <div className="flex items-center gap-4">
        
        {/* Dynamic Low Stock Warning Widget */}
        {lowStockCount > 0 && (
          <button 
            onClick={() => setActivePage('inventory')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 cursor-pointer hover:bg-rose-100 transition-all"
          >
            <ShieldAlert size={14} className="animate-pulse" />
            <span>{lowStockCount} Buku/Produk Stok Rendah (&lt;= Ambang Minimum)</span>
          </button>
        )}

        {/* Server Time Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-[11px] text-slate-600 font-mono">
          <Clock size={12} className="text-slate-400" />
          <span>{getFormattedDate()} {getFormattedTime()}</span>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setActivePage('incoming_form')}
            title="Catat Buku Masuk"
            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-slate-100/80 transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
          </button>

          <button
            onClick={() => setActivePage('outgoing_form')}
            title="Catat Buku Keluar"
            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-slate-100/80 transition-all cursor-pointer"
          >
            <TrendingDown size={16} />
          </button>
        </div>

      </div>

    </header>
  );
}

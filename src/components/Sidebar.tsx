/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  History, 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  FolderTree, 
  Tags, 
  Users, 
  FileBarChart, 
  UserCircle,
  KeyRound,
  Store,
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react';
import { ActivePage, User } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: User | null;
  onLogout: () => void;
  lowStockCount: number;
}

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  currentUser, 
  onLogout,
  lowStockCount
}: SidebarProps) {
  
  const menuGroupMaster = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', name: 'Persediaan Buku', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Rendah` : undefined, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'categories', name: 'Master Kategori', icon: FolderTree },
    { id: 'products', name: 'Master Daftar Buku', icon: Tags },
  ];

  const menuGroupTransaction = [
    { id: 'incoming_form', name: 'Buku Masuk', icon: TrendingUp },
    { id: 'outgoing_form', name: 'Buku Keluar', icon: TrendingDown },
  ];

  const menuGroupOffice = [
    { id: 'users', name: 'Manajemen Pengguna', icon: Users, roleRestriction: 'Super Admin' },
    { id: 'reports', name: 'Laporan Persediaan', icon: FileBarChart },
  ];

  const menuSettings = [
    { id: 'profile', name: 'Ubah Profil', icon: UserCircle },
    { id: 'password', name: 'Ubah Password', icon: KeyRound },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen overflow-y-auto select-none grow-0 shrink-0">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/20">
          <Store size={22} />
        </div>
        <div>
          <h2 className="font-bold text-white text-sm tracking-tight leading-4">JWP Bookstore</h2>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Book Inventory</span>
        </div>
      </div>

      {/* User Quick Info */}
      {currentUser && (
        <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-950/30 flex items-center gap-3">
          <div className="relative">
            <img 
              src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop"} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full border border-slate-700/80 object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-semibold text-slate-200 text-xs truncate leading-normal">{currentUser.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-950/80 text-indigo-400 border border-indigo-900/40">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="p-4 flex-1 space-y-6">
        
        {/* GROUP 1: MASTER DATA */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Master & Data</span>
          <nav className="space-y-1">
            {menuGroupMaster.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as ActivePage)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-all duration-150 group cursor-pointer ${
                  activePage === item.id
                    ? 'bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={16} className={activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* GROUP 2: TRANSAKSI */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Operasional Mutasi</span>
          <nav className="space-y-1">
            {menuGroupTransaction.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as ActivePage)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-all duration-150 group cursor-pointer ${
                  activePage === item.id
                    ? 'bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={16} className={activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all text-slate-500" />
              </button>
            ))}
          </nav>
        </div>

        {/* GROUP 3: OFFICE & LOGS */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Manajerial & Laporan</span>
          <nav className="space-y-1">
            {menuGroupOffice.map((item) => {
              if (item.roleRestriction && currentUser?.role !== item.roleRestriction) {
                return null;
              }
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as ActivePage)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-all duration-150 group cursor-pointer ${
                    activePage === item.id
                      ? 'bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={16} className={activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all text-slate-500" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* GROUP 4: KREDENSIAL */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Sandi & Akun</span>
          <nav className="space-y-1">
            {menuSettings.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as ActivePage)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-all duration-150 group cursor-pointer ${
                  activePage === item.id
                    ? 'bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={16} className={activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-800/80 mt-auto bg-slate-950/20">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={16} />
          <span>Keluar Sesi Admin</span>
        </button>
      </div>

    </aside>
  );
}

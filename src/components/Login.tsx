/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Store, ShieldAlert, KeyRound, Mail, ArrowRight, BookOpen } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (email: string, password: string) => Promise<void>;
  onViewDesignFirst: () => void;
}

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';

export default function Login({ users, onLogin, onViewDesignFirst }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Form email dan password tidak boleh kosong!');
      return;
    }

    try {
      setIsSubmitting(true);
      await onLogin(email.trim(), password);
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Login gagal';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectQuickAdmin = (user: User) => {
    setEmail(user.email);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 z-10 relative">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl mb-4 shadow-xl shadow-indigo-600/20">
            <Store size={26} />
          </div>
          <h2 className="text-white text-xl font-bold tracking-tight">Sistem Inventori Toko Buku JWP</h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Kelola stok buku, stationery, transaksi keluar-masuk, dan laporan toko secara aman.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/40 text-rose-300 text-xs flex items-start gap-2.5">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wide">Email Admin</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={16} />
              <input
                type="email"
                placeholder="rekan@tokobuku-jwp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 text-slate-500" size={16} />
              <input
                type="password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-wait text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-indigo-600/10 mt-6"
          >
            {isSubmitting ? 'Memeriksa Database...' : 'Selesaikan Autentikasi'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60">
          <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center mb-3">
            Gunakan Akun Penguji (Klik Untuk Mengisi):
          </span>
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => selectQuickAdmin(user)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-[11px] border transition-all cursor-pointer text-left ${
                  email.toLowerCase() === user.email.toLowerCase()
                    ? 'bg-indigo-950/40 border-indigo-600 text-indigo-300'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300'
                }`}
              >
                <img
                  src={user.avatar || FALLBACK_AVATAR}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 truncate">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-400">
                      {user.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">{user.email}</span>
                </div>
                {user.status === 'Nonaktif' && (
                  <span className="text-[9px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded font-bold">Nonaktif</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onViewDesignFirst}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <BookOpen size={12} /> Baca Rancangan Sistem Terlebih Dahulu
          </button>
        </div>
      </div>

      <span className="text-[10px] text-slate-500 font-mono mt-6">
        Toko Buku JWP 2026 - Terproteksi standar autentikasi admin
      </span>
    </div>
  );
}

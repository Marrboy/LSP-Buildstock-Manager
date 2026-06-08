/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  ShieldAlert, 
  Trash2, 
  Edit2, 
  Eye,
  UserCheck, 
  Sparkles, 
  UserPlus, 
  ShieldCheck,
  Search,
  Lock,
  FileText
} from 'lucide-react';
import { User, UserPayload } from '../types';

interface UserManagementProps {
  users: User[];
  currentUser: User | null;
  onAddUser: (user: UserPayload) => void;
  onEditUser: (id: string, updated: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagement({ 
  users, 
  currentUser,
  onAddUser, 
  onEditUser, 
  onDeleteUser 
}: UserManagementProps) {
  
  const [search, setSearch] = useState('');
  
  // Slide Over state
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Super Admin'>('Admin');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingId(null);
    setDetailUser(null);
    setName('');
    setEmail('');
    setRole('Admin');
    setStatus('Aktif');
    setAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop');
    setPassword('');
    setPasswordConfirmation('');
    setErrorLocal(null);
    setIsOpenForm(true);
  };

  const openEditForm = (u: User) => {
    setEditingId(u.id);
    setDetailUser(null);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setStatus(u.status);
    setAvatar(u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop');
    setPassword('');
    setPasswordConfirmation('');
    setErrorLocal(null);
    setIsOpenForm(true);
  };

  const openDetailUser = (u: User) => {
    setIsOpenForm(false);
    setEditingId(null);
    setErrorLocal(null);
    setDetailUser(u);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);

    if (!name.trim() || !email.trim()) {
      setErrorLocal('Nama pengguna dan Email institusi wajib diisi lengkap!');
      return;
    }

    if (!email.toLowerCase().includes('@')) {
      setErrorLocal('Format alamat email institusi tidak valid!');
      return;
    }

    if (editingId) {
      onEditUser(editingId, {
        name,
        email: email.toLowerCase(),
        role,
        status,
        avatar
      });
    } else {
      if (password.length < 6) {
        setErrorLocal('Password minimal terdiri dari 6 karakter!');
        return;
      }

      if (password !== passwordConfirmation) {
        setErrorLocal('Password dan konfirmasi password harus sama!');
        return;
      }

      // Check duplicate email
      const emailExists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (emailExists) {
        setErrorLocal('Alamat email ini sudah terdaftar di sistem!');
        return;
      }

      onAddUser({
        name,
        email: email.toLowerCase(),
        role,
        status,
        avatar,
        password
      });
    }

    setIsOpenForm(false);
  };

  const handleDeleteUserClick = (u: User) => {
    // block self delete
    if (currentUser?.id === u.id) {
      alert('Akun yang sedang login tidak dapat dihapus.');
      return;
    }

    if (u.status === 'Aktif') {
      alert('Akun aktif yang masih bisa login ke dashboard tidak dapat dihapus. Nonaktifkan akun terlebih dahulu jika aksesnya harus dicabut.');
      return;
    }

    if (u.email === 'admin@toko-jwp.com') {
      alert('Sistem memproteksi admin utama! Anda tidak diperkenankan menghapus sandaran Super Admin bawaan.');
      return;
    }

    const confirm = window.confirm(`Hapus akun pengguna JWP '${u.name}'?`);
    if (confirm) {
      onDeleteUser(u.id);
      if (detailUser?.id === u.id) {
        setDetailUser(null);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Actions Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Manajemen Hak Akses Pengguna</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengaturan izin masuk admin dan super admin. Anda dapat menonaktifkan akun staff jika sedang cuti atau mutasi.
          </p>
        </div>
        <div>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md active:scale-[0.98] transition-all"
          >
            <Plus size={14} /> Beri Akses Pengguna Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Users list grid / table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden xl:col-span-3">
          
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <UserCheck size={12} /> Total {users.length} Admin Sistem
            </span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={12} />
              <input 
                type="text" 
                placeholder="Cari admin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 text-slate-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-4">Staff Admin</th>
                  <th className="p-4">Alamat Email</th>
                  <th className="p-4 text-center">Tingkat Hak Akses (Role)</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi Kendali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => {
                  const isMainAdmin = u.email === 'admin@toko-jwp.com';
                  const isLoginProtected = u.status === 'Aktif';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop"} 
                            alt={u.name} 
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-medium text-slate-500">{u.email}</td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide ${
                          u.role === 'Super Admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          u.status === 'Aktif' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {isMainAdmin ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openDetailUser(u)}
                              title="Detail Pengguna"
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                            <div className="text-[10px] text-slate-400 font-mono font-semibold flex items-center justify-center gap-1">
                              <Lock size={11} /> Master Keamanan
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openDetailUser(u)}
                              title="Detail Pengguna"
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => openEditForm(u)}
                              title="Sunting Status/Role"
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            {isLoginProtected ? (
                              <div
                                title="Akun aktif bisa login ke dashboard, sehingga tidak dapat dihapus"
                                className="text-[10px] text-slate-400 font-mono font-semibold flex items-center justify-center gap-1"
                              >
                                <Lock size={11} /> Login Aktif
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteUserClick(u)}
                                title="Hapus Akun Nonaktif"
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Side Panel: Edit/Form User */}
        {isOpenForm ? (
          <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-md space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b pb-3 border-indigo-100 mb-1">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                {editingId ? 'Rincian Hak Akses' : 'Beri Akses Staff Baru'}
              </span>
              <button 
                onClick={() => setIsOpenForm(false)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {errorLocal && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-lg flex items-start gap-2">
                <ShieldAlert size={14} strokeWidth={2.5} className="shrink-0 mt-0.5" />
                <span>{errorLocal}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Nama Lengkap Admin
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Ahmad Sofyan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Alamat Email Institusi (@toko-jwp.com)
                </label>
                <input 
                  type="email"
                  placeholder="sofyan@toko-jwp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!editingId}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 disabled:bg-slate-100 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Tingkat Hak Akses / Role JWP
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Admin">Admin (Hanya Mutasi Stok)</option>
                  <option value="Super Admin">Super Admin (Akses Penuh)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  Status Aktivitas
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                >
                  <option value="Aktif">Aktif (Diberikan Akses Masuk)</option>
                  <option value="Nonaktif">Nonaktif (Akses Diblokir Sementara)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                  URL Avatar Foto
                </label>
                <input 
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              {!editingId && (
                <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                      Password
                    </label>
                    <input 
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px] mb-1">
                      Konfirmasi Password
                    </label>
                    <input 
                      type="password"
                      placeholder="Ulangi password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenForm(false)}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer text-center"
                >
                  {editingId ? 'Simpan Akun' : 'Buka Akses Akun'}
                </button>
              </div>
            </form>

          </div>
        ) : detailUser ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={detailUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop"} 
                  alt={detailUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText size={12} /> Detail Pengguna
                  </span>
                  <h3 className="text-sm font-bold text-slate-950 mt-0.5">{detailUser.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setDetailUser(null)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Email</span>
                <strong className="block mt-1 font-mono text-slate-900">{detailUser.email}</strong>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Role</span>
                  <strong className="block mt-1 text-indigo-700">{detailUser.role}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                  <strong className={`block mt-1 ${detailUser.status === 'Aktif' ? 'text-emerald-700' : 'text-rose-600'}`}>{detailUser.status}</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => openEditForm(detailUser)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Edit Pengguna
              </button>
              {detailUser.status === 'Aktif' || detailUser.email === 'admin@toko-jwp.com' ? (
                <div
                  title="Akun yang masih bisa login ke dashboard tidak dapat dihapus"
                  className="px-3.5 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Lock size={13} /> Terkunci
                </div>
              ) : (
                <button
                  onClick={() => handleDeleteUserClick(detailUser)}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-indigo-950/5 border border-indigo-100 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <ShieldCheck className="text-indigo-600 mb-2" size={32} />
            <h4 className="font-bold text-xs text-indigo-950">Kelola Akuntabilitas & Penugasan</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-normal">
              Seluruh aktivitas personil dicatat demi menjaga audit data toko buku JWP. Hanya Super Admin yang berwenang mengubah tabel ini.
            </p>
            <button
              onClick={openAddForm}
              className="mt-4 px-3.5 py-2 rounded-xl text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
            >
              + Buat Sesi Baru
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

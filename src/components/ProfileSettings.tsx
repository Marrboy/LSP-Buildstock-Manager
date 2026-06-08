/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Mail,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileSettingsProps {
  mode?: 'profile' | 'password' | 'all';
  currentUser: UserType | null;
  onUpdateProfile: (name: string, email: string, avatar: string) => void;
  onUpdatePassword: (password: string) => void;
}

export default function ProfileSettings({
  mode = 'all',
  currentUser,
  onUpdateProfile,
  onUpdatePassword
}: ProfileSettingsProps) {
  const [profileName, setProfileName] = useState(currentUser?.name || 'Admin JWP');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'admin@toko-jwp.com');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showProfilePanel = mode !== 'password';
  const showPasswordPanel = mode !== 'profile';
  const wrapperClassName = showProfilePanel && showPasswordPanel
    ? 'max-w-4xl md:grid-cols-2'
    : 'max-w-2xl md:grid-cols-1';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileError('Nama dan alamat email tidak boleh dikosongkan.');
      return;
    }

    if (!profileEmail.includes('@')) {
      setProfileError('Masukkan format email institusi JWP yang valid.');
      return;
    }

    onUpdateProfile(profileName.trim(), profileEmail.trim(), profileAvatar.trim());
    setProfileSuccess('Profil akun berhasil diperbarui.');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Sandi lama, sandi baru, dan konfirmasi sandi wajib diisi.');
      return;
    }

    if (oldPassword !== 'password123' && oldPassword !== 'admin123') {
      setPasswordError('Sandi lama yang dimasukkan tidak cocok dengan database.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Sandi baru minimal terdiri dari 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi sandi tidak cocok dengan sandi baru.');
      return;
    }

    onUpdatePassword(newPassword);
    setPasswordSuccess('Kata sandi akun telah diperbarui.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const renderPasswordToggle = (
    isVisible: boolean,
    onToggle: () => void,
    label: string
  ) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isVisible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
    >
      {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  );

  return (
    <div className={`${wrapperClassName} mx-auto grid grid-cols-1 gap-6 select-none leading-relaxed text-xs`}>
      {showProfilePanel && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b pb-3 border-slate-100">
            <User className="text-indigo-600" size={18} />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ubah Profil Pengguna</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Edit nama tampilan, email, dan foto profil admin.</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-lg flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex flex-col items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <img
                src={profileAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] text-slate-400">Pratinjau Foto Profil Aktif</span>
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1.5">Nama Lengkap Admin</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1.5">Alamat Email Aktif</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={14} />
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1.5">Link URL Foto Profil</label>
              <input
                type="text"
                placeholder="Contoh: https://images.unsplash.com/..."
                value={profileAvatar}
                onChange={(e) => setProfileAvatar(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transform active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              Terapkan Perubahan Profil
            </button>
          </form>
        </div>
      )}

      {showPasswordPanel && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b pb-3 border-slate-100">
            <Lock className="text-indigo-600" size={18} />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Keamanan & Ubah Password</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Ubah kata sandi login secara berkala.</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-lg flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1.5">Kata Sandi Saat Ini</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={14} />
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="************"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden font-mono"
                />
                {renderPasswordToggle(showOldPassword, () => setShowOldPassword((value) => !value), 'sandi lama')}
              </div>
            </div>

            <div className="border-t border-slate-100/60 pt-3">
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1.5">Kata Sandi Baru</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={14} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Input password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden font-mono"
                />
                {renderPasswordToggle(showNewPassword, () => setShowNewPassword((value) => !value), 'sandi baru')}
              </div>
              {newPassword.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  <span className={`h-1.5 flex-1 rounded ${newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className={`h-1.5 flex-1 rounded ${newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-slate-200'}`}></span>
                  <span className={`h-1.5 flex-1 rounded ${newPassword.length >= 10 ? 'bg-emerald-500' : 'bg-slate-200'}`}></span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1.5">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={14} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden font-mono"
                />
                {renderPasswordToggle(showConfirmPassword, () => setShowConfirmPassword((value) => !value), 'konfirmasi sandi')}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transform active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Reset Kata Sandi Akun
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import {
  Shield,
  Check,
  Info,
  Clock,
  Lock,
  Fingerprint,
  Smartphone,
  Lightbulb,
  UserX,
  Zap,
  Layers,
  ArrowRight,
  Home,
  ExternalLink,
} from 'lucide-react';

interface PinSuccessViewProps {
  onBackToSettings: () => void;
  onGoHome: () => void;
  lastUpdated?: string;
  biometricActive?: boolean;
}

export const PinSuccessView: React.FC<PinSuccessViewProps> = ({
  onBackToSettings,
  onGoHome,
  lastUpdated = 'Hari ini, 24 Okt 2026 • 09:42 WIB',
  biometricActive = true,
}) => {
  return (
    <div className="flex flex-col w-full pb-8 animate-in fade-in duration-300">
      {/* Glowing Security Shield Graphic Container */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-6 px-4">
        {/* Ambient Radial Glow Accent */}
        <div className="absolute w-52 h-52 bg-blue-200/60 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute w-36 h-36 bg-teal-200/40 rounded-full blur-2xl -z-10 pointer-events-none translate-y-6" />

        {/* 3D Security Shield Badge Container */}
        <div className="relative w-36 h-36 flex items-center justify-center rounded-3xl bg-white shadow-[0_12px_32px_rgba(37,99,235,0.15)] p-3 transition-transform duration-500 hover:scale-105 border border-blue-100">
          {/* Rich SVG 3D Holographic Security Shield */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="shieldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="0.5" stopColor="#2563EB" />
                <stop offset="1" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="innerShield" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#93C5FD" stopOpacity="0.8" />
                <stop offset="1" stopColor="#1E40AF" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Outer Shield Shell */}
            <path
              d="M50 12L78 24V46C78 64.5 66 81.5 50 88C34 81.5 22 64.5 22 46V24L50 12Z"
              fill="url(#shieldGrad)"
            />
            {/* Inner Frosted Shield */}
            <path
              d="M50 20L72 30V47C72 61.5 62.5 75 50 80.5C37.5 75 28 61.5 28 47V30L50 20Z"
              fill="url(#innerShield)"
              stroke="#DBEAFE"
              strokeWidth="1.5"
            />
            {/* Glowing Padlock Icon */}
            <rect x="42" y="46" width="16" height="14" rx="3" fill="#FFFFFF" filter="url(#glow)" />
            <path
              d="M45 46V41C45 38.2 47.2 36 50 36C52.8 36 55 38.2 55 41V46"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="52" r="1.5" fill="#1D4ED8" />
            <path d="M50 53.5V56.5" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          {/* Verified Badge Indicator Micro Element */}
          <div className="absolute -bottom-2 -right-2 bg-[#006a61] text-white w-9 h-9 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,97,0.3)] ring-4 ring-white">
            <Check size={20} strokeWidth={3} />
          </div>
        </div>

        {/* Title & Celebration Copy */}
        <div className="flex flex-col items-center text-center mt-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#86f2e4]/40 text-[#006f66]">
            <Shield size={15} className="fill-[#006f66]" />
            <span className="text-[12px] font-semibold tracking-wide">Status: Terproteksi</span>
          </div>
          <h2 className="text-[24px] font-bold text-[#0F172A] pt-1 tracking-tight">
            PIN Berhasil Diperbarui!
          </h2>
          <p className="text-[14px] text-slate-500 max-w-[320px] leading-relaxed">
            PIN keamanan 6-digit Anda telah berhasil diubah dan aktif seketika untuk melindungi seluruh data keuangan Anda.
          </p>
        </div>
      </div>

      {/* Security Summary Card (Informasi Pembaruan) */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[#0F172A]">
              <Info size={18} className="text-[#004AC6]" />
              <span className="font-semibold text-[15px]">Detail Pembaruan</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              Sesi Aman
            </span>
          </div>

          <div className="space-y-3 pt-3">
            {/* Item 1: Waktu */}
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} />
                <span>Waktu Perubahan</span>
              </div>
              <span className="font-medium text-[#0F172A] text-right">
                {lastUpdated}
              </span>
            </div>

            {/* Item 2: Enkripsi */}
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2 text-slate-500">
                <Lock size={16} />
                <span>Tingkat Enkripsi</span>
              </div>
              <div className="flex items-center gap-1 text-[#004AC6] font-semibold">
                <span>AES-256 Bit</span>
                <Shield size={13} className="fill-[#004AC6]" />
              </div>
            </div>

            {/* Item 3: Metode Keamanan */}
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2 text-slate-500">
                <Fingerprint size={16} />
                <span>Metode Keamanan</span>
              </div>
              <span className="font-medium text-[#0F172A] text-right">
                {biometricActive ? '6-Digit PIN + Biometrik' : '6-Digit PIN Lokal'}
              </span>
            </div>

            {/* Item 4: Perangkat */}
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2 text-slate-500">
                <Smartphone size={16} />
                <span>Perangkat Utama</span>
              </div>
              <span className="font-medium text-[#0F172A] text-right">
                Galaxy S24 Ultra (Ini)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Best Practices & Tips Card */}
      <div className="px-4 mb-6">
        <div className="bg-[#f2f3ff] rounded-2xl p-4 border border-blue-100/80">
          <div className="flex items-center gap-2 mb-3 text-[#0F172A]">
            <Lightbulb size={18} className="text-[#006a61]" />
            <h3 className="font-semibold text-[15px]">Tips Keamanan Finora</h3>
          </div>

          <div className="space-y-3">
            {/* Tip 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 text-slate-500 shadow-xs">
                <UserX size={13} />
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Jangan bagikan PIN 6-digit kepada siapapun, termasuk staf customer service Finora.
              </p>
            </div>

            {/* Tip 2 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 text-slate-500 shadow-xs">
                <Zap size={13} />
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Aktifkan pemindaian Sidik Jari atau Face ID untuk otorisasi transaksi yang lebih cepat.
              </p>
            </div>

            {/* Tip 3 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 text-slate-500 shadow-xs">
                <Layers size={13} />
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Perubahan berlaku menyeluruh, sesi pada perangkat tetap terlindungi otomatis secara offline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="px-4 flex flex-col gap-3">
        {/* Primary CTA */}
        <button
          onClick={onBackToSettings}
          className="w-full h-12 bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.99] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,74,198,0.24)] transition-all"
        >
          <span>Kembali ke Pengaturan</span>
          <ArrowRight size={18} />
        </button>

        {/* Secondary CTA */}
        <button
          onClick={onGoHome}
          className="w-full h-12 bg-[#e2e7ff] hover:bg-[#dae2fd] active:scale-[0.99] text-[#004ac6] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all"
        >
          <Home size={18} />
          <span>Masuk ke Beranda Finora</span>
        </button>
      </div>

      {/* Microcopy Footer Link */}
      <div className="mt-6 text-center px-4">
        <p className="text-[12px] text-slate-500">
          Ada kendala atau aktivitas mencurigakan?
        </p>
        <button
          onClick={() => {
            alert('Pusat Bantuan Keamanan Finora: Seluruh data keuangan tersimpan lokal secara offline di memori aman perangkat Anda.');
          }}
          className="inline-flex items-center gap-1 text-[13px] text-[#004ac6] font-semibold mt-1 hover:underline"
        >
          <span>Hubungi Bantuan Keamanan Finora</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

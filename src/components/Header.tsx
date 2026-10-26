import React from 'react';
import { ArrowLeft, WifiOff, BatteryMedium, Signal } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  userName?: string;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  userName = 'Budi Santoso',
  onProfileClick,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
      <div className="max-w-md mx-auto">
        {/* Device Status Bar */}
        <div className="h-6 px-4 flex items-center justify-between text-slate-500 text-[12px] font-semibold">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
              <WifiOff size={11} className="text-emerald-600" />
              100% Offline
            </span>
            <Signal size={13} className="text-slate-400" />
            <BatteryMedium size={15} className="text-slate-500" />
          </div>
        </div>

        {/* App Bar */}
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && onBack ? (
              <button
                onClick={onBack}
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-700 hover:text-[#004AC6] hover:bg-slate-100 transition-colors"
                aria-label="Kembali"
              >
                <ArrowLeft size={22} />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1D4ED8] to-[#2563EB] flex items-center justify-center shadow-sm text-white font-bold text-lg tracking-tight">
                F
              </div>
            )}
            <h1 className="font-semibold text-[19px] text-[#0F172A] tracking-tight truncate max-w-[220px]">
              {title || 'Finora'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-100 transition-colors group"
              aria-label="Profil Pengguna"
            >
              <div className="w-8 h-8 rounded-full bg-[#DBEAFE] border border-blue-200 text-[#1D4ED8] font-bold text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0)}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

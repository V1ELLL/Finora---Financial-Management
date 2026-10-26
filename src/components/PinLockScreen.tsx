import React, { useState } from 'react';
import { Lock, Fingerprint, Delete, ShieldCheck } from 'lucide-react';

interface PinLockScreenProps {
  correctPin: string;
  onUnlock: () => void;
  userName?: string;
  biometricEnabled?: boolean;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin,
  onUnlock,
  userName = 'Budi Santoso',
  biometricEnabled = true,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (digit: string) => {
    if (enteredPin.length < 6) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setError(false);

      if (next.length === 6) {
        if (next === correctPin) {
          setTimeout(() => {
            onUnlock();
          }, 150);
        } else {
          setTimeout(() => {
            setError(true);
            setEnteredPin('');
          }, 200);
        }
      }
    }
  };

  const handleDelete = () => {
    setError(false);
    setEnteredPin((p) => p.slice(0, -1));
  };

  const handleBiometricUnlock = () => {
    // Simulated instant biometric authentication
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col items-center justify-between p-6 select-none">
      {/* Top Brand & Status */}
      <div className="w-full max-w-sm flex flex-col items-center pt-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1D4ED8] to-[#2563EB] flex items-center justify-center text-white text-3xl font-extrabold shadow-md mb-3">
          F
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#004AC6] text-[11px] font-semibold mb-2">
          <ShieldCheck size={14} />
          <span>Finora Vault • Terproteksi Offline</span>
        </div>
        <h2 className="text-[20px] font-bold text-[#0F172A]">Selamat Datang Kembali</h2>
        <p className="text-[13px] text-slate-500">{userName}</p>
      </div>

      {/* PIN Dots Area */}
      <div className="w-full max-w-sm flex flex-col items-center">
        <p className="text-[14px] font-medium text-slate-600 mb-4">
          Masukkan 6-Digit PIN Anda
        </p>

        <div className={`flex items-center justify-center gap-3 mb-3 ${error ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#004AC6] scale-110 shadow-xs'
                    : 'border-2 border-slate-300 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {error ? (
          <p className="text-[12px] font-semibold text-rose-600">
            PIN salah. Silakan coba kembali (Default: 123456)
          </p>
        ) : (
          <p className="text-[11px] text-slate-400">PIN bawaan awal: 123456</p>
        )}
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs pb-6">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-16 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 active:scale-95 text-[24px] font-bold text-[#0F172A] transition-all shadow-xs flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          {biometricEnabled ? (
            <button
              type="button"
              onClick={handleBiometricUnlock}
              className="h-16 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100/70 text-[#004AC6] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
              aria-label="Buka dengan Biometrik"
            >
              <Fingerprint size={24} />
              <span className="text-[9px] font-bold">Biometrik</span>
            </button>
          ) : (
            <div className="h-16" />
          )}

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-16 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 active:scale-95 text-[24px] font-bold text-[#0F172A] transition-all shadow-xs flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-16 rounded-2xl hover:bg-slate-100 active:scale-95 text-slate-500 transition-all flex items-center justify-center"
            aria-label="Hapus Digit"
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

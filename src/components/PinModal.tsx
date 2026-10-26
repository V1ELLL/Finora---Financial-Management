import React, { useState } from 'react';
import { X, Lock, Check, Delete } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPinSaved: (newPin: string) => void;
  currentPin?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onPinSaved,
  currentPin,
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    setError('');
    if (step === 'enter') {
      if (pin.length < 6) {
        const next = pin + num;
        setPin(next);
        if (next.length === 6) {
          setTimeout(() => {
            setStep('confirm');
          }, 150);
        }
      }
    } else {
      if (confirmPin.length < 6) {
        const next = confirmPin + num;
        setConfirmPin(next);
        if (next.length === 6) {
          if (next === pin) {
            onPinSaved(next);
            onClose();
          } else {
            setError('PIN konfirmasi tidak cocok. Silakan coba lagi.');
            setConfirmPin('');
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setError('');
    if (step === 'enter') {
      setPin(p => p.slice(0, -1));
    } else {
      setConfirmPin(p => p.slice(0, -1));
    }
  };

  const handleReset = () => {
    setPin('');
    setConfirmPin('');
    setStep('enter');
    setError('');
  };

  const activeValue = step === 'enter' ? pin : confirmPin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#004AC6] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Lock size={26} />
        </div>

        <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">
          {step === 'enter' ? 'Buat PIN 6-Digit Baru' : 'Konfirmasi PIN Anda'}
        </h3>
        <p className="text-[13px] text-slate-500 mb-6">
          {step === 'enter'
            ? 'Masukkan 6 digit angka untuk mengamankan data transaksi'
            : 'Masukkan kembali 6 digit angka untuk memastikan'}
        </p>

        {/* 6 Dots Indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = activeValue.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#004AC6] scale-110 shadow-xs'
                    : 'border-2 border-slate-300 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {error && <p className="text-[12px] font-semibold text-rose-600 mb-4">{error}</p>}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto mb-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-[22px] font-bold text-slate-800 transition-all shadow-xs flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleReset}
            className="h-14 rounded-2xl text-[12px] font-semibold text-slate-500 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-[22px] font-bold text-slate-800 transition-all shadow-xs flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
            aria-label="Hapus Digit"
          >
            <Delete size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

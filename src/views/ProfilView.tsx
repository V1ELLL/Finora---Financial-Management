import React, { useState, useRef } from 'react';
import {
  User,
  Shield,
  Lock,
  Fingerprint,
  Wallet,
  Download,
  Upload,
  RefreshCw,
  Check,
  Edit2,
  Trash2,
  Plus,
  Info,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, Wallet as WalletType, Category, Transaction } from '../types/finance';
import { formatRupiah, exportTransactionsToCSV } from '../utils/finance';

interface ProfilViewProps {
  profile: UserProfile;
  wallets: WalletType[];
  categories: Category[];
  transactions: Transaction[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenPinModal: () => void;
  onViewPinStatus: () => void;
  onLockApp: () => void;
  onAddWallet: (wallet: Omit<WalletType, 'id'>) => void;
  onUpdateWallet: (id: string, updated: Partial<WalletType>) => void;
  onDeleteWallet: (id: string) => void;
  onExportBackup: () => void;
  onRestoreBackup: (fileContent: string) => void;
  onResetDatabase: () => void;
}

export const ProfilView: React.FC<ProfilViewProps> = ({
  profile,
  wallets,
  categories,
  transactions,
  onUpdateProfile,
  onOpenPinModal,
  onViewPinStatus,
  onLockApp,
  onAddWallet,
  onUpdateWallet,
  onDeleteWallet,
  onExportBackup,
  onRestoreBackup,
  onResetDatabase,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  // Wallet Modal
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState<WalletType['type']>('cash');
  const [walletBalanceStr, setWalletBalanceStr] = useState('');

  // File upload input ref for local backup restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
      setIsEditingName(false);
    }
  };

  const handleOpenAddWallet = (walletToEdit?: WalletType) => {
    if (walletToEdit) {
      setEditingWallet(walletToEdit);
      setWalletName(walletToEdit.name);
      setWalletType(walletToEdit.type);
      setWalletBalanceStr(walletToEdit.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
    } else {
      setEditingWallet(null);
      setWalletName('');
      setWalletType('cash');
      setWalletBalanceStr('');
    }
    setIsWalletModalOpen(true);
  };

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseInt(walletBalanceStr.replace(/[^0-9]/g, ''), 10) || 0;
    if (!walletName.trim()) return;

    if (editingWallet) {
      onUpdateWallet(editingWallet.id, {
        name: walletName.trim(),
        type: walletType,
        balance,
      });
    } else {
      const colors = { cash: '#16A34A', bank: '#2563EB', ewallet: '#0073AE' };
      onAddWallet({
        name: walletName.trim(),
        type: walletType,
        balance,
        icon: walletType === 'bank' ? 'CreditCard' : walletType === 'ewallet' ? 'Smartphone' : 'Wallet',
        color: colors[walletType],
      });
    }

    setIsWalletModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onRestoreBackup(content);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleExportCSV = () => {
    const csvContent = exportTransactionsToCSV(transactions, categories, wallets);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Finora_Semua_Transaksi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
            {profile.name.charAt(0)}
          </div>
          <div>
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="text-[15px] font-bold border border-[#2563EB] rounded-lg px-2 py-0.5 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 bg-[#2563EB] text-white rounded-lg text-xs"
                >
                  <Check size={14} />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#0F172A]">{profile.name}</h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-[#2563EB]"
                  aria-label="Ubah Nama"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck size={13} />
              Akun Lokal Terproteksi (Offline)
            </p>
          </div>
        </div>
      </div>

      {/* Security & PIN Settings Card (Matches Image_22) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#004AC6] flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] text-[#0F172A]">Keamanan & PIN Finora</h3>
              <p className="text-[11px] text-slate-500">Enkripsi AES-256 Bit di perangkat</p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
            Terproteksi
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 space-y-2.5 border border-slate-100 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Metode Keamanan</span>
            <span className="font-semibold text-slate-800">
              6-Digit PIN {profile.biometricEnabled ? '+ Biometrik' : ''}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Waktu Pembaruan Terakhir</span>
            <span className="font-semibold text-slate-800 text-[12px]">
              {profile.lastPinUpdate || 'Hari ini • 09:42 WIB'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Fingerprint size={16} className="text-[#006a61]" />
              Otorisasi Biometrik
            </span>
            <button
              onClick={() => onUpdateProfile({ biometricEnabled: !profile.biometricEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                profile.biometricEnabled ? 'bg-[#006a61]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  profile.biometricEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Security Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={onOpenPinModal}
            className="h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#004AC6] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Lock size={14} />
            <span>Ubah PIN 6-Digit</span>
          </button>

          <button
            onClick={onViewPinStatus}
            className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck size={14} />
            <span>Status Proteksi</span>
          </button>
        </div>

        <button
          onClick={onLockApp}
          className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Lock size={14} />
          <span>Kunci Aplikasi Sekarang</span>
        </button>
      </div>

      {/* Manage Wallets & Accounts */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Wallet size={17} />
            </div>
            <h3 className="font-semibold text-[15px] text-[#0F172A]">Daftar Dompet ({wallets.length})</h3>
          </div>
          <button
            onClick={() => handleOpenAddWallet()}
            className="text-[12px] font-semibold text-[#2563EB] flex items-center gap-1 hover:underline"
          >
            <Plus size={14} />
            <span>Tambah</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {wallets.map((w) => (
            <div key={w.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: w.color }}
                />
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{w.name}</p>
                  <p className="text-[11px] text-slate-500 uppercase">{w.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-slate-900 tabular-nums">
                  {formatRupiah(w.balance)}
                </span>
                <button
                  onClick={() => handleOpenAddWallet(w)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                  aria-label="Ubah Dompet"
                >
                  <Edit2 size={14} />
                </button>
                {wallets.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Hapus dompet ${w.name}?`)) {
                        onDeleteWallet(w.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    aria-label="Hapus Dompet"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Backup & Export Management */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006a61] flex items-center justify-center">
            <Download size={17} />
          </div>
          <div>
            <h3 className="font-semibold text-[15px] text-[#0F172A]">Cadangkan & Ekspor Data</h3>
            <p className="text-[11px] text-slate-500">100% Offline tanpa server atau cloud</p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {/* Ekspor CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <p className="text-[13px] font-semibold text-slate-800">Ekspor Semua Transaksi ke CSV</p>
              <p className="text-[11px] text-slate-500">Kompatibel dengan Microsoft Excel dan spreadsheet lokal</p>
            </div>
            <Download size={16} className="text-[#2563EB]" />
          </button>

          {/* Backup Database */}
          <button
            onClick={onExportBackup}
            className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <p className="text-[13px] font-semibold text-slate-800">Unduh Cadangan Database (.json)</p>
              <p className="text-[11px] text-slate-500">Menyimpan transaksi, dompet, kategori, anggaran & target</p>
            </div>
            <Download size={16} className="text-teal-600" />
          </button>

          {/* Restore Database */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 rounded-xl border border-dashed border-slate-300 hover:border-[#2563EB] hover:bg-blue-50/30 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <p className="text-[13px] font-semibold text-slate-800">Pulihkan dari File Cadangan</p>
              <p className="text-[11px] text-slate-500">Pilih file .json cadangan Finora untuk diimpor</p>
            </div>
            <Upload size={16} className="text-[#2563EB]" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* App Architecture & Reset */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-center">
        <p className="text-[12px] font-bold text-slate-700">
          Finora v2.4 • Offline Personal Financial Suite
        </p>
        <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
          Arsitektur lokal SQLite Room Engine. Tidak ada telemetri, iklan, ataupun koneksi internet eksternal.
        </p>

        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mengatur ulang data ke kondisi awal demonstrasi?')) {
              onResetDatabase();
            }
          }}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-rose-600 hover:text-rose-800 pt-2"
        >
          <RefreshCw size={13} />
          <span>Atur Ulang Data ke Awal</span>
        </button>
      </div>

      {/* Add / Edit Wallet Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl">
            <h4 className="text-[16px] font-bold text-[#0F172A] mb-3">
              {editingWallet ? 'Ubah Dompet' : 'Tambah Dompet Baru'}
            </h4>
            <form onSubmit={handleSaveWallet} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Nama Dompet / Akun
                </label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="Contoh: Dompet Kas, Mandiri, OVO"
                  className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Jenis Dompet
                </label>
                <select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value as WalletType['type'])}
                  className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="cash">Kas Tunai (Cash)</option>
                  <option value="bank">Rekening Bank</option>
                  <option value="ewallet">E-Wallet (GoPay, OVO, ShopeePay)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Saldo Saat Ini
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#2563EB]">
                  <span className="text-[14px] font-bold text-slate-400 mr-1.5">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={walletBalanceStr}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      setWalletBalanceStr(clean ? parseInt(clean, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '');
                    }}
                    placeholder="0"
                    className="w-full text-[15px] font-bold text-[#0F172A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(false)}
                  className="flex-1 py-2 text-[13px] font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8]"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

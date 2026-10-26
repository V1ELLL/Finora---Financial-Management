import React, { useState, useEffect } from 'react';
import { Lightbulb, Shuffle, ChevronRight, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';

export interface FinancialTip {
  id: string;
  category: string;
  title: string;
  content: string;
  action: string;
}

export const FINANCIAL_TIPS: FinancialTip[] = [
  {
    id: 'tip_1',
    category: 'Prinsip Dasar',
    title: 'Metode Alokasi 50/30/20',
    content: 'Bagi penghasilan Anda ke 3 pos utama: 50% untuk kebutuhan pokok (makan, sewa, tagihan), 30% untuk keinginan gaya hidup, dan minimal 20% untuk tabungan atau investasi.',
    action: 'Cek persentase pengeluaran Anda di tab Statistik bulan ini.',
  },
  {
    id: 'tip_2',
    category: 'Kebiasaan Hemat',
    title: 'Waspadai Pengeluaran "Latte Factor"',
    content: 'Pengeluaran mikro rutin seperti kopi Rp25.000 setiap hari kerja dapat menumpuk hingga Rp550.000 sebulan atau Rp6,6 juta setahun tanpa disadari.',
    action: 'Catat setiap transaksi kecil di Finora agar arus kas tetap transparan.',
  },
  {
    id: 'tip_3',
    category: 'Dana Darurat',
    title: 'Prioritaskan Dana Darurat Siaga',
    content: 'Sebelum memulai investasi berisiko, bangun fondasi dana darurat minimal 3–6 kali pengeluaran bulanan di instrumen likuid seperti rekening bank atau reksadana pasar uang.',
    action: 'Gunakan fitur Target Tabungan Finora untuk memantau progres dana darurat Anda.',
  },
  {
    id: 'tip_4',
    category: 'Strategi Gaji',
    title: 'Menabung di Awal, Bukan Sisanya',
    content: 'Begitu gaji masuk ke rekening, langsung alokasikan 20% ke tabungan target. Jangan menabung dari uang sisa akhir bulan karena uang biasanya akan habis terpakai.',
    action: 'Lakukan setor tabungan di Finora tepat di hari gajian.',
  },
  {
    id: 'tip_5',
    category: 'Belanja Bijak',
    title: 'Aturan Jeda 24 Jam Sebelum Beli',
    content: 'Saat ingin membeli barang non-pokok yang tidak ada dalam daftar belanja, tunggu selama 24 jam. Sebagian besar keinginan impulsif akan mereda setelah Anda tidur.',
    action: 'Bandingkan kebutuhan versus keinginan sebelum membuka dompet.',
  },
  {
    id: 'tip_6',
    category: 'Efisiensi Rutin',
    title: 'Audit Langganan Digital Berkala',
    content: 'Periksa langganan streaming, aplikasi musik, atau membership gym yang jarang digunakan. Menghentikan 2 langganan yang tidak terpakai bisa menghemat ratusan ribu rupiah per bulan.',
    action: 'Periksa transaksi kategori Tagihan di Finora.',
  },
  {
    id: 'tip_7',
    category: 'Manajemen Utang',
    title: 'Batas Rasio Beban Utang Sehat',
    content: 'Pastikan total cicilan utang bulanan (KPR, kendaraan, cicilan) tidak melebihi 30% dari total pendapatan bersih Anda untuk menjaga fleksibilitas keuangan.',
    action: 'Pertahankan arus kas surplus di atas 15% setiap bulan.',
  },
  {
    id: 'tip_8',
    category: 'Perencanaan',
    title: 'Sediakan Anggaran untuk Bersenang-senang',
    content: 'Pengelolaan keuangan yang terlalu ketat mudah memicu "belanja balas dendam". Tetapkan batas anggaran hiburan yang wajar agar Anda tetap menikmati hasil kerja keras.',
    action: 'Tetapkan batas anggaran kategori Hiburan & Hobi di Finora.',
  },
  {
    id: 'tip_9',
    category: 'Kebiasaan Finansial',
    title: 'Evaluasi Mingguan 5 Menit',
    content: 'Luangkan waktu 5 menit setiap hari Minggu malam untuk meninjau total pengeluaran seminggu terakhir dan memastikan anggaran mingguan masih aman terkendali.',
    action: 'Buka grafik tren pengeluaran 7 hari di tab Statistik.',
  },
  {
    id: 'tip_10',
    category: 'Inflasi & Aset',
    title: 'Lindungi Nilai Uang Jangka Panjang',
    content: 'Uang tunai yang didiamkan di tabungan biasa akan tergerus inflasi tahunan. Setelah dana darurat terpenuhi, mulailah berinvestasi pada instrumen yang memberikan imbal hasil di atas inflasi.',
    action: 'Pisahkan dompet tabungan dan investasi di daftar Dompet Finora.',
  },
];

const SAVED_FAVORITE_KEY = 'finora_favorite_tips_v1';

export const FinancialTipsCard: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Calculate daily deterministic tip index based on day of year
  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const initialIdx = dayOfYear % FINANCIAL_TIPS.length;
    setTipIndex(initialIdx);

    try {
      const storedFavs = localStorage.getItem(SAVED_FAVORITE_KEY);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    } catch {
      // safe fallback
    }
  }, []);

  const currentTip = FINANCIAL_TIPS[tipIndex] || FINANCIAL_TIPS[0];
  const isFavorite = favorites.includes(currentTip.id);

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % FINANCIAL_TIPS.length);
  };

  const handleToggleFavorite = () => {
    const updated = isFavorite
      ? favorites.filter((id) => id !== currentTip.id)
      : [...favorites, currentTip.id];
    setFavorites(updated);
    try {
      localStorage.setItem(SAVED_FAVORITE_KEY, JSON.stringify(updated));
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white rounded-2xl p-5 border border-amber-200/70 shadow-[0_2px_8px_rgba(217,119,6,0.06)] relative overflow-hidden">
      {/* Decorative ambient shine */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <Lightbulb size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-[14px] text-amber-950">Tips Finansial Harian</h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-200/70 text-amber-900 border border-amber-300/60">
                  {currentTip.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleFavorite}
              className="w-8 h-8 rounded-lg text-amber-700 hover:bg-amber-100/70 flex items-center justify-center transition-colors"
              aria-label={isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
              title={isFavorite ? 'Tersimpan di Favorit' : 'Simpan Tips'}
            >
              {isFavorite ? (
                <BookmarkCheck size={17} className="text-amber-800 fill-amber-700" />
              ) : (
                <Bookmark size={17} />
              )}
            </button>
            <button
              onClick={handleNextTip}
              className="h-8 px-2.5 rounded-lg bg-white/80 border border-amber-200 hover:bg-white text-amber-900 text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
              aria-label="Ganti Tips Acak"
              title="Tampilkan tips keuangan lainnya"
            >
              <Shuffle size={13} />
              <span>Ganti</span>
            </button>
          </div>
        </div>

        {/* Tip Title & Content */}
        <div className="space-y-1.5 pt-1">
          <h4 className="text-[14px] font-bold text-slate-900">
            {currentTip.title}
          </h4>
          <p className="text-[12px] text-slate-700 leading-relaxed">
            {currentTip.content}
          </p>
        </div>

        {/* Action Suggestion Callout */}
        <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-start gap-1.5 text-[11px] text-amber-900 font-medium">
          <Sparkles size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <span><strong className="font-bold">Langkah Praktis:</strong> {currentTip.action}</span>
        </div>
      </div>
    </div>
  );
};

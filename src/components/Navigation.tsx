import React from 'react';
import { Home, ReceiptText, BarChart3, User } from 'lucide-react';

export type NavTab = 'beranda' | 'transaksi' | 'statistik' | 'profil';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'beranda' as NavTab, label: 'Beranda', icon: Home },
    { id: 'transaksi' as NavTab, label: 'Transaksi', icon: ReceiptText },
    { id: 'statistik' as NavTab, label: 'Statistik', icon: BarChart3 },
    { id: 'profil' as NavTab, label: 'Profil', icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] pb-safe"
    >
      <div className="max-w-md mx-auto h-[76px] px-3 grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group flex flex-col items-center justify-center h-full min-h-[44px] transition-colors focus:outline-none"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#DBEAFE] text-[#1D4ED8] scale-100'
                    : 'text-slate-500 hover:text-slate-900 group-hover:scale-105'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-[#1D4ED8]' : 'text-slate-500'}
                />
              </div>
              <span
                className={`text-[11px] mt-1 transition-colors ${
                  isActive
                    ? 'font-bold text-[#1D4ED8]'
                    : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

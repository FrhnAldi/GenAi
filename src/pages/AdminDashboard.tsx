import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, LogOut, PackageSearch, Receipt } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import OverviewTab from '../components/admin/OverviewTab';
import SalesRecapTab from '../components/admin/SalesRecapTab';
import StockTab from '../components/admin/StockTab';

type TabKey = 'overview' | 'recap' | 'stock';

const TABS: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
  { key: 'recap', label: 'Rekap Penjualan', icon: Receipt },
  { key: 'stock', label: 'Kelola Stok', icon: PackageSearch },
];

export default function AdminDashboard() {
  const { products, transactions } = useAppData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-zinc-200 bg-white">
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="h-5 w-px bg-zinc-200 hidden sm:block" />
        <h1 className="font-bold text-zinc-900 text-sm sm:text-base">
          RasaNusa <span className="text-amber-500">Admin</span>
        </h1>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:block text-sm text-zinc-600">
            Halo, <span className="font-semibold text-zinc-900">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium bg-zinc-900 text-white px-3.5 py-2 rounded-full hover:bg-zinc-700 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === t.key
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && <OverviewTab products={products} transactions={transactions} />}
        {tab === 'recap' && <SalesRecapTab transactions={transactions} />}
        {tab === 'stock' && <StockTab products={products} />}
      </div>
    </div>
  );
}

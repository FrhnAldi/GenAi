import { useMemo, useState } from 'react';
import { Banknote, CreditCard, QrCode, Receipt, Wallet } from 'lucide-react';
import { formatIDR } from '../../data/products';
import type { PaymentMethod, Transaction } from '../../types/pos';

interface Props {
  transactions: Transaction[];
}

const METHOD_META: Record<PaymentMethod, { label: string; icon: typeof Banknote; color: string }> = {
  tunai: { label: 'Tunai', icon: Banknote, color: 'text-emerald-600 bg-emerald-50' },
  qris: { label: 'QRIS', icon: QrCode, color: 'text-sky-600 bg-sky-50' },
  kartu: { label: 'Kartu', icon: CreditCard, color: 'text-violet-600 bg-violet-50' },
  ewallet: { label: 'E-Wallet', icon: Wallet, color: 'text-amber-600 bg-amber-50' },
};

export default function SalesRecapTab({ transactions }: Props) {
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'semua'>('semua');

  const filtered = useMemo(() => {
    const list =
      methodFilter === 'semua' ? transactions : transactions.filter((t) => t.paymentMethod === methodFilter);
    return [...list].sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions, methodFilter]);

  const totalsByMethod = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((t) => (map[t.paymentMethod] = (map[t.paymentMethod] ?? 0) + t.total));
    return map;
  }, [transactions]);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalItems = transactions.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500">Total Pendapatan</p>
          <p className="text-lg font-bold text-emerald-600">{formatIDR(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500">Total Item Terjual</p>
          <p className="text-lg font-bold text-zinc-900">{totalItems} item</p>
        </div>
        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500">Jumlah Transaksi</p>
          <p className="text-lg font-bold text-zinc-900">{transactions.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
          <p className="text-xs text-zinc-500">Estimasi Keuntungan</p>
          <p className="text-lg font-bold text-emerald-600">{formatIDR(totalRevenue * 0.4)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={methodFilter === 'semua'}
          onClick={() => setMethodFilter('semua')}
          label={`Semua (${transactions.length})`}
        />
        {(Object.keys(METHOD_META) as PaymentMethod[]).map((m) => (
          <FilterChip
            key={m}
            active={methodFilter === m}
            onClick={() => setMethodFilter(m)}
            label={`${METHOD_META[m].label} · ${formatIDR(totalsByMethod[m] ?? 0)}`}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
          <Receipt size={15} className="text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-900">Riwayat Transaksi</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="py-14 text-center text-sm text-zinc-400">Belum ada transaksi.</div>
        ) : (
          <div className="divide-y divide-zinc-100 max-h-[420px] overflow-y-auto">
            {filtered.map((t) => {
              const meta = METHOD_META[t.paymentMethod];
              const Icon = meta.icon;
              return (
                <div key={t.id} className="px-5 py-3 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {t.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                      </p>
                      <p className="text-sm font-bold text-emerald-600 flex-shrink-0">{formatIDR(t.total)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-zinc-400">
                        {new Date(t.timestamp).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-[11px] text-zinc-300">·</span>
                      <span className="text-[11px] text-zinc-400">{meta.label}</span>
                      <span className="text-[11px] text-zinc-300">·</span>
                      <span className="text-[11px] text-zinc-400">Kasir: {t.cashierName}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
      }`}
    >
      {label}
    </button>
  );
}

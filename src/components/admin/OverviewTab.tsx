import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Package, TrendingUp, Wallet, Utensils } from 'lucide-react';
import { formatIDR, CATEGORY_LABELS } from '../../data/products';
import type { Product, Transaction } from '../../types/pos';

interface Props {
  products: Product[];
  transactions: Transaction[];
}

export default function OverviewTab({ products, transactions }: Props) {
  const totalItems = transactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const estimatedProfit = totalRevenue * 0.4;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const revenueByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    const productMap: Record<string, Product> = {};
    products.forEach((p) => (productMap[p.id] = p));
    transactions.forEach((t) => {
      t.items.forEach((item) => {
        const cat = productMap[item.productId]?.category ?? 'lainnya';
        map[cat] = (map[cat] ?? 0) + item.price * item.quantity;
      });
    });
    return Object.entries(map).map(([category, revenue]) => ({
      category: CATEGORY_LABELS[category] ?? category,
      revenue,
    }));
  }, [products, transactions]);

  const topItems = useMemo(() => {
    const map: Record<string, { name: string; qty: number }> = {};
    transactions.forEach((t) => {
      t.items.forEach((item) => {
        if (!map[item.productId]) map[item.productId] = { name: item.name, qty: 0 };
        map[item.productId].qty += item.quantity;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map((i) => ({ name: i.name.length > 16 ? i.name.slice(0, 16) + '…' : i.name, qty: i.qty }));
  }, [transactions]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Wallet size={18} className="text-emerald-600" />}
          label="Total Pendapatan"
          value={formatIDR(totalRevenue)}
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-600" />}
          label="Estimasi Keuntungan"
          value={formatIDR(estimatedProfit)}
          bg="bg-emerald-50"
          sub="40% dari pendapatan"
        />
        <StatCard
          icon={<Package size={18} className="text-amber-600" />}
          label="Item Terjual"
          value={`${totalItems} item`}
          bg="bg-amber-50"
        />
        <StatCard
          icon={<Utensils size={18} className="text-red-500" />}
          label="Stok Perlu Perhatian"
          value={`${lowStockCount + outOfStockCount} menu`}
          bg="bg-red-50"
          sub={`${outOfStockCount} habis · ${lowStockCount} menipis`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">Pendapatan per Kategori</h3>
          {revenueByCategory.length === 0 ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="#a1a1aa"
                  tickFormatter={(v) => `${Math.round(v / 1000)}rb`}
                />
                <Tooltip formatter={(v) => formatIDR(Number(v))} />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">5 Menu Terlaris</h3>
          {topItems.length === 0 ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topItems} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} stroke="#a1a1aa" />
                <Tooltip formatter={(v) => `${v} terjual`} />
                <Bar dataKey="qty" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="h-[220px] flex items-center justify-center text-sm text-zinc-400">
      Belum ada data transaksi.
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  sub?: string;
}) {
  return (
    <div className={`rounded-2xl p-4 flex items-start gap-3 ${bg}`}>
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-base sm:text-lg font-bold text-zinc-900 leading-tight truncate">{value}</p>
        {sub && <p className="text-[11px] text-zinc-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { AlertTriangle, Minus, Pencil, Plus, Search, Trash2, PackagePlus } from 'lucide-react';
import { formatIDR, CATEGORY_LABELS } from '../../data/products';
import type { Category, Product } from '../../types/pos';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import ProductFormModal from './ProductFormModal';

const TABS: (Category | 'semua')[] = ['semua', 'makanan', 'camilan', 'minuman', 'dessert'];

export default function StockTab({ products }: { products: Product[] }) {
  const { adjustStock, removeProduct } = useAppData();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Category | 'semua'>('semua');
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [formState, setFormState] = useState<{ mode: 'add' | 'edit'; product?: Product } | null>(null);

  const filtered = useMemo(() => {
    let list = tab === 'semua' ? products : products.filter((p) => p.category === tab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [products, tab, query]);

  const getAmount = (id: string) => amounts[id] ?? 1;

  const handleAdjust = (product: Product, direction: 1 | -1) => {
    const amount = getAmount(product.id);
    if (!amount || amount <= 0) return;
    adjustStock(
      product.id,
      direction * amount,
      direction === 1 ? 'Restock manual oleh admin' : 'Pengurangan stok manual oleh admin',
      user?.name ?? 'Admin'
    );
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Hapus menu "${product.name}" dari katalog?`)) {
      removeProduct(product.id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                tab === t
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {CATEGORY_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="relative sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu..."
            className="w-full pl-8 pr-3 py-2 rounded-full text-sm border border-zinc-200 bg-white outline-none focus:border-zinc-400"
          />
        </div>
        <button
          onClick={() => setFormState({ mode: 'add' })}
          className="sm:ml-auto flex items-center justify-center gap-1.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full transition-colors"
        >
          <PackagePlus size={15} /> Tambah Menu
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-14 text-center text-sm text-zinc-400">Tidak ada menu ditemukan.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filtered.map((product) => {
              const isLow = product.stock > 0 && product.stock <= 5;
              const isOut = product.stock === 0;
              return (
                <div key={product.id} className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-11 h-11 rounded-lg object-cover flex-shrink-0 bg-zinc-100"
                  />
                  <div className="min-w-[140px] flex-1">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{product.name}</p>
                    <p className="text-xs text-zinc-400">
                      {CATEGORY_LABELS[product.category]} · {formatIDR(product.price)}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isOut
                        ? 'bg-red-50 text-red-600'
                        : isLow
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {(isLow || isOut) && <AlertTriangle size={12} />}
                    Stok: {product.stock}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAdjust(product, -1)}
                      className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
                      aria-label={`Kurangi stok ${product.name}`}
                    >
                      <Minus size={13} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={getAmount(product.id)}
                      onChange={(e) =>
                        setAmounts((prev) => ({ ...prev, [product.id]: Math.max(1, Number(e.target.value) || 1) }))
                      }
                      className="w-12 text-center text-sm border border-zinc-200 rounded-lg py-1 outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleAdjust(product, 1)}
                      className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
                      aria-label={`Tambah stok ${product.name}`}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => setFormState({ mode: 'edit', product })}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Hapus ${product.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {formState && (
        <ProductFormModal
          mode={formState.mode}
          product={formState.product}
          onClose={() => setFormState(null)}
        />
      )}
    </div>
  );
}

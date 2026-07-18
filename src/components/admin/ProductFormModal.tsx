import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Category, Product } from '../../types/pos';
import { useAppData } from '../../context/AppDataContext';

interface Props {
  mode: 'add' | 'edit';
  product?: Product;
  onClose: () => void;
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'makanan', label: 'Makanan' },
  { value: 'camilan', label: 'Camilan' },
  { value: 'minuman', label: 'Minuman' },
  { value: 'dessert', label: 'Dessert' },
];

export default function ProductFormModal({ mode, product, onClose }: Props) {
  const { addProduct, updateProduct } = useAppData();
  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState<Category>(product?.category ?? 'makanan');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [stock, setStock] = useState(String(product?.stock ?? ''));
  const [image, setImage] = useState(product?.image ?? '');
  const [description, setDescription] = useState(product?.description ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!name.trim() || !priceNum || priceNum <= 0 || stockNum < 0 || !image.trim()) return;

    if (mode === 'add') {
      addProduct({
        name: name.trim(),
        category,
        price: priceNum,
        stock: stockNum,
        image: image.trim(),
        description: description.trim() || 'Menu spesial RasaNusa.',
      });
    } else if (product) {
      updateProduct(product.id, {
        name: name.trim(),
        category,
        price: priceNum,
        stock: stockNum,
        image: image.trim(),
        description: description.trim(),
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 flex-shrink-0">
          <h3 className="font-semibold text-zinc-900">
            {mode === 'add' ? 'Tambah Menu Baru' : 'Edit Menu'}
          </h3>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-700" aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3 overflow-y-auto">
          <Field label="Nama Menu">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: Es Teh Manis"
              className="input-field"
            />
          </Field>

          <Field label="Kategori">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="input-field"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (Rp)">
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="15000"
                className="input-field"
              />
            </Field>
            <Field label="Stok Awal">
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                placeholder="10"
                className="input-field"
              />
            </Field>
          </div>

          <Field label="URL Gambar">
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              placeholder="https://..."
              className="input-field"
            />
          </Field>

          <Field label="Deskripsi">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Deskripsi singkat menu..."
              className="input-field resize-none"
            />
          </Field>
        </div>

        <div className="px-5 py-4 border-t border-zinc-100 flex-shrink-0">
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {mode === 'add' ? 'Simpan Menu' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

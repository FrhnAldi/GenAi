import { Ban, CheckCircle2, ChefHat, Clock3, PackageCheck } from 'lucide-react';
import type { OrderStatus } from '../types/pos';

/**
 * Single source of truth for how an order status is labelled, coloured, and
 * iconified across the customer dashboard, order success modal, and the
 * admin "Pesanan" / "Rekap Penjualan" tabs.
 */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; shortLabel: string; description: string; color: string; bg: string; icon: typeof Clock3 }
> = {
  menunggu: {
    label: 'Menunggu Konfirmasi',
    shortLabel: 'Menunggu',
    description: 'Pesanan baru masuk, menunggu dikonfirmasi dapur.',
    color: '#D9A35F',
    bg: 'rgba(217,163,95,0.14)',
    icon: Clock3,
  },
  diproses: {
    label: 'Sedang Diproses',
    shortLabel: 'Diproses',
    description: 'Dapur sedang menyiapkan pesanan ini.',
    color: '#2FA3B3',
    bg: 'rgba(29,107,118,0.16)',
    icon: ChefHat,
  },
  siap: {
    label: 'Siap Disajikan',
    shortLabel: 'Siap',
    description: 'Pesanan siap diantar / diambil pelanggan.',
    color: '#B98BDE',
    bg: 'rgba(155,135,222,0.16)',
    icon: PackageCheck,
  },
  selesai: {
    label: 'Selesai',
    shortLabel: 'Selesai',
    description: 'Pesanan sudah diterima pelanggan.',
    color: '#7BC98A',
    bg: 'rgba(123,201,138,0.14)',
    icon: CheckCircle2,
  },
  dibatalkan: {
    label: 'Dibatalkan',
    shortLabel: 'Batal',
    description: 'Pesanan dibatalkan.',
    color: '#E8836C',
    bg: 'rgba(196,67,43,0.16)',
    icon: Ban,
  },
};

/** Linear happy-path workflow used to render the progress stepper. */
export const ORDER_STATUS_FLOW: OrderStatus[] = ['menunggu', 'diproses', 'siap', 'selesai'];

/** The next status in the happy path, or null if there isn't one (terminal state). */
export function nextOrderStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}

/** An order can only be cancelled while it hasn't been handed over yet. */
export function canCancelOrder(current: OrderStatus): boolean {
  return current === 'menunggu' || current === 'diproses';
}

export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diffMs = Math.max(0, now - timestamp);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

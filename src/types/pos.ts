export type Category = 'makanan' | 'camilan' | 'minuman' | 'dessert';

export type Badge = 'Best Seller' | 'Baru' | 'Pedas';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  image: string;
  description: string;
  badge?: Badge;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type PaymentMethod = 'tunai' | 'qris' | 'kartu' | 'ewallet';

export type OrderType = 'dine-in' | 'takeaway';

/**
 * Lifecycle of an order from the moment a customer checks out to the moment
 * it's handed over (or cancelled). Drives the real-time status tracker shown
 * to both the customer and the admin/kitchen.
 */
export type OrderStatus = 'menunggu' | 'diproses' | 'siap' | 'selesai' | 'dibatalkan';

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: number;
  actorName?: string;
}

export interface TransactionItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  /** Special request for this specific item, e.g. "tidak pedas", "tanpa es". */
  note?: string;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  promoCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  change?: number;
  cashierName: string;
  timestamp: number;
  /** Present when the order was placed by a customer via the self-order dashboard. */
  customerUsername?: string;
  customerName?: string;
  orderType?: OrderType;
  tableNumber?: string;
  /** Current stage of the order. Defaults to 'menunggu' for new orders. */
  status: OrderStatus;
  /** When `status` last changed — powers "x menit lalu" freshness labels. */
  statusUpdatedAt: number;
  /** Full timeline of status changes, oldest first. */
  statusHistory: OrderStatusEvent[];
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  delta: number;
  resultingStock: number;
  reason: string;
  actorName: string;
  timestamp: number;
}

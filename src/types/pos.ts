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

export interface TransactionItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
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

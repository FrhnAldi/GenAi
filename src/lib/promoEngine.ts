import type { Promo } from '../data/promos';
import type { Product } from '../types/pos';

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface PromoCheckResult {
  eligible: boolean;
  reasons: string[];
  /** The amount (in rupiah) the discount should be computed against. */
  discountableAmount: number;
}

function quantityFor(lines: CartLine[], match: { category?: string; badge?: string }): number {
  return lines.reduce((sum, line) => {
    const matchesCategory = match.category ? line.product.category === match.category : true;
    const matchesBadge = match.badge ? line.product.badge === match.badge : true;
    return matchesCategory && matchesBadge ? sum + line.quantity : sum;
  }, 0);
}

function amountFor(lines: CartLine[], match: { category?: string; badge?: string }): number {
  return lines.reduce((sum, line) => {
    const matchesCategory = match.category ? line.product.category === match.category : true;
    const matchesBadge = match.badge ? line.product.badge === match.badge : true;
    return matchesCategory && matchesBadge ? sum + line.product.price * line.quantity : sum;
  }, 0);
}

/**
 * Checks whether a promo's stated conditions are actually met by the current
 * cart, time, and customer history — rather than blindly discounting whatever
 * is in the cart.
 */
export function checkPromoEligibility(
  promo: Promo,
  lines: CartLine[],
  opts: { now?: Date; isFirstOrder?: boolean } = {}
): PromoCheckResult {
  const now = opts.now ?? new Date();
  const reasons: string[] = [];

  for (const req of promo.requirements) {
    const have = quantityFor(lines, req);
    if (have < req.minQuantity) {
      reasons.push(req.label);
    }
  }

  if (promo.validDays && !promo.validDays.includes(now.getDay())) {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    reasons.push(`Hanya berlaku hari ${promo.validDays.map((d) => dayNames[d]).join('/')}`);
  }

  if (promo.validHours) {
    const hour = now.getHours();
    if (hour < promo.validHours.start || hour >= promo.validHours.end) {
      reasons.push(`Hanya berlaku pukul ${promo.validHours.start}.00–${promo.validHours.end}.00`);
    }
  }

  if (promo.firstOrderOnly && opts.isFirstOrder === false) {
    reasons.push('Hanya untuk pesanan pertama');
  }

  // Determine which slice of the cart the discount actually applies to.
  // Promos scoped to a specific category/badge (e.g. Jumat Pedas) only
  // discount that slice, not the whole cart.
  const scopedReq = promo.requirements.find((r) => r.category || r.badge);
  const discountableAmount = scopedReq
    ? amountFor(lines, scopedReq)
    : lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);

  return {
    eligible: reasons.length === 0,
    reasons,
    discountableAmount,
  };
}

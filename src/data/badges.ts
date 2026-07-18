import { Flame, Sparkles, Star } from 'lucide-react';
import type { Badge } from '../types/pos';

export const BADGE_STYLE: Record<Badge, { bg: string; color: string; icon: typeof Star }> = {
  'Best Seller': { bg: 'rgba(217,163,95,0.16)', color: '#D9A35F', icon: Star },
  Baru: { bg: 'rgba(29,107,118,0.18)', color: '#2FA3B3', icon: Sparkles },
  Pedas: { bg: 'rgba(196,67,43,0.18)', color: '#E8836C', icon: Flame },
};

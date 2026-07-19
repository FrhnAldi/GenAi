import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

/**
 * Color tokens used across the public landing pages
 * (HeroPage, AboutPage, MenuPage, PromoPage, SiteNavbar, SiteFooter, PageHero).
 *
 * Naming mirrors the original hardcoded hex values so the swap is predictable:
 * - "ink" was #15100C (near-black) in dark mode -> becomes the near-white bg in light mode
 * - "cream" was #F3EAD9 (near-white text/bg) in dark mode -> becomes the dark text in light mode
 */
export interface ThemeColors {
  mode: ThemeMode;
  /** Main dark section background (was always #15100C) */
  ink: string;
  /** Text/bg that sits opposite ink (was always #F3EAD9) */
  cream: string;
  /** Soft alternate light-section background (was #ECEDEC) */
  soft: string;
  /** Soft alternate bg #2 (was #FEFDF9) */
  soft2: string;
  /** rgba helper for cream-based translucent overlays, e.g. creamAlpha(0.1) */
  creamAlpha: (a: number) => string;
  /** rgba helper for ink-based translucent overlays, e.g. inkAlpha(0.1) */
  inkAlpha: (a: number) => string;
  /** Accent color, unchanged between themes */
  accent: string;
}

const DARK: Omit<ThemeColors, 'creamAlpha' | 'inkAlpha' | 'mode'> = {
  ink: '#15100C',
  cream: '#F3EAD9',
  soft: '#ECEDEC',
  soft2: '#FEFDF9',
  accent: '#D9A441',
};

const LIGHT: Omit<ThemeColors, 'creamAlpha' | 'inkAlpha' | 'mode'> = {
  // In light mode the roles swap: what was a dark section becomes a light section.
  ink: '#FAF6EE',
  cream: '#1C1510',
  soft: '#F3EFE8',
  soft2: '#FFFFFF',
  accent: '#B9791F',
};

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function makeAlphaFn(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (a: number) => `rgba(${r},${g},${b},${a})`;
}

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'rasanusa-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [mode]);

  const setMode = (m: ThemeMode) => setModeState(m);
  const toggleMode = () => setModeState((m) => (m === 'dark' ? 'light' : 'dark'));

  const colors = useMemo<ThemeColors>(() => {
    const base = mode === 'dark' ? DARK : LIGHT;
    return {
      mode,
      ...base,
      creamAlpha: makeAlphaFn(base.cream),
      inkAlpha: makeAlphaFn(base.ink),
    };
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleMode, setMode, colors }), [mode, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

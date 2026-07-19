import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
      className="relative inline-flex items-center rounded-full transition-colors duration-300"
      style={{
        width: 46,
        height: 26,
        background: isDark ? 'rgba(243,234,217,0.14)' : 'rgba(21,16,12,0.12)',
        border: `1px solid ${isDark ? 'rgba(243,234,217,0.3)' : 'rgba(21,16,12,0.2)'}`,
      }}
    >
      <span
        className="absolute flex items-center justify-center rounded-full transition-transform duration-300"
        style={{
          width: 20,
          height: 20,
          left: 2,
          transform: isDark ? 'translateX(0)' : 'translateX(20px)',
          background: isDark ? '#F3EAD9' : '#15100C',
        }}
      >
        {isDark ? (
          <Moon size={12} color="#15100C" strokeWidth={2} />
        ) : (
          <Sun size={12} color="#F3EAD9" strokeWidth={2} />
        )}
      </span>
      <span className="sr-only">{isDark ? 'Mode gelap aktif' : 'Mode terang aktif'}</span>
    </button>
  );
}

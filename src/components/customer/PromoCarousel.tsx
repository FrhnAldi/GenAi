import { useEffect, useState } from 'react';
import { AlertCircle, Check, Copy, Tag, X } from 'lucide-react';
import { PROMOS } from '../../data/promos';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  activeCode?: string | null;
  error?: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export default function PromoCarousel({ activeCode, error, onApply, onRemove }: Props) {
  const { colors } = useTheme();
  const { ink: BLACK, cream: CREAM, creamAlpha, inkAlpha } = colors;
  const [active, setActive] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % PROMOS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1800);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Rotating hero-style promo banner — each slide uses the promo's own photo as its background */}
      <div className="relative rounded-2xl overflow-hidden" style={{ height: 152 }}>
        {PROMOS.map((promo, index) => {
          const Icon = promo.icon;
          const offset = index - active;
          const isApplied = activeCode === promo.code;
          const requirementText = promo.requirements.map((r) => r.label).join(' · ');
          return (
            <div
              key={promo.id}
              className="absolute inset-0"
              style={{
                transform: `translateX(${offset * 100}%)`,
                transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(100deg, ${inkAlpha(0.94)} 28%, ${inkAlpha(0.55)} 62%, ${promo.accent}22 100%)`,
                }}
              />
              <div className="relative h-full flex items-center gap-4 px-5 sm:px-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${promo.accent}33`, border: `1px solid ${promo.accent}66` }}
                >
                  <Icon size={22} style={{ color: promo.accent }} />
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
                    style={{ backgroundColor: `${promo.accent}30`, color: promo.accent }}
                  >
                    {promo.tag}
                  </span>
                  <p className="text-sm sm:text-base font-bold leading-snug" style={{ color: CREAM }}>
                    {promo.title}
                  </p>
                  <p className="text-xs sm:text-sm mt-0.5 line-clamp-1" style={{ color: creamAlpha(0.65) }}>
                    {promo.description}
                  </p>
                  {requirementText && (
                    <p className="text-[10px] mt-1 line-clamp-1" style={{ color: creamAlpha(0.45) }}>
                      Syarat: {requirementText}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => (isApplied ? onRemove() : onApply(promo.code))}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                  style={
                    isApplied
                      ? { backgroundColor: `${promo.accent}2a`, border: `1px solid ${promo.accent}`, color: promo.accent }
                      : { backgroundColor: promo.accent, color: BLACK }
                  }
                >
                  {isApplied ? (
                    <>
                      <Check size={12} /> Dipakai
                    </>
                  ) : (
                    <>
                      <Tag size={12} /> Pakai
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {PROMOS.map((promo, i) => (
            <button
              key={promo.id}
              onClick={() => setActive(i)}
              aria-label={`Promo ${i + 1}`}
              style={{
                width: i === active ? 16 : 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: i === active ? '#D9A35F' : creamAlpha(0.4),
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Unmet-requirement error */}
      {error && (
        <div
          className="flex items-start gap-2 rounded-xl px-4 py-2.5"
          style={{ backgroundColor: 'rgba(196,67,43,0.12)', border: '1px solid rgba(196,67,43,0.4)' }}
        >
          <AlertCircle size={14} style={{ color: '#E8836C', marginTop: 1, flexShrink: 0 }} />
          <p className="text-xs font-light leading-relaxed" style={{ color: CREAM }}>
            {error}
          </p>
        </div>
      )}

      {/* Active promo banner */}
      {activeCode && (
        <div
          className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5"
          style={{ backgroundColor: 'rgba(217,163,95,0.1)', border: '1px solid rgba(217,163,95,0.35)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Tag size={14} style={{ color: '#D9A35F' }} />
            <p className="text-xs font-medium truncate" style={{ color: CREAM }}>
              Promo <span style={{ color: '#D9A35F', fontFamily: 'monospace' }}>{activeCode}</span> aktif untuk pesanan ini
            </p>
          </div>
          <button
            onClick={onRemove}
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: creamAlpha(0.6) }}
            aria-label="Hapus promo"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Quick-copy / quick-apply promo codes */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5">
        {PROMOS.map((promo) => {
          const copied = copiedCode === promo.code;
          const isApplied = activeCode === promo.code;
          return (
            <div
              key={promo.id}
              className="flex items-center gap-1 flex-shrink-0 rounded-full pl-3 pr-1 py-1"
              style={{
                border: `1px dashed ${promo.accent}88`,
                backgroundColor: isApplied ? `${promo.accent}22` : creamAlpha(0.03),
              }}
            >
              <span
                className="text-xs"
                style={{ fontFamily: 'monospace', letterSpacing: '0.04em', fontWeight: 600, color: promo.accent }}
              >
                {promo.code}
              </span>
              <button
                onClick={() => handleCopy(promo.code)}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{ color: promo.accent }}
                aria-label={`Salin kode ${promo.code}`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
              <button
                onClick={() => (isApplied ? onRemove() : onApply(promo.code))}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all duration-300"
                style={
                  isApplied
                    ? { color: promo.accent, backgroundColor: 'transparent' }
                    : { backgroundColor: promo.accent, color: BLACK }
                }
              >
                {isApplied ? 'Dipakai' : 'Pakai'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

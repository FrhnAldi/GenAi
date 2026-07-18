import type { ReactNode } from 'react';
import SiteNavbar from './SiteNavbar';

function Word({ children, delay }: { children: ReactNode; delay: string }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span
        className="inline-block"
        style={{
          animation: 'wordReveal 0.7s cubic-bezier(0.16,1,0.3,1) both',
          animationDelay: delay,
        }}
      >
        {children}
      </span>
    </span>
  );
}

export default function PageHero({
  eyebrow,
  words,
  subtitle,
  bgImage,
}: {
  eyebrow: string;
  words: string[];
  subtitle: string;
  bgImage: string;
}) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(21,16,12,0.90) 0%, rgba(21,16,12,0.78) 45%, #15100C 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.3,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="relative z-10">
        <SiteNavbar variant="dark" />

        <div className="px-5 sm:px-8 lg:px-10 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
          <p
            className="uppercase text-xs sm:text-sm mb-4 animate-fade-up"
            style={{ color: '#D9A441', letterSpacing: '0.2em', fontFamily: 'Inter, sans-serif' }}
          >
            {eyebrow}
          </p>
          <h1
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: '#F3EAD9',
              fontSize: 'clamp(38px, 8vw, 84px)',
              lineHeight: 1.05,
            }}
          >
            {words.map((w, i) => (
              <span key={i}>
                <Word delay={`${0.2 + i * 0.1}s`}>{w}</Word>{' '}
              </span>
            ))}
          </h1>
          <p
            className="max-w-lg mt-5 sm:mt-6 animate-fade-up delay-600"
            style={{
              color: 'rgba(243,234,217,0.7)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(14px, 1.6vw, 18px)',
              lineHeight: 1.55,
              letterSpacing: '-0.02em',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

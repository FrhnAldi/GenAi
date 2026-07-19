import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { NAV_LINKS } from './SiteNavbar';

export default function SiteFooter() {
  return (
    <footer id="kontak" className="relative" style={{ backgroundColor: '#15100C' }}>
      <div className="px-5 sm:px-8 lg:px-10 py-14 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        <div>
          <Link
            to="/"
            style={{
              fontFamily: "'Anton', sans-serif",
              color: '#F3EAD9',
              fontSize: 24,
              letterSpacing: '-0.02em',
            }}
          >
            RasaNusa
          </Link>
          <p
            className="mt-3 max-w-[240px]"
            style={{ color: 'rgba(243,234,217,0.55)', fontSize: 14, lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}
          >
            Restoran &amp; dapur nusantara, menghadirkan cita rasa rumahan otentik untuk keluarga Indonesia.
          </p>
        </div>

        <div>
          <p
            className="uppercase text-xs mb-4"
            style={{ color: '#D9A441', letterSpacing: '0.18em', fontFamily: 'Inter, sans-serif' }}
          >
            Navigasi
          </p>
          <div className="flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="text-sm" style={{ color: 'rgba(243,234,217,0.75)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p
            className="uppercase text-xs mb-4"
            style={{ color: '#D9A441', letterSpacing: '0.18em', fontFamily: 'Inter, sans-serif' }}
          >
            Kontak
          </p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'rgba(243,234,217,0.75)' }}>
            <span className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 flex-shrink-0" color="#D9A441" />
              Jl. Merdeka No. 45, Jakarta Selatan
            </span>
            <span className="flex items-center gap-2">
              <Phone size={15} color="#D9A441" />
              (021) 555-0182
            </span>
            <span className="flex items-center gap-2">
              <Mail size={15} color="#D9A441" />
              halo@rasanusa.id
            </span>
          </div>
        </div>

        <div>
          <p
            className="uppercase text-xs mb-4"
            style={{ color: '#D9A441', letterSpacing: '0.18em', fontFamily: 'Inter, sans-serif' }}
          >
            Jam Buka
          </p>
          <div className="flex items-start gap-2 text-sm mb-4" style={{ color: 'rgba(243,234,217,0.75)' }}>
            <Clock size={15} className="mt-0.5 flex-shrink-0" color="#D9A441" />
            Setiap hari, 10.00 – 22.00 WIB
          </div>
          <a
            href="#"
            aria-label="Media sosial RasaNusa"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(243,234,217,0.08)', border: '1px solid rgba(243,234,217,0.2)' }}
          >
            <Share2 size={16} color="#F3EAD9" />
          </a>
        </div>
      </div>

      <div
        className="px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTop: '1px solid rgba(243,234,217,0.08)' }}
      >
        <p style={{ color: 'rgba(243,234,217,0.4)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
          © {new Date().getFullYear()} RasaNusa. Seluruh hak cipta dilindungi.
        </p>
        <p style={{ color: 'rgba(243,234,217,0.4)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
          Dibuat dengan cinta untuk cita rasa Indonesia
        </p>
      </div>
    </footer>
  );
}

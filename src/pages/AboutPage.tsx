import { useEffect, useState } from 'react';
import { Award, ChefHat, Heart, Leaf, Quote, Sparkles, Users } from 'lucide-react';
import PageHero from '../components/site/PageHero';
import SiteFooter from '../components/site/SiteFooter';
import GlobalStyles from '../components/site/GlobalStyles';

const VALUES = [
  {
    icon: Leaf,
    bg: '#3F6B3A',
    title: 'Bahan Segar',
    text: 'Dipasok langsung dari pasar lokal setiap pagi, tanpa bahan pengawet.',
  },
  {
    icon: Heart,
    bg: '#A85C34',
    title: 'Resep Warisan',
    text: 'Diracik dari resep keluarga turun-temurun yang dijaga keasliannya.',
  },
  {
    icon: Sparkles,
    bg: '#1D6B76',
    title: 'Higienis',
    text: 'Standar kebersihan dapur yang ketat di setiap tahap penyajian.',
  },
  {
    icon: Users,
    bg: '#15100C',
    title: 'Ramah Keluarga',
    text: 'Suasana hangat yang nyaman untuk momen bersama orang tersayang.',
  },
];

const TIMELINE = [
  { year: '2014', title: 'Warung Kecil di Kampung', text: 'RasaNusa berawal dari warung sederhana dengan resep rumahan.' },
  { year: '2018', title: 'Ekspansi Menu Nusantara', text: 'Menambah menu dari berbagai daerah, dari Sabang sampai Merauke.' },
  { year: '2021', title: 'Membuka Cabang Pertama', text: 'Antusiasme pelanggan mendorong RasaNusa membuka gerai kedua.' },
  { year: '2026', title: 'Rumah Rasa Nusantara', text: 'Kini dipercaya lebih dari 14.000 pelanggan di seluruh kota.' },
];

const TEAM = [
  {
    name: 'Chef Wibowo Santoso',
    role: 'Kepala Dapur',
    image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=500&h=600&fit=crop&auto=format',
  },
  {
    name: 'Chef Ayu Kartika',
    role: 'Chef Nusantara',
    image: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&h=600&fit=crop&auto=format',
  },
  {
    name: 'Rio Hidayat',
    role: 'Manajer Operasional',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=600&fit=crop&auto=format',
  },
];

export default function AboutPage() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveTimeline((p) => (p + 1) % TIMELINE.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <GlobalStyles />

      <PageHero
        eyebrow="Tentang Kami"
        words={['Dapur', 'yang', 'Merawat', 'Cita', 'Rasa', 'Rumah']}
        subtitle="RasaNusa lahir dari kerinduan akan masakan rumahan otentik, disajikan dengan bahan segar dan resep warisan nusantara."
        bgImage="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=85&auto=format&fit=crop"
      />

      {/* ================= STORY ================= */}
      <section className="relative px-5 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#15100C' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="animate-slide-left">
            <p
              className="uppercase text-xs sm:text-sm mb-4"
              style={{ color: '#D9A441', letterSpacing: '0.2em', fontFamily: 'Inter, sans-serif' }}
            >
              Cerita Kami
            </p>
            <h2
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(28px, 4vw, 44px)',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                color: '#F3EAD9',
              }}
            >
              Dari dapur rumah ke meja makan ribuan keluarga
            </h2>
            <p
              className="mt-5"
              style={{
                color: 'rgba(243,234,217,0.7)',
                fontSize: 16,
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
              }}
            >
              Berawal dari kecintaan pada masakan rumahan, RasaNusa didirikan dengan satu tujuan sederhana:
              menghadirkan kembali kehangatan meja makan keluarga Indonesia. Setiap hidangan diracik dengan
              rempah pilihan dan dimasak dengan kesabaran, persis seperti masakan ibu di rumah.
            </p>
            <div
              className="mt-8 flex items-start gap-4 rounded-2xl p-5"
              style={{ backgroundColor: 'rgba(217,164,65,0.08)', border: '1px solid rgba(217,164,65,0.2)' }}
            >
              <Quote size={28} color="#D9A441" className="flex-shrink-0" />
              <p style={{ color: 'rgba(243,234,217,0.85)', fontSize: 15, lineHeight: 1.6, fontStyle: 'italic' }}>
                "Kami percaya makanan terbaik adalah yang mengingatkan kita pada rumah."
              </p>
            </div>
          </div>

          <div className="relative animate-scale-in delay-200">
            <img
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&h=1100&fit=crop&auto=format"
              alt="Dapur RasaNusa"
              className="w-full rounded-3xl object-cover"
              style={{ height: 'clamp(320px, 42vw, 520px)', border: '1px solid rgba(243,234,217,0.12)' }}
            />
            <div
              className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 rounded-2xl px-5 py-4 sm:px-6 sm:py-5"
              style={{ backgroundColor: '#F3EAD9', boxShadow: '0 20px 50px -15px rgba(0,0,0,0.5)' }}
            >
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 32, letterSpacing: '-0.04em', color: '#15100C' }}>
                12+
              </p>
              <p style={{ fontSize: 12, color: 'rgba(21,16,12,0.6)' }}>Tahun melayani nusantara</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="relative px-5 sm:px-8 lg:px-10 py-16 sm:py-20" style={{ backgroundColor: '#ECEDEC' }}>
        <p
          className="uppercase text-xs sm:text-sm mb-3 animate-fade-up"
          style={{ color: '#A85C34', letterSpacing: '0.2em', fontFamily: 'Inter, sans-serif' }}
        >
          Nilai Kami
        </p>
        <h2
          className="max-w-xl mb-10 sm:mb-12 animate-fade-up delay-200"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: '#15100C',
          }}
        >
          Apa yang membuat setiap hidangan kami istimewa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="rounded-2xl p-6 bg-white animate-fade-up transition-transform hover:-translate-y-1"
                style={{ animationDelay: `${0.2 + i * 0.1}s`, boxShadow: '0 10px 30px -15px rgba(0,0,0,0.15)' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: v.bg }}
                >
                  <Icon size={22} color="#F3EAD9" strokeWidth={1.5} />
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 19, color: '#15100C', letterSpacing: '-0.02em' }}>
                  {v.title}
                </p>
                <p style={{ fontSize: 14, color: 'rgba(21,16,12,0.6)', lineHeight: 1.5, marginTop: 6 }}>{v.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="relative px-5 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#15100C' }}>
        <p
          className="uppercase text-xs sm:text-sm mb-3 animate-fade-up"
          style={{ color: '#D9A441', letterSpacing: '0.2em', fontFamily: 'Inter, sans-serif' }}
        >
          Perjalanan Kami
        </p>
        <h2
          className="max-w-xl mb-10 sm:mb-14 animate-fade-up delay-200"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: '#F3EAD9',
          }}
        >
          Dari warung kecil menjadi rumah rasa nusantara
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {TIMELINE.map((t, i) => (
            <button
              key={t.year}
              onClick={() => setActiveTimeline(i)}
              className="text-left rounded-xl p-4 transition-all duration-300"
              style={{
                backgroundColor: i === activeTimeline ? 'rgba(217,164,65,0.14)' : 'rgba(243,234,217,0.04)',
                border: `1px solid ${i === activeTimeline ? '#D9A441' : 'rgba(243,234,217,0.1)'}`,
              }}
            >
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 22, color: i === activeTimeline ? '#D9A441' : '#F3EAD9', letterSpacing: '-0.03em' }}>
                {t.year}
              </p>
            </button>
          ))}
        </div>

        <div
          className="relative rounded-2xl p-6 sm:p-8 min-h-[140px] flex flex-col justify-center animate-fade-up"
          style={{ backgroundColor: 'rgba(243,234,217,0.04)', border: '1px solid rgba(243,234,217,0.1)' }}
        >
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 24, color: '#F3EAD9', letterSpacing: '-0.03em', marginBottom: 8 }}>
            {TIMELINE[activeTimeline].title}
          </p>
          <p style={{ color: 'rgba(243,234,217,0.65)', fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
            {TIMELINE[activeTimeline].text}
          </p>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="relative px-5 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: '#FEFDF9' }}>
        <div className="flex items-center gap-2 mb-3 animate-fade-up">
          <ChefHat size={18} color="#A85C34" />
          <span className="uppercase text-xs sm:text-sm" style={{ color: '#A85C34', letterSpacing: '0.2em' }}>
            Tim Dapur
          </span>
        </div>
        <h2
          className="max-w-xl mb-10 sm:mb-12 animate-fade-up delay-200"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: '#15100C',
          }}
        >
          Orang-orang di balik setiap hidangan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <div key={m.name} className="animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
              <div className="relative overflow-hidden rounded-2xl mb-4 group">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ height: 340 }}
                />
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 20, color: '#15100C', letterSpacing: '-0.02em' }}>
                {m.name}
              </p>
              <p style={{ fontSize: 13, color: 'rgba(21,16,12,0.55)' }}>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AWARD STRIP ================= */}
      <section className="relative px-5 sm:px-8 lg:px-10 py-10 sm:py-12" style={{ backgroundColor: '#15100C' }}>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 animate-fade-up">
          <div className="flex items-center gap-2" style={{ color: 'rgba(243,234,217,0.6)' }}>
            <Award size={18} color="#D9A441" />
            <span className="text-sm">Best Local Eatery 2024</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'rgba(243,234,217,0.6)' }}>
            <Award size={18} color="#D9A441" />
            <span className="text-sm">Top Rated Nusantara Food 2025</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'rgba(243,234,217,0.6)' }}>
            <Award size={18} color="#D9A441" />
            <span className="text-sm">Halal &amp; Higienis Bersertifikat</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

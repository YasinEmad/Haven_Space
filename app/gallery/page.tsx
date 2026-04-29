'use client';

import { useState, useEffect, useRef } from 'react';
import PropertySearchCard from '@/components/PropertySearchCard';
import PropertyGrid from '@/components/PropertyGrid';
import { ArrowRight } from 'lucide-react';

/* ── tiny scroll-reveal hook ─────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children, delay = 0, from = 'bottom',
}: { children: React.ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right' }) {
  const { ref, visible } = useInView();
  const map = { bottom: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)' };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : map[from],
      transition: `opacity .65s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform .65s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── animated counter ────────────────────────────────────────── */
function Counter({ value }: { value: string }) {
  const num = parseInt(value.replace(/\D/g, ''), 10);
  const suffix = value.replace(/[\d,]/g, '');
  const prefix = value.match(/^[^\d]+/)?.[0] || '';
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  
  
  useEffect(() => {
    if (!visible) return;
    let c = 0;
    const step = Math.ceil(num / 55);
    const id = setInterval(() => { c += step; if (c >= num) { setCount(num); clearInterval(id); } else setCount(c); }, 16);
    return () => clearInterval(id);
  }, [visible, num]);
  
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Gallery() {
  const [searchCity, setSearchCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSearch = () => {
    setShowAll(false);
    setHasSearched(true);
  };

  const handleViewAll = () => {
    setHasSearched(true);
    setShowAll(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --sand:    #f5f0e8;
          --parchment: #ede8df;
          --ink:     #1c1714;
          --brass:   #b07d3a;
          --brass-lt:#d4a055;
          --sage:    #4e7a6a;
          --rust:    #9e3d2b;
          --white:   #ffffff;
          --muted:   #7a6f65;
        }

        .gallery-page { 
          font-family: 'Outfit', sans-serif; 
          background: var(--sand); 
          color: var(--ink); 
          overflow-x: hidden; 
        }

        .container { max-width: 1160px; margin: auto; padding: 0 1.5rem; }
        .section { padding: 6rem 0; }
        .section.featured-section {
          background: #1c1714;
          color: #f5f0e8;
        }
        .section.featured-section .section-eyebrow {
          color: #d4a055;
        }
        .section.featured-section .section-title {
          color: #fff;
        }

        /* ── HERO / SEARCH SECTION ── */
        .hero-section {
          background: linear-gradient(180deg, #1c1714 0%, #2a2420 100%);
          color: var(--white);
          padding: 8rem 0 6rem;
          text-align: center;
          position: relative;
        }
        
        .hero-section::after {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");
          opacity: 0.3; pointer-events: none;
        }

        /* ── STATS BAR ── */
        .stats-bar {
          display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap;
          margin-top: 4rem; padding-top: 3rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .stat-item { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: var(--brass-lt); }
        .stat-label { font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.6); }

        /* ── TYPOGRAPHY ── */
        .section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 1.5rem; margin-bottom: 3rem;
        }
        .section-eyebrow {
          display: block; font-size: .75rem; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase;
          color: var(--brass); margin-bottom: .75rem;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 700; line-height: 1.15;
          margin: 0;
        }
        
        /* Adapts to dark/light backgrounds automatically */
        .hero-section .section-title { color: var(--white); }
        .hero-section .section-eyebrow { color: var(--brass-lt); }

        .section-link {
          display: inline-flex; align-items: center; gap: .4rem;
          font-size: .95rem; font-weight: 600; color: var(--brass);
          text-decoration: none; white-space: nowrap;
          border-bottom: 1px solid transparent;
          transition: border-color .2s, gap .2s;
        }
        .section-link:hover { border-color: var(--brass); gap: .6rem; }

        /* ── CTA BOTTOM ── */
        .cta-bottom {
          background: #1c1714;
          padding: 7rem 1.5rem;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-bottom::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");
          background-size: 180px; opacity: .4; pointer-events: none;
        }
        .cta-bottom h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem,5vw,3.5rem); font-weight: 700; color: #fff;
          margin-bottom: 1.25rem; position: relative;
        }
        .cta-bottom p {
          color: rgba(255,255,255,.7); font-size: 1.1rem;
          max-width: 540px; margin: 0 auto 2.5rem; line-height: 1.7; position: relative;
        }
        .btn-white {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: 1rem 2.5rem;
          background: var(--white); color: var(--ink);
          font-family: 'Outfit', sans-serif;
          font-weight: 600; font-size: 1rem;
          border-radius: 3rem; text-decoration: none;
          transition: transform .3s ease, box-shadow .3s ease;
          position: relative;
        }
        .btn-white:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 12px 40px rgba(0,0,0,.3); 
          color: var(--brass);
        }

        .cta-feats {
          display: flex; gap: 2.5rem; justify-content: center; flex-wrap: wrap;
          margin-top: 3.5rem; position: relative;
        }
        .cta-feat {
          display: flex; align-items: center; gap: .5rem;
          color: rgba(255,255,255,.8); font-size: .95rem; font-weight: 500;
        }
        .cta-feat svg { color: var(--brass-lt); }
      `}</style>

      <div className="gallery-page">
        {/* ═══ HERO / SEARCH SECTION ═══ */}
        <section className="hero-section">
          <div className="container relative z-10">
            <Reveal>
              <div style={{ marginBottom: '3rem' }}>
                <span className="section-eyebrow">Find Your Property</span>
                <h2 className="section-title">Discover Elevated Living</h2>
              </div>
            </Reveal>
            
            <Reveal delay={120}>
              <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
                <PropertySearchCard
                  onSearch={handleSearch}
                  searchCity={searchCity}
                  setSearchCity={setSearchCity}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  propertyType={propertyType}
                  setPropertyType={setPropertyType}
                />
              </div>
            </Reveal>

            {/* Now utilizing your custom Counter hook! */}
            <Reveal delay={240}>
              <div className="stats-bar">
                <div className="stat-item">
                  <span className="stat-num"><Counter value="$2B+" /></span>
                  <span className="stat-label">Sales Volume</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num"><Counter value="15,000+" /></span>
                  <span className="stat-label">Happy Clients</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num"><Counter value="4.9/5" /></span>
                  <span className="stat-label">Average Rating</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ PROPERTIES GRID (Light Sand Background) ═══ */}
        <section className="section featured-section">
          <div className="container">
            <Reveal>
              <div className="section-header">
                <div>
                  <span className="section-eyebrow">Handpicked For You</span>
                  <h2 className="section-title">
                    {hasSearched ? (showAll ? 'All Properties' : 'Search Results') : 'Featured Properties'}
                  </h2>
                </div>
                {!hasSearched && (
                  <button type="button" onClick={handleViewAll} className="section-link">
                    View all listings <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <PropertyGrid
                searchCity={searchCity}
                minPrice={minPrice}
                maxPrice={maxPrice}
                propertyType={propertyType}
                hasSearched={hasSearched}
                showAll={showAll}
              />
            </Reveal>
          </div>
        </section>

      
      </div>
    </>
  );
}
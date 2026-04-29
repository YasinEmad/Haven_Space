'use client';

import { useState, useEffect, useRef } from 'react';
import PropertyGrid from '@/components/PropertyGrid';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function Listings() {
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

        .listings-page {
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

        .back-link {
          display: inline-flex; align-items: center; gap: 0.5rem;
          color: var(--brass); text-decoration: none;
          font-weight: 500; transition: color 0.2s;
        }
        .back-link:hover { color: var(--brass-lt); }
      `}</style>

      <div className="listings-page">
        {/* ═══ HEADER SECTION ═══ */}
        <section className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="container">
            <Reveal>
              <div className="section-header">
                <div>
                  <Link href="/gallery" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Gallery
                  </Link>
                  <h1 className="section-title" style={{ marginTop: '1rem' }}>
                    All Properties
                  </h1>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ PROPERTIES GRID ═══ */}
        <section className="section featured-section">
          <div className="container">
            <Reveal delay={150}>
              <PropertyGrid
                searchCity=""
                minPrice=""
                maxPrice=""
                propertyType=""
                hasSearched={true}
              />
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
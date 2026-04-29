'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  MapPin, 
  DollarSign, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Shield 
} from 'lucide-react';

/* ── SCROLL REVEAL HOOK ─────────────────────────────────────── */
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
      transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── ANIMATED COUNTER ────────────────────────────────────────── */
function Counter({ value }: { value: string }) {
  const num = parseInt(value.replace(/\D/g, ''), 10);
  const suffix = value.replace(/[\d,]/g, '');
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let c = 0;
    const step = Math.ceil(num / 55);
    const id = setInterval(() => { 
      c += step; 
      if (c >= num) { setCount(num); clearInterval(id); } 
      else setCount(c); 
    }, 16);
    return () => clearInterval(id);
  }, [visible, num]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── SPIDER NETWORK BACKGROUND ──────────────────────────────── */
function SpiderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 45;
    const connectionDist = 160;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(176, 125, 58, 0.4)';
      ctx.strokeStyle = 'rgba(176, 125, 58, 0.08)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.lineWidth = 1 - dist / connectionDist;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* ── MAIN HOME PAGE ─────────────────────────────────────────── */
export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 60); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --sand:      #f5f0e8;
          --parchment: #ede8df;
          --ink:       #1c1714;
          --brass:     #b07d3a;
          --brass-lt:  #d4a055;
          --sage:      #4e7a6a;
          --rust:      #9e3d2b;
          --white:     #ffffff;
          --muted:     #7a6f65;
          --card-bg: rgba(255,255,255,0.72);
          --card-border: rgba(176,125,58,0.15);
          --r: 1.25rem;
        }

        .home-page { font-family: 'Outfit', sans-serif; background: var(--sand); color: var(--ink); overflow-x: hidden; }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          overflow: hidden;
          background-image: url('/havenspace-bg.jpeg');
          background-size: cover;
          background-position: center;
          padding: 7rem 1.5rem 5rem;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1;
        }

        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 55% at 50% 40%, rgba(176,125,58,0.12) 0%, transparent 65%),
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: auto, 48px 48px, 48px 48px;
        }

        .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .orb-1 { width: 500px; height: 500px; top:-160px; right:-100px; background: rgba(176,125,58,.09); animation: orb1 12s ease-in-out infinite; }
        .orb-2 { width: 420px; height: 420px; bottom:-140px; left:-100px; background: rgba(78,122,106,.07); animation: orb2 15s ease-in-out infinite; }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,30px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-25px)} }

        .hero-inner { position:relative; z-index:2; text-align:center; max-width:900px; width:100%; }

        .hero-pill {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .4rem 1.1rem;
          border: 1px solid rgba(176,125,58,.4);
          border-radius: 2rem;
          background: rgba(176,125,58,.1);
          font-size: .72rem; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
          color: var(--brass-lt);
          margin-bottom: 2rem;
          opacity: 0; animation: fadeUp .5s ease .1s forwards;
        }

        .hero h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3.2rem, 8vw, 6.5rem);
          font-weight: 700;
          line-height: 1.0;
          color: #fff;
          margin-bottom: 1.75rem;
          opacity: 0; animation: fadeUp .7s ease .25s forwards;
        }
        .hero h1 em { font-style: italic; color: var(--brass-lt); }

        .hero-desc {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: rgba(255,255,255,.55);
          max-width: 560px; margin: 0 auto 2.5rem;
          line-height: 1.8; font-weight: 300;
          opacity: 0; animation: fadeUp .7s ease .4s forwards;
        }

        .btn-brass {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .85rem 2rem;
          background: var(--brass);
          color: #fff; font-weight: 600; font-size: .95rem;
          border-radius: 3rem; text-decoration: none;
          transition: all .2s; border: none; cursor: pointer;
        }
        .btn-brass:hover { transform: translateY(-2px); background: var(--brass-lt); box-shadow: 0 10px 30px rgba(176,125,58,.35); }

        /* ── DISCOVER SECTION (Improved with Spider BG) ── */
        .discover-section {
          position: relative;
          background: #0d0b0a;
          color: #fff;
          padding: 10rem 1.5rem;
          overflow: hidden;
        }
        .discover-container { position: relative; z-index: 2; max-width: 1160px; margin: auto; text-align: center; }

        .section-eyebrow {
          display: block; font-size: .7rem; font-weight: 700;
          letter-spacing: .25em; text-transform: uppercase;
          color: var(--brass); margin-bottom: 1rem;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700; line-height: 1.1;
          margin-bottom: 4rem;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
        }

        .why-card {
          position: relative;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1.5rem;
          padding: 4rem 2rem;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .why-card:hover {
          transform: translateY(-12px);
          border-color: rgba(176,125,58,0.4);
          background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .why-icon-wrap {
          width: 70px; height: 70px;
          background: rgba(176,125,58,0.1);
          color: var(--brass-lt);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
          transition: all 0.4s ease;
        }
        .why-card:hover .why-icon-wrap {
          background: var(--brass);
          color: #fff;
          transform: scale(1.1) rotate(5deg);
        }

        .why-card h3 { font-size: 1.3rem; font-weight: 500; margin-bottom: 1rem; color: #fff; }
        .why-card p { font-size: 0.95rem; line-height: 1.7; color: rgba(255,255,255,0.5); }

        .why-image-wrap {
          width: 100%;
          height: 200px;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 2rem;
          position: relative;
        }
        .why-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .why-card:hover .why-image {
          transform: scale(1.05);
        }

        /* ── TESTIMONIALS ── */
        .testi-strip { background: var(--parchment); padding: 6rem 1.5rem; }
        .testi-cards { display: flex; gap: 1.5rem; overflow-x: auto; padding: 2rem 0; scrollbar-width: none; }
        .testi-card {
          flex: 0 0 320px; background: #fff; padding: 2.5rem;
          border-radius: var(--r); border: 1px solid var(--card-border);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        /* ── CTA BOTTOM ── */
        .cta-bottom {
          background: #1c1714; padding: 8rem 1.5rem;
          text-align: center; color: #fff; position: relative;
        }
        .cta-bottom h2 { font-family: 'Cormorant Garamond', serif; font-size: 3rem; margin-bottom: 1.5rem; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
      `}</style>

      <div className="home-page">
        {/* ═══ HERO ═══ */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="hero-inner">
            <div className="hero-pill">
              <span className="w-1.5 h-1.5 bg-brass-lt rounded-full animate-pulse mr-2" />
              Discover Premium Properties
            </div>
            <h1>Find Your<br /><em>Dream Home.</em></h1>
            <p className="hero-desc">
              Browse thousands of curated listings, connect with expert agents, and
              make the most important decision of your life with total confidence.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/gallery">
                <button className="btn-brass">Start Searching <ArrowRight size={16} /></button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ DISCOVER SECTION (The Improved UI) ═══ */}
        <section className="discover-section">
          <SpiderBackground />
          <div className="discover-container">
            <Reveal>
              <span className="section-eyebrow">Excellence in Real Estate</span>
              <h2 className="section-title">Why Choose HavenSpace?</h2>
            </Reveal>

            <div className="why-grid">
              {[
                { 
                  icon: MapPin, 
                  title: 'Prime Locations', 
                  desc: 'Browse through thousands of verified properties in the world\'s most sought-after neighborhoods.',
                  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'
                },
                { 
                  icon: DollarSign, 
                  title: 'Flexible Financing', 
                  desc: 'Find homes that fit your budget perfectly, from starter homes to vast luxury estates.',
                  image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400'
                },
                { 
                  icon: Star, 
                  title: 'Quality Assured', 
                  desc: 'Every listing undergoes a rigorous 50-point inspection to ensure it meets our premium standards.',
                  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="why-card">
                    <div className="why-image-wrap">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="why-image"
                      />
                    </div>
                    <div className="why-icon-wrap">
                      <item.icon size={28} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
<section className="testi-strip">
  <div className="max-w-[1160px] mx-auto">
    <Reveal>
      <div className="text-center mb-12">
        <span className="section-eyebrow" style={{ color: 'var(--brass)' }}>Voices of HavenSpace</span>
        <h2 className="section-title" style={{ color: 'var(--ink)' }}>What Our Clients Say</h2>
      </div>
    </Reveal>

    <div className="testi-grid">
      {[
        {
          name: "Sarah Montgomery",
          role: "Homeowner",
          initials: "SM",
          text: "We walked into this process expecting the usual headaches of house-hunting, but HavenSpace turned a complex transition into a total breeze. Their team handled the heavy lifting with such precision."
        },
        {
          name: "Julian Sterling",
          role: "Property Investor",
          initials: "JS",
          text: "Luxury is in the details, and HavenSpace understands that perfectly. They don't just list properties; they curate lifestyles. The white-glove service we received was truly in a league of its own."
        },
        {
          name: "Elena Rodriguez",
          role: "First-time Buyer",
          initials: "ER",
          text: "Their vetting process is clearly superior. We didn't waste a single afternoon on 'average' listings—every home shown was a masterpiece. They have a sharp eye for quality that saved us weeks."
        }
      ].map((testimonial, i) => (
        <Reveal key={i} delay={i * 150}>
          <div className="testi-card">
            {/* Decorative Quote Icon */}
            <div className="testi-quote-mark">“</div>
            
            <div className="flex text-brass mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="mr-0.5" />
              ))}
            </div>

            <p className="testi-text">"{testimonial.text}"</p>

            <div className="testi-footer">
              <div className="testi-avatar">{testimonial.initials}</div>
              <div>
                <div className="testi-author-name">{testimonial.name}</div>
                <div className="testi-author-role">{testimonial.role}</div>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>

  <style jsx>{`
    .testi-strip {
      background: var(--parchment);
      padding: 8rem 1.5rem;
      position: relative;
    }

    .testi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .testi-card {
      background: #ffffff;
      padding: 3rem 2.5rem;
      border-radius: var(--r);
      border: 1px solid rgba(176, 125, 58, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.4s ease;
      display: flex;
      flex-direction: column;
      z-index: 1;
    }

    .testi-card:hover {
      transform: translateY(-8px);
      border-color: var(--brass);
      box-shadow: 0 20px 40px rgba(28, 23, 20, 0.08);
    }

    .testi-quote-mark {
      position: absolute;
      top: -10px;
      right: 20px;
      font-family: 'Cormorant Garamond', serif;
      font-size: 8rem;
      color: rgba(176, 125, 58, 0.05);
      z-index: -1;
      line-height: 1;
    }

    .testi-text {
      font-family: 'Outfit', sans-serif;
      font-size: 1.05rem;
      line-height: 1.8;
      color: var(--muted);
      margin-bottom: 2rem;
      font-style: italic;
      flex-grow: 1;
    }

    .testi-footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      padding-top: 1.5rem;
    }

    .testi-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--brass) 0%, var(--ink) 100%);
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
    }

    .testi-author-name {
      font-weight: 600;
      font-size: 1rem;
      color: var(--ink);
      line-height: 1.2;
    }

    .testi-author-role {
      font-size: 0.75rem;
      color: var(--brass);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.2rem;
    }

    @media (max-width: 768px) {
      .testi-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
</section>

        {/* ═══ CTA BOTTOM ═══ */}
        <section className="cta-bottom">
          <Reveal>
            <h2>Ready to find your forever home?</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Join thousands of happy homeowners who trusted HavenSpace to
              make the biggest decision of their lives feel effortless.
            </p>
            <Link href="/connect" className="btn-brass bg-white text-brass hover:bg-parchment px-10 py-4">
              Get Started Today
            </Link>
          </Reveal>
        </section>
      </div>
    </>
  );
}
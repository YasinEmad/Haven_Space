"use client"

import { useEffect, useRef, useState } from "react"
import { Award, Users, Globe, Instagram, Facebook, Linkedin, Twitter, MessageSquare, ExternalLink } from 'lucide-react';

import type { Metadata } from "next"

// ─── Metadata (exported separately in Next.js App Router) ────────────────────
// export const metadata: Metadata = {
//   title: "About - Real Estate Hub",
//   description: "Learn more about Real Estate Hub and our mission.",
// }

// ─── Tiny hook: fires once when element enters viewport ──────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useInView()
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = Math.ceil(end / 60)
    const id = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(id) }
      else setCount(start)
    }, 16)
    return () => clearInterval(id)
  }, [visible, end])
  return (
    <span ref={ref} className="counter">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon, title, desc, delay,
}: { icon: string; title: string; desc: string; delay: number }) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className="feature-card"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
      }}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

type SocialPlatform = 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'twitter';

// ─── Team card ────────────────────────────────────────────────────────────────
function TeamCard({
  initials,
  name,
  role,
  image,
  socialLinks,
  delay,
}: {
  initials: string;
  name: string;
  role: string;
  image?: string;
  socialLinks: Array<{ platform: SocialPlatform; href: string }>;
  delay: number;
}) {
  const { ref, visible } = useInView()

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />
      case 'facebook':  return <Facebook className="w-4 h-4" />
      case 'instagram': return <Instagram className="w-4 h-4" />
      case 'linkedin':  return <Linkedin className="w-4 h-4" />
      case 'twitter':   return <Twitter className="w-4 h-4" />
      default:          return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <div
      ref={ref}
      className="team-card"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.88)",
      }}
    >
      <div className="avatar" style={{ width: '192px', height: '288px', borderRadius: '0.75rem', overflow: 'hidden' }}>
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold text-lg">{initials}</div>
        )}
      </div>
      <strong>{name}</strong>
      <span>{role}</span>
      <div className="mt-3 flex items-center justify-center gap-2">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-slate-700 hover:text-slate-900 transition-colors"
            aria-label={`${name} on ${link.platform}`}
          >
            {getIcon(link.platform)}
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, from = "bottom",
}: { children: React.ReactNode; delay?: number; from?: "bottom" | "left" | "right" }) {
  const { ref, visible } = useInView()
  const transforms: Record<string, string> = {
    bottom: "translateY(50px)",
    left: "translateX(-50px)",
    right: "translateX(50px)",
  }
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[from],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [heroVisible, setHeroVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <>
      <style>{`
        /* ── Tokens ── */
        :root {
          --cream: #f9f5ef;
          --ink:   #1a1410;
          --gold:  #c8913a;
          --rust:  #b84c2b;
          --sage:  #4a7c6f;
          --card:  #ffffff;
          --muted: #6b6259;
          --border: rgba(26,20,16,.10);
          --radius: 1.25rem;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body:    'DM Sans', 'Helvetica Neue', sans-serif;
        }

        /* ── Reset / base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .about-page {
          font-family: var(--font-body);
          background: var(--cream);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* ── Google Fonts import ── */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ═══════════════ HERO ═══════════════ */
        .hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--ink);
        }
        /* animated grain overlay */
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          background-size: 200px;
          opacity: .45;
          pointer-events: none;
          animation: grain 8s steps(10) infinite;
        }
        @keyframes grain {
          0%,100%{transform:translate(0,0)}
          10%{transform:translate(-2%,-2%)}
          30%{transform:translate(2%,-1%)}
          50%{transform:translate(-1%,2%)}
          70%{transform:translate(3%,1%)}
          90%{transform:translate(-2%,3%)}
        }
        /* gold accent lines */
        .hero-lines {
          position: absolute; inset: 0; pointer-events: none;
        }
        .hero-lines span {
          position: absolute;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
          animation: lineRise 3s ease-out forwards;
          opacity: 0;
        }
        .hero-lines span:nth-child(1){ left:20%; height:60%; top:20%; animation-delay:.3s }
        .hero-lines span:nth-child(2){ left:50%; height:80%; top:10%; animation-delay:.5s }
        .hero-lines span:nth-child(3){ left:80%; height:55%; top:25%; animation-delay:.4s }
        @keyframes lineRise{ from{opacity:0;transform:scaleY(0)} to{opacity:.25;transform:scaleY(1)} }

        .hero-inner {
          position: relative; z-index: 1;
          text-align: center;
          padding: 2rem;
          max-width: 860px;
        }
        .hero-eyebrow {
          display: inline-block;
          font-family: var(--font-body);
          font-size: .75rem;
          font-weight: 600;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--gold);
          border: 1px solid var(--gold);
          padding: .35rem 1rem;
          border-radius: 2rem;
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeUp .6s ease .2s forwards;
        }
        .hero h1 {
          font-family: var(--font-display);
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 900;
          line-height: 1.0;
          color: #fff;
          opacity: 0;
          animation: fadeUp .8s ease .4s forwards;
        }
        .hero h1 em {
          font-style: italic;
          color: var(--gold);
        }
        .hero-sub {
          margin-top: 1.75rem;
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(255,255,255,.65);
          max-width: 580px;
          margin-inline: auto;
          line-height: 1.7;
          opacity: 0;
          animation: fadeUp .8s ease .6s forwards;
        }
        .hero-cta-row {
          margin-top: 2.5rem;
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp .8s ease .8s forwards;
        }
        .btn-gold {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .9rem 2rem;
          background: var(--gold);
          color: var(--ink);
          font-weight: 600; font-size: .95rem;
          border-radius: 3rem;
          text-decoration: none;
          transition: transform .2s, box-shadow .2s;
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,145,58,.35) }
        .btn-outline {
          display: inline-flex; align-items: center;
          padding: .9rem 2rem;
          border: 1px solid rgba(255,255,255,.3);
          color: #fff;
          font-weight: 500; font-size: .95rem;
          border-radius: 3rem;
          text-decoration: none;
          transition: border-color .2s, background .2s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,.7); background: rgba(255,255,255,.06) }

        /* scroll indicator */
        .scroll-hint {
          position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: .5rem;
          color: rgba(255,255,255,.4); font-size: .7rem; letter-spacing: .12em;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeIn 1s ease 1.5s forwards;
        }
        .scroll-dot {
          width: 20px; height: 32px;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 10px;
          position: relative;
        }
        .scroll-dot::after {
          content: '';
          position: absolute; top: 5px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 6px;
          background: var(--gold);
          border-radius: 2px;
          animation: scrollBob 1.5s ease infinite;
        }
        @keyframes scrollBob { 0%,100%{top:5px;opacity:1} 60%{top:16px;opacity:.2} }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }

        /* ═══════════════ STATS ═══════════════ */
        .stats-bar {
          background: var(--gold);
          padding: 2.5rem 1rem;
        }
        .stats-inner {
          max-width: 900px; margin: auto;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr));
          gap: 2rem; text-align: center;
        }
        .stat-item strong {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 900;
          color: var(--ink);
          line-height: 1;
        }
        .counter { display: inline }
        .stat-item span {
          display: block; margin-top: .3rem;
          font-size: .8rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          color: rgba(26,20,16,.65);
        }

        /* ═══════════════ SECTION SHARED ═══════════════ */
        .section { padding: 7rem 1.5rem; }
        .section-label {
          display: inline-block;
          font-size: .7rem; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase;
          color: var(--gold);
          margin-bottom: .75rem;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.15;
        }
        .container { max-width: 1100px; margin: auto; }

        /* ═══════════════ MISSION / VISION ═══════════════ */
        .mv-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3rem; margin-top: 4rem;
        }
        @media(max-width:680px){ .mv-grid{ grid-template-columns:1fr } }
        .mv-card {
          background: var(--card);
          border-radius: var(--radius);
          padding: 2.75rem;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transition: box-shadow .3s;
        }
        .mv-card:hover { box-shadow: 0 16px 48px rgba(26,20,16,.08) }
        .mv-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--rust));
        }
        .mv-card h2 {
          font-family: var(--font-display);
          font-size: 1.65rem; font-weight: 700;
          margin-bottom: 1rem;
        }
        .mv-card p { color: var(--muted); line-height: 1.8; font-size: 1.05rem; }

        /* ═══════════════ FEATURES ═══════════════ */
        .features-bg {
          background: var(--ink);
          padding: 7rem 1.5rem;
        }
        .features-bg .section-title { color: #fff }
        .features-bg .section-label { color: var(--gold) }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 1.5rem;
          margin-top: 3.5rem;
        }
        .feature-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: var(--radius);
          padding: 2.5rem 2rem;
          transition: opacity .6s ease, transform .6s ease, background .3s;
          cursor: default;
        }
        .feature-card:hover { background: rgba(255,255,255,.08) }
        .feature-icon {
          width: 56px; height: 56px;
          background: rgba(200,145,58,.15);
          border: 1px solid rgba(200,145,58,.3);
          border-radius: 1rem;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem;
          margin-bottom: 1.5rem;
        }
        .feature-card h3 {
          font-family: var(--font-display);
          font-size: 1.25rem; font-weight: 700;
          color: #fff; margin-bottom: .6rem;
        }
        .feature-card p { color: rgba(255,255,255,.5); line-height: 1.7; font-size: .95rem }

        /* ═══════════════ PROCESS ═══════════════ */
        .process-steps {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
          gap: 0; margin-top: 4rem;
          position: relative;
        }
        .process-steps::before {
          content: '';
          position: absolute; top: 28px; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .step {
          text-align: center; padding: 0 1.5rem 2rem;
          position: relative;
        }
        .step-num {
          width: 56px; height: 56px;
          background: var(--gold);
          color: var(--ink);
          font-family: var(--font-display);
          font-size: 1.3rem; font-weight: 900;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
          position: relative; z-index: 1;
        }
        .step h3 {
          font-family: var(--font-display);
          font-size: 1.1rem; margin-bottom: .5rem;
        }
        .step p { color: var(--muted); font-size: .9rem; line-height: 1.6 }

        /* ═══════════════ TEAM ═══════════════ */
        .team-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr));
          gap: 1.5rem; margin-top: 3.5rem;
        }
        .team-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem 1.5rem;
          text-align: center;
          transition: opacity .6s ease, transform .6s ease, box-shadow .3s;
        }
        .team-card:hover { box-shadow: 0 12px 36px rgba(26,20,16,.08) }
        .avatar {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, var(--gold), var(--rust));
          color: #fff;
          font-family: var(--font-display);
          font-size: 1.4rem; font-weight: 700;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .team-card strong { display:block; font-weight:600; margin-bottom:.25rem }
        .team-card span { font-size:.85rem; color:var(--muted) }

        /* ═══════════════ VALUES ═══════════════ */
        .values-strip {
          background: linear-gradient(135deg, var(--rust) 0%, var(--gold) 100%);
          padding: 5rem 1.5rem; text-align: center;
        }
        .values-strip h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem,4vw,2.6rem); font-weight:900; color:#fff;
          margin-bottom: 2.5rem;
        }
        .values-pills {
          display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center;
        }
        .pill {
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.35);
          color: #fff;
          padding: .6rem 1.4rem;
          border-radius: 2rem;
          font-weight: 500; font-size: .95rem;
          backdrop-filter: blur(4px);
          transition: background .2s;
        }
        .pill:hover { background: rgba(255,255,255,.28) }

        /* ═══════════════ CTA ═══════════════ */
        .cta-section {
          padding: 8rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,145,58,.08) 0%, transparent 70%);
        }
        .cta-section h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem,5vw,3.5rem); font-weight:900;
          margin-bottom: 1.25rem;
        }
        .cta-section p {
          color: var(--muted); font-size: 1.1rem; max-width: 540px;
          margin: 0 auto 2.5rem; line-height:1.7;
        }
        .btn-ink {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: 1rem 2.5rem;
          background: var(--ink);
          color: #fff;
          font-weight: 600; font-size: 1rem;
          border-radius: 3rem;
          text-decoration: none;
          transition: transform .2s, box-shadow .2s;
        }
        .btn-ink:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(26,20,16,.18) }
      `}</style>

      <div className="about-page">

        {/* ─── HERO ─── */}
        <section className="hero">
         
          <div className="hero-inner">
            <h1>Find Where<br /><em>Life Begins.</em></h1>
            <p className="hero-sub">
              We connect people with extraordinary properties and the trusted experts
              who make every transaction feel effortless.
            </p>
            <div className="hero-cta-row">
              <a href="/listings" className="btn-gold">Explore Listings →</a>
              <a href="/connect" className="btn-outline">Talk to an Agent</a>
            </div>
          </div>
          <div className="scroll-hint">
            <div className="scroll-dot" />
            Scroll
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="features-bg">
          <div className="container">
            <Reveal>
              <span className="section-label">What We Offer</span>
              <h2 className="section-title">Everything you need,<br />under one roof.</h2>
            </Reveal>
            <div className="features-grid">
              {[
                { icon: "🏡", title: "Premium Listings",      desc: "A handpicked selection of top properties across cities, suburbs, and scenic retreats — verified and updated daily.",  delay: 0   },
                { icon: "🤝", title: "Expert Agents",         desc: "Connect with experienced professionals who guide you through every offer, negotiation, and closing with clarity.",       delay: 100 },
                { icon: "📊", title: "Market Intelligence",   desc: "Live price trends, neighbourhood insights, and predictive analytics so you always know the right moment to act.",     delay: 200 },
                { icon: "🔍", title: "Smart Search",          desc: "Filter by lifestyle, commute, school zones, and more — not just bedrooms and bathrooms.",                              delay: 300 },
                { icon: "💬", title: "Seamless Communication",desc: "Integrated messaging and scheduling tools that keep you and your agent perfectly in sync.",                              delay: 400 },
                { icon: "🔐", title: "Secure Transactions",   desc: "End-to-end encrypted document handling and escrow management for total peace of mind.",                                delay: 500 },
              ].map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── TEAM SECTION ─── */}
        <section className="section" id="team">
          <div className="container">
            <Reveal>
              <span className="section-label">Meet Our Team</span>
              <h2 className="section-title">Professional Experts Behind Every Deal</h2>
            </Reveal>
            <div className="team-grid">
              {(
                [
                    {
                    initials: 'SM',
                    name: 'Yousef  Hassan',
                    role: 'member',
                    image: '/yousef.png',
                    socialLinks: [
                      { platform: 'whatsapp' as SocialPlatform, href: 'https://wa.me/201287382410?text=Hello%20Yousef,%20I%20am%20interested%20in%20property%20advice' },
                      { platform: 'facebook' as SocialPlatform, href: 'https://www.facebook.com/share/14Z7fveArLv/' },
                    ],
                  },
                  {
                    initials: 'AN',
                    name: 'Amir Ashraf',
                    role: 'Asistant Team leader',
                    image: '/amir 2026-04-03 at 7.09.08 PM.jpeg',
                    socialLinks: [
                      { platform: 'whatsapp' as SocialPlatform, href: 'https://wa.me/201064320698?text=Hello%20Amina,%20I%20would%20like%20to%20connect' },
                      { platform: 'facebook' as SocialPlatform, href: 'https://m.facebook.com/groups/3249731265344500/permalink/4369484466702502/?sfnsn=scwspwa&ref=share&mibextid=VhDh1V' },
                    ],
                  },
                
                  {
                    initials: 'NR',
                    name: 'Aya Ebrahim',
                    role: 'Leader',
                    image: '/aya 2026-04-03 at 7.11.34 PM.jpeg',
                    socialLinks: [
                      { platform: 'whatsapp' as SocialPlatform, href: 'https://wa.me/201202613392?text=Hello%20Aya,%20I%20need%20architecture%20consultation' },
                      { platform: 'facebook' as SocialPlatform, href: 'https://www.facebook.com/share/1bDyDiHPJZ/?mibextid=wwXIfr' },
                    ],
                  },
                  {
                    initials: 'EM',
                    name: 'Omnia Hany',
                    role: 'member',
                    image: '/omnia 2026-04-03 at 7.11.35 PM.jpeg',
                    socialLinks: [
                      { platform: 'whatsapp' as SocialPlatform, href: 'https://wa.me/201013322997?text=Hello%20Omnia,%20I%20have%20a%20marketing%20query' },
                      { platform: 'facebook' as SocialPlatform, href: 'https://www.facebook.com/share/18rcaprLp7/' },
                    ],
                  },
                ] as Array<{
                  initials: string;
                  name: string;
                  role: string;
                  image: string;
                  socialLinks: { platform: SocialPlatform; href: string }[];
                }>
              ).map((member, i) => (
                <TeamCard key={member.name} {...member} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── COMPANY HISTORY ─── */}
        {/* ─── OUR STORY SECTION ─── */}
<section className="relative py-24 bg-[#1a1614] overflow-hidden border-t border-white/5">
  {/* Side Branding Label (Visible on XL screens) */}
  <div className="absolute top-24 -left-16 select-none pointer-events-none hidden xl:block">
    <span className="text-[140px] font-black text-white/[0.02] uppercase tracking-tighter rotate-90 inline-block">
      Heritage
    </span>
  </div>

  <div className="container mx-auto px-6 relative z-10">
    <div className="grid lg:grid-cols-12 gap-16 items-start">
      
      {/* 1. Header & Quick Stats */}
      <div className="lg:col-span-5 space-y-10">
        <Reveal>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-emerald-500/50" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-emerald-400 font-bold">
                The Narrative
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
              Building Trust <br /> 
              <span className="text-white/20 not-italic">Since 2018</span>
            </h2>
          </div>
        </Reveal>

        {/* Scannable Milestones */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.04] transition-all">
            <p className="text-4xl font-bold text-white tracking-tighter mb-1">8k+</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Families Housed</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.04] transition-all">
            <p className="text-4xl font-bold text-white tracking-tighter mb-1">12+</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Primary Markets</p>
          </div>
        </div>
      </div>

      {/* 2. Narrative Content */}
      <div className="lg:col-span-7 lg:pl-16 border-l border-white/10 relative">
        <div className="space-y-16">
          
          {/* Chapter 1 */}
          <Reveal delay={100}>
            <div className="relative">
              {/* Glow point on the border line */}
              <div className="absolute -left-[69px] top-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              <p className="text-2xl text-white/80 leading-snug font-medium mb-6">
                What started as a single-city vision has evolved into a <span className="text-white">premier real estate infrastructure</span> serving thousands.
              </p>
              <p className="text-white/50 leading-relaxed text-lg">
                Real Estate Hub was founded with a singular vision: to transform the property experience 
                by making it transparent, accessible, and human-centered. We bridge the gap between 
                high-end architecture and the modern homebuyer.
              </p>
            </div>
          </Reveal>

          {/* Chapter 2 */}
          <Reveal delay={200}>
            <div className="relative">
              <div className="absolute -left-[69px] top-2 w-2 h-2 rounded-full bg-white/10" />
              <p className="text-white/50 leading-relaxed text-lg">
                Today, we continue to invest heavily in agent training and digital accessibility. 
                Staying true to our core values of <span className="text-white/80 italic">integrity and innovation</span>, 
                every property we list strengthens our commitment to redefine the standards 
                of the real estate industry.
              </p>
            </div>
          </Reveal>

          {/* Chapter 3: Global Icons */}
          <Reveal delay={300}>
            <div className="pt-6 flex flex-wrap gap-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Excellence</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Community</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Presence</span>
              </div>
            </div>
          </Reveal>

        </div>
      </div>

    </div>
  </div>
</section>


      </div>
    </>
  )
}
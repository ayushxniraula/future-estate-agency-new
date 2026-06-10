// ============================================================
//  AboutPage.tsx — FutureWork About page
//  Brand: #252060 (navy) / #1C94A4 (teal)
//  Sections: Hero · Story · Stats · Values · Team · FAQ · CTA
// ============================================================

import { Link } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────

const VALUES = [
  {
    icon: "bi bi-shield-check",
    title: "Uncompromising Trust",
    desc: "Every listing is verified. Every agent is vetted. You deal with real properties, real prices, and real people — no inflated figures, no hidden fees.",
  },
  {
    icon: "bi bi-graph-up-arrow",
    title: "Market Intelligence",
    desc: "We track price movements across Kathmandu Valley, Pokhara, and emerging corridors so your investment decisions are backed by data, not guesswork.",
  },
  {
    icon: "bi bi-people",
    title: "People First",
    desc: "Property is one of life's biggest decisions. We slow down, listen, and guide — not push. Our reputation is built one family at a time.",
  },
  {
    icon: "bi bi-geo-alt",
    title: "Nepal at Heart",
    desc: "We are Nepali, and we understand what home means here. From Thamel to Tokha, Lalitpur to Lumbini — we know this land deeply.",
  },
];

const TEAM = [
  {
    name: "Placeholder Name",
    role: "Founder & CEO",
    image: "/assets/images/team/team_01.jpg",
    since: "Since 2010",
  },
  {
    name: "Placeholder Name",
    role: "Head of Sales",
    image: "/assets/images/team/team_02.jpg",
    since: "Since 2014",
  },
  {
    name: "Placeholder Name",
    role: "Lead Property Analyst",
    image: "/assets/images/team/team_03.jpg",
    since: "Since 2017",
  },
  {
    name: "Placeholder Name",
    role: "Client Relations",
    image: "/assets/images/team/team_04.jpg",
    since: "Since 2019",
  },
];

const FAQS = [
  {
    id: "faq1",
    q: "Where does FutureWork operate?",
    a: "We primarily serve the Kathmandu Valley — Kathmandu, Lalitpur, and Bhaktapur — along with Pokhara, Chitwan, and select emerging cities. Our network is expanding to cover all major urban corridors in Nepal.",
  },
  {
    id: "faq2",
    q: "How is FutureWork different from other agencies?",
    a: "We combine digital-first listing tools with on-the-ground local expertise. Every property is physically inspected and legally verified before it goes live — saving you from costly surprises.",
  },
  {
    id: "faq3",
    q: "What does it cost to list a property?",
    a: "Listing is completely free. We charge a 3% commission only when a successful sale is completed. No upfront fees, no monthly charges.",
  },
  {
    id: "faq4",
    q: "Do you assist with legal and financing processes?",
    a: "Yes. We have tie-ups with leading Nepali banks for home loan facilitation, and our in-house legal team assists with land registration, title checks, and transfer documentation.",
  },
];

// ─── Styles ──────────────────────────────────────────────────

const ABOUT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  /* ── Tokens ── */
  .fw-about {
    --navy:        #252060;
    --navy-dark:   #1a1648;
    --navy-faint:  rgba(37,32,96,0.06);
    --teal:        #1C94A4;
    --teal-dark:   #157a88;
    --teal-faint:  rgba(28,148,164,0.09);
    --ink:         #0f0e1a;
    --ink-2:       #3a3850;
    --ink-3:       #5a5e7a;
    --ink-4:       #9a9bb5;
    --rule:        #e8e6f0;
    --surface:     #F8F7FC;
    --white:       #ffffff;
    --serif:       'DM Serif Display', Georgia, serif;
    --sans:        'Plus Jakarta Sans', system-ui, sans-serif;
    --r-card:      18px;
    --r-sm:        10px;
    --r-pill:      100px;
    --sh-card:     0 2px 8px rgba(37,32,96,0.06), 0 8px 32px rgba(37,32,96,0.09);
    --sh-hover:    0 8px 20px rgba(37,32,96,0.10), 0 24px 56px rgba(37,32,96,0.15);
  }
  .fw-about, .fw-about * { font-family: var(--sans); box-sizing: border-box; }

  /* ── Section spacing ── */
  .fw-about { background: var(--surface); }
  .fw-about__section { padding: 100px 0; }
  .fw-about__section--flush { padding: 0; }
  @media (max-width: 991px) { .fw-about__section { padding: 70px 0; } }
  @media (max-width: 767px) { .fw-about__section { padding: 52px 0; } }

  /* ─────────────────────────────────────────────
     1. HERO
  ───────────────────────────────────────────── */
  .fw-hero {
    background: var(--navy);
    padding: 120px 0 0;
    position: relative; overflow: hidden;
  }
  .fw-hero__ghost {
    position: absolute; top: -30px; right: -60px;
    font-family: var(--serif); font-style: italic;
    font-size: clamp(100px, 18vw, 220px);
    color: rgba(255,255,255,0.032);
    pointer-events: none; line-height: 1; white-space: nowrap;
    letter-spacing: -4px; user-select: none;
  }
  .fw-hero__eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(28,148,164,0.18); border: 1px solid rgba(28,148,164,0.4);
    border-radius: var(--r-pill); padding: 5px 16px;
    font-size: 10.5px; font-weight: 800; letter-spacing: 1.4px;
    text-transform: uppercase; color: #7dd8e4; margin-bottom: 24px;
  }
  .fw-hero__eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--teal);
  }
  .fw-hero__h1 {
    font-family: var(--serif); font-size: clamp(36px, 5.5vw, 68px);
    color: #fff; line-height: 1.1; letter-spacing: -1px; margin: 0 0 24px;
  }
  .fw-hero__h1 em { color: #7dd8e4; font-style: italic; }
  .fw-hero__lead {
    font-size: clamp(15px, 1.6vw, 18px); color: rgba(255,255,255,0.62);
    line-height: 1.75; max-width: 480px; margin: 0 0 40px;
  }
  .fw-hero__actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 56px; }

  .fw-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: var(--r-sm);
    background: var(--teal); color: #fff; border: none;
    font-size: 14px; font-weight: 700; text-decoration: none;
    transition: background 0.2s, transform 0.2s; letter-spacing: 0.2px;
    font-family: var(--sans);
  }
  .fw-btn-primary:hover { background: var(--teal-dark); transform: translateY(-2px); color: #fff; }

  .fw-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: var(--r-sm);
    background: transparent; color: rgba(255,255,255,0.78);
    border: 1.5px solid rgba(255,255,255,0.22);
    font-size: 14px; font-weight: 600; text-decoration: none;
    transition: all 0.2s; font-family: var(--sans);
  }
  .fw-btn-ghost:hover { border-color: rgba(255,255,255,0.6); color: #fff; }

  .fw-hero__img-strip {
    display: flex; gap: 12px; align-items: flex-end;
    padding: 0 24px;
  }
  .fw-hero__img-strip img {
    border-radius: 16px 16px 0 0; object-fit: cover;
    flex: 1; min-width: 0;
  }
  .fw-hero__img-strip img:nth-child(1) { height: 260px; flex: 1.1; }
  .fw-hero__img-strip img:nth-child(2) { height: 320px; flex: 1.4; }
  .fw-hero__img-strip img:nth-child(3) { height: 200px; flex: 0.9; }
  @media (max-width: 767px) {
    .fw-hero__img-strip img:nth-child(1),
    .fw-hero__img-strip img:nth-child(3) { display: none; }
    .fw-hero__img-strip img:nth-child(2) { height: 220px; border-radius: 12px 12px 0 0; }
  }

  /* ─────────────────────────────────────────────
     2. STORY
  ───────────────────────────────────────────── */
  .fw-story {
    background: var(--white);
    position: relative; overflow: hidden;
  }
  .fw-story__ghost-bg {
    position: absolute; bottom: -60px; left: -20px;
    font-family: var(--serif); font-style: italic;
    font-size: clamp(80px, 14vw, 180px);
    color: rgba(37,32,96,0.04); pointer-events: none;
    line-height: 1; white-space: nowrap; user-select: none;
  }
  .fw-story__label {
    font-size: 9.5px; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--teal); margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .fw-story__label::before {
    content: ''; display: block; width: 28px; height: 2px; background: var(--teal);
  }
  .fw-story__h2 {
    font-family: var(--serif); font-size: clamp(28px, 3.8vw, 48px);
    color: var(--navy); line-height: 1.18; letter-spacing: -0.5px;
    margin-bottom: 28px;
  }
  .fw-story__h2 em { color: var(--teal); font-style: italic; }
  .fw-story__body {
    font-size: 15.5px; color: var(--ink-3); line-height: 1.8;
    margin-bottom: 20px;
  }
  .fw-story__body strong { color: var(--navy); font-weight: 700; }
  .fw-story__quote {
    border-left: 3px solid var(--teal); padding: 16px 20px;
    background: var(--teal-faint); border-radius: 0 var(--r-sm) var(--r-sm) 0;
    font-family: var(--serif); font-style: italic;
    font-size: 17px; color: var(--navy); margin: 28px 0 0; line-height: 1.6;
  }

  /* ── FIXED: image is now a fixed, controlled height ── */
  .fw-story__img-wrap {
    position: relative;
    border-radius: var(--r-card);
    overflow: hidden;
    box-shadow: var(--sh-card);
    height: 320px;
  }
  .fw-story__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .fw-story__badge {
    position: absolute; bottom: 20px; left: 20px;
    background: var(--navy); color: #fff;
    border-radius: var(--r-card); padding: 16px 22px;
    box-shadow: 0 8px 32px rgba(37,32,96,0.25);
    min-width: 150px; text-align: center;
  }
  .fw-story__badge-num {
    font-family: var(--serif); font-size: 34px; color: #fff;
    line-height: 1; margin-bottom: 4px;
  }
  .fw-story__badge-num span { color: var(--teal); }
  .fw-story__badge-label {
    font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6);
    letter-spacing: 0.5px; text-transform: uppercase;
  }

  /* ─────────────────────────────────────────────
     3. STATS
  ───────────────────────────────────────────── */
  .fw-stats {
    background: var(--navy);
    position: relative; overflow: hidden;
  }
  .fw-stats__ghost {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    font-family: var(--serif); font-style: italic;
    font-size: clamp(60px, 12vw, 150px);
    color: rgba(255,255,255,0.025);
    pointer-events: none; white-space: nowrap; user-select: none;
  }
  .fw-stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.1); border-radius: var(--r-card);
    overflow: hidden;
  }
  @media (max-width: 767px) {
    .fw-stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .fw-stat-cell {
    background: rgba(255,255,255,0.03); padding: 48px 32px;
    text-align: center; transition: background 0.2s;
  }
  .fw-stat-cell:hover { background: rgba(28,148,164,0.10); }
  @media (max-width: 991px) { .fw-stat-cell { padding: 36px 20px; } }
  .fw-stat-cell__num {
    font-family: var(--serif); font-size: clamp(40px, 4.5vw, 60px);
    color: #fff; line-height: 1; letter-spacing: -1px; margin-bottom: 10px;
  }
  .fw-stat-cell__num span { color: var(--teal); }
  .fw-stat-cell__label {
    font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.45);
    letter-spacing: 0.8px; text-transform: uppercase;
  }

  /* ─────────────────────────────────────────────
     4. VALUES
  ───────────────────────────────────────────── */
  .fw-values { background: var(--surface); }
  .fw-section-eyebrow {
    font-size: 9.5px; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--teal); margin-bottom: 12px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .fw-section-eyebrow::before,
  .fw-section-eyebrow::after {
    content: ''; display: block; height: 1px; width: 40px; background: var(--teal); opacity: 0.5;
  }
  .fw-section-h2 {
    font-family: var(--serif); font-size: clamp(26px, 3.5vw, 44px);
    color: var(--navy); letter-spacing: -0.4px; line-height: 1.2; margin-bottom: 12px;
  }
  .fw-section-h2 em { color: var(--teal); font-style: italic; }
  .fw-section-sub {
    font-size: 15px; color: var(--ink-3); max-width: 520px;
    margin: 0 auto; line-height: 1.7;
  }
  .fw-value-card {
    background: var(--white); border-radius: var(--r-card);
    padding: 36px 30px; border: 1.5px solid var(--rule);
    transition: all 0.28s ease; height: 100%;
    position: relative; overflow: hidden;
  }
  .fw-value-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--navy), var(--teal));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s ease;
  }
  .fw-value-card:hover { border-color: transparent; box-shadow: var(--sh-hover); transform: translateY(-4px); }
  .fw-value-card:hover::after { transform: scaleX(1); }
  .fw-value-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--navy-faint); display: flex; align-items: center;
    justify-content: center; margin-bottom: 22px;
    transition: background 0.25s;
  }
  .fw-value-card:hover .fw-value-icon { background: var(--navy); }
  .fw-value-icon i {
    font-size: 20px; color: var(--navy);
    transition: color 0.25s;
  }
  .fw-value-card:hover .fw-value-icon i { color: #fff; }
  .fw-value-card h5 {
    font-family: var(--serif); font-size: 19px; color: var(--navy);
    margin-bottom: 12px; line-height: 1.2;
  }
  .fw-value-card p { font-size: 14px; color: var(--ink-3); line-height: 1.75; margin: 0; }

  /* ─────────────────────────────────────────────
     5. TEAM
  ───────────────────────────────────────────── */
  .fw-team { background: var(--white); }
  .fw-team-card {
    background: var(--surface); border-radius: var(--r-card);
    overflow: hidden; border: 1.5px solid var(--rule);
    transition: all 0.28s ease;
  }
  .fw-team-card:hover { border-color: transparent; box-shadow: var(--sh-hover); transform: translateY(-5px); }
  .fw-team-card__img-wrap { position: relative; overflow: hidden; }
  .fw-team-card__img-wrap img {
    width: 100%; height: 300px; object-fit: cover;
    display: block; transition: transform 0.45s ease;
  }
  .fw-team-card:hover .fw-team-card__img-wrap img { transform: scale(1.06); }
  .fw-team-card__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(37,32,96,0.7) 0%, transparent 55%);
    opacity: 0; transition: opacity 0.3s;
    display: flex; align-items: flex-end; padding: 20px;
  }
  .fw-team-card:hover .fw-team-card__overlay { opacity: 1; }
  .fw-team-card__socials { display: flex; gap: 8px; }
  .fw-team-card__social {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 13px; text-decoration: none;
    transition: background 0.2s;
  }
  .fw-team-card__social:hover { background: var(--teal); color: #fff; }
  .fw-team-card__body { padding: 20px 22px 22px; }
  .fw-team-card__since {
    font-size: 9.5px; font-weight: 800; letter-spacing: 1px;
    text-transform: uppercase; color: var(--teal); margin-bottom: 5px;
  }
  .fw-team-card__name {
    font-family: var(--serif); font-size: 20px; color: var(--navy); margin-bottom: 4px; line-height: 1.2;
  }
  .fw-team-card__role { font-size: 12.5px; color: var(--ink-3); font-weight: 500; }

  /* ─────────────────────────────────────────────
     6. FAQ
  ───────────────────────────────────────────── */
  .fw-faq { background: var(--surface); }
  .fw-faq-list { list-style: none; padding: 0; margin: 0; }
  .fw-faq-item {
    border-bottom: 1px solid var(--rule);
  }
  .fw-faq-item:first-child { border-top: 1px solid var(--rule); }
  .fw-faq-btn {
    width: 100%; text-align: left; background: none; border: none;
    padding: 22px 0; cursor: pointer; display: flex;
    align-items: center; justify-content: space-between; gap: 16px;
    font-family: var(--sans);
  }
  .fw-faq-q {
    font-size: 15.5px; font-weight: 700; color: var(--navy);
    line-height: 1.4; transition: color 0.2s;
  }
  .fw-faq-btn[aria-expanded="true"] .fw-faq-q { color: var(--teal); }
  .fw-faq-icon {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid var(--rule); background: var(--white);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 14px; color: var(--navy);
    transition: all 0.25s;
  }
  .fw-faq-btn[aria-expanded="true"] .fw-faq-icon {
    background: var(--teal); border-color: var(--teal); color: #fff;
    transform: rotate(45deg);
  }
  .fw-faq-body {
    font-size: 14.5px; color: var(--ink-3); line-height: 1.8;
    padding-bottom: 20px; padding-right: 44px;
    display: none;
  }
  .fw-faq-body.open { display: block; }

  /* ─────────────────────────────────────────────
     7. CTA
  ───────────────────────────────────────────── */
  .fw-cta {
    background: var(--navy);
    position: relative; overflow: hidden;
    text-align: center;
  }
  .fw-cta__ghost {
    position: absolute; bottom: -40px; left: 50%;
    transform: translateX(-50%);
    font-family: var(--serif); font-style: italic;
    font-size: clamp(60px, 12vw, 140px);
    color: rgba(255,255,255,0.03); pointer-events: none;
    white-space: nowrap; user-select: none;
  }
  .fw-cta__label {
    font-size: 9.5px; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; color: rgba(125,216,228,0.7); margin-bottom: 20px;
  }
  .fw-cta__h2 {
    font-family: var(--serif); font-size: clamp(28px, 4.5vw, 54px);
    color: #fff; line-height: 1.15; letter-spacing: -0.5px;
    max-width: 640px; margin: 0 auto 20px;
  }
  .fw-cta__h2 em { color: #7dd8e4; font-style: italic; }
  .fw-cta__sub {
    font-size: 15.5px; color: rgba(255,255,255,0.55);
    max-width: 440px; margin: 0 auto 40px; line-height: 1.7;
  }
  .fw-cta__actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  .fw-btn-white {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 30px; border-radius: var(--r-sm);
    background: #fff; color: var(--navy);
    border: none; font-size: 14px; font-weight: 700;
    text-decoration: none; transition: all 0.2s; font-family: var(--sans);
  }
  .fw-btn-white:hover { background: var(--teal); color: #fff; transform: translateY(-2px); }

  .fw-btn-outline-white {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: var(--r-sm);
    background: transparent; color: rgba(255,255,255,0.78);
    border: 1.5px solid rgba(255,255,255,0.25);
    font-size: 14px; font-weight: 600; text-decoration: none;
    transition: all 0.2s; font-family: var(--sans);
  }
  .fw-btn-outline-white:hover { border-color: rgba(255,255,255,0.65); color: #fff; }
`;

function injectAboutStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-about-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-about-styles";
    el.textContent = ABOUT_STYLES;
    document.head.appendChild(el);
  }
}

// ─── FAQ Item (stateful) ──────────────────────────────────────
function FaqItem({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="fw-faq-item">
      <button
        className="fw-faq-btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fw-faq-q">{q}</span>
        <span className="fw-faq-icon">
          <i className="bi bi-plus" />
        </span>
      </button>
      <div className={`fw-faq-body${open ? " open" : ""}`}>{a}</div>
    </li>
  );
}

// ─── Component ───────────────────────────────────────────────
import { useState } from "react";

const BLockFeatureOne = () => {
  injectAboutStyles();

  return (
    <div className="fw-about">
      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}

      {/* ══════════════════════════════════════════
          2. STORY
      ══════════════════════════════════════════ */}
      <section className="fw-about__section fw-story">
        <div className="fw-story__ghost-bg">Story</div>
        <div className="container">
          <div className="row align-items-center gx-xl-5">
            {/* Image column — narrowed from col-lg-5 to col-lg-4 */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="fw-story__img-wrap">
                <img
                  src="/assets/images/media/img_53.jpg"
                  alt="FutureWork office and team"
                  className="fw-story__img"
                />
                <div className="fw-story__badge">
                  <div className="fw-story__badge-num">
                    14<span>+</span>
                  </div>
                  <div className="fw-story__badge-label">
                    Years serving Nepal
                  </div>
                </div>
              </div>
            </div>
            {/* Text column — widened from col-lg-7 to col-lg-8 */}
            <div className="col-lg-8">
              <div className="ps-lg-3 ps-xl-5">
                <div className="fw-story__label">Our Story</div>
                <h2 className="fw-story__h2">
                  Built on a belief that <em>every Nepali</em> deserves a home
                  they love.
                </h2>
                <p className="fw-story__body">
                  FutureWork was founded in <strong>2010 in Kathmandu</strong>{" "}
                  by a group of property professionals who were tired of seeing
                  buyers misled by inflated listings and undisclosed land
                  disputes. We set out to do things differently: verified
                  listings, transparent pricing, and agents who work for the
                  buyer as much as the seller.
                </p>
                <p className="fw-story__body">
                  Today we are Nepal's largest verified property marketplace —
                  spanning
                  <strong>
                    {" "}
                    Kathmandu Valley, Pokhara, Chitwan, and Butwal
                  </strong>
                  , with over 1,200 successful transactions and a roster of
                  institutional investors who trust our market intelligence to
                  allocate capital across Nepal's fastest-growing urban
                  corridors.
                </p>
                <blockquote className="fw-story__quote">
                  "Real estate is not about buildings — it is about the life you
                  build inside them."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. VALUES
      ══════════════════════════════════════════ */}
      <section className="fw-about__section fw-values">
        <div className="container">
          <div className="text-center mb-60 lg-mb-40">
            <div className="fw-section-eyebrow">What we stand for</div>
            <h2 className="fw-section-h2">
              Principles that guide <em>every decision</em> we make
            </h2>
            <p className="fw-section-sub">
              From the first call to the final handover, these four values shape
              how we work.
            </p>
          </div>
          <div className="row gx-4 gy-4">
            {VALUES.map((v, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div className="fw-value-card">
                  <div className="fw-value-icon">
                    <i className={v.icon} />
                  </div>
                  <h5>{v.title}</h5>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. TEAM
      ══════════════════════════════════════════ */}
      <section className="fw-about__section fw-team">
        <div className="container">
          <div className="text-center mb-60 lg-mb-40">
            <div className="fw-section-eyebrow">The people behind it</div>
            <h2 className="fw-section-h2">
              A team that <em>knows Nepal</em> inside out
            </h2>
            <p className="fw-section-sub">
              Local experts. Honest advice. Available when you need them.
            </p>
          </div>
          <div className="row gx-4 gy-4">
            {TEAM.map((member, i) => (
              <div key={i} className="col-lg-3 col-sm-6">
                <div className="fw-team-card">
                  <div className="fw-team-card__img-wrap">
                    <img
                      src={member.image}
                      alt={member.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (
                          e.target as HTMLImageElement
                        ).parentElement!.style.background =
                          "linear-gradient(135deg, #e8e6f5 0%, #d9f2f5 100%)";
                        (
                          e.target as HTMLImageElement
                        ).parentElement!.style.height = "300px";
                      }}
                    />
                    <div className="fw-team-card__overlay">
                      <div className="fw-team-card__socials">
                        <a
                          href="#"
                          className="fw-team-card__social"
                          aria-label="LinkedIn"
                        >
                          <i className="bi bi-linkedin" />
                        </a>
                        <a
                          href="#"
                          className="fw-team-card__social"
                          aria-label="Email"
                        >
                          <i className="bi bi-envelope" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="fw-team-card__body">
                    <div className="fw-team-card__since">{member.since}</div>
                    <div className="fw-team-card__name">{member.name}</div>
                    <div className="fw-team-card__role">{member.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. FAQ
      ══════════════════════════════════════════ */}
      <section className="fw-about__section fw-faq">
        <div className="container">
          <div className="row align-items-start gx-xl-5">
            {/* Left: heading + contact nudge */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="fw-story__label">FAQ</div>
              <h2
                className="fw-story__h2"
                style={{ fontSize: "clamp(26px, 3vw, 38px)" }}
              >
                Questions we hear <em>most often</em>
              </h2>
              <p
                style={{
                  fontSize: "14.5px",
                  color: "var(--ink-3)",
                  lineHeight: 1.75,
                  marginBottom: "28px",
                }}
              >
                Can't find your answer here? Our team is always happy to help —
                just reach out directly.
              </p>
              <Link
                to="/contact"
                className="fw-btn-primary"
                style={{ background: "var(--navy)", display: "inline-flex" }}
              >
                Contact us <i className="bi bi-arrow-up-right" />
              </Link>
            </div>
            {/* Right: accordion */}
            <div className="col-lg-8">
              <ul className="fw-faq-list">
                {FAQS.map((faq) => (
                  <FaqItem key={faq.id} id={faq.id} q={faq.q} a={faq.a} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. CTA
      ══════════════════════════════════════════ */}
    </div>
  );
};

export default BLockFeatureOne;

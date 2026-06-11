// ============================================================
//  FutureFooter.tsx — FutureWork branded footer
//  Brand: #252060 navy / #1C94A4 teal
// ============================================================

import { Link } from "react-router-dom";
import { useState } from "react";

interface ContentType {
  desc: string;
  email: string;
  number: string;
  address: string;
  socials: { icon: string; label: string; href: string }[];
}

const footer_content: ContentType = {
  desc: "Nepal's trusted platform for buying, selling, and renting property — from Kathmandu to Pokhara.",
  address: "Thamel, Kathmandu, Nepal",
  email: "futureworkestateaganecy@gmail.com",
  number: "+977 01-4XXXXXX",
  socials: [
    { icon: "fa-facebook-f", label: "Facebook", href: "#" },
    { icon: "fa-twitter", label: "Twitter", href: "#" },
    { icon: "fa-instagram", label: "Instagram", href: "#" },
    { icon: "fa-linkedin-in", label: "LinkedIn", href: "#" },
  ],
};

// ─── Footer nav data (replaces FooterData import) ─────────────
const footer_nav = [
  {
    id: 1,
    widget_title: "Company",
    links: [
      { title: "Home", to: "/" },
      { title: "About Company", to: "/about" },
      { title: "Contact", to: "/contact" },
      { title: "Explore Career", to: null, modal: true },
    ],
  },
  {
    id: 2,
    widget_title: "Properties",
    links: [
      { title: "New Listings", to: "/buy" },
      { title: "Buy", to: "/buy" },
      { title: "Sell", to: "/sell" },
      { title: "Compare", to: "/propcompare" },
    ],
  },
  {
    id: 3,
    widget_title: "Tools",
    links: [
      { title: "Calculator", to: "/calculator" },
      { title: "Heat Map", to: "/heatmap" },
      {
        title: "Dashboard",
        to: "https://uat-future-state-new-admin.netlify.app/",
        external: true,
      },
    ],
  },
  {
    id: 4,
    widget_title: "Legal",
    links: [
      { title: "Terms & Conditions", to: "/terms" },
      { title: "Privacy Policy", to: "/privacy" },
      { title: "Cookie Policy", to: "/cookie" },
    ],
  },
];

const { desc, address, email, number, socials } = footer_content;

// ─── No Openings Modal ────────────────────────────────────────
const CareerModal = ({ onClose }: { onClose: () => void }) => (
  <div className="ff-modal-overlay" onClick={onClose}>
    <div className="ff-modal-box" onClick={(e) => e.stopPropagation()}>
      <button className="ff-modal-close" onClick={onClose} aria-label="Close">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="ff-modal-icon" aria-hidden="true">
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1C94A4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      </div>
      <h3 className="ff-modal-title">No Current Openings</h3>
      <p className="ff-modal-desc">
        We don't have any open positions right now, but we're always growing.
        <br />
        Send your CV to <a href={`mailto:${email}`}>{email}</a> and we'll be in
        touch when something comes up.
      </p>
      <button className="ff-modal-btn" onClick={onClose}>
        Got it
      </button>
    </div>
  </div>
);

const FutureFooter = () => {
  const [careerOpen, setCareerOpen] = useState(false);

  return (
    <footer className="ff-root">
      {careerOpen && <CareerModal onClose={() => setCareerOpen(false)} />}

      {/* ── Subtle grid texture ── */}
      <svg
        className="ff-grid-svg"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="ffgrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.025)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ffgrid)" />
      </svg>

      {/* ── Single deep glow ── */}
      <div className="ff-glow" aria-hidden="true" />

      <div className="ff-inner">
        {/* ══ Main grid ══ */}
        <div className="ff-main">
          {/* Brand column */}
          <div className="ff-brand">
            <Link to="/" className="ff-logo">
              <img src="/assets/logo1.png" alt="FutureWork" />
            </Link>
            <p className="ff-brand-desc">{desc}</p>

            <ul className="ff-contact-list">
              <li>
                <span className="ff-contact-icon">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span>{address}</span>
              </li>
              <li>
                <span className="ff-contact-icon">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <span className="ff-contact-icon">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a href={`tel:${number.replace(/\s/g, "")}`}>{number}</a>
              </li>
            </ul>

            <div className="ff-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="ff-social-btn"
                >
                  <i className={`fa-brands ${s.icon}`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="ff-nav-columns">
            {footer_nav.map((col) => (
              <div key={col.id} className="ff-nav-col">
                <h5 className="ff-nav-title">{col.widget_title}</h5>
                <ul className="ff-nav-list">
                  {col.links.map((li, i) => (
                    <li key={i}>
                      {li.modal ? (
                        <button
                          className="ff-nav-modal-btn"
                          onClick={() => setCareerOpen(true)}
                        >
                          <span className="ff-nav-arrow" aria-hidden="true">
                            ›
                          </span>
                          {li.title}
                        </button>
                      ) : li.external ? (
                        <a
                          href={li.to!}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="ff-nav-arrow" aria-hidden="true">
                            ›
                          </span>
                          {li.title}
                        </a>
                      ) : (
                        <Link to={li.to!}>
                          <span className="ff-nav-arrow" aria-hidden="true">
                            ›
                          </span>
                          {li.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rule ── */}
        <div className="ff-rule" />

        {/* ══ Bottom bar ══ */}
        <div className="ff-bottom">
          <p className="ff-copyright">
            © {new Date().getFullYear()} FutureWork Nepal. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        /* ══ Shell ══ */
        .ff-root {
          position: relative;
          background: #131130;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif;
        }
        .ff-grid-svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }
        .ff-glow {
          position: absolute; width: 600px; height: 400px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(28,148,164,0.07) 0%, transparent 70%);
          bottom: -80px; left: -120px; pointer-events: none; z-index: 0;
        }
        .ff-inner {
          position: relative; z-index: 1; max-width: 1280px;
          margin: 0 auto; padding: 0 40px;
        }
        @media (max-width: 600px) { .ff-inner { padding: 0 20px; } }

        /* ══ Main grid ══ */
        .ff-main {
          display: grid; grid-template-columns: 300px 1fr;
          gap: 80px; padding: 64px 0 52px; align-items: start;
        }
        @media (max-width: 960px) { .ff-main { grid-template-columns: 1fr; gap: 44px; } }

        /* ── Brand column ── */
        .ff-logo img { height: 58px; display: block; opacity: 0.9; transition: opacity 0.2s; }
        .ff-logo:hover img { opacity: 0.65; }
        .ff-brand-desc {
          font-size: 13.5px; color: rgba(255,255,255,0.58);
          line-height: 1.75; margin: 20px 0 26px; max-width: 260px;
        }
        .ff-contact-list {
          list-style: none; padding: 0; margin: 0 0 26px;
          display: flex; flex-direction: column; gap: 11px;
        }
        .ff-contact-list li { display: flex; align-items: center; gap: 10px; }
        .ff-contact-icon {
          width: 28px; height: 28px; background: rgba(28,148,164,0.08);
          border: 1px solid rgba(28,148,164,0.18); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          color: #1C94A4; flex-shrink: 0;
        }
        .ff-contact-list span, .ff-contact-list a {
          font-size: 13px; color: rgba(255,255,255,0.62);
          text-decoration: none; transition: color 0.18s;
        }
        .ff-contact-list a:hover { color: #1C94A4; }

        .ff-socials { display: flex; gap: 7px; }
        .ff-social-btn {
          width: 34px; height: 34px; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.58); font-size: 13px; text-decoration: none;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
        }
        .ff-social-btn:hover {
          background: rgba(28,148,164,0.14); border-color: rgba(28,148,164,0.35);
          color: #1C94A4; transform: translateY(-2px);
        }

        /* ── Nav columns ── */
        .ff-nav-columns {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 36px;
        }
        @media (max-width: 560px) { .ff-nav-columns { grid-template-columns: repeat(2, 1fr); } }

        .ff-nav-title {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #1C94A4; margin: 0 0 16px;
        }
        .ff-nav-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 9px;
        }
        .ff-nav-list a, .ff-nav-modal-btn {
          font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.18s, gap 0.18s;
          background: none; border: none; padding: 0; cursor: pointer;
          font-family: inherit;
        }
        .ff-nav-list a:hover, .ff-nav-modal-btn:hover { color: #fff; gap: 9px; }
        .ff-nav-arrow {
          color: rgba(28,148,164,0.7); font-size: 15px; line-height: 1; transition: transform 0.18s;
        }
        .ff-nav-list a:hover .ff-nav-arrow,
        .ff-nav-modal-btn:hover .ff-nav-arrow { transform: translateX(2px); }

        /* ── Rule ── */
        .ff-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(28,148,164,0.18) 60%, transparent);
        }

        /* ══ Bottom bar ══ */
        .ff-bottom {
          display: flex; align-items: center; justify-content: center;
          padding: 20px 0 26px;
        }
        .ff-copyright { font-size: 12px; color: rgba(255,255,255,0.42); margin: 0; }

        /* ══ Career Modal ══ */
        .ff-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10,9,30,0.72); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: ffFadeIn 0.2s ease;
        }
        @keyframes ffFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .ff-modal-box {
          position: relative; background: #1a1840;
          border: 1px solid rgba(28,148,164,0.25); border-radius: 24px;
          padding: 48px 40px 40px; max-width: 420px; width: 100%;
          text-align: center; box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          animation: ffSlideUp 0.25s ease;
        }
        @keyframes ffSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .ff-modal-close {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5); cursor: pointer; display: flex;
          align-items: center; justify-content: center; transition: all 0.18s;
        }
        .ff-modal-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .ff-modal-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(28,148,164,0.1); border: 1px solid rgba(28,148,164,0.2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 22px;
        }
        .ff-modal-title {
          font-size: 1.35rem; font-weight: 700; color: #fff; margin: 0 0 14px;
        }
        .ff-modal-desc {
          font-size: 13.5px; color: rgba(255,255,255,0.58); line-height: 1.75; margin: 0 0 28px;
        }
        .ff-modal-desc a { color: #1C94A4; text-decoration: none; }
        .ff-modal-desc a:hover { text-decoration: underline; }

        .ff-modal-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 12px 36px; border-radius: 10px; font-size: 14px; font-weight: 600;
          background: linear-gradient(135deg, #252060, #1C94A4);
          color: #fff; border: none; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s; font-family: inherit;
        }
        .ff-modal-btn:hover { opacity: 0.88; transform: translateY(-1px); }
      `}</style>
    </footer>
  );
};

export default FutureFooter;

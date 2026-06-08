import { useState } from "react";
import { Link } from "react-router-dom";
import footer_data from "../../data/home-data/FooterData";

interface ContentType {
  title: string;
  desc_1: string;
  desc_2: string;
  email: string;
  number: string;
  socials: { icon: string; label: string; href: string }[];
}

const footer_content: ContentType = {
  title: "Stay in the loop",
  desc_1:
    "Get the latest listings, market insights & property news delivered to your inbox.",
  desc_2: "11910 Clyde Rapid Suite 210, Wil, Virginia, USA",
  email: "homyreal@demo.com",
  number: "+757 699-4478",
  socials: [
    { icon: "fa-facebook-f", label: "Facebook", href: "#" },
    { icon: "fa-twitter", label: "Twitter", href: "#" },
    { icon: "fa-instagram", label: "Instagram", href: "#" },
    { icon: "fa-linkedin-in", label: "LinkedIn", href: "#" },
  ],
};

const { title, desc_1, desc_2, email, number, socials } = footer_content;

const FutureFooter = () => {
  const [subEmail, setSubEmail] = useState("");
  const [subDone, setSubDone] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (subEmail.includes("@")) setSubDone(true);
  };

  return (
    <footer className="ff-root">
      {/* ── Decorative grid ── */}
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
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ffgrid)" />
      </svg>

      {/* ── Glow accents ── */}
      <div className="ff-glow ff-glow-1" aria-hidden="true" />
      <div className="ff-glow ff-glow-2" aria-hidden="true" />

      <div className="ff-inner">
        {/* ══ Newsletter band ══ */}
        <div className="ff-newsletter">
          <div className="ff-nl-text">
            <span className="ff-nl-eyebrow">Newsletter</span>
            <h2 className="ff-nl-title">{title}</h2>
            <p className="ff-nl-desc">{desc_1}</p>
          </div>

          <div className="ff-nl-form-wrap">
            {subDone ? (
              <div className="ff-nl-thanks">
                <span className="ff-nl-thanks-icon">✓</span>
                <span>You're subscribed — great to have you!</span>
              </div>
            ) : (
              <form className="ff-nl-form" onSubmit={handleSub} noValidate>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe">
                  Subscribe{" "}
                  <i
                    className="fa-light fa-arrow-right-long"
                    aria-hidden="true"
                  />
                </button>
              </form>
            )}
            <p className="ff-nl-fine">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* ── Horizontal rule ── */}
        <div className="ff-rule" />

        {/* ══ Main grid ══ */}
        <div className="ff-main">
          {/* Brand column */}
          <div className="ff-brand">
            <Link to="/" className="ff-logo">
              <img src="/assets/images/logo/logo_05.svg" alt="EstateAdmin" />
            </Link>
            <p className="ff-brand-desc">{desc_2}</p>

            <ul className="ff-contact-list">
              <li>
                <span className="ff-contact-icon">
                  <img
                    src="/assets/images/icon/icon_30.svg"
                    alt=""
                    width="16"
                    aria-hidden="true"
                  />
                </span>
                <Link to={`mailto:${email}`}>{email}</Link>
              </li>
              <li>
                <span className="ff-contact-icon">
                  <img
                    src="/assets/images/icon/icon_31.svg"
                    alt=""
                    width="16"
                    aria-hidden="true"
                  />
                </span>
                <Link to={`tel:${number.replace(/\s/g, "")}`}>{number}</Link>
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
            {footer_data
              .filter((items) => items.page === "home_3")
              .map((item) => (
                <div key={item.id} className="ff-nav-col">
                  <h5 className="ff-nav-title">{item.widget_title}</h5>
                  <ul className="ff-nav-list">
                    {item.footer_link.map((li, i) => (
                      <li key={i}>
                        <Link to={li.link}>
                          <span className="ff-nav-arrow" aria-hidden="true">
                            ›
                          </span>
                          {li.link_title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            {/* Decorative property card */}
            <div className="ff-prop-card">
              <div className="ff-prop-card-inner">
                <div className="ff-prop-badge">Featured</div>
                <div className="ff-prop-icon" aria-hidden="true">
                  🏠
                </div>
                <p className="ff-prop-name">3BR Apartment, Dhaka</p>
                <p className="ff-prop-price">$420,000</p>
                <Link to="/listing" className="ff-prop-link">
                  View listing →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Rule ── */}
        <div className="ff-rule" />

        {/* ══ Bottom bar ══ */}
        <div className="ff-bottom">
          <p className="ff-copyright">
            © 2024 EstateAdmin Inc. All rights reserved.
          </p>
          <nav className="ff-bottom-nav" aria-label="Footer legal links">
            <Link to="/faq">Privacy &amp; Terms</Link>
            <span aria-hidden="true">·</span>
            <Link to="/faq">Cookies</Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact">Contact Us</Link>
          </nav>
        </div>
      </div>

      <style>{`
        /* ══ Shell ══ */
        .ff-root {
          position: relative;
          background: #181550;
          overflow: hidden;
          font-family: inherit;
        }

        /* ── Grid texture ── */
        .ff-grid-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Glow blobs ── */
        .ff-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .ff-glow-1 {
          width: 500px; height: 500px;
          background: rgba(28,148,164,0.12);
          top: -120px; left: -100px;
          animation: ffGlow 12s ease-in-out infinite;
        }
        .ff-glow-2 {
          width: 360px; height: 360px;
          background: rgba(37,32,96,0.6);
          bottom: 0; right: -80px;
          animation: ffGlow 9s ease-in-out infinite reverse;
        }
        @keyframes ffGlow {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.7; }
        }

        /* ── Inner container ── */
        .ff-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        @media (max-width: 600px) {
          .ff-inner { padding: 0 20px; }
        }

        /* ══ Newsletter ══ */
        .ff-newsletter {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding: 60px 0 52px;
        }
        @media (max-width: 768px) {
          .ff-newsletter { grid-template-columns: 1fr; gap: 24px; padding: 48px 0 40px; }
        }

        .ff-nl-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #1C94A4;
          margin-bottom: 10px;
        }
        .ff-nl-eyebrow::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 2px;
          background: #1C94A4;
          border-radius: 2px;
        }
        .ff-nl-title {
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 800;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .ff-nl-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin: 0;
          line-height: 1.7;
        }

        .ff-nl-form {
          display: flex;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ff-nl-form:focus-within {
          border-color: rgba(28,148,164,0.6);
          box-shadow: 0 0 0 3px rgba(28,148,164,0.12);
        }
        .ff-nl-form input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 14px 18px;
          font-size: 13.5px;
          color: #fff;
          font-family: inherit;
        }
        .ff-nl-form input::placeholder { color: rgba(255,255,255,0.3); }
        .ff-nl-form button {
          background: #1C94A4;
          border: none;
          padding: 14px 22px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.18s;
          white-space: nowrap;
        }
        .ff-nl-form button:hover { background: #17808e; }

        .ff-nl-thanks {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(28,148,164,0.12);
          border: 1px solid rgba(28,148,164,0.3);
          border-radius: 10px;
          padding: 14px 20px;
          font-size: 13.5px;
          color: #fff;
          font-weight: 500;
        }
        .ff-nl-thanks-icon {
          width: 26px;
          height: 26px;
          background: #1C94A4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .ff-nl-fine {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          margin: 8px 0 0;
        }

        /* ── Rule ── */
        .ff-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(28,148,164,0.3) 60%, transparent);
        }

        /* ══ Main grid ══ */
        .ff-main {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
          padding: 52px 0 48px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ff-main { grid-template-columns: 1fr; gap: 40px; }
        }

        /* ── Brand col ── */
        .ff-logo img {
          height: 36px;
          display: block;
          filter: brightness(0) invert(1);
          transition: opacity 0.2s;
        }
        .ff-logo:hover img { opacity: 0.8; }

        .ff-brand-desc {
          font-size: 13.5px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          margin: 18px 0 22px;
          max-width: 240px;
        }

        .ff-contact-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ff-contact-list li {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ff-contact-icon {
          width: 30px;
          height: 30px;
          background: rgba(28,148,164,0.12);
          border: 1px solid rgba(28,148,164,0.25);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ff-contact-list a {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.18s;
        }
        .ff-contact-list a:hover { color: #1C94A4; }

        .ff-socials {
          display: flex;
          gap: 8px;
        }
        .ff-social-btn {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.55);
          font-size: 14px;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
        }
        .ff-social-btn:hover {
          background: rgba(28,148,164,0.18);
          border-color: rgba(28,148,164,0.45);
          color: #1C94A4;
          transform: translateY(-2px);
        }

        /* ── Nav columns ── */
        .ff-nav-columns {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 32px;
        }

        .ff-nav-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #1C94A4;
          margin: 0 0 18px;
        }

        .ff-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ff-nav-list a {
          font-size: 13.5px;
          color: rgba(255,255,255,0.48);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.18s, gap 0.18s;
        }
        .ff-nav-list a:hover {
          color: #fff;
          gap: 10px;
        }
        .ff-nav-arrow {
          color: #1C94A4;
          font-size: 16px;
          line-height: 1;
          transition: transform 0.18s;
        }
        .ff-nav-list a:hover .ff-nav-arrow {
          transform: translateX(2px);
        }

        /* ── Decorative property card ── */
        .ff-prop-card {
          display: flex;
          align-items: flex-start;
        }
        .ff-prop-card-inner {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 20px 18px;
          width: 100%;
          transition: border-color 0.2s, background 0.2s;
        }
        .ff-prop-card-inner:hover {
          background: rgba(28,148,164,0.08);
          border-color: rgba(28,148,164,0.25);
        }
        .ff-prop-badge {
          display: inline-block;
          background: rgba(28,148,164,0.15);
          border: 1px solid rgba(28,148,164,0.3);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #1C94A4;
          margin-bottom: 14px;
        }
        .ff-prop-icon {
          font-size: 28px;
          margin-bottom: 10px;
          display: block;
        }
        .ff-prop-name {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          margin: 0 0 4px;
        }
        .ff-prop-price {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 14px;
          letter-spacing: -0.5px;
        }
        .ff-prop-link {
          font-size: 12px;
          font-weight: 700;
          color: #1C94A4;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: color 0.18s;
        }
        .ff-prop-link:hover { color: #5ac8d4; }

        /* ══ Bottom bar ══ */
        .ff-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 22px 0 28px;
        }
        .ff-copyright {
          font-size: 12.5px;
          color: rgba(255,255,255,0.3);
          margin: 0;
        }
        .ff-bottom-nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ff-bottom-nav a {
          font-size: 12.5px;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.18s;
        }
        .ff-bottom-nav a:hover { color: #1C94A4; }
        .ff-bottom-nav span {
          color: rgba(255,255,255,0.15);
          font-size: 12px;
        }
      `}</style>
    </footer>
  );
};

export default FutureFooter;

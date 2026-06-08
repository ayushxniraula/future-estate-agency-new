// ============================================================
//  FutureBannerTwo.tsx — CTA banner for property search
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Nepal-specific copy, structure unchanged from original
// ============================================================

import { Link } from "react-router-dom";

// ─── Brand styles ─────────────────────────────────────────────
const BANNER_TWO_STYLES = `
  /* ── Banner wrapper ── */
  .fancy-banner-seven .bg-wrapper {
    background: linear-gradient(125deg, #252060 0%, #1e1a55 45%, #1C94A4 100%) !important;
    border-radius: 28px;
    overflow: hidden;
    position: relative;
  }

  /* Inner glow overlay */
  .fancy-banner-seven .bg-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 80% 50%, rgba(28,148,164,0.25) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 10% 10%, rgba(255,255,255,0.04) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .fancy-banner-seven .bg-wrapper > * { position: relative; z-index: 1; }

  /* ── Heading ── */
  .fancy-banner-seven h2 {
    color: #fff !important;
    font-family: 'DM Serif Display', Georgia, serif;
    line-height: 1.2;
  }

  /* ── Sub text ── */
  .fancy-banner-seven p.text-white {
    color: rgba(255,255,255,0.82) !important;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* Teal accent numbers / highlights inside paragraph */
  .fancy-banner-seven p.text-white strong,
  .fancy-banner-seven p.text-white span {
    color: #7de3ef;
    font-weight: 700;
  }

  /* ── CTA button ── */
  .fancy-banner-seven .fw-banner-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    border-radius: 12px;
    background: #fff;
    color: #252060;
    font-size: 14px;
    font-weight: 700;
    font-family: 'DM Sans', system-ui, sans-serif;
    text-decoration: none;
    border: 2px solid #fff;
    transition: all 0.24s ease;
    letter-spacing: 0.2px;
  }
  .fancy-banner-seven .fw-banner-btn:hover {
    background: transparent;
    color: #fff;
    border-color: #fff;
    gap: 14px;
  }
  .fancy-banner-seven .fw-banner-btn i {
    transition: transform 0.24s ease;
  }
  .fancy-banner-seven .fw-banner-btn:hover i {
    transform: translateX(4px) rotate(-45deg);
  }

  /* ── Stats row beneath button ── */
  .fw-banner-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .fw-banner-stat {
    text-align: center;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .fw-banner-stat__num {
    display: block;
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    margin-bottom: 4px;
    font-family: 'DM Serif Display', Georgia, serif;
  }
  .fw-banner-stat__label {
    font-size: 12px;
    color: rgba(255,255,255,0.65);
    font-weight: 500;
    letter-spacing: 0.3px;
  }
  .fw-banner-stat + .fw-banner-stat {
    border-left: 1px solid rgba(255,255,255,0.15);
    padding-left: 32px;
  }

  /* ── Decorative shapes — recolour ── */
  .fancy-banner-seven .shapes {
    filter: hue-rotate(175deg) saturate(0.6) opacity(0.35);
  }

  /* ── Mobile responsiveness ── */
  @media (max-width: 991px) {
    .fancy-banner-seven .bg-wrapper {
      border-radius: 20px;
    }
    .fw-banner-stats {
      gap: 20px;
    }
    .fw-banner-stat + .fw-banner-stat {
      border-left: none;
      padding-left: 0;
    }
  }
  @media (max-width: 767px) {
    .fancy-banner-seven .bg-wrapper {
      border-radius: 16px;
      padding-top: 48px !important;
      padding-bottom: 52px !important;
    }
    .fw-banner-stats {
      gap: 16px;
      margin-top: 28px;
      padding-top: 24px;
    }
    .fw-banner-stat__num { font-size: 1.3rem; }
  }
`;

function injectBannerTwoStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-banner-two-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-banner-two-styles";
    el.textContent = BANNER_TWO_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Stats data — Nepal-specific ─────────────────────────────
const STATS = [
  { num: "3,200+", label: "Properties Listed" },
  { num: "7", label: "Provinces Covered" },
  { num: "1,800+", label: "Happy Families" },
  { num: "12", label: "Years in Nepal" },
];

// ─── Component ────────────────────────────────────────────────
const FutureBannerTwo = () => {
  injectBannerTwoStyles();

  return (
    <div className="fancy-banner-seven mt-110 xl-mt-80 mb-130 xl-mb-100 lg-mb-80">
      <div className="container container-lage">
        <div className="bg-wrapper position-relative z-1 pt-85 lg-pt-70 pb-100 xl-pb-80 lg-pb-70">
          <div className="row">
            <div className="col-xl-7 col-lg-8 col-md-10 m-auto text-center">
              {/* Headline */}
              <h2 className="font-garamond text-white">
                Find the right home for your family across Nepal
              </h2>

              {/* Subtext */}
              <p className="fs-24 text-white mt-30 mb-45 lg-mb-30">
                From Kathmandu valleys to Pokhara lakesides — we have{" "}
                <strong>3,200+</strong> verified properties across{" "}
                <span>7 provinces</span>.
              </p>

              {/* CTA */}
              <Link to="/buy" className="fw-banner-btn">
                <span>Start Your Search</span>
                <i className="bi bi-arrow-up-right" />
              </Link>

              {/* Stats row */}
              <div className="fw-banner-stats">
                {STATS.map((stat, i) => (
                  <div key={i} className="fw-banner-stat">
                    <span className="fw-banner-stat__num">{stat.num}</span>
                    <span className="fw-banner-stat__label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureBannerTwo;

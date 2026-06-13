// ============================================================
//  CategorySection.tsx — Property type browse grid
//  Sits directly below FutureHeroBanner on the homepage
//  Brand: #252060 navy / #1C94A4 teal
//  Font: Plus Jakarta Sans + DM Serif Display
//  - Live counts from Supabase per property type
//  - Routes to /buy?type=<type> (BuyListing reads selectedType)
//  - "All" category shows total count
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ─────────────────────────────────────────────────
const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Category config ──────────────────────────────────────────
// SVG icon paths drawn inline — no external icon dep needed here
const CATEGORIES = [
  {
    type: "All",
    label: "All Properties",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    type: "Apartment",
    label: "Apartment",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="1.5" />
        <path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2M10 22v-4h4v4" />
      </svg>
    ),
  },
  {
    type: "Villa",
    label: "Villa",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12L12 4l9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 22v-6h6v6" />
        <path d="M15 14h2v3h-2z" />
      </svg>
    ),
  },
  {
    type: "Home",
    label: "Home",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11.5L12 3l9 8.5" />
        <path d="M5 9.5V21h5v-5h4v5h5V9.5" />
      </svg>
    ),
  },
  {
    type: "Flat",
    label: "Flat",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="1.5" />
        <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <path d="M6 12h3M6 16h3M12 12h6M12 16h6" />
      </svg>
    ),
  },
  {
    type: "Loft",
    label: "Loft",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 21V10l8-7 8 7v11" />
        <path d="M4 13h16" />
        <rect x="9" y="16" width="6" height="5" rx="0.5" />
        <path d="M8 10h8" />
      </svg>
    ),
  },
  {
    type: "Building",
    label: "Building",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="12" height="18" rx="1" />
        <path d="M15 8h6v13H15" />
        <path d="M7 7h2M7 11h2M7 15h2M11 7h2M11 11h2M11 15h2" />
        <path d="M9 21v-3h2v3" />
        <path d="M18 12h2M18 16h2" />
      </svg>
    ),
  },
  {
    type: "Office",
    label: "Office",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="1.5" />
        <path d="M2 9h20" />
        <path d="M7 4V2M17 4V2" />
        <rect x="6" y="13" width="4" height="3" rx="0.5" />
        <rect x="14" y="13" width="4" height="3" rx="0.5" />
        <path d="M6 17h12" />
      </svg>
    ),
  },
  {
    type: "Factory",
    label: "Factory",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21V9l5 3V9l5 3V8h8v13H3z" />
        <path d="M14 12h2M14 16h2M7 16h2M7 12h2" />
      </svg>
    ),
  },
  {
    type: "Industry",
    label: "Industry",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="14" width="8" height="7" rx="0.5" />
        <rect x="8" y="9" width="8" height="12" rx="0.5" />
        <rect x="14" y="5" width="8" height="16" rx="0.5" />
        <path d="M2 21h20" />
      </svg>
    ),
  },
];

// ─── Styles ───────────────────────────────────────────────────
const CATEGORY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

  .fwcat-section {
    background: #f7f6fb;
    padding: 72px 0 80px;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  .fwcat-section *, .fwcat-section *::before, .fwcat-section *::after {
    box-sizing: border-box;
  }

  .fwcat-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .fwcat-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #1C94A4;
    margin-bottom: 14px;
  }

  .fwcat-eyebrow::before,
  .fwcat-eyebrow::after {
    content: '';
    display: block;
    width: 24px;
    height: 1.5px;
    background: #1C94A4;
    opacity: 0.5;
    border-radius: 2px;
  }

  .fwcat-title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(26px, 3.5vw, 38px);
    font-weight: 400;
    color: #252060;
    line-height: 1.18;
    letter-spacing: -0.5px;
    margin: 0 0 12px;
  }

  .fwcat-title em {
    font-style: italic;
    color: #1C94A4;
  }

  .fwcat-sub {
    font-size: 14.5px;
    color: #7a7890;
    font-weight: 400;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* ── Grid ── */
  .fwcat-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
  }

  @media (max-width: 1100px) { .fwcat-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 820px)  { .fwcat-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 560px)  { .fwcat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

  /* ── Card ── */
  .fwcat-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 28px 16px 22px;
    background: #ffffff;
    border: 1.5px solid #e8e6f0;
    border-radius: 16px;
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.22s, box-shadow 0.22s, transform 0.22s;
    overflow: hidden;
    text-align: center;
  }

  .fwcat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(37,32,96,0.03) 0%, rgba(28,148,164,0.05) 100%);
    opacity: 0;
    transition: opacity 0.22s;
  }

  .fwcat-card:hover {
    border-color: #1C94A4;
    box-shadow: 0 8px 32px rgba(28,148,164,0.14), 0 2px 8px rgba(37,32,96,0.06);
    transform: translateY(-4px);
  }

  .fwcat-card:hover::before { opacity: 1; }

  /* "All" card gets navy accent */
  .fwcat-card--all {
    border-color: rgba(37,32,96,0.18);
    background: linear-gradient(135deg, #252060 0%, #1e1a6e 100%);
  }
  .fwcat-card--all:hover {
    border-color: #1C94A4;
    box-shadow: 0 8px 32px rgba(37,32,96,0.22), 0 2px 8px rgba(37,32,96,0.12);
  }

  /* ── Icon shell ── */
  .fwcat-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(37,32,96,0.06);
    border: 1.5px solid rgba(37,32,96,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    transition: background 0.22s, border-color 0.22s, transform 0.22s;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .fwcat-icon-wrap svg {
    width: 24px;
    height: 24px;
    color: #252060;
    transition: color 0.22s;
    display: block;
  }

  .fwcat-card:hover .fwcat-icon-wrap {
    background: rgba(28,148,164,0.1);
    border-color: rgba(28,148,164,0.25);
    transform: scale(1.08);
  }
  .fwcat-card:hover .fwcat-icon-wrap svg { color: #1C94A4; }

  .fwcat-card--all .fwcat-icon-wrap {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.2);
  }
  .fwcat-card--all .fwcat-icon-wrap svg { color: #ffffff; }
  .fwcat-card--all:hover .fwcat-icon-wrap {
    background: rgba(28,148,164,0.35);
    border-color: rgba(28,148,164,0.5);
  }

  /* ── Label ── */
  .fwcat-label {
    font-size: 13px;
    font-weight: 700;
    color: #0f0e1a;
    letter-spacing: 0.1px;
    margin-bottom: 6px;
    position: relative;
    z-index: 1;
    transition: color 0.18s;
  }
  .fwcat-card:hover .fwcat-label { color: #252060; }
  .fwcat-card--all .fwcat-label { color: #ffffff; }

  /* ── Badge (count) ── */
  .fwcat-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.3px;
    position: relative;
    z-index: 1;
    transition: background 0.18s, color 0.18s;
    min-width: 36px;
  }

  /* Default badge */
  .fwcat-badge--default {
    background: rgba(37,32,96,0.07);
    color: #252060;
  }
  .fwcat-card:hover .fwcat-badge--default {
    background: rgba(28,148,164,0.12);
    color: #157a88;
  }

  /* "All" card badge */
  .fwcat-badge--all {
    background: rgba(28,148,164,0.25);
    color: #a8e8f0;
  }
  .fwcat-card--all:hover .fwcat-badge--all {
    background: rgba(28,148,164,0.45);
    color: #ffffff;
  }

  /* Zero badge dims */
  .fwcat-badge--zero {
    opacity: 0.45;
  }

  /* Skeleton shimmer */
  @keyframes fwcat-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .fwcat-skeleton {
    background: linear-gradient(90deg, #eeedf6 25%, #e4e3f0 50%, #eeedf6 75%);
    background-size: 200% 100%;
    animation: fwcat-shimmer 1.4s infinite;
    border-radius: 8px;
    display: inline-block;
  }

  /* ── View all link ── */
  .fwcat-footer {
    text-align: center;
    margin-top: 40px;
  }

  .fwcat-view-all {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #252060;
    text-decoration: none;
    border: 1.5px solid #e8e6f0;
    background: #ffffff;
    padding: 10px 24px;
    border-radius: 100px;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    letter-spacing: 0.2px;
    cursor: pointer;
  }
  .fwcat-view-all:hover {
    border-color: #252060;
    background: #252060;
    color: #ffffff;
  }
  .fwcat-view-all svg {
    width: 13px;
    height: 13px;
    transition: transform 0.22s;
    flex-shrink: 0;
  }
  .fwcat-view-all:hover svg { transform: rotate(45deg); }
`;

function injectCategoryStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fwcat-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fwcat-styles";
    el.textContent = CATEGORY_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Component ────────────────────────────────────────────────
const CategorySection = () => {
  injectCategoryStyles();
  const navigate = useNavigate();

  // counts: { [type]: number }  — "All" key holds total
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Fetch all property types in one query — no N+1
        const { data, error } = await supabase
          .from("properties")
          .select("property_type");

        if (error) throw error;

        const tally: Record<string, number> = {};
        let total = 0;

        (data || []).forEach((row: { property_type: string }) => {
          const t = row.property_type ?? "Unknown";
          tally[t] = (tally[t] || 0) + 1;
          total++;
        });

        tally["All"] = total;
        setCounts(tally);
      } catch {
        // On error just show cards without counts
        setCounts({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCardClick = (type: string) => {
    if (type === "All") {
      navigate("/buy");
    } else {
      // BuyListing reads `selectedType` from state; pass via location state
      // so the type bar pre-selects on arrival
      navigate("/buy", { state: { selectedType: type } });
    }
  };

  return (
    <section className="fwcat-section">
      <div className="container">
        {/* Header */}
        <div className="fwcat-header">
          <div className="fwcat-eyebrow">Browse by type</div>
          <h2 className="fwcat-title">
            Find the right <em>property</em>
          </h2>
          <p className="fwcat-sub">
            Explore every category — from city apartments to industrial spaces —
            all in one place.
          </p>
        </div>

        {/* Grid */}
        <div className="fwcat-grid">
          {CATEGORIES.map(({ type, label, icon }) => {
            const isAll = type === "All";
            const count = counts[type];
            const hasCount = !loading && count !== undefined;

            return (
              <div
                key={type}
                className={`fwcat-card${isAll ? " fwcat-card--all" : ""}`}
                onClick={() => handleCardClick(type)}
                role="button"
                tabIndex={0}
                aria-label={`Browse ${label} properties${hasCount ? `, ${count} listings` : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(type);
                  }
                }}
              >
                <div className="fwcat-icon-wrap">{icon}</div>

                <span className="fwcat-label">{label}</span>

                {loading ? (
                  <span
                    className="fwcat-skeleton"
                    style={{ width: 36, height: 20 }}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className={[
                      "fwcat-badge",
                      isAll ? "fwcat-badge--all" : "fwcat-badge--default",
                      hasCount && count === 0 ? "fwcat-badge--zero" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {hasCount ? count : "—"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="fwcat-footer">
          <button className="fwcat-view-all" onClick={() => navigate("/buy")}>
            View all listings
            <svg
              viewBox="0 0 13 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

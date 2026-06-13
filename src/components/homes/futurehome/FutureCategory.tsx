// ============================================================
//  FutureCategory.tsx — Supabase-powered property categories
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Replaces static category_data with live Supabase fetch
//  Counts live properties per category from the properties table
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Category icon map (property_type → icon path) ───────────
// Maps Supabase property_type values to existing icon assets.
// Extend this map whenever new property types are added to DB.
const CATEGORY_ICON_MAP: Record<string, string> = {
  Apartment: "/assets/images/icon/icon_16.svg",
  Villa: "/assets/images/icon/icon_17.svg",
  Industry: "/assets/images/icon/icon_18.svg",
  Office: "/assets/images/icon/icon_19.svg",
  Home: "/assets/images/icon/icon_21.svg",
  House: "/assets/images/icon/icon_21.svg",
  Loft: "/assets/images/icon/icon_22.svg",
  Building: "/assets/images/icon/icon_18.svg",
  Factory: "/assets/images/icon/icon_18.svg",
  Flat: "/assets/images/icon/icon_16.svg",
  // Fallback
  default: "/assets/images/icon/icon_16.svg",
};

interface CategoryItem {
  type: string;
  count: number;
  icon: string;
}

// ─── Injected styles ──────────────────────────────────────────
const CATEGORY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  .fw-category-section {
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* ── Section heading ── */
  .fw-category-section .fw-cat-heading {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: #252060;
    letter-spacing: -0.2px;
    margin-bottom: 0;
  }

  /* ── Category pill list ── */
  .fw-cat-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
  @media (min-width: 1400px) {
    .fw-cat-list { justify-content: space-between; }
  }

  /* ── Each pill item ── */
  .fw-cat-list li a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px 10px 14px;
    border-radius: 40px;
    border: 1.5px solid #dde2f0;
    background: #fff;
    color: #252060;
    font-size: 13.5px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.22s ease;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .fw-cat-list li a::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, #252060 0%, #1C94A4 100%);
    opacity: 0;
    transition: opacity 0.22s ease;
    z-index: 0;
  }
  .fw-cat-list li a:hover::before { opacity: 1; }
  .fw-cat-list li a:hover {
    border-color: transparent;
    color: #fff;
    box-shadow: 0 6px 24px rgba(37,32,96,0.18);
    transform: translateY(-2px);
  }
  .fw-cat-list li a > * { position: relative; z-index: 1; }

  /* Icon wrapper */
  .fw-cat-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(37,32,96,0.08) 0%, rgba(28,148,164,0.12) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.22s ease;
  }
  .fw-cat-list li a:hover .fw-cat-icon-wrap {
    background: rgba(255,255,255,0.18);
  }
  .fw-cat-icon-wrap img {
    width: 17px;
    height: 17px;
    filter: invert(13%) sepia(61%) saturate(900%) hue-rotate(215deg) brightness(60%);
    transition: filter 0.22s ease;
  }
  .fw-cat-list li a:hover .fw-cat-icon-wrap img {
    filter: brightness(0) invert(1);
  }

  /* Count badge */
  .fw-cat-count {
    font-size: 10.5px;
    font-weight: 500;
    color: #1C94A4;
    background: rgba(28,148,164,0.1);
    border-radius: 10px;
    padding: 1px 7px;
    margin-left: 2px;
    transition: background 0.22s, color 0.22s;
  }
  .fw-cat-list li a:hover .fw-cat-count {
    background: rgba(255,255,255,0.2);
    color: #fff;
  }

  /* ── Skeleton ── */
  .fw-cat-skel {
    height: 54px;
    width: 140px;
    border-radius: 40px;
    background: linear-gradient(90deg, #eef0f8 25%, #f5f7fd 50%, #eef0f8 75%);
    background-size: 200% 100%;
    animation: fw-cat-shimmer 1.3s infinite;
  }
  @keyframes fw-cat-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── See all btn ── */
  .fw-cat-see-all {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 11px 26px;
    border-radius: 10px;
    border: 1.5px solid #252060;
    color: #252060;
    font-size: 13px;
    font-weight: 600;
    font-style: italic;
    text-decoration: none;
    transition: all 0.22s ease;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .fw-cat-see-all:hover {
    background: #252060;
    color: #fff;
    gap: 11px;
  }

  /* ── Border bottom variant ── */
  .fw-cat-inner-border {
    border-bottom: 1px solid #dde2f0;
    padding-bottom: 65px;
  }
  @media (max-width: 991px) { .fw-cat-inner-border { padding-bottom: 40px; } }

  /* Section title */
  .fw-cat-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 40px;
  }
  @media (max-width: 767px) {
    .fw-cat-title-row { justify-content: center; text-align: center; }
  }
`;

function injectCategoryStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-category-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-category-styles";
    el.textContent = CATEGORY_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Main Component ───────────────────────────────────────────
const FutureCategory = ({ style }: { style?: boolean }) => {
  injectCategoryStyles();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Fetch all property types + count grouped by property_type
        const { data, error } = await supabase
          .from("properties")
          .select("property_type");

        if (error) throw error;

        // Count occurrences of each type client-side
        const countMap: Record<string, number> = {};
        (data || []).forEach((row) => {
          const t = row.property_type?.trim() || "Other";
          countMap[t] = (countMap[t] || 0) + 1;
        });

        const items: CategoryItem[] = Object.entries(countMap)
          .filter(([type]) => type && type !== "Other")
          .sort((a, b) => b[1] - a[1]) // most listings first
          .map(([type, count]) => ({
            type,
            count,
            icon: CATEGORY_ICON_MAP[type] ?? CATEGORY_ICON_MAP.default,
          }));

        setCategories(items);
      } catch (e) {
        console.error("FutureCategory fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div
      className={`fw-category-section category-section-one ${
        style ? "grey-bg pt-130 pb-110 xl-pb-80" : "mt-65"
      }`}
    >
      <div className="container container-large">
        <div
          className={`position-relative z-1 ${
            style ? "" : "fw-cat-inner-border"
          }`}
        >
          <div className="fw-cat-title-row">
            <h4
              className="fw-cat-heading mb-0"
              style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "#252060",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              Popular Categories
              {!loading && categories.length > 0 && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#1C94A4",
                    marginLeft: "10px",
                    fontStyle: "italic",
                  }}
                >
                  {categories.length} types across Nepal
                </span>
              )}
            </h4>
            <Link to="/listing_08" className="fw-cat-see-all d-none d-md-flex">
              <span>See all categories</span>
              <i className="bi bi-chevron-right" />
            </Link>
          </div>

          <div className="wrapper">
            {/* Loading skeletons */}
            {loading && (
              <ul
                className="fw-cat-list"
                style={{ justifyContent: "center", gap: "12px" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <li key={i}>
                    <div className="fw-cat-skel" />
                  </li>
                ))}
              </ul>
            )}

            {/* Dynamic category pills */}
            {!loading && categories.length > 0 && (
              <ul className="fw-cat-list">
                {categories.map((cat) => (
                  <li key={cat.type}>
                    <Link
                      to={`/buy?type=${encodeURIComponent(cat.type)}`}
                      className="fw-500 tran3s"
                    >
                      <span className="fw-cat-icon-wrap">
                        <img src={cat.icon} alt={cat.type} loading="lazy" />
                      </span>
                      <span>{cat.type}</span>
                      <span className="fw-cat-count">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Empty state */}
            {!loading && categories.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#6b7191",
                  fontSize: "14px",
                  padding: "32px 0",
                }}
              >
                No categories found. Properties will appear here once listed.
              </p>
            )}
          </div>

          {/* See all — mobile */}
          <div className="section-btn text-center sm-mt-40 d-md-none">
            <Link to="/listing_08" className="fw-cat-see-all">
              <span>See all categories</span>
              <i className="bi bi-chevron-right" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureCategory;

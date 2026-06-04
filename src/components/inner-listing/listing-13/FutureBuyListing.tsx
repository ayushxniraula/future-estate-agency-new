// ============================================================
//  BuyListing.tsx — Supabase-powered property listing
//  Refined: DM Serif Display + DM Sans, editorial layout,
//  compact type bar, generous padding, luxury card design
// ============================================================

import { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import NiceSelect from "../../../ui/NiceSelect";

// ─── Supabase Client ──────────────────────────────────────────
const SUPABASE_URL = "https://wzttfewbiiakxkmgzfre.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dHRmZXdiaWlha3hrbWd6ZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY0MjksImV4cCI6MjA5NTM2MjQyOX0.-00zf6PqvccpLvBGxy4FtveqX5mCeGXJbC-ZF8ziEBk";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Types ────────────────────────────────────────────────────
interface Property {
  id: string;
  title: string;
  property_type: string;
  status: string;
  price: number;
  location: string;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  kitchens: number | null;
  images: string[];
  floor_plans: string[];
  amenities: string[];
  description: string | null;
  features_description: string | null;
  property_details: Record<string, string> | null;
  utility_features: Record<string, string> | null;
  outdoor_features: Record<string, string> | null;
  whats_nearby: Record<string, string> | null;
  agent_info: Record<string, string> | null;
  created_at: string;
}

interface FiltersState {
  keyword: string;
  location: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  priceRange: [number, number];
  amenities: string[];
  minYearBuilt: string;
  sqftMin: string;
  sqftMax: string;
}

// ─── Constants ────────────────────────────────────────────────
const ITEMS_PER_PAGE = 9;

const PROPERTY_TYPES = [
  "All",
  "Apartment",
  "Villa",
  "Loft",
  "Home",
  "Flat",
  "Building",
  "Office",
  "Factory",
  "Industry",
];

const AMENITY_OPTIONS = [
  "A/C & Heating",
  "Garages",
  "Garden",
  "Disabled Access",
  "Swimming Pool",
  "Parking",
  "WiFi",
  "Pet Friendly",
  "Ceiling Height",
  "Fireplace",
  "Play Ground",
  "Elevator",
];

// ─── Helpers ──────────────────────────────────────────────────
function getStatusLabel(status: string): string {
  switch (status) {
    case "For Sale":
      return "For Sale";
    case "For Rent":
      return "For Rent";
    case "Sold":
      return "Sold";
    case "Rented":
      return "Rented";
    default:
      return status ?? "";
  }
}

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "For Sale":
      return { bg: "rgba(232,69,69,0.92)", text: "#fff" };
    case "For Rent":
      return { bg: "rgba(33,150,243,0.92)", text: "#fff" };
    case "Sold":
      return { bg: "rgba(76,175,80,0.92)", text: "#fff" };
    case "Rented":
      return { bg: "rgba(255,152,0,0.92)", text: "#fff" };
    default:
      return { bg: "rgba(80,80,80,0.88)", text: "#fff" };
  }
}

function defaultFilters(range: [number, number]): FiltersState {
  return {
    keyword: "",
    location: "",
    status: "",
    bedrooms: "",
    bathrooms: "",
    priceRange: range,
    amenities: [],
    minYearBuilt: "",
    sqftMin: "",
    sqftMax: "",
  };
}

// ─── Global styles injected once ─────────────────────────────
const INJECTED_STYLE = `
  /* ── Google Fonts ── */
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  /* ── Root design tokens ── */
  :root {
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body:    'DM Sans', system-ui, sans-serif;
    --c-ink:        #1a1715;
    --c-ink-2:      #4a4845;
    --c-ink-3:      #8a8785;
    --c-rule:       #ede9e4;
    --c-surface:    #faf9f7;
    --c-white:      #ffffff;
    --c-accent:     #c8402a;
    --c-accent-h:   #a83320;
    --radius-card:  16px;
    --radius-sm:    10px;
    --shadow-card:  0 1px 3px rgba(26,23,21,0.06), 0 4px 16px rgba(26,23,21,0.07);
    --shadow-hover: 0 4px 8px rgba(26,23,21,0.08), 0 16px 40px rgba(26,23,21,0.13);
  }

  /* ── Base font ── */
  .buy-listing-root,
  .buy-listing-root * {
    font-family: var(--font-body);
  }

  /* ── Outer page padding ── */
  .buy-listing-root {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (min-width: 768px) {
    .buy-listing-root {
      padding-left: 40px;
      padding-right: 40px;
    }
  }
  @media (min-width: 1200px) {
    .buy-listing-root {
      padding-left: 56px;
      padding-right: 56px;
    }
  }

  /* ── Type filter bar ── */
  .type-bar {
    background: var(--c-white);
    border-bottom: 1px solid var(--c-rule);
    padding: 0 32px;
  }
  .type-bar-inner {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 10px 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .type-bar-inner::-webkit-scrollbar { display: none; }
  .type-bar-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-right: 6px;
    flex-shrink: 0;
  }
  .type-pill {
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--c-ink-2);
    text-decoration: none;
    border: 1px solid var(--c-rule);
    transition: all 0.18s ease;
    white-space: nowrap;
    background: var(--c-white);
    letter-spacing: 0.1px;
    flex-shrink: 0;
  }
  .type-pill:hover {
    border-color: var(--c-ink);
    color: var(--c-ink);
    background: var(--c-surface);
  }
  .type-pill.active {
    background: var(--c-ink);
    border-color: var(--c-ink);
    color: var(--c-white);
  }

  /* ── Property card ── */
  .prop-card {
    border-radius: var(--radius-card);
    overflow: hidden;
    background: var(--c-white);
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.28s ease, transform 0.28s ease;
    border: 1px solid var(--c-rule);
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .prop-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-4px);
  }

  /* image wrap */
  .prop-card__img-wrap {
    position: relative;
    overflow: hidden;
  }
  .prop-card__img-wrap img {
    transition: transform 0.45s ease;
    display: block;
  }
  .prop-card:hover .prop-card__img-wrap img {
    transform: scale(1.05);
  }

  /* status badge — compact */
  .prop-card__badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    z-index: 3;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    line-height: 1.6;
  }

  /* fav button */
  .prop-card__fav {
    position: absolute;
    top: 11px;
    right: 11px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    color: #aaa;
    transition: background 0.2s, color 0.2s, transform 0.2s;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .prop-card__fav:hover {
    background: var(--c-accent);
    color: var(--c-white);
    transform: scale(1.12);
  }

  /* card body */
  .prop-card__body {
    padding: 20px 22px 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* type chip above title */
  .prop-card__type {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 5px;
  }

  .prop-card__title {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 400;
    color: var(--c-ink);
    text-decoration: none;
    line-height: 1.25;
    display: block;
    margin-bottom: 6px;
    transition: color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .prop-card__title:hover { color: var(--c-accent); }

  .prop-card__location {
    font-size: 12.5px;
    color: var(--c-ink-3);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* divider */
  .prop-card__divider {
    height: 1px;
    background: var(--c-rule);
    margin: 0 -22px 14px;
  }

  /* feature row */
  .prop-card__features {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .prop-card__feat {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--c-surface);
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--c-ink-2);
    font-weight: 500;
    border: 1px solid var(--c-rule);
  }
  .prop-card__feat img { width: 13px; height: 13px; opacity: 0.6; }

  /* card footer */
  .prop-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 22px 18px;
    margin-top: auto;
  }
  .prop-card__price {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 400;
    color: var(--c-ink);
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .prop-card__price sup {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    color: var(--c-ink-3);
    vertical-align: super;
    margin-right: 1px;
  }
  .prop-card__price sub {
    font-family: var(--font-body);
    font-size: 11.5px;
    font-weight: 400;
    color: var(--c-ink-3);
  }
  .prop-card__arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--c-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--c-white);
    text-decoration: none;
    transition: background 0.2s, transform 0.25s;
    font-size: 13px;
    flex-shrink: 0;
  }
  .prop-card__arrow:hover {
    background: var(--c-accent);
    transform: rotate(45deg);
  }

  /* carousel */
  .carousel-dot {
    transition: all 0.22s ease;
  }

  /* ── Sidebar ── */
  .sidebar-panel {
    background: var(--c-white);
    border-right: 1px solid var(--c-rule);
    min-height: 100%;
  }
  .sidebar-panel__inner {
    padding: 32px 24px;
  }
  .sidebar-panel__heading {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 400;
    color: var(--c-ink);
    margin-bottom: 28px;
    letter-spacing: -0.2px;
  }
  .sidebar-section {
    margin-bottom: 22px;
    padding-bottom: 22px;
    border-bottom: 1px solid var(--c-rule);
  }
  .sidebar-section:last-of-type { border-bottom: none; }
  .sidebar-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 9px;
    display: block;
  }
  .sidebar-input {
    width: 100%;
    padding: 9px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    font-size: 13.5px;
    font-family: var(--font-body);
    color: var(--c-ink);
    background: var(--c-surface);
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }
  .sidebar-input:focus {
    border-color: var(--c-ink);
    background: var(--c-white);
    box-shadow: 0 0 0 3px rgba(26,23,21,0.06);
  }
  .amenity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }
  .amenity-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    color: var(--c-ink-2);
    cursor: pointer;
    padding: 5px 0;
    font-family: var(--font-body);
  }
  .amenity-item input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: var(--c-accent);
    cursor: pointer;
    flex-shrink: 0;
  }
  .reset-btn {
    width: 100%;
    padding: 11px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-ink);
    background: transparent;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-body);
    color: var(--c-ink);
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: all 0.2s;
  }
  .reset-btn:hover {
    background: var(--c-ink);
    color: var(--c-white);
  }

  /* ── Listing header ── */
  .listing-header {
    background: var(--c-surface);
    border-radius: var(--radius-sm);
    padding: 12px 18px;
    border: 1px solid var(--c-rule);
    margin-bottom: 32px;
  }
  .results-count {
    font-size: 13.5px;
    color: var(--c-ink-3);
    font-family: var(--font-body);
  }
  .results-count strong {
    color: var(--c-ink);
    font-weight: 600;
  }
  /* sort row — keep label and select on same baseline */
  .sort-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sort-row .nice-select {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    line-height: 1 !important;
    height: auto !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }

  /* ── Pagination ── */
  .pagination-refined {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .pagination-refined li a,
  .pagination-refined li span {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 14px;
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--c-ink-2);
    border: 1.5px solid transparent;
    transition: all 0.18s;
    text-decoration: none;
    cursor: pointer;
  }
  .pagination-refined li a:hover {
    border-color: var(--c-ink);
    color: var(--c-ink);
    background: var(--c-surface);
  }
  .pagination-refined li.selected a {
    background: var(--c-ink);
    color: var(--c-white);
    border-color: var(--c-ink);
  }
  .pagination-refined li.disabled span {
    opacity: 0.3;
    cursor: default;
  }
  /* prev / next arrow buttons */
  .pagination-refined li.previous a,
  .pagination-refined li.next a {
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
    color: var(--c-ink);
    font-size: 13px;
  }
  .pagination-refined li.previous a:hover,
  .pagination-refined li.next a:hover {
    border-color: var(--c-ink);
    background: var(--c-ink);
    color: var(--c-white);
  }
  .pagination-refined li.previous.disabled a,
  .pagination-refined li.next.disabled a {
    opacity: 0.3;
    pointer-events: none;
  }
`;

function injectStyle() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("buy-listing-refined-styles")
  ) {
    const el = document.createElement("style");
    el.id = "buy-listing-refined-styles";
    el.textContent = INJECTED_STYLE;
    document.head.appendChild(el);
  }
}

// ─── Image Carousel ───────────────────────────────────────────
function CarouselOrImage({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "220px",
          background: "#f0ede8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.6rem",
        }}
      >
        🏠
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", height: "220px" }}>
      <img
        src={images[current]}
        alt={title}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          display: "block",
        }}
        loading="lazy"
      />
      {images.length > 1 && (
        <>
          <button onClick={prev} style={carouselBtnStyle("left")}>
            ‹
          </button>
          <button onClick={next} style={carouselBtnStyle("right")}>
            ›
          </button>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "5px",
            }}
          >
            {images.map((_, i) => (
              <span
                key={i}
                className="carousel-dot"
                style={{
                  width: i === current ? "18px" : "6px",
                  height: "5px",
                  borderRadius: "3px",
                  display: "inline-block",
                  background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function carouselBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: "10px",
    transform: "translateY(-50%)",
    background: "rgba(26,23,21,0.38)",
    backdropFilter: "blur(6px)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    fontSize: "18px",
    lineHeight: "1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    transition: "background 0.2s",
  };
}

// ─── Price Range Slider ───────────────────────────────────────
function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const pct = (v: number) =>
    max === min ? 0 : ((v - min) / (max - min)) * 100;
  const minAtMax = value[0] >= value[1] - 1;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            background: "var(--c-surface)",
            padding: "3px 9px",
            borderRadius: "8px",
            color: "var(--c-ink)",
            fontWeight: 600,
            border: "1px solid var(--c-rule)",
            fontFamily: "var(--font-body)",
          }}
        >
          ${value[0].toLocaleString()}
        </span>
        <span
          style={{
            background: "var(--c-surface)",
            padding: "3px 9px",
            borderRadius: "8px",
            color: "var(--c-ink)",
            fontWeight: 600,
            border: "1px solid var(--c-rule)",
            fontFamily: "var(--font-body)",
          }}
        >
          ${value[1].toLocaleString()}
        </span>
      </div>
      <div style={{ position: "relative", height: "20px" }}>
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: 0,
            right: 0,
            height: "3px",
            background: "var(--c-rule)",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: `${pct(value[0])}%`,
            right: `${100 - pct(value[1])}%`,
            height: "3px",
            background: "var(--c-ink)",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value[0]}
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), value[1] - 1), value[1]])
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "20px",
            background: "transparent",
            WebkitAppearance: "none",
            appearance: "none",
            outline: "none",
            border: "none",
            cursor: "pointer",
            zIndex: minAtMax ? 5 : 3,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value[1]}
          onChange={(e) =>
            onChange([value[0], Math.max(Number(e.target.value), value[0] + 1)])
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "20px",
            background: "transparent",
            WebkitAppearance: "none",
            appearance: "none",
            outline: "none",
            border: "none",
            cursor: "pointer",
            zIndex: minAtMax ? 3 : 4,
          }}
        />
      </div>
    </div>
  );
}

// ─── Sidebar Filters ─────────────────────────────────────────
function SidebarFilters({
  filters,
  onChange,
  onReset,
  priceMinMax,
}: {
  filters: FiltersState;
  onChange: (p: Partial<FiltersState>) => void;
  onReset: () => void;
  priceMinMax: [number, number];
}) {
  const toggleAmenity = (a: string) => {
    const next = filters.amenities.includes(a)
      ? filters.amenities.filter((x) => x !== a)
      : [...filters.amenities, a];
    onChange({ amenities: next });
  };

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel__inner">
        <p className="sidebar-panel__heading">Filters</p>

        <div className="sidebar-section">
          <span className="sidebar-label">Listing Type</span>
          <select
            className="sidebar-input"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
          >
            <option value="">All Listings</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Keyword</span>
          <input
            type="text"
            className="sidebar-input"
            placeholder="e.g. home, villa…"
            value={filters.keyword}
            onChange={(e) => onChange({ keyword: e.target.value })}
          />
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Location</span>
          <input
            type="text"
            className="sidebar-input"
            placeholder="City or address…"
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </div>

        <div className="sidebar-section">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <span className="sidebar-label">Bedrooms</span>
              <select
                className="sidebar-input"
                value={filters.bedrooms}
                onChange={(e) => onChange({ bedrooms: e.target.value })}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="sidebar-label">Bathrooms</span>
              <select
                className="sidebar-input"
                value={filters.bathrooms}
                onChange={(e) => onChange({ bathrooms: e.target.value })}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Amenities</span>
          <div className="amenity-grid">
            {AMENITY_OPTIONS.map((a) => (
              <label key={a} className="amenity-item">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                />
                <span>{a}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Price Range</span>
          <PriceRangeSlider
            min={priceMinMax[0]}
            max={priceMinMax[1]}
            value={filters.priceRange}
            onChange={(v) => onChange({ priceRange: v })}
          />
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Min Year Built</span>
          <select
            className="sidebar-input"
            value={filters.minYearBuilt}
            onChange={(e) => onChange({ minYearBuilt: e.target.value })}
          >
            <option value="">Any Year</option>
            {[2024, 2022, 2020, 2018, 2015, 2010, 2005, 2000].map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Square Footage</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <input
              type="number"
              placeholder="Min sqft"
              className="sidebar-input"
              value={filters.sqftMin}
              onChange={(e) => onChange({ sqftMin: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max sqft"
              className="sidebar-input"
              value={filters.sqftMax}
              onChange={(e) => onChange({ sqftMax: e.target.value })}
            />
          </div>
        </div>

        <button className="reset-btn" onClick={onReset}>
          Reset All Filters
        </button>
      </div>
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────
function PropertyCard({ item }: { item: Property }) {
  const badge = getStatusColor(item.status);
  return (
    <div className="prop-card">
      <div className="prop-card__img-wrap">
        <div style={{ position: "relative" }}>
          <span
            className="prop-card__badge"
            style={{ background: badge.bg, color: badge.text }}
          >
            {getStatusLabel(item.status)}
          </span>
          <Link to="#" className="prop-card__fav">
            <i className="fa-light fa-heart" style={{ fontSize: "13px" }} />
          </Link>
          <CarouselOrImage images={item.images || []} title={item.title} />
        </div>
      </div>

      <div className="prop-card__body">
        {item.property_type && (
          <div className="prop-card__type">{item.property_type}</div>
        )}
        <Link to={`/buy/${item.id}`} className="prop-card__title">
          {item.title}
        </Link>
        <div className="prop-card__location">
          <svg
            width="11"
            height="13"
            viewBox="0 0 11 13"
            fill="none"
            style={{ flexShrink: 0, marginTop: "1px" }}
          >
            <path
              d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.25A1.75 1.75 0 1 1 5.5 2.75a1.75 1.75 0 0 1 0 3.5z"
              fill="currentColor"
            />
          </svg>
          {item.location}
        </div>

        {(item.sqft || item.bedrooms != null || item.bathrooms != null) && (
          <>
            <div className="prop-card__divider" />
            <div className="prop-card__features">
              {item.sqft && (
                <div className="prop-card__feat">
                  <img src="/assets/images/icon/icon_32.svg" alt="" />
                  <span>{item.sqft.toLocaleString()} ft²</span>
                </div>
              )}
              {item.bedrooms != null && (
                <div className="prop-card__feat">
                  <img src="/assets/images/icon/icon_33.svg" alt="" />
                  <span>{item.bedrooms} bed</span>
                </div>
              )}
              {item.bathrooms != null && (
                <div className="prop-card__feat">
                  <img src="/assets/images/icon/icon_34.svg" alt="" />
                  <span>{item.bathrooms} bath</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="prop-card__footer">
        <div className="prop-card__price">
          <sup>$</sup>
          {item.price.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          {item.status === "For Rent" && <sub> / mo</sub>}
        </div>
        <Link to={`/buy/${item.id}`} className="prop-card__arrow">
          <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const BuyListing = () => {
  injectStyle();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [itemOffset, setItemOffset] = useState(0);
  const [priceMinMax, setPriceMinMax] = useState<[number, number]>([
    0, 1_000_000,
  ]);
  const [filters, setFilters] = useState<FiltersState>(
    defaultFilters([0, 1_000_000]),
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: sbError } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });
        if (sbError) throw sbError;
        const props: Property[] = data || [];
        setAllProperties(props);
        if (props.length > 0) {
          const prices = props.map((p) => p.price || 0);
          const range: [number, number] = [
            Math.min(...prices),
            Math.max(...prices),
          ];
          setPriceMinMax(range);
          setFilters(defaultFilters(range));
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProperties = useCallback(() => {
    let list = [...allProperties];
    if (selectedType !== "All")
      list = list.filter(
        (p) => p.property_type?.toLowerCase() === selectedType.toLowerCase(),
      );
    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(kw) ||
          p.location?.toLowerCase().includes(kw) ||
          p.description?.toLowerCase().includes(kw),
      );
    }
    if (filters.location.trim()) {
      const loc = filters.location.trim().toLowerCase();
      list = list.filter((p) => p.location?.toLowerCase().includes(loc));
    }
    if (filters.status) list = list.filter((p) => p.status === filters.status);
    if (filters.bedrooms)
      list = list.filter(
        (p) => (p.bedrooms ?? 0) >= parseInt(filters.bedrooms),
      );
    if (filters.bathrooms)
      list = list.filter(
        (p) => (p.bathrooms ?? 0) >= parseInt(filters.bathrooms),
      );
    list = list.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );
    if (filters.amenities.length > 0)
      list = list.filter((p) =>
        filters.amenities.every((a) => (p.amenities || []).includes(a)),
      );
    if (filters.minYearBuilt) {
      const minYear = parseInt(filters.minYearBuilt);
      list = list.filter(
        (p) => parseInt(p.property_details?.year_built || "0") >= minYear,
      );
    }
    if (filters.sqftMin)
      list = list.filter((p) => (p.sqft ?? 0) >= parseInt(filters.sqftMin));
    if (filters.sqftMax)
      list = list.filter((p) => (p.sqft ?? 0) <= parseInt(filters.sqftMax));
    switch (sortBy) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case "price_low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        list.sort((a, b) => b.price - a.price);
        break;
    }
    return list;
  }, [allProperties, selectedType, filters, sortBy]);

  const sortedProperties = filteredProperties();

  useEffect(() => {
    setItemOffset(0);
  }, [selectedType, filters, sortBy]);

  const pageCount = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);
  const currentItems = sortedProperties.slice(
    itemOffset,
    itemOffset + ITEMS_PER_PAGE,
  );

  const handlePageClick = ({ selected }: { selected: number }) => {
    setItemOffset(selected * ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleReset = () => {
    setFilters(defaultFilters(priceMinMax));
    setSelectedType("All");
    setSortBy("newest");
    setItemOffset(0);
  };

  return (
    <div className="buy-listing-root property-listing-seven lg-pt-100">
      {/* ── Type filter bar ── */}
      <div className="type-bar">
        <div className="wrapper">
          <div className="type-bar-inner">
            <span className="type-bar-label">Type</span>
            {PROPERTY_TYPES.map((type, i) => (
              <a
                key={i}
                href="#"
                className={`type-pill${selectedType === type ? " active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedType(type);
                }}
              >
                {type}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className="row gx-0">
          {/* ── Sidebar ── */}
          <div className="col-xxl-3 col-lg-4 order-lg-first">
            <SidebarFilters
              filters={filters}
              onChange={(partial) =>
                setFilters((prev) => ({ ...prev, ...partial }))
              }
              onReset={handleReset}
              priceMinMax={priceMinMax}
            />
          </div>

          {/* ── Main content ── */}
          <div className="col-xxl-9 col-lg-8">
            <div style={{ padding: "36px 28px 120px", maxWidth: "100%" }}>
              {/* Header bar */}
              <div className="listing-header d-sm-flex justify-content-between align-items-center">
                <div className="results-count">
                  {loading ? (
                    <span style={{ color: "var(--c-ink-3)" }}>Loading…</span>
                  ) : error ? (
                    <span style={{ color: "var(--c-accent)" }}>
                      Error: {error}
                    </span>
                  ) : (
                    <>
                      Showing{" "}
                      <strong>
                        {sortedProperties.length === 0 ? 0 : itemOffset + 1}–
                        {itemOffset + currentItems.length}
                      </strong>{" "}
                      of <strong>{sortedProperties.length}</strong> properties
                    </>
                  )}
                </div>
                <div className="sort-row xs-mt-20">
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "var(--c-ink-3)",
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    Sort by
                  </span>
                  <NiceSelect
                    className="nice-select rounded-0"
                    options={[
                      { value: "newest", text: "Newest" },
                      { value: "oldest", text: "Oldest" },
                      { value: "best_seller", text: "Best Seller" },
                      { value: "best_match", text: "Best Match" },
                      { value: "price_low", text: "Price ↑" },
                      { value: "price_high", text: "Price ↓" },
                    ]}
                    defaultCurrent={0}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSortBy(e.target.value)
                    }
                    name="sort"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center py-5">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{
                      width: "2.2rem",
                      height: "2.2rem",
                      color: "var(--c-accent)",
                      borderWidth: "2px",
                    }}
                  />
                  <p
                    className="mt-3"
                    style={{ color: "var(--c-ink-3)", fontSize: "14px" }}
                  >
                    Loading properties…
                  </p>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="text-center py-5">
                  <p style={{ color: "var(--c-accent)" }}>⚠ {error}</p>
                  <button
                    className="btn-four mt-3"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && sortedProperties.length === 0 && (
                <div className="text-center py-5">
                  <div style={{ fontSize: "2.8rem", marginBottom: "12px" }}>
                    🏠
                  </div>
                  <p
                    style={{
                      fontSize: "17px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 400,
                      color: "var(--c-ink)",
                      marginBottom: "6px",
                    }}
                  >
                    No properties found
                  </p>
                  <p style={{ color: "var(--c-ink-3)", fontSize: "13.5px" }}>
                    Try adjusting your filters or{" "}
                    <button
                      onClick={handleReset}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "var(--c-accent)",
                        fontFamily: "var(--font-body)",
                        fontSize: "13.5px",
                      }}
                    >
                      reset all
                    </button>
                  </p>
                </div>
              )}

              {/* Grid */}
              {!loading && !error && sortedProperties.length > 0 && (
                <>
                  <div className="row gx-3 gy-4">
                    {currentItems.map((item) => (
                      <div key={item.id} className="col-xxl-4 col-md-6 d-flex">
                        <PropertyCard item={item} />
                      </div>
                    ))}
                  </div>

                  {pageCount > 1 && (
                    <div className="pt-5 text-center">
                      <ReactPaginate
                        breakLabel="…"
                        nextLabel={
                          <i className="fa-regular fa-chevron-right" />
                        }
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel={
                          <i className="fa-regular fa-chevron-left" />
                        }
                        renderOnZeroPageCount={null}
                        className="pagination-refined"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyListing;

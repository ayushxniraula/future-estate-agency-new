// ============================================================
//  PriceHeatmap.tsx — Kathmandu neighborhood price intelligence
//  Design: DM Serif Display + DM Sans, matches BuyListing tokens
//  Data: Live from Supabase properties table
//  Features:
//    • Aggregates avg / min / max price per location from DB
//    • Color-coded heatmap table (green → yellow → red scale)
//    • Horizontal bar chart sorted by avg price
//    • Price per Ropani column (1 Ropani = 5476 sqft)
//    • Filter by property type / status
//    • Sort by any column
//    • Animated bar chart on load
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
import Brand from "../components/homes/home-four/Brand";
import FancyBanner from "../components/common/FancyBanner";
import FutureFooter from "../layouts/footers/FutureFooter";
import FutureHeader from "../layouts/headers/FutureHeader";
import NavMenu from "../layouts/headers/Menu/FutureNavMenu";

// ─── Supabase ─────────────────────────────────────────────────
const SUPABASE_URL = "https://wzttfewbiiakxkmgzfre.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dHRmZXdiaWlha3hrbWd6ZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY0MjksImV4cCI6MjA5NTM2MjQyOX0.-00zf6PqvccpLvBGxy4FtveqX5mCeGXJbC-ZF8ziEBk";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Types ────────────────────────────────────────────────────
interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  sqft: number | null;
  property_type: string;
  status: string;
}

interface AreaStat {
  area: string;
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPricePerRopani: number | null;
  avgSqft: number | null;
  types: string[];
}

type SortKey =
  | "area"
  | "avgPrice"
  | "minPrice"
  | "maxPrice"
  | "count"
  | "avgPricePerRopani";
type SortDir = "asc" | "desc";

// ─── Constants ────────────────────────────────────────────────
const SQFT_PER_ROPANI = 5476;

const PROPERTY_TYPES = [
  "All",
  "Apartment",
  "Villa",
  "Loft",
  "Home",
  "Flat",
  "Building",
  "Office",
];
const STATUS_OPTIONS = ["All", "For Sale", "For Rent", "Sold", "Rented"];

// ─── Helpers ──────────────────────────────────────────────────
function fmtNPR(v: number): string {
  const r = Math.round(v);
  if (r >= 10_000_000) return `रु ${(r / 10_000_000).toFixed(2)} Cr`;
  if (r >= 100_000) return `रु ${(r / 100_000).toFixed(2)} L`;
  return `रु ${r.toLocaleString("en-IN")}`;
}

function fmtShortNPR(v: number): string {
  const r = Math.round(v);
  if (r >= 10_000_000) return `${(r / 10_000_000).toFixed(1)} Cr`;
  if (r >= 100_000) return `${(r / 100_000).toFixed(1)} L`;
  return r.toLocaleString("en-IN");
}

// Normalize location string to extract area name
function normalizeArea(location: string): string {
  if (!location) return "Unknown";
  // Take the last meaningful part after comma, or first part
  const parts = location
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // Try second-to-last or last part as area
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] || "Unknown";
}

// Heat color: green (low price) → yellow → red (high price)
function heatColor(
  value: number,
  min: number,
  max: number,
): { bg: string; text: string } {
  if (max === min) return { bg: "rgba(45,122,79,0.12)", text: "#1a5c38" };
  const ratio = (value - min) / (max - min); // 0 = cheapest, 1 = most expensive
  if (ratio < 0.33) return { bg: "rgba(45,122,79,0.13)", text: "#1a5c38" };
  if (ratio < 0.55) return { bg: "rgba(45,122,79,0.07)", text: "#2d7a4f" };
  if (ratio < 0.7) return { bg: "rgba(255,193,7,0.13)", text: "#7a5f00" };
  if (ratio < 0.85) return { bg: "rgba(255,152,0,0.14)", text: "#7a3e00" };
  return { bg: "rgba(200,64,42,0.13)", text: "#8b2517" };
}

// ─── Styles ───────────────────────────────────────────────────
const HEATMAP_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

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
    --c-better:     #2d7a4f;
    --radius-card:  16px;
    --radius-sm:    10px;
    --shadow-card:  0 1px 3px rgba(26,23,21,0.06), 0 4px 16px rgba(26,23,21,0.07);
  }

  .hm-root, .hm-root * { font-family: var(--font-body); box-sizing: border-box; }

  /* ── Page ── */
  .hm-page {
    background: var(--c-surface);
    padding-bottom: 80px;
    min-height: 100vh;
  }

  /* ── Top bar ── */
  .hm-topbar {
    background: var(--c-white);
    border-bottom: 1px solid var(--c-rule);
    padding: 20px 0;
    margin-bottom: 0;
  }
  .hm-topbar__inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .hm-topbar__title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 400;
    color: var(--c-ink);
    letter-spacing: -0.2px;
    margin-bottom: 2px;
  }
  .hm-topbar__sub {
    font-size: 13px;
    color: var(--c-ink-3);
  }
  .hm-back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--c-ink-3);
    text-decoration: none;
    padding: 6px 13px;
    border-radius: 20px;
    border: 1px solid var(--c-rule);
    background: var(--c-surface);
    transition: all 0.18s;
    margin-bottom: 10px;
    display: inline-flex;
  }
  .hm-back-link:hover { border-color: var(--c-ink); color: var(--c-ink); }

  /* ── Filters ── */
  .hm-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    padding: 16px 0 4px;
  }
  .hm-filter-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-right: 2px;
  }
  .hm-pill {
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--c-ink-2);
    border: 1px solid var(--c-rule);
    background: var(--c-white);
    cursor: pointer;
    transition: all 0.16s;
    white-space: nowrap;
  }
  .hm-pill:hover { border-color: var(--c-ink); color: var(--c-ink); }
  .hm-pill.active { background: var(--c-ink); border-color: var(--c-ink); color: #fff; }

  /* ── Summary cards ── */
  .hm-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin: 28px 0 24px;
  }
  .hm-summary-card {
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: var(--radius-sm);
    padding: 16px 18px;
    box-shadow: var(--shadow-card);
  }
  .hm-summary-card__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 6px;
    display: block;
  }
  .hm-summary-card__value {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 400;
    color: var(--c-ink);
    line-height: 1.1;
  }
  .hm-summary-card__sub {
    font-size: 11.5px;
    color: var(--c-ink-3);
    margin-top: 3px;
  }

  /* ── Main layout: table + chart ── */
  .hm-main-grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 1100px) { .hm-main-grid { grid-template-columns: 1fr; } }

  /* ── Table panel ── */
  .hm-panel {
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-card);
  }
  .hm-panel__head {
    padding: 16px 20px;
    border-bottom: 1px solid var(--c-rule);
    background: var(--c-surface);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .hm-panel__title {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 400;
    color: var(--c-ink);
  }
  .hm-panel__count {
    font-size: 12px;
    color: var(--c-ink-3);
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: 20px;
    padding: 3px 10px;
  }

  /* ── Heatmap table ── */
  .hm-table-wrap { overflow-x: auto; }
  .hm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .hm-table thead th {
    background: var(--c-surface);
    padding: 11px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    text-align: left;
    border-bottom: 1px solid var(--c-rule);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    position: sticky;
    top: 0;
    z-index: 2;
    transition: color 0.16s;
  }
  .hm-table thead th:hover { color: var(--c-ink); }
  .hm-table thead th.sorted { color: var(--c-ink); }
  .hm-sort-icon {
    display: inline-block;
    margin-left: 4px;
    opacity: 0.5;
    font-size: 9px;
    vertical-align: middle;
  }
  .hm-sort-icon.active { opacity: 1; }

  .hm-table tbody tr {
    border-bottom: 1px solid var(--c-rule);
    transition: background 0.14s;
  }
  .hm-table tbody tr:last-child { border-bottom: none; }
  .hm-table tbody tr:hover td { background: rgba(26,23,21,0.025) !important; }

  .hm-table td {
    padding: 12px 16px;
    vertical-align: middle;
    white-space: nowrap;
  }

  /* area name cell */
  .hm-area-cell {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 140px;
  }
  .hm-area-rank {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: var(--c-ink-3);
    flex-shrink: 0;
  }
  .hm-area-rank.top { background: var(--c-ink); border-color: var(--c-ink); color: #fff; }
  .hm-area-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--c-ink);
  }

  /* count badge */
  .hm-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 22px;
    padding: 0 7px;
    border-radius: 11px;
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    font-size: 11px;
    font-weight: 700;
    color: var(--c-ink-2);
  }

  /* type pills in table */
  .hm-type-pills {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    max-width: 140px;
  }
  .hm-type-pill {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 6px;
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    color: var(--c-ink-3);
    white-space: nowrap;
  }

  /* ── Chart panel ── */
  .hm-chart-panel {
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    position: sticky;
    top: 20px;
  }
  .hm-chart-inner { padding: 20px; }
  .hm-chart-title {
    font-family: var(--font-display);
    font-size: 16px;
    color: var(--c-ink);
    margin-bottom: 4px;
  }
  .hm-chart-sub {
    font-size: 12px;
    color: var(--c-ink-3);
    margin-bottom: 20px;
  }

  /* Bar chart */
  .hm-bar-list { display: flex; flex-direction: column; gap: 9px; }
  .hm-bar-row { display: flex; flex-direction: column; gap: 3px; }
  .hm-bar-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }
  .hm-bar-area {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--c-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }
  .hm-bar-val {
    font-size: 12px;
    color: var(--c-ink-3);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .hm-bar-track {
    height: 8px;
    background: var(--c-surface);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--c-rule);
  }
  .hm-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.7s cubic-bezier(0.16,1,0.3,1);
    width: 0;
  }
  .hm-bar-fill.animated { width: var(--bar-width); }

  /* ── Legend ── */
  .hm-legend {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding: 14px 20px;
    border-top: 1px solid var(--c-rule);
    background: var(--c-surface);
  }
  .hm-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--c-ink-3);
  }
  .hm-legend-dot {
    width: 10px; height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  /* ── Empty / Loading ── */
  .hm-empty {
    padding: 60px 20px;
    text-align: center;
    color: var(--c-ink-3);
  }
  .hm-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .hm-empty-title {
    font-family: var(--font-display);
    font-size: 18px;
    color: var(--c-ink);
    margin-bottom: 6px;
  }
  .hm-empty-sub { font-size: 13.5px; color: var(--c-ink-3); }
`;

function injectHeatmapStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("heatmap-styles")
  ) {
    const el = document.createElement("style");
    el.id = "heatmap-styles";
    el.textContent = HEATMAP_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Bar color by rank ────────────────────────────────────────
function barColor(ratio: number): string {
  if (ratio < 0.33) return "#2d7a4f";
  if (ratio < 0.55) return "#5aab78";
  if (ratio < 0.7) return "#c9a000";
  if (ratio < 0.85) return "#d97706";
  return "#c8402a";
}

// ─── Sort icon ────────────────────────────────────────────────
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`hm-sort-icon${active ? " active" : ""}`}>
      {active ? (dir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────
const PriceHeatmap = () => {
  injectHeatmapStyles();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("avgPrice");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [barsAnimated, setBarsAnimated] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error: sbError } = await supabase
          .from("properties")
          .select("id, title, location, price, sqft, property_type, status")
          .order("created_at", { ascending: false });
        if (sbError) throw sbError;
        setAllProperties((data as Property[]) || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
        setTimeout(() => setBarsAnimated(true), 120);
      }
    })();
  }, []);

  // ── Filter ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allProperties.filter((p) => {
      if (typeFilter !== "All" && p.property_type !== typeFilter) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      return true;
    });
  }, [allProperties, typeFilter, statusFilter]);

  // ── Aggregate by area ─────────────────────────────────────────
  const areaStats = useMemo<AreaStat[]>(() => {
    const map = new Map<string, Property[]>();
    filtered.forEach((p) => {
      const area = normalizeArea(p.location);
      if (!map.has(area)) map.set(area, []);
      map.get(area)!.push(p);
    });

    const stats: AreaStat[] = [];
    map.forEach((props, area) => {
      const prices = props.map((p) => p.price).filter((v) => v > 0);
      if (prices.length === 0) return;
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      const sqftList = props
        .map((p) => p.sqft)
        .filter((v): v is number => v != null && v > 0);
      const avgSqft =
        sqftList.length > 0
          ? sqftList.reduce((a, b) => a + b, 0) / sqftList.length
          : null;
      const avgPricePerRopani = avgSqft
        ? (avg / avgSqft) * SQFT_PER_ROPANI
        : null;

      const types = Array.from(
        new Set(props.map((p) => p.property_type).filter(Boolean)),
      );

      stats.push({
        area,
        count: props.length,
        avgPrice: avg,
        minPrice: min,
        maxPrice: max,
        avgPricePerRopani,
        avgSqft,
        types,
      });
    });
    return stats;
  }, [filtered]);

  // ── Sort ──────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    return [...areaStats].sort((a, b) => {
      let va: number | string = a[sortKey] ?? 0;
      let vb: number | string = b[sortKey] ?? 0;
      if (sortKey === "area") {
        va = a.area.toLowerCase();
        vb = b.area.toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [areaStats, sortKey, sortDir]);

  // ── Chart data (always sorted by avgPrice desc) ───────────────
  const chartData = useMemo(() => {
    return [...areaStats].sort((a, b) => b.avgPrice - a.avgPrice).slice(0, 12);
  }, [areaStats]);

  const chartMax = chartData[0]?.avgPrice || 1;

  // ── Summary stats ─────────────────────────────────────────────
  const totalListings = filtered.length;
  const allPrices = filtered.map((p) => p.price).filter((v) => v > 0);
  const overallAvg =
    allPrices.length > 0
      ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length
      : 0;
  const overallMin = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const overallMax = allPrices.length > 0 ? Math.max(...allPrices) : 0;
  const avgMinMaxes = sorted.map((s) => s.avgPrice);
  const globalMin = Math.min(...avgMinMaxes);
  const globalMax = Math.max(...avgMinMaxes);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <Wrapper>
      <SEO pageTitle="Price Heatmap — Kathmandu Areas" />
      <NavMenu />

      {/* ── Banner ── */}
      <div className="inner-banner-three inner-banner text-center z-1 position-relative">
        <div
          className="bg-wrapper overflow-hidden position-relative z-1"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        >
          <div className="container position-relative z-2">
            <h2 className="mb-35 xl-mb-20 md-mb-10 pt-15 font-garamond text-white">
              Price Heatmap
            </h2>
            <ul className="theme-breadcrumb style-none d-inline-flex align-items-center justify-content-center position-relative z-1 bottom-line">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>/</li>
              <li>Price Heatmap</li>
            </ul>
          </div>
          <img
            src="/assets/images/shape/shape_35.svg"
            alt=""
            className="lazy-img shapes shape_01"
          />
          <img
            src="/assets/images/shape/shape_36.svg"
            alt=""
            className="lazy-img shapes shape_02"
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="hm-root hm-page">
        {/* Top bar */}
        <div className="hm-topbar">
          <div className="container">
            <div className="hm-topbar__inner">
              <div>
                <Link to="/listing_13" className="hm-back-link">
                  <i className="bi bi-arrow-left" /> Listings
                </Link>
                <div className="hm-topbar__title">
                  Kathmandu Area Price Intelligence
                </div>
                <div className="hm-topbar__sub">
                  Live avg / min / max prices aggregated from your listings ·
                  Price per Ropani included
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="hm-filters">
              <span className="hm-filter-label">Type</span>
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t}
                  className={`hm-pill${typeFilter === t ? " active" : ""}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t}
                </button>
              ))}
              <span className="hm-filter-label" style={{ marginLeft: "10px" }}>
                Status
              </span>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={`hm-pill${statusFilter === s ? " active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "28px" }}>
          {/* Loading */}
          {loading && (
            <div className="hm-empty">
              <div
                className="spinner-border"
                role="status"
                style={{
                  width: "2rem",
                  height: "2rem",
                  color: "var(--c-accent)",
                  borderWidth: "2px",
                }}
              />
              <p
                style={{
                  marginTop: "14px",
                  color: "var(--c-ink-3)",
                  fontSize: "14px",
                }}
              >
                Aggregating property prices…
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="hm-empty">
              <div className="hm-empty-icon">⚠️</div>
              <div className="hm-empty-title">Could not load data</div>
              <div className="hm-empty-sub">{error}</div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Summary cards */}
              <div className="hm-summary-grid">
                <div className="hm-summary-card">
                  <span className="hm-summary-card__label">Areas tracked</span>
                  <div className="hm-summary-card__value">{sorted.length}</div>
                  <div className="hm-summary-card__sub">neighborhoods</div>
                </div>
                <div className="hm-summary-card">
                  <span className="hm-summary-card__label">Total listings</span>
                  <div className="hm-summary-card__value">{totalListings}</div>
                  <div className="hm-summary-card__sub">properties</div>
                </div>
                <div className="hm-summary-card">
                  <span className="hm-summary-card__label">
                    Market avg price
                  </span>
                  <div
                    className="hm-summary-card__value"
                    style={{ fontSize: "17px" }}
                  >
                    {fmtNPR(overallAvg)}
                  </div>
                  <div className="hm-summary-card__sub">across all areas</div>
                </div>
                <div className="hm-summary-card">
                  <span className="hm-summary-card__label">Price range</span>
                  <div
                    className="hm-summary-card__value"
                    style={{ fontSize: "15px" }}
                  >
                    {fmtShortNPR(overallMin)} – {fmtShortNPR(overallMax)}
                  </div>
                  <div className="hm-summary-card__sub">min → max</div>
                </div>
                <div
                  className="hm-summary-card"
                  style={{ borderLeft: "3px solid var(--c-better)" }}
                >
                  <span className="hm-summary-card__label">
                    Most affordable
                  </span>
                  <div
                    className="hm-summary-card__value"
                    style={{ fontSize: "15px", color: "var(--c-better)" }}
                  >
                    {sorted.length > 0
                      ? [...sorted].sort((a, b) => a.avgPrice - b.avgPrice)[0]
                          ?.area
                      : "—"}
                  </div>
                  <div className="hm-summary-card__sub">lowest avg price</div>
                </div>
                <div
                  className="hm-summary-card"
                  style={{ borderLeft: "3px solid var(--c-accent)" }}
                >
                  <span className="hm-summary-card__label">Most premium</span>
                  <div
                    className="hm-summary-card__value"
                    style={{ fontSize: "15px", color: "var(--c-accent)" }}
                  >
                    {sorted.length > 0
                      ? [...sorted].sort((a, b) => b.avgPrice - a.avgPrice)[0]
                          ?.area
                      : "—"}
                  </div>
                  <div className="hm-summary-card__sub">highest avg price</div>
                </div>
              </div>

              {sorted.length === 0 ? (
                <div className="hm-empty">
                  <div className="hm-empty-icon">🗺️</div>
                  <div className="hm-empty-title">No data for this filter</div>
                  <div className="hm-empty-sub">
                    Try changing the type or status filter above.
                  </div>
                </div>
              ) : (
                <div className="hm-main-grid">
                  {/* ── Heatmap Table ── */}
                  <div className="hm-panel">
                    <div className="hm-panel__head">
                      <span className="hm-panel__title">
                        Price breakdown by area
                      </span>
                      <span className="hm-panel__count">
                        {sorted.length} areas
                      </span>
                    </div>
                    <div className="hm-table-wrap">
                      <table className="hm-table">
                        <thead>
                          <tr>
                            <th
                              onClick={() => handleSort("area")}
                              className={sortKey === "area" ? "sorted" : ""}
                            >
                              Area{" "}
                              <SortIcon
                                active={sortKey === "area"}
                                dir={sortDir}
                              />
                            </th>
                            <th
                              onClick={() => handleSort("count")}
                              className={sortKey === "count" ? "sorted" : ""}
                            >
                              Listings{" "}
                              <SortIcon
                                active={sortKey === "count"}
                                dir={sortDir}
                              />
                            </th>
                            <th
                              onClick={() => handleSort("avgPrice")}
                              className={sortKey === "avgPrice" ? "sorted" : ""}
                            >
                              Avg Price{" "}
                              <SortIcon
                                active={sortKey === "avgPrice"}
                                dir={sortDir}
                              />
                            </th>
                            <th
                              onClick={() => handleSort("minPrice")}
                              className={sortKey === "minPrice" ? "sorted" : ""}
                            >
                              Min Price{" "}
                              <SortIcon
                                active={sortKey === "minPrice"}
                                dir={sortDir}
                              />
                            </th>
                            <th
                              onClick={() => handleSort("maxPrice")}
                              className={sortKey === "maxPrice" ? "sorted" : ""}
                            >
                              Max Price{" "}
                              <SortIcon
                                active={sortKey === "maxPrice"}
                                dir={sortDir}
                              />
                            </th>
                            <th
                              onClick={() => handleSort("avgPricePerRopani")}
                              className={
                                sortKey === "avgPricePerRopani" ? "sorted" : ""
                              }
                            >
                              / Ropani{" "}
                              <SortIcon
                                active={sortKey === "avgPricePerRopani"}
                                dir={sortDir}
                              />
                            </th>
                            <th>Types</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sorted.map((stat, idx) => {
                            const avgHeat = heatColor(
                              stat.avgPrice,
                              globalMin,
                              globalMax,
                            );
                            const minHeat = heatColor(
                              stat.minPrice,
                              globalMin,
                              globalMax,
                            );
                            const maxHeat = heatColor(
                              stat.maxPrice,
                              globalMin,
                              globalMax,
                            );
                            const ropaniHeat = stat.avgPricePerRopani
                              ? heatColor(
                                  stat.avgPricePerRopani,
                                  Math.min(
                                    ...areaStats
                                      .filter((s) => s.avgPricePerRopani)
                                      .map((s) => s.avgPricePerRopani!),
                                  ),
                                  Math.max(
                                    ...areaStats
                                      .filter((s) => s.avgPricePerRopani)
                                      .map((s) => s.avgPricePerRopani!),
                                  ),
                                )
                              : null;

                            return (
                              <tr key={stat.area}>
                                {/* Area */}
                                <td>
                                  <div className="hm-area-cell">
                                    <span
                                      className={`hm-area-rank${idx < 3 ? " top" : ""}`}
                                    >
                                      {idx + 1}
                                    </span>
                                    <span className="hm-area-name">
                                      {stat.area}
                                    </span>
                                  </div>
                                </td>

                                {/* Count */}
                                <td>
                                  <span className="hm-count-badge">
                                    {stat.count}
                                  </span>
                                </td>

                                {/* Avg price — colored */}
                                <td style={{ background: avgHeat.bg }}>
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      fontSize: "13px",
                                      color: avgHeat.text,
                                    }}
                                  >
                                    {fmtNPR(stat.avgPrice)}
                                  </span>
                                </td>

                                {/* Min price */}
                                <td style={{ background: minHeat.bg }}>
                                  <span
                                    style={{
                                      fontSize: "12.5px",
                                      color: minHeat.text,
                                    }}
                                  >
                                    {fmtNPR(stat.minPrice)}
                                  </span>
                                </td>

                                {/* Max price */}
                                <td style={{ background: maxHeat.bg }}>
                                  <span
                                    style={{
                                      fontSize: "12.5px",
                                      color: maxHeat.text,
                                    }}
                                  >
                                    {fmtNPR(stat.maxPrice)}
                                  </span>
                                </td>

                                {/* Per Ropani */}
                                <td
                                  style={
                                    ropaniHeat
                                      ? { background: ropaniHeat.bg }
                                      : {}
                                  }
                                >
                                  {stat.avgPricePerRopani ? (
                                    <span
                                      style={{
                                        fontSize: "12.5px",
                                        color:
                                          ropaniHeat?.text ?? "var(--c-ink-2)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {fmtNPR(stat.avgPricePerRopani)}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        color: "var(--c-ink-3)",
                                        fontStyle: "italic",
                                        fontSize: "12px",
                                      }}
                                    >
                                      N/A
                                    </span>
                                  )}
                                </td>

                                {/* Types */}
                                <td>
                                  <div className="hm-type-pills">
                                    {stat.types.slice(0, 3).map((t) => (
                                      <span key={t} className="hm-type-pill">
                                        {t}
                                      </span>
                                    ))}
                                    {stat.types.length > 3 && (
                                      <span className="hm-type-pill">
                                        +{stat.types.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Legend */}
                    <div className="hm-legend">
                      <span className="hm-legend-item">
                        <span
                          className="hm-legend-dot"
                          style={{ background: "rgba(45,122,79,0.5)" }}
                        />
                        Affordable
                      </span>
                      <span className="hm-legend-item">
                        <span
                          className="hm-legend-dot"
                          style={{ background: "rgba(201,160,0,0.5)" }}
                        />
                        Mid-range
                      </span>
                      <span className="hm-legend-item">
                        <span
                          className="hm-legend-dot"
                          style={{ background: "rgba(200,64,42,0.5)" }}
                        />
                        Premium
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "11px",
                          color: "var(--c-ink-3)",
                        }}
                      >
                        Click column headers to sort
                      </span>
                    </div>
                  </div>

                  {/* ── Bar Chart ── */}
                  <div className="hm-chart-panel">
                    <div className="hm-chart-inner">
                      <div className="hm-chart-title">Avg price by area</div>
                      <div className="hm-chart-sub">
                        Top {chartData.length} areas · sorted highest → lowest
                      </div>

                      <div className="hm-bar-list">
                        {chartData.map((stat, idx) => {
                          const ratio = stat.avgPrice / chartMax;
                          const color = barColor(ratio);
                          return (
                            <div key={stat.area} className="hm-bar-row">
                              <div className="hm-bar-meta">
                                <span className="hm-bar-area" title={stat.area}>
                                  {stat.area}
                                </span>
                                <span className="hm-bar-val">
                                  {fmtShortNPR(stat.avgPrice)}
                                </span>
                              </div>
                              <div className="hm-bar-track">
                                <div
                                  className={`hm-bar-fill${barsAnimated ? " animated" : ""}`}
                                  style={
                                    {
                                      "--bar-width": `${(ratio * 100).toFixed(1)}%`,
                                      background: color,
                                      transitionDelay: `${idx * 50}ms`,
                                    } as React.CSSProperties
                                  }
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chart legend */}
                    <div
                      className="hm-legend"
                      style={{ justifyContent: "center" }}
                    >
                      <span className="hm-legend-item">
                        <span
                          className="hm-legend-dot"
                          style={{ background: "#2d7a4f" }}
                        />{" "}
                        Low
                      </span>
                      <span className="hm-legend-item">
                        <span
                          className="hm-legend-dot"
                          style={{ background: "#c9a000" }}
                        />{" "}
                        Mid
                      </span>
                      <span className="hm-legend-item">
                        <span
                          className="hm-legend-dot"
                          style={{ background: "#c8402a" }}
                        />{" "}
                        High
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Brand />
      <FancyBanner />
      <FutureFooter />
    </Wrapper>
  );
};

export default PriceHeatmap;

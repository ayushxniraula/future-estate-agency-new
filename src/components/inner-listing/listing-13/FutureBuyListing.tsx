// ============================================================
//  BuyListing.tsx — Future Work branded property listing
//  Brand colors: #252060 (navy) / #1C94A4 (teal)
//  Mobile-first responsive design
// ============================================================

import { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import { Link, useSearchParams } from "react-router-dom";
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

// Brand-toned status colors (distinct per status, within FW palette family)
function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "For Sale":
      // Deep teal – brand accent, active listing
      return { bg: "rgba(28,148,164,0.92)", text: "#fff" };
    case "For Rent":
      // Mid navy-blue, distinct from teal
      return { bg: "rgba(37,89,160,0.92)", text: "#fff" };
    case "Sold":
      // Warm olive-green (brand-adjacent earthy success)
      return { bg: "rgba(45,139,86,0.92)", text: "#fff" };
    case "Rented":
      // Amber-gold, distinct warm contrast
      return { bg: "rgba(196,130,20,0.92)", text: "#fff" };
    default:
      return { bg: "rgba(37,32,96,0.82)", text: "#fff" };
  }
}

function buildInitialFilters(
  priceRange: [number, number],
  params: URLSearchParams,
): FiltersState {
  const minPrice = Number(params.get("minPrice")) || priceRange[0];
  const maxPrice = Number(params.get("maxPrice")) || priceRange[1];
  return {
    keyword: "",
    location: params.get("location") || "",
    status: params.get("status") || "",
    bedrooms: "",
    bathrooms: "",
    priceRange: [minPrice, maxPrice],
    amenities: [],
    minYearBuilt: "",
    sqftMin: "",
    sqftMax: "",
  };
}

// ─── Future Work Global Styles ────────────────────────────────
const INJECTED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

  :root {
    /* Future Work Brand */
    --fw-navy:        #252060;
    --fw-navy-dark:   #1a1648;
    --fw-navy-light:  #2e2a7a;
    --fw-teal:        #1C94A4;
    --fw-teal-dark:   #157a88;
    --fw-teal-light:  #22afc2;
    --fw-teal-faint:  rgba(28,148,164,0.08);
    --fw-navy-faint:  rgba(37,32,96,0.06);

    /* Neutral palette */
    --c-ink:        #0f0e1a;
    --c-ink-2:      #3a3850;
    --c-ink-3:      #7a7890;
    --c-rule:       #e8e6f0;
    --c-surface:    #f7f6fb;
    --c-white:      #ffffff;

    /* Typography */
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body:    'Plus Jakarta Sans', system-ui, sans-serif;

    /* Shape */
    --radius-card:  14px;
    --radius-sm:    9px;
    --radius-pill:  100px;

    /* Shadows */
    --shadow-card:  0 1px 3px rgba(37,32,96,0.05), 0 4px 18px rgba(37,32,96,0.08);
    --shadow-hover: 0 6px 12px rgba(37,32,96,0.10), 0 20px 48px rgba(37,32,96,0.14);
    --shadow-sidebar: 2px 0 24px rgba(37,32,96,0.06);
  }

  /* ── Base ───────────────────────────────────────────── */
  .fw-listing-root, .fw-listing-root * {
    font-family: var(--font-body);
    box-sizing: border-box;
  }

  .fw-listing-root {
    background: var(--c-surface);
    min-height: 100vh;
  }

  /* ── Type Filter Bar ─────────────────────────────── */
  .fw-type-bar {
    background: var(--fw-navy);
    border-bottom: none;
    padding: 0 20px;
    position: sticky;
    top: 0;
    z-index: 40;
    box-shadow: 0 2px 16px rgba(37,32,96,0.18);
  }

  .fw-type-bar-inner {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 0;
    overflow-x: auto;
    scrollbar-width: none;
    flex-wrap: nowrap;
  }
  .fw-type-bar-inner::-webkit-scrollbar { display: none; }

  .fw-type-bar-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-right: 8px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .fw-type-pill {
    padding: 5px 14px;
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.65);
    text-decoration: none;
    border: 1.5px solid rgba(255,255,255,0.15);
    transition: all 0.18s ease;
    white-space: nowrap;
    background: transparent;
    letter-spacing: 0.2px;
    flex-shrink: 0;
  }
  .fw-type-pill:hover {
    border-color: var(--fw-teal);
    color: var(--fw-teal-light);
    background: rgba(28,148,164,0.10);
  }
  .fw-type-pill.active {
    background: var(--fw-teal);
    border-color: var(--fw-teal);
    color: #fff;
    box-shadow: 0 2px 12px rgba(28,148,164,0.35);
  }

  /* ── Layout ──────────────────────────────────────── */
  .fw-layout {
    display: flex;
    min-height: calc(100vh - 50px);
    position: relative;
  }

  /* ── Mobile sidebar overlay ─────────────────────── */
  .fw-sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(15,14,26,0.55);
    z-index: 100;
    backdrop-filter: blur(3px);
  }
  .fw-sidebar-overlay.open { display: block; }

  /* ── Sidebar ─────────────────────────────────────── */
  .fw-sidebar {
    width: 288px;
    flex-shrink: 0;
    background: var(--c-white);
    border-right: 1px solid var(--c-rule);
    box-shadow: var(--shadow-sidebar);
    position: sticky;
    top: 50px;
    height: calc(100vh - 50px);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--c-rule) transparent;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1);
    z-index: 50;
  }
  .fw-sidebar::-webkit-scrollbar { width: 4px; }
  .fw-sidebar::-webkit-scrollbar-track { background: transparent; }
  .fw-sidebar::-webkit-scrollbar-thumb { background: var(--c-rule); border-radius: 4px; }

  /* Mobile sidebar — off-canvas */
  @media (max-width: 991px) {
    .fw-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      transform: translateX(-100%);
      z-index: 110;
    }
    .fw-sidebar.mobile-open { transform: translateX(0); }
    .fw-layout { display: block; }
  }

  .fw-sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 22px 0;
    margin-bottom: 20px;
  }
  .fw-sidebar__title {
    font-family: var(--font-display);
    font-size: 19px;
    font-weight: 400;
    color: var(--fw-navy);
    letter-spacing: -0.2px;
  }
  .fw-sidebar__close {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: var(--c-ink-3);
    padding: 2px;
    line-height: 1;
  }
  @media (max-width: 991px) { .fw-sidebar__close { display: flex; align-items: center; } }

  .fw-sidebar-body { padding: 0 22px 32px; }

  .fw-sidebar-section {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--c-rule);
  }
  .fw-sidebar-section:last-of-type { border-bottom: none; }

  .fw-sidebar-label {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    color: var(--fw-teal);
    margin-bottom: 9px;
    display: block;
  }

  .fw-sidebar-input {
    width: 100%;
    padding: 9px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    font-size: 13px;
    font-family: var(--font-body);
    color: var(--c-ink);
    background: var(--c-surface);
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }
  .fw-sidebar-input:focus {
    border-color: var(--fw-teal);
    background: var(--c-white);
    box-shadow: 0 0 0 3px rgba(28,148,164,0.12);
  }

  .fw-amenity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }
  .fw-amenity-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: var(--c-ink-2);
    cursor: pointer;
    padding: 5px 0;
    font-family: var(--font-body);
    transition: color 0.15s;
  }
  .fw-amenity-item:hover { color: var(--fw-teal); }
  .fw-amenity-item input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: var(--fw-teal);
    cursor: pointer;
    flex-shrink: 0;
  }

  .fw-reset-btn {
    width: 100%;
    padding: 10px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--fw-navy);
    background: transparent;
    font-size: 12.5px;
    font-weight: 700;
    font-family: var(--font-body);
    color: var(--fw-navy);
    cursor: pointer;
    letter-spacing: 0.4px;
    transition: all 0.2s;
    text-transform: uppercase;
  }
  .fw-reset-btn:hover {
    background: var(--fw-navy);
    color: #fff;
  }

  /* ── Mobile filter toggle btn ────────────────────── */
  .fw-filter-toggle {
    display: none;
    align-items: center;
    gap: 7px;
    padding: 8px 18px;
    border-radius: var(--radius-pill);
    border: 1.5px solid var(--fw-navy);
    background: var(--c-white);
    color: var(--fw-navy);
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-body);
    cursor: pointer;
    letter-spacing: 0.2px;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .fw-filter-toggle:hover { background: var(--fw-navy); color: #fff; }
  @media (max-width: 991px) { .fw-filter-toggle { display: flex; } }

  /* ── Main content area ───────────────────────────── */
  .fw-main {
    flex: 1;
    min-width: 0;
    padding: 28px 24px 100px;
  }
  @media (max-width: 767px) { .fw-main { padding: 20px 16px 80px; } }

  /* ── Active filter pills ─────────────────────────── */
  .fw-active-filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 16px;
    align-items: center;
  }
  .fw-active-bar-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: var(--c-ink-3);
  }
  .fw-active-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    border-radius: var(--radius-pill);
    font-size: 11.5px;
    font-weight: 700;
    background: var(--fw-navy);
    color: #fff;
    border: none;
    cursor: default;
    letter-spacing: 0.1px;
  }
  .fw-active-pill__x {
    font-size: 11px;
    opacity: 0.6;
    cursor: pointer;
    line-height: 1;
    transition: opacity 0.15s;
  }
  .fw-active-pill__x:hover { opacity: 1; }
  .fw-clear-all {
    font-size: 11px;
    font-weight: 700;
    color: var(--fw-teal);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: var(--font-body);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    transition: color 0.18s;
  }
  .fw-clear-all:hover { color: var(--fw-teal-dark); }

  /* ── Listing header bar ──────────────────────────── */
  .fw-listing-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--c-white);
    border-radius: var(--radius-card);
    padding: 12px 18px;
    border: 1.5px solid var(--c-rule);
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  @media (max-width: 576px) {
    .fw-listing-header { padding: 10px 14px; gap: 8px; }
  }

  .fw-header-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .fw-results-count {
    font-size: 13px;
    color: var(--c-ink-3);
    font-family: var(--font-body);
  }
  .fw-results-count strong { color: var(--fw-navy); font-weight: 700; }

  .fw-sort-row { display: flex; align-items: center; gap: 8px; }
  .fw-sort-label {
    font-size: 11.5px;
    color: var(--c-ink-3);
    font-weight: 600;
    white-space: nowrap;
  }

  /* ── Property card ───────────────────────────────── */
  .fw-prop-card {
    border-radius: var(--radius-card);
    overflow: hidden;
    background: var(--c-white);
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.28s ease, transform 0.28s ease;
    border: 1.5px solid var(--c-rule);
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .fw-prop-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-5px);
  }

  /* Image wrap */
  .fw-prop-card__img-wrap { position: relative; overflow: hidden; }
  .fw-prop-card__img-wrap img { transition: transform 0.45s ease; display: block; }
  .fw-prop-card:hover .fw-prop-card__img-wrap img { transform: scale(1.05); }

  /* Status badge */
  .fw-prop-card__badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 3px 10px;
    border-radius: var(--radius-pill);
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    z-index: 3;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    line-height: 1.6;
  }

  /* Fav button */
  .fw-prop-card__fav {
    position: absolute;
    top: 11px;
    right: 11px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    color: #aaa;
    transition: background 0.2s, color 0.2s, transform 0.2s;
    text-decoration: none;
    box-shadow: 0 2px 10px rgba(37,32,96,0.14);
  }
  .fw-prop-card__fav:hover {
    background: var(--fw-teal);
    color: #fff;
    transform: scale(1.12);
  }

  /* Card body */
  .fw-prop-card__body {
    padding: 18px 20px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .fw-prop-card__type {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--fw-teal);
    margin-bottom: 5px;
  }
  .fw-prop-card__title {
    font-family: var(--font-display);
    font-size: 16.5px;
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
  .fw-prop-card__title:hover { color: var(--fw-teal); }

  .fw-prop-card__location {
    font-size: 12px;
    color: var(--c-ink-3);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fw-prop-card__divider {
    height: 1px;
    background: var(--c-rule);
    margin: 0 -20px 12px;
  }

  .fw-prop-card__features { display: flex; gap: 5px; flex-wrap: wrap; }
  .fw-prop-card__feat {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--fw-teal-faint);
    border-radius: 7px;
    padding: 4px 9px;
    font-size: 11.5px;
    color: var(--fw-navy);
    font-weight: 600;
    border: 1px solid rgba(28,148,164,0.15);
  }
  .fw-prop-card__feat img { width: 12px; height: 12px; opacity: 0.55; }

  /* Card footer */
  .fw-prop-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 16px;
    margin-top: auto;
    border-top: 1px solid var(--c-rule);
  }
  .fw-prop-card__price {
    font-family: var(--font-display);
    font-size: 21px;
    font-weight: 400;
    color: var(--fw-navy);
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .fw-prop-card__price sup {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    color: var(--fw-teal);
    vertical-align: super;
    margin-right: 1px;
  }
  .fw-prop-card__price sub {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 400;
    color: var(--c-ink-3);
  }

  .fw-prop-card__arrow {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--fw-navy);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-decoration: none;
    transition: background 0.2s, transform 0.25s;
    font-size: 13px;
    flex-shrink: 0;
  }
  .fw-prop-card__arrow:hover {
    background: var(--fw-teal);
    transform: rotate(45deg);
  }

  /* ── Carousel dot ────────────────────────────────── */
  .fw-carousel-dot { transition: all 0.22s ease; }

  /* ── Price Range Slider ──────────────────────────── */
  .fw-slider-wrap input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
  }
  .fw-slider-wrap input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--fw-navy);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 6px rgba(37,32,96,0.25);
  }
  .fw-slider-wrap input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--fw-navy);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 6px rgba(37,32,96,0.25);
  }

  /* ── Pagination ──────────────────────────────────── */
  .fw-pagination {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
    justify-content: center;
  }
  .fw-pagination li a,
  .fw-pagination li span {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 13px;
    font-family: var(--font-body);
    font-weight: 600;
    color: var(--c-ink-2);
    border: 1.5px solid transparent;
    transition: all 0.18s;
    text-decoration: none;
    cursor: pointer;
  }
  .fw-pagination li a:hover {
    border-color: var(--fw-navy);
    color: var(--fw-navy);
    background: var(--fw-navy-faint);
  }
  .fw-pagination li.selected a {
    background: var(--fw-navy);
    color: #fff;
    border-color: var(--fw-navy);
  }
  .fw-pagination li.disabled span { opacity: 0.3; cursor: default; }
  .fw-pagination li.previous a,
  .fw-pagination li.next a {
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
    color: var(--fw-navy);
  }
  .fw-pagination li.previous a:hover,
  .fw-pagination li.next a:hover {
    border-color: var(--fw-teal);
    background: var(--fw-teal);
    color: #fff;
  }
  .fw-pagination li.previous.disabled a,
  .fw-pagination li.next.disabled a { opacity: 0.3; pointer-events: none; }

  /* ── Empty / Error states ────────────────────────── */
  .fw-state-box {
    text-align: center;
    padding: 60px 20px;
  }
  .fw-state-icon { font-size: 3rem; margin-bottom: 14px; }
  .fw-state-title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 400;
    color: var(--fw-navy);
    margin-bottom: 8px;
  }
  .fw-state-sub { color: var(--c-ink-3); font-size: 13.5px; }

  /* ── Card grid ───────────────────────────────────── */
  .fw-card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
  @media (max-width: 1280px) { .fw-card-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .fw-card-grid { grid-template-columns: 1fr; } }

  /* ── Loading spinner ─────────────────────────────── */
  .fw-spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--c-rule);
    border-top-color: var(--fw-teal);
    border-radius: 50%;
    animation: fw-spin 0.8s linear infinite;
    margin: 0 auto 14px;
  }
  @keyframes fw-spin { to { transform: rotate(360deg); } }

  /* ── Responsive padding for listing root ─────────── */
  @media (max-width: 767px) {
    .fw-type-bar { padding: 0 14px; }
    .fw-type-bar-label { display: none; }
  }
`;

function injectStyle() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-listing-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-listing-styles";
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
          height: "210px",
          background: "linear-gradient(135deg, #f0eef8 0%, #e8f5f7 100%)",
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
    <div style={{ position: "relative", overflow: "hidden", height: "210px" }}>
      <img
        src={images[current]}
        alt={title}
        style={{
          width: "100%",
          height: "210px",
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
                className="fw-carousel-dot"
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
    background: "rgba(37,32,96,0.45)",
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
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  return (
    <div className="fw-slider-wrap">
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
            background: "var(--fw-teal-faint)",
            padding: "3px 9px",
            borderRadius: "8px",
            color: "var(--fw-navy)",
            fontWeight: 700,
            border: "1px solid rgba(28,148,164,0.2)",
            fontFamily: "var(--font-body)",
          }}
        >
          {fmt(value[0])}
        </span>
        <span
          style={{
            background: "var(--fw-teal-faint)",
            padding: "3px 9px",
            borderRadius: "8px",
            color: "var(--fw-navy)",
            fontWeight: 700,
            border: "1px solid rgba(28,148,164,0.2)",
            fontFamily: "var(--font-body)",
          }}
        >
          {fmt(value[1])}
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
            background: "var(--fw-teal)",
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

// ─── Sidebar Filters ──────────────────────────────────────────
function SidebarFilters({
  filters,
  onChange,
  onReset,
  priceMinMax,
  onClose,
}: {
  filters: FiltersState;
  onChange: (p: Partial<FiltersState>) => void;
  onReset: () => void;
  priceMinMax: [number, number];
  onClose?: () => void;
}) {
  const toggleAmenity = (a: string) => {
    const next = filters.amenities.includes(a)
      ? filters.amenities.filter((x) => x !== a)
      : [...filters.amenities, a];
    onChange({ amenities: next });
  };

  return (
    <>
      <div className="fw-sidebar__header">
        <span className="fw-sidebar__title">Filters</span>
        <button
          className="fw-sidebar__close"
          onClick={onClose}
          aria-label="Close filters"
        >
          ✕
        </button>
      </div>
      <div className="fw-sidebar-body">
        <div className="fw-sidebar-section">
          <span className="fw-sidebar-label">Listing Type</span>
          <select
            className="fw-sidebar-input"
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

        <div className="fw-sidebar-section">
          <span className="fw-sidebar-label">Keyword</span>
          <input
            type="text"
            className="fw-sidebar-input"
            placeholder="e.g. home, villa…"
            value={filters.keyword}
            onChange={(e) => onChange({ keyword: e.target.value })}
          />
        </div>

        <div className="fw-sidebar-section">
          <span className="fw-sidebar-label">Location</span>
          <input
            type="text"
            className="fw-sidebar-input"
            placeholder="City or address…"
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </div>

        <div className="fw-sidebar-section">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <span className="fw-sidebar-label">Bedrooms</span>
              <select
                className="fw-sidebar-input"
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
              <span className="fw-sidebar-label">Bathrooms</span>
              <select
                className="fw-sidebar-input"
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

        <div className="fw-sidebar-section">
          <span className="fw-sidebar-label">Amenities</span>
          <div className="fw-amenity-grid">
            {AMENITY_OPTIONS.map((a) => (
              <label key={a} className="fw-amenity-item">
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

        <div className="fw-sidebar-section">
          <span className="fw-sidebar-label">Price Range</span>
          <PriceRangeSlider
            min={priceMinMax[0]}
            max={priceMinMax[1]}
            value={filters.priceRange}
            onChange={(v) => onChange({ priceRange: v })}
          />
        </div>

        <div className="fw-sidebar-section">
          <span className="fw-sidebar-label">Min Year Built</span>
          <select
            className="fw-sidebar-input"
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

        <div className="fw-sidebar-section">
          <span className="fw-sidebar-label">Square Footage</span>
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
              className="fw-sidebar-input"
              value={filters.sqftMin}
              onChange={(e) => onChange({ sqftMin: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max sqft"
              className="fw-sidebar-input"
              value={filters.sqftMax}
              onChange={(e) => onChange({ sqftMax: e.target.value })}
            />
          </div>
        </div>

        <button className="fw-reset-btn" onClick={onReset}>
          Reset All Filters
        </button>
      </div>
    </>
  );
}

// ─── Property Card ────────────────────────────────────────────
function PropertyCard({ item }: { item: Property }) {
  const badge = getStatusColor(item.status);
  return (
    <div className="fw-prop-card">
      <div className="fw-prop-card__img-wrap">
        <div style={{ position: "relative" }}>
          <span
            className="fw-prop-card__badge"
            style={{ background: badge.bg, color: badge.text }}
          >
            {getStatusLabel(item.status)}
          </span>
          <Link to="#" className="fw-prop-card__fav">
            <i className="fa-light fa-heart" style={{ fontSize: "13px" }} />
          </Link>
          <CarouselOrImage images={item.images || []} title={item.title} />
        </div>
      </div>
      <div className="fw-prop-card__body">
        {item.property_type && (
          <div className="fw-prop-card__type">{item.property_type}</div>
        )}
        <Link to={`/buy/${item.id}`} className="fw-prop-card__title">
          {item.title}
        </Link>
        <div className="fw-prop-card__location">
          <svg
            width="10"
            height="12"
            viewBox="0 0 11 13"
            fill="none"
            style={{ flexShrink: 0, color: "var(--fw-teal)" }}
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
            <div className="fw-prop-card__divider" />
            <div className="fw-prop-card__features">
              {item.sqft && (
                <div className="fw-prop-card__feat">
                  <img src="/assets/images/icon/icon_32.svg" alt="" />
                  <span>{item.sqft.toLocaleString()} ft²</span>
                </div>
              )}
              {item.bedrooms != null && (
                <div className="fw-prop-card__feat">
                  <img src="/assets/images/icon/icon_33.svg" alt="" />
                  <span>{item.bedrooms} bed</span>
                </div>
              )}
              {item.bathrooms != null && (
                <div className="fw-prop-card__feat">
                  <img src="/assets/images/icon/icon_34.svg" alt="" />
                  <span>{item.bathrooms} bath</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="fw-prop-card__footer">
        <div className="fw-prop-card__price">
          <sup>$</sup>
          {item.price.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          {item.status === "For Rent" && <sub> / mo</sub>}
        </div>
        <Link to={`/buy/${item.id}`} className="fw-prop-card__arrow">
          <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const BuyListing = () => {
  injectStyle();

  const [searchParams] = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [itemOffset, setItemOffset] = useState(0);
  const [priceMinMax, setPriceMinMax] = useState<[number, number]>([
    0, 1_000_000,
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    keyword: "",
    location: "",
    status: "",
    bedrooms: "",
    bathrooms: "",
    priceRange: [0, 1_000_000],
    amenities: [],
    minYearBuilt: "",
    sqftMin: "",
    sqftMax: "",
  });

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 992) setSidebarOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

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
          setFilters(buildInitialFilters(range, searchParams));
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setFilters({
      keyword: "",
      location: "",
      status: "",
      bedrooms: "",
      bathrooms: "",
      priceRange: priceMinMax,
      amenities: [],
      minYearBuilt: "",
      sqftMin: "",
      sqftMax: "",
    });
    setSelectedType("All");
    setSortBy("newest");
    setItemOffset(0);
    setSidebarOpen(false);
  };

  // URL-sourced active filter pills
  const urlStatus = searchParams.get("status");
  const urlLocation = searchParams.get("location");
  const urlMin = searchParams.get("minPrice");
  const urlMax = searchParams.get("maxPrice");
  const activeUrlFilters: { label: string; key: string }[] = [
    ...(urlStatus ? [{ label: urlStatus, key: "status" }] : []),
    ...(urlLocation ? [{ label: `📍 ${urlLocation}`, key: "location" }] : []),
    ...(urlMin || urlMax
      ? [
          {
            label: `$${Number(urlMin || 0).toLocaleString()} – $${Number(urlMax || 0).toLocaleString()}`,
            key: "price",
          },
        ]
      : []),
  ];

  return (
    <div className="fw-listing-root property-listing-seven lg-pt-100">
      {/* ── Type Bar ── */}
      <div className="fw-type-bar">
        <div className="wrapper">
          <div className="fw-type-bar-inner">
            <span className="fw-type-bar-label">Type</span>
            {PROPERTY_TYPES.map((type, i) => (
              <a
                key={i}
                href="#"
                className={`fw-type-pill${selectedType === type ? " active" : ""}`}
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

      {/* ── Mobile overlay ── */}
      <div
        className={`fw-sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Layout ── */}
      <div className="fw-layout wrapper">
        {/* Sidebar */}
        <aside className={`fw-sidebar${sidebarOpen ? " mobile-open" : ""}`}>
          <SidebarFilters
            filters={filters}
            onChange={(partial) =>
              setFilters((prev) => ({ ...prev, ...partial }))
            }
            onReset={handleReset}
            priceMinMax={priceMinMax}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Main */}
        <main className="fw-main">
          {/* Active filter pills */}
          {activeUrlFilters.length > 0 && (
            <div className="fw-active-filter-bar">
              <span className="fw-active-bar-label">Searching:</span>
              {activeUrlFilters.map((f) => (
                <span key={f.key} className="fw-active-pill">
                  {f.label}
                  <span
                    className="fw-active-pill__x"
                    onClick={() => {
                      if (f.key === "status")
                        setFilters((p) => ({ ...p, status: "" }));
                      if (f.key === "location")
                        setFilters((p) => ({ ...p, location: "" }));
                      if (f.key === "price")
                        setFilters((p) => ({ ...p, priceRange: priceMinMax }));
                    }}
                  >
                    ✕
                  </span>
                </span>
              ))}
              <button onClick={handleReset} className="fw-clear-all">
                Clear all
              </button>
            </div>
          )}

          {/* Header bar */}
          <div className="fw-listing-header">
            <div className="fw-header-left">
              {/* Mobile filter toggle */}
              <button
                className="fw-filter-toggle"
                onClick={() => setSidebarOpen(true)}
              >
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                  <path
                    d="M0 1h14M3 6h8M5 11h4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Filters
                {(filters.amenities.length > 0 ||
                  filters.status ||
                  filters.keyword ||
                  filters.location ||
                  filters.bedrooms ||
                  filters.bathrooms) && (
                  <span
                    style={{
                      background: "var(--fw-teal)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      fontSize: "9px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {
                      [
                        filters.amenities.length > 0,
                        filters.status,
                        filters.keyword,
                        filters.location,
                        filters.bedrooms,
                        filters.bathrooms,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>
              <div className="fw-results-count">
                {loading ? (
                  <span style={{ color: "var(--c-ink-3)" }}>Loading…</span>
                ) : error ? (
                  <span style={{ color: "#c8402a" }}>Error: {error}</span>
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
            </div>
            <div className="fw-sort-row">
              <span className="fw-sort-label">Sort by</span>
              <NiceSelect
                className="nice-select rounded-0"
                options={[
                  { value: "newest", text: "Newest" },
                  { value: "oldest", text: "Oldest" },
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
            <div className="fw-state-box">
              <div className="fw-spinner" />
              <p style={{ color: "var(--c-ink-3)", fontSize: "13.5px" }}>
                Loading properties…
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="fw-state-box">
              <div className="fw-state-icon">⚠️</div>
              <p className="fw-state-title">Something went wrong</p>
              <p className="fw-state-sub">{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "16px",
                  padding: "9px 22px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--fw-navy)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && sortedProperties.length === 0 && (
            <div className="fw-state-box">
              <div className="fw-state-icon">🏠</div>
              <p className="fw-state-title">No properties found</p>
              <p className="fw-state-sub">
                Try adjusting your filters or{" "}
                <button
                  onClick={handleReset}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "var(--fw-teal)",
                    fontFamily: "var(--font-body)",
                    fontSize: "13.5px",
                    fontWeight: 600,
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
              <div className="fw-card-grid">
                {currentItems.map((item) => (
                  <PropertyCard key={item.id} item={item} />
                ))}
              </div>
              {pageCount > 1 && (
                <div style={{ paddingTop: "40px", textAlign: "center" }}>
                  <ReactPaginate
                    breakLabel="…"
                    nextLabel={<i className="fa-regular fa-chevron-right" />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel={<i className="fa-regular fa-chevron-left" />}
                    renderOnZeroPageCount={null}
                    className="fw-pagination"
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuyListing;

// ============================================================
//  SellPropertyArea.tsx — User-facing "List Your Property" form
//  Theme: FutureWork brand — #252060 navy / #1C94A4 teal
//  Font: Plus Jakarta Sans + DM Serif Display
// ============================================================

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
// import Brand from "../components/homes/home-four/Brand";
// import FancyBanner from "../components/common/FancyBanner";
import FutureFooter from "../layouts/footers/FutureFooter";
import NavMenu from "../layouts/headers/Menu/FutureNavMenu";
import { useClientSession } from "./userclientsession";
// import LoginModal from "../modals/LoginModal";

// ─── Supabase ─────────────────────────────────────────────────
const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const STORAGE_BUCKET = "FutureState";

// ─── Types ────────────────────────────────────────────────────
interface SellFormData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_agent: boolean;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  title: string;
  property_type: string;
  status: string;
  price: string;
  location: string;
  sqft: string;
  bedrooms: string;
  bathrooms: string;
  kitchens: string;
  description: string;
  features_description: string;
  property_details: Record<string, string>;
  utility_features: Record<string, string>;
  outdoor_features: Record<string, string>;
  whats_nearby: Record<string, string>;
  amenities: string[];
}

// ─── Styles ───────────────────────────────────────────────────
const SELL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

  :root {
    --fw-navy:        #252060;
    --fw-navy-dark:   #1a1648;
    --fw-navy-faint:  rgba(37,32,96,0.06);
    --fw-navy-faint2: rgba(37,32,96,0.10);
    --fw-teal:        #1C94A4;
    --fw-teal-dark:   #157a88;
    --fw-teal-faint:  rgba(28,148,164,0.08);
    --fw-teal-border: rgba(28,148,164,0.22);
    --c-ink:          #0f0e1a;
    --c-ink-2:        #3a3850;
    --c-ink-3:        #7a7890;
    --c-rule:         #e8e6f0;
    --c-surface:      #f7f6fb;
    --c-white:        #ffffff;
    --font-display:   'DM Serif Display', Georgia, serif;
    --font-body:      'Plus Jakarta Sans', system-ui, sans-serif;
    --radius-card:    14px;
    --radius-sm:      9px;
    --shadow-card:    0 1px 3px rgba(37,32,96,0.05), 0 4px 18px rgba(37,32,96,0.08);
    --shadow-focus:   0 0 0 3px rgba(28,148,164,0.15);
  }

  .sell-root, .sell-root * {
    font-family: var(--font-body);
    box-sizing: border-box;
  }

  /* ── Page background ── */
  .sell-section {
    padding-top: 80px;
    padding-bottom: 120px;
    background: var(--c-surface);
  }

  /* ── Page heading ── */
  .sell-page-head {
    margin-bottom: 40px;
  }
  .sell-page-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: var(--fw-teal);
    margin-bottom: 10px;
  }
  .sell-page-eyebrow::before {
    content: '';
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--fw-teal);
    border-radius: 2px;
    opacity: 0.6;
  }
  .sell-page-title {
    font-family: var(--font-display);
    font-size: clamp(26px, 3.5vw, 36px);
    font-weight: 400;
    color: var(--fw-navy);
    letter-spacing: -0.4px;
    line-height: 1.2;
    margin: 0 0 8px;
  }
  .sell-page-title em { font-style: italic; color: var(--fw-teal); }
  .sell-page-sub {
    font-size: 14px;
    color: var(--c-ink-3);
    line-height: 1.7;
    margin: 0;
  }

  /* ── Two-column layout ── */
  .sell-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 28px;
    align-items: start;
  }
  @media (max-width: 991px) {
    .sell-layout { grid-template-columns: 1fr; }
    .sell-sidebar { display: none; }
  }

  /* ── Sidebar ── */
  .sell-sidebar {
    position: sticky;
    top: 96px;
    background: var(--c-white);
    border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-card);
    padding: 20px 16px;
    box-shadow: var(--shadow-card);
  }
  .sell-sidebar__label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: var(--fw-teal);
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--c-rule);
    display: block;
  }
  .sell-nav-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 11px;
    border-radius: var(--radius-sm);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--c-ink-3);
    cursor: pointer;
    transition: all 0.18s;
    margin-bottom: 2px;
    text-decoration: none;
    border: 1px solid transparent;
  }
  .sell-nav-item:hover {
    background: var(--fw-navy-faint);
    color: var(--fw-navy);
    border-color: var(--c-rule);
  }
  .sell-nav-item.active {
    background: var(--fw-navy);
    color: var(--c-white);
  }
  .sell-nav-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.4;
    flex-shrink: 0;
  }
  .sell-nav-item.active .sell-nav-dot { opacity: 1; background: var(--fw-teal); }

  /* ── Section progress indicator ── */
  .sell-progress {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--c-rule);
  }
  .sell-progress__label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 7px;
    display: flex;
    justify-content: space-between;
  }
  .sell-progress__track {
    height: 4px;
    background: var(--c-rule);
    border-radius: 3px;
    overflow: hidden;
  }
  .sell-progress__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--fw-navy), var(--fw-teal));
    border-radius: 3px;
    transition: width 0.4s ease;
  }

  /* ── Form cards ── */
  .sell-card {
    background: var(--c-white);
    border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-card);
    padding: 30px 32px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-card);
    transition: border-color 0.2s;
  }
  .sell-card:focus-within {
    border-color: var(--fw-teal-border);
  }
  @media (max-width: 600px) { .sell-card { padding: 22px 18px; } }

  .sell-card__header {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid var(--c-rule);
  }
  .sell-card__icon {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    background: var(--fw-teal-faint);
    border: 1.5px solid var(--fw-teal-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
  }
  .sell-card__title {
    font-family: var(--font-display);
    font-size: 19px;
    font-weight: 400;
    color: var(--fw-navy);
    letter-spacing: -0.2px;
    line-height: 1.2;
  }
  .sell-card__subtitle {
    font-size: 11.5px;
    color: var(--c-ink-3);
    margin-top: 2px;
  }

  /* ── Labels & inputs ── */
  .sell-label {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 6px;
  }
  .sell-label .req { color: var(--fw-teal); margin-left: 2px; }

  .sell-input,
  .sell-select,
  .sell-textarea {
    width: 100%;
    padding: 10px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    font-size: 13.5px;
    font-family: var(--font-body);
    color: var(--c-ink);
    background: var(--c-surface);
    outline: none;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    appearance: none;
    -webkit-appearance: none;
  }
  .sell-input:focus,
  .sell-select:focus,
  .sell-textarea:focus {
    border-color: var(--fw-teal);
    background: var(--c-white);
    box-shadow: var(--shadow-focus);
  }
  .sell-input::placeholder,
  .sell-textarea::placeholder { color: rgba(122,120,144,0.55); }

  .sell-textarea {
    resize: vertical;
    min-height: 110px;
    line-height: 1.65;
  }
  .sell-select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7890' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
  .sell-hint {
    font-size: 11.5px;
    color: var(--c-ink-3);
    margin-top: 5px;
  }

  /* ── Agent toggle ── */
  .agent-toggle {
    display: inline-flex;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    overflow: hidden;
    background: var(--c-surface);
  }
  .agent-toggle-btn {
    padding: 9px 22px;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-body);
    color: var(--c-ink-3);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.18s;
  }
  .agent-toggle-btn + .agent-toggle-btn {
    border-left: 1.5px solid var(--c-rule);
  }
  .agent-toggle-btn.active {
    background: var(--fw-navy);
    color: var(--c-white);
  }
  .agent-fields {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1.5px dashed var(--c-rule);
  }

  /* ── KV editor ── */
  .kv-editor { display: flex; flex-direction: column; gap: 8px; }
  .kv-row {
    display: grid;
    grid-template-columns: 1fr 1fr 32px;
    gap: 8px;
    align-items: center;
  }
  .kv-row input {
    padding: 9px 12px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    font-size: 13px;
    font-family: var(--font-body);
    color: var(--c-ink);
    background: var(--c-surface);
    outline: none;
    transition: border-color 0.18s, background 0.18s;
    width: 100%;
  }
  .kv-row input:focus {
    border-color: var(--fw-teal);
    background: var(--c-white);
    box-shadow: var(--shadow-focus);
  }
  .kv-remove {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; color: var(--c-ink-3);
    cursor: pointer;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .kv-remove:hover { border-color: #e05f5f; color: #e05f5f; background: #fff5f5; }
  .kv-add {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    border: 1.5px dashed var(--c-rule);
    background: transparent;
    color: var(--c-ink-3);
    font-size: 12.5px;
    font-family: var(--font-body);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    margin-top: 4px;
  }
  .kv-add:hover { border-color: var(--fw-teal); color: var(--fw-teal); background: var(--fw-teal-faint); }

  /* ── Amenities grid ── */
  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
  }
  .amenity-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    background: var(--c-surface);
    cursor: pointer;
    font-size: 13px;
    color: var(--c-ink-2);
    font-weight: 500;
    transition: all 0.18s;
    user-select: none;
  }
  .amenity-label:hover { border-color: var(--fw-teal-border); background: var(--fw-teal-faint); color: var(--fw-navy); }
  .amenity-label.checked {
    border-color: var(--fw-navy);
    background: var(--fw-navy);
    color: var(--c-white);
  }
  .amenity-label input { display: none; }
  .amenity-check-icon {
    width: 15px; height: 15px;
    border-radius: 4px;
    border: 1.5px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 9px;
    opacity: 0.6;
    transition: all 0.15s;
  }
  .amenity-label.checked .amenity-check-icon {
    opacity: 1;
    background: var(--fw-teal);
    border-color: var(--fw-teal);
  }

  /* ── Image uploader ── */
  .upload-zone {
    border: 2px dashed var(--c-rule);
    border-radius: var(--radius-card);
    padding: 36px 24px;
    text-align: center;
    cursor: pointer;
    background: var(--c-surface);
    transition: border-color 0.2s, background 0.2s;
  }
  .upload-zone:hover { border-color: var(--fw-teal); background: var(--fw-teal-faint); }
  .upload-zone__icon { font-size: 2rem; margin-bottom: 10px; opacity: 0.6; }
  .upload-zone__title {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 400;
    color: var(--fw-navy);
    margin-bottom: 5px;
  }
  .upload-zone__sub { font-size: 12px; color: var(--c-ink-3); }
  .img-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
    gap: 9px;
    margin-top: 16px;
  }
  .img-thumb {
    position: relative;
    border-radius: 9px;
    overflow: hidden;
    aspect-ratio: 1;
    border: 1.5px solid var(--c-rule);
  }
  .img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .img-thumb__remove {
    position: absolute; top: 5px; right: 5px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(37,32,96,0.6);
    backdrop-filter: blur(4px);
    color: #fff; border: none;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; cursor: pointer;
    transition: background 0.18s;
  }
  .img-thumb__remove:hover { background: var(--fw-teal); }

  /* ── Submit button ── */
  .sell-submit {
    width: 100%;
    padding: 15px;
    border-radius: var(--radius-sm);
    border: none;
    background: var(--fw-navy);
    color: var(--c-white);
    font-size: 14px;
    font-weight: 700;
    font-family: var(--font-body);
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    box-shadow: 0 4px 18px rgba(37,32,96,0.18);
  }
  .sell-submit:hover {
    background: var(--fw-teal);
    box-shadow: 0 6px 24px rgba(28,148,164,0.3);
  }
  .sell-submit:active { transform: scale(0.99); }
  .sell-submit:disabled { background: var(--c-ink-3); cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── Error banner ── */
  .sell-error {
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    background: rgba(28,148,164,0.06);
    border: 1.5px solid var(--fw-teal-border);
    color: var(--fw-navy);
    font-size: 13.5px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sell-error i { color: var(--fw-teal); font-size: 15px; flex-shrink: 0; }

  /* ── Success screen ── */
  .sell-success {
    text-align: center;
    padding: 80px 30px;
  }
  .sell-success__circle {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--fw-navy), var(--fw-teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.7rem;
    margin: 0 auto 26px;
    box-shadow: 0 8px 28px rgba(28,148,164,0.3);
  }
  .sell-success__title {
    font-family: var(--font-display);
    font-size: clamp(26px, 4vw, 34px);
    font-weight: 400;
    color: var(--fw-navy);
    margin-bottom: 12px;
    letter-spacing: -0.4px;
  }
  .sell-success__body {
    font-size: 14.5px;
    color: var(--c-ink-3);
    max-width: 460px;
    margin: 0 auto 28px;
    line-height: 1.75;
  }
  .sell-success__badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 14px;
    border-radius: 20px;
    background: var(--fw-teal-faint);
    border: 1.5px solid var(--fw-teal-border);
    color: var(--fw-teal-dark);
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 30px;
  }
  .sell-success__badge::before {
    content: "";
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--fw-teal);
  }
  .sell-again-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    border-radius: var(--radius-sm);
    background: var(--fw-navy);
    color: var(--c-white);
    font-size: 13.5px;
    font-weight: 600;
    font-family: var(--font-body);
    border: none; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(37,32,96,0.2);
  }
  .sell-again-btn:hover {
    background: var(--fw-teal);
    color: var(--c-white);
    box-shadow: 0 6px 22px rgba(28,148,164,0.3);
  }

  .fwc-banner {
  position: relative; overflow: hidden;
  background: #252060;
}
.fwc-banner__bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.18;
}
.fwc-banner__inner {
  position: relative; z-index: 2;
  padding: 80px 20px 72px;
  text-align: center;
}
.fwc-banner__title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(32px, 5vw, 54px);
  color: #fff; letter-spacing: -0.5px;
  margin: 0 0 18px; line-height: 1.1;
}
.fwc-banner__title em { color: #7dd8e4; font-style: italic; }
.fwc-banner__crumb {
  list-style: none; padding: 0; margin: 0;
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; color: rgba(255,255,255,0.5);
}
.fwc-banner__crumb a {
  color: rgba(255,255,255,0.65); text-decoration: none;
  transition: color 0.15s;
}
.fwc-banner__crumb a:hover { color: #7dd8e4; }
.fwc-banner__crumb li:last-child { color: rgba(255,255,255,0.35); }
`;

function injectSellStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("sell-area-styles")
  ) {
    const el = document.createElement("style");
    el.id = "sell-area-styles";
    el.textContent = SELL_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Constants ────────────────────────────────────────────────
const PROPERTY_TYPES = [
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
const STATUS_OPTIONS = ["For Sale", "For Rent"];
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

const NAV_ITEMS = [
  { id: "sec-contact", icon: "👤", label: "Your Details" },
  { id: "sec-property", icon: "🏠", label: "Property Info" },
  { id: "sec-details", icon: "📋", label: "Details" },
  { id: "sec-utility", icon: "⚡", label: "Utilities" },
  { id: "sec-outdoor", icon: "🌿", label: "Outdoor" },
  { id: "sec-nearby", icon: "📍", label: "Nearby" },
  { id: "sec-amenities", icon: "✨", label: "Amenities" },
  { id: "sec-images", icon: "🖼", label: "Images" },
];

const INITIAL_FORM: SellFormData = {
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  is_agent: false,
  agent_name: "",
  agent_phone: "",
  agent_email: "",
  title: "",
  property_type: "Apartment",
  status: "For Sale",
  price: "",
  location: "",
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  kitchens: "",
  description: "",
  features_description: "",
  property_details: { year_built: "", furnishing: "", parking: "", floors: "" },
  utility_features: { heating: "", cooling: "", water: "", electricity: "" },
  outdoor_features: { garden: "", balcony: "", garage: "", pool: "" },
  whats_nearby: { school: "", grocery: "", hospital: "", metro: "" },
  amenities: [],
};

// ─── KV Editor ───────────────────────────────────────────────
function KVEditor({
  data,
  onChange,
  placeholder,
}: {
  data: Record<string, string>;
  onChange: (d: Record<string, string>) => void;
  placeholder?: { k: string; v: string };
}) {
  const update = (oldKey: string, newKey: string, value: string) => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) {
      if (k === oldKey) {
        if (newKey.trim()) next[newKey] = value;
      } else next[k] = v;
    }
    onChange(next);
  };
  return (
    <div className="kv-editor">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="kv-row">
          <input
            value={k.replace(/_/g, " ")}
            onChange={(e) =>
              update(k, e.target.value.replace(/\s+/g, "_").toLowerCase(), v)
            }
            placeholder={placeholder?.k ?? "Field name"}
          />
          <input
            value={v}
            onChange={(e) => update(k, k, e.target.value)}
            placeholder={placeholder?.v ?? "Value"}
          />
          <button
            className="kv-remove"
            type="button"
            onClick={() => {
              const n = { ...data };
              delete n[k];
              onChange(n);
            }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="kv-add"
        type="button"
        onClick={() => onChange({ ...data, [`field_${Date.now()}`]: "" })}
      >
        <span>+</span> Add Field
      </button>
    </div>
  );
}

// ─── Image Uploader ───────────────────────────────────────────
function ImageUploader({
  label,
  subtitle,
  files,
  onChange,
  max = 8,
}: {
  label: string;
  subtitle: string;
  files: File[];
  onChange: (f: File[]) => void;
  max?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="upload-zone" onClick={() => ref.current?.click()}>
        <div className="upload-zone__icon">📷</div>
        <div className="upload-zone__title">{label}</div>
        <div className="upload-zone__sub">
          {files.length}/{max} selected · {subtitle}
        </div>
        <input
          ref={ref}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const sel = Array.from(e.target.files ?? []);
            onChange([...files, ...sel].slice(0, max));
            if (ref.current) ref.current.value = "";
          }}
        />
      </div>
      {files.length > 0 && (
        <div className="img-grid">
          {files.map((f, i) => (
            <div key={i} className="img-thumb">
              <img src={URL.createObjectURL(f)} alt={f.name} />
              <button
                className="img-thumb__remove"
                type="button"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────
function SellCard({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id?: string;
  icon: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sell-card" id={id}>
      <div className="sell-card__header">
        <div className="sell-card__icon">{icon}</div>
        <div>
          <div className="sell-card__title">{title}</div>
          {subtitle && <div className="sell-card__subtitle">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="sell-label">
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {hint && <div className="sell-hint">{hint}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const SellPropertyArea = () => {
  injectSellStyles();

  // const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [floorFiles, setFloorFiles] = useState<File[]>([]);
  const [form, setForm] = useState<SellFormData>({
    ...INITIAL_FORM,
    property_details: { ...INITIAL_FORM.property_details },
    utility_features: { ...INITIAL_FORM.utility_features },
    outdoor_features: { ...INITIAL_FORM.outdoor_features },
    whats_nearby: { ...INITIAL_FORM.whats_nearby },
    amenities: [],
  });

  const set = (key: keyof SellFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (a: string) => {
    const next = form.amenities.includes(a)
      ? form.amenities.filter((x) => x !== a)
      : [...form.amenities, a];
    set("amenities", next);
  };

  // Progress: count non-empty required fields
  const filledCount = [
    form.contact_name,
    form.contact_email,
    form.contact_phone,
    form.title,
    form.price,
    form.location,
  ].filter(Boolean).length;
  const progressPct = Math.round((filledCount / 6) * 100);

  async function uploadImages(
    files: File[],
    folder: string,
  ): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `sell-requests/${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw new Error(`Upload failed: ${upErr.message}`);
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  const handleSubmit = async () => {
    setError(null);
    if (!form.contact_name.trim()) return setError("Please enter your name.");
    if (!form.contact_email.trim()) return setError("Please enter your email.");
    if (!form.contact_phone.trim())
      return setError("Please enter your phone number.");
    if (!form.title.trim()) return setError("Please enter a property title.");
    if (!form.price.trim()) return setError("Please enter a price.");
    if (!form.location.trim()) return setError("Please enter a location.");

    setSubmitting(true);
    try {
      const imageUrls =
        imageFiles.length > 0 ? await uploadImages(imageFiles, "images") : [];
      const floorUrls =
        floorFiles.length > 0
          ? await uploadImages(floorFiles, "floor-plans")
          : [];
      const cleanKV = (obj: Record<string, string>) =>
        Object.fromEntries(
          Object.entries(obj).filter(([k, v]) => k.trim() && v.trim()),
        );

      // Agent info is entirely optional — only included if "Yes" was
      // selected, and only non-empty sub-fields are kept.
      const agentPayload = form.is_agent
        ? cleanKV({
            agent_name: form.agent_name,
            agent_phone: form.agent_phone,
            agent_email: form.agent_email,
          })
        : {};
      const agentJson = { is_agent: form.is_agent, ...agentPayload };

      const { error: dbErr } = await supabase.from("sell_requests").insert([
        {
          contact_name: form.contact_name.trim(),
          contact_email: form.contact_email.trim(),
          contact_phone: form.contact_phone.trim(),
          agent: agentJson,
          title: form.title.trim(),
          property_type: form.property_type,
          status: form.status,
          price: parseFloat(form.price.replace(/,/g, "")) || 0,
          location: form.location.trim(),
          sqft: form.sqft ? parseInt(form.sqft) : null,
          bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
          bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
          kitchens: form.kitchens ? parseInt(form.kitchens) : null,
          description: form.description.trim() || null,
          features_description: form.features_description.trim() || null,
          property_details: cleanKV(form.property_details),
          utility_features: cleanKV(form.utility_features),
          outdoor_features: cleanKV(form.outdoor_features),
          whats_nearby: cleanKV(form.whats_nearby),
          amenities: form.amenities,
          images: imageUrls,
          floor_plans: floorUrls,
          review_status: "pending",
        },
      ]);

      if (dbErr) throw new Error(dbErr.message);
      setStep("success");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <SEO pageTitle="List Your Property – Sell or Rent" />
      <NavMenu session={session} />
      {/* <NavMenu onLoginClick={() => setLoginModal(true)} session={session} /> */}
      {/* <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} /> */}

      {/* ── Banner ── */}
      <div className="fwc-banner">
        <div
          className="fwc-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwc-banner__inner">
          <h2 className="fwc-banner__title">
            Sell <em>Property</em>
          </h2>
          <ul className="fwc-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Sell Property</li>
          </ul>
        </div>
      </div>

      {/* ── Form section ── */}
      <div className="sell-root sell-section">
        <div className="container">
          {/* Page heading */}
          {step === "form" && (
            <div className="sell-page-head">
              <div className="sell-page-eyebrow">New Listing</div>
              <h1 className="sell-page-title">
                List your <em>property</em>
              </h1>
              <p className="sell-page-sub">
                Fill in the details below and our team will review and publish
                your listing within 24–48 hours.
              </p>
            </div>
          )}

          {step === "success" ? (
            <div className="sell-card">
              <div className="sell-success">
                <div className="sell-success__circle">✓</div>
                <div className="sell-success__title">Listing Submitted!</div>
                <p className="sell-success__body">
                  Thank you! Your property has been submitted for review. Our
                  team will contact you at <strong>{form.contact_email}</strong>{" "}
                  or <strong>{form.contact_phone}</strong> within 24–48 hours.
                </p>
                <div className="sell-success__badge">Pending Review</div>
                <br />
                <button
                  className="sell-again-btn"
                  onClick={() => {
                    setStep("form");
                    setForm({
                      ...INITIAL_FORM,
                      property_details: { ...INITIAL_FORM.property_details },
                      utility_features: { ...INITIAL_FORM.utility_features },
                      outdoor_features: { ...INITIAL_FORM.outdoor_features },
                      whats_nearby: { ...INITIAL_FORM.whats_nearby },
                      amenities: [],
                    });
                    setImageFiles([]);
                    setFloorFiles([]);
                  }}
                >
                  Submit Another Property
                </button>
              </div>
            </div>
          ) : (
            <div className="sell-layout">
              {/* ── Sticky sidebar ── */}
              <aside className="sell-sidebar">
                <span className="sell-sidebar__label">Sections</span>
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="sell-nav-item"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <span className="sell-nav-dot" />
                    {item.label}
                  </a>
                ))}

                {/* Progress */}
                <div className="sell-progress">
                  <div className="sell-progress__label">
                    <span>Required fields</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="sell-progress__track">
                    <div
                      className="sell-progress__fill"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </aside>

              {/* ── Form cards ── */}
              <div>
                {/* Contact */}
                <SellCard
                  id="sec-contact"
                  icon="👤"
                  title="Your Contact Information"
                  subtitle="We'll reach out at these details after review"
                >
                  <div className="row g-3">
                    <div className="col-md-4">
                      <Field label="Full Name" required>
                        <input
                          className="sell-input"
                          placeholder="e.g. Aarav Sharma"
                          value={form.contact_name}
                          onChange={(e) => set("contact_name", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <Field label="Email Address" required>
                        <input
                          type="email"
                          className="sell-input"
                          placeholder="you@example.com"
                          value={form.contact_email}
                          onChange={(e) => set("contact_email", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <Field label="Phone Number" required>
                        <input
                          type="tel"
                          className="sell-input"
                          placeholder="+977 98XXXXXXXX"
                          value={form.contact_phone}
                          onChange={(e) => set("contact_phone", e.target.value)}
                        />
                      </Field>
                    </div>

                    <div className="col-12">
                      <Field label="Are you an owner or agent?">
                        <div className="agent-toggle">
                          <button
                            type="button"
                            className={`agent-toggle-btn${
                              !form.is_agent ? " active" : ""
                            }`}
                            onClick={() => set("is_agent", false)}
                          >
                            Owner
                          </button>
                          <button
                            type="button"
                            className={`agent-toggle-btn${
                              form.is_agent ? " active" : ""
                            }`}
                            onClick={() => set("is_agent", true)}
                          >
                            Agent
                          </button>
                        </div>
                      </Field>

                      {form.is_agent && (
                        <div className="agent-fields row g-3">
                          <div className="col-md-4">
                            <Field label="Agent Name">
                              <input
                                className="sell-input"
                                placeholder="e.g. Sujan Rai"
                                value={form.agent_name}
                                onChange={(e) =>
                                  set("agent_name", e.target.value)
                                }
                              />
                            </Field>
                          </div>
                          <div className="col-md-4">
                            <Field label="Agent Phone">
                              <input
                                type="tel"
                                className="sell-input"
                                placeholder="+977 98XXXXXXXX"
                                value={form.agent_phone}
                                onChange={(e) =>
                                  set("agent_phone", e.target.value)
                                }
                              />
                            </Field>
                          </div>
                          <div className="col-md-4">
                            <Field label="Agent Email">
                              <input
                                type="email"
                                className="sell-input"
                                placeholder="agent@example.com"
                                value={form.agent_email}
                                onChange={(e) =>
                                  set("agent_email", e.target.value)
                                }
                              />
                            </Field>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SellCard>

                {/* Property Info */}
                <SellCard
                  id="sec-property"
                  icon="🏠"
                  title="Property Information"
                  subtitle="Core details shown to buyers and renters"
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <Field label="Property Title" required>
                        <input
                          className="sell-input"
                          placeholder="e.g. Modern 3-Bedroom Apartment in Thamel, Kathmandu"
                          value={form.title}
                          onChange={(e) => set("title", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <Field label="Property Type">
                        <select
                          className="sell-select"
                          value={form.property_type}
                          onChange={(e) => set("property_type", e.target.value)}
                        >
                          {PROPERTY_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <Field label="Listing Type">
                        <select
                          className="sell-select"
                          value={form.status}
                          onChange={(e) => set("status", e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <Field
                        label="Price (NPR / USD)"
                        required
                        hint={
                          form.status === "For Rent"
                            ? "Monthly rent amount"
                            : "Asking price"
                        }
                      >
                        <input
                          className="sell-input"
                          placeholder="e.g. 450000"
                          value={form.price}
                          onChange={(e) => set("price", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Location / Address" required>
                        <input
                          className="sell-input"
                          placeholder="e.g. Lazimpat, Kathmandu, Nepal"
                          value={form.location}
                          onChange={(e) => set("location", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-3">
                      <Field label="Area (sqft)">
                        <input
                          className="sell-input"
                          placeholder="e.g. 1200"
                          value={form.sqft}
                          onChange={(e) => set("sqft", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-3">
                      <Field label="Bedrooms">
                        <select
                          className="sell-select"
                          value={form.bedrooms}
                          onChange={(e) => set("bedrooms", e.target.value)}
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="col-md-3">
                      <Field label="Bathrooms">
                        <select
                          className="sell-select"
                          value={form.bathrooms}
                          onChange={(e) => set("bathrooms", e.target.value)}
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="col-md-3">
                      <Field label="Kitchens">
                        <select
                          className="sell-select"
                          value={form.kitchens}
                          onChange={(e) => set("kitchens", e.target.value)}
                        >
                          <option value="">Select</option>
                          {[1, 2, 3].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Description">
                        <textarea
                          className="sell-textarea"
                          placeholder="Describe the property — layout, condition, unique features, views…"
                          value={form.description}
                          onChange={(e) => set("description", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Features Description">
                        <textarea
                          className="sell-textarea"
                          style={{ minHeight: "80px" }}
                          placeholder="Briefly describe standout features like renovations, premium finishes…"
                          value={form.features_description}
                          onChange={(e) =>
                            set("features_description", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>
                </SellCard>

                {/* Property Details KV */}
                <SellCard
                  id="sec-details"
                  icon="📋"
                  title="Property Details"
                  subtitle="Year built, furnishing, parking, floors, etc."
                >
                  <KVEditor
                    data={form.property_details}
                    onChange={(d) => set("property_details", d)}
                    placeholder={{ k: "e.g. year_built", v: "e.g. 2019" }}
                  />
                </SellCard>

                {/* Utility */}
                <SellCard
                  id="sec-utility"
                  icon="⚡"
                  title="Utility & Home Features"
                  subtitle="Heating, cooling, water supply, electricity, etc."
                >
                  <KVEditor
                    data={form.utility_features}
                    onChange={(d) => set("utility_features", d)}
                    placeholder={{ k: "e.g. heating", v: "e.g. Central Gas" }}
                  />
                </SellCard>

                {/* Outdoor */}
                <SellCard
                  id="sec-outdoor"
                  icon="🌿"
                  title="Outdoor Features"
                  subtitle="Garden, balcony, garage, pool, etc."
                >
                  <KVEditor
                    data={form.outdoor_features}
                    onChange={(d) => set("outdoor_features", d)}
                    placeholder={{ k: "e.g. garden", v: "e.g. Yes, private" }}
                  />
                </SellCard>

                {/* Nearby */}
                <SellCard
                  id="sec-nearby"
                  icon="📍"
                  title="What's Nearby"
                  subtitle='Distances to key amenities — e.g. "0.5 km" or "5 min walk"'
                >
                  <KVEditor
                    data={form.whats_nearby}
                    onChange={(d) => set("whats_nearby", d)}
                    placeholder={{ k: "e.g. school", v: "e.g. 0.4 km" }}
                  />
                </SellCard>

                {/* Amenities */}
                <SellCard
                  id="sec-amenities"
                  icon="✨"
                  title="Amenities"
                  subtitle="Select all that apply to this property"
                >
                  <div className="amenities-grid">
                    {AMENITY_OPTIONS.map((a) => {
                      const checked = form.amenities.includes(a);
                      return (
                        <label
                          key={a}
                          className={`amenity-label${checked ? " checked" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAmenity(a)}
                          />
                          <span className="amenity-check-icon">
                            {checked ? "✓" : ""}
                          </span>
                          {a}
                        </label>
                      );
                    })}
                  </div>
                </SellCard>

                {/* Images */}
                <SellCard
                  id="sec-images"
                  icon="🖼"
                  title="Property Images"
                  subtitle="Upload up to 8 high-quality photos"
                >
                  <ImageUploader
                    label="Upload property photos"
                    subtitle="PNG, JPG · Max 10MB each"
                    files={imageFiles}
                    onChange={setImageFiles}
                    max={8}
                  />
                </SellCard>

                {/* Floor Plans */}
                <SellCard
                  icon="📐"
                  title="Floor Plans"
                  subtitle="Optional — upload floor plan images"
                >
                  <ImageUploader
                    label="Upload floor plan images"
                    subtitle="PNG, JPG · Up to 3 images"
                    files={floorFiles}
                    onChange={setFloorFiles}
                    max={3}
                  />
                </SellCard>

                {/* Error */}
                {error && (
                  <div className="sell-error">
                    <i className="bi bi-exclamation-circle" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  className="sell-submit mb-5"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        style={{
                          width: "15px",
                          height: "15px",
                          borderWidth: "2px",
                        }}
                      />
                      Submitting…
                    </>
                  ) : (
                    <>Submit Property for Review →</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FutureFooter />
    </Wrapper>
  );
};

export default SellPropertyArea;

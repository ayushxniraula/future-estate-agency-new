// ============================================================
//  BuyDetails.tsx — Future Work branded property detail page
//  Brand: #252060 navy / #1C94A4 teal
//  Font:  Plus Jakarta Sans + DM Serif Display
//  Fully mobile-responsive, consistent with BuyListing tokens
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Slider from "react-slick";

// ─── Supabase ─────────────────────────────────────────────────
const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Icon loader (Bootstrap Icons + Font Awesome) ─────────────
function injectIconDeps() {
  if (typeof document === "undefined") return;

  // Bootstrap Icons via CDN if not already present
  if (!document.getElementById("bi-cdn")) {
    const link = document.createElement("link");
    link.id = "bi-cdn";
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
    document.head.appendChild(link);
  }

  // Font Awesome 6 Free via CDN
  if (!document.getElementById("fa-cdn")) {
    const link = document.createElement("link");
    link.id = "fa-cdn";
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    document.head.appendChild(link);
  }
}

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
  agent?: Record<string, string> | null;
  google_maps_url?: string | null;
  created_at: string;
}

// ─── LocalStorage helpers ─────────────────────────────────────
const LS_SAVED_KEY = "fw_saved_properties";

function getSavedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

function toggleSavedId(id: string): boolean {
  const ids = getSavedIds();
  const idx = ids.indexOf(id);
  if (idx === -1) {
    ids.push(id);
    localStorage.setItem(LS_SAVED_KEY, JSON.stringify(ids));
    return true; // now saved
  } else {
    ids.splice(idx, 1);
    localStorage.setItem(LS_SAVED_KEY, JSON.stringify(ids));
    return false; // now unsaved
  }
}

// ─── Design tokens ────────────────────────────────────────────
const DETAIL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

  :root {
    --fw-navy:        #252060;
    --fw-navy-dark:   #1a1648;
    --fw-navy-light:  #2e2a7a;
    --fw-teal:        #1C94A4;
    --fw-teal-dark:   #157a88;
    --fw-teal-light:  #22afc2;
    --fw-teal-faint:  rgba(28,148,164,0.08);
    --fw-navy-faint:  rgba(37,32,96,0.06);
    --fw-navy-faint2: rgba(37,32,96,0.10);

    --c-ink:        #0f0e1a;
    --c-ink-2:      #3a3850;
    --c-ink-3:      #7a7890;
    --c-rule:       #e8e6f0;
    --c-surface:    #f7f6fb;
    --c-white:      #ffffff;

    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body:    'Plus Jakarta Sans', system-ui, sans-serif;

    --radius-card:  14px;
    --radius-sm:    9px;
    --radius-pill:  100px;

    --shadow-card:  0 1px 3px rgba(37,32,96,0.05), 0 4px 18px rgba(37,32,96,0.08);
    --shadow-hover: 0 6px 12px rgba(37,32,96,0.10), 0 20px 48px rgba(37,32,96,0.14);
  }

  .fwd-root, .fwd-root * { font-family: var(--font-body); box-sizing: border-box; }
  .fwd-root { background: var(--c-surface); }

  /* ── Breadcrumb ── */
  .fwd-breadcrumb {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--c-ink-3); margin-bottom: 22px; flex-wrap: wrap;
  }
  .fwd-breadcrumb a { color: var(--c-ink-3); text-decoration: none; transition: color 0.18s; font-weight: 500; }
  .fwd-breadcrumb a:hover { color: var(--fw-teal); }
  .fwd-breadcrumb .sep { opacity: 0.35; }
  .fwd-breadcrumb .current {
    color: var(--fw-navy); font-weight: 700; max-width: 260px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* ── Banner ── */
  .fwd-banner { padding: 24px 0 20px; border-bottom: 1.5px solid var(--c-rule); margin-bottom: 24px; }
  .fwd-banner__title {
    font-family: var(--font-display); font-size: clamp(22px, 4vw, 32px);
    font-weight: 400; color: var(--fw-navy); line-height: 1.2; margin-bottom: 12px; letter-spacing: -0.4px;
  }
  .fwd-banner__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
  .fwd-status-pill {
    display: inline-flex; align-items: center; padding: 4px 12px;
    border-radius: var(--radius-pill); font-size: 9.5px; font-weight: 800;
    letter-spacing: 0.9px; text-transform: uppercase; color: #fff; line-height: 1.6;
  }
  .fwd-meta-chip {
    display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 500;
    color: var(--c-ink-3); background: var(--c-white); border: 1.5px solid var(--c-rule);
    padding: 4px 12px; border-radius: var(--radius-pill);
  }
  .fwd-banner__price-col { text-align: right; }
  @media (max-width: 767px) { .fwd-banner__price-col { text-align: left; margin-top: 16px; } }
  .fwd-banner__price {
    font-family: var(--font-display); font-size: clamp(26px, 4vw, 34px);
    font-weight: 400; color: var(--fw-navy); letter-spacing: -0.8px; line-height: 1;
  }
  .fwd-banner__price sup {
    font-family: var(--font-body); font-size: 15px; font-weight: 600;
    color: var(--fw-teal); vertical-align: super; margin-right: 2px;
  }
  .fwd-banner__price sub { font-family: var(--font-body); font-size: 14px; font-weight: 400; color: var(--c-ink-3); }
  .fwd-banner__est { font-size: 12.5px; color: var(--c-ink-3); margin-top: 5px; }
  .fwd-banner__est strong { color: var(--fw-teal-dark); font-weight: 700; }

  /* Action row */
  .fwd-actions {
    display: flex; align-items: center; gap: 8px; margin-top: 14px;
    justify-content: flex-end; flex-wrap: wrap;
  }
  @media (max-width: 767px) { .fwd-actions { justify-content: flex-start; } }
  .fwd-action-share {
    display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px;
    font-weight: 700; color: var(--fw-navy); padding: 7px 16px;
    border-radius: var(--radius-pill); border: 1.5px solid var(--c-rule);
    background: var(--c-white); text-decoration: none; transition: all 0.18s;
    margin-right: auto; letter-spacing: 0.2px; cursor: pointer;
  }
  .fwd-action-share:hover { border-color: var(--fw-teal); color: var(--fw-teal); }
  .fwd-action-icon {
    width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--c-rule);
    background: var(--c-white); display: flex; align-items: center; justify-content: center;
    color: var(--c-ink-3); text-decoration: none; transition: all 0.18s;
    font-size: 14px; flex-shrink: 0; cursor: pointer;
  }
  .fwd-action-icon:hover { border-color: var(--fw-teal); color: var(--fw-teal); }
  .fwd-action-icon.active { background: var(--fw-teal); border-color: var(--fw-teal); color: #fff; }
  .fwd-action-icon.saved-active { background: #e53e3e; border-color: #e53e3e; color: #fff; }

  /* ── Share Modal ── */
  .fwd-modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(15,14,26,0.55); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fwd-fade-in 0.18s ease;
  }
  @keyframes fwd-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .fwd-modal {
    background: var(--c-white); border-radius: 18px; width: 100%; max-width: 420px;
    box-shadow: 0 24px 80px rgba(37,32,96,0.22);
    animation: fwd-slide-up 0.22s cubic-bezier(.22,.9,.36,1);
    overflow: hidden;
  }
  @keyframes fwd-slide-up { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .fwd-modal__header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 22px 16px;
    border-bottom: 1.5px solid var(--c-rule);
  }
  .fwd-modal__title {
    font-family: var(--font-display); font-size: 18px; font-weight: 400;
    color: var(--fw-navy); letter-spacing: -0.2px;
  }
  .fwd-modal__close {
    width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--c-rule);
    background: var(--c-surface); cursor: pointer; display: flex;
    align-items: center; justify-content: center; font-size: 15px;
    color: var(--c-ink-3); transition: all 0.18s;
  }
  .fwd-modal__close:hover { background: var(--c-rule); color: var(--c-ink); }
  .fwd-modal__body { padding: 20px 22px 22px; }
  .fwd-share-subtitle {
    font-size: 12.5px; color: var(--c-ink-3); margin-bottom: 16px; font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .fwd-share-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;
  }
  .fwd-share-btn {
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    padding: 14px 8px; border-radius: 12px; border: 1.5px solid var(--c-rule);
    background: var(--c-surface); cursor: pointer; transition: all 0.18s;
    text-decoration: none; color: var(--c-ink-2);
  }
  .fwd-share-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,32,96,0.1); }
  .fwd-share-btn__icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; color: #fff;
  }
  .fwd-share-btn__label { font-size: 10.5px; font-weight: 700; color: var(--c-ink-3); letter-spacing: 0.2px; }
  .fwd-share-btn--fb .fwd-share-btn__icon { background: #1877F2; }
  .fwd-share-btn--wa .fwd-share-btn__icon { background: #25D366; }
  .fwd-share-btn--tw .fwd-share-btn__icon { background: #000; }
  .fwd-share-btn--li .fwd-share-btn__icon { background: #0A66C2; }
  .fwd-share-url-row {
    display: flex; gap: 8px; align-items: center;
    background: var(--c-surface); border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-sm); padding: 9px 13px;
  }
  .fwd-share-url-text {
    flex: 1; font-size: 12px; color: var(--c-ink-3); font-weight: 500;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .fwd-share-copy-btn {
    background: var(--fw-navy); color: #fff; border: none; cursor: pointer;
    padding: 6px 13px; border-radius: 6px; font-size: 11.5px; font-weight: 700;
    font-family: var(--font-body); transition: background 0.18s; white-space: nowrap;
    flex-shrink: 0;
  }
  .fwd-share-copy-btn:hover { background: var(--fw-teal); }
  .fwd-share-copy-btn.copied { background: #38a169; }

  /* ── Gallery ── */
  .fwd-gallery {
    border-radius: var(--radius-card); overflow: hidden; position: relative;
    box-shadow: var(--shadow-hover); background: var(--c-surface);
    margin-bottom: 24px; border: 1.5px solid var(--c-rule);
  }
  .fwd-gallery__main-wrap { overflow: hidden; position: relative; }
  .fwd-gallery__main-img {
    width: 100%; height: clamp(280px, 45vw, 500px); object-fit: cover;
    display: block; cursor: zoom-in; transition: transform 0.4s ease;
  }
  .fwd-gallery:hover .fwd-gallery__main-img { transform: scale(1.015); }
  .fwd-gallery__placeholder {
    width: 100%; height: clamp(280px, 45vw, 500px);
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem; background: linear-gradient(135deg, #f0eef8 0%, #e8f5f7 100%);
  }
  .fwd-gallery__arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.95); border: none;
    box-shadow: 0 2px 14px rgba(37,32,96,0.16);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; color: var(--fw-navy); cursor: pointer; z-index: 5; transition: all 0.2s;
  }
  .fwd-gallery__arrow:hover {
    background: var(--fw-teal); color: #fff;
    box-shadow: 0 4px 20px rgba(28,148,164,0.35); transform: translateY(-50%) scale(1.06);
  }
  .fwd-gallery__arrow--prev { left: 14px; }
  .fwd-gallery__arrow--next { right: 14px; }
  .fwd-gallery__counter {
    position: absolute; bottom: 14px; right: 14px;
    background: rgba(37,32,96,0.6); backdrop-filter: blur(6px);
    color: #fff; font-size: 11px; font-weight: 700;
    padding: 4px 11px; border-radius: 10px; z-index: 5; letter-spacing: 0.4px;
  }
  .fwd-gallery__thumbs {
    display: flex; gap: 6px; padding: 10px;
    background: var(--c-surface); border-top: 1.5px solid var(--c-rule);
    overflow-x: auto; scrollbar-width: none;
  }
  .fwd-gallery__thumbs::-webkit-scrollbar { display: none; }
  .fwd-gallery__thumb {
    flex-shrink: 0; width: 68px; height: 50px; border-radius: 7px; overflow: hidden;
    border: 2px solid transparent; cursor: pointer; transition: border-color 0.18s, opacity 0.18s; opacity: 0.55;
  }
  .fwd-gallery__thumb.active { border-color: var(--fw-teal); opacity: 1; }
  .fwd-gallery__thumb:hover { opacity: 0.85; }
  .fwd-gallery__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ── Overview bar ── */
  .fwd-overview {
    display: grid; grid-template-columns: repeat(4, 1fr);
    background: var(--fw-navy); border-radius: var(--radius-card);
    overflow: hidden; margin-bottom: 40px; box-shadow: 0 4px 24px rgba(37,32,96,0.18);
  }
  @media (max-width: 576px) { .fwd-overview { grid-template-columns: repeat(2, 1fr); } }
  .fwd-ov-item {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 20px 12px; border-right: 1px solid rgba(255,255,255,0.08);
    text-align: center; position: relative;
  }
  .fwd-ov-item::after {
    content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 0; height: 2px; background: var(--fw-teal); transition: width 0.3s ease;
  }
  .fwd-ov-item:hover::after { width: 60%; }
  .fwd-ov-item:last-child { border-right: none; }
  .fwd-ov-icon { font-size: 18px; margin-bottom: 5px; opacity: 0.65; }
  .fwd-ov-label {
    font-size: 9px; color: rgba(255,255,255,0.38); text-transform: uppercase;
    letter-spacing: 0.9px; margin-bottom: 3px; font-weight: 700;
  }
  .fwd-ov-value { font-family: var(--font-display); font-size: 18px; font-weight: 400; color: #fff; line-height: 1; }

  /* ── Sections ── */
  .fwd-section { padding-bottom: 36px; margin-bottom: 36px; border-bottom: 1.5px solid var(--c-rule); }
  .fwd-section:last-child { border-bottom: none; margin-bottom: 0; }
  .fwd-section__heading {
    font-family: var(--font-display); font-size: 20px; font-weight: 400;
    color: var(--fw-navy); margin-bottom: 16px; letter-spacing: -0.2px;
    display: flex; align-items: center; gap: 12px;
  }
  .fwd-section__heading::after {
    content: ""; flex: 1; height: 1.5px;
    background: linear-gradient(90deg, var(--c-rule) 0%, transparent 100%);
  }
  .fwd-body-text { font-size: 14.5px; line-height: 1.85; color: var(--c-ink-2); }

  /* ── Accordion ── */
  .fwd-accordion { display: flex; flex-direction: column; gap: 7px; }
  .fwd-accordion__item {
    border: 1.5px solid var(--c-rule); border-radius: var(--radius-sm);
    overflow: hidden; background: var(--c-white); transition: border-color 0.18s;
  }
  .fwd-accordion__btn {
    width: 100%; text-align: left; display: flex; align-items: center;
    justify-content: space-between; padding: 13px 16px;
    font-size: 13.5px; font-weight: 700; font-family: var(--font-body);
    color: var(--fw-navy); background: var(--c-surface);
    border: none; cursor: pointer; transition: background 0.18s, color 0.18s; letter-spacing: 0.1px;
  }
  .fwd-accordion__btn:hover { background: var(--fw-navy-faint); }
  .fwd-accordion__btn.open { background: var(--fw-teal-faint); color: var(--fw-teal-dark); }
  .fwd-accordion__chevron {
    font-size: 11px; transition: transform 0.22s; color: var(--c-ink-3);
    width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .fwd-accordion__btn.open .fwd-accordion__chevron { transform: rotate(180deg); color: var(--fw-teal); }
  .fwd-accordion__body { padding: 14px 16px; }
  .fwd-feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
  @media (max-width: 480px) { .fwd-feat-grid { grid-template-columns: 1fr; } }
  .fwd-feat-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid var(--c-rule); font-size: 13px;
  }
  .fwd-feat-row:last-child { border-bottom: none; }
  .fwd-feat-key { color: var(--c-ink-3); font-weight: 500; }
  .fwd-feat-val { font-weight: 700; color: var(--fw-navy); }

  /* ── Amenities ── */
  .fwd-amenity-wrap { display: flex; flex-wrap: wrap; gap: 7px; }
  .fwd-amenity {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--fw-teal-faint); border: 1.5px solid rgba(28,148,164,0.18);
    border-radius: var(--radius-sm); padding: 7px 13px;
    font-size: 12.5px; font-weight: 600; color: var(--fw-navy); transition: all 0.18s;
  }
  .fwd-amenity:hover { border-color: var(--fw-teal); background: rgba(28,148,164,0.13); color: var(--fw-teal-dark); }
  .fwd-amenity__check { font-size: 9px; color: var(--fw-teal); font-weight: 900; }

  /* ── Floor plan ── */
  .fwd-floorplan { border-radius: var(--radius-card); overflow: hidden; border: 1.5px solid var(--c-rule); background: var(--c-surface); }
  .fwd-floorplan img { width: 100%; display: block; }
  .fwd-floorplan-empty { padding: 40px; text-align: center; color: var(--c-ink-3); font-size: 13.5px; }

  /* ── Nearby ── */
  .fwd-nearby-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  @media (max-width: 480px) { .fwd-nearby-grid { grid-template-columns: 1fr; } }
  .fwd-nearby-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 13px; background: var(--c-white); border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule); font-size: 13px; transition: border-color 0.18s, background 0.18s;
  }
  .fwd-nearby-item:hover { border-color: var(--fw-teal); background: var(--fw-teal-faint); }
  .fwd-nearby-key { color: var(--c-ink-3); font-weight: 500; }
  .fwd-nearby-val { font-weight: 700; color: var(--fw-navy); }

  /* ── Walk score ── */
  .fwd-ws-item { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .fwd-ws-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--fw-teal-faint); border: 1.5px solid rgba(28,148,164,0.18);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 17px;
  }
  .fwd-ws-info { flex: 1; }
  .fwd-ws-label { font-size: 12.5px; font-weight: 700; color: var(--fw-navy); margin-bottom: 5px; }
  .fwd-ws-tag { font-size: 11px; color: var(--c-ink-3); font-weight: 500; margin-left: 4px; }
  .fwd-ws-track { height: 5px; background: var(--c-rule); border-radius: 3px; overflow: hidden; }
  .fwd-ws-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--fw-teal) 0%, var(--fw-teal-light) 100%);
    transition: width 0.9s cubic-bezier(.22,.9,.36,1);
  }
  .fwd-ws-num { font-size: 13px; font-weight: 800; color: var(--fw-navy); min-width: 32px; text-align: right; }

  /* ── Map ── */
  .fwd-map { border-radius: var(--radius-card); overflow: hidden; border: 1.5px solid var(--c-rule); }
  .fwd-map iframe { display: block; width: 100%; }
  .fwd-map-footer {
    display: flex; align-items: center; gap: 6px; padding: 11px 15px;
    background: var(--c-white); font-size: 12.5px; color: var(--c-ink-3); border-top: 1.5px solid var(--c-rule);
  }
  .fwd-map-footer a { color: var(--fw-teal); font-weight: 700; text-decoration: none; transition: color 0.18s; }
  .fwd-map-footer a:hover { color: var(--fw-teal-dark); }

  /* ── Similar cards ── */
  .fwd-similar-card {
    border-radius: var(--radius-card); overflow: hidden; border: 1.5px solid var(--c-rule);
    background: var(--c-white); box-shadow: var(--shadow-card);
    transition: box-shadow 0.25s, transform 0.25s; margin: 0 8px 8px;
  }
  .fwd-similar-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
  .fwd-similar-card img { width: 100%; height: 175px; object-fit: cover; display: block; }
  .fwd-similar-card__body { padding: 13px 15px 9px; }
  .fwd-similar-card__price { font-family: var(--font-display); font-size: 16px; color: var(--fw-navy); margin-bottom: 4px; }
  .fwd-similar-card__price sup { font-family: var(--font-body); font-size: 11px; color: var(--fw-teal); font-weight: 600; vertical-align: super; }
  .fwd-similar-card__price sub { font-family: var(--font-body); font-size: 11px; color: var(--c-ink-3); }
  .fwd-similar-card__loc { font-size: 12px; color: var(--c-ink-3); margin-bottom: 4px; display: flex; align-items: center; gap: 3px; }
  .fwd-similar-card__meta { font-size: 11.5px; color: var(--c-ink-3); font-weight: 500; }
  .fwd-similar-card__footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 15px 13px; border-top: 1px solid var(--c-rule);
  }
  .fwd-similar-badge {
    font-size: 9.5px; font-weight: 800; letter-spacing: 0.6px;
    color: #fff; padding: 3px 10px; border-radius: var(--radius-pill); text-transform: uppercase;
  }
  .fwd-similar-arrow {
    width: 30px; height: 30px; border-radius: 50%; background: var(--fw-navy); color: #fff;
    display: flex; align-items: center; justify-content: center; text-decoration: none;
    font-size: 12px; transition: background 0.2s, transform 0.22s;
  }
  .fwd-similar-arrow:hover { background: var(--fw-teal); transform: rotate(45deg); }

  /* ── Sidebar cards ── */
  .fwd-sidebar-card {
    background: var(--c-white); border-radius: var(--radius-card); border: 1.5px solid var(--c-rule);
    box-shadow: var(--shadow-card); padding: 22px; margin-bottom: 16px;
  }
  .fwd-sidebar-label {
    font-size: 9px; font-weight: 800; letter-spacing: 1.2px;
    text-transform: uppercase; color: var(--fw-teal); margin-bottom: 14px; display: block;
  }
  .fwd-sidebar-price {
    font-family: var(--font-display); font-size: 28px; font-weight: 400;
    color: var(--fw-navy); letter-spacing: -0.8px; line-height: 1; margin-bottom: 4px;
  }
  .fwd-sidebar-price sup { font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--fw-teal); vertical-align: super; margin-right: 2px; }
  .fwd-sidebar-price sub { font-family: var(--font-body); font-size: 12.5px; font-weight: 400; color: var(--c-ink-3); }
  .fwd-sidebar-est { font-size: 12px; color: var(--c-ink-3); margin-bottom: 18px; }
  .fwd-sidebar-est strong { color: var(--fw-teal-dark); font-weight: 700; }
  .fwd-facts-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid var(--c-rule); font-size: 13px;
  }
  .fwd-facts-row:last-child { border-bottom: none; }
  .fwd-facts-key { color: var(--c-ink-3); font-weight: 500; }
  .fwd-facts-val { font-weight: 700; color: var(--fw-navy); }

  /* Agent sidebar */
  .fwd-agent-avatar {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, var(--fw-teal) 0%, var(--fw-navy) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem; color: #fff; flex-shrink: 0;
    font-family: var(--font-display); font-weight: 400;
  }
  .fwd-agent-name { font-size: 14.5px; font-weight: 700; color: var(--fw-navy); }
  .fwd-agent-role { font-size: 11.5px; color: var(--fw-teal); font-weight: 600; }
  .fwd-agent-row { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--c-ink-2); padding: 5px 0; font-weight: 500; }
  .fwd-agent-row a { color: var(--c-ink-2); text-decoration: none; transition: color 0.18s; }
  .fwd-agent-row a:hover { color: var(--fw-teal); }
  .fwd-agent-row i { color: var(--fw-teal); width: 16px; flex-shrink: 0; }
  .fwd-agent-cta {
    display: block; margin-top: 14px; text-align: center; padding: 11px;
    border-radius: var(--radius-sm); background: var(--fw-navy); color: #fff;
    font-weight: 700; font-size: 13.5px; font-family: var(--font-body);
    text-decoration: none; transition: background 0.2s;
    border: none; cursor: pointer; width: 100%; letter-spacing: 0.2px;
  }
  .fwd-agent-cta:hover { background: var(--fw-teal); }

  /* Contact form */
  .fwd-input {
    width: 100%; padding: 9px 13px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule); font-size: 13px; font-family: var(--font-body);
    color: var(--c-ink); background: var(--c-surface); outline: none;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    margin-bottom: 9px; appearance: none;
  }
  .fwd-input:focus { border-color: var(--fw-teal); background: var(--c-white); box-shadow: 0 0 0 3px rgba(28,148,164,0.12); }
  .fwd-textarea {
    width: 100%; padding: 9px 13px; border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule); font-size: 13px; font-family: var(--font-body);
    color: var(--c-ink); background: var(--c-surface); outline: none;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    resize: none; margin-bottom: 11px;
  }
  .fwd-textarea:focus { border-color: var(--fw-teal); background: var(--c-white); box-shadow: 0 0 0 3px rgba(28,148,164,0.12); }
  .fwd-send-btn {
    width: 100%; padding: 11px; border-radius: var(--radius-sm); border: none;
    background: var(--fw-teal); color: #fff; font-size: 13.5px; font-weight: 700;
    font-family: var(--font-body); cursor: pointer; letter-spacing: 0.3px;
    transition: background 0.2s; text-transform: uppercase;
  }
  .fwd-send-btn:hover { background: var(--fw-teal-dark); }

  /* ── Skeleton shimmer ── */
  @keyframes fwd-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .fwd-skeleton {
    background: linear-gradient(90deg, #eeedf6 25%, #e4e3f0 50%, #eeedf6 75%);
    background-size: 200% 100%; animation: fwd-shimmer 1.4s infinite; border-radius: 8px;
  }

  /* ── Slick dots ── */
  .fwd-root .slick-dots li button:before { font-size: 7px; color: var(--fw-navy); opacity: 0.25; }
  .fwd-root .slick-dots li.slick-active button:before { color: var(--fw-teal); opacity: 1; }

  /* ── Mobile sticky CTA ── */
  .fwd-mobile-cta {
    display: none; position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--fw-navy); padding: 12px 20px; z-index: 90;
    box-shadow: 0 -4px 24px rgba(37,32,96,0.18); align-items: center; gap: 12px;
  }
  @media (max-width: 1199px) { .fwd-mobile-cta { display: flex; } }
  .fwd-mobile-cta__price {
    font-family: var(--font-display); font-size: 20px; color: #fff;
    font-weight: 400; letter-spacing: -0.5px; line-height: 1; flex: 1;
  }
  .fwd-mobile-cta__price sup { font-family: var(--font-body); font-size: 11px; color: rgba(255,255,255,0.6); vertical-align: super; margin-right: 1px; }
  .fwd-mobile-cta__btn {
    background: var(--fw-teal); color: #fff; border: none; cursor: pointer;
    padding: 10px 20px; border-radius: var(--radius-sm);
    font-weight: 700; font-size: 13px; font-family: var(--font-body);
    letter-spacing: 0.3px; transition: background 0.2s; white-space: nowrap;
  }
  .fwd-mobile-cta__btn:hover { background: var(--fw-teal-light); }

  @media (max-width: 1199px) { .fwd-root { padding-bottom: 70px; } }

  /* ── Error state ── */
  .fwd-error-box { text-align: center; padding: 80px 20px; }
  .fwd-error-icon { font-size: 3.5rem; margin-bottom: 16px; }
  .fwd-error-title { font-family: var(--font-display); font-size: 22px; color: var(--fw-navy); margin-bottom: 8px; font-weight: 400; }
  .fwd-error-sub { font-size: 13.5px; color: var(--c-ink-3); margin-bottom: 24px; }
  .fwd-back-btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 10px 22px;
    background: var(--fw-navy); color: #fff; border-radius: var(--radius-sm);
    text-decoration: none; font-weight: 700; font-size: 13.5px; font-family: var(--font-body);
    transition: background 0.2s; border: none; cursor: pointer;
  }
  .fwd-back-btn:hover { background: var(--fw-teal); }

  /* ── Toast notification ── */
  .fwd-toast {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(12px);
    background: var(--fw-navy); color: #fff; padding: 10px 20px;
    border-radius: var(--radius-pill); font-size: 13px; font-weight: 600;
    box-shadow: 0 8px 32px rgba(37,32,96,0.25); z-index: 2000;
    opacity: 0; transition: opacity 0.25s, transform 0.25s; pointer-events: none;
    white-space: nowrap;
  }
  .fwd-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

function injectDetailStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fwd-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fwd-styles";
    el.textContent = DETAIL_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Helpers ──────────────────────────────────────────────────
function getStatusLabel(status: string): string {
  switch (status) {
    case "For Sale":
      return "FOR SALE";
    case "For Rent":
      return "FOR RENT";
    case "Sold":
      return "SOLD";
    case "Rented":
      return "RENTED";
    default:
      return status?.toUpperCase() ?? "";
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "For Sale":
      return "rgba(28,148,164,0.92)";
    case "For Rent":
      return "rgba(37,89,160,0.92)";
    case "Sold":
      return "rgba(45,139,86,0.92)";
    case "Rented":
      return "rgba(196,130,20,0.92)";
    default:
      return "rgba(37,32,96,0.88)";
  }
}

function formatKey(k: string): string {
  return k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Toast hook ───────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMsg(message);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 2200);
  };

  const Toast = () => (
    <div className={`fwd-toast${visible ? " show" : ""}`}>{msg}</div>
  );

  return { show, Toast };
}

// ─── Share Modal ──────────────────────────────────────────────
function ShareModal({
  open,
  onClose,
  title,
  location,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  location: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(
    `Check out this property: ${title} — ${location}`,
  );
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      key: "fb",
      label: "Facebook",
      cls: "fwd-share-btn--fb",
      icon: "fab fa-facebook-f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "wa",
      label: "WhatsApp",
      cls: "fwd-share-btn--wa",
      icon: "fab fa-whatsapp",
      href: `https://wa.me/?text=${text}%20${encodedUrl}`,
    },
    {
      key: "tw",
      label: "X / Twitter",
      cls: "fwd-share-btn--tw",
      icon: "fab fa-x-twitter",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    },
    {
      key: "li",
      label: "LinkedIn",
      cls: "fwd-share-btn--li",
      icon: "fab fa-linkedin-in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div
      className="fwd-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fwd-modal">
        <div className="fwd-modal__header">
          <span className="fwd-modal__title">Share this property</span>
          <button
            className="fwd-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x" />
          </button>
        </div>
        <div className="fwd-modal__body">
          <div className="fwd-share-subtitle">
            {title} — {location}
          </div>
          <div className="fwd-share-grid">
            {shareLinks.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`fwd-share-btn ${s.cls}`}
              >
                <div className="fwd-share-btn__icon">
                  <i className={s.icon} />
                </div>
                <span className="fwd-share-btn__label">{s.label}</span>
              </a>
            ))}
          </div>
          <div className="fwd-share-url-row">
            <span className="fwd-share-url-text">{url}</span>
            <button
              className={`fwd-share-copy-btn${copied ? " copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <i className="bi bi-check2" /> Copied
                </>
              ) : (
                <>
                  <i className="bi bi-link-45deg" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────
function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const imgs = images && images.length > 0 ? images : [];

  if (imgs.length === 0) {
    return (
      <div className="fwd-gallery">
        <div className="fwd-gallery__placeholder">🏠</div>
      </div>
    );
  }

  const prev = () => setActive((i) => (i === 0 ? imgs.length - 1 : i - 1));
  const next = () => setActive((i) => (i === imgs.length - 1 ? 0 : i + 1));

  return (
    <div className="fwd-gallery">
      <div className="fwd-gallery__main-wrap">
        <img
          src={imgs[active]}
          alt={`${title} — ${active + 1}`}
          className="fwd-gallery__main-img"
        />
        {imgs.length > 1 && (
          <>
            <button
              className="fwd-gallery__arrow fwd-gallery__arrow--prev"
              onClick={prev}
              aria-label="Previous image"
            >
              <i className="bi bi-arrow-left" />
            </button>
            <button
              className="fwd-gallery__arrow fwd-gallery__arrow--next"
              onClick={next}
              aria-label="Next image"
            >
              <i className="bi bi-arrow-right" />
            </button>
            <div className="fwd-gallery__counter">
              {active + 1} / {imgs.length}
            </div>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="fwd-gallery__thumbs">
          {imgs.map((src, i) => (
            <div
              key={i}
              className={`fwd-gallery__thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img src={src} alt={`Thumb ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Banner ───────────────────────────────────────────────────
function Banner({
  property,
  onShare,
}: {
  property: Property;
  onShare: () => void;
}) {
  const [saved, setSaved] = useState(() => getSavedIds().includes(property.id));
  const { show, Toast } = useToast();

  const monthly =
    property.status === "For Rent"
      ? property.price
      : Math.round(property.price * 0.005);

  const handleSave = () => {
    const nowSaved = toggleSavedId(property.id);
    setSaved(nowSaved);
    show(nowSaved ? "✓ Saved to your list" : "Removed from saved");
  };

  return (
    <div className="fwd-banner">
      <Toast />
      <div className="row align-items-start">
        <div className="col-md-7">
          <h1 className="fwd-banner__title">{property.title}</h1>
          <div className="fwd-banner__meta">
            <span
              className="fwd-status-pill"
              style={{ background: getStatusColor(property.status) }}
            >
              {getStatusLabel(property.status)}
            </span>
            <span className="fwd-meta-chip">
              <svg
                width="10"
                height="12"
                viewBox="0 0 11 13"
                fill="none"
                style={{ color: "var(--fw-teal)" }}
              >
                <path
                  d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.25A1.75 1.75 0 1 1 5.5 2.75a1.75 1.75 0 0 1 0 3.5z"
                  fill="currentColor"
                />
              </svg>
              {property.location}
            </span>
            {property.property_type && (
              <span className="fwd-meta-chip">{property.property_type}</span>
            )}
          </div>
        </div>

        <div className="col-md-5 fwd-banner__price-col">
          <div className="fwd-banner__price">
            <sup>$</sup>
            {property.price.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
            {property.status === "For Rent" && <sub> / mo</sub>}
          </div>
          {property.status !== "For Rent" && (
            <div className="fwd-banner__est">
              Est. mortgage <strong>${monthly.toLocaleString()}/mo</strong>
            </div>
          )}
          <div className="fwd-actions">
            <button
              className={`fwd-action-icon${saved ? " saved-active" : ""}`}
              onClick={handleSave}
              title={saved ? "Remove from saved" : "Save property"}
              aria-label={saved ? "Unsave property" : "Save property"}
            >
              <i
                className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"}
              />
            </button>
            <button
              className="fwd-action-icon"
              onClick={onShare}
              title="Bookmark"
              aria-label="Bookmark"
            >
              <i className="fas fa-share-alt"></i>{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Overview bar ─────────────────────────────────────────────
function OverviewBar({ property }: { property: Property }) {
  const items = [
    {
      icon: "bi bi-grid",
      label: "Area",
      value: property.sqft ? `${property.sqft.toLocaleString()} ft²` : "N/A",
    },
    {
      icon: "bi bi-door-open",
      label: "Bedrooms",
      value: property.bedrooms ?? "—",
    },
    {
      icon: "bi bi-droplet",
      label: "Bathrooms",
      value: property.bathrooms ?? "—",
    },
    {
      icon: "bi bi-cup-hot",
      label: "Kitchens",
      value: property.kitchens ?? "—",
    },
  ];
  return (
    <div className="fwd-overview">
      {items.map((item, i) => (
        <div key={i} className="fwd-ov-item">
          <div className="fwd-ov-icon">
            <i
              className={item.icon}
              style={{ fontSize: 18, opacity: 0.75, color: "white" }}
            />
          </div>
          <div className="fwd-ov-label">{item.label}</div>
          <div className="fwd-ov-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Feature Accordion ────────────────────────────────────────
function FeatureAccordion({ property }: { property: Property }) {
  const [open, setOpen] = useState<number>(0);
  const sections = [
    { title: "Property Details", data: property.property_details ?? {} },
    { title: "Utility & Home Features", data: property.utility_features ?? {} },
    { title: "Outdoor Features", data: property.outdoor_features ?? {} },
  ];
  return (
    <div className="fwd-accordion">
      {sections.map((section, idx) => {
        const entries = Object.entries(section.data).filter(
          ([, v]) => v && String(v).trim() !== "",
        );
        if (entries.length === 0) return null;
        const isOpen = open === idx;
        return (
          <div key={idx} className="fwd-accordion__item">
            <button
              className={`fwd-accordion__btn${isOpen ? " open" : ""}`}
              onClick={() => setOpen(isOpen ? -1 : idx)}
            >
              <span>{section.title}</span>
              <span className="fwd-accordion__chevron">
                <i className="bi bi-chevron-down" />
              </span>
            </button>
            {isOpen && (
              <div className="fwd-accordion__body">
                <div className="fwd-feat-grid">
                  {entries.map(([k, v]) => (
                    <div key={k} className="fwd-feat-row">
                      <span className="fwd-feat-key">{formatKey(k)}</span>
                      <span className="fwd-feat-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Amenities ────────────────────────────────────────────────
function Amenities({ amenities }: { amenities: string[] }) {
  if (!amenities || amenities.length === 0) return null;
  return (
    <div className="fwd-amenity-wrap">
      {amenities.map((a, i) => (
        <span key={i} className="fwd-amenity">
          <i
            className="bi bi-check2"
            style={{ fontSize: 11, color: "var(--fw-teal)", fontWeight: 900 }}
          />
          {a}
        </span>
      ))}
    </div>
  );
}

// ─── Floor Plan ───────────────────────────────────────────────
function FloorPlan({ floorPlans }: { floorPlans: string[] }) {
  const imgs = floorPlans && floorPlans.length > 0 ? floorPlans : null;
  if (!imgs) {
    return (
      <div className="fwd-floorplan">
        <div className="fwd-floorplan-empty">
          <i
            className="bi bi-layout-text-window-reverse"
            style={{
              fontSize: 28,
              marginBottom: 8,
              display: "block",
              opacity: 0.35,
            }}
          />
          No floor plans available for this property
        </div>
      </div>
    );
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
  };
  return (
    <div className="fwd-floorplan">
      <Slider {...settings}>
        {imgs.map((src, i) => (
          <div key={i}>
            <img src={src} alt={`Floor plan ${i + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

// ─── Nearby ───────────────────────────────────────────────────
function NearbyList({ nearby }: { nearby: Record<string, string> | null }) {
  if (!nearby) return null;
  const labelMap: Record<string, string> = {
    school: "School",
    grocery: "Grocery",
    metro: "Metro",
    gym: "Gym",
    university: "University",
    hospital: "Hospital",
    mall: "Mall",
    police: "Police Station",
    bus: "Bus Station",
    river: "River",
    market: "Market",
    park: "Park",
    restaurant: "Restaurant",
    pharmacy: "Pharmacy",
    airport: "Airport",
  };
  const entries = Object.entries(nearby).filter(
    ([, v]) => v && String(v).trim() !== "",
  );
  if (entries.length === 0) return null;
  return (
    <div className="fwd-nearby-grid">
      {entries.map(([k, v]) => (
        <div key={k} className="fwd-nearby-item">
          <span className="fwd-nearby-key">{labelMap[k] ?? formatKey(k)}</span>
          <span className="fwd-nearby-val">{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Walk Score ───────────────────────────────────────────────
function WalkScore({ nearby }: { nearby: Record<string, string> | null }) {
  if (!nearby) return null;
  function distScore(km: string): number {
    const d = parseFloat(km);
    if (isNaN(d)) return 0;
    if (d <= 0.3) return 100;
    if (d <= 0.5) return 90;
    if (d <= 1.0) return 75;
    if (d <= 2.0) return 55;
    if (d <= 5.0) return 35;
    return 15;
  }
  function avg(...vals: number[]) {
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  function tag(s: number) {
    if (s >= 90) return "Excellent";
    if (s >= 70) return "Very Good";
    if (s >= 50) return "Good";
    if (s >= 30) return "Fair";
    return "Limited";
  }
  const scores = [
    {
      icon: "bi bi-bus-front",
      label: "Transit Score",
      value: avg(
        distScore(nearby.metro ?? "99"),
        distScore(nearby.bus ?? "99"),
      ),
    },
    {
      icon: "bi bi-mortarboard",
      label: "School Score",
      value: avg(
        distScore(nearby.school ?? "99"),
        distScore(nearby.university ?? "99"),
      ),
    },
    {
      icon: "bi bi-hospital",
      label: "Medical Score",
      value: avg(
        distScore(nearby.hospital ?? "99"),
        distScore(nearby.pharmacy ?? "99"),
      ),
    },
    {
      icon: "bi bi-bag",
      label: "Shopping Score",
      value: avg(
        distScore(nearby.mall ?? "99"),
        distScore(nearby.grocery ?? "99"),
      ),
    },
  ];
  return (
    <>
      <p className="fwd-body-text" style={{ marginBottom: "20px" }}>
        Scores are calculated from walking distance to nearby amenities.
      </p>
      {scores.map((item, i) => (
        <div key={i} className="fwd-ws-item">
          <div className="fwd-ws-icon">
            <i className={item.icon} style={{ fontSize: 17 }} />
          </div>
          <div className="fwd-ws-info">
            <div className="fwd-ws-label">
              {item.label}
              <span className="fwd-ws-tag">— {tag(item.value)}</span>
            </div>
            <div className="fwd-ws-track">
              <div
                className="fwd-ws-fill"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
          <div className="fwd-ws-num">{item.value}</div>
        </div>
      ))}
    </>
  );
}

// ─── Map ──────────────────────────────────────────────────────
function PropertyMap({ location }: { location: string }) {
  const q = encodeURIComponent(location);
  return (
    <div className="fwd-map">
      <iframe
        title={`Map: ${location}`}
        src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&query=${q}`}
        height="380"
        style={{ border: 0, width: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="fwd-map-footer">
        <i className="bi bi-geo-alt" style={{ color: "var(--fw-teal)" }} />
        {location} —{" "}
        <a
          href={`https://www.openstreetmap.org/search?query=${q}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in OpenStreetMap ↗
        </a>
      </div>
    </div>
  );
}

// ─── Similar Properties ───────────────────────────────────────
function SimilarProperties({
  currentId,
  propertyType,
}: {
  currentId: string;
  propertyType: string;
}) {
  const [similar, setSimilar] = useState<Property[]>([]);

  useEffect(() => {
    (async () => {
      const cols =
        "id,title,price,location,status,images,bedrooms,bathrooms,sqft,property_type";
      const { data } = await supabase
        .from("properties")
        .select(cols)
        .neq("id", currentId)
        .eq("property_type", propertyType)
        .limit(4);
      if (!data || data.length < 2) {
        const { data: fb } = await supabase
          .from("properties")
          .select(cols)
          .neq("id", currentId)
          .limit(4);
        setSimilar((fb as Property[]) || []);
      } else {
        setSimilar((data as Property[]) || []);
      }
    })();
  }, [currentId, propertyType]);

  if (similar.length === 0) return null;

  const settings = {
    dots: true,
    arrows: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3800,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  return (
    <Slider {...settings}>
      {similar.map((item) => (
        <div key={item.id}>
          <div className="fwd-similar-card">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={item.title} />
            ) : (
              <div
                style={{
                  height: 175,
                  background:
                    "linear-gradient(135deg, #f0eef8 0%, #e8f5f7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                }}
              >
                🏠
              </div>
            )}
            <div className="fwd-similar-card__body">
              <div className="fwd-similar-card__price">
                <sup>$</sup>
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                {item.status === "For Rent" && <sub> /mo</sub>}
              </div>
              <div className="fwd-similar-card__loc">
                <i
                  className="bi bi-geo-alt"
                  style={{
                    color: "var(--fw-teal)",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                />
                {item.location}
              </div>
              <div className="fwd-similar-card__meta">
                {item.bedrooms != null && `${item.bedrooms} bed`}
                {item.bathrooms != null && ` · ${item.bathrooms} bath`}
                {item.sqft != null && ` · ${item.sqft.toLocaleString()} ft²`}
              </div>
            </div>
            <div className="fwd-similar-card__footer">
              <span
                className="fwd-similar-badge"
                style={{ background: getStatusColor(item.status) }}
              >
                {getStatusLabel(item.status)}
              </span>
              <Link to={`/buy/${item.id}`} className="fwd-similar-arrow">
                <i className="bi bi-arrow-up-right" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}

// ─── Price Sidebar ────────────────────────────────────────────
function PriceSidebar({ property }: { property: Property }) {
  const monthly =
    property.status === "For Rent"
      ? property.price
      : Math.round(property.price * 0.005);
  const facts = [
    { k: "Type", v: property.property_type },
    { k: "Status", v: property.status },
    ...(property.sqft
      ? [{ k: "Area", v: `${property.sqft.toLocaleString()} ft²` }]
      : []),
    ...(property.bedrooms != null
      ? [{ k: "Bedrooms", v: String(property.bedrooms) }]
      : []),
    ...(property.bathrooms != null
      ? [{ k: "Bathrooms", v: String(property.bathrooms) }]
      : []),
    ...(property.property_details?.year_built
      ? [{ k: "Year Built", v: property.property_details.year_built }]
      : []),
    ...(property.property_details?.furnishing
      ? [{ k: "Furnishing", v: property.property_details.furnishing }]
      : []),
  ];
  return (
    <div className="fwd-sidebar-card">
      <span className="fwd-sidebar-label">Pricing</span>
      <div className="fwd-sidebar-price">
        <sup>$</sup>
        {property.price.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
        {property.status === "For Rent" && <sub> / mo</sub>}
      </div>
      {property.status !== "For Rent" && (
        <div className="fwd-sidebar-est">
          Est. mortgage <strong>${monthly.toLocaleString()}/mo</strong>
        </div>
      )}
      <div style={{ marginTop: "16px" }}>
        {facts.map((f) => (
          <div key={f.k} className="fwd-facts-row">
            <span className="fwd-facts-key">{f.k}</span>
            <span className="fwd-facts-val">{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Agent Sidebar ────────────────────────────────────────────
function AgentSidebar({
  agent,
}: {
  agent: Record<string, string> | null | undefined;
}) {
  if (!agent) return null;
  return (
    <div className="fwd-sidebar-card">
      <span className="fwd-sidebar-label">Listed By</span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "13px",
          marginBottom: "14px",
        }}
      >
        <div className="fwd-agent-avatar">
          {agent.name ? agent.name[0].toUpperCase() : "A"}
        </div>
        <div>
          <div className="fwd-agent-name">{agent.name}</div>
          <div className="fwd-agent-role">
            {agent.title || "Property Agent"}
          </div>
        </div>
      </div>
      {agent.phone && (
        <div className="fwd-agent-row">
          <i className="bi bi-telephone" />
          <a href={`tel:${agent.phone}`}>{agent.phone}</a>
        </div>
      )}
      {agent.email && (
        <div className="fwd-agent-row">
          <i className="bi bi-envelope" />
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
      )}
      {agent.location && (
        <div className="fwd-agent-row">
          <i className="bi bi-geo-alt" />
          <span>{agent.location}</span>
        </div>
      )}
      {agent.email && (
        <a href={`mailto:${agent.email}`} className="fwd-agent-cta">
          Contact Agent
        </a>
      )}
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────
function ContactForm({
  property,
  agentEmail,
}: {
  property: Property;
  agentEmail?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState(
    `Hi, I'm interested in "${property.title}" at ${property.location}. Please get in touch.`,
  );

  const handleSend = () => {
    if (agentEmail) {
      window.location.href = `mailto:${agentEmail}?subject=${encodeURIComponent(`Enquiry: ${property.title}`)}&body=${encodeURIComponent(msg)}`;
    }
  };

  return (
    <div className="fwd-sidebar-card">
      <span className="fwd-sidebar-label">Send a Message</span>
      <input
        className="fwd-input"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="fwd-input"
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="fwd-input"
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        className="fwd-textarea"
        rows={4}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button className="fwd-send-btn" onClick={handleSend}>
        <i className="bi bi-send" style={{ marginRight: 7 }} />
        Send Message
      </button>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ padding: "36px 0" }}>
      <div
        className="fwd-skeleton"
        style={{ height: 32, width: "55%", marginBottom: 14 }}
      />
      <div
        className="fwd-skeleton"
        style={{ height: 18, width: "30%", marginBottom: 28 }}
      />
      <div
        className="fwd-skeleton"
        style={{
          height: "clamp(280px,45vw,500px)",
          borderRadius: 14,
          marginBottom: 22,
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 0,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 40,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="fwd-skeleton" style={{ height: 82 }} />
        ))}
      </div>
      <div className="row">
        <div className="col-xl-8">
          {[150, 100, 70, 120, 90].map((h, i) => (
            <div
              key={i}
              className="fwd-skeleton"
              style={{ height: h, marginBottom: 12 }}
            />
          ))}
        </div>
        <div className="col-xl-4">
          <div
            className="fwd-skeleton"
            style={{ height: 210, borderRadius: 14, marginBottom: 14 }}
          />
          <div
            className="fwd-skeleton"
            style={{ height: 170, borderRadius: 14 }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
const BuyDetails = () => {
  injectDetailStyles();
  injectIconDeps();

  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: sbError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();
        if (sbError) throw sbError;
        setProperty(data as Property);
      } catch (err: any) {
        setError(err?.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!loading && (error || !property)) {
    return (
      <div className="fwd-root listing-details-one border-top lg-mt-100 pt-50 pb-150 xl-pb-120">
        <div className="container">
          <div className="fwd-error-box">
            <div className="fwd-error-icon">⚠️</div>
            <p className="fwd-error-title">{error || "Property not found"}</p>
            <p className="fwd-error-sub">
              This listing may have been removed or the link is incorrect.
            </p>
            <Link to="/listing_13" className="fwd-back-btn">
              <i className="bi bi-arrow-left" /> Back to Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const agent = property?.agent ?? property?.agent_info ?? null;

  return (
    <div className="fwd-root listing-details-one border-top lg-mt-100 pt-50 pb-150 xl-pb-120">
      <div className="container">
        {loading && <LoadingSkeleton />}

        {!loading && property && (
          <>
            {/* Share Modal */}
            <ShareModal
              open={shareOpen}
              onClose={() => setShareOpen(false)}
              title={property.title}
              location={property.location}
            />

            {/* Breadcrumb */}
            <div className="fwd-breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep">›</span>
              <Link to="/listing_13">Listings</Link>
              <span className="sep">›</span>
              <span className="current">{property.title}</span>
            </div>

            {/* Banner */}
            <Banner property={property} onShare={() => setShareOpen(true)} />

            {/* Gallery */}
            <Gallery images={property.images || []} title={property.title} />

            {/* Overview bar */}
            <OverviewBar property={property} />

            <div className="row">
              {/* ── Left column ── */}
              <div className="col-xl-8">
                {property.description && (
                  <div className="fwd-section">
                    <h4 className="fwd-section__heading">Overview</h4>
                    <p className="fwd-body-text">{property.description}</p>
                  </div>
                )}

                <div className="fwd-section">
                  <h4 className="fwd-section__heading">Property Features</h4>
                  {property.features_description && (
                    <p
                      className="fwd-body-text"
                      style={{ marginBottom: "16px" }}
                    >
                      {property.features_description}
                    </p>
                  )}
                  <FeatureAccordion property={property} />
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div className="fwd-section">
                    <h4 className="fwd-section__heading">Amenities</h4>
                    <p
                      className="fwd-body-text"
                      style={{ marginBottom: "14px" }}
                    >
                      This property comes with the following amenities.
                    </p>
                    <Amenities amenities={property.amenities} />
                  </div>
                )}

                <div className="fwd-section">
                  <h4 className="fwd-section__heading">Floor Plans</h4>
                  <FloorPlan floorPlans={property.floor_plans || []} />
                </div>

                {property.whats_nearby && (
                  <div className="fwd-section">
                    <h4 className="fwd-section__heading">What's Nearby</h4>
                    <p
                      className="fwd-body-text"
                      style={{ marginBottom: "14px" }}
                    >
                      Distances from this property to key local amenities.
                    </p>
                    <NearbyList nearby={property.whats_nearby} />
                  </div>
                )}

                <div className="fwd-section">
                  <h4 className="fwd-section__heading">Similar Homes</h4>
                  <SimilarProperties
                    currentId={property.id}
                    propertyType={property.property_type}
                  />
                </div>

                {property.whats_nearby && (
                  <div className="fwd-section">
                    <h4 className="fwd-section__heading">Walk Score</h4>
                    <WalkScore nearby={property.whats_nearby} />
                  </div>
                )}

                <div className="fwd-section">
                  <h4 className="fwd-section__heading">Location</h4>
                  <PropertyMap location={property.location} />
                </div>
              </div>

              {/* ── Right sidebar ── */}
              <div className="col-xl-4">
                <div style={{ position: "sticky", top: "90px" }}>
                  <PriceSidebar property={property} />
                  <AgentSidebar
                    agent={agent as Record<string, string> | null}
                  />
                  <ContactForm property={property} agentEmail={agent?.email} />
                </div>
              </div>
            </div>

            {/* ── Mobile sticky CTA ── */}
            <div className="fwd-mobile-cta">
              <div className="fwd-mobile-cta__price">
                <sup>$</sup>
                {property.price.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                {property.status === "For Rent" && (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.55)",
                      marginLeft: "3px",
                    }}
                  >
                    /mo
                  </span>
                )}
              </div>
              <button
                className="fwd-mobile-cta__btn"
                onClick={() => {
                  const el = document.querySelector(".fwd-sidebar-card");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <i
                  className="bi bi-person-lines-fill"
                  style={{ marginRight: 6 }}
                />
                Contact Agent
              </button>
              {agent?.email && (
                <a
                  href={`mailto:${agent.email}?subject=${encodeURIComponent(`Enquiry: ${property.title}`)}`}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    padding: "10px 16px",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className="bi bi-envelope" style={{ marginRight: 5 }} />
                  Email
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyDetails;

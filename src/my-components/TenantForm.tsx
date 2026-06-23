// ============================================================
//  TenantLandlordFormArea.tsx — "Tenant / Landlord Intake Form"
//  Theme: FutureWork brand — #252060 navy / #1C94A4 teal
//  Font: Plus Jakarta Sans + DM Serif Display
//  Source: Tenant/Landlord intake form (PAN 610495137, Baluwatar)
//  Image upload: cPanel upload.php (same as SellPropertyArea)
// ============================================================

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
import FutureFooter from "../layouts/footers/FutureFooter";
import NavMenu from "../layouts/headers/Menu/FutureNavMenu";
import { useClientSession } from "./userclientsession";
import LoginModal from "../modals/LoginModal";

// ─── Supabase (database only — ID images go to cPanel) ────────
const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── cPanel upload config (mirrors SellPropertyArea exactly) ──
const CPANEL_UPLOAD_URL = "https://futurestateagency.com/upload.php";
const CPANEL_UPLOAD_SECRET = ""; // must match $UPLOAD_SECRET in upload.php

// ─── Types ────────────────────────────────────────────────────
interface TenantFormData {
  full_name: string;
  date_of_birth: string;
  temporary_address: string;
  permanent_address: string;
  contact_no: string;
  email: string;
  occupation: string;
  request_type: "Rent" | "Sale";
  property_types: string[];
  property_category: string[]; // Residential / Commercial
  preferred_location: string;
  budget: string;
  adults: string;
  children: string;
  pets: string;
  vehicles: string[];
  facilities: string[];
  description: string;
  agreed_to_terms: boolean;
}

// ─── Styles ───────────────────────────────────────────────────
const TENANT_STYLES = `
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

  .tnt-root, .tnt-root * {
    font-family: var(--font-body);
    box-sizing: border-box;
  }

  /* ── Page background ── */
  .tnt-section {
    padding-top: 80px;
    padding-bottom: 120px;
    background: var(--c-surface);
  }

  /* ── Page heading ── */
  .tnt-page-head { margin-bottom: 40px; }
  .tnt-page-eyebrow {
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
  .tnt-page-eyebrow::before {
    content: '';
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--fw-teal);
    border-radius: 2px;
    opacity: 0.6;
  }
  .tnt-page-title {
    font-family: var(--font-display);
    font-size: clamp(26px, 3.5vw, 36px);
    font-weight: 400;
    color: var(--fw-navy);
    letter-spacing: -0.4px;
    line-height: 1.2;
    margin: 0 0 8px;
  }
  .tnt-page-title em { font-style: italic; color: var(--fw-teal); }
  .tnt-page-sub {
    font-size: 14px;
    color: var(--c-ink-3);
    line-height: 1.7;
    margin: 0;
  }
  .tnt-page-meta {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 14px;
    font-size: 12px;
    color: var(--c-ink-3);
  }
  .tnt-page-meta strong { color: var(--fw-navy); font-weight: 700; }

  /* ── Two-column layout ── */
  .tnt-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 28px;
    align-items: start;
  }
  @media (max-width: 991px) {
    .tnt-layout { grid-template-columns: 1fr; }
    .tnt-sidebar { display: none; }
  }

  /* ── Sidebar ── */
  .tnt-sidebar {
    position: sticky;
    top: 96px;
    background: var(--c-white);
    border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-card);
    padding: 20px 16px;
    box-shadow: var(--shadow-card);
  }
  .tnt-sidebar__label {
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
  .tnt-nav-item {
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
  .tnt-nav-item:hover {
    background: var(--fw-navy-faint);
    color: var(--fw-navy);
    border-color: var(--c-rule);
  }
  .tnt-nav-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.4;
    flex-shrink: 0;
  }

  .tnt-progress {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--c-rule);
  }
  .tnt-progress__label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 7px;
    display: flex;
    justify-content: space-between;
  }
  .tnt-progress__track {
    height: 4px;
    background: var(--c-rule);
    border-radius: 3px;
    overflow: hidden;
  }
  .tnt-progress__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--fw-navy), var(--fw-teal));
    border-radius: 3px;
    transition: width 0.4s ease;
  }

  .tnt-side-note {
    margin-top: 16px;
    padding: 12px;
    border-radius: var(--radius-sm);
    background: var(--fw-teal-faint);
    border: 1.5px solid var(--fw-teal-border);
    font-size: 11px;
    line-height: 1.6;
    color: var(--fw-navy);
  }
  .tnt-side-note strong { display: block; margin-bottom: 3px; color: var(--fw-teal-dark); }

  /* ── Form cards ── */
  .tnt-card {
    background: var(--c-white);
    border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-card);
    padding: 30px 32px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-card);
    transition: border-color 0.2s;
  }
  .tnt-card:focus-within { border-color: var(--fw-teal-border); }
  @media (max-width: 600px) { .tnt-card { padding: 22px 18px; } }

  .tnt-card__header {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid var(--c-rule);
  }
  .tnt-card__icon {
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
  .tnt-card__title {
    font-family: var(--font-display);
    font-size: 19px;
    font-weight: 400;
    color: var(--fw-navy);
    letter-spacing: -0.2px;
    line-height: 1.2;
  }
  .tnt-card__subtitle { font-size: 11.5px; color: var(--c-ink-3); margin-top: 2px; }

  /* ── Labels & inputs ── */
  .tnt-label {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 6px;
  }
  .tnt-label .req { color: var(--fw-teal); margin-left: 2px; }

  .tnt-input,
  .tnt-select,
  .tnt-textarea {
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
  .tnt-input:focus,
  .tnt-select:focus,
  .tnt-textarea:focus {
    border-color: var(--fw-teal);
    background: var(--c-white);
    box-shadow: var(--shadow-focus);
  }
  .tnt-input::placeholder,
  .tnt-textarea::placeholder { color: rgba(122,120,144,0.55); }

  .tnt-textarea { resize: vertical; min-height: 110px; line-height: 1.65; }
  .tnt-select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7890' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }
  .tnt-hint { font-size: 11.5px; color: var(--c-ink-3); margin-top: 5px; }

  /* ── Pill toggle (Rent / Sale) ── */
  .pill-toggle {
    display: inline-flex;
    border: 1.5px solid var(--c-rule);
    border-radius: 999px;
    padding: 4px;
    background: var(--c-surface);
    gap: 4px;
  }
  .pill-toggle__btn {
    padding: 9px 22px;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: var(--c-ink-3);
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.18s;
  }
  .pill-toggle__btn.active {
    background: var(--fw-navy);
    color: var(--c-white);
    box-shadow: 0 3px 10px rgba(37,32,96,0.25);
  }

  /* ── Chip multi-select grid (property type / category / vehicles / facilities) ── */
  .chip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
  }
  .chip-label {
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
  .chip-label:hover { border-color: var(--fw-teal-border); background: var(--fw-teal-faint); color: var(--fw-navy); }
  .chip-label.checked { border-color: var(--fw-navy); background: var(--fw-navy); color: var(--c-white); }
  .chip-label input { display: none; }
  .chip-check-icon {
    width: 15px; height: 15px;
    border-radius: 4px;
    border: 1.5px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 9px;
    opacity: 0.6;
    transition: all 0.15s;
  }
  .chip-label.checked .chip-check-icon { opacity: 1; background: var(--fw-teal); border-color: var(--fw-teal); }

  /* ── Counter input (Adults / Children / Pets) ── */
  .counter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 14px;
  }
  .counter-box {
    border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-sm);
    padding: 13px 15px;
    background: var(--c-surface);
  }
  .counter-box__label {
    font-size: 11px;
    font-weight: 700;
    color: var(--c-ink-3);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 9px;
  }
  .counter-box__controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .counter-btn {
    width: 30px; height: 30px;
    border-radius: 8px;
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
    color: var(--fw-navy);
    font-size: 15px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .counter-btn:hover { border-color: var(--fw-teal); color: var(--fw-teal); background: var(--fw-teal-faint); }
  .counter-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .counter-value {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: var(--c-ink);
    font-family: var(--font-body);
  }

  /* ── ID upload zone ── */
  .upload-zone {
    border: 2px dashed var(--c-rule);
    border-radius: var(--radius-card);
    padding: 30px 24px;
    text-align: center;
    cursor: pointer;
    background: var(--c-surface);
    transition: border-color 0.2s, background 0.2s;
  }
  .upload-zone:hover { border-color: var(--fw-teal); background: var(--fw-teal-faint); }
  .upload-zone__icon { font-size: 1.8rem; margin-bottom: 8px; opacity: 0.6; }
  .upload-zone__title {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 400;
    color: var(--fw-navy);
    margin-bottom: 4px;
  }
  .upload-zone__sub { font-size: 11.5px; color: var(--c-ink-3); }
  .id-preview {
    margin-top: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
  }
  .id-preview img {
    width: 52px; height: 52px;
    object-fit: cover;
    border-radius: 7px;
    border: 1.5px solid var(--c-rule);
  }
  .id-preview__name {
    flex: 1;
    font-size: 12.5px;
    color: var(--c-ink-2);
    font-weight: 600;
    word-break: break-all;
  }
  .id-preview__remove {
    width: 26px; height: 26px;
    border-radius: 50%;
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: var(--c-ink-3);
    cursor: pointer;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .id-preview__remove:hover { border-color: #e05f5f; color: #e05f5f; background: #fff5f5; }

  /* ── Terms & Conditions ── */
  .tnt-terms-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 22px;
  }
  .tnt-term {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    font-size: 13px;
    color: var(--c-ink-2);
    line-height: 1.65;
  }
  .tnt-term__num {
    flex-shrink: 0;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--fw-navy-faint);
    color: var(--fw-navy);
    font-size: 11px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }
  .tnt-agree-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--fw-teal-border);
    background: var(--fw-teal-faint);
    cursor: pointer;
  }
  .tnt-agree-box input {
    margin-top: 2px;
    width: 17px; height: 17px;
    accent-color: var(--fw-teal);
    cursor: pointer;
    flex-shrink: 0;
  }
  .tnt-agree-box__text { font-size: 13px; color: var(--fw-navy); font-weight: 600; line-height: 1.6; }
  .tnt-agree-box__text span { font-weight: 800; color: var(--fw-teal-dark); }

  /* ── Submit button ── */
  .tnt-submit {
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
  .tnt-submit:hover { background: var(--fw-teal); box-shadow: 0 6px 24px rgba(28,148,164,0.3); }
  .tnt-submit:active { transform: scale(0.99); }
  .tnt-submit:disabled { background: var(--c-ink-3); cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── Error banner ── */
  .tnt-error {
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
  .tnt-error i { color: var(--fw-teal); font-size: 15px; flex-shrink: 0; }

  /* ── Success screen ── */
  .tnt-success { text-align: center; padding: 80px 30px; }
  .tnt-success__circle {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--fw-navy), var(--fw-teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.7rem;
    margin: 0 auto 26px;
    box-shadow: 0 8px 28px rgba(28,148,164,0.3);
  }
  .tnt-success__title {
    font-family: var(--font-display);
    font-size: clamp(26px, 4vw, 34px);
    font-weight: 400;
    color: var(--fw-navy);
    margin-bottom: 12px;
    letter-spacing: -0.4px;
  }
  .tnt-success__body {
    font-size: 14.5px;
    color: var(--c-ink-3);
    max-width: 460px;
    margin: 0 auto 28px;
    line-height: 1.75;
  }
  .tnt-success__badge {
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
  .tnt-success__badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--fw-teal); }
  .tnt-again-btn {
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
  .tnt-again-btn:hover { background: var(--fw-teal); color: var(--c-white); box-shadow: 0 6px 22px rgba(28,148,164,0.3); }

  /* ── Banner (shared) ── */
  .fwc-banner { position: relative; overflow: hidden; background: #252060; }
  .fwc-banner__bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.18; }
  .fwc-banner__inner { position: relative; z-index: 2; padding: 80px 20px 72px; text-align: center; }
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
  .fwc-banner__crumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.15s; }
  .fwc-banner__crumb a:hover { color: #7dd8e4; }
  .fwc-banner__crumb li:last-child { color: rgba(255,255,255,0.35); }
`;

function injectTenantStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("tenant-landlord-form-styles")
  ) {
    const el = document.createElement("style");
    el.id = "tenant-landlord-form-styles";
    el.textContent = TENANT_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Constants (from PDF) ──────────────────────────────────────
const PROPERTY_TYPE_OPTIONS = [
  "Room",
  "Flat",
  "House",
  "Shutter",
  "Apartment",
  "Land",
];
const PROPERTY_CATEGORY_OPTIONS = ["Residential", "Commercial"];
const VEHICLE_OPTIONS = ["Two-wheeler", "Three-wheeler", "Four-wheeler"];
const FACILITY_OPTIONS = [
  "Parking Availability",
  "Power Backup",
  "Security",
  "24/7 Water",
  "Pool",
  "Gym",
  "Spa",
  "Elevator",
  "Hot Water",
  "Air Conditioned",
  "Garden",
  "Park",
  "Internet",
  "TV Cable",
];

const NAV_ITEMS = [
  { id: "sec-personal", label: "Personal Details" },
  { id: "sec-request", label: "Request Type" },
  { id: "sec-household", label: "Household" },
  { id: "sec-facilities", label: "Facilities" },
  { id: "sec-description", label: "Description" },
  { id: "sec-id", label: "ID Verification" },
  { id: "sec-terms", label: "Terms & Conditions" },
];

const AGENCY_INFO = {
  address: "Baluwatar, Kathmandu",
  contacts: "9861126980, 9823488860",
  email: "futureworkestate01@gmail.com",
  pan: "610495137",
};

const INITIAL_FORM: TenantFormData = {
  full_name: "",
  date_of_birth: "",
  temporary_address: "",
  permanent_address: "",
  contact_no: "",
  email: "",
  occupation: "",
  request_type: "Rent",
  property_types: [],
  property_category: [],
  preferred_location: "",
  budget: "",
  adults: "0",
  children: "0",
  pets: "0",
  vehicles: [],
  facilities: [],
  description: "",
  agreed_to_terms: false,
};

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
      <label className="tnt-label">
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {hint && <div className="tnt-hint">{hint}</div>}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────
function TntCard({
  id,
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
    <div className="tnt-card" id={id}>
      <div className="tnt-card__header">
        <div>
          <div className="tnt-card__title">{title}</div>
          {subtitle && <div className="tnt-card__subtitle">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Chip multi-select ──────────────────────────────────────────
function ChipMultiSelect({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="chip-grid">
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <label key={opt} className={`chip-label${checked ? " checked" : ""}`}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(opt)}
            />
            <span className="chip-check-icon">{checked ? "✓" : ""}</span>
            {opt}
          </label>
        );
      })}
    </div>
  );
}

// ─── Counter input ──────────────────────────────────────────────
function CounterBox({
  label,
  value,
  onChange,
  max = 20,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
}) {
  const num = parseInt(value || "0", 10);
  return (
    <div className="counter-box">
      <div className="counter-box__label">{label}</div>
      <div className="counter-box__controls">
        <button
          type="button"
          className="counter-btn"
          disabled={num <= 0}
          onClick={() => onChange(String(Math.max(0, num - 1)))}
        >
          −
        </button>
        <div className="counter-value">{num}</div>
        <button
          type="button"
          className="counter-btn"
          disabled={num >= max}
          onClick={() => onChange(String(Math.min(max, num + 1)))}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── ID Uploader (single image file — no PDF) ──────────────────
function IdUploader({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      {!file ? (
        <div className="upload-zone" onClick={() => ref.current?.click()}>
          <div className="upload-zone__icon">🪪</div>
          <div className="upload-zone__title">Upload ID / Citizenship Card</div>
          <div className="upload-zone__sub">PNG, JPG, WEBP · Max 10MB</div>
          <input
            ref={ref}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              onChange(f);
              if (ref.current) ref.current.value = "";
            }}
          />
        </div>
      ) : (
        <div className="id-preview">
          <img src={URL.createObjectURL(file)} alt={file.name} />
          <div className="id-preview__name">{file.name}</div>
          <button
            type="button"
            className="id-preview__remove"
            onClick={() => onChange(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const TenantLandlordFormArea = () => {
  injectTenantStyles();

  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [form, setForm] = useState<TenantFormData>({ ...INITIAL_FORM });

  const set = <K extends keyof TenantFormData>(
    key: K,
    value: TenantFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleInArray = (key: keyof TenantFormData, value: string) => {
    const current = form[key] as string[];
    const next = current.includes(value)
      ? current.filter((x) => x !== value)
      : [...current, value];
    set(key, next as any);
  };

  // Progress: count non-empty required fields
  const filledCount = [
    form.full_name,
    form.contact_no,
    form.email,
    form.permanent_address,
    form.preferred_location,
    form.budget,
  ].filter(Boolean).length;
  const requiredTotal = 7; // includes agreed_to_terms
  const progressPct = Math.round(
    ((filledCount + (form.agreed_to_terms ? 1 : 0)) / requiredTotal) * 100,
  );

  // ─── cPanel upload (mirrors uploadImage in app.js / SellPropertyArea) ───
  async function uploadIdFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "listings"); // reuses existing allowed folder — no PHP change needed

    const headers: Record<string, string> = {};
    if (CPANEL_UPLOAD_SECRET) headers["X-Upload-Secret"] = CPANEL_UPLOAD_SECRET;

    const res = await fetch(CPANEL_UPLOAD_URL, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      let msg = `Upload failed (${res.status})`;
      try {
        const errBody = await res.json();
        if (errBody?.error) msg = errBody.error;
      } catch (_) {}
      throw new Error(msg);
    }

    const json = await res.json();
    if (!json.url) throw new Error("Upload response missing URL.");
    return json.url;
  }

  const handleSubmit = async () => {
    setError(null);
    if (!form.full_name.trim()) return setError("Please enter your full name.");
    if (!form.contact_no.trim())
      return setError("Please enter your contact number.");
    if (!form.email.trim()) return setError("Please enter your email address.");
    if (!form.permanent_address.trim())
      return setError("Please enter your permanent address.");
    if (!form.preferred_location.trim())
      return setError("Please enter your preferred location.");
    if (!form.budget.trim()) return setError("Please enter your budget.");
    if (!form.agreed_to_terms)
      return setError("Please agree to the Terms & Conditions to continue.");

    setSubmitting(true);
    try {
      const idDocUrl = idFile ? await uploadIdFile(idFile) : null;

      const { error: dbErr } = await supabase
        .from("tenant_landlord_requests")
        .insert([
          {
            full_name: form.full_name.trim(),
            date_of_birth: form.date_of_birth || null,
            temporary_address: form.temporary_address.trim() || null,
            permanent_address: form.permanent_address.trim(),
            contact_no: form.contact_no.trim(),
            email: form.email.trim(),
            occupation: form.occupation.trim() || null,
            request_type: form.request_type,
            property_types: form.property_types,
            property_category: form.property_category,
            preferred_location: form.preferred_location.trim(),
            budget: form.budget.trim(),
            adults: parseInt(form.adults) || 0,
            children: parseInt(form.children) || 0,
            pets: parseInt(form.pets) || 0,
            vehicles: form.vehicles,
            facilities: form.facilities,
            description: form.description.trim() || null,
            id_document_url: idDocUrl,
            agreed_to_terms: form.agreed_to_terms,
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
      <SEO pageTitle="Tenant / Landlord Form – Future Work Estate Agency" />
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      {/* ── Banner ── */}
      <div className="fwc-banner">
        <div
          className="fwc-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwc-banner__inner">
          <h2 className="fwc-banner__title">
            Tenant / <em>Landlord</em> Form
          </h2>
          <ul className="fwc-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Tenant / Landlord Form</li>
          </ul>
        </div>
      </div>

      {/* ── Form section ── */}
      <div className="tnt-root tnt-section">
        <div className="container">
          {step === "form" && (
            <div className="tnt-page-head">
              <div className="tnt-page-eyebrow">Future Work Estate Agency</div>
              <h1 className="tnt-page-title">
                Tenant / <em>Landlord</em> Intake Form
              </h1>
              <p className="tnt-page-sub">
                Please fill in your details accurately. Our team will review
                your submission and contact you regarding suitable rent or sale
                options.
              </p>
              <div className="tnt-page-meta">
                <span>
                  Office: <strong>{AGENCY_INFO.address}</strong>
                </span>
                <span>
                  Contact: <strong>{AGENCY_INFO.contacts}</strong>
                </span>
                <span>
                  Email: <strong>{AGENCY_INFO.email}</strong>
                </span>
              </div>
            </div>
          )}

          {step === "success" ? (
            <div className="tnt-card">
              <div className="tnt-success">
                <div className="tnt-success__circle">✓</div>
                <div className="tnt-success__title">Form Submitted!</div>
                <p className="tnt-success__body">
                  Thank you, {form.full_name || "valued client"}! Your tenant /
                  landlord form has been received. Our team will reach out at{" "}
                  <strong>{form.email}</strong> or{" "}
                  <strong>{form.contact_no}</strong> shortly.
                </p>
                <div className="tnt-success__badge">Pending Review</div>
                <br />
                <button
                  className="tnt-again-btn"
                  onClick={() => {
                    setStep("form");
                    setForm({ ...INITIAL_FORM });
                    setIdFile(null);
                  }}
                >
                  Submit Another Form
                </button>
              </div>
            </div>
          ) : (
            <div className="tnt-layout">
              {/* ── Sticky sidebar ── */}
              <aside className="tnt-sidebar">
                <span className="tnt-sidebar__label">Sections</span>
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="tnt-nav-item"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <span className="tnt-nav-dot" />
                    {item.label}
                  </a>
                ))}

                <div className="tnt-progress">
                  <div className="tnt-progress__label">
                    <span>Required fields</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="tnt-progress__track">
                    <div
                      className="tnt-progress__fill"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="tnt-side-note">
                  <strong>PAN No.</strong>
                  {AGENCY_INFO.pan}
                </div>
              </aside>

              {/* ── Form cards ── */}
              <div>
                {/* Personal Details */}
                <TntCard
                  id="sec-personal"
                  icon="👤"
                  title="Personal Details"
                  subtitle="Your basic contact and identification information"
                >
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Field label="Full Name" required>
                        <input
                          className="tnt-input"
                          placeholder="e.g. Aarav Sharma"
                          value={form.full_name}
                          onChange={(e) => set("full_name", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Date of Birth">
                        <input
                          type="date"
                          className="tnt-input"
                          value={form.date_of_birth}
                          onChange={(e) => set("date_of_birth", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Contact No." required>
                        <input
                          type="tel"
                          className="tnt-input"
                          placeholder="+977 98XXXXXXXX"
                          value={form.contact_no}
                          onChange={(e) => set("contact_no", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Email" required>
                        <input
                          type="email"
                          className="tnt-input"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Temporary Address">
                        <input
                          className="tnt-input"
                          placeholder="e.g. Baneshwor, Kathmandu"
                          value={form.temporary_address}
                          onChange={(e) =>
                            set("temporary_address", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Permanent Address" required>
                        <input
                          className="tnt-input"
                          placeholder="e.g. Pokhara-5, Kaski"
                          value={form.permanent_address}
                          onChange={(e) =>
                            set("permanent_address", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Occupation">
                        <input
                          className="tnt-input"
                          placeholder="e.g. Software Engineer"
                          value={form.occupation}
                          onChange={(e) => set("occupation", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                </TntCard>

                {/* Request Type */}
                <TntCard
                  id="sec-request"
                  icon="🏠"
                  title="Request Type & Property Preference"
                  subtitle="What are you looking for, and where?"
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <Field label="I am looking to">
                        <div className="pill-toggle">
                          {(["Rent", "Sale"] as const).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-toggle__btn${
                                form.request_type === opt ? " active" : ""
                              }`}
                              onClick={() => set("request_type", opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Property Type" hint="Select all that apply">
                        <ChipMultiSelect
                          options={PROPERTY_TYPE_OPTIONS}
                          selected={form.property_types}
                          onToggle={(v) => toggleInArray("property_types", v)}
                        />
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Category" hint="Select all that apply">
                        <ChipMultiSelect
                          options={PROPERTY_CATEGORY_OPTIONS}
                          selected={form.property_category}
                          onToggle={(v) =>
                            toggleInArray("property_category", v)
                          }
                        />
                      </Field>
                    </div>
                    <div className="col-md-8">
                      <Field
                        label="Preferred Location / Property Location"
                        required
                      >
                        <input
                          className="tnt-input"
                          placeholder="e.g. Lazimpat, Kathmandu"
                          value={form.preferred_location}
                          onChange={(e) =>
                            set("preferred_location", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <Field label="Budget" required>
                        <input
                          className="tnt-input"
                          placeholder="e.g. NPR 25,000/mo"
                          value={form.budget}
                          onChange={(e) => set("budget", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                </TntCard>

                {/* Household */}
                <TntCard
                  id="sec-household"
                  icon="👨‍👩‍👧"
                  title="Household & Vehicle"
                  subtitle="Number of members and vehicles you own"
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <Field label="No. of Members">
                        <div className="counter-grid">
                          <CounterBox
                            label="Adults"
                            value={form.adults}
                            onChange={(v) => set("adults", v)}
                          />
                          <CounterBox
                            label="Children"
                            value={form.children}
                            onChange={(v) => set("children", v)}
                          />
                          <CounterBox
                            label="Pets"
                            value={form.pets}
                            onChange={(v) => set("pets", v)}
                          />
                        </div>
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Vehicle(s)" hint="Select all that apply">
                        <ChipMultiSelect
                          options={VEHICLE_OPTIONS}
                          selected={form.vehicles}
                          onToggle={(v) => toggleInArray("vehicles", v)}
                        />
                      </Field>
                    </div>
                  </div>
                </TntCard>

                {/* Facilities */}
                <TntCard
                  id="sec-facilities"
                  icon="✨"
                  title="Facilities Required"
                  subtitle="Select all the facilities you'd like in the property"
                >
                  <ChipMultiSelect
                    options={FACILITY_OPTIONS}
                    selected={form.facilities}
                    onToggle={(v) => toggleInArray("facilities", v)}
                  />
                </TntCard>

                {/* Description */}
                <TntCard
                  id="sec-description"
                  icon="📝"
                  title="Description"
                  subtitle="Any other details you'd like to share (optional)"
                >
                  <Field label="Additional Notes">
                    <textarea
                      className="tnt-textarea"
                      placeholder="Anything else we should know — move-in timeline, specific requirements, etc."
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </Field>
                </TntCard>

                {/* ID Verification */}
                <TntCard
                  id="sec-id"
                  icon="🪪"
                  title="ID Verification"
                  subtitle="Attach your identity card or citizenship card for processing"
                >
                  <IdUploader file={idFile} onChange={setIdFile} />
                </TntCard>

                {/* Terms & Conditions */}
                <TntCard
                  id="sec-terms"
                  icon="📄"
                  title="Terms & Conditions"
                  subtitle="Please read carefully before submitting"
                >
                  <div className="tnt-terms-list">
                    <div className="tnt-term">
                      <span className="tnt-term__num">1</span>
                      <span>
                        I accept to be a valuable member of Future Work Estate
                        Agency.
                      </span>
                    </div>
                    <div className="tnt-term">
                      <span className="tnt-term__num">2</span>
                      <span>
                        I accept to pay the agreed service charge percentage of
                        the total rent and sale amount to Future Work Estate
                        Agency, without bargaining with the office.
                      </span>
                    </div>
                    <div className="tnt-term">
                      <span className="tnt-term__num">3</span>
                      <span>
                        I accept not to hold Future Work Estate Agency
                        responsible for any issues or unsocial activities caused
                        by the owner at the property where I am shifted through
                        this form.
                      </span>
                    </div>
                    <div className="tnt-term">
                      <span className="tnt-term__num">4</span>
                      <span>
                        I accept to attach or submit my identity card or
                        citizenship card with this form for further processing.
                      </span>
                    </div>
                    <div className="tnt-term">
                      <span className="tnt-term__num">5</span>
                      <span>
                        Nrs. 300 will be charged at the beginning, before
                        showing the property for rent, by Future Work Estate
                        Agency as a processing charge.
                      </span>
                    </div>
                  </div>

                  <label className="tnt-agree-box">
                    <input
                      type="checkbox"
                      checked={form.agreed_to_terms}
                      onChange={(e) => set("agreed_to_terms", e.target.checked)}
                    />
                    <span className="tnt-agree-box__text">
                      I have read and agree to the{" "}
                      <span>Terms & Conditions</span> stated above.
                    </span>
                  </label>
                </TntCard>

                {/* Error */}
                {error && (
                  <div className="tnt-error">
                    <i className="bi bi-exclamation-circle" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  className="tnt-submit mb-5"
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
                    <>Submit Form →</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <Brand /> */}
      {/* <FancyBanner /> */}
      <FutureFooter />
    </Wrapper>
  );
};

export default TenantLandlordFormArea;

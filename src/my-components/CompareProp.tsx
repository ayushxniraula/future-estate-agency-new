// ============================================================
//  PropertyCompare.tsx — Advanced 2-property comparison page
//  Theme: FutureWork (#252060 navy + #1C94A4 teal)
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";

import FutureFooter from "../layouts/footers/FutureFooter";
import { Link, useSearchParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import NavMenu from "../layouts/headers/Menu/FutureNavMenu";
import LoginModal from "../modals/LoginModal";
import { useClientSession } from "./userclientsession";

// ─── Supabase ─────────────────────────────────────────────────
const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
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

// ─── Styles ───────────────────────────────────────────────────
const COMPARE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  :root {
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body:    'DM Sans', system-ui, sans-serif;
    --c-ink:        #252060;
    --c-ink-2:      #3d3880;
    --c-ink-3:      #8a88a8;
    --c-rule:       #e8e7f0;
    --c-surface:    #f5f5fb;
    --c-white:      #ffffff;
    --c-accent:     #1C94A4;
    --c-accent-h:   #157a88;
    --c-better:     #1C94A4;
    --c-better-bg:  #e8f7f9;
    --c-worse:      #252060;
    --c-worse-bg:   #eeedf8;
    --c-equal:      #8a88a8;
    --radius-card:  16px;
    --radius-sm:    10px;
    --shadow-card:  0 1px 3px rgba(37,32,96,0.06), 0 4px 16px rgba(37,32,96,0.08);
    --shadow-hover: 0 4px 8px rgba(37,32,96,0.10), 0 16px 40px rgba(37,32,96,0.14);
  }

  .cmp-root, .cmp-root * { font-family: var(--font-body); box-sizing: border-box; }

  .cmp-page {
    min-height: 100vh;
    background: var(--c-surface);
    padding-bottom: 80px;
  }

  /* ── Top bar ── */
  .cmp-topbar {
    background: var(--c-white);
    border-bottom: 1px solid var(--c-rule);
    padding: 18px 0;
  }
  .cmp-topbar__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .cmp-topbar__left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .cmp-back-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500; color: var(--c-ink-3);
    text-decoration: none; padding: 6px 12px; border-radius: 20px;
    border: 1px solid var(--c-rule); background: var(--c-surface);
    transition: all 0.18s;
  }
  .cmp-back-link:hover { border-color: var(--c-ink); color: var(--c-ink); }
  .cmp-topbar__title {
    font-family: var(--font-display); font-size: 20px;
    font-weight: 400; color: var(--c-ink); letter-spacing: -0.2px;
  }
  .cmp-topbar__subtitle { font-size: 12.5px; color: var(--c-ink-3); margin-top: 1px; }
  .cmp-share-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; color: var(--c-ink-2);
    padding: 8px 18px; border-radius: 20px;
    border: 1.5px solid var(--c-rule); background: var(--c-white);
    cursor: pointer; transition: all 0.18s;
  }
  .cmp-share-btn:hover { border-color: var(--c-ink); color: var(--c-ink); }
  .cmp-share-btn.copied { border-color: var(--c-better); color: var(--c-better); }

  /* ── Legend ── */
  .cmp-legend {
    display: flex; align-items: center; gap: 18px;
    padding: 10px 0 14px; flex-wrap: wrap;
  }
  .cmp-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--c-ink-3); font-weight: 500; }
  .cmp-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* ── Sticky header ── */
  .cmp-sticky-header {
    position: sticky; top: 0; z-index: 100;
    background: var(--c-white);
    border-bottom: 1px solid var(--c-rule);
    box-shadow: 0 2px 12px rgba(37,32,96,0.08);
  }
  .cmp-sticky-header__inner {
    display: grid; grid-template-columns: 220px 1fr 1fr;
    align-items: stretch;
  }
  .cmp-sticky-header__label {
    padding: 14px 20px; display: flex; align-items: center;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: var(--c-ink-3);
    border-right: 1px solid var(--c-rule); background: var(--c-surface);
  }
  .cmp-sticky-prop {
    padding: 10px 16px; border-right: 1px solid var(--c-rule);
    display: flex; align-items: center; gap: 10px; min-width: 0;
  }
  .cmp-sticky-prop:last-child { border-right: none; }
  .cmp-sticky-prop__thumb {
    width: 44px; height: 36px; border-radius: 7px;
    overflow: hidden; flex-shrink: 0; background: var(--c-surface);
  }
  .cmp-sticky-prop__thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cmp-sticky-prop__name {
    font-size: 13px; font-weight: 600; color: var(--c-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    min-width: 0; flex: 1;
  }
  .cmp-sticky-prop__price {
    font-family: var(--font-display); font-size: 14px;
    color: var(--c-ink-2); white-space: nowrap; flex-shrink: 0;
  }

  /* ── Cards header ── */
  .cmp-header-grid {
    display: grid; grid-template-columns: 220px 1fr 1fr;
    gap: 0; align-items: stretch; border-bottom: 1px solid var(--c-rule);
  }
  .cmp-header-spacer {
    background: var(--c-ink); border-right: 1px solid rgba(255,255,255,0.08);
    padding: 24px 20px; display: flex; flex-direction: column;
    align-items: flex-start; justify-content: space-between;
  }
  .cmp-spacer-eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    margin-bottom: 6px; display: block;
  }
  .cmp-spacer-title {
    font-family: var(--font-display); font-size: 18px;
    font-weight: 400; color: #fff; line-height: 1.3; margin-bottom: 10px;
  }
  .cmp-spacer-desc { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.6; }
  .cmp-prop-header {
    background: var(--c-white); border-right: 1px solid var(--c-rule);
    padding: 0; display: flex; flex-direction: column; position: relative;
  }
  .cmp-prop-header:last-child { border-right: none; }

  .cmp-prop-img { position: relative; overflow: hidden; height: 200px; }
  .cmp-prop-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
  .cmp-prop-header:hover .cmp-prop-img img { transform: scale(1.04); }
  .cmp-prop-img__placeholder { width: 100%; height: 200px; background: var(--c-surface); display: flex; align-items: center; justify-content: center; font-size: 3rem; }

  .cmp-status-badge {
    position: absolute; top: 10px; left: 10px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.6px;
    color: #fff; z-index: 2;
  }
  .cmp-remove-btn {
    position: absolute; top: 10px; right: 10px;
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(37,32,96,0.55); backdrop-filter: blur(6px);
    border: none; color: #fff; display: flex; align-items: center;
    justify-content: center; font-size: 12px; cursor: pointer;
    transition: background 0.2s, transform 0.2s; z-index: 3;
  }
  .cmp-remove-btn:hover { background: var(--c-accent); transform: scale(1.1); }

  .cmp-prop-header__body { padding: 16px 18px 14px; flex: 1; }
  .cmp-prop-header__type {
    font-size: 10px; font-weight: 700; letter-spacing: 0.9px;
    text-transform: uppercase; color: var(--c-ink-3); margin-bottom: 4px;
  }
  .cmp-prop-header__title {
    font-family: var(--font-display); font-size: 16px; font-weight: 400;
    color: var(--c-ink); line-height: 1.25; text-decoration: none;
    display: block; margin-bottom: 5px; transition: color 0.18s;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cmp-prop-header__title:hover { color: var(--c-accent); }
  .cmp-prop-header__loc {
    font-size: 12px; color: var(--c-ink-3);
    display: flex; align-items: center; gap: 3px; margin-bottom: 10px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cmp-prop-header__price {
    font-family: var(--font-display); font-size: 20px; font-weight: 400;
    color: var(--c-ink); letter-spacing: -0.4px;
  }
  .cmp-prop-header__price sup { font-family: var(--font-body); font-size: 11px; font-weight: 500; color: var(--c-ink-3); vertical-align: super; margin-right: 1px; }
  .cmp-prop-header__price sub { font-family: var(--font-body); font-size: 11px; color: var(--c-ink-3); }

  .cmp-prop-header__footer {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 18px 14px; border-top: 1px solid var(--c-rule);
    background: var(--c-surface);
  }
  .cmp-btn-sm {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 600; padding: 5px 12px;
    border-radius: 8px; text-decoration: none; border: none;
    cursor: pointer; transition: all 0.18s; font-family: var(--font-body);
  }
  .cmp-btn-sm--outline {
    border: 1.5px solid var(--c-rule); color: var(--c-ink-2); background: var(--c-white);
  }
  .cmp-btn-sm--outline:hover { border-color: var(--c-ink); color: var(--c-ink); }
  .cmp-btn-sm--fill { background: var(--c-ink); color: #fff; border: 1.5px solid var(--c-ink); }
  .cmp-btn-sm--fill:hover { background: var(--c-accent); border-color: var(--c-accent); }

  /* ── Empty slot ── */
  .cmp-empty-slot {
    background: var(--c-surface); border-right: 1px solid var(--c-rule);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 320px; padding: 24px;
    position: relative; gap: 16px;
  }
  .cmp-empty-slot:last-child { border-right: none; }
  .cmp-empty-icon {
    width: 56px; height: 56px; border-radius: 50%;
    border: 2px dashed var(--c-rule);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; color: var(--c-ink-3);
  }
  .cmp-empty-slot__text { font-family: var(--font-display); font-size: 17px; color: var(--c-ink-3); text-align: center; }
  .cmp-empty-slot__sub { font-size: 12.5px; color: var(--c-ink-3); text-align: center; margin-top: -8px; }
  .cmp-add-btn {
    padding: 10px 22px; border-radius: var(--radius-sm);
    background: var(--c-ink); color: #fff;
    font-size: 13px; font-weight: 600; font-family: var(--font-body);
    border: none; cursor: pointer; transition: background 0.2s;
  }
  .cmp-add-btn:hover { background: var(--c-accent); }

  /* ── Section group header ── */
  .cmp-group-header {
    display: grid; grid-template-columns: 220px 1fr 1fr;
    background: var(--c-ink); cursor: pointer;
    transition: background 0.18s; user-select: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cmp-group-header:hover { background: #1e1a52; }
  .cmp-group-header__cell {
    padding: 12px 20px; display: flex; align-items: center; gap: 8px;
  }
  .cmp-group-header__title {
    font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: rgba(255,255,255,0.7);
  }
  .cmp-group-header__icon { font-size: 14px; opacity: 0.5; }
  .cmp-group-header__chevron {
    margin-left: auto; font-size: 11px; color: rgba(255,255,255,0.35);
    transition: transform 0.22s;
  }
  .cmp-group-header__chevron.open { transform: rotate(180deg); }
  .cmp-group-header__count { font-size: 10px; font-weight: 600; letter-spacing: 0.4px; color: rgba(255,255,255,0.35); margin-left: 6px; }

  /* ── Comparison rows ── */
  .cmp-row {
    display: grid; grid-template-columns: 220px 1fr 1fr;
    border-bottom: 1px solid var(--c-rule); transition: background 0.14s;
  }
  .cmp-row:last-child { border-bottom: none; }
  .cmp-row:hover { background: rgba(37,32,96,0.02); }

  .cmp-row__label-cell {
    padding: 14px 20px; display: flex; align-items: center;
    font-size: 12.5px; font-weight: 600; color: var(--c-ink-2);
    background: var(--c-surface); border-right: 1px solid var(--c-rule);
    position: sticky; left: 0; z-index: 2;
  }
  .cmp-row__label-icon {
    width: 26px; height: 26px; border-radius: 7px;
    background: var(--c-white); border: 1px solid var(--c-rule);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; margin-right: 8px; flex-shrink: 0;
  }

  .cmp-row__val {
    padding: 14px 18px; display: flex; align-items: center;
    font-size: 13.5px; font-weight: 500; color: var(--c-ink);
    border-right: 1px solid var(--c-rule); position: relative;
    min-height: 52px; transition: background 0.18s;
  }
  .cmp-row__val:last-child { border-right: none; }
  .cmp-row__val.diff-better { background: var(--c-better-bg); color: #0e6e7a; }
  .cmp-row__val.diff-worse  { background: var(--c-worse-bg);  color: var(--c-ink); }
  .cmp-row__val.diff-equal  { color: var(--c-ink-2); }
  .cmp-row__val.diff-na     { color: var(--c-ink-3); font-weight: 400; font-style: italic; }

  .cmp-diff-badge {
    position: absolute; top: 8px; right: 8px;
    font-size: 9px; font-weight: 800; letter-spacing: 0.5px;
    padding: 2px 6px; border-radius: 6px; text-transform: uppercase;
  }
  .cmp-diff-badge.better { background: var(--c-better); color: #fff; }
  .cmp-diff-badge.worse  { background: var(--c-ink);    color: #fff; }

  .cmp-amenity-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
  .cmp-amenity-tag {
    font-size: 11px; font-weight: 500; padding: 3px 9px;
    border-radius: 7px; border: 1px solid var(--c-rule);
    background: var(--c-white); color: var(--c-ink-2);
  }
  .cmp-amenity-tag.has     { background: var(--c-better-bg); border-color: #a8dde4; color: #0e6e7a; }
  .cmp-amenity-tag.missing { background: var(--c-worse-bg);  border-color: #c9c7e8; color: var(--c-ink-3); opacity: 0.7; text-decoration: line-through; }

  .cmp-nearby-list { display: flex; flex-direction: column; gap: 4px; width: 100%; }
  .cmp-nearby-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; padding: 3px 0; border-bottom: 1px dashed var(--c-rule); }
  .cmp-nearby-row:last-child { border-bottom: none; }
  .cmp-nearby-row__key { color: var(--c-ink-3); }
  .cmp-nearby-row__val { font-weight: 600; font-size: 12px; }
  .cmp-nearby-row__val.better { color: var(--c-better); }
  .cmp-nearby-row__val.worse  { color: var(--c-ink); }

  /* ── Summary strip ── */
  .cmp-summary {
    display: grid; grid-template-columns: 220px 1fr 1fr;
    background: var(--c-ink); margin-top: 0;
  }
  .cmp-summary__label {
    padding: 20px; display: flex; align-items: center;
    font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: rgba(255,255,255,0.45);
    border-right: 1px solid rgba(255,255,255,0.07);
  }
  .cmp-summary__cell {
    padding: 20px 18px; border-right: 1px solid rgba(255,255,255,0.07);
    display: flex; flex-direction: column; gap: 4px;
  }
  .cmp-summary__cell:last-child { border-right: none; }
  .cmp-summary__score { font-family: var(--font-display); font-size: 32px; font-weight: 400; color: #fff; line-height: 1; }
  .cmp-summary__score-label { font-size: 11.5px; color: rgba(255,255,255,0.4); }
  .cmp-summary__wins { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; }
  .cmp-summary__wins strong { color: rgba(255,255,255,0.8); }
  .cmp-summary__winner-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px;
    padding: 4px 10px; border-radius: 8px; margin-top: 6px;
    background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.8);
  }
  .cmp-summary__winner-badge.winner { background: rgba(28,148,164,0.5); color: #a8eaf0; }

  /* ── Search modal ── */
  .cmp-modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(37,32,96,0.55); backdrop-filter: blur(6px);
    display: flex; align-items: flex-start; justify-content: center;
    padding-top: 80px; animation: fadeIn 0.18s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .cmp-modal {
    background: var(--c-white); border-radius: var(--radius-card);
    box-shadow: 0 20px 80px rgba(37,32,96,0.22);
    width: 100%; max-width: 560px; max-height: 70vh;
    display: flex; flex-direction: column; overflow: hidden;
    animation: slideUp 0.22s ease;
    margin: 0 16px;
  }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .cmp-modal__header {
    padding: 18px 20px 12px; border-bottom: 1px solid var(--c-rule);
    display: flex; align-items: center; gap: 10px;
  }
  .cmp-modal__search-wrap { flex: 1; position: relative; display: flex; align-items: center; }
  .cmp-modal__search-icon { position: absolute; left: 12px; font-size: 14px; color: var(--c-ink-3); pointer-events: none; }
  .cmp-modal__search {
    width: 100%; padding: 10px 12px 10px 36px;
    border-radius: var(--radius-sm); border: 1.5px solid var(--c-rule);
    font-size: 14px; font-family: var(--font-body);
    color: var(--c-ink); background: var(--c-surface); outline: none;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }
  .cmp-modal__search:focus {
    border-color: var(--c-ink); background: var(--c-white);
    box-shadow: 0 0 0 3px rgba(37,32,96,0.08);
  }
  .cmp-modal__close {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid var(--c-rule); background: var(--c-white);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: var(--c-ink-3); cursor: pointer;
    transition: all 0.18s; flex-shrink: 0;
  }
  .cmp-modal__close:hover { border-color: var(--c-ink); color: var(--c-ink); }
  .cmp-modal__body { flex: 1; overflow-y: auto; padding: 8px 0; }
  .cmp-modal__item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 20px; cursor: pointer; transition: background 0.14s;
    border-bottom: 1px solid rgba(232,231,240,0.6);
  }
  .cmp-modal__item:last-child { border-bottom: none; }
  .cmp-modal__item:hover { background: var(--c-surface); }
  .cmp-modal__item.selected { background: #e8f7f9; }
  .cmp-modal__thumb { width: 52px; height: 40px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: var(--c-surface); }
  .cmp-modal__thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cmp-modal__item-body { flex: 1; min-width: 0; }
  .cmp-modal__item-title { font-size: 13.5px; font-weight: 600; color: var(--c-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
  .cmp-modal__item-meta { font-size: 12px; color: var(--c-ink-3); }
  .cmp-modal__item-price { font-family: var(--font-display); font-size: 15px; color: var(--c-ink); flex-shrink: 0; }
  .cmp-modal__check { width: 22px; height: 22px; border-radius: 50%; background: var(--c-better); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; font-weight: 800; }
  .cmp-modal__empty { padding: 40px 20px; text-align: center; color: var(--c-ink-3); font-size: 14px; }

  /* ── Table container ── */
  .cmp-table {
    border: 1px solid var(--c-rule); border-radius: var(--radius-card);
    overflow: hidden; overflow-x: auto;
    background: var(--c-white); box-shadow: var(--shadow-card);
    -webkit-overflow-scrolling: touch;
  }
  .cmp-table__inner { min-width: 700px; }

  .cmp-table::-webkit-scrollbar { height: 6px; }
  .cmp-table::-webkit-scrollbar-track { background: var(--c-surface); }
  .cmp-table::-webkit-scrollbar-thumb { background: var(--c-rule); border-radius: 3px; }

  /* ── Shimmer skeleton ── */
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .cmp-skeleton {
    background: linear-gradient(90deg, #eeedf8 25%, #f5f5fb 50%, #eeedf8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cmp-sticky-header__inner { grid-template-columns: 160px 1fr 1fr; }
    .cmp-header-grid { grid-template-columns: 160px 1fr 1fr; }
    .cmp-group-header { grid-template-columns: 160px 1fr 1fr; }
    .cmp-row { grid-template-columns: 160px 1fr 1fr; }
    .cmp-summary { grid-template-columns: 160px 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .cmp-sticky-header__inner { grid-template-columns: 100px 1fr 1fr; }
    .cmp-header-grid { grid-template-columns: 100px 1fr 1fr; }
    .cmp-group-header { grid-template-columns: 100px 1fr 1fr; }
    .cmp-row { grid-template-columns: 100px 1fr 1fr; }
    .cmp-summary { grid-template-columns: 100px 1fr 1fr; }
    .cmp-row__label-cell { font-size: 11px; padding: 10px 8px; }
    .cmp-row__val { padding: 10px 8px; font-size: 12px; }
    .cmp-topbar__inner { flex-direction: column; align-items: flex-start; }
    .cmp-header-spacer { padding: 16px 14px; }
    .cmp-spacer-title { font-size: 15px; }
  }
  @media (max-width: 400px) {
    .cmp-prop-header__price { font-size: 16px; }
    .cmp-summary__score { font-size: 26px; }
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

function injectCompareStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("property-compare-styles")
  ) {
    const el = document.createElement("style");
    el.id = "property-compare-styles";
    el.textContent = COMPARE_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Helpers ──────────────────────────────────────────────────
function statusColor(status: string): string {
  switch (status) {
    case "For Sale":
      return "rgba(28,148,164,0.92)";
    case "For Rent":
      return "rgba(37,32,96,0.92)";
    case "Sold":
      return "rgba(28,148,164,0.75)";
    case "Rented":
      return "rgba(37,32,96,0.7)";
    default:
      return "rgba(61,56,128,0.88)";
  }
}

function formatKey(k: string): string {
  return k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtPrice(p: number): string {
  return (
    "$" +
    p.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

// ─── Diff logic ───────────────────────────────────────────────
type DiffDir = "better" | "worse" | "equal" | "na";

function numericDiff(
  a: number | null | undefined,
  b: number | null | undefined,
  higherIsBetter: boolean = true,
): [DiffDir, DiffDir] {
  if (a == null && b == null) return ["na", "na"];
  if (a == null) return ["na", higherIsBetter ? "better" : "worse"];
  if (b == null) return [higherIsBetter ? "better" : "worse", "na"];
  if (a === b) return ["equal", "equal"];
  if (higherIsBetter) return a > b ? ["better", "worse"] : ["worse", "better"];
  else return a < b ? ["better", "worse"] : ["worse", "better"];
}

// ─── Search modal ─────────────────────────────────────────────
function SearchModal({
  allProperties,
  onSelect,
  onClose,
  excludeId,
}: {
  allProperties: Property[];
  onSelect: (p: Property) => void;
  onClose: () => void;
  excludeId?: string | null;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const results = allProperties.filter((p) => {
    if (p.id === excludeId) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.property_type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="cmp-modal-overlay" onClick={onClose}>
      <div className="cmp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmp-modal__header">
          <div className="cmp-modal__search-wrap">
            <i className="bi bi-search cmp-modal__search-icon" />
            <input
              ref={inputRef}
              className="cmp-modal__search"
              placeholder="Search by name, location, type…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="cmp-modal__close" onClick={onClose}>
            <i className="bi bi-x" />
          </button>
        </div>
        <div className="cmp-modal__body">
          {results.length === 0 ? (
            <div className="cmp-modal__empty">No properties found</div>
          ) : (
            results.map((p) => (
              <div
                key={p.id}
                className="cmp-modal__item"
                onClick={() => {
                  onSelect(p);
                  onClose();
                }}
              >
                <div className="cmp-modal__thumb">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      🏠
                    </div>
                  )}
                </div>
                <div className="cmp-modal__item-body">
                  <div className="cmp-modal__item-title">{p.title}</div>
                  <div className="cmp-modal__item-meta">
                    {p.property_type} · {p.location}
                    {p.bedrooms != null && ` · ${p.bedrooms} bed`}
                  </div>
                </div>
                <div className="cmp-modal__item-price">{fmtPrice(p.price)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EmptySlot({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="cmp-empty-slot">
      <div className="cmp-empty-icon">🏠</div>
      <div className="cmp-empty-slot__text">Select a Property</div>
      <div className="cmp-empty-slot__sub">
        Search from your listings to compare
      </div>
      <button className="cmp-add-btn" onClick={onAdd}>
        + Add Property
      </button>
    </div>
  );
}

function PropHeader({
  property,
  onRemove,
  onReplace,
}: {
  property: Property;
  onRemove: () => void;
  onReplace: () => void;
}) {
  return (
    <div className="cmp-prop-header">
      <div className="cmp-prop-img">
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.title} />
        ) : (
          <div className="cmp-prop-img__placeholder">🏠</div>
        )}
        <span
          className="cmp-status-badge"
          style={{ background: statusColor(property.status) }}
        >
          {property.status}
        </span>
        <button className="cmp-remove-btn" onClick={onRemove} title="Remove">
          <i className="bi bi-x" />
        </button>
      </div>
      <div className="cmp-prop-header__body">
        {property.property_type && (
          <div className="cmp-prop-header__type">{property.property_type}</div>
        )}
        <Link
          to={`/buy/${property.id}`}
          className="cmp-prop-header__title"
          title={property.title}
        >
          {property.title}
        </Link>
        <div className="cmp-prop-header__loc">
          <svg width="9" height="11" viewBox="0 0 11 13" fill="none">
            <path
              d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.25A1.75 1.75 0 1 1 5.5 2.75a1.75 1.75 0 0 1 0 3.5z"
              fill="currentColor"
            />
          </svg>
          {property.location}
        </div>
        <div className="cmp-prop-header__price">
          <sup>$</sup>
          {property.price.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          {property.status === "For Rent" && <sub> /mo</sub>}
        </div>
      </div>
      <div className="cmp-prop-header__footer">
        <Link
          to={`/buy/${property.id}`}
          className="cmp-btn-sm cmp-btn-sm--fill"
        >
          <i className="bi bi-arrow-up-right" style={{ fontSize: "10px" }} />
          View
        </Link>
        <button className="cmp-btn-sm cmp-btn-sm--outline" onClick={onReplace}>
          <i className="bi bi-arrow-repeat" style={{ fontSize: "10px" }} />
          Replace
        </button>
      </div>
    </div>
  );
}

function CmpRow({
  label,
  icon,
  aContent,
  bContent,
  aDiff,
  bDiff,
  showBadge = true,
}: {
  label: string;
  icon?: string;
  aContent: React.ReactNode;
  bContent: React.ReactNode;
  aDiff?: DiffDir;
  bDiff?: DiffDir;
  showBadge?: boolean;
}) {
  return (
    <div className="cmp-row">
      <div className="cmp-row__label-cell">
        {icon && <span className="cmp-row__label-icon">{icon}</span>}
        {label}
      </div>
      <div className={`cmp-row__val diff-${aDiff ?? "equal"}`}>
        {aContent}
        {showBadge && aDiff === "better" && (
          <span className="cmp-diff-badge better">Best</span>
        )}
        {showBadge && aDiff === "worse" && (
          <span className="cmp-diff-badge worse">Lower</span>
        )}
      </div>
      <div className={`cmp-row__val diff-${bDiff ?? "equal"}`}>
        {bContent}
        {showBadge && bDiff === "better" && (
          <span className="cmp-diff-badge better">Best</span>
        )}
        {showBadge && bDiff === "worse" && (
          <span className="cmp-diff-badge worse">Lower</span>
        )}
      </div>
    </div>
  );
}

function CmpGroup({
  title,
  icon,
  rowCount,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: string;
  rowCount: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <div className="cmp-group-header" onClick={() => setOpen((o) => !o)}>
        <div className="cmp-group-header__cell">
          <span className="cmp-group-header__icon">{icon}</span>
          <span className="cmp-group-header__title">{title}</span>
          <span className="cmp-group-header__count">({rowCount})</span>
          <i
            className={`bi bi-chevron-down cmp-group-header__chevron${open ? " open" : ""}`}
          />
        </div>
        <div />
        <div />
      </div>
      {open && children}
    </>
  );
}

// ─── Main Compare Component ───────────────────────────────────
const PropertyCompare = () => {
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
  injectCompareStyles();

  const [searchParams, setSearchParams] = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propA, setPropA] = useState<Property | null>(null);
  const [propB, setPropB] = useState<Property | null>(null);
  const [modalSlot, setModalSlot] = useState<"a" | "b" | null>(null);
  const [copied, setCopied] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      const props: Property[] = (data as Property[]) || [];
      setAllProperties(props);
      const idA = searchParams.get("a");
      const idB = searchParams.get("b");
      if (idA) {
        const found = props.find((p) => p.id === idA);
        if (found) setPropA(found);
      }
      if (idB) {
        const found = props.find((p) => p.id === idB);
        if (found) setPropB(found);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (propA) params.a = propA.id;
    if (propB) params.b = propB.id;
    setSearchParams(params, { replace: true });
  }, [propA, propB]);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setStickyVisible(rect.top < -80);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelect = useCallback(
    (p: Property) => {
      if (modalSlot === "a") setPropA(p);
      else setPropB(p);
      setModalSlot(null);
    },
    [modalSlot],
  );

  const handleSwap = () => {
    setPropA(propB);
    setPropB(propA);
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const computeWins = () => {
    if (!propA || !propB) return { a: 0, b: 0 };
    let a = 0,
      b = 0;
    const check = (diff: [DiffDir, DiffDir]) => {
      if (diff[0] === "better") a++;
      if (diff[1] === "better") b++;
    };
    check(numericDiff(propA.sqft, propB.sqft));
    check(numericDiff(propA.bedrooms, propB.bedrooms));
    check(numericDiff(propA.bathrooms, propB.bathrooms));
    check(numericDiff(propA.kitchens, propB.kitchens));
    check(numericDiff(propA.price, propB.price, false));
    check(numericDiff(propA.amenities?.length, propB.amenities?.length));
    return { a, b };
  };
  const wins = propA && propB ? computeWins() : null;

  const renderDetailsRows = () => {
    if (!propA && !propB) return null;
    const keys = Array.from(
      new Set([
        ...Object.keys(propA?.property_details || {}),
        ...Object.keys(propB?.property_details || {}),
      ]),
    );
    return keys.map((k) => {
      const vA = propA?.property_details?.[k] ?? null;
      const vB = propB?.property_details?.[k] ?? null;
      const equal = vA === vB;
      return (
        <CmpRow
          key={k}
          label={formatKey(k)}
          aContent={
            vA ?? (
              <span style={{ color: "var(--c-ink-3)", fontStyle: "italic" }}>
                —
              </span>
            )
          }
          bContent={
            vB ?? (
              <span style={{ color: "var(--c-ink-3)", fontStyle: "italic" }}>
                —
              </span>
            )
          }
          aDiff={equal ? "equal" : vA ? "equal" : "na"}
          bDiff={equal ? "equal" : vB ? "equal" : "na"}
          showBadge={false}
        />
      );
    });
  };

  const renderUtilityRows = () => {
    if (!propA && !propB) return null;
    const keys = Array.from(
      new Set([
        ...Object.keys(propA?.utility_features || {}),
        ...Object.keys(propB?.utility_features || {}),
      ]),
    );
    return keys.map((k) => {
      const vA = propA?.utility_features?.[k] ?? null;
      const vB = propB?.utility_features?.[k] ?? null;
      return (
        <CmpRow
          key={k}
          label={formatKey(k)}
          aContent={
            vA ?? (
              <span style={{ color: "var(--c-ink-3)", fontStyle: "italic" }}>
                —
              </span>
            )
          }
          bContent={
            vB ?? (
              <span style={{ color: "var(--c-ink-3)", fontStyle: "italic" }}>
                —
              </span>
            )
          }
          aDiff={!vA && vB ? "worse" : vA && !vB ? "better" : "equal"}
          bDiff={!vB && vA ? "worse" : vB && !vA ? "better" : "equal"}
          showBadge={!!((!vA && vB) || (vA && !vB))}
        />
      );
    });
  };

  const renderOutdoorRows = () => {
    if (!propA && !propB) return null;
    const keys = Array.from(
      new Set([
        ...Object.keys(propA?.outdoor_features || {}),
        ...Object.keys(propB?.outdoor_features || {}),
      ]),
    );
    return keys.map((k) => {
      const vA = propA?.outdoor_features?.[k] ?? null;
      const vB = propB?.outdoor_features?.[k] ?? null;
      return (
        <CmpRow
          key={k}
          label={formatKey(k)}
          aContent={
            vA ?? (
              <span style={{ color: "var(--c-ink-3)", fontStyle: "italic" }}>
                —
              </span>
            )
          }
          bContent={
            vB ?? (
              <span style={{ color: "var(--c-ink-3)", fontStyle: "italic" }}>
                —
              </span>
            )
          }
          aDiff="equal"
          bDiff="equal"
          showBadge={false}
        />
      );
    });
  };

  const renderNearbyRows = () => {
    if (!propA?.whats_nearby && !propB?.whats_nearby) return null;
    const keys = Array.from(
      new Set([
        ...Object.keys(propA?.whats_nearby || {}),
        ...Object.keys(propB?.whats_nearby || {}),
      ]),
    );
    const labelMap: Record<string, string> = {
      school: "School",
      grocery: "Grocery",
      metro: "Metro",
      gym: "Gym",
      university: "University",
      hospital: "Hospital",
      mall: "Mall",
      police: "Police",
      bus: "Bus",
      park: "Park",
      restaurant: "Restaurant",
      pharmacy: "Pharmacy",
      airport: "Airport",
      market: "Market",
      river: "River",
    };
    return keys.map((k) => {
      const vA = propA?.whats_nearby?.[k];
      const vB = propB?.whats_nearby?.[k];
      const numA = parseFloat(vA ?? "999");
      const numB = parseFloat(vB ?? "999");
      const [dA, dB] = numericDiff(numA, numB, false);
      return (
        <CmpRow
          key={k}
          label={labelMap[k] ?? formatKey(k)}
          icon="📍"
          aContent={<span>{vA ?? "—"}</span>}
          bContent={<span>{vB ?? "—"}</span>}
          aDiff={vA ? dA : "na"}
          bDiff={vB ? dB : "na"}
          showBadge
        />
      );
    });
  };

  const renderAmenities = () => {
    const allAmenities = Array.from(
      new Set([...(propA?.amenities || []), ...(propB?.amenities || [])]),
    );
    if (allAmenities.length === 0) return null;
    const aHas = new Set(propA?.amenities || []);
    const bHas = new Set(propB?.amenities || []);
    return (
      <CmpRow
        label="Amenities"
        icon="✨"
        showBadge={false}
        aDiff={
          aHas.size > bHas.size
            ? "better"
            : aHas.size < bHas.size
              ? "worse"
              : "equal"
        }
        bDiff={
          bHas.size > aHas.size
            ? "better"
            : bHas.size < aHas.size
              ? "worse"
              : "equal"
        }
        aContent={
          <div className="cmp-amenity-wrap">
            {allAmenities.map((a) => (
              <span
                key={a}
                className={`cmp-amenity-tag${aHas.has(a) ? " has" : " missing"}`}
              >
                {aHas.has(a) ? "✓" : "✗"} {a}
              </span>
            ))}
          </div>
        }
        bContent={
          <div className="cmp-amenity-wrap">
            {allAmenities.map((a) => (
              <span
                key={a}
                className={`cmp-amenity-tag${bHas.has(a) ? " has" : " missing"}`}
              >
                {bHas.has(a) ? "✓" : "✗"} {a}
              </span>
            ))}
          </div>
        }
      />
    );
  };

  const bothSelected = propA && propB;

  const detailsKeys = Array.from(
    new Set([
      ...Object.keys(propA?.property_details || {}),
      ...Object.keys(propB?.property_details || {}),
    ]),
  );
  const utilityKeys = Array.from(
    new Set([
      ...Object.keys(propA?.utility_features || {}),
      ...Object.keys(propB?.utility_features || {}),
    ]),
  );
  const outdoorKeys = Array.from(
    new Set([
      ...Object.keys(propA?.outdoor_features || {}),
      ...Object.keys(propB?.outdoor_features || {}),
    ]),
  );
  const nearbyKeys = Array.from(
    new Set([
      ...Object.keys(propA?.whats_nearby || {}),
      ...Object.keys(propB?.whats_nearby || {}),
    ]),
  );
  const allAmenitiesCount = Array.from(
    new Set([...(propA?.amenities || []), ...(propB?.amenities || [])]),
  ).length;

  return (
    <Wrapper>
      <SEO pageTitle="Compare Properties" />
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      <div className="fwc-banner">
        <div
          className="fwc-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwc-banner__inner">
          <h2 className="fwc-banner__title">
            Property <em>Comapare</em>
          </h2>
          <ul className="fwc-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Compare</li>
          </ul>
        </div>
      </div>

      <div className="cmp-root cmp-page">
        {/* Top bar */}
        <div className="cmp-topbar">
          <div className="container">
            <div className="cmp-topbar__inner">
              <div className="cmp-topbar__left">
                <Link to="/listing_13" className="cmp-back-link">
                  <i className="bi bi-arrow-left" />
                  Listings
                </Link>
                <div>
                  <div className="cmp-topbar__title">Compare Properties</div>
                  <div className="cmp-topbar__subtitle">
                    Side-by-side analysis with smart diff highlights
                  </div>
                </div>
              </div>
              <button
                className={`cmp-share-btn${copied ? " copied" : ""}`}
                onClick={handleShare}
              >
                <i className={copied ? "bi bi-check2" : "bi bi-share"} />
                {copied ? "Link Copied!" : "Share Compare"}
              </button>
            </div>

            <div className="cmp-legend">
              <span className="cmp-legend-item">
                <span
                  className="cmp-legend-dot"
                  style={{ background: "#1C94A4" }}
                />
                Better value
              </span>
              <span className="cmp-legend-item">
                <span
                  className="cmp-legend-dot"
                  style={{ background: "#252060" }}
                />
                Lower value
              </span>
              <span className="cmp-legend-item">
                <span
                  className="cmp-legend-dot"
                  style={{ background: "#8a88a8" }}
                />
                Equal
              </span>
              <span className="cmp-legend-item">
                <span
                  className="cmp-legend-dot"
                  style={{ background: "#e8e7f0" }}
                />
                Not available
              </span>
            </div>
          </div>
        </div>

        {/* Sticky header */}
        {stickyVisible && bothSelected && (
          <div className="cmp-sticky-header">
            <div className="container">
              <div className="cmp-sticky-header__inner">
                <div className="cmp-sticky-header__label">
                  <i
                    className="bi bi-columns-gap"
                    style={{ marginRight: "6px" }}
                  />
                  Comparing
                </div>
                {[propA, propB].map((p, i) => (
                  <div key={i} className="cmp-sticky-prop">
                    <div className="cmp-sticky-prop__thumb">
                      {p!.images?.[0] ? (
                        <img src={p!.images[0]} alt={p!.title} />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          🏠
                        </div>
                      )}
                    </div>
                    <span className="cmp-sticky-prop__name" title={p!.title}>
                      {p!.title}
                    </span>
                    <span className="cmp-sticky-prop__price">
                      {fmtPrice(p!.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="container" style={{ paddingTop: "28px" }}>
          {loading ? (
            <div
              style={{
                padding: "60px 0",
                textAlign: "center",
                color: "var(--c-ink-3)",
                fontSize: "14px",
              }}
            >
              <div
                className="spinner-border"
                role="status"
                style={{
                  width: "2rem",
                  height: "2rem",
                  color: "#1C94A4",
                  borderWidth: "2px",
                }}
              />
              <p style={{ marginTop: "14px" }}>Loading properties…</p>
            </div>
          ) : (
            <>
              {/* Property header cards */}
              <div
                className="cmp-table"
                ref={stickyRef}
                style={{ marginBottom: "20px" }}
              >
                <div className="cmp-table__inner">
                  <div className="cmp-header-grid">
                    <div className="cmp-header-spacer">
                      <div>
                        <span className="cmp-spacer-eyebrow">Side-by-side</span>
                        <div className="cmp-spacer-title">
                          Property
                          <br />
                          Compare
                        </div>
                        <p className="cmp-spacer-desc">
                          Pick two listings to see a detailed comparison with
                          smart highlights.
                        </p>
                      </div>
                      {bothSelected && (
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "rgba(255,255,255,0.1)",
                            border: "1.5px solid rgba(255,255,255,0.2)",
                            borderRadius: "var(--radius-sm)",
                            padding: "7px 13px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#fff",
                            cursor: "pointer",
                            transition: "all 0.18s",
                            fontFamily: "var(--font-body)",
                            marginTop: "14px",
                          }}
                          onClick={handleSwap}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "rgba(28,148,164,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "rgba(255,255,255,0.1)";
                          }}
                        >
                          <i className="bi bi-arrow-left-right" />
                          Swap sides
                        </button>
                      )}
                    </div>

                    {propA ? (
                      <PropHeader
                        property={propA}
                        onRemove={() => setPropA(null)}
                        onReplace={() => setModalSlot("a")}
                      />
                    ) : (
                      <EmptySlot onAdd={() => setModalSlot("a")} />
                    )}
                    {propB ? (
                      <PropHeader
                        property={propB}
                        onRemove={() => setPropB(null)}
                        onReplace={() => setModalSlot("b")}
                      />
                    ) : (
                      <EmptySlot onAdd={() => setModalSlot("b")} />
                    )}
                  </div>
                </div>
              </div>

              {/* Comparison table */}
              {bothSelected && (
                <div className="cmp-table">
                  <div className="cmp-table__inner">
                    {/* Pricing */}
                    <CmpGroup title="Pricing" icon="💰" rowCount={2}>
                      {(() => {
                        const [dA, dB] = numericDiff(
                          propA.price,
                          propB.price,
                          false,
                        );
                        return (
                          <CmpRow
                            label="Asking Price"
                            icon="🏷"
                            aContent={
                              <span
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontSize: "18px",
                                }}
                              >
                                {fmtPrice(propA.price)}
                                {propA.status === "For Rent" && (
                                  <sub
                                    style={{
                                      fontFamily: "var(--font-body)",
                                      fontSize: "11px",
                                      color: "inherit",
                                    }}
                                  >
                                    {" "}
                                    /mo
                                  </sub>
                                )}
                              </span>
                            }
                            bContent={
                              <span
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontSize: "18px",
                                }}
                              >
                                {fmtPrice(propB.price)}
                                {propB.status === "For Rent" && (
                                  <sub
                                    style={{
                                      fontFamily: "var(--font-body)",
                                      fontSize: "11px",
                                      color: "inherit",
                                    }}
                                  >
                                    {" "}
                                    /mo
                                  </sub>
                                )}
                              </span>
                            }
                            aDiff={dA}
                            bDiff={dB}
                          />
                        );
                      })()}
                      {propA.sqft && propB.sqft
                        ? (() => {
                            const ppsA = Math.round(propA.price / propA.sqft);
                            const ppsB = Math.round(propB.price / propB.sqft);
                            const [dA, dB] = numericDiff(ppsA, ppsB, false);
                            return (
                              <CmpRow
                                label="Price / ft²"
                                icon="📐"
                                aContent={`$${ppsA.toLocaleString()}/ft²`}
                                bContent={`$${ppsB.toLocaleString()}/ft²`}
                                aDiff={dA}
                                bDiff={dB}
                              />
                            );
                          })()
                        : null}
                    </CmpGroup>

                    {/* Key Specs */}
                    <CmpGroup title="Key Specifications" icon="📋" rowCount={7}>
                      {(() => {
                        const [dA, dB] = numericDiff(propA.sqft, propB.sqft);
                        return (
                          <CmpRow
                            label="Square Footage"
                            icon="⊞"
                            aContent={
                              propA.sqft
                                ? `${propA.sqft.toLocaleString()} ft²`
                                : "—"
                            }
                            bContent={
                              propB.sqft
                                ? `${propB.sqft.toLocaleString()} ft²`
                                : "—"
                            }
                            aDiff={propA.sqft ? dA : "na"}
                            bDiff={propB.sqft ? dB : "na"}
                          />
                        );
                      })()}
                      {(() => {
                        const [dA, dB] = numericDiff(
                          propA.bedrooms,
                          propB.bedrooms,
                        );
                        return (
                          <CmpRow
                            label="Bedrooms"
                            icon="🛏"
                            aContent={
                              propA.bedrooms != null
                                ? `${propA.bedrooms} Beds`
                                : "—"
                            }
                            bContent={
                              propB.bedrooms != null
                                ? `${propB.bedrooms} Beds`
                                : "—"
                            }
                            aDiff={propA.bedrooms != null ? dA : "na"}
                            bDiff={propB.bedrooms != null ? dB : "na"}
                          />
                        );
                      })()}
                      {(() => {
                        const [dA, dB] = numericDiff(
                          propA.bathrooms,
                          propB.bathrooms,
                        );
                        return (
                          <CmpRow
                            label="Bathrooms"
                            icon="🚿"
                            aContent={
                              propA.bathrooms != null
                                ? `${propA.bathrooms} Baths`
                                : "—"
                            }
                            bContent={
                              propB.bathrooms != null
                                ? `${propB.bathrooms} Baths`
                                : "—"
                            }
                            aDiff={propA.bathrooms != null ? dA : "na"}
                            bDiff={propB.bathrooms != null ? dB : "na"}
                          />
                        );
                      })()}
                      {(() => {
                        const [dA, dB] = numericDiff(
                          propA.kitchens,
                          propB.kitchens,
                        );
                        return (
                          <CmpRow
                            label="Kitchens"
                            icon="🍳"
                            aContent={
                              propA.kitchens != null ? `${propA.kitchens}` : "—"
                            }
                            bContent={
                              propB.kitchens != null ? `${propB.kitchens}` : "—"
                            }
                            aDiff={propA.kitchens != null ? dA : "na"}
                            bDiff={propB.kitchens != null ? dB : "na"}
                          />
                        );
                      })()}
                      <CmpRow
                        label="Listing Status"
                        icon="🏷"
                        aContent={
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#fff",
                              background: statusColor(propA.status),
                              letterSpacing: "0.5px",
                            }}
                          >
                            {propA.status}
                          </span>
                        }
                        bContent={
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#fff",
                              background: statusColor(propB.status),
                              letterSpacing: "0.5px",
                            }}
                          >
                            {propB.status}
                          </span>
                        }
                        aDiff="equal"
                        bDiff="equal"
                        showBadge={false}
                      />
                      <CmpRow
                        label="Property Type"
                        icon="🏠"
                        aContent={propA.property_type || "—"}
                        bContent={propB.property_type || "—"}
                        aDiff="equal"
                        bDiff="equal"
                        showBadge={false}
                      />
                      <CmpRow
                        label="Location"
                        icon="📍"
                        aContent={propA.location || "—"}
                        bContent={propB.location || "—"}
                        aDiff="equal"
                        bDiff="equal"
                        showBadge={false}
                      />
                    </CmpGroup>

                    {allAmenitiesCount > 0 && (
                      <CmpGroup
                        title="Amenities"
                        icon="✨"
                        rowCount={allAmenitiesCount}
                      >
                        {(() => {
                          const aHas = new Set(propA.amenities || []);
                          const bHas = new Set(propB.amenities || []);
                          const [dA, dB] = numericDiff(aHas.size, bHas.size);
                          return (
                            <CmpRow
                              label="Total Amenities"
                              icon="✓"
                              aContent={`${aHas.size} amenities`}
                              bContent={`${bHas.size} amenities`}
                              aDiff={dA}
                              bDiff={dB}
                            />
                          );
                        })()}
                        {renderAmenities()}
                      </CmpGroup>
                    )}

                    {detailsKeys.length > 0 && (
                      <CmpGroup
                        title="Property Details"
                        icon="📄"
                        rowCount={detailsKeys.length}
                      >
                        {renderDetailsRows()}
                      </CmpGroup>
                    )}
                    {utilityKeys.length > 0 && (
                      <CmpGroup
                        title="Utility & Home Features"
                        icon="⚡"
                        rowCount={utilityKeys.length}
                        defaultOpen={false}
                      >
                        {renderUtilityRows()}
                      </CmpGroup>
                    )}
                    {outdoorKeys.length > 0 && (
                      <CmpGroup
                        title="Outdoor Features"
                        icon="🌿"
                        rowCount={outdoorKeys.length}
                        defaultOpen={false}
                      >
                        {renderOutdoorRows()}
                      </CmpGroup>
                    )}
                    {nearbyKeys.length > 0 && (
                      <CmpGroup
                        title="What's Nearby"
                        icon="🗺"
                        rowCount={nearbyKeys.length}
                        defaultOpen={false}
                      >
                        {renderNearbyRows()}
                      </CmpGroup>
                    )}

                    {wins && (
                      <div className="cmp-summary">
                        <div className="cmp-summary__label">
                          <i
                            className="bi bi-award"
                            style={{ marginRight: "7px", opacity: 0.5 }}
                          />
                          Summary
                        </div>
                        {[
                          { p: propA, w: wins.a, other: wins.b },
                          { p: propB, w: wins.b, other: wins.a },
                        ].map(({ p, w, other }, i) => (
                          <div key={i} className="cmp-summary__cell">
                            <div className="cmp-summary__score">{w}</div>
                            <div className="cmp-summary__score-label">
                              categories won
                            </div>
                            <div className="cmp-summary__wins">
                              <strong>
                                {p.title.length > 22
                                  ? p.title.slice(0, 22) + "…"
                                  : p.title}
                              </strong>
                            </div>
                            {w > other && (
                              <span className="cmp-summary__winner-badge winner">
                                🏆 Overall Winner
                              </span>
                            )}
                            {w === other && (
                              <span className="cmp-summary__winner-badge">
                                ⚖️ Tied
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!bothSelected && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "var(--c-ink-3)",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
                    ⚖️
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      color: "#252060",
                      marginBottom: "8px",
                    }}
                  >
                    Select{" "}
                    {!propA && !propB ? "two properties" : "one more property"}{" "}
                    to compare
                  </p>
                  <p style={{ fontSize: "13.5px", color: "var(--c-ink-3)" }}>
                    Use the slots above to pick properties and see a detailed
                    side-by-side breakdown.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {modalSlot && (
          <SearchModal
            allProperties={allProperties}
            onSelect={handleSelect}
            onClose={() => setModalSlot(null)}
            excludeId={modalSlot === "a" ? propB?.id : propA?.id}
          />
        )}
      </div>

      {/* <Brand />
      <FancyBanner /> */}
      <FutureFooter />
    </Wrapper>
  );
};

export default PropertyCompare;

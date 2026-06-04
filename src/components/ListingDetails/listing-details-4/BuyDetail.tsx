// ============================================================
//  BuyDetails.tsx — Dynamic property detail page
//  Design: DM Serif Display + DM Sans, editorial luxury,
//  consistent with BuyListing design tokens
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Slider from "react-slick";

// ─── Supabase ─────────────────────────────────────────────────
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
  agent?: Record<string, string> | null;
  google_maps_url?: string | null;
  created_at: string;
}

// ─── Design tokens (shared with BuyListing) ───────────────────
const DETAIL_STYLES = `
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
    --c-accent-h:   #a83320;
    --radius-card:  16px;
    --radius-sm:    10px;
    --shadow-card:  0 1px 3px rgba(26,23,21,0.06), 0 4px 16px rgba(26,23,21,0.07);
    --shadow-hover: 0 4px 8px rgba(26,23,21,0.08), 0 16px 40px rgba(26,23,21,0.13);
  }

  .bd-root, .bd-root * { font-family: var(--font-body); }

  /* ── Page breadcrumb ── */
  .bd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: var(--c-ink-3);
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .bd-breadcrumb a {
    color: var(--c-ink-3);
    text-decoration: none;
    transition: color 0.18s;
  }
  .bd-breadcrumb a:hover { color: var(--c-ink); }
  .bd-breadcrumb .sep { opacity: 0.4; }
  .bd-breadcrumb .current { color: var(--c-ink); font-weight: 500; }

  /* ── Banner ── */
  .bd-banner {
    padding: 28px 0 24px;
    border-bottom: 1px solid var(--c-rule);
    margin-bottom: 28px;
  }
  .bd-banner__title {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 400;
    color: var(--c-ink);
    line-height: 1.2;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }
  .bd-banner__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .bd-status-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #fff;
  }
  .bd-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--c-ink-3);
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    padding: 4px 12px;
    border-radius: 20px;
  }
  .bd-banner__price-col { text-align: right; }
  .bd-banner__price {
    font-family: var(--font-display);
    font-size: 34px;
    font-weight: 400;
    color: var(--c-ink);
    letter-spacing: -0.8px;
    line-height: 1;
  }
  .bd-banner__price sup {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 500;
    color: var(--c-ink-3);
    vertical-align: super;
    margin-right: 2px;
  }
  .bd-banner__price sub {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 400;
    color: var(--c-ink-3);
  }
  .bd-banner__est {
    font-size: 13px;
    color: var(--c-ink-3);
    margin-top: 5px;
  }
  .bd-banner__est strong { color: var(--c-ink-2); font-weight: 600; }

  /* Action row */
  .bd-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    justify-content: flex-end;
  }
  .bd-action-share {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--c-ink-2);
    padding: 7px 16px;
    border-radius: 20px;
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
    text-decoration: none;
    transition: all 0.18s;
    margin-right: auto;
  }
  .bd-action-share:hover { border-color: var(--c-ink); color: var(--c-ink); }
  .bd-action-icon {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1.5px solid var(--c-rule);
    background: var(--c-white);
    display: flex; align-items: center; justify-content: center;
    color: var(--c-ink-3);
    text-decoration: none;
    transition: all 0.18s;
    font-size: 14px;
    flex-shrink: 0;
  }
  .bd-action-icon:hover { border-color: var(--c-ink); color: var(--c-ink); }
  .bd-action-icon.active { background: var(--c-accent); border-color: var(--c-accent); color: #fff; }

  /* ── Gallery ── */
  .bd-gallery {
    border-radius: var(--radius-card);
    overflow: hidden;
    position: relative;
    box-shadow: var(--shadow-hover);
    background: var(--c-surface);
    margin-bottom: 28px;
  }
  .bd-gallery__main-img {
    width: 100%;
    height: 500px;
    object-fit: cover;
    display: block;
    cursor: zoom-in;
    transition: transform 0.4s ease;
  }
  .bd-gallery:hover .bd-gallery__main-img { transform: scale(1.015); }
  .bd-gallery__placeholder {
    width: 100%; height: 500px;
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem; background: var(--c-surface);
  }
  .bd-gallery__arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.95);
    border: none; box-shadow: 0 2px 14px rgba(26,23,21,0.14);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: var(--c-ink);
    cursor: pointer; z-index: 5;
    transition: all 0.2s;
  }
  .bd-gallery__arrow:hover { box-shadow: 0 4px 20px rgba(26,23,21,0.2); transform: translateY(-50%) scale(1.06); }
  .bd-gallery__arrow--prev { left: 14px; }
  .bd-gallery__arrow--next { right: 14px; }
  .bd-gallery__counter {
    position: absolute; bottom: 14px; right: 14px;
    background: rgba(26,23,21,0.55); backdrop-filter: blur(6px);
    color: #fff; font-size: 11.5px; font-weight: 600;
    padding: 4px 11px; border-radius: 12px; z-index: 5;
    letter-spacing: 0.3px;
  }
  .bd-gallery__thumbs {
    display: flex; gap: 6px; padding: 10px;
    background: var(--c-surface); border-top: 1px solid var(--c-rule);
    overflow-x: auto; scrollbar-width: none;
  }
  .bd-gallery__thumbs::-webkit-scrollbar { display: none; }
  .bd-gallery__thumb {
    flex-shrink: 0; width: 70px; height: 52px;
    border-radius: 8px; overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer; transition: border-color 0.18s, opacity 0.18s;
    opacity: 0.6;
  }
  .bd-gallery__thumb.active { border-color: var(--c-ink); opacity: 1; }
  .bd-gallery__thumb:hover { opacity: 0.85; }
  .bd-gallery__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ── Overview bar ── */
  .bd-overview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--c-ink);
    border-radius: var(--radius-card);
    overflow: hidden;
    margin-bottom: 48px;
  }
  @media (max-width: 576px) { .bd-overview { grid-template-columns: repeat(2, 1fr); } }
  .bd-ov-item {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 22px 12px;
    border-right: 1px solid rgba(255,255,255,0.07);
    text-align: center;
  }
  .bd-ov-item:last-child { border-right: none; }
  .bd-ov-icon { font-size: 20px; margin-bottom: 6px; opacity: 0.7; }
  .bd-ov-label {
    font-size: 10px; color: rgba(255,255,255,0.4);
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 3px;
  }
  .bd-ov-value {
    font-family: var(--font-display); font-size: 18px;
    font-weight: 400; color: #fff; line-height: 1;
  }

  /* ── Section ── */
  .bd-section {
    padding-bottom: 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--c-rule);
  }
  .bd-section:last-child { border-bottom: none; margin-bottom: 0; }
  .bd-section__heading {
    font-family: var(--font-display);
    font-size: 22px; font-weight: 400;
    color: var(--c-ink); margin-bottom: 18px;
    letter-spacing: -0.2px;
    display: flex; align-items: center; gap: 14px;
  }
  .bd-section__heading::after {
    content: ""; flex: 1; height: 1px; background: var(--c-rule);
  }
  .bd-body-text {
    font-size: 15px; line-height: 1.8; color: var(--c-ink-2);
  }

  /* ── Accordion ── */
  .bd-accordion { display: flex; flex-direction: column; gap: 8px; }
  .bd-accordion__item {
    border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--c-white);
  }
  .bd-accordion__btn {
    width: 100%; text-align: left;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px;
    font-size: 14.5px; font-weight: 600; font-family: var(--font-body);
    color: var(--c-ink); background: var(--c-surface);
    border: none; cursor: pointer;
    transition: background 0.18s;
  }
  .bd-accordion__btn:hover { background: #f4f1ec; }
  .bd-accordion__btn.open { background: var(--c-white); color: var(--c-accent); }
  .bd-accordion__btn .chevron {
    font-size: 12px; transition: transform 0.22s; color: var(--c-ink-3);
  }
  .bd-accordion__btn.open .chevron { transform: rotate(180deg); }
  .bd-accordion__body { padding: 16px 18px; }
  .bd-feat-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;
  }
  .bd-feat-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; border-bottom: 1px solid var(--c-rule);
    font-size: 13.5px;
  }
  .bd-feat-row:last-child { border-bottom: none; }
  .bd-feat-key { color: var(--c-ink-3); }
  .bd-feat-val { font-weight: 600; color: var(--c-ink); }

  /* ── Amenities ── */
  .bd-amenity-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
  .bd-amenity {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--c-surface); border: 1.5px solid var(--c-rule);
    border-radius: var(--radius-sm); padding: 7px 14px;
    font-size: 13px; font-weight: 500; color: var(--c-ink-2);
    transition: all 0.18s;
  }
  .bd-amenity:hover { border-color: var(--c-ink); background: #f4f1ec; }
  .bd-amenity__check { font-size: 10px; color: var(--c-accent); font-weight: 800; }

  /* ── Floor plan ── */
  .bd-floorplan {
    border-radius: var(--radius-card); overflow: hidden;
    border: 1.5px solid var(--c-rule); background: var(--c-surface);
  }
  .bd-floorplan img { width: 100%; display: block; }

  /* ── Nearby ── */
  .bd-nearby-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .bd-nearby-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 11px 14px; background: var(--c-surface);
    border-radius: var(--radius-sm); border: 1px solid var(--c-rule);
    font-size: 13.5px; transition: border-color 0.18s;
  }
  .bd-nearby-item:hover { border-color: var(--c-ink-3); }
  .bd-nearby-key { color: var(--c-ink-3); }
  .bd-nearby-val { font-weight: 600; color: var(--c-ink); }

  /* ── Walk score ── */
  .bd-ws-item {
    display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
  }
  .bd-ws-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: var(--c-surface); border: 1px solid var(--c-rule);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 18px;
  }
  .bd-ws-info { flex: 1; }
  .bd-ws-label { font-size: 13px; font-weight: 600; color: var(--c-ink); margin-bottom: 5px; }
  .bd-ws-tag { font-size: 11.5px; color: var(--c-ink-3); font-weight: 400; margin-left: 4px; }
  .bd-ws-track { height: 5px; background: var(--c-rule); border-radius: 3px; overflow: hidden; }
  .bd-ws-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--c-accent), #e87c5a);
    transition: width 0.9s cubic-bezier(.22,.9,.36,1);
  }
  .bd-ws-num { font-size: 13px; font-weight: 700; color: var(--c-ink); min-width: 32px; text-align: right; }

  /* ── Map ── */
  .bd-map { border-radius: var(--radius-card); overflow: hidden; border: 1.5px solid var(--c-rule); }
  .bd-map iframe { display: block; width: 100%; }
  .bd-map-footer {
    display: flex; align-items: center; gap: 6px;
    padding: 12px 16px; background: var(--c-surface);
    font-size: 13px; color: var(--c-ink-3);
    border-top: 1px solid var(--c-rule);
  }
  .bd-map-footer a { color: var(--c-ink); font-weight: 600; text-decoration: none; transition: color 0.18s; }
  .bd-map-footer a:hover { color: var(--c-accent); }

  /* ── Similar cards ── */
  .bd-similar-card {
    border-radius: var(--radius-card); overflow: hidden;
    border: 1.5px solid var(--c-rule); background: var(--c-white);
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.25s, transform 0.25s;
    margin: 0 8px 8px;
  }
  .bd-similar-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
  .bd-similar-card img { width: 100%; height: 185px; object-fit: cover; display: block; }
  .bd-similar-card__body { padding: 14px 16px 10px; }
  .bd-similar-card__price {
    font-family: var(--font-display); font-size: 17px;
    color: var(--c-ink); margin-bottom: 4px;
  }
  .bd-similar-card__loc { font-size: 12.5px; color: var(--c-ink-3); margin-bottom: 5px; display: flex; align-items: center; gap: 3px; }
  .bd-similar-card__meta { font-size: 12px; color: var(--c-ink-3); }
  .bd-similar-card__footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 16px 14px;
  }
  .bd-similar-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    color: #fff; padding: 3px 10px; border-radius: 12px;
  }
  .bd-similar-arrow {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--c-ink); color: #fff;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 13px;
    transition: background 0.2s, transform 0.22s;
  }
  .bd-similar-arrow:hover { background: var(--c-accent); transform: rotate(45deg); }

  /* ── Sidebar ── */
  .bd-sidebar-card {
    background: var(--c-white);
    border-radius: var(--radius-card);
    border: 1.5px solid var(--c-rule);
    box-shadow: var(--shadow-card);
    padding: 24px;
    margin-bottom: 18px;
  }
  .bd-sidebar-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: var(--c-ink-3); margin-bottom: 16px; display: block;
  }
  .bd-sidebar-price {
    font-family: var(--font-display); font-size: 30px;
    font-weight: 400; color: var(--c-ink);
    letter-spacing: -0.8px; line-height: 1; margin-bottom: 4px;
  }
  .bd-sidebar-price sup {
    font-family: var(--font-body); font-size: 15px;
    font-weight: 500; color: var(--c-ink-3); vertical-align: super; margin-right: 2px;
  }
  .bd-sidebar-price sub {
    font-family: var(--font-body); font-size: 13px;
    font-weight: 400; color: var(--c-ink-3);
  }
  .bd-sidebar-est { font-size: 12.5px; color: var(--c-ink-3); margin-bottom: 20px; }
  .bd-sidebar-est strong { color: var(--c-ink-2); font-weight: 600; }
  .bd-facts-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; border-bottom: 1px solid var(--c-rule);
    font-size: 13.5px;
  }
  .bd-facts-row:last-child { border-bottom: none; }
  .bd-facts-key { color: var(--c-ink-3); }
  .bd-facts-val { font-weight: 600; color: var(--c-ink); }

  /* Agent */
  .bd-agent-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-ink) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; color: #fff; flex-shrink: 0;
    font-family: var(--font-display);
  }
  .bd-agent-name { font-size: 15px; font-weight: 600; color: var(--c-ink); }
  .bd-agent-role { font-size: 12px; color: var(--c-ink-3); }
  .bd-agent-row {
    display: flex; align-items: center; gap: 9px;
    font-size: 13.5px; color: var(--c-ink-2); padding: 6px 0;
  }
  .bd-agent-row a { color: var(--c-ink-2); text-decoration: none; transition: color 0.18s; }
  .bd-agent-row a:hover { color: var(--c-accent); }
  .bd-agent-row i { color: var(--c-ink-3); width: 16px; }
  .bd-agent-cta {
    display: block; margin-top: 16px; text-align: center;
    padding: 11px; border-radius: var(--radius-sm);
    background: var(--c-ink); color: #fff;
    font-weight: 600; font-size: 14px; font-family: var(--font-body);
    text-decoration: none; transition: background 0.2s;
    border: none; cursor: pointer; width: 100%;
  }
  .bd-agent-cta:hover { background: var(--c-accent); }

  /* Contact form */
  .bd-input {
    width: 100%; padding: 10px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    font-size: 13.5px; font-family: var(--font-body);
    color: var(--c-ink); background: var(--c-surface);
    outline: none; transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    margin-bottom: 10px; appearance: none;
  }
  .bd-input:focus { border-color: var(--c-ink); background: var(--c-white); box-shadow: 0 0 0 3px rgba(26,23,21,0.06); }
  .bd-textarea {
    width: 100%; padding: 10px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--c-rule);
    font-size: 13.5px; font-family: var(--font-body);
    color: var(--c-ink); background: var(--c-surface);
    outline: none; transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    resize: none; margin-bottom: 12px;
  }
  .bd-textarea:focus { border-color: var(--c-ink); background: var(--c-white); box-shadow: 0 0 0 3px rgba(26,23,21,0.06); }
  .bd-send-btn {
    width: 100%; padding: 12px; border-radius: var(--radius-sm);
    border: none; background: var(--c-ink);
    color: #fff; font-size: 14px; font-weight: 600;
    font-family: var(--font-body); cursor: pointer;
    letter-spacing: 0.3px; transition: background 0.2s;
  }
  .bd-send-btn:hover { background: var(--c-accent); }

  /* Skeleton */
  @keyframes bd-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .bd-skeleton {
    background: linear-gradient(90deg, #f0ede8 25%, #e8e4df 50%, #f0ede8 75%);
    background-size: 200% 100%;
    animation: bd-shimmer 1.5s infinite;
    border-radius: 8px;
  }

  /* Slick dots override */
  .bd-root .slick-dots li button:before {
    font-size: 7px; color: var(--c-ink-3);
  }
  .bd-root .slick-dots li.slick-active button:before {
    color: var(--c-ink);
  }
`;

function injectDetailStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("bd-styles")
  ) {
    const el = document.createElement("style");
    el.id = "bd-styles";
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
      return "rgba(200,64,42,0.92)";
    case "For Rent":
      return "rgba(33,130,215,0.92)";
    case "Sold":
      return "rgba(56,161,105,0.92)";
    case "Rented":
      return "rgba(214,132,0,0.92)";
    default:
      return "rgba(80,76,72,0.88)";
  }
}

function formatKey(k: string): string {
  return k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Gallery (custom, no slick needed for single image) ───────
function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const imgs = images && images.length > 0 ? images : [];

  if (imgs.length === 0) {
    return (
      <div className="bd-gallery">
        <div className="bd-gallery__placeholder">🏠</div>
      </div>
    );
  }

  const prev = () => setActive((i) => (i === 0 ? imgs.length - 1 : i - 1));
  const next = () => setActive((i) => (i === imgs.length - 1 ? 0 : i + 1));

  return (
    <div className="bd-gallery">
      <div style={{ overflow: "hidden", position: "relative" }}>
        <img
          src={imgs[active]}
          alt={`${title} — ${active + 1}`}
          className="bd-gallery__main-img"
        />
        {imgs.length > 1 && (
          <>
            <button
              className="bd-gallery__arrow bd-gallery__arrow--prev"
              onClick={prev}
            >
              <i className="bi bi-arrow-left" />
            </button>
            <button
              className="bd-gallery__arrow bd-gallery__arrow--next"
              onClick={next}
            >
              <i className="bi bi-arrow-right" />
            </button>
            <div className="bd-gallery__counter">
              {active + 1} / {imgs.length}
            </div>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="bd-gallery__thumbs">
          {imgs.map((src, i) => (
            <div
              key={i}
              className={`bd-gallery__thumb${i === active ? " active" : ""}`}
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
function Banner({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false);
  const monthly =
    property.status === "For Rent"
      ? property.price
      : Math.round(property.price * 0.005);

  return (
    <div className="bd-banner">
      <div className="row align-items-start">
        <div className="col-lg-7">
          <h1 className="bd-banner__title">{property.title}</h1>
          <div className="bd-banner__meta">
            <span
              className="bd-status-pill"
              style={{ background: getStatusColor(property.status) }}
            >
              {getStatusLabel(property.status)}
            </span>
            <span className="bd-meta-chip">
              <svg width="10" height="12" viewBox="0 0 11 13" fill="none">
                <path
                  d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.25A1.75 1.75 0 1 1 5.5 2.75a1.75 1.75 0 0 1 0 3.5z"
                  fill="currentColor"
                />
              </svg>
              {property.location}
            </span>
            {property.property_type && (
              <span className="bd-meta-chip">{property.property_type}</span>
            )}
          </div>
        </div>

        <div className="col-lg-5 bd-banner__price-col mt-3 mt-lg-0">
          <div className="bd-banner__price">
            <sup>$</sup>
            {property.price.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
            {property.status === "For Rent" && <sub> / mo</sub>}
          </div>
          {property.status !== "For Rent" && (
            <div className="bd-banner__est">
              Est. mortgage <strong>${monthly.toLocaleString()}/mo</strong>
            </div>
          )}
          <div className="bd-actions">
            <a href="#" className="bd-action-share">
              <i className="fa-sharp fa-regular fa-share-nodes" />
              Share
            </a>
            <button
              className={`bd-action-icon${saved ? " active" : ""}`}
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => setSaved((s) => !s)}
              title="Save"
            >
              <i
                className={saved ? "fa-solid fa-heart" : "fa-light fa-heart"}
              />
            </button>
            <a href="#" className="bd-action-icon" title="Bookmark">
              <i className="fa-light fa-bookmark" />
            </a>
            <a href="#" className="bd-action-icon" title="Compare">
              <i className="fa-light fa-circle-plus" />
            </a>
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
      icon: "⊞",
      label: "Area",
      value: property.sqft ? `${property.sqft.toLocaleString()} ft²` : "N/A",
    },
    { icon: "🛏", label: "Bedrooms", value: property.bedrooms ?? "—" },
    { icon: "🚿", label: "Bathrooms", value: property.bathrooms ?? "—" },
    { icon: "🍳", label: "Kitchens", value: property.kitchens ?? "—" },
  ];

  return (
    <div className="bd-overview">
      {items.map((item, i) => (
        <div key={i} className="bd-ov-item">
          <div className="bd-ov-icon">{item.icon}</div>
          <div className="bd-ov-label">{item.label}</div>
          <div className="bd-ov-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Feature accordion ────────────────────────────────────────
function FeatureAccordion({ property }: { property: Property }) {
  const [open, setOpen] = useState<number>(0);

  const sections = [
    { title: "Property Details", data: property.property_details ?? {} },
    { title: "Utility & Home Features", data: property.utility_features ?? {} },
    { title: "Outdoor Features", data: property.outdoor_features ?? {} },
  ];

  return (
    <div className="bd-accordion">
      {sections.map((section, idx) => {
        const entries = Object.entries(section.data).filter(
          ([, v]) => v && String(v).trim() !== "",
        );
        if (entries.length === 0) return null;
        const isOpen = open === idx;
        return (
          <div key={idx} className="bd-accordion__item">
            <button
              className={`bd-accordion__btn${isOpen ? " open" : ""}`}
              onClick={() => setOpen(isOpen ? -1 : idx)}
            >
              <span>{section.title}</span>
              <i className={`bi bi-chevron-down chevron`} />
            </button>
            {isOpen && (
              <div className="bd-accordion__body">
                <div className="bd-feat-grid">
                  {entries.map(([k, v]) => (
                    <div key={k} className="bd-feat-row">
                      <span className="bd-feat-key">{formatKey(k)}</span>
                      <span className="bd-feat-val">{v}</span>
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
    <div className="bd-amenity-wrap">
      {amenities.map((a, i) => (
        <span key={i} className="bd-amenity">
          <span className="bd-amenity__check">✓</span>
          {a}
        </span>
      ))}
    </div>
  );
}

// ─── Floor plan ───────────────────────────────────────────────
function FloorPlan({ floorPlans }: { floorPlans: string[] }) {
  const imgs = floorPlans && floorPlans.length > 0 ? floorPlans : null;
  if (!imgs)
    return (
      <div
        className="bd-floorplan"
        style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--c-ink-3)",
          fontSize: "14px",
        }}
      >
        No floor plans available
      </div>
    );

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
    <div className="bd-floorplan">
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
    <div className="bd-nearby-grid">
      {entries.map(([k, v]) => (
        <div key={k} className="bd-nearby-item">
          <span className="bd-nearby-key">{labelMap[k] ?? formatKey(k)}</span>
          <span className="bd-nearby-val">{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Walk score ───────────────────────────────────────────────
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
      icon: "🚌",
      label: "Transit Score",
      value: avg(
        distScore(nearby.metro ?? "99"),
        distScore(nearby.bus ?? "99"),
      ),
    },
    {
      icon: "🎓",
      label: "School Score",
      value: avg(
        distScore(nearby.school ?? "99"),
        distScore(nearby.university ?? "99"),
      ),
    },
    {
      icon: "🏥",
      label: "Medical Score",
      value: avg(
        distScore(nearby.hospital ?? "99"),
        distScore(nearby.pharmacy ?? "99"),
      ),
    },
    {
      icon: "🛒",
      label: "Shopping Score",
      value: avg(
        distScore(nearby.mall ?? "99"),
        distScore(nearby.grocery ?? "99"),
      ),
    },
  ];

  return (
    <>
      <p className="bd-body-text" style={{ marginBottom: "22px" }}>
        Scores are calculated from walking distance to nearby amenities.
      </p>
      {scores.map((item, i) => (
        <div key={i} className="bd-ws-item">
          <div className="bd-ws-icon">{item.icon}</div>
          <div className="bd-ws-info">
            <div className="bd-ws-label">
              {item.label}
              <span className="bd-ws-tag">— {tag(item.value)}</span>
            </div>
            <div className="bd-ws-track">
              <div className="bd-ws-fill" style={{ width: `${item.value}%` }} />
            </div>
          </div>
          <div className="bd-ws-num">{item.value}</div>
        </div>
      ))}
    </>
  );
}

// ─── Map ──────────────────────────────────────────────────────
function PropertyMap({ location }: { location: string }) {
  const q = encodeURIComponent(location);
  return (
    <div className="bd-map">
      <iframe
        title={`Map: ${location}`}
        src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&query=${q}`}
        height="400"
        style={{ border: 0, width: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="bd-map-footer">
        <i className="bi bi-geo-alt" />
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

// ─── Similar properties ───────────────────────────────────────
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
          <div className="bd-similar-card">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={item.title} />
            ) : (
              <div
                style={{
                  height: 185,
                  background: "var(--c-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                }}
              >
                🏠
              </div>
            )}
            <div className="bd-similar-card__body">
              <div className="bd-similar-card__price">
                <sup
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--c-ink-3)",
                    verticalAlign: "super",
                  }}
                >
                  $
                </sup>
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                {item.status === "For Rent" && (
                  <sub
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "var(--c-ink-3)",
                    }}
                  >
                    {" "}
                    /mo
                  </sub>
                )}
              </div>
              <div className="bd-similar-card__loc">
                <svg width="9" height="11" viewBox="0 0 11 13" fill="none">
                  <path
                    d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.25A1.75 1.75 0 1 1 5.5 2.75a1.75 1.75 0 0 1 0 3.5z"
                    fill="currentColor"
                  />
                </svg>
                {item.location}
              </div>
              <div className="bd-similar-card__meta">
                {item.bedrooms != null && `${item.bedrooms} bed`}
                {item.bathrooms != null && ` · ${item.bathrooms} bath`}
                {item.sqft != null && ` · ${item.sqft.toLocaleString()} ft²`}
              </div>
            </div>
            <div className="bd-similar-card__footer">
              <span
                className="bd-similar-badge"
                style={{ background: getStatusColor(item.status) }}
              >
                {getStatusLabel(item.status)}
              </span>
              <Link to={`/buy/${item.id}`} className="bd-similar-arrow">
                <i className="bi bi-arrow-up-right" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}

// ─── Price sidebar ────────────────────────────────────────────
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
    <div className="bd-sidebar-card">
      <span className="bd-sidebar-label">Pricing</span>
      <div className="bd-sidebar-price">
        <sup>$</sup>
        {property.price.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
        {property.status === "For Rent" && <sub> / mo</sub>}
      </div>
      {property.status !== "For Rent" && (
        <div className="bd-sidebar-est">
          Est. mortgage <strong>${monthly.toLocaleString()}/mo</strong>
        </div>
      )}
      <div style={{ marginTop: "16px" }}>
        {facts.map((f) => (
          <div key={f.k} className="bd-facts-row">
            <span className="bd-facts-key">{f.k}</span>
            <span className="bd-facts-val">{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Agent sidebar ────────────────────────────────────────────
function AgentSidebar({
  agent,
}: {
  agent: Record<string, string> | null | undefined;
}) {
  if (!agent) return null;
  return (
    <div className="bd-sidebar-card">
      <span className="bd-sidebar-label">Listed By</span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        <div className="bd-agent-avatar">
          {agent.name ? agent.name[0].toUpperCase() : "A"}
        </div>
        <div>
          <div className="bd-agent-name">{agent.name}</div>
          <div className="bd-agent-role">{agent.title || "Property Agent"}</div>
        </div>
      </div>
      {agent.phone && (
        <div className="bd-agent-row">
          <i className="bi bi-telephone" />
          <a href={`tel:${agent.phone}`}>{agent.phone}</a>
        </div>
      )}
      {agent.email && (
        <div className="bd-agent-row">
          <i className="bi bi-envelope" />
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
      )}
      {agent.location && (
        <div className="bd-agent-row">
          <i className="bi bi-geo-alt" />
          <span>{agent.location}</span>
        </div>
      )}
      {agent.email && (
        <a href={`mailto:${agent.email}`} className="bd-agent-cta">
          Contact Agent
        </a>
      )}
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────
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
    <div className="bd-sidebar-card">
      <span className="bd-sidebar-label">Send a Message</span>
      <input
        className="bd-input"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="bd-input"
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="bd-input"
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        className="bd-textarea"
        rows={4}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button className="bd-send-btn" onClick={handleSend}>
        Send Message
      </button>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ padding: "40px 0" }}>
      <div
        className="bd-skeleton"
        style={{ height: 36, width: "55%", marginBottom: 16 }}
      />
      <div
        className="bd-skeleton"
        style={{ height: 20, width: "35%", marginBottom: 32 }}
      />
      <div
        className="bd-skeleton"
        style={{ height: 460, borderRadius: 16, marginBottom: 24 }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 0,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 48,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bd-skeleton" style={{ height: 86 }} />
        ))}
      </div>
      <div className="row">
        <div className="col-xl-8">
          <div
            className="bd-skeleton"
            style={{ height: 18, width: "30%", marginBottom: 12 }}
          />
          {[120, 90, 60].map((h, i) => (
            <div
              key={i}
              className="bd-skeleton"
              style={{ height: h, marginBottom: 10 }}
            />
          ))}
        </div>
        <div className="col-xl-4">
          <div
            className="bd-skeleton"
            style={{ height: 220, borderRadius: 16, marginBottom: 16 }}
          />
          <div
            className="bd-skeleton"
            style={{ height: 180, borderRadius: 16 }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
const BuyDetails = () => {
  injectDetailStyles();

  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Error state
  if (!loading && (error || !property)) {
    return (
      <div className="bd-root listing-details-one border-top lg-mt-100 pt-50 pb-150 xl-pb-120">
        <div
          className="container"
          style={{ textAlign: "center", paddingTop: "80px" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              color: "var(--c-ink)",
              marginBottom: "8px",
            }}
          >
            {error || "Property not found"}
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "var(--c-ink-3)",
              marginBottom: "24px",
            }}
          >
            This listing may have been removed or the link is incorrect.
          </p>
          <Link
            to="/listing_13"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "11px 24px",
              background: "var(--c-ink)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              transition: "background 0.2s",
            }}
          >
            <i className="bi bi-arrow-left" /> Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const agent = property?.agent ?? property?.agent_info ?? null;

  return (
    <div className="bd-root listing-details-one border-top lg-mt-100 pt-50 pb-150 xl-pb-120">
      <div className="container">
        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {!loading && property && (
          <>
            {/* Breadcrumb */}
            <div className="bd-breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep">›</span>
              <Link to="/listing_13">Listings</Link>
              <span className="sep">›</span>
              <span className="current">{property.title}</span>
            </div>

            {/* Banner */}
            <Banner property={property} />

            {/* Gallery */}
            <Gallery images={property.images || []} title={property.title} />

            {/* Overview bar */}
            <OverviewBar property={property} />

            <div className="row">
              {/* ── Left column ── */}
              <div className="col-xl-8">
                {/* Overview / Description */}
                {property.description && (
                  <div className="bd-section">
                    <h4 className="bd-section__heading">Overview</h4>
                    <p className="bd-body-text">{property.description}</p>
                  </div>
                )}

                {/* Property Features */}
                <div className="bd-section">
                  <h4 className="bd-section__heading">Property Features</h4>
                  {property.features_description && (
                    <p
                      className="bd-body-text"
                      style={{ marginBottom: "18px" }}
                    >
                      {property.features_description}
                    </p>
                  )}
                  <FeatureAccordion property={property} />
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="bd-section">
                    <h4 className="bd-section__heading">Amenities</h4>
                    <p
                      className="bd-body-text"
                      style={{ marginBottom: "16px" }}
                    >
                      This property comes with the following amenities.
                    </p>
                    <Amenities amenities={property.amenities} />
                  </div>
                )}

                {/* Floor Plans */}
                <div className="bd-section">
                  <h4 className="bd-section__heading">Floor Plans</h4>
                  <FloorPlan floorPlans={property.floor_plans || []} />
                </div>

                {/* What's Nearby */}
                {property.whats_nearby && (
                  <div className="bd-section">
                    <h4 className="bd-section__heading">What's Nearby</h4>
                    <p
                      className="bd-body-text"
                      style={{ marginBottom: "16px" }}
                    >
                      Distances from this property to key local amenities.
                    </p>
                    <NearbyList nearby={property.whats_nearby} />
                  </div>
                )}

                {/* Similar Properties */}
                <div className="bd-section">
                  <h4 className="bd-section__heading">Similar Homes</h4>
                  <SimilarProperties
                    currentId={property.id}
                    propertyType={property.property_type}
                  />
                </div>

                {/* Walk Score */}
                {property.whats_nearby && (
                  <div className="bd-section">
                    <h4 className="bd-section__heading">Walk Score</h4>
                    <WalkScore nearby={property.whats_nearby} />
                  </div>
                )}

                {/* Location */}
                <div className="bd-section">
                  <h4 className="bd-section__heading">Location</h4>
                  <PropertyMap location={property.location} />
                </div>
              </div>

              {/* ── Right sidebar ── */}
              <div className="col-xl-4">
                <div style={{ position: "sticky", top: "100px" }}>
                  <PriceSidebar property={property} />
                  <AgentSidebar
                    agent={agent as Record<string, string> | null}
                  />
                  <ContactForm property={property} agentEmail={agent?.email} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyDetails;

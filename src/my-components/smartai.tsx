// ============================================================
//  SmartFinder.tsx — AI-style Smart Property Finder v2
//  Advanced NLP scoring engine + epic AI loading animation
//  Design: DM Serif Display + DM Sans, matches site tokens
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
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
  property_type: string;
  status: string;
  price: number;
  location: string;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  kitchens: number | null;
  images: string[];
  amenities: string[];
  description: string | null;
  whats_nearby: Record<string, string> | null;
  created_at: string;
}

interface ParsedIntent {
  bedrooms: number | null;
  bathrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  status: "For Sale" | "For Rent" | null;
  type: string | null;
  location: string | null;
  nearbyKeywords: string[];
  amenityKeywords: string[];
  generalKeywords: string[];
  minSqft: number | null;
  maxSqft: number | null;
  kitchens: number | null;
  furnished: boolean | null;
  newConstruction: boolean | null;
  quietArea: boolean | null;
  modernStyle: boolean | null;
}

interface ScoredProperty {
  property: Property;
  score: number;
  matchReasons: string[];
  highlights: string[];
}

// ─── AI Loading Steps ─────────────────────────────────────────
const AI_STEPS = [
  {
    icon: "🧠",
    label: "Parsing your natural language query…",
    detail: "Extracting intent signals",
  },
  {
    icon: "🔍",
    label: "Scanning property database…",
    detail: "Analyzing 500+ attributes",
  },
  {
    icon: "⚡",
    label: "Running semantic scoring engine…",
    detail: "Matching 47 criteria",
  },
  {
    icon: "📊",
    label: "Ranking by relevance…",
    detail: "Calculating match percentages",
  },
  {
    icon: "✨",
    label: "Personalizing results…",
    detail: "Applying smart filters",
  },
];

// ─── NPR price parser ─────────────────────────────────────────
function parseNPRAmount(token: string): number | null {
  const t = token.toLowerCase().replace(/,/g, "");
  const crMatch = t.match(/^([\d.]+)\s*cr(ore)?/);
  if (crMatch) return parseFloat(crMatch[1]) * 10_000_000;
  const lMatch = t.match(/^([\d.]+)\s*l(akh)?/);
  if (lMatch) return parseFloat(lMatch[1]) * 100_000;
  const kMatch = t.match(/^([\d.]+)\s*k$/);
  if (kMatch) return parseFloat(kMatch[1]) * 1_000;
  const mMatch = t.match(/^([\d.]+)\s*m(illion)?$/);
  if (mMatch) return parseFloat(mMatch[1]) * 1_000_000;
  const plain = t.match(/^\$?([\d.]+)$/);
  if (plain) return parseFloat(plain[1]);
  return null;
}

// ─── Advanced NLP Intent Parser ────────────────────────────────
function parseIntent(query: string): ParsedIntent {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/);

  const intent: ParsedIntent = {
    bedrooms: null,
    bathrooms: null,
    minPrice: null,
    maxPrice: null,
    status: null,
    type: null,
    location: null,
    nearbyKeywords: [],
    amenityKeywords: [],
    generalKeywords: [],
    minSqft: null,
    maxSqft: null,
    kitchens: null,
    furnished: null,
    newConstruction: null,
    quietArea: null,
    modernStyle: null,
  };

  // Status detection
  if (/\b(rent|renting|rental|to rent|for rent|lease|leasing)\b/.test(q))
    intent.status = "For Rent";
  else if (
    /\b(buy|buying|purchase|sale|for sale|to buy|invest|investment)\b/.test(q)
  )
    intent.status = "For Sale";

  // Bedrooms: "3 bed", "3bhk", "3 bedroom", "three bedroom", "studio"
  const wordNums: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
  };
  const bedMatch = q.match(
    /(\d+|one|two|three|four|five|six|seven|eight)\s*(bed|bedroom|bedrooms|bhk|br)\b/,
  );
  if (bedMatch) {
    intent.bedrooms = parseInt(bedMatch[1]) || wordNums[bedMatch[1]] || null;
  }
  if (/\bstudio\b/.test(q)) intent.bedrooms = 0;

  // Bathrooms
  const bathMatch = q.match(
    /(\d+|one|two|three|four|five)\s*(bath|bathroom|bathrooms|ba)\b/,
  );
  if (bathMatch) {
    intent.bathrooms = parseInt(bathMatch[1]) || wordNums[bathMatch[1]] || null;
  }

  // Kitchens
  const kitchenMatch = q.match(/(\d+|one|two|three)\s*(kitchen|kitchens)\b/);
  if (kitchenMatch) {
    intent.kitchens =
      parseInt(kitchenMatch[1]) || wordNums[kitchenMatch[1]] || null;
  }

  // Furnished
  if (/\b(furnished|fully furnished|semi-furnished)\b/.test(q))
    intent.furnished = true;
  if (/\b(unfurnished|bare|empty)\b/.test(q)) intent.furnished = false;

  // New construction
  if (
    /\b(new|brand new|newly built|new construction|modern building)\b/.test(q)
  )
    intent.newConstruction = true;

  // Quiet / peaceful area
  if (/\b(quiet|peaceful|serene|calm|silent|away from traffic)\b/.test(q))
    intent.quietArea = true;

  // Modern style
  if (
    /\b(modern|contemporary|sleek|minimalist|luxury|high-end|premium)\b/.test(q)
  )
    intent.modernStyle = true;

  // Sqft
  const sqftMatch = q.match(/(\d+)\s*(?:sq\.?ft|sqft|square\s*feet|sft)/);
  if (sqftMatch) {
    if (/min|above|over|atleast|at least/.test(q))
      intent.minSqft = parseInt(sqftMatch[1]);
    else if (/max|under|below|upto|up to/.test(q))
      intent.maxSqft = parseInt(sqftMatch[1]);
    else intent.minSqft = parseInt(sqftMatch[1]);
  }

  // Price range
  const rangeMatch = q.match(
    /([\d.]+\s*(?:cr(?:ore)?|l(?:akh)?|k|m(?:illion)?)?)\s*(?:to|-)\s*([\d.]+\s*(?:cr(?:ore)?|l(?:akh)?|k|m(?:illion)?)?)/,
  );
  if (rangeMatch) {
    intent.minPrice = parseNPRAmount(rangeMatch[1].trim());
    intent.maxPrice = parseNPRAmount(rangeMatch[2].trim());
  } else {
    const underMatch = q.match(
      /(?:under|below|max|maximum|upto|up to|within|budget|less than|no more than)\s*([\d.]+\s*(?:cr(?:ore)?|l(?:akh)?|k|m(?:illion)?)?)/,
    );
    if (underMatch) intent.maxPrice = parseNPRAmount(underMatch[1].trim());

    const aboveMatch = q.match(
      /(?:above|over|min|minimum|atleast|at least|more than|starting)\s*([\d.]+\s*(?:cr(?:ore)?|l(?:akh)?|k|m(?:illion)?)?)/,
    );
    if (aboveMatch) intent.minPrice = parseNPRAmount(aboveMatch[1].trim());
  }

  // Property type (expanded)
  const typeMap: Record<string, string> = {
    apartment: "Apartment",
    flat: "Apartment",
    condo: "Apartment",
    villa: "Villa",
    loft: "Loft",
    home: "Home",
    house: "Home",
    townhouse: "Home",
    building: "Building",
    office: "Office",
    commercial: "Office",
    studio: "Apartment",
    penthouse: "Apartment",
    duplex: "Home",
    bungalow: "Home",
  };
  for (const [key, val] of Object.entries(typeMap)) {
    if (q.includes(key)) {
      intent.type = val;
      break;
    }
  }

  // Nearby keywords (expanded)
  const nearbyWords = [
    "school",
    "hospital",
    "metro",
    "grocery",
    "gym",
    "mall",
    "park",
    "university",
    "college",
    "market",
    "airport",
    "bus",
    "pharmacy",
    "restaurant",
    "cafe",
    "bank",
    "temple",
    "church",
    "police",
    "station",
    "supermarket",
    "playground",
  ];
  for (const nw of nearbyWords) {
    if (q.includes(nw)) intent.nearbyKeywords.push(nw);
  }

  // Amenities (expanded)
  const amenityMap: Record<string, string> = {
    pool: "Swimming Pool",
    swimming: "Swimming Pool",
    parking: "Parking",
    garden: "Garden",
    wifi: "WiFi",
    internet: "WiFi",
    elevator: "Elevator",
    lift: "Elevator",
    gym: "Gym",
    fitness: "Gym",
    fireplace: "Fireplace",
    pet: "Pet Friendly",
    dogs: "Pet Friendly",
    cats: "Pet Friendly",
    ac: "A/C & Heating",
    "air conditioning": "A/C & Heating",
    heating: "A/C & Heating",
    garage: "Garages",
    balcony: "Balcony",
    terrace: "Balcony",
    security: "Security",
    cctv: "Security",
    generator: "Power Backup",
    backup: "Power Backup",
    solar: "Solar Power",
    rooftop: "Rooftop Access",
    laundry: "Laundry",
    storage: "Storage",
    concierge: "Concierge",
  };
  for (const [keyword, amenity] of Object.entries(amenityMap)) {
    if (q.includes(keyword) && !intent.amenityKeywords.includes(amenity)) {
      intent.amenityKeywords.push(amenity);
    }
  }

  // Location extraction (improved)
  const locPatterns = [
    /(?:in|near|at|around|within|located in)\s+([a-z][a-z\s]{1,25})(?:\s+(?:with|under|below|above|for|having|and|near|that|is|are|,|$))/,
    /([a-z][a-z\s]{1,20})\s+(?:area|neighborhood|district|ward|zone|locality)/,
  ];
  const skipWords = new Set([
    ...nearbyWords,
    ...Object.keys(amenityMap),
    "school",
    "hospital",
    "area",
    "neighborhood",
  ]);
  for (const pattern of locPatterns) {
    const locMatch = q.match(pattern);
    if (locMatch) {
      const candidate = locMatch[1].trim();
      if (!skipWords.has(candidate) && candidate.length > 2) {
        intent.location = candidate;
        break;
      }
    }
  }

  // General keywords
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "i",
    "want",
    "need",
    "looking",
    "find",
    "show",
    "me",
    "with",
    "and",
    "or",
    "for",
    "to",
    "in",
    "at",
    "near",
    "around",
    "under",
    "above",
    "below",
    "over",
    "max",
    "min",
    "budget",
    "within",
    "property",
    "properties",
    "house",
    "place",
    "something",
    "any",
    "good",
    "nice",
    "great",
    "please",
    "having",
    "has",
    "that",
    "is",
    "are",
    "like",
    "looking",
    "want",
    "need",
    "get",
    "find",
    "search",
    "buy",
    "rent",
  ]);
  for (const tok of tokens) {
    const clean = tok.replace(/[^a-z]/g, "");
    if (
      clean.length > 2 &&
      !stopWords.has(clean) &&
      !nearbyWords.includes(clean) &&
      !Object.keys(amenityMap).includes(clean)
    ) {
      intent.generalKeywords.push(clean);
    }
  }

  return intent;
}

// ─── Advanced Scoring Engine ───────────────────────────────────
function scoreProperty(p: Property, intent: ParsedIntent): ScoredProperty {
  let score = 0;
  const reasons: string[] = [];
  const highlights: string[] = [];

  // Status match
  if (intent.status && p.status === intent.status) {
    score += 30;
    reasons.push(`Listed ${intent.status}`);
  }

  // Bedrooms
  if (intent.bedrooms !== null && p.bedrooms !== null) {
    const diff = Math.abs(p.bedrooms - intent.bedrooms);
    if (diff === 0) {
      score += 25;
      reasons.push(`${p.bedrooms} bed ✓`);
      highlights.push(`${p.bedrooms} bedrooms`);
    } else if (diff === 1) {
      score += 10;
      reasons.push(`${p.bedrooms} bed (close)`);
    }
  }

  // Bathrooms
  if (intent.bathrooms !== null && p.bathrooms !== null) {
    const diff = Math.abs(p.bathrooms - intent.bathrooms);
    if (diff === 0) {
      score += 15;
      reasons.push(`${p.bathrooms} bath ✓`);
    } else if (diff === 1) score += 5;
  }

  // Kitchens
  if (intent.kitchens !== null && p.kitchens !== null) {
    if (p.kitchens >= intent.kitchens) {
      score += 10;
      reasons.push(`${p.kitchens} kitchen ✓`);
    }
  }

  // Price range
  const inPriceRange =
    (intent.minPrice === null || p.price >= intent.minPrice) &&
    (intent.maxPrice === null || p.price <= intent.maxPrice);
  if (intent.maxPrice !== null || intent.minPrice !== null) {
    if (inPriceRange) {
      score += 25;
      reasons.push("Within budget ✓");
      highlights.push("Within budget");
      if (intent.maxPrice && p.price < intent.maxPrice * 0.85) {
        score += 8;
        reasons.push("Well under budget");
      }
    } else {
      score -= 20;
    }
  }

  // Property type
  if (intent.type) {
    const typeMatch =
      p.property_type?.toLowerCase() === intent.type.toLowerCase();
    if (typeMatch) {
      score += 20;
      reasons.push(`${p.property_type} ✓`);
      highlights.push(p.property_type);
    }
  }

  // Sqft
  if (intent.minSqft !== null && p.sqft !== null) {
    if (p.sqft >= intent.minSqft) {
      score += 10;
      reasons.push(`${p.sqft.toLocaleString()} sqft ✓`);
    } else score -= 10;
  }
  if (intent.maxSqft !== null && p.sqft !== null) {
    if (p.sqft <= intent.maxSqft) score += 8;
  }

  // Location match (fuzzy)
  if (intent.location) {
    const loc = p.location?.toLowerCase() || "";
    const locWords = intent.location.split(" ").filter((w) => w.length > 2);
    const exactMatch = loc.includes(intent.location);
    const partialMatch = locWords.some((w) => loc.includes(w));
    if (exactMatch) {
      score += 22;
      reasons.push(`In ${intent.location} ✓`);
      highlights.push(`📍 ${p.location}`);
    } else if (partialMatch) {
      score += 10;
      reasons.push(`Near ${intent.location}`);
    }
  }

  // Nearby
  const nearby = p.whats_nearby || {};
  for (const kw of intent.nearbyKeywords) {
    if (Object.keys(nearby).some((k) => k.toLowerCase().includes(kw))) {
      score += 12;
      reasons.push(`Near ${kw} ✓`);
    }
  }

  // Amenities
  const amenities = (p.amenities || []).map((a) => a.toLowerCase());
  for (const aw of intent.amenityKeywords) {
    if (amenities.some((a) => a.toLowerCase().includes(aw.toLowerCase()))) {
      score += 10;
      reasons.push(`Has ${aw} ✓`);
      highlights.push(aw);
    }
  }

  // Modern / luxury bonus
  if (intent.modernStyle) {
    const modernKeywords = [
      "modern",
      "luxury",
      "contemporary",
      "premium",
      "new",
      "sleek",
    ];
    const searchText = [p.title, p.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (modernKeywords.some((kw) => searchText.includes(kw))) score += 8;
  }

  // New construction bonus
  if (intent.newConstruction) {
    const daysSince =
      (Date.now() - new Date(p.created_at).getTime()) / 86400000;
    if (daysSince < 90) {
      score += 10;
      reasons.push("Recently listed ✓");
    }
  }

  // General keyword fuzzy match
  const searchableText = [p.title, p.location, p.description, p.property_type]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  let kwHits = 0;
  for (const kw of intent.generalKeywords) {
    if (searchableText.includes(kw)) kwHits++;
  }
  if (kwHits > 0) {
    score += kwHits * 6;
    if (kwHits >= 2) reasons.push("Strong keyword match ✓");
  }

  // Recency boost
  const daysSince = (Date.now() - new Date(p.created_at).getTime()) / 86400000;
  if (daysSince < 7) score += 6;
  else if (daysSince < 30) score += 3;

  return {
    property: p,
    score,
    matchReasons: reasons.slice(0, 4),
    highlights: highlights.slice(0, 3),
  };
}

// ─── Helpers ──────────────────────────────────────────────────
function fmtPrice(price: number, status: string): string {
  const r = Math.round(price);
  let s = "";
  if (r >= 10_000_000) s = `रु ${(r / 10_000_000).toFixed(2)} Cr`;
  else if (r >= 100_000) s = `रु ${(r / 100_000).toFixed(2)} L`;
  else s = `रु ${r.toLocaleString("en-IN")}`;
  return status === "For Rent" ? `${s}/mo` : s;
}

function fmtNPR(v: number): string {
  const r = Math.round(v);
  if (r >= 10_000_000) return `रु ${(r / 10_000_000).toFixed(1)} Cr`;
  if (r >= 100_000) return `रु ${(r / 100_000).toFixed(1)} L`;
  return `रु ${r.toLocaleString("en-IN")}`;
}

function statusColor(status: string): string {
  switch (status) {
    case "For Sale":
      return "rgba(200,64,42,0.92)";
    case "For Rent":
      return "rgba(33,130,215,0.92)";
    case "Sold":
      return "rgba(56,161,105,0.92)";
    default:
      return "rgba(80,76,72,0.88)";
  }
}

function scoreColor(score: number): { bg: string; text: string; ring: string } {
  if (score >= 70) return { bg: "#edf7f1", text: "#2d7a4f", ring: "#b2e0c8" };
  if (score >= 45) return { bg: "#fef9ec", text: "#7a5f00", ring: "#fde68a" };
  return { bg: "#faf9f7", text: "#8a8785", ring: "#ede9e4" };
}

// ─── Suggestion chips ─────────────────────────────────────────
const SUGGESTIONS = [
  "3 bedroom apartment for rent under 50L",
  "villa with pool for sale",
  "2 bhk flat near school under 1Cr",
  "office space for rent in Kathmandu",
  "home with parking and garden",
  "apartment in Kathmandu under 80L",
  "4 bed villa with swimming pool",
  "1 bedroom furnished flat for rent",
];

// ─── All Styles ───────────────────────────────────────────────
const SF_STYLES = `
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
    --shadow-hover: 0 4px 8px rgba(26,23,21,0.08), 0 16px 40px rgba(26,23,21,0.13);
  }

  .sf-root, .sf-root * { font-family: var(--font-body); box-sizing: border-box; }

  .sf-page {
    background: var(--c-surface);
    min-height: 100vh;
    padding-bottom: 100px;
  }

  /* ── Hero ── */
  .sf-hero {
    background: var(--c-white);
    border-bottom: 1px solid var(--c-rule);
    padding: 36px 0 28px;
  }
  .sf-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--c-accent);
    margin-bottom: 12px;
  }
  .sf-hero__eyebrow::before {
    content: "";
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--c-accent);
    animation: sf-pulse 2s ease-in-out infinite;
  }
  @keyframes sf-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  .sf-hero__title {
    font-family: var(--font-display);
    font-size: 34px;
    font-weight: 400;
    color: var(--c-ink);
    line-height: 1.15;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .sf-hero__sub {
    font-size: 14px;
    color: var(--c-ink-3);
    margin-bottom: 28px;
    line-height: 1.6;
  }

  /* ── Search input ── */
  .sf-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--c-white);
    border: 2px solid var(--c-ink);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(26,23,21,0.10);
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .sf-input-wrap:focus-within {
    box-shadow: 0 6px 32px rgba(26,23,21,0.15);
    border-color: var(--c-accent);
  }
  .sf-input-icon {
    padding: 0 16px 0 20px;
    font-size: 18px;
    color: var(--c-ink-3);
    flex-shrink: 0;
    pointer-events: none;
  }
  .sf-input {
    flex: 1;
    padding: 18px 12px 18px 0;
    border: none;
    outline: none;
    font-size: 16px;
    font-family: var(--font-body);
    color: var(--c-ink);
    background: transparent;
  }
  .sf-input::placeholder { color: var(--c-ink-3); }
  .sf-clear-btn {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: none; background: var(--c-surface);
    display: flex; align-items: center; justify-content: center;
    color: var(--c-ink-3); font-size: 14px;
    cursor: pointer; margin-right: 6px;
    flex-shrink: 0;
    transition: all 0.18s;
  }
  .sf-clear-btn:hover { background: var(--c-rule); color: var(--c-ink); }
  .sf-search-btn {
    padding: 0 24px;
    height: 100%;
    border: none;
    background: var(--c-ink);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    font-family: var(--font-body);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.18s;
    white-space: nowrap;
    min-height: 58px;
  }
  .sf-search-btn:hover:not(:disabled) { background: var(--c-accent); }
  .sf-search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Suggestions ── */
  .sf-suggestions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .sf-sugg-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    display: flex;
    align-items: center;
    margin-right: 2px;
  }
  .sf-chip {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid var(--c-rule);
    background: var(--c-surface);
    font-size: 12.5px;
    color: var(--c-ink-2);
    cursor: pointer;
    transition: all 0.16s;
    white-space: nowrap;
  }
  .sf-chip:hover {
    border-color: var(--c-ink);
    background: var(--c-white);
    color: var(--c-ink);
  }

  /* ── Intent tokens ── */
  .sf-intent-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 14px 0 0;
    min-height: 44px;
  }
  .sf-intent-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-right: 2px;
  }
  .sf-token {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid;
    animation: sf-token-in 0.22s ease;
  }
  @keyframes sf-token-in {
    from { opacity: 0; transform: translateY(4px) scale(0.95); }
    to   { opacity: 1; transform: none; }
  }
  .sf-token--blue   { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
  .sf-token--green  { background: #edf7f1; border-color: #b2e0c8; color: #2d7a4f; }
  .sf-token--amber  { background: #fef9ec; border-color: #fde68a; color: #7a5f00; }
  .sf-token--red    { background: #fdf0ee; border-color: #f5c4bd; color: var(--c-accent); }
  .sf-token--purple { background: #f5f3ff; border-color: #ddd6fe; color: #5b21b6; }
  .sf-token--gray   { background: var(--c-surface); border-color: var(--c-rule); color: var(--c-ink-2); }

  /* ══════════════════════════════════════════
     AI LOADING OVERLAY — Epic animation
  ══════════════════════════════════════════ */
  .sf-ai-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
    overflow: hidden;
  }

  /* Frosted glass backdrop */
  .sf-ai-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(250, 249, 247, 0.82);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    animation: sf-backdrop-in 0.4s ease;
  }
  @keyframes sf-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Animated ambient orbs */
  .sf-ai-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.18;
    animation: sf-orb-drift 8s ease-in-out infinite alternate;
    pointer-events: none;
  }
  .sf-ai-orb--1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #c8402a, transparent);
    top: -100px; left: -100px;
    animation-duration: 9s;
  }
  .sf-ai-orb--2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #1d4ed8, transparent);
    bottom: -80px; right: -60px;
    animation-duration: 11s;
    animation-direction: alternate-reverse;
  }
  .sf-ai-orb--3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, #2d7a4f, transparent);
    top: 40%; left: 60%;
    animation-duration: 7s;
  }
  @keyframes sf-orb-drift {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(30px, -20px) scale(1.05); }
    100% { transform: translate(-15px, 25px) scale(0.97); }
  }

  /* Main card */
  .sf-ai-card {
    position: relative;
    z-index: 2;
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: 24px;
    padding: 48px 52px;
    width: min(560px, 90vw);
    box-shadow: 0 24px 80px rgba(26,23,21,0.15), 0 4px 16px rgba(26,23,21,0.08);
    animation: sf-card-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    overflow: hidden;
  }
  @keyframes sf-card-rise {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: none; }
  }

  /* Card shimmer sweep */
  .sf-ai-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
    animation: sf-shimmer-sweep 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes sf-shimmer-sweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }

  /* Brain / logo area */
  .sf-ai-brain {
    width: 72px; height: 72px;
    border-radius: 20px;
    background: var(--c-ink);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
    margin: 0 auto 24px;
    position: relative;
    animation: sf-brain-pulse 2s ease-in-out infinite;
  }
  @keyframes sf-brain-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(200,64,42,0.3); }
    50%       { box-shadow: 0 0 0 12px rgba(200,64,42,0); }
  }

  /* Rings around brain */
  .sf-ai-brain::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 28px;
    border: 2px solid rgba(200,64,42,0.2);
    animation: sf-ring-expand 2s ease-in-out infinite;
  }
  @keyframes sf-ring-expand {
    0%   { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.3); opacity: 0; }
  }

  .sf-ai-title {
    font-family: var(--font-display);
    font-size: 24px;
    color: var(--c-ink);
    text-align: center;
    margin-bottom: 6px;
    letter-spacing: -0.3px;
  }
  .sf-ai-subtitle {
    font-size: 13px;
    color: var(--c-ink-3);
    text-align: center;
    margin-bottom: 36px;
    line-height: 1.5;
  }

  /* Query echo */
  .sf-ai-query {
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 13px;
    color: var(--c-ink-2);
    text-align: center;
    margin-bottom: 32px;
    font-style: italic;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Step list */
  .sf-ai-steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }
  .sf-ai-step {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid var(--c-rule);
    background: var(--c-white);
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    opacity: 0.35;
    transform: translateX(-8px);
  }
  .sf-ai-step.active {
    opacity: 1;
    transform: none;
    background: #eff6ff;
    border-color: #bfdbfe;
    box-shadow: 0 2px 8px rgba(29,78,216,0.08);
  }
  .sf-ai-step.done {
    opacity: 0.7;
    transform: none;
    background: #edf7f1;
    border-color: #b2e0c8;
  }
  .sf-ai-step__icon {
    font-size: 20px;
    width: 36px;
    text-align: center;
    flex-shrink: 0;
  }
  .sf-ai-step__text { flex: 1; }
  .sf-ai-step__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--c-ink);
    margin-bottom: 1px;
  }
  .sf-ai-step__detail {
    font-size: 11px;
    color: var(--c-ink-3);
  }
  .sf-ai-step__check {
    font-size: 14px;
    transition: all 0.3s;
  }
  .sf-ai-step.done .sf-ai-step__check::after { content: '✓'; color: var(--c-better); font-weight: 700; }
  .sf-ai-step.active .sf-ai-step__check::after { content: ''; }

  /* Spinner for active step */
  .sf-ai-spinner {
    width: 16px; height: 16px;
    border: 2px solid #bfdbfe;
    border-top-color: #1d4ed8;
    border-radius: 50%;
    animation: sf-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes sf-spin { to { transform: rotate(360deg); } }

  /* Progress bar */
  .sf-ai-progress-wrap {
    height: 4px;
    background: var(--c-rule);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .sf-ai-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--c-accent), #1d4ed8, var(--c-better));
    background-size: 200% 100%;
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    animation: sf-progress-shimmer 1.5s linear infinite;
  }
  @keyframes sf-progress-shimmer {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  .sf-ai-progress-label {
    font-size: 11px;
    color: var(--c-ink-3);
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* Particle dots floating around */
  .sf-ai-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    border-radius: 24px;
  }
  .sf-ai-particle {
    position: absolute;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--c-accent);
    opacity: 0;
    animation: sf-particle-float 3s ease-in-out infinite;
  }
  @keyframes sf-particle-float {
    0%   { opacity: 0; transform: translateY(0) scale(0); }
    20%  { opacity: 0.6; transform: translateY(-20px) scale(1); }
    80%  { opacity: 0.3; transform: translateY(-60px) scale(0.6); }
    100% { opacity: 0; transform: translateY(-90px) scale(0); }
  }

  /* ── Results area ── */
  .sf-results-section { padding-top: 32px; }
  .sf-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .sf-results-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 400;
    color: var(--c-ink);
    letter-spacing: -0.2px;
  }
  .sf-results-count {
    font-size: 13px;
    color: var(--c-ink-3);
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: 20px;
    padding: 4px 12px;
  }
  .sf-sort-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .sf-sort-label { font-size: 12px; color: var(--c-ink-3); }
  .sf-sort-btn {
    padding: 5px 13px;
    border-radius: 20px;
    border: 1px solid var(--c-rule);
    background: var(--c-white);
    font-size: 12px;
    font-weight: 600;
    color: var(--c-ink-3);
    cursor: pointer;
    transition: all 0.16s;
  }
  .sf-sort-btn.active {
    background: var(--c-ink);
    border-color: var(--c-ink);
    color: #fff;
  }

  /* ── Property card ── */
  .sf-card {
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.26s, transform 0.26s;
    display: flex;
    flex-direction: column;
    animation: sf-card-in 0.35s ease both;
  }
  @keyframes sf-card-in {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }
  .sf-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-3px);
  }
  .sf-card__img {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: var(--c-surface);
  }
  .sf-card__img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .sf-card:hover .sf-card__img img { transform: scale(1.05); }
  .sf-card__img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem;
  }

  /* Score badge */
  .sf-score-badge {
    position: absolute;
    top: 10px; right: 10px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.3px;
    backdrop-filter: blur(6px);
    z-index: 2;
  }
  .sf-status-badge {
    position: absolute;
    top: 10px; left: 10px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.5px;
    color: #fff; z-index: 2;
  }

  /* Card body */
  .sf-card__body { padding: 18px 20px 12px; flex: 1; }
  .sf-card__type {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.9px; text-transform: uppercase;
    color: var(--c-ink-3); margin-bottom: 4px;
  }
  .sf-card__title {
    font-family: var(--font-display);
    font-size: 16px; font-weight: 400;
    color: var(--c-ink); text-decoration: none;
    display: block; margin-bottom: 5px;
    line-height: 1.25; transition: color 0.18s;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sf-card__title:hover { color: var(--c-accent); }
  .sf-card__loc {
    font-size: 12px; color: var(--c-ink-3);
    display: flex; align-items: center; gap: 4px;
    margin-bottom: 12px;
  }

  /* Match reasons */
  .sf-reasons {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 12px;
  }
  .sf-reason-tag {
    font-size: 10.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    background: var(--c-better);
    color: #fff;
    opacity: 0.9;
  }

  /* Feature chips */
  .sf-feats {
    display: flex; gap: 6px; flex-wrap: wrap;
    border-top: 1px solid var(--c-rule);
    padding-top: 12px;
  }
  .sf-feat {
    display: flex; align-items: center; gap: 5px;
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    border-radius: 8px;
    padding: 4px 9px;
    font-size: 11.5px;
    color: var(--c-ink-2);
    font-weight: 500;
  }

  /* Card footer */
  .sf-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 16px;
  }
  .sf-card__price {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 400;
    color: var(--c-ink); letter-spacing: -0.4px;
  }
  .sf-card__arrow {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--c-ink); color: #fff;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 13px;
    transition: background 0.18s, transform 0.22s;
    flex-shrink: 0;
  }
  .sf-card__arrow:hover { background: var(--c-accent); transform: rotate(45deg); }

  /* ── Initial state (centered, padded) ── */
  .sf-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 40px 100px;
    max-width: 600px;
    margin: 0 auto;
  }
  .sf-state__icon {
    font-size: 3.5rem;
    margin-bottom: 20px;
    animation: sf-icon-float 3s ease-in-out infinite;
  }
  @keyframes sf-icon-float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  .sf-state__title {
    font-family: var(--font-display);
    font-size: 26px;
    color: var(--c-ink);
    margin-bottom: 12px;
    font-weight: 400;
    letter-spacing: -0.3px;
  }
  .sf-state__sub {
    font-size: 15px;
    color: var(--c-ink-3);
    line-height: 1.7;
    margin-bottom: 0;
    max-width: 420px;
  }

  /* Feature pill grid */
  .sf-feat-grid {
    margin-top: 36px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 480px;
  }
  .sf-feat-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: 14px;
    padding: 18px 12px;
    font-size: 12.5px;
    color: var(--c-ink-2);
    font-weight: 500;
    box-shadow: var(--shadow-card);
    transition: all 0.2s;
    animation: sf-pill-in 0.4s ease both;
  }
  .sf-feat-pill:hover {
    border-color: var(--c-accent);
    box-shadow: 0 4px 16px rgba(200,64,42,0.1);
    transform: translateY(-2px);
  }
  .sf-feat-pill span:first-child { font-size: 1.6rem; }

  @keyframes sf-pill-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── No results ── */
  .sf-no-results {
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: var(--radius-card);
    padding: 50px 30px;
    text-align: center;
    box-shadow: var(--shadow-card);
  }

  /* ── Scrollbar ── */
  .sf-root ::-webkit-scrollbar { width: 5px; height: 5px; }
  .sf-root ::-webkit-scrollbar-track { background: var(--c-surface); }
  .sf-root ::-webkit-scrollbar-thumb { background: var(--c-rule); border-radius: 3px; }
`;

function injectSFStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("smart-finder-styles")
  ) {
    const el = document.createElement("style");
    el.id = "smart-finder-styles";
    el.textContent = SF_STYLES;
    document.head.appendChild(el);
  }
}

// ─── AI Loading Overlay ────────────────────────────────────────
function AILoadingOverlay({
  query,
  onDone,
}: {
  query: string;
  onDone: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalMs = 5000;
    const stepMs = totalMs / AI_STEPS.length;

    const timers: ReturnType<typeof setTimeout>[] = [];

    AI_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(i);
          setProgress(Math.round(((i + 0.5) / AI_STEPS.length) * 100));
          if (i > 0) setDoneSteps((prev) => [...prev, i - 1]);
        }, i * stepMs),
      );
    });

    // Final
    timers.push(
      setTimeout(() => {
        setDoneSteps([0, 1, 2, 3, 4]);
        setProgress(100);
        setTimeout(onDone, 400);
      }, totalMs),
    );

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  // Particle positions
  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${8 + ((i * 7.5) % 85)}%`,
    bottom: `${10 + ((i * 11) % 30)}%`,
    delay: `${(i * 0.25) % 3}s`,
    color: i % 3 === 0 ? "#c8402a" : i % 3 === 1 ? "#1d4ed8" : "#2d7a4f",
  }));

  return (
    <div className="sf-ai-overlay">
      <div className="sf-ai-backdrop" />
      <div className="sf-ai-orb sf-ai-orb--1" />
      <div className="sf-ai-orb sf-ai-orb--2" />
      <div className="sf-ai-orb sf-ai-orb--3" />

      <div className="sf-ai-card">
        <div className="sf-ai-particles">
          {particles.map((p, i) => (
            <div
              key={i}
              className="sf-ai-particle"
              style={{
                left: p.left,
                bottom: p.bottom,
                animationDelay: p.delay,
                background: p.color,
              }}
            />
          ))}
        </div>

        <div className="sf-ai-brain">🔮</div>

        <div className="sf-ai-title">Analysing your query</div>
        <div className="sf-ai-subtitle">
          Our AI is intelligently matching properties
          <br />
          to your exact requirements
        </div>

        <div className="sf-ai-query">"{query}"</div>

        <div className="sf-ai-steps">
          {AI_STEPS.map((step, i) => {
            const isDone = doneSteps.includes(i);
            const isActive = activeStep === i && !isDone;
            return (
              <div
                key={i}
                className={`sf-ai-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
              >
                <div className="sf-ai-step__icon">{step.icon}</div>
                <div className="sf-ai-step__text">
                  <div className="sf-ai-step__label">{step.label}</div>
                  <div className="sf-ai-step__detail">{step.detail}</div>
                </div>
                {isActive && <div className="sf-ai-spinner" />}
                <div className="sf-ai-step__check" />
              </div>
            );
          })}
        </div>

        <div className="sf-ai-progress-wrap">
          <div
            className="sf-ai-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="sf-ai-progress-label">{progress}% complete</div>
      </div>
    </div>
  );
}

// ─── Intent Token Display ─────────────────────────────────────
function IntentTokens({ intent }: { intent: ParsedIntent }) {
  const tokens: { label: string; color: string }[] = [];

  if (intent.status)
    tokens.push({ label: intent.status, color: "sf-token--blue" });
  if (intent.type)
    tokens.push({ label: intent.type, color: "sf-token--purple" });
  if (intent.bedrooms !== null)
    tokens.push({ label: `${intent.bedrooms} Bed`, color: "sf-token--gray" });
  if (intent.bathrooms !== null)
    tokens.push({ label: `${intent.bathrooms} Bath`, color: "sf-token--gray" });
  if (intent.kitchens !== null)
    tokens.push({
      label: `${intent.kitchens} Kitchen`,
      color: "sf-token--gray",
    });
  if (intent.furnished === true)
    tokens.push({ label: "Furnished", color: "sf-token--purple" });
  if (intent.minPrice !== null && intent.maxPrice !== null)
    tokens.push({
      label: `Budget: ${fmtNPR(intent.minPrice)} – ${fmtNPR(intent.maxPrice)}`,
      color: "sf-token--amber",
    });
  else if (intent.maxPrice !== null)
    tokens.push({
      label: `Under ${fmtNPR(intent.maxPrice)}`,
      color: "sf-token--amber",
    });
  else if (intent.minPrice !== null)
    tokens.push({
      label: `Above ${fmtNPR(intent.minPrice)}`,
      color: "sf-token--amber",
    });
  if (intent.location)
    tokens.push({ label: `📍 ${intent.location}`, color: "sf-token--green" });
  for (const nw of intent.nearbyKeywords)
    tokens.push({ label: `Near ${nw}`, color: "sf-token--green" });
  for (const aw of intent.amenityKeywords)
    tokens.push({ label: aw, color: "sf-token--red" });
  if (intent.minSqft !== null)
    tokens.push({
      label: `Min ${intent.minSqft.toLocaleString()} sqft`,
      color: "sf-token--gray",
    });
  if (intent.modernStyle)
    tokens.push({ label: "Modern / Luxury", color: "sf-token--purple" });
  if (intent.quietArea)
    tokens.push({ label: "Quiet area", color: "sf-token--green" });

  if (tokens.length === 0) return null;

  return (
    <div className="sf-intent-bar">
      <span className="sf-intent-label">Understood:</span>
      {tokens.map((t, i) => (
        <span key={i} className={`sf-token ${t.color}`}>
          {t.label}
        </span>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const SmartFinder = () => {
  injectSFStyles();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [results, setResults] = useState<ScoredProperty[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortMode, setSortMode] = useState<
    "relevance" | "price_low" | "price_high" | "newest"
  >("relevance");
  const [showAILoader, setShowAILoader] = useState(false);
  const [pendingQuery, setPendingQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      setAllProperties((data as Property[]) || []);
      setLoading(false);
    })();
  }, []);

  const executeSearch = useCallback(
    (q: string) => {
      const intent = parseIntent(q);
      let candidates = [...allProperties];
      if (intent.status)
        candidates = candidates.filter((p) => p.status === intent.status);
      const scored = candidates.map((p) => scoreProperty(p, intent));
      const positive = scored.filter((s) => s.score > 0);
      const pool = positive.length >= 3 ? positive : scored;
      setResults(pool);
      setSubmitted(q);
      setHasSearched(true);
      setSortMode("relevance");
    },
    [allProperties],
  );

  const handleAILoadingDone = useCallback(() => {
    setShowAILoader(false);
    executeSearch(pendingQuery);
  }, [pendingQuery, executeSearch]);

  const runSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setPendingQuery(q);
    setShowAILoader(true);
  }, []);

  const sortedResults = [...results].sort((a, b) => {
    if (sortMode === "relevance") return b.score - a.score;
    if (sortMode === "price_low") return a.property.price - b.property.price;
    if (sortMode === "price_high") return b.property.price - a.property.price;
    if (sortMode === "newest")
      return (
        new Date(b.property.created_at).getTime() -
        new Date(a.property.created_at).getTime()
      );
    return 0;
  });

  const parsedIntent = submitted ? parseIntent(submitted) : null;
  const maxScore = sortedResults[0]?.score || 1;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    runSearch(query);
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    runSearch(s);
    inputRef.current?.focus();
  };

  return (
    <Wrapper>
      <SEO pageTitle="Smart Property Finder" />
      <NavMenu />

      {/* AI Loading Overlay */}
      {showAILoader && (
        <AILoadingOverlay query={pendingQuery} onDone={handleAILoadingDone} />
      )}

      {/* ── Banner ── */}
      <div className="inner-banner-three inner-banner text-center z-1 position-relative">
        <div
          className="bg-wrapper overflow-hidden position-relative z-1"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        >
          <div className="container position-relative z-2">
            <h2 className="mb-35 xl-mb-20 md-mb-10 pt-15 font-garamond text-white">
              Smart Property Finder
            </h2>
            <ul className="theme-breadcrumb style-none d-inline-flex align-items-center justify-content-center position-relative z-1 bottom-line">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>/</li>
              <li>Smart Finder</li>
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

      <div className="sf-root sf-page">
        {/* ── Hero search ── */}
        <div className="sf-hero">
          <div className="container">
            <div className="sf-hero__eyebrow">Smart Search</div>
            <h1 className="sf-hero__title">
              Describe your dream property
              <br />
              <em>in plain words</em>
            </h1>
            <p className="sf-hero__sub">
              Type naturally — "3 bed near school under 1Cr for rent" — and
              we'll find your best matches instantly.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="sf-input-wrap">
                <span className="sf-input-icon">🔍</span>
                <input
                  ref={inputRef}
                  className="sf-input"
                  placeholder='e.g. "3 bedroom apartment for rent under 50L near school"'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    className="sf-clear-btn"
                    onClick={() => {
                      setQuery("");
                      setHasSearched(false);
                      setResults([]);
                      setSubmitted("");
                    }}
                  >
                    ✕
                  </button>
                )}
                <button
                  type="submit"
                  className="sf-search-btn"
                  disabled={loading || !query.trim() || showAILoader}
                >
                  <i className="bi bi-stars" />
                  Find Matches
                </button>
              </div>
            </form>

            {parsedIntent && submitted && (
              <IntentTokens intent={parsedIntent} />
            )}

            {!hasSearched && (
              <div className="sf-suggestions">
                <span className="sf-sugg-label">Try:</span>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="sf-chip"
                    onClick={() => handleSuggestion(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container">
          {/* Loading DB */}
          {loading && (
            <div className="sf-state">
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
                Loading properties…
              </p>
            </div>
          )}

          {/* Initial state */}
          {!loading && !hasSearched && (
            <div className="sf-state">
              <div className="sf-state__icon">🏡</div>
              <div className="sf-state__title">What are you looking for?</div>
              <p className="sf-state__sub">
                Use the search bar above to describe your ideal property.
                <br />
                Be as specific or as casual as you like — we'll figure it out.
              </p>

              <div className="sf-feat-grid">
                {[
                  { icon: "🛏", label: "Bedrooms" },
                  { icon: "📍", label: "Location" },
                  { icon: "💰", label: "Budget" },
                  { icon: "✨", label: "Amenities" },
                  { icon: "🏫", label: "Nearby" },
                  { icon: "🏠", label: "Type" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="sf-feat-pill"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && hasSearched && (
            <div className="sf-results-section">
              <div className="sf-results-header">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span className="sf-results-title">
                    {sortedResults.length > 0
                      ? "Best matches"
                      : "No matches found"}
                  </span>
                  {sortedResults.length > 0 && (
                    <span className="sf-results-count">
                      {sortedResults.length} propert
                      {sortedResults.length === 1 ? "y" : "ies"}
                    </span>
                  )}
                </div>

                {sortedResults.length > 1 && (
                  <div className="sf-sort-row">
                    <span className="sf-sort-label">Sort:</span>
                    {(
                      [
                        "relevance",
                        "price_low",
                        "price_high",
                        "newest",
                      ] as const
                    ).map((m) => (
                      <button
                        key={m}
                        className={`sf-sort-btn${sortMode === m ? " active" : ""}`}
                        onClick={() => setSortMode(m)}
                      >
                        {
                          {
                            relevance: "Best Match",
                            price_low: "Price ↑",
                            price_high: "Price ↓",
                            newest: "Newest",
                          }[m]
                        }
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {sortedResults.length === 0 ? (
                <div className="sf-no-results">
                  <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>
                    🔍
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      color: "var(--c-ink)",
                      marginBottom: "8px",
                    }}
                  >
                    No properties matched
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--c-ink-3)",
                      maxWidth: "400px",
                      margin: "0 auto 24px",
                      lineHeight: 1.7,
                    }}
                  >
                    Try broadening your search — remove price limits, change the
                    type, or use fewer filters.
                  </p>
                  <button
                    className="sf-chip"
                    style={{ fontSize: "13px", padding: "8px 20px" }}
                    onClick={() => {
                      setHasSearched(false);
                      setResults([]);
                      setSubmitted("");
                      setQuery("");
                    }}
                  >
                    Clear & try again
                  </button>
                </div>
              ) : (
                <div className="row gx-3 gy-4">
                  {sortedResults.map(
                    ({ property: p, score, matchReasons }, idx) => {
                      const sc = scoreColor(score);
                      const scorePct = Math.min(
                        100,
                        Math.round((score / Math.max(maxScore, 1)) * 100),
                      );
                      return (
                        <div
                          key={p.id}
                          className="col-xl-4 col-md-6 d-flex"
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div className="sf-card w-100">
                            <div className="sf-card__img">
                              {p.images?.[0] ? (
                                <img
                                  src={p.images[0]}
                                  alt={p.title}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="sf-card__img-placeholder">
                                  🏠
                                </div>
                              )}
                              <span
                                className="sf-status-badge"
                                style={{ background: statusColor(p.status) }}
                              >
                                {p.status}
                              </span>
                              {submitted && (
                                <span
                                  className="sf-score-badge"
                                  style={{
                                    background: sc.bg,
                                    color: sc.text,
                                    border: `1px solid ${sc.ring}`,
                                  }}
                                >
                                  {scorePct}% match
                                </span>
                              )}
                            </div>

                            <div className="sf-card__body">
                              {p.property_type && (
                                <div className="sf-card__type">
                                  {p.property_type}
                                </div>
                              )}
                              <Link
                                to={`/buy/${p.id}`}
                                className="sf-card__title"
                                title={p.title}
                              >
                                {p.title}
                              </Link>
                              <div className="sf-card__loc">
                                <svg
                                  width="10"
                                  height="12"
                                  viewBox="0 0 11 13"
                                  fill="none"
                                  style={{ flexShrink: 0 }}
                                >
                                  <path
                                    d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.25A1.75 1.75 0 1 1 5.5 2.75a1.75 1.75 0 0 1 0 3.5z"
                                    fill="currentColor"
                                  />
                                </svg>
                                {p.location}
                              </div>

                              {matchReasons.length > 0 && (
                                <div className="sf-reasons">
                                  {matchReasons.map((r, i) => (
                                    <span key={i} className="sf-reason-tag">
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {(p.sqft ||
                                p.bedrooms != null ||
                                p.bathrooms != null) && (
                                <div className="sf-feats">
                                  {p.sqft && (
                                    <span className="sf-feat">
                                      <img
                                        src="/assets/images/icon/icon_32.svg"
                                        alt=""
                                        style={{ width: 12, opacity: 0.6 }}
                                      />
                                      {p.sqft.toLocaleString()} ft²
                                    </span>
                                  )}
                                  {p.bedrooms != null && (
                                    <span className="sf-feat">
                                      <img
                                        src="/assets/images/icon/icon_33.svg"
                                        alt=""
                                        style={{ width: 12, opacity: 0.6 }}
                                      />
                                      {p.bedrooms} bed
                                    </span>
                                  )}
                                  {p.bathrooms != null && (
                                    <span className="sf-feat">
                                      <img
                                        src="/assets/images/icon/icon_34.svg"
                                        alt=""
                                        style={{ width: 12, opacity: 0.6 }}
                                      />
                                      {p.bathrooms} bath
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="sf-card__footer">
                              <div className="sf-card__price">
                                {fmtPrice(p.price, p.status)}
                              </div>
                              <Link
                                to={`/buy/${p.id}`}
                                className="sf-card__arrow"
                              >
                                <i className="bi bi-arrow-up-right" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              {sortedResults.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "48px" }}>
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "var(--c-ink-3)",
                      marginBottom: "14px",
                    }}
                  >
                    Not finding what you want?
                  </p>
                  <div
                    className="sf-suggestions"
                    style={{ justifyContent: "center" }}
                  >
                    {SUGGESTIONS.filter((s) => s !== submitted)
                      .slice(0, 4)
                      .map((s, i) => (
                        <button
                          key={i}
                          className="sf-chip"
                          onClick={() => handleSuggestion(s)}
                        >
                          {s}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Brand />
      <FancyBanner />
      <FutureFooter />
    </Wrapper>
  );
};

export default SmartFinder;

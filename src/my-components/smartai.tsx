// ============================================================
//  SmartFinder.tsx — AI-style Smart Property Finder v2
//  Advanced NLP scoring engine + epic AI loading animation
//  Design: DM Serif Display + DM Sans, matches site tokens
//  Colors: #252060 (navy) + #1C94A4 (teal) — FutureWork brand
//  v3: All emojis replaced with inline SVGs
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";

import FutureFooter from "../layouts/footers/FutureFooter";
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

// ─── SVG Icon Components ──────────────────────────────────────

const IconBrain = ({
  size = 32,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 6C8.24 6 6 8.24 6 11c0 1.3.48 2.48 1.27 3.38C6.48 15.24 6 16.5 6 17.88 6 20.7 8.07 23 10.75 23H11v1a2 2 0 0 0 4 0v-1h2v1a2 2 0 0 0 4 0v-1h.25C23.93 23 26 20.7 26 17.88c0-1.38-.48-2.64-1.27-3.5C25.52 13.48 26 12.3 26 11c0-2.76-2.24-5-5-5-1.02 0-1.97.31-2.76.83A4.98 4.98 0 0 0 16 6c-.45 0-.88.06-1.29.17A4.96 4.96 0 0 0 11 6z"
      fill={color}
      opacity="0.9"
    />
    <circle
      cx="13"
      cy="12"
      r="1.5"
      fill={color === "#fff" ? "#1C94A4" : "#fff"}
      opacity="0.7"
    />
    <circle
      cx="19"
      cy="12"
      r="1.5"
      fill={color === "#fff" ? "#1C94A4" : "#fff"}
      opacity="0.7"
    />
    <path
      d="M13 17c0 1.66 1.34 3 3 3s3-1.34 3-3"
      stroke={color === "#fff" ? "#1C94A4" : "#fff"}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

const IconSearch = ({
  size = 18,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.8" />
    <path
      d="M13.5 13.5L17 17"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconLightning = ({
  size = 20,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 2L4 11h6l-1 7 7-9h-6l1-7z"
      fill={color}
      strokeLinejoin="round"
    />
  </svg>
);

const IconChart = ({
  size = 20,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="10" width="3" height="8" rx="1" fill={color} opacity="0.7" />
    <rect x="7" y="6" width="3" height="12" rx="1" fill={color} />
    <rect
      x="12"
      y="3"
      width="3"
      height="15"
      rx="1"
      fill={color}
      opacity="0.85"
    />
    <rect
      x="17"
      y="8"
      width="3"
      height="10"
      rx="1"
      fill={color}
      opacity="0.6"
    />
  </svg>
);

const IconSparkle = ({
  size = 20,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 2l1.5 5.5L17 9l-5.5 1.5L10 16l-1.5-5.5L3 9l5.5-1.5L10 2z"
      fill={color}
    />
    <path
      d="M16 2l.7 2.3L19 5l-2.3.7L16 8l-.7-2.3L13 5l2.3-.7L16 2z"
      fill={color}
      opacity="0.6"
    />
  </svg>
);

const IconDatabase = ({
  size = 20,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="10" cy="5" rx="7" ry="2.5" stroke={color} strokeWidth="1.5" />
    <path
      d="M3 5v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V5"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M3 10v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-5"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
);

const IconHome = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12L12 3l9 9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHomeLarge = ({
  size = 56,
  color = "#1C94A4",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 28L28 7l21 21"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.4"
    />
    <path
      d="M11 24v20a2 2 0 0 0 2 2h10v-12h10v12h10a2 2 0 0 0 2-2V24"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="28" cy="30" r="4" fill={color} opacity="0.2" />
  </svg>
);

const IconBed = ({
  size = 12,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="7"
      width="18"
      height="7"
      rx="1.5"
      stroke={color}
      strokeWidth="1.5"
    />
    <path d="M1 10h18" stroke={color} strokeWidth="1.5" />
    <path
      d="M1 14V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect x="4" y="5" width="5" height="3" rx="1" fill={color} opacity="0.5" />
    <rect x="11" y="5" width="5" height="3" rx="1" fill={color} opacity="0.5" />
  </svg>
);

const IconBath = ({
  size = 12,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 9h16v3a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V9z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M2 9V4a2 2 0 0 1 4 0v1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6 16l-1 2M14 16l1 2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconRuler = ({
  size = 12,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 13L13 3l4 4L7 17 3 13z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M7 7l2 2M10 10l2 2"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const IconPin = ({
  size = 10,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size + 2}
    viewBox="0 0 11 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.25A1.75 1.75 0 1 1 5.5 2.75a1.75 1.75 0 0 1 0 3.5z"
      fill={color}
    />
  </svg>
);

const IconX = ({
  size = 14,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2l10 10M12 2L2 12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconArrowUpRight = ({
  size = 13,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 11L11 2M11 2H4M11 2v7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconStars = ({
  size = 14,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1l1.8 5h5.2l-4.2 3 1.6 5L8 11l-4.4 3 1.6-5L1 6h5.2L8 1z"
      fill={color}
    />
  </svg>
);

const IconMagnify = ({
  size = 56,
  color = "#1C94A4",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="24"
      cy="24"
      r="14"
      stroke={color}
      strokeWidth="2.5"
      opacity="0.4"
    />
    <circle cx="24" cy="24" r="8" fill={color} opacity="0.12" />
    <path
      d="M34 34L47 47"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M20 24h8M24 20v8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// Feature pill icons
const IconBedFeature = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="10"
      width="24"
      height="10"
      rx="2"
      stroke="#1C94A4"
      strokeWidth="1.6"
    />
    <path d="M1 14h24" stroke="#1C94A4" strokeWidth="1.6" />
    <path
      d="M1 20V5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v5"
      stroke="#1C94A4"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <rect
      x="5"
      y="7"
      width="7"
      height="4"
      rx="1.2"
      fill="#1C94A4"
      opacity="0.35"
    />
    <rect
      x="14"
      y="7"
      width="7"
      height="4"
      rx="1.2"
      fill="#1C94A4"
      opacity="0.35"
    />
  </svg>
);

const IconPinFeature = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 1C8.03 1 4 5.03 4 10c0 7.5 9 19 9 19s9-11.5 9-19c0-4.97-4.03-9-9-9z"
      stroke="#1C94A4"
      strokeWidth="1.7"
    />
    <circle cx="13" cy="10" r="3.5" fill="#1C94A4" opacity="0.4" />
  </svg>
);

const IconBudget = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="13" cy="13" r="11" stroke="#1C94A4" strokeWidth="1.7" />
    <path
      d="M13 6v1.5M13 18.5V20"
      stroke="#1C94A4"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9.5 9.5C9.5 8.12 11.07 7 13 7s3.5 1.12 3.5 2.5c0 2.5-7 2-7 5 0 1.38 1.57 2.5 3.5 2.5s3.5-1.12 3.5-2.5"
      stroke="#1C94A4"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconAmenity = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 2l2.5 7.5H23l-6 4.5 2.3 7L13 17l-6.3 4 2.3-7L3 9.5h7.5L13 2z"
      stroke="#1C94A4"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="13" cy="13" r="3" fill="#1C94A4" opacity="0.3" />
  </svg>
);

const IconNearby = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 13h3M20 13h3M13 3v3M13 20v3"
      stroke="#1C94A4"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="13" cy="13" r="5" stroke="#1C94A4" strokeWidth="1.6" />
    <circle cx="13" cy="13" r="1.5" fill="#1C94A4" />
    <path
      d="M13 13l4-4"
      stroke="#1C94A4"
      strokeWidth="1.4"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const IconType = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="8"
      width="10"
      height="16"
      rx="1.5"
      stroke="#1C94A4"
      strokeWidth="1.6"
    />
    <rect
      x="14"
      y="2"
      width="10"
      height="22"
      rx="1.5"
      stroke="#1C94A4"
      strokeWidth="1.6"
    />
    <path
      d="M5 12h4M5 16h4M17 6h4M17 10h4M17 14h4"
      stroke="#1C94A4"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// AI step icons
const IconAIStep1 = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 5h14M3 10h10M3 15h7"
      stroke="#252060"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="16" cy="13" r="3" stroke="#1C94A4" strokeWidth="1.4" />
    <path
      d="M18.1 15.1L20 17"
      stroke="#1C94A4"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconAIStep2 = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="3"
      width="16"
      height="14"
      rx="2"
      stroke="#252060"
      strokeWidth="1.6"
    />
    <path
      d="M6 8h8M6 11h5"
      stroke="#1C94A4"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M13 11l3 3"
      stroke="#252060"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="13" cy="10" r="2.5" stroke="#252060" strokeWidth="1.4" />
  </svg>
);

const IconAIStep3 = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 2l1.5 5h5L12 10l1.8 5.5L10 13l-3.8 2.5L8 10 3.5 7h5L10 2z"
      fill="#1C94A4"
      opacity="0.85"
    />
  </svg>
);

const IconAIStep4 = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="12"
      width="3"
      height="6"
      rx="1"
      fill="#252060"
      opacity="0.6"
    />
    <rect x="7" y="8" width="3" height="10" rx="1" fill="#252060" />
    <rect x="12" y="4" width="3" height="14" rx="1" fill="#1C94A4" />
    <rect
      x="17"
      y="9"
      width="3"
      height="9"
      rx="1"
      fill="#252060"
      opacity="0.5"
    />
  </svg>
);

const IconAIStep5 = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 10c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"
      stroke="#252060"
      strokeWidth="1.5"
    />
    <path
      d="M10 7v3l2 2"
      stroke="#1C94A4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 4l2-2M16 16l2 2M4 4L2 2M4 16l-2 2"
      stroke="#252060"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

const AI_STEP_ICONS = [
  <IconAIStep1 key="s1" />,
  <IconAIStep2 key="s2" />,
  <IconAIStep3 key="s3" />,
  <IconAIStep4 key="s4" />,
  <IconAIStep5 key="s5" />,
];

// ─── AI Loading Steps ─────────────────────────────────────────
const AI_STEPS = [
  {
    label: "Parsing your natural language query…",
    detail: "Extracting intent signals",
  },
  {
    label: "Scanning property database…",
    detail: "Analyzing 500+ attributes",
  },
  {
    label: "Running semantic scoring engine…",
    detail: "Matching 47 criteria",
  },
  {
    label: "Ranking by relevance…",
    detail: "Calculating match percentages",
  },
  {
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

  if (/\b(rent|renting|rental|to rent|for rent|lease|leasing)\b/.test(q))
    intent.status = "For Rent";
  else if (
    /\b(buy|buying|purchase|sale|for sale|to buy|invest|investment)\b/.test(q)
  )
    intent.status = "For Sale";

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

  const bathMatch = q.match(
    /(\d+|one|two|three|four|five)\s*(bath|bathroom|bathrooms|ba)\b/,
  );
  if (bathMatch) {
    intent.bathrooms = parseInt(bathMatch[1]) || wordNums[bathMatch[1]] || null;
  }

  const kitchenMatch = q.match(/(\d+|one|two|three)\s*(kitchen|kitchens)\b/);
  if (kitchenMatch) {
    intent.kitchens =
      parseInt(kitchenMatch[1]) || wordNums[kitchenMatch[1]] || null;
  }

  if (/\b(furnished|fully furnished|semi-furnished)\b/.test(q))
    intent.furnished = true;
  if (/\b(unfurnished|bare|empty)\b/.test(q)) intent.furnished = false;

  if (
    /\b(new|brand new|newly built|new construction|modern building)\b/.test(q)
  )
    intent.newConstruction = true;

  if (/\b(quiet|peaceful|serene|calm|silent|away from traffic)\b/.test(q))
    intent.quietArea = true;

  if (
    /\b(modern|contemporary|sleek|minimalist|luxury|high-end|premium)\b/.test(q)
  )
    intent.modernStyle = true;

  const sqftMatch = q.match(/(\d+)\s*(?:sq\.?ft|sqft|square\s*feet|sft)/);
  if (sqftMatch) {
    if (/min|above|over|atleast|at least/.test(q))
      intent.minSqft = parseInt(sqftMatch[1]);
    else if (/max|under|below|upto|up to/.test(q))
      intent.maxSqft = parseInt(sqftMatch[1]);
    else intent.minSqft = parseInt(sqftMatch[1]);
  }

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

  if (intent.status && p.status === intent.status) {
    score += 30;
    reasons.push(`Listed ${intent.status}`);
  }

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

  if (intent.bathrooms !== null && p.bathrooms !== null) {
    const diff = Math.abs(p.bathrooms - intent.bathrooms);
    if (diff === 0) {
      score += 15;
      reasons.push(`${p.bathrooms} bath ✓`);
    } else if (diff === 1) score += 5;
  }

  if (intent.kitchens !== null && p.kitchens !== null) {
    if (p.kitchens >= intent.kitchens) {
      score += 10;
      reasons.push(`${p.kitchens} kitchen ✓`);
    }
  }

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

  if (intent.type) {
    const typeMatch =
      p.property_type?.toLowerCase() === intent.type.toLowerCase();
    if (typeMatch) {
      score += 20;
      reasons.push(`${p.property_type} ✓`);
      highlights.push(p.property_type);
    }
  }

  if (intent.minSqft !== null && p.sqft !== null) {
    if (p.sqft >= intent.minSqft) {
      score += 10;
      reasons.push(`${p.sqft.toLocaleString()} sqft ✓`);
    } else score -= 10;
  }
  if (intent.maxSqft !== null && p.sqft !== null) {
    if (p.sqft <= intent.maxSqft) score += 8;
  }

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

  const nearby = p.whats_nearby || {};
  for (const kw of intent.nearbyKeywords) {
    if (Object.keys(nearby).some((k) => k.toLowerCase().includes(kw))) {
      score += 12;
      reasons.push(`Near ${kw} ✓`);
    }
  }

  const amenities = (p.amenities || []).map((a) => a.toLowerCase());
  for (const aw of intent.amenityKeywords) {
    if (amenities.some((a) => a.toLowerCase().includes(aw.toLowerCase()))) {
      score += 10;
      reasons.push(`Has ${aw} ✓`);
      highlights.push(aw);
    }
  }

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

  if (intent.newConstruction) {
    const daysSince =
      (Date.now() - new Date(p.created_at).getTime()) / 86400000;
    if (daysSince < 90) {
      score += 10;
      reasons.push("Recently listed ✓");
    }
  }

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
      return "rgba(37,32,96,0.92)";
    case "For Rent":
      return "rgba(28,148,164,0.92)";
    case "Sold":
      return "rgba(56,161,105,0.92)";
    default:
      return "rgba(80,76,72,0.88)";
  }
}

function scoreColor(score: number): { bg: string; text: string; ring: string } {
  if (score >= 70) return { bg: "#e8f7f9", text: "#1C94A4", ring: "#a8dde4" };
  if (score >= 45) return { bg: "#eceaf5", text: "#252060", ring: "#b5b0d8" };
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
    --c-accent:     #1C94A4;
    --c-navy:       #252060;
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
    box-shadow: 0 6px 32px rgba(28,148,164,0.18);
    border-color: var(--c-accent);
  }
  .sf-input-icon {
    padding: 0 14px 0 18px;
    display: flex;
    align-items: center;
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
    color: var(--c-ink-3);
    cursor: pointer; margin-right: 6px;
    flex-shrink: 0;
    transition: all 0.18s;
    padding: 0;
  }
  .sf-clear-btn:hover { background: var(--c-rule); color: var(--c-ink); }
  .sf-search-btn {
    padding: 0 24px;
    height: 100%;
    border: none;
    background: var(--c-navy);
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
    border-color: var(--c-navy);
    background: var(--c-white);
    color: var(--c-navy);
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
  .sf-token--blue   { background: #eceaf5; border-color: #b5b0d8; color: #252060; }
  .sf-token--green  { background: #e8f7f9; border-color: #a8dde4; color: #1C94A4; }
  .sf-token--amber  { background: #fef9ec; border-color: #fde68a; color: #7a5f00; }
  .sf-token--red    { background: #e8f7f9; border-color: #a8dde4; color: #1C94A4; }
  .sf-token--purple { background: #eceaf5; border-color: #b5b0d8; color: #252060; }
  .sf-token--gray   { background: var(--c-surface); border-color: var(--c-rule); color: var(--c-ink-2); }

  /* ══════════════════════════════════════════
     AI LOADING OVERLAY
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
    background: radial-gradient(circle, #252060, transparent);
    top: -100px; left: -100px;
    animation-duration: 9s;
  }
  .sf-ai-orb--2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #1C94A4, transparent);
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

  .sf-ai-brain {
    width: 72px; height: 72px;
    border-radius: 20px;
    background: var(--c-navy);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    position: relative;
    animation: sf-brain-pulse 2s ease-in-out infinite;
  }
  @keyframes sf-brain-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(28,148,164,0.35); }
    50%       { box-shadow: 0 0 0 12px rgba(28,148,164,0); }
  }
  .sf-ai-brain::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 28px;
    border: 2px solid rgba(28,148,164,0.25);
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
    background: #eceaf5;
    border-color: #b5b0d8;
    box-shadow: 0 2px 8px rgba(37,32,96,0.10);
  }
  .sf-ai-step.done {
    opacity: 0.7;
    transform: none;
    background: #e8f7f9;
    border-color: #a8dde4;
  }
  .sf-ai-step__icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sf-ai-step-check-icon {
    display: none;
  }
  .sf-ai-step.done .sf-ai-step-check-icon {
    display: block;
  }

  .sf-ai-spinner {
    width: 16px; height: 16px;
    border: 2px solid #a8dde4;
    border-top-color: #1C94A4;
    border-radius: 50%;
    animation: sf-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes sf-spin { to { transform: rotate(360deg); } }

  .sf-ai-progress-wrap {
    height: 4px;
    background: var(--c-rule);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .sf-ai-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #252060, #1C94A4, #2d7a4f);
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
    background: var(--c-navy);
    border-color: var(--c-navy);
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
    background: linear-gradient(135deg, #eceaf5 0%, #e8f7f9 100%);
  }

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
    background: var(--c-accent);
    color: #fff;
    opacity: 0.9;
  }

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
    background: var(--c-navy); color: #fff;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none;
    transition: background 0.18s, transform 0.22s;
    flex-shrink: 0;
  }
  .sf-card__arrow:hover { background: var(--c-accent); transform: rotate(45deg); }

  /* ── Initial state ── */
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
    box-shadow: 0 4px 16px rgba(28,148,164,0.12);
    transform: translateY(-2px);
  }
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

  /* ── Banner ── */
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

  /* ── DB loading spinner ── */
  .sf-db-spinner {
    width: 2rem; height: 2rem;
    border: 2px solid var(--c-rule);
    border-top-color: var(--c-accent);
    border-radius: 50%;
    animation: sf-spin 0.8s linear infinite;
  }
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

// ─── Check icon SVG ───────────────────────────────────────────
const IconCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 8l3.5 3.5L13 5"
      stroke="#1C94A4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

    timers.push(
      setTimeout(() => {
        setDoneSteps([0, 1, 2, 3, 4]);
        setProgress(100);
        setTimeout(onDone, 400);
      }, totalMs),
    );

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${8 + ((i * 7.5) % 85)}%`,
    bottom: `${10 + ((i * 11) % 30)}%`,
    delay: `${(i * 0.25) % 3}s`,
    color: i % 3 === 0 ? "#252060" : i % 3 === 1 ? "#1C94A4" : "#2d7a4f",
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

        <div className="sf-ai-brain">
          <IconBrain size={34} color="#fff" />
        </div>

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
                <div className="sf-ai-step__icon">{AI_STEP_ICONS[i]}</div>
                <div className="sf-ai-step__text">
                  <div className="sf-ai-step__label">{step.label}</div>
                  <div className="sf-ai-step__detail">{step.detail}</div>
                </div>
                <div className="sf-ai-step__check">
                  {isActive && <div className="sf-ai-spinner" />}
                  {isDone && (
                    <span className="sf-ai-step-check-icon">
                      <IconCheck />
                    </span>
                  )}
                </div>
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
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
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
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      {showAILoader && (
        <AILoadingOverlay query={pendingQuery} onDone={handleAILoadingDone} />
      )}

      {/* ── Banner ── */}
      <div className="fwc-banner">
        <div
          className="fwc-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwc-banner__inner">
          <h2 className="fwc-banner__title">
            Smart <em>Finder</em>
          </h2>
          <ul className="fwc-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Smart Finder</li>
          </ul>
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
                <span className="sf-input-icon">
                  <IconSearch size={18} color="#8a8785" />
                </span>
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
                    <IconX size={12} color="#8a8785" />
                  </button>
                )}
                <button
                  type="submit"
                  className="sf-search-btn"
                  disabled={loading || !query.trim() || showAILoader}
                >
                  <IconStars size={14} color="#fff" />
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
              <div className="sf-db-spinner" />
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
              <div className="sf-state__icon">
                <IconHomeLarge size={56} color="#1C94A4" />
              </div>
              <div className="sf-state__title">What are you looking for?</div>
              <p className="sf-state__sub">
                Use the search bar above to describe your ideal property.
                <br />
                Be as specific or as casual as you like — we'll figure it out.
              </p>

              <div className="sf-feat-grid">
                {[
                  { icon: <IconBedFeature size={26} />, label: "Bedrooms" },
                  { icon: <IconPinFeature size={26} />, label: "Location" },
                  { icon: <IconBudget size={26} />, label: "Budget" },
                  { icon: <IconAmenity size={26} />, label: "Amenities" },
                  { icon: <IconNearby size={26} />, label: "Nearby" },
                  { icon: <IconType size={26} />, label: "Type" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="sf-feat-pill"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {item.icon}
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
                  <div
                    style={{
                      marginBottom: "14px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IconMagnify size={56} color="#1C94A4" />
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
                    Clear &amp; try again
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
                                  <IconHome size={48} color="#b5b0d8" />
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
                                <IconPin size={10} color="#8a8785" />
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
                                      <IconRuler size={12} color="#8a8785" />
                                      {p.sqft.toLocaleString()} ft²
                                    </span>
                                  )}
                                  {p.bedrooms != null && (
                                    <span className="sf-feat">
                                      <IconBed size={12} color="#8a8785" />
                                      {p.bedrooms} bed
                                    </span>
                                  )}
                                  {p.bathrooms != null && (
                                    <span className="sf-feat">
                                      <IconBath size={12} color="#8a8785" />
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
                                <IconArrowUpRight size={13} color="#fff" />
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

      <FutureFooter />
    </Wrapper>
  );
};

export default SmartFinder;

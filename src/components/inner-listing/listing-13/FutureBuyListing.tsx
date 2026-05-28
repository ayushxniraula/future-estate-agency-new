// ============================================================
//  ListingThirteenArea.tsx — Supabase-powered property listing
//  Improved: better cards, sidebar polish, hover states, typography
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
      return "FOR SELL";
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
      return "#e84545";
    case "For Rent":
      return "#2196f3";
    case "Sold":
      return "#4caf50";
    case "Rented":
      return "#ff9800";
    default:
      return "#666";
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
  /* Property card improvements */
  .listing-card-improved {
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    transition: box-shadow 0.25s ease, transform 0.25s ease;
    border: 1px solid rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .listing-card-improved:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,0.13);
    transform: translateY(-3px);
  }
  .listing-card-improved .img-wrap {
    position: relative;
    overflow: hidden;
  }
  .listing-card-improved .img-wrap img {
    transition: transform 0.4s ease;
  }
  .listing-card-improved:hover .img-wrap img {
    transform: scale(1.04);
  }

  /* Status badge */
  .status-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #fff;
    z-index: 3;
    backdrop-filter: blur(4px);
  }

  /* Fav button */
  .fav-btn-improved {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    color: #999;
    transition: background 0.2s, color 0.2s, transform 0.2s;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .fav-btn-improved:hover {
    background: #e84545;
    color: #fff;
    transform: scale(1.1);
  }

  /* Card body */
  .card-body-improved {
    padding: 18px 20px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .card-body-improved .prop-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    text-decoration: none;
    line-height: 1.3;
    display: block;
    margin-bottom: 5px;
    transition: color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card-body-improved .prop-title:hover { color: #e84545; }
  .card-body-improved .prop-location {
    font-size: 13px;
    color: #888;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .card-body-improved .prop-location::before {
    content: "📍";
    font-size: 11px;
  }

  /* Feature pills */
  .feature-pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .feature-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #f6f6f8;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 12.5px;
    color: #444;
    font-weight: 500;
  }
  .feature-pill img { width: 14px; height: 14px; opacity: 0.7; }

  /* Card footer */
  .card-footer-improved {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 16px;
    border-top: 1px solid #f0f0f0;
    margin-top: auto;
  }
  .card-footer-improved .price {
    font-size: 19px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -0.3px;
  }
  .card-footer-improved .price sub {
    font-size: 12px;
    font-weight: 500;
    color: #888;
  }
  .card-footer-improved .detail-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
    font-size: 14px;
    flex-shrink: 0;
  }
  .card-footer-improved .detail-btn:hover {
    background: #e84545;
    transform: rotate(45deg);
  }

  /* Type filter bar */
  .type-filter-bar {
    border-bottom: 1px solid #eee;
    background: #fff;
  }
  .type-filter-bar ul { gap: 6px !important; padding: 14px 0; }
  .type-pill {
    padding: 7px 18px;
    border-radius: 30px;
    font-size: 13.5px;
    font-weight: 500;
    color: #555;
    text-decoration: none;
    border: 1.5px solid #e0e0e0;
    transition: all 0.2s;
    white-space: nowrap;
    background: #fff;
  }
  .type-pill:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
    background: #f8f8f8;
  }
  .type-pill.active {
    background: #e84545;
    border-color: #e84545;
    color: #fff;
  }

  /* Sidebar improvements */
  .sidebar-improved {
    background: #fff;
    border-right: 1px solid #eee;
    height: 100%;
  }
  .sidebar-inner {
    padding: 28px 22px;
  }
  .sidebar-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f2f2f2;
  }
  .sidebar-section:last-child { border-bottom: none; }
  .sidebar-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 10px;
    display: block;
  }
  .sidebar-input {
    width: 100%;
    padding: 9px 13px;
    border-radius: 9px;
    border: 1.5px solid #e8e8e8;
    font-size: 14px;
    color: #333;
    background: #fafafa;
    transition: border-color 0.2s, background 0.2s;
    outline: none;
  }
  .sidebar-input:focus {
    border-color: #1a1a1a;
    background: #fff;
  }
  .amenity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .amenity-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    color: #555;
    cursor: pointer;
    padding: 5px 0;
  }
  .amenity-item input[type="checkbox"] {
    width: 15px;
    height: 15px;
    accent-color: #e84545;
    cursor: pointer;
    flex-shrink: 0;
  }
  .reset-btn {
    width: 100%;
    padding: 11px;
    border-radius: 9px;
    border: 1.5px solid #1a1a1a;
    background: transparent;
    font-size: 13.5px;
    font-weight: 600;
    color: #1a1a1a;
    cursor: pointer;
    letter-spacing: 0.2px;
    transition: all 0.2s;
  }
  .reset-btn:hover {
    background: #1a1a1a;
    color: #fff;
  }

  /* Sort bar */
  .listing-header-filter {
    background: #f9f9f9;
    border-radius: 10px;
    padding: 12px 18px;
  }
  .results-count {
    font-size: 14px;
    color: #777;
  }
  .results-count strong { color: #1a1a1a; }

  /* Carousel dots */
  .carousel-dot {
    transition: all 0.2s;
  }
`;

function injectStyle() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("listing-improved-styles")
  ) {
    const el = document.createElement("style");
    el.id = "listing-improved-styles";
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
          height: "230px",
          background: "#f0f0f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem",
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
    <div style={{ position: "relative", overflow: "hidden", height: "230px" }}>
      <img
        src={images[current]}
        alt={title}
        style={{
          width: "100%",
          height: "230px",
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
                  width: i === current ? "16px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  display: "inline-block",
                  background: i === current ? "#fff" : "rgba(255,255,255,0.5)",
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
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    fontSize: "20px",
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

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(e.target.value), value[1] - 1);
    onChange([next, value[1]]);
  };
  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], next]);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12.5px",
          marginBottom: "10px",
          color: "#888",
          fontWeight: 500,
        }}
      >
        <span
          style={{
            background: "#f4f4f6",
            padding: "3px 8px",
            borderRadius: "6px",
            color: "#333",
          }}
        >
          ${value[0].toLocaleString()}
        </span>
        <span
          style={{
            background: "#f4f4f6",
            padding: "3px 8px",
            borderRadius: "6px",
            color: "#333",
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
            height: "4px",
            background: "#eee",
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
            height: "4px",
            background: "#e84545",
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
          onChange={handleMin}
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
          onChange={handleMax}
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
    <div className="sidebar-improved">
      <div className="sidebar-inner">
        {/* Type */}
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

        {/* Keyword */}
        <div className="sidebar-section">
          <span className="sidebar-label">Keyword</span>
          <input
            type="text"
            className="sidebar-input"
            placeholder="Ex: home, villa"
            value={filters.keyword}
            onChange={(e) => onChange({ keyword: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="sidebar-section">
          <span className="sidebar-label">Location</span>
          <input
            type="text"
            className="sidebar-input"
            placeholder="City, address…"
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </div>

        {/* Bed / Bath */}
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

        {/* Amenities */}
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

        {/* Price Range */}
        <div className="sidebar-section">
          <span className="sidebar-label">Price Range</span>
          <PriceRangeSlider
            min={priceMinMax[0]}
            max={priceMinMax[1]}
            value={filters.priceRange}
            onChange={(v) => onChange({ priceRange: v })}
          />
        </div>

        {/* Min Year Built */}
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

        {/* Sqft */}
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
  return (
    <div className="listing-card-improved">
      <div className="img-wrap">
        <div style={{ position: "relative" }}>
          <span
            className="status-badge"
            style={{ background: getStatusColor(item.status) }}
          >
            {getStatusLabel(item.status)}
          </span>
          <Link to="#" className="fav-btn-improved">
            <i className="fa-light fa-heart" style={{ fontSize: "14px" }} />
          </Link>
          <CarouselOrImage images={item.images || []} title={item.title} />
        </div>
      </div>

      <div className="card-body-improved">
        <Link to={`/buy/${item.id}`} className="prop-title">
          {item.title}
        </Link>
        <div className="prop-location">{item.location}</div>

        {(item.sqft || item.bedrooms != null || item.bathrooms != null) && (
          <div className="feature-pills">
            {item.sqft && (
              <div className="feature-pill">
                <img src="/assets/images/icon/icon_32.svg" alt="" />
                <span>{item.sqft.toLocaleString()} sqft</span>
              </div>
            )}
            {item.bedrooms != null && (
              <div className="feature-pill">
                <img src="/assets/images/icon/icon_33.svg" alt="" />
                <span>{item.bedrooms} bed</span>
              </div>
            )}
            {item.bathrooms != null && (
              <div className="feature-pill">
                <img src="/assets/images/icon/icon_34.svg" alt="" />
                <span>{item.bathrooms} bath</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-footer-improved">
        <div className="price">
          $
          {item.price.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          {item.status === "For Rent" && <sub> / mo</sub>}
        </div>
        <Link to={`/buy/${item.id}`} className="detail-btn">
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
    <div className="property-listing-seven lg-pt-100">
      {/* Type bar */}
      <div className="type-filter-bar listing-type-filter">
        <div className="wrapper">
          <ul
            className="style-none d-flex flex-wrap align-items-center"
            style={{ gap: "8px", padding: "14px 0" }}
          >
            <li
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#aaa",
                letterSpacing: "0.5px",
                marginRight: "4px",
              }}
            >
              TYPE:
            </li>
            {PROPERTY_TYPES.map((type, i) => (
              <li key={i}>
                <Link
                  to="#"
                  className={`type-pill${selectedType === type ? " active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedType(type);
                  }}
                >
                  {type}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrapper">
        <div className="row gx-0">
          {/* Main */}
          <div className="col-xxl-9 col-lg-8">
            <div className="ps-3 pe-3 ps-md-4 pe-md-4 ps-xxl-5 pe-xxl-5 pt-40 pb-200 xl-pb-120 md-pb-80">
              {/* Header */}
              <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-35 lg-mb-25">
                <div className="results-count">
                  {loading ? (
                    <span style={{ color: "#aaa" }}>Loading…</span>
                  ) : error ? (
                    <span style={{ color: "#e84545" }}>Error: {error}</span>
                  ) : (
                    <>
                      Showing{" "}
                      <strong>
                        {sortedProperties.length === 0 ? 0 : itemOffset + 1}–
                        {itemOffset + currentItems.length}
                      </strong>{" "}
                      of <strong>{sortedProperties.length}</strong> results
                    </>
                  )}
                </div>
                <div className="d-flex align-items-center xs-mt-20">
                  <div
                    className="short-filter d-flex align-items-center"
                    style={{ gap: "10px" }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        fontWeight: 500,
                      }}
                    >
                      Sort:
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
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center py-5">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      color: "#e84545",
                    }}
                  />
                  <p className="mt-3" style={{ color: "#aaa" }}>
                    Loading properties…
                  </p>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="text-center py-5">
                  <p style={{ color: "#e84545" }}>⚠ {error}</p>
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
                  <div style={{ fontSize: "3rem" }}>🏠</div>
                  <p
                    className="mt-3"
                    style={{ fontSize: "17px", fontWeight: 600, color: "#333" }}
                  >
                    No properties found
                  </p>
                  <p style={{ color: "#aaa", fontSize: "14px" }}>
                    Try adjusting your filters or{" "}
                    <button
                      onClick={handleReset}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "#e84545",
                      }}
                    >
                      reset all filters
                    </button>
                  </p>
                </div>
              )}

              {/* Grid */}
              {!loading && !error && sortedProperties.length > 0 && (
                <>
                  <div className="row gx-xxl-4 gy-4">
                    {currentItems.map((item) => (
                      <div key={item.id} className="col-xxl-4 col-md-6 d-flex">
                        <PropertyCard item={item} />
                      </div>
                    ))}
                  </div>

                  {pageCount > 1 && (
                    <div className="pt-5 text-center">
                      <ReactPaginate
                        breakLabel="..."
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
                        className="pagination-two d-inline-flex align-items-center justify-content-center style-none"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
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
        </div>
      </div>
    </div>
  );
};

export default BuyListing;

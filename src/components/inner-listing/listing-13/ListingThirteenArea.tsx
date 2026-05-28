// ============================================================
//  ListingThirteenArea.tsx — Supabase-powered property listing
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
          height: "220px",
          background: "#2a2a2a",
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
    <div style={{ position: "relative", overflow: "hidden", height: "220px" }}>
      <img
        src={images[current]}
        alt={title}
        style={{ width: "100%", height: "220px", objectFit: "cover" }}
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
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "4px",
            }}
          >
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
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
    [side]: "8px",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    fontSize: "18px",
    lineHeight: "1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  };
}

// ─── Price Range Slider (FIXED) ───────────────────────────────
//
//  THE BUG that was in the previous version:
//    Both inputs had `pointerEvents: "none"` — this made them impossible
//    to drag. The browser never delivered any mouse/touch events to them.
//
//  THE FIX:
//    • Remove pointerEvents restriction entirely (defaults to "auto").
//    • Both inputs are full-width, absolutely positioned on the same track.
//    • z-index controls which thumb is on top:
//        – max thumb (z:4) sits above min thumb (z:3) normally.
//        – When min thumb is pushed to the far right (minAtMax), we flip
//          their z-indices so the user can still drag max to the right.
//    • The coloured fill div uses `pointerEvents:"none"` (correctly) so it
//      doesn't interfere with thumb dragging.
//
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
      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginBottom: "6px",
          color: "var(--text-muted,#888)",
        }}
      >
        <span>$ {value[0].toLocaleString()}</span>
        <span>$ {value[1].toLocaleString()} USD</span>
      </div>

      {/* Track area */}
      <div style={{ position: "relative", height: "20px" }}>
        {/* Full grey track — non-interactive */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: 0,
            right: 0,
            height: "4px",
            background: "#ddd",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        />

        {/* Coloured fill between thumbs — non-interactive */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: `${pct(value[0])}%`,
            right: `${100 - pct(value[1])}%`,
            height: "4px",
            background: "var(--bs-danger,#e84545)",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        />

        {/* MIN thumb */}
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
            // Raise above max only when pushed to the far right
            zIndex: minAtMax ? 5 : 3,
          }}
        />

        {/* MAX thumb */}
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

  const sel: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
  };

  return (
    <div className="advance-search-panel h-100 border-end">
      <div className="main-bg grey-bg h-100" style={{ padding: "24px 20px" }}>
        {/* Listing status */}
        <div className="filter-block mb-25">
          <label className="fs-14 fw-500 color-dark mb-10 d-block">Type</label>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            style={sel}
          >
            <option value="">All Listings</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>

        {/* Keyword */}
        <div className="filter-block mb-25">
          <label className="fs-14 fw-500 color-dark mb-10 d-block">
            Keyword
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: home, villa"
            value={filters.keyword}
            onChange={(e) => onChange({ keyword: e.target.value })}
            style={sel}
          />
        </div>

        {/* Location */}
        <div className="filter-block mb-25">
          <label className="fs-14 fw-500 color-dark mb-10 d-block">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="City, address…"
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
            style={sel}
          />
        </div>

        {/* Bed / Bath */}
        <div className="filter-block mb-25">
          <div className="row g-2">
            <div className="col-6">
              <label className="fs-14 fw-500 color-dark mb-10 d-block">
                Bed
              </label>
              <select
                className="form-select"
                value={filters.bedrooms}
                onChange={(e) => onChange({ bedrooms: e.target.value })}
                style={sel}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="fs-14 fw-500 color-dark mb-10 d-block">
                Bath
              </label>
              <select
                className="form-select"
                value={filters.bathrooms}
                onChange={(e) => onChange({ bathrooms: e.target.value })}
                style={sel}
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
        <div className="filter-block mb-25">
          <label className="fs-14 fw-500 color-dark mb-10 d-block">
            Amenities
          </label>
          <div className="row g-1">
            {AMENITY_OPTIONS.map((a) => (
              <div className="col-6" key={a}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <span>{a}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-block mb-25">
          <label className="fs-14 fw-500 color-dark mb-10 d-block">
            Price Range
          </label>
          <PriceRangeSlider
            min={priceMinMax[0]}
            max={priceMinMax[1]}
            value={filters.priceRange}
            onChange={(v) => onChange({ priceRange: v })}
          />
        </div>

        {/* Min Year Built */}
        <div className="filter-block mb-25">
          <label className="fs-14 fw-500 color-dark mb-10 d-block">
            Min Year Built
          </label>
          <select
            className="form-select"
            value={filters.minYearBuilt}
            onChange={(e) => onChange({ minYearBuilt: e.target.value })}
            style={sel}
          >
            <option value="">Any</option>
            {[2024, 2022, 2020, 2018, 2015, 2010, 2005, 2000].map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Sqft */}
        <div className="filter-block mb-30">
          <label className="fs-14 fw-500 color-dark mb-10 d-block">Sqft</label>
          <div className="row g-2">
            <div className="col-6">
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                value={filters.sqftMin}
                onChange={(e) => onChange({ sqftMin: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "6px",
                }}
              />
            </div>
            <div className="col-6">
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                value={filters.sqftMax}
                onChange={(e) => onChange({ sqftMax: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>
        </div>

        <button
          className="btn-four w-100"
          onClick={onReset}
          style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const ListingThirteenArea = () => {
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

  // Fetch
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

  // Filter + Sort
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
      {/* Top type bar */}
      <div className="listing-type-filter">
        <div className="wrapper">
          <ul className="style-none d-flex flex-wrap align-items-center justify-content-center justify-content-xxl-between">
            <li>Select Type:</li>
            {PROPERTY_TYPES.map((type, i) => (
              <li key={i}>
                <Link
                  to="#"
                  className={selectedType === type ? "active" : ""}
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
          {/* Main column */}
          <div className="col-xxl-9 col-lg-8">
            <div className="ps-3 pe-3 ps-md-4 pe-md-4 ps-xxl-5 pe-xxl-5 pt-50 pb-200 xl-pb-120 md-pb-80">
              {/* Header */}
              <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
                <div>
                  {loading ? (
                    <span>Loading properties…</span>
                  ) : error ? (
                    <span style={{ color: "red" }}>Error: {error}</span>
                  ) : (
                    <>
                      Showing{" "}
                      <span className="color-dark fw-500">
                        {sortedProperties.length === 0 ? 0 : itemOffset + 1}–
                        {itemOffset + currentItems.length}
                      </span>{" "}
                      of{" "}
                      <span className="color-dark fw-500">
                        {sortedProperties.length}
                      </span>{" "}
                      results
                    </>
                  )}
                </div>
                <div className="d-flex align-items-center xs-mt-20">
                  <div className="short-filter d-flex align-items-center">
                    <div className="fs-16 me-2">Sort by:</div>
                    <NiceSelect
                      className="nice-select rounded-0"
                      options={[
                        { value: "newest", text: "Newest" },
                        { value: "oldest", text: "Oldest" },
                        { value: "best_seller", text: "Best Seller" },
                        { value: "best_match", text: "Best Match" },
                        { value: "price_low", text: "Price Low" },
                        { value: "price_high", text: "Price High" },
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

              {loading && (
                <div className="text-center py-5">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  />
                  <p className="mt-3 color-dark">Loading properties…</p>
                </div>
              )}

              {!loading && error && (
                <div
                  className="text-center py-5"
                  style={{ color: "var(--bs-danger)" }}
                >
                  <p>⚠ {error}</p>
                  <button
                    className="btn-four mt-3"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && sortedProperties.length === 0 && (
                <div className="text-center py-5">
                  <div style={{ fontSize: "3rem" }}>🏠</div>
                  <p className="mt-3 color-dark fs-18">No properties found</p>
                  <p className="color-muted">
                    Try adjusting your filters or{" "}
                    <button
                      onClick={handleReset}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      reset all filters
                    </button>
                  </p>
                </div>
              )}

              {!loading && !error && sortedProperties.length > 0 && (
                <>
                  <div className="row gx-xxl-5">
                    {currentItems.map((item) => (
                      <div
                        key={item.id}
                        className="col-xxl-4 col-md-6 d-flex mb-80 lg-mb-50"
                      >
                        <div className="listing-card-one style-two shadow-none h-100 w-100">
                          <div className="img-gallery">
                            <div className="prperty-carousel-slider position-relative overflow-hidden">
                              <div className="tag fw-500">
                                {getStatusLabel(item.status)}
                              </div>
                              <Link to="#" className="fav-btn tran3s">
                                <i className="fa-light fa-heart"></i>
                              </Link>
                              <CarouselOrImage
                                images={item.images || []}
                                title={item.title}
                              />
                            </div>
                          </div>
                          <div className="property-info pt-20">
                            <Link
                              to={`/sell/${item.id}`}
                              className="title tran3s"
                            >
                              {item.title}
                            </Link>
                            <div className="address">{item.location}</div>
                            <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between pb-15 pt-5">
                              {item.sqft && (
                                <li className="d-flex align-items-center">
                                  <img
                                    src="/assets/images/icon/icon_32.svg"
                                    alt=""
                                    className="lazy-img icon me-2"
                                  />
                                  <span className="fs-16">
                                    <span className="color-dark">
                                      {item.sqft.toLocaleString()}
                                    </span>{" "}
                                    sqft
                                  </span>
                                </li>
                              )}
                              {item.bedrooms != null && (
                                <li className="d-flex align-items-center">
                                  <img
                                    src="/assets/images/icon/icon_33.svg"
                                    alt=""
                                    className="lazy-img icon me-2"
                                  />
                                  <span className="fs-16">
                                    <span className="color-dark">
                                      {String(item.bedrooms).padStart(2, "0")}
                                    </span>{" "}
                                    bed
                                  </span>
                                </li>
                              )}
                              {item.bathrooms != null && (
                                <li className="d-flex align-items-center">
                                  <img
                                    src="/assets/images/icon/icon_34.svg"
                                    alt=""
                                    className="lazy-img icon me-2"
                                  />
                                  <span className="fs-16">
                                    <span className="color-dark">
                                      {String(item.bathrooms).padStart(2, "0")}
                                    </span>{" "}
                                    bath
                                  </span>
                                </li>
                              )}
                            </ul>
                            <div className="pl-footer top-border bottom-border d-flex align-items-center justify-content-between">
                              <strong className="price fw-500 color-dark">
                                $
                                {item.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                {item.status === "For Rent" && (
                                  <>
                                    {" "}
                                    / <sub>m</sub>
                                  </>
                                )}
                              </strong>
                              <Link
                                to={`/sell/${item.id}`}
                                className="btn-four"
                              >
                                <i className="bi bi-arrow-up-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {pageCount > 1 && (
                    <div className="pt-5">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel={
                          <i className="fa-regular fa-chevron-right"></i>
                        }
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel={
                          <i className="fa-regular fa-chevron-left"></i>
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

export default ListingThirteenArea;

// ============================================================
//  DropdownOne.tsx — Fully dynamic search dropdown
//  Pulls statuses, locations, and price range from Supabase
//  Navigates to /listing_0 with query params on search
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import NiceSelect from "../../../ui/NiceSelect";

// ─── Supabase (same instance as the rest of the app) ──────────
const SUPABASE_URL = "https://wzttfewbiiakxkmgzfre.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dHRmZXdiaWlha3hrbWd6ZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY0MjksImV4cCI6MjA5NTM2MjQyOX0.-00zf6PqvccpLvBGxy4FtveqX5mCeGXJbC-ZF8ziEBk";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Types ────────────────────────────────────────────────────
interface SelectOption {
  value: string;
  text: string;
}

interface DropdownOneProps {
  style?: boolean;
}

// ─── Price bucket helper ──────────────────────────────────────
// Buckets the real min/max price from Supabase into human-friendly ranges
function buildPriceRanges(minPrice: number, maxPrice: number): SelectOption[] {
  if (minPrice === 0 && maxPrice === 0)
    return [{ value: "any", text: "Any Price" }];

  const fmt = (n: number): string => {
    if (n >= 10_000_000) return `रु ${(n / 10_000_000).toFixed(1)} Cr`;
    if (n >= 100_000) return `रु ${(n / 100_000).toFixed(0)} L`;
    return `रु ${n.toLocaleString("en-IN")}`;
  };

  // Build ~5 evenly-spaced buckets between real min and max
  const span = maxPrice - minPrice;
  const step = Math.ceil(span / 4 / 100_000) * 100_000 || 100_000;
  const ranges: SelectOption[] = [{ value: "any", text: "Any Price" }];

  let lo = Math.floor(minPrice / step) * step;
  while (lo < maxPrice) {
    const hi = lo + step;
    ranges.push({
      value: `${lo}-${hi}`,
      text: `${fmt(lo)} – ${fmt(Math.min(hi, maxPrice))}`,
    });
    lo = hi;
  }

  return ranges;
}

// ─── Component ────────────────────────────────────────────────
const DropdownOne = ({ style }: DropdownOneProps) => {
  const navigate = useNavigate();

  // ── Dropdown option state ──
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([
    { value: "any", text: "Any Status" },
  ]);
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([
    { value: "any", text: "Any Location" },
  ]);
  const [priceOptions, setPriceOptions] = useState<SelectOption[]>([
    { value: "any", text: "Any Price" },
  ]);

  // ── Selected values ──
  const [selectedStatus, setSelectedStatus] = useState("any");
  const [selectedLocation, setSelectedLocation] = useState("any");
  const [selectedPrice, setSelectedPrice] = useState("any");

  // ── Loading guard ──
  const [optionsReady, setOptionsReady] = useState(false);

  // ── Fetch distinct values from Supabase ───────────────────
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Pull only the columns we need — fast and light
        const { data, error } = await supabase
          .from("properties")
          .select("status, location, price");

        if (error || !data) return;

        // ── Statuses ──────────────────────────────────────────
        const uniqueStatuses = [
          ...new Set(data.map((p) => p.status).filter(Boolean)),
        ] as string[];
        const statusOpts: SelectOption[] = [
          { value: "any", text: "Any Status" },
          ...uniqueStatuses.map((s) => ({ value: s, text: s })),
        ];
        setStatusOptions(statusOpts);

        // ── Locations ─────────────────────────────────────────
        // Extract city/area portion (text before last comma, or full string)
        const normalizeLocation = (loc: string): string => {
          const parts = loc.split(",");
          return parts[0].trim();
        };

        const uniqueLocations = [
          ...new Set(
            data
              .map((p) => p.location)
              .filter(Boolean)
              .map(normalizeLocation),
          ),
        ].sort() as string[];

        const locationOpts: SelectOption[] = [
          { value: "any", text: "Any Location" },
          ...uniqueLocations.map((l) => ({ value: l, text: l })),
        ];
        setLocationOptions(locationOpts);

        // ── Price ranges ──────────────────────────────────────
        const prices = data
          .map((p) => Number(p.price))
          .filter((n) => !isNaN(n) && n > 0);
        if (prices.length > 0) {
          const minP = Math.min(...prices);
          const maxP = Math.max(...prices);
          setPriceOptions(buildPriceRanges(minP, maxP));
        }

        setOptionsReady(true);
      } catch (err) {
        console.error("DropdownOne: failed to load options", err);
        setOptionsReady(true); // still render even on error
      }
    };

    loadOptions();
  }, []);

  // ── Search handler ────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (selectedStatus && selectedStatus !== "any")
      params.set("status", selectedStatus);

    if (selectedLocation && selectedLocation !== "any")
      params.set("location", selectedLocation);

    if (selectedPrice && selectedPrice !== "any") {
      const [lo, hi] = selectedPrice.split("-");
      if (lo) params.set("minPrice", lo);
      if (hi) params.set("maxPrice", hi);
    }

    const qs = params.toString();
    navigate(`/buy${qs ? `?${qs}` : ""}`);
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <form onSubmit={handleSearch}>
      <div className="row gx-0 align-items-center">
        {/* ── Status dropdown ── */}
        <div className="col-xl-3 col-lg-4">
          <div className="input-box-one border-left">
            <div className="label">I'm looking to…</div>
            <NiceSelect
              className={`nice-select${style ? " fw-normal" : ""}`}
              options={statusOptions}
              defaultCurrent={0}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedStatus(e.target.value)
              }
              name="status"
              placeholder=""
            />
          </div>
        </div>

        {/* ── Location dropdown ── */}
        <div className={`${style ? "col-xl-3" : "col-xl-4"} col-lg-4`}>
          <div className="input-box-one border-left">
            <div className="label">Location</div>
            <NiceSelect
              className={`nice-select location${style ? " fw-normal" : ""}`}
              options={locationOptions}
              defaultCurrent={0}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedLocation(e.target.value)
              }
              name="location"
              placeholder=""
            />
          </div>
        </div>

        {/* ── Price range dropdown ── */}
        <div className="col-xl-3 col-lg-4">
          <div className="input-box-one border-left border-lg-0">
            <div className="label">Price Range</div>
            <NiceSelect
              className={`nice-select${style ? " fw-normal" : ""}`}
              options={priceOptions}
              defaultCurrent={0}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedPrice(e.target.value)
              }
              name="priceRange"
              placeholder=""
            />
          </div>
        </div>

        {/* ── Search button ── */}
        <div className={style ? "col-xl-3" : "col-xl-2"}>
          <div className="input-box-one lg-mt-10">
            <button
              type="submit"
              disabled={!optionsReady}
              className={`fw-500 tran3s${
                style
                  ? " w-100 tran3s search-btn-three"
                  : " text-uppercase search-btn"
              }`}
            >
              {style ? "Search Now" : "Search"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DropdownOne;

// ============================================================
//  SellPropertyArea.tsx — User-facing "List Your Property" form
//  Design: DM Serif Display + DM Sans, consistent with
//  BuyListing / PropertyCompare / Calculator design tokens
//  Submits to `sell_requests` table in Supabase
// ============================================================

import { useState, useRef } from "react";
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

const STORAGE_BUCKET = "FutureState";

// ─── Types ────────────────────────────────────────────────────
interface SellFormData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
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

// ─── Design tokens (consistent with rest of site) ─────────────
const SELL_STYLES = `
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

  /* ── Base ── */
  .sell-root, .sell-root * {
    font-family: var(--font-body);
    box-sizing: border-box;
  }

  /* ── Section wrapper ── */
  .sell-section {
    padding-top: 100px;
    padding-bottom: 120px;
    background: var(--c-surface);
  }

  /* ── Two-column layout ── */
  .sell-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 991px) {
    .sell-layout { grid-template-columns: 1fr; }
    .sell-sidebar { display: none; }
  }

  /* ── Sticky sidebar nav ── */
  .sell-sidebar {
    position: sticky;
    top: 100px;
  }
  .sell-sidebar__title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--c-rule);
  }
  .sell-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 500;
    color: var(--c-ink-3);
    cursor: pointer;
    transition: all 0.18s;
    margin-bottom: 2px;
    text-decoration: none;
    border: 1px solid transparent;
  }
  .sell-nav-item:hover {
    background: var(--c-white);
    border-color: var(--c-rule);
    color: var(--c-ink);
  }
  .sell-nav-item.active {
    background: var(--c-ink);
    color: var(--c-white);
    border-color: var(--c-ink);
  }
  .sell-nav-item__icon {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }

  /* ── Form cards ── */
  .sell-card {
    background: var(--c-white);
    border: 1px solid var(--c-rule);
    border-radius: var(--radius-card);
    padding: 32px 36px;
    margin-bottom: 20px;
    box-shadow: var(--shadow-card);
  }
  @media (max-width: 600px) {
    .sell-card { padding: 24px 18px; }
  }
  .sell-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--c-rule);
  }
  .sell-card__icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
  }
  .sell-card__title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 400;
    color: var(--c-ink);
    letter-spacing: -0.2px;
  }
  .sell-card__subtitle {
    font-size: 12px;
    color: var(--c-ink-3);
    margin-top: 1px;
  }

  /* ── Form elements ── */
  .sell-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--c-ink-3);
    margin-bottom: 7px;
  }
  .sell-label .req { color: var(--c-accent); margin-left: 2px; }

  .sell-input,
  .sell-select,
  .sell-textarea {
    width: 100%;
    padding: 10px 14px;
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
    border-color: var(--c-ink);
    background: var(--c-white);
    box-shadow: 0 0 0 3px rgba(26,23,21,0.06);
  }
  .sell-textarea {
    resize: vertical;
    min-height: 110px;
    line-height: 1.6;
  }
  .sell-select { cursor: pointer; }
  .sell-hint {
    font-size: 11.5px;
    color: var(--c-ink-3);
    margin-top: 5px;
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
    border-color: var(--c-ink);
    background: var(--c-white);
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
  .kv-remove:hover { border-color: var(--c-accent); color: var(--c-accent); background: #fdf0ee; }
  .kv-add {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    border: 1.5px dashed var(--c-rule);
    background: transparent;
    color: var(--c-ink-3);
    font-size: 12.5px;
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    margin-top: 4px;
  }
  .kv-add:hover { border-color: var(--c-ink); color: var(--c-ink); background: var(--c-surface); }

  /* ── Amenities grid ── */
  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 8px;
  }
  .amenity-label {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px 14px;
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
  .amenity-label:hover { border-color: var(--c-ink-2); background: var(--c-white); }
  .amenity-label.checked {
    border-color: var(--c-ink);
    background: var(--c-ink);
    color: var(--c-white);
  }
  .amenity-label input { display: none; }
  .amenity-check-icon {
    width: 16px; height: 16px;
    border-radius: 4px;
    border: 1.5px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 9px;
    transition: all 0.15s;
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
    position: relative;
  }
  .upload-zone:hover { border-color: var(--c-ink); background: var(--c-white); }
  .upload-zone__icon { font-size: 2rem; margin-bottom: 10px; }
  .upload-zone__title {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 400;
    color: var(--c-ink);
    margin-bottom: 5px;
  }
  .upload-zone__sub { font-size: 12.5px; color: var(--c-ink-3); }
  .img-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
    margin-top: 16px;
  }
  .img-thumb {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 1;
    border: 1.5px solid var(--c-rule);
  }
  .img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .img-thumb__remove {
    position: absolute; top: 5px; right: 5px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(26,23,21,0.55);
    backdrop-filter: blur(4px);
    color: #fff; border: none;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; cursor: pointer;
    transition: background 0.18s;
  }
  .img-thumb__remove:hover { background: var(--c-accent); }

  /* ── Submit button ── */
  .sell-submit {
    width: 100%;
    padding: 16px;
    border-radius: var(--radius-sm);
    border: none;
    background: var(--c-ink);
    color: var(--c-white);
    font-size: 14.5px;
    font-weight: 700;
    font-family: var(--font-body);
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
  }
  .sell-submit:hover { background: var(--c-accent); }
  .sell-submit:active { transform: scale(0.99); }
  .sell-submit:disabled { background: var(--c-ink-3); cursor: not-allowed; transform: none; }

  /* ── Error ── */
  .sell-error {
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    background: #fdf0ee;
    border: 1.5px solid #f5c4bd;
    color: var(--c-accent);
    font-size: 13.5px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Success screen ── */
  .sell-success {
    text-align: center;
    padding: 80px 30px;
  }
  .sell-success__circle {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: var(--c-ink);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 28px;
  }
  .sell-success__title {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 400;
    color: var(--c-ink);
    margin-bottom: 12px;
    letter-spacing: -0.4px;
  }
  .sell-success__body {
    font-size: 15px;
    color: var(--c-ink-3);
    max-width: 460px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }
  .sell-success__badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px;
    border-radius: 20px;
    background: var(--c-surface);
    border: 1px solid var(--c-rule);
    color: var(--c-ink-2);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .sell-success__badge::before {
    content: "";
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #56b870;
  }
  .sell-again-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 30px;
    border-radius: var(--radius-sm);
    background: var(--c-ink);
    color: var(--c-white);
    font-size: 13.5px;
    font-weight: 600;
    font-family: var(--font-body);
    border: none; cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
  }
  .sell-again-btn:hover { background: var(--c-accent); color: var(--c-white); }
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

const INITIAL_FORM: SellFormData = {
  contact_name: "",
  contact_email: "",
  contact_phone: "",
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
  const entries = Object.entries(data);

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
      {entries.map(([k, v]) => (
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

// ─── Field wrapper ────────────────────────────────────────────
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

      const { error: dbErr } = await supabase.from("sell_requests").insert([
        {
          contact_name: form.contact_name.trim(),
          contact_email: form.contact_email.trim(),
          contact_phone: form.contact_phone.trim(),
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

  const navItems = [
    { id: "sec-contact", icon: "👤", label: "Your Details" },
    { id: "sec-property", icon: "🏠", label: "Property Info" },
    { id: "sec-details", icon: "📋", label: "Prop. Details" },
    { id: "sec-utility", icon: "⚡", label: "Utilities" },
    { id: "sec-outdoor", icon: "🌿", label: "Outdoor" },
    { id: "sec-nearby", icon: "📍", label: "Nearby" },
    { id: "sec-amenities", icon: "✨", label: "Amenities" },
    { id: "sec-images", icon: "🖼", label: "Images" },
  ];

  return (
    <Wrapper>
      <SEO pageTitle="List Your Property – Sell or Rent" />
      <NavMenu />

      {/* ── Banner ── */}
      <div className="inner-banner-three inner-banner text-center z-1 position-relative">
        <div
          className="bg-wrapper overflow-hidden position-relative z-1"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        >
          <div className="container position-relative z-2">
            <h2 className="mb-35 xl-mb-20 md-mb-10 pt-15 font-garamond text-white">
              List Your Property
            </h2>
            <ul className="theme-breadcrumb style-none d-inline-flex align-items-center justify-content-center position-relative z-1 bottom-line">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>/</li>
              <li>List Property</li>
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

      {/* ── Form section ── */}
      <div className="sell-root sell-section">
        <div className="container">
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
              {/* ── Sidebar nav ── */}
              <aside className="sell-sidebar">
                <div className="sell-sidebar__title">Sections</div>
                {navItems.map((item) => (
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
                    <span className="sell-nav-item__icon">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </aside>

              {/* ── Form ── */}
              <div>
                {/* Contact */}
                <SellCard
                  id="sec-contact"
                  icon="👤"
                  title="Your Contact Information"
                  subtitle="We'll reach out to you at these details"
                >
                  <div className="row g-3">
                    <div className="col-md-4">
                      <Field label="Full Name" required>
                        <input
                          className="sell-input"
                          placeholder="e.g. John Smith"
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
                          placeholder="+1 555 000 0000"
                          value={form.contact_phone}
                          onChange={(e) => set("contact_phone", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                </SellCard>

                {/* Property Info */}
                <SellCard
                  id="sec-property"
                  icon="🏠"
                  title="Property Information"
                  subtitle="Core listing details shown to buyers"
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <Field label="Property Title" required>
                        <input
                          className="sell-input"
                          placeholder="e.g. Modern 3-Bedroom Apartment in Downtown"
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
                        label="Price (USD)"
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
                          placeholder="e.g. 123 Main St, New York, NY 10001"
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
                          placeholder="Describe the property — highlights, condition, unique features…"
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
                          placeholder="Briefly describe standout features like layout, views, renovations…"
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
                  subtitle="Year built, furnishing, parking, etc."
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
                  subtitle="Heating, cooling, water supply, etc."
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
                  subtitle='Enter distances, e.g. "0.5 km" or "5 min walk"'
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
                  subtitle="Select all that apply"
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
                  subtitle="Upload floor plan images (optional)"
                >
                  <ImageUploader
                    label="Upload floor plan images"
                    subtitle="PNG, JPG · Up to 3 images"
                    files={floorFiles}
                    onChange={setFloorFiles}
                    max={3}
                  />
                </SellCard>

                {/* Error + Submit */}
                {error && (
                  <div className="sell-error">
                    <span>⚠</span> {error}
                  </div>
                )}

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
                          width: "16px",
                          height: "16px",
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

      <Brand />
      <FancyBanner />
      <FutureFooter />
    </Wrapper>
  );
};

export default SellPropertyArea;

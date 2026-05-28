// ============================================================
//  SellPropertyArea.tsx — User-facing "List Your Property" form
//  Submits to `sell_requests` table in Supabase
//  Extra fields: contact_phone, contact_email + status = 'pending'
// ============================================================

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import FutureHeader from "../layouts/headers/FutureHeader";
import FutureFooter from "../layouts/footers/FutureFooter";

// ─── Supabase ─────────────────────────────────────────────────
const SUPABASE_URL = "https://wzttfewbiiakxkmgzfre.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dHRmZXdiaWlha3hrbWd6ZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY0MjksImV4cCI6MjA5NTM2MjQyOX0.-00zf6PqvccpLvBGxy4FtveqX5mCeGXJbC-ZF8ziEBk";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_BUCKET = "FutureState";

// ─── Types ────────────────────────────────────────────────────
interface SellFormData {
  // Contact info (extra fields)
  contact_name: string;
  contact_email: string;
  contact_phone: string;

  // Core listing
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

  // JSON sections
  property_details: Record<string, string>;
  utility_features: Record<string, string>;
  outdoor_features: Record<string, string>;
  whats_nearby: Record<string, string>;

  // Amenities
  amenities: string[];
}

// ─── Injected styles ─────────────────────────────────────────
const SELL_STYLES = `
  .sell-page-wrap {
    min-height: 100vh;
    background: #f7f7f9;
    padding: 60px 0 100px;
  }
  .sell-hero {
    background: #1a1a1a;
    padding: 56px 0 48px;
    margin-bottom: 48px;
    position: relative;
    overflow: hidden;
  }
  .sell-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(232,69,69,0.18) 0%, transparent 65%);
    pointer-events: none;
  }
  .sell-hero h1 {
    font-size: 36px;
    font-weight: 900;
    color: #fff;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
  }
  .sell-hero p {
    font-size: 15px;
    color: rgba(255,255,255,0.5);
    max-width: 520px;
  }
  .sell-hero .step-track {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 32px;
  }
  .step-node {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.4px;
  }
  .step-node.active { color: #fff; }
  .step-node .dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
  }
  .step-node.active .dot { border-color: #e84545; background: #e84545; color: #fff; }
  .step-node.done .dot { border-color: #4caf50; background: #4caf50; color: #fff; }
  .step-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.12);
    margin: 0 10px;
  }

  /* Form card */
  .sell-form-card {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #eee;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    padding: 34px 38px;
    margin-bottom: 28px;
  }
  .sell-form-card .card-section-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #bbb;
    margin-bottom: 22px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sell-form-card .card-section-title .icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    background: #f4f4f6;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
  }

  /* Inputs */
  .sell-input, .sell-select, .sell-textarea {
    width: 100%;
    padding: 11px 14px;
    border-radius: 10px;
    border: 1.5px solid #e8e8e8;
    font-size: 14px;
    color: #333;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-family: inherit;
  }
  .sell-input:focus, .sell-select:focus, .sell-textarea:focus {
    border-color: #1a1a1a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
  }
  .sell-textarea { resize: vertical; min-height: 110px; }
  .sell-select { cursor: pointer; }
  .sell-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
    color: #888;
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .sell-label .req { color: #e84545; margin-left: 2px; }
  .input-hint {
    font-size: 11.5px;
    color: #bbb;
    margin-top: 5px;
  }

  /* KV editor */
  .kv-editor { display: flex; flex-direction: column; gap: 8px; }
  .kv-row { display: grid; grid-template-columns: 1fr 1fr 34px; gap: 8px; align-items: center; }
  .kv-row input { padding: 9px 12px; border-radius: 8px; border: 1.5px solid #e8e8e8; font-size: 13px; background: #fafafa; outline: none; transition: border-color 0.2s; }
  .kv-row input:focus { border-color: #1a1a1a; background: #fff; }
  .kv-remove-btn {
    width: 34px; height: 34px; border-radius: 8px;
    border: 1.5px solid #eee; background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; color: #ccc; cursor: pointer;
    transition: all 0.2s;
  }
  .kv-remove-btn:hover { border-color: #e84545; color: #e84545; background: #fff5f5; }
  .kv-add-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; border: 1.5px dashed #ddd;
    background: transparent; color: #888; font-size: 13px;
    cursor: pointer; transition: all 0.2s; margin-top: 4px;
  }
  .kv-add-btn:hover { border-color: #1a1a1a; color: #1a1a1a; background: #f8f8f8; }

  /* Amenities */
  .amenity-grid-sell {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
  }
  .amenity-check-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 13px;
    border-radius: 9px;
    border: 1.5px solid #eee;
    background: #fafafa;
    cursor: pointer;
    font-size: 13px;
    color: #555;
    transition: all 0.2s;
    user-select: none;
  }
  .amenity-check-label:hover { border-color: #1a1a1a; background: #f5f5f5; }
  .amenity-check-label input { accent-color: #e84545; cursor: pointer; }
  .amenity-check-label.checked { border-color: #e84545; background: #fff5f5; color: #1a1a1a; font-weight: 600; }

  /* Image upload */
  .upload-zone-sell {
    border: 2px dashed #ddd;
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    cursor: pointer;
    background: #fafafa;
    transition: all 0.2s;
    position: relative;
  }
  .upload-zone-sell:hover { border-color: #1a1a1a; background: #f5f5f5; }
  .upload-zone-sell .uz-icon { font-size: 2rem; margin-bottom: 8px; }
  .upload-zone-sell p { font-size: 14px; font-weight: 600; color: #333; margin: 0 0 4px; }
  .upload-zone-sell span { font-size: 12px; color: #aaa; }
  .img-thumb-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 14px;
  }
  .img-thumb {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 1;
    border: 1.5px solid #eee;
  }
  .img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .img-thumb .remove-thumb {
    position: absolute; top: 5px; right: 5px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(0,0,0,0.55); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; cursor: pointer; border: none;
    transition: background 0.2s;
  }
  .img-thumb .remove-thumb:hover { background: #e84545; }

  /* Submit */
  .sell-submit-btn {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    border: none;
    background: #1a1a1a;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .sell-submit-btn:hover { background: #e84545; }
  .sell-submit-btn:active { transform: scale(0.99); }
  .sell-submit-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }

  /* Status badge */
  .pending-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 20px;
    background: #fff8e1;
    border: 1.5px solid #ffcc02;
    color: #b38600;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .pending-badge::before { content: "●"; font-size: 8px; }

  /* Success screen */
  .sell-success-screen {
    text-align: center;
    padding: 80px 30px;
  }
  .sell-success-screen .tick-circle {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #4caf50, #81c784);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; margin: 0 auto 24px;
    box-shadow: 0 8px 24px rgba(76,175,80,0.3);
  }
  .sell-success-screen h2 { font-size: 26px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; }
  .sell-success-screen p { font-size: 15px; color: #888; max-width: 440px; margin: 0 auto 28px; line-height: 1.7; }
  .sell-another-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 28px; border-radius: 10px;
    background: #1a1a1a; color: #fff;
    font-weight: 700; font-size: 14px;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s;
  }
  .sell-another-btn:hover { background: #e84545; color: #fff; }

  /* Error */
  .sell-error-box {
    padding: 12px 16px;
    border-radius: 9px;
    background: #fff5f5;
    border: 1.5px solid #ffcdd2;
    color: #c62828;
    font-size: 13.5px;
    margin-bottom: 16px;
  }
`;

function injectSellStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("sell-form-styles")
  ) {
    const el = document.createElement("style");
    el.id = "sell-form-styles";
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

// ─── KV Section Editor ───────────────────────────────────────
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
      } else {
        next[k] = v;
      }
    }
    onChange(next);
  };

  const remove = (key: string) => {
    const next = { ...data };
    delete next[key];
    onChange(next);
  };

  const add = () => {
    const key = `field_${Date.now()}`;
    onChange({ ...data, [key]: "" });
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
            className="kv-remove-btn"
            onClick={() => remove(k)}
            type="button"
          >
            ×
          </button>
        </div>
      ))}
      <button className="kv-add-btn" onClick={add} type="button">
        <span>+</span> Add Field
      </button>
    </div>
  );
}

// ─── Image Upload ─────────────────────────────────────────────
function ImageUploader({
  label,
  files,
  onChange,
  max = 8,
  hint = "",
}: {
  label: string;
  files: File[];
  onChange: (f: File[]) => void;
  max?: number;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const merged = [...files, ...selected].slice(0, max);
    onChange(merged);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (i: number) => {
    const next = files.filter((_, idx) => idx !== i);
    onChange(next);
  };

  return (
    <div>
      <div
        className="upload-zone-sell"
        onClick={() => inputRef.current?.click()}
      >
        <div className="uz-icon">📷</div>
        <p>{label}</p>
        <span>
          {files.length}/{max} selected · PNG, JPG · {hint || "Max 10MB each"}
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleSelect}
        />
      </div>
      {files.length > 0 && (
        <div className="img-thumb-grid">
          {files.map((f, i) => (
            <div key={i} className="img-thumb">
              <img src={URL.createObjectURL(f)} alt={f.name} />
              <button
                className="remove-thumb"
                onClick={() => remove(i)}
                type="button"
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

// ─── Main Component ───────────────────────────────────────────
const SellPropertyArea = () => {
  injectSellStyles();

  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [floorFiles, setFloorFiles] = useState<File[]>([]);

  const [form, setForm] = useState<SellFormData>({
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
    property_details: {
      year_built: "",
      furnishing: "",
      parking: "",
      floors: "",
    },
    utility_features: { heating: "", cooling: "", water: "", electricity: "" },
    outdoor_features: { garden: "", balcony: "", garage: "", pool: "" },
    whats_nearby: { school: "", grocery: "", hospital: "", metro: "" },
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

  // Upload image array to Supabase storage, return URLs
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

    // Basic validation
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

      // Clean up empty KV entries
      const cleanKV = (obj: Record<string, string>) =>
        Object.fromEntries(
          Object.entries(obj).filter(([k, v]) => k.trim() && v.trim()),
        );

      const payload = {
        // Contact (extra fields for seller)
        contact_name: form.contact_name.trim(),
        contact_email: form.contact_email.trim(),
        contact_phone: form.contact_phone.trim(),

        // Listing fields
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

        // Status flag for admin review
        review_status: "pending",
      };

      const { error: dbErr } = await supabase
        .from("sell_requests")
        .insert([payload]);

      if (dbErr) throw new Error(dbErr.message);

      setStep("success");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="sell-page-wrap">
        <div className="container">
          <div className="sell-form-card">
            <div className="sell-success-screen">
              <div className="tick-circle">✓</div>
              <h2>Listing Submitted!</h2>
              <p>
                Thank you! Your property listing has been submitted for review.
                Our team will contact you at{" "}
                <strong>{form.contact_email}</strong> or{" "}
                <strong>{form.contact_phone}</strong> within 24–48 hours.
              </p>
              <div className="pending-badge" style={{ marginBottom: "28px" }}>
                STATUS: PENDING REVIEW
              </div>
              <br />
              <button
                className="sell-another-btn"
                onClick={() => {
                  setStep("form");
                  setForm({
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
                    property_details: {
                      year_built: "",
                      furnishing: "",
                      parking: "",
                      floors: "",
                    },
                    utility_features: {
                      heating: "",
                      cooling: "",
                      water: "",
                      electricity: "",
                    },
                    outdoor_features: {
                      garden: "",
                      balcony: "",
                      garage: "",
                      pool: "",
                    },
                    whats_nearby: {
                      school: "",
                      grocery: "",
                      hospital: "",
                      metro: "",
                    },
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
        </div>
      </div>
    );
  }

  return (
    <>
      <FutureHeader style_1={true} style_2={false} />
      <div className="sell-page-wrap">
        {/* Hero */}
        <div className="sell-hero">
          <div className="container">
            <h1>List Your Property</h1>
            <p>
              Fill in the details below and our team will review your listing
              and get in touch within 24 hours.
            </p>
            <div className="step-track">
              {[
                { n: 1, label: "Your Details" },
                { n: 2, label: "Property Info" },
                { n: 3, label: "Features & Media" },
                { n: 4, label: "Review" },
              ].map((s, i, arr) => (
                <>
                  <div key={s.n} className="step-node active">
                    <div className="dot">{s.n}</div>
                    {s.label}
                  </div>
                  {i < arr.length - 1 && <div className="step-line" />}
                </>
              ))}
            </div>
          </div>
        </div>

        <div className="container">
          {/* ── Section 1: Contact Info ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">👤</span>
              Your Contact Information
              <span
                className="pending-badge ms-auto"
                style={{ fontSize: "11px" }}
              >
                UPLOADED BY USER
              </span>
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="sell-label">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  className="sell-input"
                  placeholder="e.g. John Smith"
                  value={form.contact_name}
                  onChange={(e) => set("contact_name", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="sell-label">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  type="email"
                  className="sell-input"
                  placeholder="you@example.com"
                  value={form.contact_email}
                  onChange={(e) => set("contact_email", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="sell-label">
                  Phone Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  className="sell-input"
                  placeholder="+1 555 000 0000"
                  value={form.contact_phone}
                  onChange={(e) => set("contact_phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Core Listing ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">🏠</span>
              Property Details
            </div>
            <div className="row g-3">
              <div className="col-12">
                <label className="sell-label">
                  Property Title <span className="req">*</span>
                </label>
                <input
                  className="sell-input"
                  placeholder="e.g. Modern 3-Bedroom Apartment in Downtown"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="sell-label">Property Type</label>
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
              </div>
              <div className="col-md-4">
                <label className="sell-label">Listing Type</label>
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
              </div>
              <div className="col-md-4">
                <label className="sell-label">
                  Price (USD) <span className="req">*</span>
                </label>
                <input
                  className="sell-input"
                  placeholder="e.g. 450000"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
                <div className="input-hint">
                  {form.status === "For Rent"
                    ? "Monthly rent amount"
                    : "Asking price"}
                </div>
              </div>
              <div className="col-12">
                <label className="sell-label">
                  Location / Address <span className="req">*</span>
                </label>
                <input
                  className="sell-input"
                  placeholder="e.g. 123 Main St, New York, NY 10001"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="sell-label">Area (sqft)</label>
                <input
                  className="sell-input"
                  placeholder="e.g. 1200"
                  value={form.sqft}
                  onChange={(e) => set("sqft", e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="sell-label">Bedrooms</label>
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
              </div>
              <div className="col-md-3">
                <label className="sell-label">Bathrooms</label>
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
              </div>
              <div className="col-md-3">
                <label className="sell-label">Kitchens</label>
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
              </div>
              <div className="col-12">
                <label className="sell-label">Description</label>
                <textarea
                  className="sell-textarea"
                  placeholder="Describe the property — highlights, condition, unique features…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="sell-label">Features Description</label>
                <textarea
                  className="sell-textarea"
                  rows={3}
                  placeholder="Briefly describe standout features like layout, views, renovations…"
                  value={form.features_description}
                  onChange={(e) => set("features_description", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Property Details KV ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">📋</span>
              Property Details
            </div>
            <KVEditor
              data={form.property_details}
              onChange={(d) => set("property_details", d)}
              placeholder={{ k: "e.g. year_built", v: "e.g. 2019" }}
            />
          </div>

          {/* ── Section 4: Utility ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">⚡</span>
              Utility & Home Features
            </div>
            <KVEditor
              data={form.utility_features}
              onChange={(d) => set("utility_features", d)}
              placeholder={{ k: "e.g. heating", v: "e.g. Central Gas" }}
            />
          </div>

          {/* ── Section 5: Outdoor ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">🌿</span>
              Outdoor Features
            </div>
            <KVEditor
              data={form.outdoor_features}
              onChange={(d) => set("outdoor_features", d)}
              placeholder={{ k: "e.g. garden", v: "e.g. Yes, private" }}
            />
          </div>

          {/* ── Section 6: Nearby ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">📍</span>
              What's Nearby (distances)
            </div>
            <div className="input-hint mb-3">
              Enter distances in km or min walk, e.g. "0.5 km" or "5 min walk"
            </div>
            <KVEditor
              data={form.whats_nearby}
              onChange={(d) => set("whats_nearby", d)}
              placeholder={{ k: "e.g. school", v: "e.g. 0.4 km" }}
            />
          </div>

          {/* ── Section 7: Amenities ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">✨</span>
              Amenities
            </div>
            <div className="amenity-grid-sell">
              {AMENITY_OPTIONS.map((a) => (
                <label
                  key={a}
                  className={`amenity-check-label${form.amenities.includes(a) ? " checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* ── Section 8: Images ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">🖼</span>
              Property Images
            </div>
            <ImageUploader
              label="Upload property photos"
              files={imageFiles}
              onChange={setImageFiles}
              max={8}
              hint="Up to 8 images · PNG, JPG · Max 10MB each"
            />
          </div>

          {/* ── Section 9: Floor Plans ── */}
          <div className="sell-form-card">
            <div className="card-section-title">
              <span className="icon">📐</span>
              Floor Plans
            </div>
            <ImageUploader
              label="Upload floor plan images"
              files={floorFiles}
              onChange={setFloorFiles}
              max={3}
              hint="Up to 3 images"
            />
          </div>

          {/* Submit */}
          {error && <div className="sell-error-box">{error}</div>}
          <button
            className="sell-submit-btn mb-5"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  style={{ width: "16px", height: "16px" }}
                />
                Submitting…
              </>
            ) : (
              <>🚀 Submit Property for Review</>
            )}
          </button>
        </div>
      </div>
      <FutureFooter />
    </>
  );
};

export default SellPropertyArea;

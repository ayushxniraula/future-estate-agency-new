// ============================================================
//  ListingDetailsFourArea.tsx — Dynamic property detail page
//  Improved: polished banner, gallery, sidebar, sections, micro-interactions
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

function formatPrice(price: number, status: string): string {
  const formatted = price.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return status === "For Rent" ? `$${formatted}/mo` : `$${formatted}`;
}

// ─── Injected styles ─────────────────────────────────────────
const DETAIL_STYLES = `
  /* ── Banner ── */
  .detail-banner {
    padding: 32px 0 28px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0;
  }
  .detail-banner .prop-title {
    font-size: 28px;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.25;
    margin-bottom: 10px;
  }
  .detail-banner .status-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    color: #fff;
    margin-right: 10px;
  }
  .detail-banner .address-line {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: #888;
  }
  .detail-banner .price-block {
    text-align: right;
  }
  .detail-banner .main-price {
    font-size: 30px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -0.5px;
  }
  .detail-banner .est-price {
    font-size: 14px;
    color: #999;
    margin-top: 4px;
  }
  .detail-banner .est-price strong { color: #555; }

  /* Action buttons */
  .action-btns-improved {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    justify-content: flex-end;
  }
  .action-btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid #e0e0e0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #555;
    text-decoration: none;
    transition: all 0.2s;
    font-size: 14px;
  }
  .action-btn-icon:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
    background: #f8f8f8;
  }
  .action-btn-share {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13.5px;
    font-weight: 600;
    color: #555;
    text-decoration: none;
    padding: 7px 14px;
    border-radius: 20px;
    border: 1.5px solid #e0e0e0;
    background: #fff;
    transition: all 0.2s;
    margin-right: auto;
  }
  .action-btn-share:hover { border-color: #1a1a1a; color: #1a1a1a; }

  /* ── Gallery ── */
  .detail-gallery {
    margin-top: 28px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  }
  .detail-gallery img {
    width: 100%;
    max-height: 520px;
    object-fit: cover;
    display: block;
  }
  .gallery-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    border: none;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #1a1a1a;
    cursor: pointer;
    z-index: 5;
    transition: all 0.2s;
  }
  .gallery-arrow:hover { background: #fff; box-shadow: 0 4px 18px rgba(0,0,0,0.2); transform: translateY(-50%) scale(1.05); }
  .gallery-arrow.prev { left: 14px; }
  .gallery-arrow.next { right: 14px; }
  .gallery-count {
    position: absolute;
    bottom: 14px;
    right: 14px;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    z-index: 5;
  }

  /* ── Overview bar ── */
  .overview-bar {
    display: flex;
    align-items: center;
    gap: 0;
    background: #1a1a1a;
    border-radius: 14px;
    margin: 24px 0 40px;
    overflow: hidden;
  }
  .overview-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 12px;
    border-right: 1px solid rgba(255,255,255,0.08);
    text-align: center;
  }
  .overview-bar-item:last-child { border-right: none; }
  .overview-bar-item img { width: 22px; height: 22px; margin-bottom: 6px; filter: invert(1); opacity: 0.8; }
  .overview-bar-item .ov-label { font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 2px; }
  .overview-bar-item .ov-value { font-size: 15px; font-weight: 700; color: #fff; }

  /* ── Section headings ── */
  .detail-section {
    padding-bottom: 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid #f0f0f0;
  }
  .detail-section:last-child { border-bottom: none; }
  .section-heading {
    font-size: 20px;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-heading::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #f0f0f0;
  }
  .section-body-text {
    font-size: 15px;
    line-height: 1.75;
    color: #555;
  }

  /* ── Accordion improvements ── */
  .accordion-improved .accordion-item {
    border: 1.5px solid #eee;
    border-radius: 10px !important;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .accordion-improved .accordion-button {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    background: #fafafa;
    border-radius: 10px !important;
    padding: 14px 18px;
  }
  .accordion-improved .accordion-button:not(.collapsed) {
    background: #fff;
    color: #e84545;
    box-shadow: none;
  }
  .accordion-improved .accordion-button::after {
    filter: none;
  }
  .accordion-improved .accordion-body {
    padding: 16px 18px;
  }
  .feature-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 24px;
  }
  .feature-row-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f4f4f4;
    font-size: 13.5px;
  }
  .feature-row-item .fk { color: #888; }
  .feature-row-item .fv { font-weight: 600; color: #1a1a1a; }

  /* ── Amenities ── */
  .amenity-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f6f6f8;
    border: 1.5px solid #eee;
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 500;
    color: #444;
    transition: all 0.2s;
  }
  .amenity-tag:hover { border-color: #1a1a1a; background: #f0f0f0; }
  .amenity-tag::before { content: "✓"; font-size: 11px; color: #e84545; font-weight: 700; }

  /* ── Walk score bars ── */
  .walk-score-item {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }
  .walk-score-item .ws-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #f4f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .walk-score-item .ws-icon img { width: 22px; height: 22px; }
  .walk-score-item .ws-info { flex: 1; }
  .walk-score-item .ws-label { font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 5px; }
  .walk-score-item .ws-bar-bg { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; }
  .walk-score-item .ws-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #e84545, #ff7676); transition: width 0.8s ease; }
  .walk-score-item .ws-num { font-size: 13px; font-weight: 700; color: #1a1a1a; min-width: 36px; text-align: right; }

  /* ── Nearby list ── */
  .nearby-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .nearby-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: #fafafa;
    border-radius: 9px;
    border: 1px solid #f0f0f0;
    font-size: 13.5px;
  }
  .nearby-item .nk { color: #888; }
  .nearby-item .nv { font-weight: 600; color: #1a1a1a; }

  /* ── Map ── */
  .map-container {
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    border: 1px solid #eee;
  }
  .map-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    background: #fafafa;
    font-size: 13px;
    color: #888;
    border-top: 1px solid #eee;
  }
  .map-footer a { color: #1a1a1a; font-weight: 600; text-decoration: none; }
  .map-footer a:hover { color: #e84545; }

  /* ── Similar properties ── */
  .similar-card {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    transition: box-shadow 0.25s, transform 0.25s;
    margin: 0 8px 8px;
  }
  .similar-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.11); transform: translateY(-2px); }
  .similar-card img { width: 100%; height: 190px; object-fit: cover; display: block; }
  .similar-card .sc-body { padding: 14px 16px; }
  .similar-card .sc-price { font-size: 16px; font-weight: 800; color: #1a1a1a; }
  .similar-card .sc-location { font-size: 13px; color: #888; margin: 3px 0 8px; }
  .similar-card .sc-meta { font-size: 12.5px; color: #aaa; }
  .similar-card .sc-footer { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-top: 1px solid #f0f0f0; }
  .sc-detail-btn {
    width: 32px; height: 32px; border-radius: 50%;
    background: #1a1a1a; color: #fff;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 13px;
    transition: background 0.2s, transform 0.2s;
  }
  .sc-detail-btn:hover { background: #e84545; transform: rotate(45deg); }

  /* ── Right sidebar cards ── */
  .sidebar-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #eee;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 24px;
    margin-bottom: 20px;
  }
  .sidebar-card-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    color: #bbb;
    margin-bottom: 16px;
  }
  .price-display {
    font-size: 28px;
    font-weight: 900;
    color: #1a1a1a;
    letter-spacing: -0.5px;
    margin-bottom: 16px;
  }
  .price-display sub { font-size: 14px; font-weight: 500; color: #999; letter-spacing: 0; }
  .facts-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid #f4f4f4;
    font-size: 13.5px;
  }
  .facts-row:last-child { border-bottom: none; }
  .facts-row .fk { color: #999; }
  .facts-row .fv { font-weight: 600; color: #1a1a1a; }

  /* Agent card */
  .agent-avatar {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e84545 0%, #1a1a1a 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; color: #fff; flex-shrink: 0;
    font-weight: 700;
  }
  .agent-name { font-size: 15px; font-weight: 700; color: #1a1a1a; }
  .agent-title { font-size: 12px; color: #aaa; }
  .agent-contact-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 13.5px; color: #555; padding: 6px 0;
  }
  .agent-contact-row a { color: #555; text-decoration: none; transition: color 0.2s; }
  .agent-contact-row a:hover { color: #e84545; }
  .agent-contact-row i { color: #aaa; width: 16px; }

  /* Contact form */
  .contact-input {
    width: 100%;
    padding: 10px 13px;
    border-radius: 9px;
    border: 1.5px solid #e8e8e8;
    font-size: 14px;
    color: #333;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 12px;
  }
  .contact-input:focus { border-color: #1a1a1a; background: #fff; }
  .contact-textarea {
    width: 100%;
    padding: 10px 13px;
    border-radius: 9px;
    border: 1.5px solid #e8e8e8;
    font-size: 14px;
    color: #333;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    resize: none;
    margin-bottom: 14px;
  }
  .contact-textarea:focus { border-color: #1a1a1a; background: #fff; }
  .send-btn {
    width: 100%;
    padding: 12px;
    border-radius: 9px;
    border: none;
    background: #1a1a1a;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .send-btn:hover { background: #e84545; }

  /* Floor plan */
  .floor-plan-wrap {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
    background: #fafafa;
  }
  .floor-plan-wrap img { width: 100%; display: block; }
`;

function injectDetailStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("detail-improved-styles")
  ) {
    const el = document.createElement("style");
    el.id = "detail-improved-styles";
    el.textContent = DETAIL_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Banner ───────────────────────────────────────────────────
function DynamicBanner({ property }: { property: Property }) {
  const monthly =
    property.status === "For Rent"
      ? property.price
      : Math.round(property.price * 0.005);

  return (
    <div className="detail-banner">
      <div className="row align-items-start">
        <div className="col-lg-7">
          <h1 className="prop-title">{property.title}</h1>
          <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
            <span
              className="status-pill"
              style={{ background: getStatusColor(property.status) }}
            >
              {getStatusLabel(property.status)}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
                color: "#888",
                background: "#f5f5f5",
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              <i className="bi bi-geo-alt" style={{ fontSize: "12px" }} />
              {property.location}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "13px",
                color: "#aaa",
                background: "#f5f5f5",
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              {property.property_type}
            </span>
          </div>
        </div>

        <div className="col-lg-5 price-block mt-3 mt-lg-0">
          <div className="main-price">
            {formatPrice(property.price, property.status)}
          </div>
          {property.status !== "For Rent" && (
            <div className="est-price">
              Est. <strong>${monthly.toLocaleString()}/mo</strong>
            </div>
          )}
          <div className="action-btns-improved">
            <a href="#" className="action-btn-share">
              <i className="fa-sharp fa-regular fa-share-nodes" />
              Share
            </a>
            <a href="#" className="action-btn-icon" title="Save to favourites">
              <i className="fa-light fa-heart" />
            </a>
            <a href="#" className="action-btn-icon" title="Bookmark">
              <i className="fa-light fa-bookmark" />
            </a>
            <a href="#" className="action-btn-icon" title="Add to compare">
              <i className="fa-light fa-circle-plus" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────
function DynamicMediaGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const sliderRef = useRef<Slider | null>(null);
  const [current, setCurrent] = useState(0);
  const fallback = ["/assets/images/listing/img_57.jpg"];
  const imgs = images && images.length > 0 ? images : fallback;

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (_: number, next: number) => setCurrent(next),
  };

  return (
    <div className="detail-gallery">
      <Slider {...settings} ref={sliderRef}>
        {imgs.map((src, i) => (
          <div key={i}>
            <img src={src} alt={`${title} — ${i + 1}`} />
          </div>
        ))}
      </Slider>
      <button
        className="gallery-arrow prev"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <i className="bi bi-arrow-left" />
      </button>
      <button
        className="gallery-arrow next"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <i className="bi bi-arrow-right" />
      </button>
      {imgs.length > 1 && (
        <div className="gallery-count">
          {current + 1} / {imgs.length}
        </div>
      )}
    </div>
  );
}

// ─── Overview bar ─────────────────────────────────────────────
function DynamicPropertyOverview({ property }: { property: Property }) {
  const items = [
    {
      icon: "/assets/images/icon/icon_58.svg",
      label: "Area",
      value: property.sqft ? `${property.sqft.toLocaleString()} sqft` : "N/A",
    },
    {
      icon: "/assets/images/icon/icon_59.svg",
      label: "Bedrooms",
      value: property.bedrooms ?? "—",
    },
    {
      icon: "/assets/images/icon/icon_60.svg",
      label: "Bathrooms",
      value: property.bathrooms ?? "—",
    },
    {
      icon: "/assets/images/icon/icon_61.svg",
      label: "Kitchens",
      value: property.kitchens ?? "—",
    },
  ];

  return (
    <div className="overview-bar">
      {items.map((item, i) => (
        <div key={i} className="overview-bar-item">
          <img src={item.icon} alt={item.label} />
          <div className="ov-label">{item.label}</div>
          <div className="ov-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Feature accordion ────────────────────────────────────────
function DynamicPropertyFeatureList({ property }: { property: Property }) {
  const [openSection, setOpenSection] = useState<number>(0);

  const sections = [
    { id: 1, title: "Property Details", data: property.property_details ?? {} },
    {
      id: 2,
      title: "Utility & Home Features",
      data: property.utility_features ?? {},
    },
    { id: 3, title: "Outdoor Features", data: property.outdoor_features ?? {} },
  ];

  const formatKey = (k: string) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="accordion accordion-improved" id="accordionTwo">
      {sections.map((section, index) => {
        const entries = Object.entries(section.data).filter(
          ([, v]) => v && String(v).trim() !== "",
        );
        if (entries.length === 0) return null;
        const isOpen = openSection === index;
        return (
          <div key={section.id} className="accordion-item">
            <h2 className="accordion-header">
              <button
                onClick={() => setOpenSection(isOpen ? -1 : index)}
                className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                type="button"
              >
                {section.title}
              </button>
            </h2>
            {isOpen && (
              <div className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <div className="feature-row">
                    {entries.map(([k, v]) => (
                      <div key={k} className="feature-row-item">
                        <span className="fk">{formatKey(k)}</span>
                        <span className="fv">{v}</span>
                      </div>
                    ))}
                  </div>
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
function DynamicAmenities({ amenities }: { amenities: string[] }) {
  if (!amenities || amenities.length === 0) return null;
  return (
    <>
      <p className="section-body-text mb-20">
        This property includes the following amenities.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {amenities.map((a, i) => (
          <span key={i} className="amenity-tag">
            {a}
          </span>
        ))}
      </div>
    </>
  );
}

// ─── Floor plan ───────────────────────────────────────────────
function DynamicFloorPlan({ floorPlans }: { floorPlans: string[] }) {
  const images =
    floorPlans && floorPlans.length > 0
      ? floorPlans
      : [
          "/assets/images/listing/floor_1.jpg",
          "/assets/images/listing/floor_2.jpg",
        ];

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
    <div className="floor-plan-wrap">
      <Slider {...settings}>
        {images.map((src, i) => (
          <div key={i}>
            <img src={src} alt={`Floor plan ${i + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

// ─── Nearby ───────────────────────────────────────────────────
function DynamicNearbyList({
  nearby,
}: {
  nearby: Record<string, string> | null;
}) {
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

  return (
    <>
      <p className="section-body-text mb-20">
        Distances from this property to key local amenities and services.
      </p>
      <div className="nearby-grid">
        {entries.map(([k, v]) => (
          <div key={k} className="nearby-item">
            <span className="nk">{labelMap[k] ?? k.replace(/_/g, " ")}</span>
            <span className="nv">{v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Walk score ───────────────────────────────────────────────
function DynamicWalkScore({
  nearby,
}: {
  nearby: Record<string, string> | null;
}) {
  if (!nearby) return null;

  function distanceScore(km: string): number {
    const d = parseFloat(km);
    if (isNaN(d)) return 0;
    if (d <= 0.3) return 100;
    if (d <= 0.5) return 90;
    if (d <= 1.0) return 75;
    if (d <= 2.0) return 55;
    if (d <= 5.0) return 35;
    return 15;
  }

  const scores = [
    {
      icon: "/assets/images/icon/icon_52.svg",
      title: "Transit Score",
      value: Math.round(
        (distanceScore(nearby.metro ?? "99") +
          distanceScore(nearby.bus ?? "99")) /
          2,
      ),
    },
    {
      icon: "/assets/images/icon/icon_53.svg",
      title: "School Score",
      value: Math.round(
        (distanceScore(nearby.school ?? "99") +
          distanceScore(nearby.university ?? "99")) /
          2,
      ),
    },
    {
      icon: "/assets/images/icon/icon_54.svg",
      title: "Medical Score",
      value: Math.round(
        (distanceScore(nearby.hospital ?? "99") +
          distanceScore(nearby.pharmacy ?? "99")) /
          2,
      ),
    },
    {
      icon: "/assets/images/icon/icon_55.svg",
      title: "Shopping Score",
      value: Math.round(
        (distanceScore(nearby.mall ?? "99") +
          distanceScore(nearby.grocery ?? "99")) /
          2,
      ),
    },
  ];

  function label(s: number) {
    if (s >= 90) return "Excellent";
    if (s >= 70) return "Very Good";
    if (s >= 50) return "Good";
    if (s >= 30) return "Fair";
    return "Limited";
  }

  return (
    <>
      <p className="section-body-text mb-24">
        Scores are calculated based on walking distance to nearby amenities.
      </p>
      {scores.map((item, i) => (
        <div key={i} className="walk-score-item">
          <div className="ws-icon">
            <img src={item.icon} alt={item.title} />
          </div>
          <div className="ws-info">
            <div className="ws-label">
              {item.title} —{" "}
              <span
                style={{ fontWeight: 400, color: "#aaa", fontSize: "12px" }}
              >
                {label(item.value)}
              </span>
            </div>
            <div className="ws-bar-bg">
              <div
                className="ws-bar-fill"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
          <div className="ws-num">{item.value}</div>
        </div>
      ))}
    </>
  );
}

// ─── Map ──────────────────────────────────────────────────────
function DynamicLocation({ location }: { location: string }) {
  const q = encodeURIComponent(location);
  const src = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&query=${q}&marker=0%2C0`;

  return (
    <div className="map-container">
      <iframe
        title={`Map for ${location}`}
        src={src}
        width="600"
        height="420"
        style={{ border: 0, display: "block", width: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="map-footer">
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
      const { data } = await supabase
        .from("properties")
        .select(
          "id, title, price, location, status, images, bedrooms, bathrooms, sqft",
        )
        .neq("id", currentId)
        .eq("property_type", propertyType)
        .limit(4);

      if (!data || data.length < 2) {
        const { data: fallback } = await supabase
          .from("properties")
          .select(
            "id, title, price, location, status, images, bedrooms, bathrooms, sqft",
          )
          .neq("id", currentId)
          .limit(4);
        setSimilar((fallback as Property[]) || []);
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
    autoplaySpeed: 3500,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  return (
    <Slider {...settings}>
      {similar.map((item) => (
        <div key={item.id}>
          <div className="similar-card">
            {item.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.title} />
            ) : (
              <div
                style={{
                  height: "190px",
                  background: "#f0f0f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                }}
              >
                🏠
              </div>
            )}
            <div className="sc-body">
              <div className="sc-price">
                {formatPrice(item.price, item.status)}
              </div>
              <div className="sc-location">
                <i
                  className="bi bi-geo-alt"
                  style={{ fontSize: "11px", marginRight: "3px" }}
                />
                {item.location}
              </div>
              <div className="sc-meta">
                {item.bedrooms != null && `${item.bedrooms} bed`}
                {item.bathrooms != null && ` · ${item.bathrooms} bath`}
                {item.sqft != null && ` · ${item.sqft.toLocaleString()} sqft`}
              </div>
            </div>
            <div className="sc-footer">
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  color: "#fff",
                  background: getStatusColor(item.status),
                  padding: "3px 10px",
                  borderRadius: "12px",
                }}
              >
                {getStatusLabel(item.status)}
              </span>
              <Link to={`/sell/${item.id}`} className="sc-detail-btn">
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
      ? [{ k: "Area", v: `${property.sqft.toLocaleString()} sqft` }]
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
    <div className="sidebar-card">
      <div className="sidebar-card-title">Pricing</div>
      <div className="price-display">
        {formatPrice(property.price, property.status)}
        {property.status !== "For Rent" && (
          <div
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#aaa",
              marginTop: "2px",
              letterSpacing: 0,
            }}
          >
            Est.{" "}
            <strong style={{ color: "#555" }}>
              ${monthly.toLocaleString()}/mo
            </strong>
          </div>
        )}
      </div>
      {facts.map((f) => (
        <div key={f.k} className="facts-row">
          <span className="fk">{f.k}</span>
          <span className="fv">{f.v}</span>
        </div>
      ))}
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
    <div className="sidebar-card">
      <div className="sidebar-card-title">Listed By</div>
      <div
        className="d-flex align-items-center gap-3 mb-16"
        style={{ marginBottom: "16px" }}
      >
        <div className="agent-avatar">{agent.name ? agent.name[0] : "A"}</div>
        <div>
          <div className="agent-name">{agent.name}</div>
          <div className="agent-title">{agent.title}</div>
        </div>
      </div>
      {agent.phone && (
        <div className="agent-contact-row">
          <i className="bi bi-telephone" />
          <a href={`tel:${agent.phone}`}>{agent.phone}</a>
        </div>
      )}
      {agent.email && (
        <div className="agent-contact-row">
          <i className="bi bi-envelope" />
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
      )}
      {agent.location && (
        <div className="agent-contact-row">
          <i className="bi bi-geo-alt" />
          {agent.location}
        </div>
      )}
      {agent.email && (
        <a
          href={`mailto:${agent.email}`}
          style={{
            display: "block",
            marginTop: "16px",
            textAlign: "center",
            padding: "11px",
            borderRadius: "9px",
            background: "#1a1a1a",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e84545")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a1a")}
        >
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
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-title">Send a Message</div>
      <input type="text" className="contact-input" placeholder="Your Name" />
      <input type="email" className="contact-input" placeholder="Your Email" />
      <input
        type="tel"
        className="contact-input"
        placeholder="Your Phone (optional)"
      />
      <textarea
        className="contact-textarea"
        rows={4}
        defaultValue={`Hi, I'm interested in "${property.title}" at ${property.location}. Please get in touch.`}
      />
      <button
        className="send-btn"
        onClick={() => {
          if (agentEmail) {
            window.location.href = `mailto:${agentEmail}?subject=Enquiry: ${encodeURIComponent(property.title)}`;
          }
        }}
      >
        Send Message
      </button>
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ width: "2.5rem", height: "2.5rem", color: "#e84545" }}
        />
        <p style={{ marginTop: "16px", color: "#aaa", fontSize: "14px" }}>
          Loading property details…
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: "3rem" }}>⚠️</div>
        <p style={{ marginTop: "12px", color: "#555", fontSize: "17px" }}>
          {error || "Property not found"}
        </p>
        <Link
          to="/listing_13"
          style={{
            marginTop: "16px",
            padding: "10px 24px",
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Listings
        </Link>
      </div>
    );
  }

  const agent = property.agent ?? property.agent_info ?? null;

  return (
    <div className="listing-details-one theme-details-one border-top lg-mt-100 pt-50 pb-150 xl-pb-120">
      <div className="container">
        {/* Banner */}
        <DynamicBanner property={property} />

        {/* Gallery */}
        <DynamicMediaGallery
          images={property.images || []}
          title={property.title}
        />

        {/* Overview bar */}
        <DynamicPropertyOverview property={property} />

        <div className="row">
          {/* ── Left column ── */}
          <div className="col-xl-8">
            {/* Overview */}
            {property.description && (
              <div className="detail-section">
                <h4 className="section-heading">Overview</h4>
                <p className="section-body-text">{property.description}</p>
              </div>
            )}

            {/* Property Features */}
            <div className="detail-section">
              <h4 className="section-heading">Property Features</h4>
              {property.features_description && (
                <p className="section-body-text mb-20">
                  {property.features_description}
                </p>
              )}
              <DynamicPropertyFeatureList property={property} />
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="detail-section">
                <h4 className="section-heading">Amenities</h4>
                <DynamicAmenities amenities={property.amenities} />
              </div>
            )}

            {/* Floor plan */}
            <div className="detail-section">
              <h4 className="section-heading">Floor Plans</h4>
              <DynamicFloorPlan floorPlans={property.floor_plans || []} />
            </div>

            {/* What's Nearby */}
            {property.whats_nearby && (
              <div className="detail-section">
                <h4 className="section-heading">What's Nearby</h4>
                <DynamicNearbyList nearby={property.whats_nearby} />
              </div>
            )}

            {/* Similar Properties */}
            <div className="detail-section">
              <h4 className="section-heading">Similar Homes</h4>
              <SimilarProperties
                currentId={property.id}
                propertyType={property.property_type}
              />
            </div>

            {/* Walk Score */}
            {property.whats_nearby && (
              <div className="detail-section">
                <h4 className="section-heading">Walk Score</h4>
                <DynamicWalkScore nearby={property.whats_nearby} />
              </div>
            )}

            {/* Location */}
            <div className="detail-section">
              <h4 className="section-heading">Location</h4>
              <DynamicLocation location={property.location} />
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="col-xl-4">
            <div
              className="ps-xl-3"
              style={{ position: "sticky", top: "100px" }}
            >
              <PriceSidebar property={property} />
              <AgentSidebar agent={agent as Record<string, string> | null} />
              <ContactForm property={property} agentEmail={agent?.email} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyDetails;

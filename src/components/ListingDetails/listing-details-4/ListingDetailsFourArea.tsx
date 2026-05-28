// ============================================================
//  ListingDetailsFourArea.tsx — Dynamic property detail page
//  Reads :id from URL, fetches from Supabase, renders everything
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

function formatPrice(price: number, status: string): string {
  const formatted = price.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return status === "For Rent" ? `$${formatted}/mo` : `$${formatted}`;
}

// Build a free OpenStreetMap embed URL from a location string.
// We pass the location as the "q" search param in the Nominatim-based embed.
function buildOsmUrl(location: string): string {
  const encoded = encodeURIComponent(location);
  // Use OpenStreetMap's export/embed endpoint — no API key required.
  return `https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=mapnik&marker=0%2C0&query=${encoded}`;
}

// Better approach: use a search-based embed that actually centres on the address
function buildNominatimEmbedUrl(location: string): string {
  // openstreetmap.org/search with an iframe-friendly format
  const q = encodeURIComponent(location);
  return `https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=mapnik&query=${q}`;
}

// ─── Sub-components ───────────────────────────────────────────

/** Top banner: title, status badge, address, price */
function DynamicBanner({ property }: { property: Property }) {
  const monthly =
    property.status === "For Rent"
      ? property.price
      : Math.round(property.price * 0.005);

  return (
    <div className="row">
      <div className="col-lg-6">
        <h3 className="property-titlee">{property.title}</h3>
        <div className="d-flex flex-wrap mt-10">
          <div className="list-type text-uppercase mt-15 me-3 bg-white text-dark fw-500">
            {getStatusLabel(property.status)}
          </div>
          <div className="address mt-15">
            <i className="bi bi-geo-alt"></i> {property.location}
          </div>
        </div>
      </div>
      <div className="col-lg-6 text-lg-end">
        <div className="d-inline-block md-mt-40">
          <div className="price color-dark fw-500">
            Price: {formatPrice(property.price, property.status)}
          </div>
          {property.status !== "For Rent" && (
            <div className="est-price fs-20 mt-25 mb-35 md-mb-30">
              Est. Payment{" "}
              <span className="fw-500 color-dark">
                ${monthly.toLocaleString()}/mo*
              </span>
            </div>
          )}
          <ul className="style-none d-flex align-items-center action-btns">
            <li className="me-auto fw-500 color-dark">
              <i className="fa-sharp fa-regular fa-share-nodes me-2"></i>Share
            </li>
            <li>
              <Link
                to="#"
                className="d-flex align-items-center justify-content-center tran3s"
              >
                <i className="fa-light fa-heart"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="d-flex align-items-center justify-content-center tran3s"
              >
                <i className="fa-light fa-bookmark"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="d-flex align-items-center justify-content-center tran3s"
              >
                <i className="fa-light fa-circle-plus"></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Image gallery slider */
function DynamicMediaGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const sliderRef = useRef<Slider | null>(null);
  const fallback = ["/assets/images/listing/img_57.jpg"];
  const imgs = images && images.length > 0 ? images : fallback;

  const setting = {
    dots: false,
    arrows: false,
    centerPadding: "0px",
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="media-gallery position-relative mt-100 xl-mt-80 lg-mt-60">
      <Slider {...setting} ref={sliderRef} className="media-slider-two">
        {imgs.map((src, i) => (
          <div key={i} className="item">
            <img
              src={src}
              alt={`${title} — image ${i + 1}`}
              className="w-100"
              style={{ maxHeight: "520px", objectFit: "cover" }}
            />
          </div>
        ))}
      </Slider>
      <ul className="slider-arrows d-flex justify-content-between style-none">
        <li
          onClick={() => sliderRef.current?.slickPrev()}
          className="prev_c slick-arrow"
        >
          <i className="bi bi-arrow-left"></i>
        </li>
        <li
          onClick={() => sliderRef.current?.slickNext()}
          className="next_c slick-arrow"
        >
          <i className="bi bi-arrow-right"></i>
        </li>
      </ul>
    </div>
  );
}

/** Dark bar with sqft / bed / bath / kitchen icons */
function DynamicPropertyOverview({ property }: { property: Property }) {
  const items = [
    {
      icon: "/assets/images/icon/icon_58.svg",
      label: `Sqft . ${property.sqft?.toLocaleString() ?? "N/A"}`,
    },
    {
      icon: "/assets/images/icon/icon_59.svg",
      label: `Bed . ${String(property.bedrooms ?? 0).padStart(2, "0")}`,
    },
    {
      icon: "/assets/images/icon/icon_60.svg",
      label: `Bath . ${String(property.bathrooms ?? 0).padStart(2, "0")}`,
    },
    {
      icon: "/assets/images/icon/icon_61.svg",
      label: `Kitchen . ${String(property.kitchens ?? 0).padStart(2, "0")}`,
    },
  ];

  return (
    <div className="property-feature-list position-relative z-2 pb-65">
      <div className="row">
        <div className="col-xl-8">
          <div className="dark-bg ps-5 pe-5 pt-25 pb-25 m-inverse">
            <ul className="style-none d-flex flex-wrap align-items-center justify-content-between">
              {items.map((item, i) => (
                <li key={i}>
                  <img src={item.icon} alt="" className="lazy-img icon sm" />
                  <span className="fs-20 text-white">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Property details accordion — pulls from property_details + utility_features + outdoor_features */
function DynamicPropertyFeatureList({ property }: { property: Property }) {
  const [openSection, setOpenSection] = useState<number>(0);

  const sections = [
    {
      id: 1,
      title: "Property Details",
      data: property.property_details ?? {},
    },
    {
      id: 2,
      title: "Utility & Home Features",
      data: property.utility_features ?? {},
    },
    {
      id: 3,
      title: "Outdoor Features",
      data: property.outdoor_features ?? {},
    },
  ];

  const formatKey = (k: string) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="accordion" id="accordionTwo">
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
                  <div className="feature-list-two">
                    <ul className="style-none d-flex flex-wrap justify-content-between">
                      {entries.map(([k, v]) => (
                        <li key={k}>
                          <span>{formatKey(k)} </span>
                          <span className="fw-500 color-dark">{v}</span>
                        </li>
                      ))}
                    </ul>
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

/** Amenities list */
function DynamicAmenities({ amenities }: { amenities: string[] }) {
  if (!amenities || amenities.length === 0) return null;
  return (
    <>
      <h4 className="mb-20">Amenities</h4>
      <p className="fs-20 lh-lg pb-25">
        This property comes with the following amenities included.
      </p>
      <ul className="style-none d-flex flex-wrap justify-content-between list-style-two">
        {amenities.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </>
  );
}

/** Floor plans slider — uses real floor_plans images if available, else placeholder */
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
    <div className="property-floor-plan bottom-line-dark pb-40 mb-60">
      <h4 className="mb-40">Floor Plans</h4>
      <div className="bg-dot p-30">
        <Slider {...settings} className="carousel-inner">
          {images.map((src, i) => (
            <div key={i} className="carousel-item active">
              <img src={src} alt={`Floor plan ${i + 1}`} className="w-100" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

/** What's Nearby list */
function DynamicNearbyList({
  nearby,
}: {
  nearby: Record<string, string> | null;
}) {
  if (!nearby) return null;

  const labelMap: Record<string, string> = {
    school: "School & College:",
    grocery: "Grocery Center:",
    metro: "Metro Station:",
    gym: "Gym:",
    university: "University:",
    hospital: "Hospital:",
    mall: "Shopping Mall:",
    police: "Police Station:",
    bus: "Bus Station:",
    river: "River:",
    market: "Market:",
    park: "Park:",
    restaurant: "Restaurant:",
    pharmacy: "Pharmacy:",
    airport: "Airport:",
  };

  const entries = Object.entries(nearby).filter(
    ([, v]) => v && String(v).trim() !== "",
  );

  return (
    <>
      <h4 className="mb-20">What&apos;s Nearby</h4>
      <p className="fs-20 lh-lg pb-30">
        Distances from this property to key local amenities and services.
      </p>
      <ul className="style-none d-flex flex-wrap justify-content-between nearby-list-item">
        {entries.map(([k, v]) => (
          <li key={k}>
            {labelMap[k] ?? `${k.replace(/_/g, " ")}:`}
            <span className="fw-500 color-dark"> {v}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Walk score — computed from nearby distances */
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

  const transit = Math.round(
    (distanceScore(nearby.metro ?? "99") + distanceScore(nearby.bus ?? "99")) /
      2,
  );
  const school = Math.round(
    (distanceScore(nearby.school ?? "99") +
      distanceScore(nearby.university ?? "99")) /
      2,
  );
  const medical = Math.round(
    (distanceScore(nearby.hospital ?? "99") +
      distanceScore(nearby.pharmacy ?? "99")) /
      2,
  );
  const shopping = Math.round(
    (distanceScore(nearby.mall ?? "99") +
      distanceScore(nearby.grocery ?? "99")) /
      2,
  );

  function label(score: number): string {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 50) return "Good";
    if (score >= 30) return "Fair";
    return "Limited";
  }

  const scores = [
    {
      icon: "/assets/images/icon/icon_52.svg",
      title: "Transit Score",
      value: transit,
    },
    {
      icon: "/assets/images/icon/icon_53.svg",
      title: "School Score",
      value: school,
    },
    {
      icon: "/assets/images/icon/icon_54.svg",
      title: "Medical Score",
      value: medical,
    },
    {
      icon: "/assets/images/icon/icon_55.svg",
      title: "Shopping Score",
      value: shopping,
    },
  ];

  return (
    <>
      <h4 className="mb-20">Walk Score</h4>
      <p className="fs-20 lh-lg pb-30">
        Scores are calculated based on walking distance to nearby amenities.
      </p>
      <div className="row">
        {scores.map((item, i) => (
          <div key={i} className="col-md-6">
            <div className="block d-flex align-items-center mb-50 sm-mb-30">
              <img src={item.icon} alt="" className="lazy-img icon" />
              <div className="text">
                <h6>{item.title}</h6>
                <p className="fs-16 m0">
                  <span className="color-dark">{item.value}</span>/100 (
                  {label(item.value)})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/** Free OpenStreetMap embed — no API key needed */
function DynamicLocation({ location }: { location: string }) {
  // Use the OSM search embed — works without any API key
  const q = encodeURIComponent(location);
  const src = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&query=${q}&marker=0%2C0`;

  return (
    <>
      <h4 className="mb-40">Location</h4>
      <div className="bg-white shadow4 border-20 p-30">
        <div className="map-banner overflow-hidden border-15">
          <div className="gmap_canvas h-100 w-100">
            <iframe
              title={`Map for ${location}`}
              src={src}
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-100 h-100"
            />
          </div>
        </div>
        <p className="mt-20 fs-14 color-muted text-center">
          <i className="bi bi-geo-alt me-1"></i>
          {location} —{" "}
          <a
            href={`https://www.openstreetmap.org/search?query=${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="color-dark"
          >
            Open in OpenStreetMap ↗
          </a>
        </p>
      </div>
    </>
  );
}

/** Similar properties — fetches a few from Supabase excluding current */
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

      // If not enough of same type, fetch any
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

  const setting = {
    dots: true,
    arrows: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  return (
    <div className="similar-property bottom-line-dark pb-20 mb-60">
      <h4 className="mb-40">Similar Homes You May Like</h4>
      <Slider {...setting} className="similar-listing-slider-two">
        {similar.map((item) => (
          <div key={item.id} className="item">
            <div className="listing-card-one shadow-none style-two mb-50">
              <div className="img-gallery">
                <div className="position-relative overflow-hidden">
                  <div className="tag bg-white text-dark fw-500">
                    {getStatusLabel(item.status)}
                  </div>
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-100"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "200px",
                        background: "#2a2a2a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "3rem",
                      }}
                    >
                      🏠
                    </div>
                  )}
                </div>
              </div>
              <div className="property-info d-flex justify-content-between align-items-end pt-20">
                <div>
                  <strong className="price fw-500 color-dark fs-16">
                    {formatPrice(item.price, item.status)}
                  </strong>
                  <div className="address m0 fs-14">{item.location}</div>
                  <div className="fs-14 color-muted mt-5">
                    {item.bedrooms != null && `${item.bedrooms} bed`}
                    {item.bathrooms != null && ` · ${item.bathrooms} bath`}
                    {item.sqft != null &&
                      ` · ${item.sqft.toLocaleString()} sqft`}
                  </div>
                </div>
                <Link
                  to={`/listing_details_01/${item.id}`}
                  className="btn-four mb-5"
                >
                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

/** Agent sidebar card */
function AgentSidebar({
  agent,
}: {
  agent: Record<string, string> | null | undefined;
}) {
  if (!agent) return null;
  return (
    <div className="agent-info bg-white shadow4 border-20 p-30 mb-40">
      <div className="d-flex align-items-center mb-20">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e84545 0%, #222 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.6rem",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {agent.name ? agent.name[0] : "A"}
        </div>
        <div className="ms-3">
          <h6 className="mb-0">{agent.name}</h6>
          <span className="fs-14 color-muted">{agent.title}</span>
        </div>
      </div>
      <ul className="style-none fs-15">
        {agent.phone && (
          <li className="mb-10">
            <i className="bi bi-telephone me-2 color-dark"></i>
            <a href={`tel:${agent.phone}`} className="color-dark">
              {agent.phone}
            </a>
          </li>
        )}
        {agent.email && (
          <li className="mb-10">
            <i className="bi bi-envelope me-2 color-dark"></i>
            <a href={`mailto:${agent.email}`} className="color-dark">
              {agent.email}
            </a>
          </li>
        )}
        {agent.location && (
          <li>
            <i className="bi bi-geo-alt me-2 color-dark"></i>
            {agent.location}
          </li>
        )}
      </ul>
      <a
        href={`mailto:${agent.email ?? ""}`}
        className="btn-four w-100 mt-25 text-center d-block"
      >
        Contact Agent
      </a>
    </div>
  );
}

/** Price & quick facts sidebar */
function PriceSidebar({ property }: { property: Property }) {
  return (
    <div className="bg-white shadow4 border-20 p-30 mb-40">
      <div className="price color-dark fw-500 fs-24 mb-10">
        {formatPrice(property.price, property.status)}
      </div>
      <ul className="style-none fs-15">
        <li className="d-flex justify-content-between border-bottom pb-10 mb-10">
          <span>Type</span>
          <span className="fw-500 color-dark">{property.property_type}</span>
        </li>
        <li className="d-flex justify-content-between border-bottom pb-10 mb-10">
          <span>Status</span>
          <span className="fw-500 color-dark">{property.status}</span>
        </li>
        {property.sqft && (
          <li className="d-flex justify-content-between border-bottom pb-10 mb-10">
            <span>Area</span>
            <span className="fw-500 color-dark">
              {property.sqft.toLocaleString()} sqft
            </span>
          </li>
        )}
        {property.bedrooms != null && (
          <li className="d-flex justify-content-between border-bottom pb-10 mb-10">
            <span>Bedrooms</span>
            <span className="fw-500 color-dark">{property.bedrooms}</span>
          </li>
        )}
        {property.bathrooms != null && (
          <li className="d-flex justify-content-between border-bottom pb-10 mb-10">
            <span>Bathrooms</span>
            <span className="fw-500 color-dark">{property.bathrooms}</span>
          </li>
        )}
        {property.property_details?.year_built && (
          <li className="d-flex justify-content-between border-bottom pb-10 mb-10">
            <span>Year Built</span>
            <span className="fw-500 color-dark">
              {property.property_details.year_built}
            </span>
          </li>
        )}
        {property.property_details?.furnishing && (
          <li className="d-flex justify-content-between">
            <span>Furnishing</span>
            <span className="fw-500 color-dark">
              {property.property_details.furnishing}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const ListingDetailsFourArea = () => {
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
        className="text-center py-5"
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
          style={{ width: "2.5rem", height: "2.5rem" }}
        />
        <p className="mt-3 color-dark">Loading property details…</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div
        className="text-center py-5"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: "3rem" }}>⚠️</div>
        <p className="mt-3 color-dark fs-18">{error || "Property not found"}</p>
        <Link to="/listing_13" className="btn-four mt-3">
          Back to Listings
        </Link>
      </div>
    );
  }

  // Resolve agent — data may be in `agent` or `agent_info`
  const agent = property.agent ?? property.agent_info ?? null;

  return (
    <div className="listing-details-one theme-details-one border-top lg-mt-100 pt-70 pb-150 xl-pb-120">
      <div className="container">
        {/* Banner */}
        <DynamicBanner property={property} />

        {/* Media gallery */}
        <DynamicMediaGallery
          images={property.images || []}
          title={property.title}
        />

        {/* Sqft / bed / bath / kitchen bar */}
        <DynamicPropertyOverview property={property} />

        <div className="row">
          {/* ── Left column ── */}
          <div className="col-xl-8">
            {/* Overview */}
            {property.description && (
              <div className="property-overview bottom-line-dark pb-40 mb-60">
                <h4 className="mb-20">Overview</h4>
                <p className="fs-20 lh-lg">{property.description}</p>
              </div>
            )}

            {/* Property Features accordion */}
            <div className="property-feature-accordion bottom-line-dark pb-40 mb-60">
              <h4 className="mb-20">Property Features</h4>
              {property.features_description && (
                <p className="fs-20 lh-lg">{property.features_description}</p>
              )}
              <div className="accordion-style-two mt-45">
                <DynamicPropertyFeatureList property={property} />
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="property-amenities bottom-line-dark pb-40 mb-60">
                <DynamicAmenities amenities={property.amenities} />
              </div>
            )}

            {/* Floor plan */}
            <DynamicFloorPlan floorPlans={property.floor_plans || []} />

            {/* What's Nearby */}
            {property.whats_nearby && (
              <div className="property-nearby bottom-line-dark pb-40 mb-60">
                <DynamicNearbyList nearby={property.whats_nearby} />
              </div>
            )}

            {/* Similar Properties */}
            <SimilarProperties
              currentId={property.id}
              propertyType={property.property_type}
            />

            {/* Walk Score */}
            {property.whats_nearby && (
              <div className="property-score bottom-line-dark pb-40 mb-60">
                <DynamicWalkScore nearby={property.whats_nearby} />
              </div>
            )}

            {/* Location / Map */}
            <div className="property-location bottom-line-dark pb-60 mb-60">
              <DynamicLocation location={property.location} />
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="col-xl-4">
            <div className="ps-xl-4 sticky-top" style={{ top: "100px" }}>
              <PriceSidebar property={property} />
              <AgentSidebar agent={agent as Record<string, string> | null} />

              {/* Quick contact form */}
              <div className="bg-white shadow4 border-20 p-30">
                <h6 className="mb-20">Send a Message</h6>
                <div className="mb-15">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    style={{ padding: "10px 14px", borderRadius: "8px" }}
                  />
                </div>
                <div className="mb-15">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    style={{ padding: "10px 14px", borderRadius: "8px" }}
                  />
                </div>
                <div className="mb-15">
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="I'm interested in this property…"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      resize: "none",
                    }}
                    defaultValue={`Hi, I'm interested in "${property.title}" at ${property.location}. Please get in touch.`}
                  />
                </div>
                <button
                  className="btn-four w-100"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                  onClick={() => {
                    if (agent?.email) {
                      window.location.href = `mailto:${agent.email}?subject=Enquiry: ${encodeURIComponent(property.title)}`;
                    }
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsFourArea;

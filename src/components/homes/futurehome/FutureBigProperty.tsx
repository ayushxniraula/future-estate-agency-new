// ============================================================
//  FutureBigProperty.tsx — Featured Listings (Supabase-powered)
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Replaces all dummy data with live Supabase properties
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Property {
  id: string;
  title: string;
  status: string;
  price: number;
  location: string;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  kitchens: number | null;
  images: string[];
  property_type: string;
}

const BIG_PROPERTY_STYLES = `
  .fw-big-prop {
    position: relative;
    z-index: 1;
    margin-top: 170px;
  }
  @media (max-width: 1199px) { .fw-big-prop { margin-top: 120px; } }
  @media (max-width: 767px) { .fw-big-prop { margin-top: 80px; } }

  .fw-big-prop .title-one h2 { color: #252060; }
  .fw-big-prop .title-one h2 em { color: #1C94A4; font-style: italic; }
  .fw-big-prop .title-one p { color: #6b7191; }

  /* Main large card */
  .fw-listing-main {
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    min-height: 420px;
    background: #252060;
    display: flex;
    flex-direction: column;
    height: 100%;
    cursor: pointer;
  }
  @media (max-width: 767px) { .fw-listing-main { min-height: 320px; } }

  .fw-listing-main__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.6s ease;
  }
  .fw-listing-main:hover .fw-listing-main__bg {
    transform: scale(1.04);
  }
  .fw-listing-main__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(37,32,96,0.92) 0%,
      rgba(37,32,96,0.4) 50%,
      rgba(37,32,96,0.1) 100%
    );
  }
  .fw-listing-main__inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
  }
  .fw-listing-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    background: rgba(28,148,164,0.9);
    color: #fff;
    align-self: flex-start;
    backdrop-filter: blur(4px);
  }
  .fw-listing-main__footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 16px;
  }
  .fw-listing-main__title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    color: #fff;
    margin-bottom: 8px;
    font-weight: 400;
    line-height: 1.25;
  }
  .fw-listing-main__addr {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0;
  }

  /* Feature pills inside main card */
  .fw-listing-main__feats {
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .fw-listing-main__feats li {
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 5px 12px;
    font-size: 12px;
    color: #fff;
    font-weight: 500;
  }
  .fw-listing-main__feats li span { font-weight: 700; margin-right: 3px; }

  /* Action icons */
  .fw-listing-actions {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 8px;
  }
  .fw-listing-actions li a {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 13px;
    transition: all 0.2s;
    text-decoration: none;
  }
  .fw-listing-actions li a:hover {
    background: #1C94A4;
    border-color: #1C94A4;
  }

  .fw-details-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 20px;
    border-radius: 10px;
    background: #1C94A4;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }
  .fw-details-btn:hover {
    background: #fff;
    color: #252060;
    gap: 12px;
  }
  .fw-details-btn i { font-size: 11px; }

  /* Small cards (right column) */
  .fw-listing-sm {
    border-radius: 18px;
    overflow: hidden;
    position: relative;
    min-height: 190px;
    background: #252060;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }
  .fw-listing-sm__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease;
  }
  .fw-listing-sm:hover .fw-listing-sm__bg { transform: scale(1.06); }
  .fw-listing-sm__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(37,32,96,0.88) 0%, rgba(37,32,96,0.2) 60%);
  }
  .fw-listing-sm__inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 14px 16px;
  }
  .fw-listing-sm__footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .fw-listing-sm__title {
    font-size: 1rem;
    color: #fff;
    font-weight: 600;
    margin-bottom: 4px;
    line-height: 1.3;
  }
  .fw-listing-sm__addr {
    font-size: 12px;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }
  .fw-listing-sm__arrow {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: #1C94A4;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    text-decoration: none;
    font-size: 13px;
    transition: all 0.25s;
    flex-shrink: 0;
  }
  .fw-listing-sm__arrow:hover {
    background: #fff;
    color: #252060;
    transform: rotate(45deg);
  }

  /* Price badge on small cards */
  .fw-listing-sm__price {
    font-size: 12.5px;
    font-weight: 700;
    color: #fff;
    background: rgba(28,148,164,0.85);
    padding: 2px 9px;
    border-radius: 12px;
    white-space: nowrap;
  }

  /* Section CTA */
  .fw-section-cta {
    text-align: center;
    margin-top: 56px;
  }
  .fw-section-cta a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    border-radius: 12px;
    border: 2px solid #252060;
    color: #252060;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s;
    letter-spacing: 0.3px;
  }
  .fw-section-cta a:hover {
    background: #252060;
    color: #fff;
    gap: 14px;
  }

  /* Skeleton loader */
  .fw-skel {
    background: linear-gradient(90deg, #eef0f8 25%, #f5f7fd 50%, #eef0f8 75%);
    background-size: 200% 100%;
    animation: fw-shimmer 1.4s infinite;
    border-radius: 18px;
  }
  @keyframes fw-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function injectBigPropStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-big-prop-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-big-prop-styles";
    el.textContent = BIG_PROPERTY_STYLES;
    document.head.appendChild(el);
  }
}

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `Rs. ${(price / 10_000_000).toFixed(1)} Cr`;
  if (price >= 100_000) return `Rs. ${(price / 100_000).toFixed(0)} L`;
  return `Rs. ${price.toLocaleString("en-IN")}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "For Sale":
      return "rgba(28,148,164,0.9)";
    case "For Rent":
      return "rgba(37,32,96,0.85)";
    case "Sold":
      return "rgba(76,175,80,0.9)";
    default:
      return "rgba(37,32,96,0.8)";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "For Sale":
      return "For Sale";
    case "For Rent":
      return "For Rent";
    case "Sold":
      return "Sold";
    default:
      return status;
  }
}

// ─── Fallback placeholder image ───────────────────────────────
const PLACEHOLDER_BG = "linear-gradient(135deg, #252060, #1C94A4)";

const FutureBigProperty = () => {
  injectBigPropStyles();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("properties")
          .select(
            "id, title, status, price, location, sqft, bedrooms, bathrooms, kitchens, images, property_type",
          )
          .order("created_at", { ascending: false })
          .limit(3);
        if (data && data.length > 0) setProperties(data);
      } catch (e) {
        console.error("FutureBigProperty: fetch error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mainProp = properties[0];
  const sideProp1 = properties[1];
  const sideProp2 = properties[2];

  const mainBg = mainProp?.images?.[0]
    ? `url(${mainProp.images[0]})`
    : PLACEHOLDER_BG;
  const side1Bg = sideProp1?.images?.[0]
    ? `url(${sideProp1.images[0]})`
    : PLACEHOLDER_BG;
  const side2Bg = sideProp2?.images?.[0]
    ? `url(${sideProp2.images[0]})`
    : PLACEHOLDER_BG;

  return (
    <div className="fw-big-prop property-listing-three position-relative z-1">
      <div className="container container-lrge">
        <div className="position-relative">
          {/* Heading */}
          <div className="title-one mb-50 lg-mb-40">
            <h2 className="font-garamond star-shape">
              Featured <em>Listings</em>{" "}
              <span className="star-shape">
                <img
                  src="/assets/images/shape/shape_37.svg"
                  alt=""
                  className="lazy-img"
                />
              </span>
            </h2>
            <p className="fs-22 m0">
              Explore Nepal's most sought-after properties.
            </p>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="row gx-xxl-5">
              <div className="col-lg-8 d-flex mb-4">
                <div className="fw-skel w-100" style={{ minHeight: "420px" }} />
              </div>
              <div className="col-lg-4 d-flex">
                <div className="w-100">
                  <div className="fw-skel mb-3" style={{ height: "195px" }} />
                  <div className="fw-skel" style={{ height: "195px" }} />
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && (
            <div className="row gx-xxl-5 gx-3">
              {/* ── Main large card ── */}
              <div className="col-lg-8 d-flex mb-4 mb-lg-0">
                <div className="fw-listing-main w-100">
                  <div
                    className="fw-listing-main__bg"
                    style={{ backgroundImage: mainBg }}
                  />
                  <div className="fw-listing-main__overlay" />
                  <div className="fw-listing-main__inner">
                    {/* Tag */}
                    <span
                      className="fw-listing-tag"
                      style={{
                        background: mainProp
                          ? getStatusColor(mainProp.status)
                          : "rgba(28,148,164,0.9)",
                      }}
                    >
                      {mainProp ? getStatusLabel(mainProp.status) : "Featured"}
                    </span>

                    {/* Footer info */}
                    <div className="fw-listing-main__footer">
                      <div>
                        <h5 className="fw-listing-main__title">
                          {mainProp?.title ?? "Premium Property"}
                        </h5>
                        <p className="fw-listing-main__addr">
                          <svg
                            width="10"
                            height="12"
                            viewBox="0 0 10 12"
                            fill="none"
                          >
                            <path
                              d="M5 0C2.8 0 1 1.8 1 4c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                              fill="rgba(255,255,255,0.7)"
                            />
                          </svg>
                          {mainProp?.location ?? "Kathmandu, Nepal"}
                        </p>

                        {/* Feature tags */}
                        {mainProp && (
                          <ul className="fw-listing-main__feats">
                            {mainProp.sqft && (
                              <li>
                                <span>{mainProp.sqft.toLocaleString()}</span>{" "}
                                sqft
                              </li>
                            )}
                            {mainProp.bedrooms != null && (
                              <li>
                                <span>{mainProp.bedrooms}</span> bed
                              </li>
                            )}
                            {mainProp.kitchens != null && (
                              <li>
                                <span>{mainProp.kitchens}</span> kitchen
                              </li>
                            )}
                            {mainProp.bathrooms != null && (
                              <li>
                                <span>{mainProp.bathrooms}</span> bath
                              </li>
                            )}
                          </ul>
                        )}
                      </div>

                      <div>
                        <ul className="fw-listing-actions mb-3">
                          {["heart", "bookmark", "circle-plus"].map((icon) => (
                            <li key={icon}>
                              <Link to="#">
                                <i className={`fa-light fa-${icon}`} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {mainProp && (
                          <Link
                            to={`/buy/${mainProp.id}`}
                            className="fw-details-btn"
                          >
                            <span>Full Details</span>{" "}
                            <i className="bi bi-arrow-up-right" />
                          </Link>
                        )}
                        {mainProp && (
                          <div
                            style={{ marginTop: "10px", textAlign: "right" }}
                          >
                            <span
                              style={{
                                fontFamily:
                                  "'DM Serif Display', Georgia, serif",
                                fontSize: "1.4rem",
                                color: "#fff",
                                fontWeight: 400,
                              }}
                            >
                              {formatPrice(mainProp.price)}
                              {mainProp.status === "For Rent" && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.6)",
                                    fontFamily: "sans-serif",
                                  }}
                                >
                                  {" "}
                                  / month
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Two small cards ── */}
              <div className="col-lg-4 d-flex">
                <div className="w-100 h-100">
                  <div className="row h-100 gy-3">
                    {/* Small card 1 */}
                    <div className="col-lg-12 col-md-6">
                      <div className="fw-listing-sm">
                        <div
                          className="fw-listing-sm__bg"
                          style={{ backgroundImage: side1Bg }}
                        />
                        <div className="fw-listing-sm__overlay" />
                        <div className="fw-listing-sm__inner">
                          {sideProp1 && (
                            <span
                              className="fw-listing-tag"
                              style={{
                                background: getStatusColor(sideProp1.status),
                                fontSize: "9.5px",
                              }}
                            >
                              {getStatusLabel(sideProp1.status)}
                            </span>
                          )}
                          <div className="fw-listing-sm__footer">
                            <div>
                              <p className="fw-listing-sm__title">
                                {sideProp1?.title ?? "Modern Apartment"}
                              </p>
                              <p className="fw-listing-sm__addr">
                                {sideProp1?.location ?? "Lalitpur, Nepal"}
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: "8px",
                              }}
                            >
                              {sideProp1 && (
                                <span className="fw-listing-sm__price">
                                  {formatPrice(sideProp1.price)}
                                </span>
                              )}
                              <Link
                                to={sideProp1 ? `/buy/${sideProp1.id}` : "#"}
                                className="fw-listing-sm__arrow"
                              >
                                <i className="bi bi-arrow-up-right" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Small card 2 */}
                    <div className="col-lg-12 col-md-6">
                      <div className="fw-listing-sm">
                        <div
                          className="fw-listing-sm__bg"
                          style={{ backgroundImage: side2Bg }}
                        />
                        <div className="fw-listing-sm__overlay" />
                        <div className="fw-listing-sm__inner">
                          {sideProp2 && (
                            <span
                              className="fw-listing-tag"
                              style={{
                                background: getStatusColor(sideProp2.status),
                                fontSize: "9.5px",
                              }}
                            >
                              {getStatusLabel(sideProp2.status)}
                            </span>
                          )}
                          <div className="fw-listing-sm__footer">
                            <div>
                              <p className="fw-listing-sm__title">
                                {sideProp2?.title ?? "Duplex Villa"}
                              </p>
                              <p className="fw-listing-sm__addr">
                                {sideProp2?.location ?? "Bhaktapur, Nepal"}
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: "8px",
                              }}
                            >
                              {sideProp2 && (
                                <span className="fw-listing-sm__price">
                                  {formatPrice(sideProp2.price)}
                                </span>
                              )}
                              <Link
                                to={sideProp2 ? `/buy/${sideProp2.id}` : "#"}
                                className="fw-listing-sm__arrow"
                              >
                                <i className="bi bi-arrow-up-right" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {!loading && (
            <div className="fw-section-cta">
              <Link to="/buy">
                <span>Explore All Properties</span>{" "}
                <i className="bi bi-arrow-up-right" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FutureBigProperty;

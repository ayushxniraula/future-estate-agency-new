// ============================================================
//  FutureListingHero.tsx — New Listings Slider (Supabase-powered)
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Replaces dummy property_data with live Supabase fetch
// ============================================================

import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Fancybox from "../../common/Fancybox";

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

const LISTING_HERO_STYLES = `
  .fw-listing-hero {
    position: relative;
    z-index: 1;
    margin-top: 170px;
    padding-top: 80px;
    padding-bottom: 80px;
    overflow: hidden;
  }
  @media (max-width: 1199px) { .fw-listing-hero { margin-top: 120px; padding-top: 60px; padding-bottom: 60px; } }
  @media (max-width: 767px) { .fw-listing-hero { margin-top: 60px; padding-top: 44px; padding-bottom: 44px; } }

  /* Subtle tinted background */
  .fw-listing-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(37,32,96,0.04) 0%, rgba(28,148,164,0.06) 100%);
    pointer-events: none;
  }

  .fw-listing-hero .title-one h2 { color: #252060; }
  .fw-listing-hero .title-one h2 em { color: #1C94A4; font-style: italic; }
  .fw-listing-hero .title-one p { color: #6b7191; }

  /* Slider card */
  .fw-new-listing-card {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    border: 1.5px solid #eef0f8;
    margin-bottom: 8px;
    transition: box-shadow 0.28s, transform 0.28s;
  }
  .fw-new-listing-card:hover {
    box-shadow: 0 12px 44px rgba(37,32,96,0.13);
    transform: translateY(-4px);
  }

  /* Image wrap */
  .fw-nlc__img-wrap {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    margin: 12px 12px 0;
  }
  .fw-nlc__img-wrap img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    transition: transform 0.45s ease;
    border-radius: 12px;
  }
  .fw-new-listing-card:hover .fw-nlc__img-wrap img { transform: scale(1.05); }

  .fw-nlc__tag {
    position: absolute;
    top: 10px; left: 10px;
    padding: 3px 10px;
    border-radius: 16px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: rgba(37,32,96,0.9);
    color: #fff;
    z-index: 2;
    backdrop-filter: blur(4px);
  }
  .fw-nlc__tag.for-sale { background: rgba(28,148,164,0.9); }
  .fw-nlc__tag.for-rent { background: rgba(37,32,96,0.88); }

  .fw-nlc__arrow-btn {
    position: absolute;
    bottom: 10px; right: 10px;
    width: 34px; height: 34px;
    border-radius: 50%;
    background: #252060;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    text-decoration: none;
    z-index: 2;
    transition: all 0.25s;
  }
  .fw-nlc__arrow-btn:hover { background: #1C94A4; color: #fff; transform: rotate(45deg); }

  .fw-nlc__gallery-btn {
    position: absolute;
    bottom: 10px; left: 10px;
    background: rgba(37,32,96,0.75);
    color: #fff;
    border-radius: 8px;
    padding: 4px 9px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    z-index: 2;
    backdrop-filter: blur(4px);
    cursor: pointer;
  }

  /* Card body */
  .fw-nlc__body { padding: 16px 18px 0; }
  .fw-nlc__type {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: #1C94A4;
    margin-bottom: 5px;
  }
  .fw-nlc__title {
    font-size: 15.5px;
    font-weight: 600;
    color: #252060;
    text-decoration: none;
    display: block;
    line-height: 1.3;
    margin-bottom: 5px;
    transition: color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fw-nlc__title:hover { color: #1C94A4; }
  .fw-nlc__addr {
    font-size: 12.5px;
    color: #8a8e9e;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Feature row */
  .fw-nlc__feats {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding-top: 10px;
    border-top: 1px solid #eef0f8;
  }
  .fw-nlc__feats li {
    background: #f5f7fd;
    border-radius: 7px;
    padding: 4px 10px;
    font-size: 11.5px;
    color: #3a3f6a;
    font-weight: 500;
  }
  .fw-nlc__feats li strong { color: #252060; font-weight: 700; margin-right: 2px; }

  /* Footer */
  .fw-nlc__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px 16px;
  }
  .fw-nlc__price {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.2rem;
    color: #252060;
    font-weight: 400;
    letter-spacing: -0.3px;
  }
  .fw-nlc__price-sub {
    font-size: 11px;
    color: #8a8e9e;
    font-family: sans-serif;
  }

  .fw-nlc__actions {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 6px;
  }
  .fw-nlc__actions li a {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: #f5f7fd;
    border: 1px solid #eef0f8;
    display: flex; align-items: center; justify-content: center;
    color: #8a8e9e;
    font-size: 12px;
    text-decoration: none;
    transition: all 0.2s;
  }
  .fw-nlc__actions li a:hover { background: #252060; color: #fff; border-color: #252060; }

  /* Slider nav */
  .fw-slider-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 36px;
    list-style: none;
    padding: 0;
  }
  .fw-slider-nav li {
    width: 42px; height: 42px;
    border-radius: 50%;
    border: 1.5px solid #dde2f0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: #252060;
    transition: all 0.2s;
    background: #fff;
  }
  .fw-slider-nav li:hover {
    background: #252060;
    color: #fff;
    border-color: #252060;
  }

  .fw-see-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 13px 30px;
    border-radius: 12px;
    border: 2px solid #1C94A4;
    color: #1C94A4;
    font-size: 14px;
    font-weight: 600;
    font-style: italic;
    text-decoration: none;
    transition: all 0.25s;
    letter-spacing: 0.2px;
  }
  .fw-see-all-btn:hover {
    background: #1C94A4;
    color: #fff;
    gap: 13px;
  }

  /* Skeleton */
  .fw-skel-card {
    background: linear-gradient(90deg, #eef0f8 25%, #f5f7fd 50%, #eef0f8 75%);
    background-size: 200% 100%;
    animation: fw-shimmer 1.4s infinite;
    border-radius: 20px;
    height: 340px;
  }
  @keyframes fw-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function injectListingHeroStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-listing-hero-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-listing-hero-styles";
    el.textContent = LISTING_HERO_STYLES;
    document.head.appendChild(el);
  }
}

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `Rs. ${(price / 10_000_000).toFixed(1)} Cr`;
  if (price >= 100_000) return `Rs. ${(price / 100_000).toFixed(0)} L`;
  return `Rs. ${price.toLocaleString("en-IN")}`;
}

function getTagClass(status: string): string {
  if (status === "For Sale") return "for-sale";
  if (status === "For Rent") return "for-rent";
  return "";
}

function getTagLabel(status: string): string {
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

const sliderSettings = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  responsive: [
    { breakpoint: 1400, settings: { slidesToShow: 3 } },
    { breakpoint: 992, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

const FutureListingHero = ({ style }: { style?: boolean }) => {
  injectListingHeroStyles();

  const sliderRef = useRef<Slider | null>(null);
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
          .limit(12);
        if (data) setProperties(data);
      } catch (e) {
        console.error("FutureListingHero: fetch error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="fw-listing-hero property-listing-four position-relative z-1 overflow-hidden">
      <div className="container container-larg">
        <div className="position-relative z-1">
          {/* Heading */}
          <div className="title-one mb-50 lg-mb-30">
            <h2 className="font-garamond">
              New <em>Listings</em>{" "}
              <span className="star-shape">
                <img
                  src="/assets/images/shape/shape_37.svg"
                  alt=""
                  className="lazy-img"
                />
              </span>
            </h2>
            <p className="fs-22 m0">
              Explore the latest and featured properties for sale and rent
              across Nepal.
            </p>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="row gx-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                  <div className="fw-skel-card" />
                </div>
              ))}
            </div>
          )}

          {/* Slider */}
          {!loading && properties.length > 0 && (
            <Slider
              {...sliderSettings}
              ref={sliderRef}
              className={`listing-slider-one ${style ? "vw-100" : ""}`}
            >
              {properties.map((item) => (
                <div
                  key={item.id}
                  className="item"
                  style={{ padding: "0 10px" }}
                >
                  <div className="fw-new-listing-card mb-8">
                    {/* Image block */}
                    <div className="fw-nlc__img-wrap">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "200px",
                            background:
                              "linear-gradient(135deg, #252060, #1C94A4)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2.5rem",
                          }}
                        >
                          🏠
                        </div>
                      )}

                      {/* Tag */}
                      <span
                        className={`fw-nlc__tag ${getTagClass(item.status)}`}
                      >
                        {getTagLabel(item.status)}
                      </span>

                      {/* Arrow link */}
                      <Link
                        to={`/buy/${item.id}`}
                        className="fw-nlc__arrow-btn"
                      >
                        <i className="bi bi-arrow-up-right" />
                      </Link>

                      {/* Gallery count */}
                      {item.images && item.images.length > 1 && (
                        <Fancybox options={{ Carousel: { infinite: true } }}>
                          <span className="fw-nlc__gallery-btn">
                            {item.images.length}{" "}
                            <i className="fa-regular fa-image" />
                            {item.images.slice(1).map((img, idx) => (
                              <a
                                key={idx}
                                className="d-none"
                                data-fancybox={`gallery-${item.id}`}
                                href={img}
                              />
                            ))}
                          </span>
                        </Fancybox>
                      )}
                    </div>

                    {/* Body */}
                    <div className="fw-nlc__body">
                      {item.property_type && (
                        <div className="fw-nlc__type">{item.property_type}</div>
                      )}
                      <Link to={`/buy/${item.id}`} className="fw-nlc__title">
                        {item.title}
                      </Link>
                      <div className="fw-nlc__addr">
                        <svg
                          width="9"
                          height="11"
                          viewBox="0 0 9 11"
                          fill="none"
                        >
                          <path
                            d="M4.5 0C2.5 0 .9 1.6.9 3.6c0 2.7 3.6 7.4 3.6 7.4s3.6-4.7 3.6-7.4C8.1 1.6 6.5 0 4.5 0zm0 5a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z"
                            fill="#8a8e9e"
                          />
                        </svg>
                        {item.location}
                      </div>

                      {/* Features */}
                      {(item.sqft ||
                        item.bedrooms != null ||
                        item.bathrooms != null) && (
                        <ul className="fw-nlc__feats">
                          {item.sqft && (
                            <li>
                              <strong>{item.sqft.toLocaleString()}</strong> sqft
                            </li>
                          )}
                          {item.bedrooms != null && (
                            <li>
                              <strong>{item.bedrooms}</strong> bed
                            </li>
                          )}
                          {item.bathrooms != null && (
                            <li>
                              <strong>{item.bathrooms}</strong> bath
                            </li>
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="fw-nlc__footer">
                      <div>
                        <div className="fw-nlc__price">
                          {formatPrice(item.price)}
                        </div>
                        {item.status === "For Rent" && (
                          <div className="fw-nlc__price-sub">per month</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}

          {/* Empty state */}
          {!loading && properties.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: "2.8rem", marginBottom: "12px" }}>🏠</div>
              <p style={{ color: "#6b7191", fontSize: "15px" }}>
                No properties available at the moment.
              </p>
            </div>
          )}

          {/* CTA & slider nav */}
          <div className="text-center mt-4">
            <Link to="/buy" className="fw-see-all-btn">
              <span>See All Properties</span>
            </Link>
          </div>

          {!loading && properties.length > 0 && (
            <ul className="fw-slider-nav">
              <li onClick={() => sliderRef.current?.slickPrev()}>
                <i className="bi bi-arrow-left" />
              </li>
              <li onClick={() => sliderRef.current?.slickNext()}>
                <i className="bi bi-arrow-right" />
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Decorative shapes */}
      {!style && (
        <>
          <img
            src="/assets/images/shape/shape_38.svg"
            alt=""
            className="lazy-img shapes shape_01"
          />
          <img
            src="/assets/images/shape/shape_39.svg"
            alt=""
            className="lazy-img shapes shape_02"
          />
        </>
      )}
    </div>
  );
};

export default FutureListingHero;

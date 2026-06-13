import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Fancybox from "../../../components/common/Fancybox";

// ─── Supabase Client ──────────────────────────────────────────
const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Types ────────────────────────────────────────────────────
interface Property {
  id: string;
  title: string;
  status: string;
  price: number;
  location: string;
  images: string[];
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

// ─── Skeleton card ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="listing-card-one shadow-none style-two mb-40">
      <div
        style={{
          width: "100%",
          height: "160px",
          borderRadius: "10px",
          background:
            "linear-gradient(90deg, #f0ede8 25%, #e8e4df 50%, #f0ede8 75%)",
          backgroundSize: "200% 100%",
          animation: "offcanvas-shimmer 1.4s infinite",
        }}
      />
      <div className="property-info pt-20">
        <div
          style={{
            width: "60%",
            height: "14px",
            borderRadius: "6px",
            background: "#eee",
            marginBottom: "8px",
            animation: "offcanvas-shimmer 1.4s infinite",
          }}
        />
        <div
          style={{
            width: "40%",
            height: "12px",
            borderRadius: "6px",
            background: "#f4f4f4",
            animation: "offcanvas-shimmer 1.4s infinite",
          }}
        />
      </div>
    </div>
  );
}

// ─── Offcanvas ───────────────────────────────────────────────
const Offcanvas = ({ offCanvas, setOffCanvas }: any) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch only when panel opens — avoids unnecessary calls
  useEffect(() => {
    if (!offCanvas) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: sbError } = await supabase
          .from("properties")
          .select("id, title, status, price, location, images")
          .order("created_at", { ascending: false })
          .limit(4);

        if (sbError) throw sbError;
        if (!cancelled) setProperties(data ?? []);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [offCanvas]);

  return (
    <>
      <style>{`
        @keyframes offcanvas-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .offcanvas-prop-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          border-radius: 10px;
        }
        .offcanvas-prop-img-placeholder {
          width: 100%;
          height: 160px;
          background: #f0ede8;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
      `}</style>

      <div
        className={`offcanvas offcanvas-end sidebar-nav ${offCanvas ? "show" : ""}`}
        id="sideNav"
      >
        <div className="offcanvas-header">
          <div className="logo order-lg-0">
            <Link to="/" className="d-flex align-items-center">
              <img src="/assets/images/logo/logo_02.svg" alt="" />
            </Link>
          </div>
          <button
            onClick={() => setOffCanvas(false)}
            type="button"
            className="btn-close"
            aria-label="Close"
          />
        </div>

        <div className="wrapper mt-60">
          <div className="d-flex flex-column h-100">
            {/* ── Featured Listings ── */}
            <div className="property-block">
              <h4 className="title pb-25">Featured Listings</h4>

              {/* Error state */}
              {error && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#c8402a",
                    marginBottom: "16px",
                  }}
                >
                  ⚠ {error}
                </p>
              )}

              <div className="row">
                {/* Loading skeletons */}
                {loading &&
                  [1, 2, 3, 4].map((n) => (
                    <div key={n} className="col-12">
                      <SkeletonCard />
                    </div>
                  ))}

                {/* Real data */}
                {!loading &&
                  properties.map((item) => {
                    const images = item.images ?? [];
                    const thumb = images[0] ?? null;

                    return (
                      <div key={item.id} className="col-12">
                        <div className="listing-card-one shadow-none style-two mb-40">
                          {/* Image gallery */}
                          <div className="img-gallery">
                            <div className="position-relative overflow-hidden">
                              <div className="tag bg-white text-dark fw-500">
                                {getStatusLabel(item.status)}
                              </div>

                              {thumb ? (
                                <img
                                  src={thumb}
                                  className="offcanvas-prop-img"
                                  alt={item.title}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="offcanvas-prop-img-placeholder">
                                  🏠
                                </div>
                              )}

                              {/* Fancybox trigger — only if there are images */}
                              {images.length > 0 && (
                                <div className="img-slider-btn">
                                  {String(images.length).padStart(2, "0")}{" "}
                                  <i className="fa-regular fa-image" />
                                  <Fancybox
                                    options={{ Carousel: { infinite: true } }}
                                  >
                                    {images.map((src, idx) => (
                                      <a
                                        key={idx}
                                        className="d-block"
                                        data-fancybox={`gallery-${item.id}`}
                                        href={src}
                                      />
                                    ))}
                                  </Fancybox>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price + address */}
                          <div className="property-info d-flex justify-content-between align-items-end pt-30">
                            <div>
                              <strong className="price fw-500 color-dark fs-3">
                                $
                                {item.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                                {item.status === "For Rent" && (
                                  <>
                                    {" "}
                                    / <sub>mo</sub>
                                  </>
                                )}
                              </strong>
                              <div className="address pt-5 m0">
                                {item.location}
                              </div>
                            </div>
                            <Link
                              to={`/buy/${item.id}`}
                              className="btn-four mb-5"
                            >
                              <i className="bi bi-arrow-up-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Empty state */}
                {!loading && !error && properties.length === 0 && (
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "#8a8785",
                      paddingLeft: "12px",
                    }}
                  >
                    No listings available right now.
                  </p>
                )}
              </div>
            </div>

            {/* ── Address block ── */}
            <div className="address-block mt-50">
              <h4 className="title pb-15">Our Address</h4>
              <p>
                Chowrastar Mirpur- 1210, Sangu <br />
                River, Dhaka
              </p>
              <p>
                Urgent issue? call us at <br />
                <Link to="tel:310.841.5500">310.841.5500</Link>
              </p>
            </div>

            {/* ── Social links ── */}
            <ul className="style-none d-flex flex-wrap w-100 justify-content-between align-items-center social-icon pt-25 mt-auto">
              <li>
                <Link to="#">
                  <i className="fa-brands fa-whatsapp" />
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i className="fa-brands fa-x-twitter" />
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i className="fa-brands fa-instagram" />
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i className="fa-brands fa-viber" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setOffCanvas(false)}
        className={`offcanvas-backdrop fade ${offCanvas ? "show" : ""}`}
      />
    </>
  );
};

export default Offcanvas;

// ============================================================
//  FutureHeroBanner.tsx — Hero with dynamic search dropdown
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Nepal real estate content in English
// ============================================================

import Slider from "react-slick";
import DropdownOne from "../../search-dropdown/home-dropdown/DropdownOne";

const setting = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  fade: true,
  autoplaySpeed: 7000,
};

const HERO_STYLES = `
  .fw-hero-banner {
    position: relative;
    z-index: 1;
    padding-top: 130px;
    padding-bottom: 170px;
    overflow: hidden;
  }
  @media (max-width: 991px) { .fw-hero-banner { padding-top: 90px; padding-bottom: 100px; } }
  @media (max-width: 575px) { .fw-hero-banner { padding-top: 70px; padding-bottom: 70px; } }

  .fw-hero-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(37,32,96,0.82) 0%, rgba(28,148,164,0.55) 100%);
    z-index: 1;
    pointer-events: none;
  }

  .fw-hero-heading {
    font-size: clamp(2.4rem, 5vw, 4.2rem);
    line-height: 1.13;
    color: #ffffff;
    text-align: center;
    text-shadow: 0 2px 24px rgba(37,32,96,0.35);
  }
  .fw-hero-heading em { color: #1C94A4; font-style: italic; }

  .fw-hero-sub {
    font-size: clamp(1rem, 2vw, 1.35rem);
    color: rgba(255,255,255,0.88);
    text-align: center;
    padding-top: 28px;
    padding-bottom: 50px;
    margin: 0;
    line-height: 1.6;
  }
  @media (max-width: 575px) { .fw-hero-sub { padding-top: 16px; padding-bottom: 32px; } }

  .fw-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(28,148,164,0.22);
    border: 1px solid rgba(28,148,164,0.5);
    border-radius: 30px;
    padding: 6px 18px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #a8e8f0;
    margin-bottom: 22px;
    backdrop-filter: blur(6px);
  }
  .fw-hero-badge span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #1C94A4;
    animation: fw-pulse 1.8s infinite;
    flex-shrink: 0;
  }
  @keyframes fw-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.5); }
  }

  .fw-hero-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 44px;
    position: relative;
    z-index: 2;
  }
  .fw-hero-stat {
    text-align: center;
    padding: 0 28px;
    color: #fff;
    border-right: 1px solid rgba(255,255,255,0.2);
  }
  .fw-hero-stat:last-child { border-right: none; }
  .fw-hero-stat-num { font-size: 1.9rem; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 4px; }
  .fw-hero-stat-num span { color: #1C94A4; }
  .fw-hero-stat-label { font-size: 11.5px; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.65); font-weight: 500; }
  @media (max-width: 575px) {
    .fw-hero-stat { padding: 10px 16px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.15); width: 50%; }
    .fw-hero-stat:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.15); }
    .fw-hero-stats { flex-direction: row; }
  }

  .fw-search-wrapper .bg-wrapper {
    background: rgba(255,255,255,0.97) !important;
    border-radius: 14px !important;
    box-shadow: 0 20px 60px rgba(37,32,96,0.22) !important;
    border: 1px solid rgba(28,148,164,0.15) !important;
    overflow: hidden;
  }
  .fw-search-wrapper .search-btn-three,
  .fw-search-wrapper .search-btn {
    background: #252060 !important;
    color: #fff !important;
  }
  .fw-search-wrapper .search-btn-three:hover,
  .fw-search-wrapper .search-btn:hover {
    background: #1C94A4 !important;
  }

  .fw-hero-shape { position: absolute; pointer-events: none; z-index: 0; }
  .fw-hero-shape-1 { top: -60px; right: -80px; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(circle, rgba(28,148,164,0.18) 0%, transparent 70%); }
  .fw-hero-shape-2 { bottom: -80px; left: -100px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(37,32,96,0.25) 0%, transparent 70%); }
`;

function injectHeroStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-hero-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-hero-styles";
    el.textContent = HERO_STYLES;
    document.head.appendChild(el);
  }
}

const FutureHeroBanner = () => {
  injectHeroStyles();

  return (
    <div className="fw-hero-banner hero-banner-three pt-130 lg-pt-100 pb-170 xl-pb-130 lg-pb-100">
      <Slider {...setting} className="hero-slider-one m0">
        <div className="item m0">
          <div
            className="hero-img"
            style={{ backgroundImage: `url(/assets/images/media/img_26.jpg)` }}
          />
        </div>
        <div className="item m0">
          <div
            className="hero-img"
            style={{ backgroundImage: `url(/assets/images/media/img_27.jpg)` }}
          />
        </div>
        <div className="item m0">
          <div
            className="hero-img"
            style={{ backgroundImage: `url(/assets/images/media/img_28.jpg)` }}
          />
        </div>
      </Slider>

      <div className="fw-hero-shape fw-hero-shape-1" />
      <div className="fw-hero-shape fw-hero-shape-2" />

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-10 m-auto text-center">
            <div className="fw-hero-badge">
              <span />
              Nepal's Trusted Real Estate Partner
            </div>

            <h1 className="fw-hero-heading font-garamond fw-500">
              Find Your <em>Dream Home</em>
              <br />
              Across Nepal
            </h1>

            <p className="fw-hero-sub">
              Browse 70,000+ residential and commercial properties across
              Kathmandu, Lalitpur, Bhaktapur, Pokhara and beyond.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-xxl-10 m-auto">
            <div className="fw-search-wrapper search-wrapper-one layout-one position-relative">
              <div className="bg-wrapper">
                <DropdownOne style={true} />
              </div>
            </div>
          </div>
        </div>

        <div className="fw-hero-stats">
          <div className="fw-hero-stat">
            <div className="fw-hero-stat-num">
              2,500<span>+</span>
            </div>
            <div className="fw-hero-stat-label">Homes for Sale</div>
          </div>
          <div className="fw-hero-stat">
            <div className="fw-hero-stat-num">
              2,000<span>+</span>
            </div>
            <div className="fw-hero-stat-label">Expert Agents</div>
          </div>
          <div className="fw-hero-stat">
            <div className="fw-hero-stat-num">
              3,600<span>+</span>
            </div>
            <div className="fw-hero-stat-label">Properties Sold</div>
          </div>
          <div className="fw-hero-stat">
            <div className="fw-hero-stat-num">
              200<span>+</span>
            </div>
            <div className="fw-hero-stat-label">Happy Clients</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureHeroBanner;

// ============================================================
//  FutureBannerOne.tsx — Nepal-focused presence banner
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Nepal map with 7 city pins + Nepal-specific location & region data
//  Structure, layout, and className identical to original
// ============================================================

import { Link } from "react-router-dom";

// ─── Nepal city pins ──────────────────────────────────────────
// Uses flag images that already exist in /assets/images/logo/
// Positions are approximate % offsets on the Nepal SVG map
interface LocationPin {
  id: number;
  flag: string;
  title: string;
  desc: string;
}

const location_data: LocationPin[] = [
  {
    id: 1,
    flag: "/assets/images/logo/flag_01.png",
    title: "Kathmandu",
    desc: "Baneshwor, Thamel & Baluwatar",
  },
  {
    id: 2,
    flag: "/assets/images/logo/flag_02.png",
    title: "Pokhara",
    desc: "Lakeside, Birauta & Newroad",
  },
  {
    id: 3,
    flag: "/assets/images/logo/flag_03.png",
    title: "Lalitpur",
    desc: "Patan, Sanepa & Ekantakuna",
  },
  {
    id: 4,
    flag: "/assets/images/logo/flag_04.png",
    title: "Bhaktapur",
    desc: "Suryabinayak, Thimi & Nagarkot Road",
  },
  {
    id: 5,
    flag: "/assets/images/logo/flag_05.png",
    title: "Chitwan",
    desc: "Bharatpur, Narayangadh & Sauraha",
  },
  {
    id: 6,
    flag: "/assets/images/logo/flag_06.png",
    title: "Biratnagar",
    desc: "Morang, Urlabari & Itahari Road",
  },
];

// ─── Nepal province & city grid ───────────────────────────────
interface RegionData {
  title: string;
  class_name?: string;
  country: string[];
}

const region_data: RegionData[] = [
  {
    title: "Bagmati Province",
    class_name: "d-flex flex-wrap",
    country: ["Kathmandu", "Lalitpur", "Bhaktapur", "Kirtipur", "Dhulikhel"],
  },
  {
    title: "Gandaki Province",
    country: ["Pokhara", "Besisahar", "Baglung", "Waling"],
  },
  {
    title: "Lumbini Province",
    class_name: "d-flex flex-wrap",
    country: ["Butwal", "Bhairahawa", "Tulsipur", "Nepalgunj", "Tansen"],
  },
  {
    title: "Province No. 1",
    country: ["Biratnagar", "Dharan", "Itahari", "Damak"],
  },
];

// ─── Brand styles injected once ───────────────────────────────
const BANNER_ONE_STYLES = `
  /* ── Overall banner ── */
  .fancy-banner-six .bg-wrapper {
    background: linear-gradient(135deg, #252060 0%, #1a1650 40%, #1C94A4 100%) !important;
    border-radius: 28px;
    overflow: hidden;
  }

  /* ── Heading ── */
  .fancy-banner-six .title-one h2 {
    color: #fff !important;
  }
  .fancy-banner-six .title-one h2 em {
    color: #7de3ef !important;
    font-style: italic;
  }
  .fancy-banner-six .title-one h2 em span {
    color: #fff !important;
    position: relative;
  }
  /* Underline decoration for "easily" */
  .fancy-banner-six .title-one h2 em span::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: -3px;
    height: 2px;
    background: rgba(255,255,255,0.4);
    border-radius: 2px;
  }

  /* ── Star shape recolour ── */
  .fancy-banner-six .star-shape img {
    filter: brightness(0) invert(1) opacity(0.5);
  }

  /* ── Map wrapper ── */
  .fancy-banner-six .map-wrapper {
    max-width: 820px;
  }
  .fancy-banner-six .map-wrapper img.w-100 {
    /* Tint the map to match theme */
    filter: invert(1) hue-rotate(180deg) brightness(0.6) saturate(0.5) opacity(0.55);
  }

  /* ── Location pins ── */
  .fancy-banner-six .location-pin {
    cursor: default;
  }

  /* Dot marker — teal brand */
  .fancy-banner-six .dot-marker {
    width: 12px !important;
    height: 12px !important;
    background: #1C94A4 !important;
    border: 2.5px solid #fff !important;
    box-shadow: 0 0 0 4px rgba(28,148,164,0.25) !important;
    animation: fw-pulse 2s infinite !important;
  }
  @keyframes fw-pulse {
    0%   { box-shadow: 0 0 0 4px rgba(28,148,164,0.3); }
    50%  { box-shadow: 0 0 0 8px rgba(28,148,164,0.12); }
    100% { box-shadow: 0 0 0 4px rgba(28,148,164,0.3); }
  }

  /* Map info card */
  .fancy-banner-six .map-info {
    background: rgba(255,255,255,0.97) !important;
    border: 1.5px solid rgba(28,148,164,0.25) !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 28px rgba(37,32,96,0.18) !important;
    padding: 10px 14px !important;
    min-width: 170px;
  }
  .fancy-banner-six .map-info .flag {
    width: 28px !important;
    height: 28px !important;
    border-radius: 50% !important;
    object-fit: cover !important;
    border: 2px solid #eef0f8 !important;
    flex-shrink: 0;
  }
  .fancy-banner-six .map-info .info {
    padding-left: 10px;
  }
  .fancy-banner-six .map-info .info h6 {
    font-size: 13px !important;
    font-weight: 700 !important;
    color: #252060 !important;
    margin: 0 0 2px !important;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .fancy-banner-six .map-info .info span {
    font-size: 11px !important;
    color: #1C94A4 !important;
    font-weight: 500;
  }

  /* ── Region / country list at bottom ── */
  .fancy-banner-six .country-list {
    gap: 0;
    flex-wrap: wrap;
  }
  .fancy-banner-six .country-list .list-block {
    border-color: rgba(255,255,255,0.15) !important;
    flex: 1 1 180px;
  }
  .fancy-banner-six .country-list .list-block .title {
    color: #7de3ef !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    font-family: 'DM Sans', system-ui, sans-serif;
    margin-bottom: 8px;
  }
  .fancy-banner-six .country-list .list-block ul li {
    color: rgba(255,255,255,0.78) !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    font-family: 'DM Sans', system-ui, sans-serif;
    padding: 2px 0;
  }
  .fancy-banner-six .country-list .list-block ul li::before {
    background: rgba(28,148,164,0.7) !important;
  }

  /* ── Marquee text strip ── */
  .fancy-banner-six .text-slide-wrapper .marquee p {
    color: rgba(255,255,255,0.18) !important;
    font-size: clamp(3rem, 8vw, 7rem) !important;
    font-family: 'DM Serif Display', Georgia, serif !important;
    letter-spacing: 0.05em;
  }

  /* ── Decorative shape recolour ── */
  .fancy-banner-six .shapes {
    filter: hue-rotate(180deg) saturate(0.5) opacity(0.3);
  }

  /* ── Mobile responsiveness ── */
  @media (max-width: 767px) {
    .fancy-banner-six .bg-wrapper {
      border-radius: 18px;
      padding-top: 44px !important;
      padding-bottom: 60px !important;
    }
    .fancy-banner-six .map-wrapper {
      margin-top: 40px !important;
      margin-bottom: 30px !important;
    }
    .fancy-banner-six .country-list .list-block {
      flex: 1 1 140px;
    }
    .fancy-banner-six .map-info {
      min-width: 140px;
      padding: 8px 10px !important;
    }
  }
`;

function injectBannerOneStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-banner-one-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-banner-one-styles";
    el.textContent = BANNER_ONE_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Component ────────────────────────────────────────────────
const FutureBannerOne = () => {
  injectBannerOneStyles();

  return (
    <div className="fancy-banner-six mt-160 xl-mt-140 lg-mt-100">
      <div className="container containe-large">
        <div className="bg-wrapper position-relative z-1 pt-85 md-pt-50 pb-140 md-pb-100 ps-4 pe-4">
          <div className="row">
            <div className="col-xl-7 col-lg-8 m-auto">
              <div className="title-one text-center pe-xxl-2 ps-xxl-2">
                <h2 className="font-garamond text-white">
                  Wherever you are in Nepal, we&apos;re right{" "}
                  <em>
                    there <span>with you</span>
                  </em>{" "}
                  <span className="star-shape">
                    <img
                      src="/assets/images/shape/shape_37.svg"
                      alt=""
                      className="lazy-img"
                    />
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* Nepal map */}
          <div className="map-wrapper position-relative me-auto ms-auto mt-100 xl-mt-50 mb-50">
            <img
              src="/assets/images/assets/map_01.svg"
              alt="Nepal map"
              className="lazy-img w-100"
            />

            {/* City pins */}
            {location_data.map((item) => (
              <div key={item.id} className="location-pin">
                <div className="dot-marker rounded-circle" />
                <div className="map-info tran3s d-flex">
                  <img
                    src={item.flag}
                    alt={item.title}
                    className="lazy-img flag"
                  />
                  <div className="info">
                    <h6>{item.title}</h6>
                    <span>{item.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nepal province grid */}
          <div className="country-list d-flex flex-wrap">
            {region_data.map((region, i) => (
              <div key={i} className="list-block">
                <div className="title">{region.title}</div>
                <ul className="style-none d-flex flex-wrap">
                  {region.country.map((city, idx) => (
                    <li key={idx}>{city}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Marquee strip — Nepal focused */}
          <div className="text-slide-wrapper">
            <div className="marquee">
              <p>Kathmandu . Pokhara . Chitwan .</p>
              <p>Kathmandu . Pokhara . Chitwan .</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureBannerOne;

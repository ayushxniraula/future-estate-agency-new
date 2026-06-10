// ============================================================
//  FutureBannerOne.tsx — Nepal-focused presence banner
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
// ============================================================

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
    filter: invert(1) hue-rotate(180deg) brightness(0.6) saturate(0.5) opacity(0.55);
  }

  /* ── Location pins ── */
  .fancy-banner-six .location-pin {
    cursor: default;
  }

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

  /* ── Region list ── */
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

  /* ── Marquee strip — redesigned ── */
  .fancy-banner-six .text-slide-wrapper {
    /* Dark frosted band with top + bottom borders */
    background: rgba(10, 9, 30, 0.55) !important;
    border-top: 1px solid rgba(28, 148, 164, 0.35) !important;
    border-bottom: 1px solid rgba(28, 148, 164, 0.35) !important;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    overflow: hidden;
    /* Fade edges on left/right */
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
    padding: 0 !important;
  }

  .fancy-banner-six .text-slide-wrapper .marquee {
    display: flex;
    align-items: center;
    padding: 14px 0 !important;
    gap: 0;
  }

  .fancy-banner-six .text-slide-wrapper .marquee p {
    /* Refined type treatment */
    color: rgba(255, 255, 255, 0.08) !important;
    font-size: clamp(2.6rem, 6vw, 5.8rem) !important;
    font-family: 'DM Serif Display', Georgia, serif !important;
    font-style: italic;
    letter-spacing: 0.06em;
    line-height: 1;
    white-space: nowrap;
    /* Stroke-only text effect */
    -webkit-text-stroke: 1px rgba(28, 148, 164, 0.45);
    text-stroke: 1px rgba(28, 148, 164, 0.45);
    /* Teal dots between city names rendered as content */
    padding-right: 2em;
  }

  /* Teal diamond separators between repeated tracks */
  .fancy-banner-six .text-slide-wrapper .marquee p::before {
    content: '◆ ';
    font-size: 0.38em;
    color: #1C94A4;
    opacity: 0.7;
    vertical-align: middle;
    margin-right: 0.6em;
    -webkit-text-stroke: 0;
    text-stroke: 0;
  }

  /* ── Decorative shapes ── */
  .fancy-banner-six .shapes {
    filter: hue-rotate(180deg) saturate(0.5) opacity(0.3);
  }

  /* ── Mobile ── */
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
    .fancy-banner-six .text-slide-wrapper .marquee p {
      font-size: clamp(2rem, 9vw, 3.5rem) !important;
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

          {/* Marquee strip */}
          <div className="text-slide-wrapper">
            <div className="marquee">
              <p>
                Kathmandu . Pokhara . Chitwan . Lalitpur . Bhaktapur . Pokhara
              </p>
              <p>
                Kathmandu . Pokhara . Chitwan . Lalitpur . Bhaktapur . Pokhara
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureBannerOne;

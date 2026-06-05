// ============================================================
//  CardStyleTwo.tsx — Stats card + feature cards grid
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Nepal-specific content, structure unchanged from original
// ============================================================

import Count from "./Count";

// ─── Nepal-specific feature data (replaces static import) ─────
// Mirrors the shape expected from feature_data filtered by
// "home_three_feature_2". Import from your FeatureData file or
// swap back in the original import if you prefer.
const nepal_feature_data = [
  {
    id: 1,
    page: "home_three_feature_2",
    icon: "/assets/images/icon/icon_04.svg",
    title: "Verified Listings Across Nepal",
    desc: "Every property on Future Work is field-verified by our local agents — from Kathmandu to Biratnagar — so you always get accurate details.",
  },
  {
    id: 2,
    page: "home_three_feature_2",
    icon: "/assets/images/icon/icon_05.svg",
    title: "Legal & Lalpurja Support",
    desc: "We guide buyers through Lalpurja checks, land registration, and municipality clearances so your transaction is fully compliant and stress-free.",
  },
  {
    id: 3,
    page: "home_three_feature_2",
    icon: "/assets/images/icon/icon_06.svg",
    title: "Trusted Local Agents",
    desc: "Our network of experienced Nepali real-estate agents brings deep local knowledge of pricing, neighbourhoods, and market trends in every province.",
  },
];

// ─── Brand styles ─────────────────────────────────────────────
const CARD_STYLE_TWO_STYLES = `
  /* ── Years experience card ── */
  .card-style-three .bg-wrapper {
    background: linear-gradient(145deg, #252060 0%, #1C94A4 100%) !important;
    border-radius: 20px;
    padding: 36px 28px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  /* Subtle inner glow */
  .card-style-three .bg-wrapper::after {
    content: '';
    position: absolute;
    top: -30%;
    right: -20%;
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    pointer-events: none;
  }
  .card-style-three .bg-wrapper h3 {
    color: #fff !important;
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2.4rem, 5vw, 3.4rem);
    font-weight: 400;
    line-height: 1;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
  }
  .card-style-three .bg-wrapper p {
    color: rgba(255,255,255,0.78) !important;
    font-size: 14px;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.5;
    position: relative;
    z-index: 1;
  }

  /* ── Feature cards ── */
  .card-style-four {
    background: #fff;
    border-radius: 18px;
    padding: 28px 24px;
    border: 1.5px solid #eef0f8;
    height: 100%;
    transition: box-shadow 0.26s ease, transform 0.26s ease, border-color 0.26s ease;
    position: relative;
    overflow: hidden;
  }
  .card-style-four::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #252060, #1C94A4);
    opacity: 0;
    transition: opacity 0.26s ease;
    border-radius: 18px 18px 0 0;
  }
  .card-style-four:hover {
    box-shadow: 0 10px 40px rgba(37,32,96,0.11);
    transform: translateY(-4px);
    border-color: rgba(28,148,164,0.2);
  }
  .card-style-four:hover::before { opacity: 1; }

  /* Icon circle */
  .card-style-four .icon.style-two {
    width: 60px !important;
    height: 60px !important;
    background: linear-gradient(135deg, rgba(37,32,96,0.08) 0%, rgba(28,148,164,0.12) 100%) !important;
    border: none !important;
    box-shadow: none !important;
    transition: background 0.26s ease;
  }
  .card-style-four:hover .icon.style-two {
    background: linear-gradient(135deg, #252060 0%, #1C94A4 100%) !important;
  }
  .card-style-four .icon.style-two img {
    width: 26px;
    height: 26px;
    filter: invert(13%) sepia(61%) saturate(900%) hue-rotate(215deg) brightness(60%);
    transition: filter 0.26s ease;
  }
  .card-style-four:hover .icon.style-two img {
    filter: brightness(0) invert(1);
  }

  /* Card heading */
  .card-style-four h5 {
    font-size: 16px !important;
    font-weight: 700 !important;
    color: #252060 !important;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1.3;
  }

  /* Card description */
  .card-style-four p {
    font-size: 13.5px !important;
    color: #6b7191 !important;
    line-height: 1.65 !important;
    font-family: 'DM Sans', system-ui, sans-serif;
    margin: 0;
  }

  /* ── Mobile responsiveness ── */
  @media (max-width: 991px) {
    .card-style-three .bg-wrapper {
      margin-bottom: 24px;
      padding: 28px 22px;
    }
  }
  @media (max-width: 767px) {
    .card-style-four { padding: 22px 18px; }
    .card-style-four h5 { font-size: 15px !important; }
    .card-style-four .icon.style-two { width: 50px !important; height: 50px !important; }
  }
`;

function injectCardStyleTwoStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-card-style-two-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-card-style-two-styles";
    el.textContent = CARD_STYLE_TWO_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Component ────────────────────────────────────────────────
const CardStyleTwo = () => {
  injectCardStyleTwoStyles();

  return (
    <div className="row gx-lg-5 align-items-center mt-120 lg-mt-50">
      {/* ── Years experience stat card ── */}
      <div className="col-lg-3">
        <div className="card-style-three mt-40">
          <div className="bg-wrapper text-center">
            <h3>
              0<Count number={12} />+
            </h3>
            <p>
              Years serving <br />
              Nepal with pride.
            </p>
          </div>
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div className="col-lg-9">
        <div className="row gx-xl-5">
          {nepal_feature_data
            .filter((item) => item.page === "home_three_feature_2")
            .map((item) => (
              <div key={item.id} className="col-md-4">
                <div className="card-style-four mt-40">
                  {/* Icon */}
                  <div className="icon rounded-circle d-flex align-items-center justify-content-center position-relative style-two">
                    <img
                      src={item.icon ?? ""}
                      alt={item.title}
                      className="lazy-img"
                    />
                  </div>
                  <h5 className="mt-35 mb-15">{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CardStyleTwo;

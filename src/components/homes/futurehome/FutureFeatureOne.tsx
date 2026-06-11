// ============================================================
//  FutureFeatureOne.tsx — How clients benefit
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Nepal real estate content in English
// ============================================================

import { Link } from "react-router-dom";

interface FeatureItem {
  id: number;
  icon: string;
  title: string;
  desc: string;
  btn: string;
  route: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 1,
    icon: "/assets/images/icon/icon_16.svg",
    title: "Buy a Property",
    desc: "Explore premium homes, apartments, and land across the Kathmandu Valley and beyond. Our expert agents guide you to the best deals in Nepal's growing real estate market.",
    btn: "Browse Listings",
    route: "/buy",
  },
  {
    id: 2,
    icon: "/assets/images/icon/icon_17.svg",
    title: "Sell Your Property",
    desc: "List your property for free and reach thousands of verified buyers across Nepal. We charge only 3% commission — you keep the rest of every rupee from your sale.",
    btn: "List Now",
    route: "/sell",
  },
  {
    id: 3,
    icon: "/assets/images/icon/icon_18.svg",
    title: "Invest Smart",
    desc: "Leverage Nepal's booming real estate sector with data-backed investment guidance. Our analysts identify high-yield properties in Kathmandu, Pokhara, and emerging cities.",
    btn: "Start Investing",
    route: "/about",
  },
];

const STARS = [1, 2, 3, 4, 5];

const FEATURE_STYLES = `
  .fw-feature-section { margin-top: 120px; position: relative; z-index: 1; }
  @media (max-width: 991px) { .fw-feature-section { margin-top: 80px; } }

  .fw-feature-title-badge {
    display: inline-block;
    background: rgba(28,148,164,0.1);
    border: 1px solid rgba(28,148,164,0.3);
    border-radius: 20px;
    padding: 5px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #1C94A4;
    margin-bottom: 16px;
  }
  .fw-feature-h2 em { color: #1C94A4; font-style: italic; }

  .fw-feature-rating {
    list-style: none; padding: 0; margin: 12px 0 0;
    display: flex; justify-content: center; align-items: center;
    gap: 3px; flex-wrap: wrap;
  }
  .fw-feature-rating li { color: #f5a623; font-size: 14px; }
  .fw-feature-rating li:last-child { color: #252060; font-weight: 600; font-size: 13.5px; margin-left: 6px; }

  .fw-feature-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 44px 32px 36px;
    text-align: center;
    border: 1.5px solid #eef0f8;
    transition: all 0.3s ease;
    height: 100%; display: flex; flex-direction: column; align-items: center;
    position: relative; overflow: hidden;
  }
  .fw-feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #252060, #1C94A4);
    opacity: 0; transition: opacity 0.3s;
  }
  .fw-feature-card:hover { border-color: transparent; box-shadow: 0 12px 48px rgba(37,32,96,0.13); transform: translateY(-6px); }
  .fw-feature-card:hover::before { opacity: 1; }

  .fw-feature-card-num {
    position: absolute; top: 18px; right: 22px;
    font-size: 48px; font-weight: 800; color: rgba(37,32,96,0.05);
    line-height: 1; pointer-events: none; font-family: Georgia, serif;
  }

  .fw-feature-card .fw-icon {
    width: 68px; height: 68px;
    background: linear-gradient(135deg, rgba(37,32,96,0.08), rgba(28,148,164,0.12));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px; transition: background 0.3s;
  }
  .fw-feature-card:hover .fw-icon { background: linear-gradient(135deg, #252060, #1C94A4); }
  .fw-feature-card .fw-icon img { width: 34px; height: 34px; transition: filter 0.3s; }
  .fw-feature-card:hover .fw-icon img { filter: brightness(0) invert(1); }

  .fw-feature-card h5 { font-size: 1.15rem; font-weight: 700; color: #252060; margin-bottom: 14px; }
  .fw-feature-card p { font-size: 0.9rem; color: #5a5e7a; line-height: 1.7; margin-bottom: 28px; flex: 1; }

  .fw-feature-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; border-radius: 10px; font-size: 13px; font-weight: 600;
    color: #252060; border: 1.5px solid #252060; text-decoration: none;
    transition: all 0.25s; margin-top: auto; letter-spacing: 0.2px;
  }
  .fw-feature-btn:hover { background: #252060; color: #fff; border-color: #252060; gap: 12px; }
  .fw-feature-btn i { font-size: 11px; }
`;

function injectFeatureStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-feature-one-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-feature-one-styles";
    el.textContent = FEATURE_STYLES;
    document.head.appendChild(el);
  }
}

const FutureFeatureOne = () => {
  injectFeatureStyles();
  return (
    <div className="fw-feature-section block-feature-seven xl-mt-100">
      <div className="container containe-large">
        <div className="position-relative">
          <div className="text-center mb-50">
            <div className="fw-feature-title-badge">Our Services</div>
            <div className="title-one mb-16 lg-mb-10">
              <h2
                className="font-garamond star-shape fw-feature-h2"
                style={{ color: "#252060" }}
              >
                How our clients get <em>benefited</em> by us{" "}
                <span className="star-shape">
                  <img
                    src="/assets/images/shape/shape_37.svg"
                    alt=""
                    className="lazy-img"
                  />
                </span>
              </h2>
              <p className="fs-22 mt-xs" style={{ color: "#5a5e7a" }}>
                "Outstanding service — I found my dream home in Kathmandu within
                weeks!"
              </p>
            </div>
            <ul className="fw-feature-rating">
              {STARS.map((_, i) => (
                <li key={i}>
                  <i className="fa-sharp fa-solid fa-star" />
                </li>
              ))}
              <li>
                <span style={{ color: "#252060", fontWeight: 600 }}>4.8</span>{" "}
                <span style={{ color: "#8a8c9e", fontWeight: 400 }}>
                  (1.2k+ Reviews)
                </span>
              </li>
            </ul>
          </div>

          <div className="row justify-content-center gx-xxl-5">
            {FEATURES.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 mt-30 d-flex">
                <div className="fw-feature-card w-100">
                  <div className="fw-feature-card-num">0{item.id}</div>
                  <div className="fw-icon">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="lazy-img"
                    />
                  </div>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                  <Link to={item.route} className="fw-feature-btn">
                    {item.btn} <i className="bi bi-arrow-up-right" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureFeatureOne;

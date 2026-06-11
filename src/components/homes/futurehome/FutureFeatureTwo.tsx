// ============================================================
//  FutureFeatureTwo.tsx — About / Dream Home block
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Nepal real estate content in English
// ============================================================

import { Link } from "react-router-dom";
import Count from "../../common/Count";

const FEATURE_TWO_STYLES = `
  .fw-feature-two { margin-top: 170px; position: relative; z-index: 1; }
  @media (max-width: 1199px) { .fw-feature-two { margin-top: 120px; } }
  @media (max-width: 767px) { .fw-feature-two { margin-top: 80px; } }

  .fw-feature-two .title-one h2 { color: #252060; }
  .fw-feature-two .title-one h2 em { color: #1C94A4; font-style: italic; }

  .fw-feature-two-block {
    background: #f5f7fd;
    border-radius: 24px;
    padding: 48px 40px 44px;
    height: 100%;
  }
  @media (max-width: 575px) { .fw-feature-two-block { padding: 32px 24px; } }

  .fw-feature-two-quote {
    font-size: clamp(1rem, 1.8vw, 1.3rem);
    font-style: italic;
    color: #252060;
    line-height: 1.7;
    padding-right: 24px;
    position: relative;
  }
  .fw-feature-two-quote::before {
    content: '"';
    font-size: 5rem; color: rgba(28,148,164,0.18);
    position: absolute; top: -20px; left: -12px;
    font-family: Georgia, serif; line-height: 1; pointer-events: none;
  }
  @media (max-width: 767px) { .fw-feature-two-quote { padding-right: 0; } }

  .fw-counter-wrapper {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
    padding: 32px 0;
    border-top: 1px solid #dde2f0; border-bottom: 1px solid #dde2f0;
    margin: 32px 0;
  }
  .fw-counter-num { font-size: 2rem; font-weight: 700; color: #252060; line-height: 1; margin-bottom: 6px; }
  .fw-counter-num .suffix { color: #1C94A4; font-size: 1.1rem; }
  .fw-counter-label { font-size: 12.5px; color: #6b7191; font-weight: 500; line-height: 1.4; }

  .fw-usp-list { list-style: none; padding: 0; margin: 0; }
  .fw-usp-list li {
    display: flex; align-items: flex-start; gap: 12px;
    font-size: 15px; color: #2d3056; font-weight: 500; padding: 7px 0;
  }
  .fw-usp-list li::before {
    content: '';
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 2px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%231C94A4'/%3E%3Cpath d='M6 10l3 3 5-5' stroke='white' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  .fw-cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; border-radius: 12px; background: #252060;
    color: #fff; font-size: 14px; font-weight: 600; text-decoration: none;
    transition: all 0.25s; margin-top: 36px; letter-spacing: 0.3px;
  }
  .fw-cta-btn:hover { background: #1C94A4; color: #fff; gap: 14px; }
  .fw-cta-btn i { font-size: 12px; }

  .fw-feature-two .screen_01 {
    position: absolute; bottom: -20px; right: -20px; width: 55%;
    border-radius: 12px; box-shadow: 0 12px 40px rgba(37,32,96,0.18);
  }
  .fw-feature-two .screen_02 {
    position: absolute; bottom: -24px; left: -12px; width: 65%;
    border-radius: 12px; box-shadow: 0 12px 40px rgba(37,32,96,0.18);
  }
  .fw-feature-two .shape_01 { position: absolute; top: -30px; right: -40px; width: 80px; }
`;

function injectFeatureTwoStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-feature-two-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-feature-two-styles";
    el.textContent = FEATURE_TWO_STYLES;
    document.head.appendChild(el);
  }
}

const FutureFeatureTwo = () => {
  injectFeatureTwoStyles();
  return (
    <div className="fw-feature-two block-feature-eight position-relative z-1">
      <div className="container container-arge">
        <div className="position-relative">
          <div className="row align-items-xl-end">
            {/* Left: image media */}
            <div className="col-xl-7 col-lg-6">
              <div className="pe-xl-5 me-xxl-3">
                <div className="title-one pe-xl-5">
                  <h2 className="font-garamond">
                    Explore &amp; Find your <em>Dream</em> Home in Nepal{" "}
                    <span className="star-shape">
                      <img
                        src="/assets/images/shape/shape_37.svg"
                        alt=""
                        className="lazy-img"
                      />
                    </span>
                  </h2>
                </div>
                <div className="row gx-xl-4 align-items-end mt-4">
                  <div className="col-7">
                    <div className="fw-feature-two position-relative z-1">
                      <img
                        src="/assets/images/media/img_29.jpg"
                        alt="Nepali Home"
                        className="lazy-img main-img w-100"
                        style={{ borderRadius: "16px" }}
                      />
                      <img
                        src="/assets/images/assets/screen_03.jpg"
                        alt=""
                        className="lazy-img screen_01"
                      />
                      <img
                        src="/assets/images/shape/shape_40.svg"
                        alt=""
                        className="lazy-img shape_01"
                      />
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="fw-feature-two position-relative z-1">
                      <img
                        src="/assets/images/media/img_30.jpg"
                        alt="Modern Apartment"
                        className="lazy-img main-img w-100"
                        style={{ borderRadius: "16px" }}
                      />
                      <img
                        src="/assets/images/assets/screen_04.png"
                        alt=""
                        className="lazy-img screen_02"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: text block */}
            <div className="col-xl-5 col-lg-6">
              <div
                className="md-mt-100"
                style={{ paddingLeft: "clamp(0px,3vw,40px)" }}
              >
                <div className="fw-feature-two-block">
                  <p className="fw-feature-two-quote">
                    "Your premier real estate partner in Nepal. We transform
                    properties into dreams — guiding you home with expertise,
                    transparency, and care every step of the way."
                  </p>

                  <div className="fw-counter-wrapper">
                    <div>
                      <div className="fw-counter-num">
                        Rs.{" "}
                        <span className="counter">
                          <Count number={7} />
                        </span>
                        <span className="suffix"> bil+</span>
                      </div>
                      <div className="fw-counter-label">
                        Total Property Handover
                      </div>
                    </div>
                    <div>
                      <div className="fw-counter-num">
                        <span className="counter">
                          <Count number={1.9} />
                        </span>
                        <span className="suffix">k+</span>
                      </div>
                      <div className="fw-counter-label">Happy Customers</div>
                    </div>
                    <div>
                      <div className="fw-counter-num">
                        <span className="counter">
                          <Count number={3600} />
                        </span>
                        <span className="suffix">+</span>
                      </div>
                      <div className="fw-counter-label">Properties Sold</div>
                    </div>
                    <div>
                      <div className="fw-counter-num">
                        <span className="counter">
                          <Count number={15} />
                        </span>
                        <span className="suffix">+</span>
                      </div>
                      <div className="fw-counter-label">
                        Years of Experience
                      </div>
                    </div>
                  </div>

                  <ul className="fw-usp-list">
                    <li>Home loan &amp; low interest rate facility</li>
                    <li>100k+ property listings added &amp; updated</li>
                    <li>Free expert agent consultation</li>
                    <li>Sell your property at just 3% commission</li>
                  </ul>

                  <Link to="/about" className="fw-cta-btn">
                    Learn More <i className="bi bi-arrow-up-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <CardStyleTwo /> */}
        </div>
      </div>
    </div>
  );
};

export default FutureFeatureTwo;

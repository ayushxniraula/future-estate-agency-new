import { Link } from "react-router-dom";
import FaqThree from "../../../common/faq/FaqThree";
import Count from "../../../common/Count";

const BLOCK_FEATURE_ONE_STYLES = `
  .fw-block-feature-one .title-one h2 { color: #252060; }
  .fw-block-feature-one .title-one h2 em { color: #1C94A4; font-style: italic; }
  .fw-block-feature-one .accordion-style-three .accordion-button {
    color: #252060;
  }
  .fw-block-feature-one .accordion-style-three .accordion-button:not(.collapsed) {
    color: #1C94A4;
    background: rgba(28,148,164,0.06);
  }
  .fw-block-feature-one .accordion-style-three .accordion-button:focus {
    box-shadow: 0 0 0 0.2rem rgba(28,148,164,0.2);
  }
  .fw-block-feature-one .btn-five {
    background: #252060;
    border-color: #252060;
    color: #fff;
  }
  .fw-block-feature-one .btn-five:hover {
    background: #1C94A4;
    border-color: #1C94A4;
  }
  .fw-block-feature-one .counter-block-two.dark .main-count { color: #252060; }
  .fw-block-feature-one .counter-block-two.dark p { color: #5a5e7a; }
  .fw-block-feature-one .counter-block-two.dark {
    border-color: rgba(37,32,96,0.12);
  }
`;

function injectBlockFeatureOneStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-block-feature-one-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-block-feature-one-styles";
    el.textContent = BLOCK_FEATURE_ONE_STYLES;
    document.head.appendChild(el);
  }
}

const BLockFeatureOne = () => {
  injectBlockFeatureOneStyles();
  return (
    <div className="fw-block-feature-one block-feature-fifteen mt-150 xl-mt-100 mb-140 xl-mb-80">
      <div className="container">
        <div className="row gx-xl-5">
          <div className="col-xl-6 col-lg-7 order-lg-last">
            <div className="ms-xxl-5 ps-xl-4 ps-lg-5 md-mb-50">
              <div className="title-one mb-45 lg-mb-20">
                <h2 className="font-garamond star-shape">
                  Find Your Preferable Match Easily.{" "}
                  <span className="star-shape">
                    <img
                      src="/assets/images/shape/shape_37.svg"
                      alt=""
                      className="lazy-img"
                    />
                  </span>
                </h2>
              </div>
              <div className="accordion-style-three">
                <div className="accordion" id="accordionThree">
                  <FaqThree />
                </div>
              </div>
              <Link to="contact" className="btn-five mt-75 lg-mt-50">
                Contact us
              </Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-5 d-lg-flex">
            <div className="media-block h-100 w-100 pe-xl-5">
              <div
                className="bg-img position-relative"
                style={{
                  backgroundImage: `url(/assets/images/media/img_52.jpg)`,
                }}
              >
                <img
                  src="/assets/images/assets/screen_10.png"
                  alt=""
                  className="lazy-img shapes screen_01"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="wrapper mt-90 lg-mt-40">
          <div className="row justify-content-center">
            <div className="col-md-4 col-sm-6">
              <div className="counter-block-two text-center dark mt-30">
                <div className="main-count sm font-garamond fw-500">
                  <span className="counter">
                    <Count number={720} />
                  </span>
                  k+
                </div>
                <p className="fs-20 mt-15 md-mt-10">Project handover</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="counter-block-two text-center dark mt-30">
                <div className="main-count sm font-garamond fw-500">
                  <span className="counter">
                    <Count number={1.3} />
                  </span>
                  %
                </div>
                <p className="fs-20 mt-15 md-mt-10">Low Interest</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="counter-block-two text-center dark mt-30">
                <div className="main-count sm font-garamond fw-500">
                  <span className="counter">{<Count number={1.9} />}</span>mil+
                </div>
                <p className="fs-20 mt-15 md-mt-10">Happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BLockFeatureOne;

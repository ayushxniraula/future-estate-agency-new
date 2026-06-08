import { Link } from "react-router-dom";

const FANCY_BANNER_STYLES = `
  .fw-fancy-banner .bg-wrapper {
    background: linear-gradient(135deg, #252060 0%, #1e2d6b 55%, #1C94A4 100%) !important;
    position: relative;
    overflow: hidden;
  }
  .fw-fancy-banner .bg-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(28,148,164,0.3) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .fw-fancy-banner .bg-wrapper > .row {
    position: relative;
    z-index: 1;
  }

  .fw-fancy-banner h3 { color: #ffffff; }
  .fw-fancy-banner h3 span { color: rgba(255,255,255,0.75); }

  .fw-fancy-banner .btn-eight {
    background: #ffffff;
    color: #252060;
    border-color: #ffffff;
    font-weight: 700;
  }
  .fw-fancy-banner .btn-eight:hover {
    background: #1C94A4;
    border-color: #1C94A4;
    color: #fff;
  }

  .fw-fancy-banner .btn-two {
    color: rgba(255,255,255,0.85);
    border-bottom: 1.5px solid rgba(255,255,255,0.4) !important;
  }
  .fw-fancy-banner .btn-two:hover {
    color: #fff;
    border-bottom-color: #fff !important;
  }
`;

function injectFancyBannerStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-fancy-banner-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-fancy-banner-styles";
    el.textContent = FANCY_BANNER_STYLES;
    document.head.appendChild(el);
  }
}

const FancyBanner = () => {
  injectFancyBannerStyles();
  return (
    <div className="fw-fancy-banner fancy-banner-eight mt-160 xl-mt-100 mb-120 xl-mb-100 lg-mb-80">
      <div className="container container-large">
        <div className="bg-wrapper border-30 overflow-hidden position-relative z-1">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-7 col-md-7">
              <div className="pb-80 lg-pb-40">
                <h3>
                  Start your Journey as{" "}
                  <span className="fw-normal fst-italic">A Retailer.</span>
                </h3>
                <div className="d-inline-flex flex-wrap align-items-center position-relative mt-15">
                  <Link to="/agent" className="btn-eight mt-10 me-4">
                    <span>Become an Agent</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="btn-two rounded-0 border-0 mt-10"
                  >
                    <span>Contact us</span>
                  </Link>
                  <img
                    src="/assets/images/shape/shape_51.svg"
                    alt=""
                    className="lazy-img shapes shape_02"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-5 col-md-5 text-center text-md-end">
              <div className="media-wrapper position-relative z-1 d-inline-block">
                <img
                  src="/assets/images/media/img_44.png"
                  alt=""
                  className="lazy-img"
                />
                <img
                  src="/assets/images/shape/shape_50.svg"
                  alt=""
                  className="lazy-img shapes shape_01"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyBanner;

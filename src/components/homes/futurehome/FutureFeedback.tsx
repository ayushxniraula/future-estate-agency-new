// ============================================================
//  FutureFeedback.tsx — Client testimonials slider
//  FutureWork brand: #252060 (navy) + #1C94A4 (teal)
//  Nepal-specific static testimonial content
//  Structure unchanged — only colors & content updated
// ============================================================

import { Rating } from "react-simple-star-rating";
import Slider from "react-slick";
import { useRef } from "react";

// ─── Nepal-specific static feedback data ──────────────────────
// Replace feedback_data import with inline Nepal-targeted content
const nepal_feedback_data = [
  {
    id: 1,
    page: "home_3",
    thumb: "/assets/images/media/img_01.jpg",
    title: "Aarav Shrestha",
    country: "Kathmandu, Nepal",
    desc: "Future Work helped us find our dream home in Lalitpur within two weeks. The team understood exactly what we needed and never wasted our time with unsuitable listings.",
    quote_icon: "/assets/images/icon/icon_48.svg",
  },
  {
    id: 2,
    page: "home_3",
    thumb: "/assets/images/media/img_02.jpg",
    title: "Priya Maharjan",
    country: "Patan, Lalitpur",
    desc: "As a first-time buyer, I was overwhelmed. The Future Work team walked me through every step — from Baneshwor shortlisting to final registration. Truly professional service.",
    quote_icon: "/assets/images/icon/icon_48.svg",
  },
  {
    id: 3,
    page: "home_3",
    thumb: "/assets/images/media/img_03.jpg",
    title: "Bikash Gurung",
    country: "Pokhara, Kaski",
    desc: "I listed my commercial property in Lakeside, Pokhara and received genuine inquiries within days. The platform's reach across Nepal is impressive and the process was seamless.",
    quote_icon: "/assets/images/icon/icon_48.svg",
  },
  {
    id: 4,
    page: "home_3",
    thumb: "/assets/images/media/img_04.jpg",
    title: "Sunita Tamang",
    country: "Bhaktapur, Nepal",
    desc: "Found a beautiful apartment near Suryabinayak at a fair price. Future Work's filter tools made it easy to compare properties across Bhaktapur without visiting each one.",
    quote_icon: "/assets/images/icon/icon_48.svg",
  },
  {
    id: 5,
    page: "home_3",
    thumb: "/assets/images/media/img_05.jpg",
    title: "Rajesh Thapa",
    country: "Biratnagar, Morang",
    desc: "Renting out our ancestral land in Morang used to be complicated. Future Work simplified everything — legal verification, tenant screening, and transparent pricing included.",
    quote_icon: "/assets/images/icon/icon_48.svg",
  },
  {
    id: 6,
    page: "home_3",
    thumb: "/assets/images/media/img_06.jpg",
    title: "Manju Karki",
    country: "Chitwan, Nepal",
    desc: "We needed a villa near Sauraha for our resort business. Future Work understood the commercial angle and connected us with the right sellers promptly. Highly recommended.",
    quote_icon: "/assets/images/icon/icon_48.svg",
  },
];

// ─── Brand styles ─────────────────────────────────────────────
const FEEDBACK_STYLES = `
  /* Override feedback block colours to FutureWork brand */
  .feedback-section-four .feedback-block-four {
    background: #fff;
    border: 1.5px solid #eef0f8;
    border-radius: 20px;
    padding: 28px 26px;
    position: relative;
    transition: box-shadow 0.28s, transform 0.28s;
    margin: 8px 0;
  }
  .feedback-section-four .feedback-block-four:hover {
    box-shadow: 0 12px 44px rgba(37,32,96,0.11);
    transform: translateY(-3px);
  }

  /* Avatar ring */
  .feedback-section-four .feedback-block-four .avatar {
    width: 52px;
    height: 52px;
    object-fit: cover;
    border: 2.5px solid #1C94A4;
    padding: 2px;
  }

  /* Name */
  .feedback-section-four .feedback-block-four h6 {
    color: #252060 !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* Location */
  .feedback-section-four .feedback-block-four span {
    color: #1C94A4 !important;
    font-size: 12.5px !important;
    font-weight: 500;
  }

  /* Quote text */
  .feedback-section-four .feedback-block-four blockquote {
    color: #4a4e6a;
    font-size: 14px;
    line-height: 1.7;
    margin: 18px 0 14px;
    font-style: normal;
    border-left: 3px solid #1C94A4;
    padding-left: 14px;
  }

  /* Stars — teal accent */
  .feedback-section-four .feedback-block-four .rating svg {
    fill: #1C94A4 !important;
  }

  /* Quote icon */
  .feedback-section-four .feedback-block-four .icon {
    position: absolute;
    bottom: 22px;
    right: 22px;
    width: 32px;
    opacity: 0.12;
    filter: hue-rotate(190deg) saturate(2);
  }

  /* Section heading override */
  .feedback-section-four .title-one h2 {
    color: #252060;
  }
  .feedback-section-four .title-one h2 em {
    color: #1C94A4;
    font-style: italic;
  }
  .feedback-section-four .title-one p {
    color: #6b7191;
  }

  /* Slider arrows — FutureWork brand */
  .feedback-section-four .slider-arrows li {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid #dde2f0;
    background: #fff;
    color: #252060;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.22s ease;
    list-style: none;
  }
  .feedback-section-four .slider-arrows li:hover {
    background: #252060;
    border-color: #252060;
    color: #fff;
  }

  /* See all btn */
  .feedback-section-four .btn-eleven {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 12px 28px;
    border-radius: 10px;
    border: 1.5px solid #1C94A4;
    color: #1C94A4;
    font-size: 13.5px;
    font-weight: 600;
    font-style: italic;
    text-decoration: none;
    transition: all 0.22s;
  }
  .feedback-section-four .btn-eleven:hover {
    background: #1C94A4;
    color: #fff;
  }

  /* Section background tint */
  .feedback-section-four::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(37,32,96,0.02) 0%, rgba(28,148,164,0.04) 100%);
    pointer-events: none;
    z-index: 0;
  }

  /* Mobile: single-card padding */
  @media (max-width: 767px) {
    .feedback-section-four .feedback-block-four {
      padding: 22px 18px;
      margin: 6px 4px;
    }
  }
`;

function injectFeedbackStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-feedback-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-feedback-styles";
    el.textContent = FEEDBACK_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Slider config (unchanged from original) ──────────────────
const setting = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1200,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 1, centerMode: false },
    },
  ],
};

// ─── Component ────────────────────────────────────────────────
const FutureFeedback = ({ style }: { style?: boolean }) => {
  injectFeedbackStyles();
  const sliderRef = useRef<Slider | null>(null);

  const handlePrevClick = () => sliderRef.current?.slickPrev();
  const handleNextClick = () => sliderRef.current?.slickNext();

  return (
    <div
      className={`feedback-section-four position-relative overflow-hidden z-1 pt-150 lg-pt-120 ${
        style ? "" : "pb-110 lg-pb-80"
      }`}
    >
      <div className={`container ${style ? "" : "contaier-large"}`}>
        <div className="position-relative z-1">
          <div className="row">
            <div className="col-xl-6 col-lg-8">
              <div className="title-one pe-xxl-5 mb-75 xl-mb-50">
                {style ? (
                  <h3>
                    Client{" "}
                    <span>
                      Feedback{" "}
                      <img
                        src="/assets/images/shape/title_shape_01.svg"
                        alt=""
                        className="lazy-img"
                      />
                    </span>
                  </h3>
                ) : (
                  <h2 className="font-garamond">
                    Don&apos;t Trust Us, Trust <em>our clients</em>{" "}
                    <span className="star-shape">
                      <img
                        src="/assets/images/shape/shape_37.svg"
                        alt=""
                        className="lazy-img"
                      />
                    </span>
                  </h2>
                )}
                <p className={`fs-20 ${style ? "mt-xs" : "m0"}`}>
                  Thousands of Nepali families have found their perfect home
                  through Future Work. Here&apos;s what they say.
                </p>
              </div>
            </div>
          </div>

          {/* Slider */}
          <Slider {...setting} ref={sliderRef} className="feedback-slider-two">
            {nepal_feedback_data
              .filter((item) => item.page === "home_3")
              .map((item) => (
                <div key={item.id} className="item">
                  <div
                    className={`feedback-block-four ${
                      style ? "ps-lg-4 pe-lg-4" : ""
                    }`}
                  >
                    {/* Avatar + name */}
                    <div className="d-flex align-items-center">
                      <img
                        src={item.thumb}
                        alt={item.title}
                        className="rounded-circle avatar"
                      />
                      <div className="ps-3">
                        <h6 className="fs-20 m0">{item.title}</h6>
                        <span className="fs-16">{item.country}</span>
                      </div>
                    </div>

                    {/* Review */}
                    <blockquote>&quot;{item.desc}&quot;</blockquote>

                    {/* Stars */}
                    <ul className="rating style-none d-flex">
                      <li>
                        <Rating
                          initialValue={5}
                          size={18}
                          readonly={true}
                          fillColor="#1C94A4"
                        />
                      </li>
                    </ul>

                    {/* Decorative quote icon */}
                    <img src={item.quote_icon} alt="" className="icon" />
                  </div>
                </div>
              ))}
          </Slider>

          {/* Navigation arrows */}
          <ul className="slider-arrows slick-arrow-two d-flex justify-content-center style-none md-mt-30">
            <li
              onClick={handlePrevClick}
              className="prev_c slick-arrow"
              aria-label="Previous review"
            >
              <i className="bi bi-arrow-left" />
            </li>
            <li
              onClick={handleNextClick}
              className="next_c slick-arrow"
              aria-label="Next review"
            >
              <i className="bi bi-arrow-right" />
            </li>
          </ul>
        </div>
      </div>

      {/* Decorative shapes (unchanged from original) */}
      {!style && (
        <>
          <img
            src="/assets/images/shape/shape_42.svg"
            alt=""
            className="lazy-img shapes shape_01"
          />
          <img
            src="/assets/images/shape/shape_43.svg"
            alt=""
            className="lazy-img shapes shape_02"
          />
        </>
      )}
    </div>
  );
};

export default FutureFeedback;

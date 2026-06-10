import BLockFeatureOne from "./BLockFeatureOne";

import FooterTwo from "../../../../layouts/footers/FutureFooter";
import { useClientSession } from "../../../../my-components/userclientsession";
import { useState } from "react";
import NavMenu from "../../../../layouts/headers/Menu/FutureNavMenu";
import LoginModal from "../../../../modals/LoginModal";
import { Link } from "react-router-dom";

const BANNER_STYLES = `
  .fwc-banner {
    position: relative; overflow: hidden;
    background: #252060;
  }
  .fwc-banner__bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    opacity: 0.18;
  }
  .fwc-banner__inner {
    position: relative; z-index: 2;
    padding: 80px 20px 72px;
    text-align: center;
  }
  .fwc-banner__title {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(32px, 5vw, 54px);
    color: #fff; letter-spacing: -0.5px;
    margin: 0 0 18px; line-height: 1.1;
  }
  .fwc-banner__title em { color: #7dd8e4; font-style: italic; }
  .fwc-banner__crumb {
    list-style: none; padding: 0; margin: 0;
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; color: rgba(255,255,255,0.5);
  }
  .fwc-banner__crumb a {
    color: rgba(255,255,255,0.65); text-decoration: none;
    transition: color 0.15s;
  }
  .fwc-banner__crumb a:hover { color: #7dd8e4; }
  .fwc-banner__crumb li:last-child { color: rgba(255,255,255,0.35); }
`;

function injectBannerStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fwc-banner-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fwc-banner-styles";
    el.textContent = BANNER_STYLES;
    document.head.appendChild(el);
  }
}

const AboutUsTwo = () => {
  injectBannerStyles();
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();

  return (
    <>
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      <div className="fwc-banner">
        <div
          className="fwc-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwc-banner__inner">
          <h2 className="fwc-banner__title">
            About <em>us</em>
          </h2>
          <ul className="fwc-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>About us</li>
          </ul>
        </div>
      </div>

      <BLockFeatureOne />
      {/* <BLockFeatureTwo /> */}
      {/* <Feedback /> */}
      {/* <Brand /> */}
      {/* <FancyBanner /> */}
      <FooterTwo />
    </>
  );
};

export default AboutUsTwo;

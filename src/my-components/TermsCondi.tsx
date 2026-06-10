// ============================================================
//  TermsAndConditions.tsx — FutureWork
//  Theme: #252060 navy + #1C94A4 teal
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import NavMenu from "../layouts/headers/Menu/FutureNavMenu";
import LoginModal from "../modals/LoginModal";
import { useClientSession } from "./userclientsession";
import FutureFooter from "../layouts/footers/FutureFooter";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  .fwl-root {
    --navy:       #252060;
    --navy-faint: rgba(37,32,96,0.05);
    --teal:       #1C94A4;
    --teal-faint: rgba(28,148,164,0.08);
    --rule:       #e8e6f0;
    --surface:    #F8F7FC;
    --white:      #ffffff;
    --ink:        #0f0e1a;
    --ink-2:      #3a3850;
    --ink-3:      #5a5e7a;
    --ink-4:      #9a9bb5;
    --serif:      'DM Serif Display', Georgia, serif;
    --sans:       'Plus Jakarta Sans', system-ui, sans-serif;
    --r:          12px;
    --r-lg:       18px;
  }
  .fwl-root, .fwl-root * { font-family: var(--sans); box-sizing: border-box; }
  .fwl-root { background: var(--surface); }

  /* ── Banner ── */
  .fwl-banner {
    position: relative; overflow: hidden;
    background: var(--navy);
  }
  .fwl-banner__bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    opacity: 0.18;
  }
  .fwl-banner__inner {
    position: relative; z-index: 2;
    padding: 80px 20px 72px;
    text-align: center;
  }
  .fwl-banner__title {
    font-family: var(--serif);
    font-size: clamp(32px, 5vw, 54px);
    color: #fff; letter-spacing: -0.5px;
    margin: 0 0 18px; line-height: 1.1;
  }
  .fwl-banner__title em { color: #7dd8e4; font-style: italic; }
  .fwl-banner__crumb {
    list-style: none; padding: 0; margin: 0;
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; color: rgba(255,255,255,0.5);
  }
  .fwl-banner__crumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.15s; }
  .fwl-banner__crumb a:hover { color: #7dd8e4; }
  .fwl-banner__crumb li:last-child { color: rgba(255,255,255,0.35); }

  /* ── Layout ── */
  .fwl-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 60px 20px 100px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .fwl-layout { grid-template-columns: 1fr; }
  }

  /* ── Sidebar TOC ── */
  .fwl-toc {
    position: sticky; top: 90px;
    background: var(--white);
    border: 1.5px solid var(--rule);
    border-radius: var(--r-lg);
    padding: 24px 20px;
    box-shadow: 0 2px 8px rgba(37,32,96,0.04);
  }
  @media (max-width: 900px) { .fwl-toc { position: static; } }
  .fwl-toc__title {
    font-size: 9px; font-weight: 800; letter-spacing: 1.3px;
    text-transform: uppercase; color: var(--teal);
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .fwl-toc__title::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
  .fwl-toc__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
  .fwl-toc__item {
    font-size: 13px; color: var(--ink-3); padding: 7px 10px;
    border-radius: 8px; cursor: pointer; transition: all 0.15s;
    font-weight: 500; border: 1px solid transparent;
    display: flex; align-items: center; gap: 8px; text-decoration: none;
  }
  .fwl-toc__item:hover { color: var(--navy); background: var(--navy-faint); }
  .fwl-toc__item.active { color: var(--teal); background: var(--teal-faint); border-color: rgba(28,148,164,0.2); font-weight: 600; }
  .fwl-toc__num { font-size: 10px; font-weight: 700; color: var(--ink-4); width: 18px; flex-shrink: 0; }
  .fwl-toc__updated {
    margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--rule);
    font-size: 11px; color: var(--ink-4); line-height: 1.6;
  }
  .fwl-toc__updated strong { color: var(--ink-3); display: block; margin-bottom: 2px; }

  /* ── Content ── */
  .fwl-content {
    background: var(--white);
    border: 1.5px solid var(--rule);
    border-radius: var(--r-lg);
    padding: 48px 52px;
    box-shadow: 0 2px 8px rgba(37,32,96,0.04);
  }
  @media (max-width: 700px) { .fwl-content { padding: 28px 22px; } }

  .fwl-content__intro {
    padding: 20px 22px;
    background: var(--teal-faint);
    border: 1px solid rgba(28,148,164,0.18);
    border-left: 3px solid var(--teal);
    border-radius: 0 var(--r) var(--r) 0;
    font-size: 14.5px; color: var(--ink-3); line-height: 1.75;
    margin-bottom: 40px;
  }
  .fwl-content__intro strong { color: var(--navy); }

  .fwl-section { margin-bottom: 44px; scroll-margin-top: 100px; }
  .fwl-section:last-of-type { margin-bottom: 0; }

  .fwl-section__head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1.5px solid var(--rule);
  }
  .fwl-section__num {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--navy); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
  }
  .fwl-section__title {
    font-family: var(--serif); font-size: 20px;
    color: var(--navy); margin: 0; line-height: 1.2;
  }

  .fwl-section p {
    font-size: 14.5px; color: var(--ink-3); line-height: 1.8;
    margin-bottom: 14px;
  }
  .fwl-section p:last-child { margin-bottom: 0; }
  .fwl-section strong { color: var(--navy); font-weight: 700; }

  .fwl-list {
    list-style: none; padding: 0; margin: 0 0 14px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .fwl-list li {
    font-size: 14px; color: var(--ink-3); line-height: 1.7;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .fwl-list li::before {
    content: '→'; color: var(--teal); font-size: 12px;
    flex-shrink: 0; margin-top: 3px;
  }

  .fwl-highlight {
    background: var(--navy-faint);
    border: 1px solid var(--rule);
    border-radius: var(--r);
    padding: 16px 20px;
    margin: 16px 0;
  }
  .fwl-highlight p { margin: 0; font-size: 14px; }

  .fwl-contact-box {
    margin-top: 40px;
    background: var(--navy);
    border-radius: var(--r-lg);
    padding: 32px 36px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 20px; flex-wrap: wrap;
  }
  .fwl-contact-box__text h4 {
    font-family: var(--serif); font-size: 22px;
    color: #fff; margin: 0 0 6px;
  }
  .fwl-contact-box__text p { font-size: 13.5px; color: rgba(255,255,255,0.55); margin: 0; }
  .fwl-contact-box__btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 24px; border-radius: var(--r);
    background: var(--teal); color: #fff; border: none;
    font-size: 13.5px; font-weight: 700; font-family: var(--sans);
    text-decoration: none; transition: background 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .fwl-contact-box__btn:hover { background: #157a88; transform: translateY(-1px); color: #fff; }
`;

function injectStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fwl-terms-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fwl-terms-styles";
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
}

const SECTIONS = [
  { id: "acceptance", num: "01", title: "Acceptance of Terms" },
  { id: "services", num: "02", title: "Our Services" },
  { id: "user-obligations", num: "03", title: "User Obligations" },
  { id: "listings", num: "04", title: "Property Listings" },
  { id: "transactions", num: "05", title: "Transactions & Fees" },
  { id: "intellectual-property", num: "06", title: "Intellectual Property" },
  { id: "disclaimers", num: "07", title: "Disclaimers" },
  { id: "liability", num: "08", title: "Limitation of Liability" },
  { id: "governing-law", num: "09", title: "Governing Law" },
  { id: "changes", num: "10", title: "Changes to Terms" },
];

const TermsAndConditions = () => {
  injectStyles();
  const [loginModal, setLoginModal] = useState(false);
  const [activeSection, setActiveSection] = useState("acceptance");
  const { session } = useClientSession();

  return (
    <div className="fwl-root">
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      {/* Banner */}
      <div className="fwl-banner">
        <div
          className="fwl-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwl-banner__inner">
          <h2 className="fwl-banner__title">
            Terms & <em>Conditions</em>
          </h2>
          <ul className="fwl-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </div>

      {/* Layout */}
      <div className="fwl-layout">
        {/* Sidebar */}
        <aside className="fwl-toc">
          <div className="fwl-toc__title">Contents</div>
          <ul className="fwl-toc__list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  className={`fwl-toc__item${activeSection === s.id ? " active" : ""}`}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <span className="fwl-toc__num">{s.num}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="fwl-toc__updated">
            <strong>Last Updated</strong>
            June 1, 2025
          </div>
        </aside>

        {/* Content */}
        <div className="fwl-content">
          <div className="fwl-content__intro">
            Please read these Terms and Conditions carefully before using
            FutureWork's website and services. By accessing or using our
            platform, you agree to be bound by these terms. If you do not agree,
            please do not use our services. These terms apply to all visitors,
            users, buyers, sellers, and agents who access or use FutureWork's
            real estate platform in Nepal.
          </div>

          {/* 01 */}
          <div className="fwl-section" id="acceptance">
            <div className="fwl-section__head">
              <span className="fwl-section__num">01</span>
              <h2 className="fwl-section__title">Acceptance of Terms</h2>
            </div>
            <p>
              By accessing or using the FutureWork website, mobile application,
              or any of our real estate services, you confirm that you have
              read, understood, and agree to be legally bound by these Terms and
              Conditions, along with our Privacy Policy and Cookie Policy.
            </p>
            <p>
              These terms constitute a binding legal agreement between you and{" "}
              <strong>FutureWork Pvt. Ltd.</strong>, a company registered under
              the laws of Nepal, with its principal office in Durbar Marg,
              Kathmandu. If you are using our services on behalf of a business
              or organisation, you represent that you have the authority to bind
              that entity to these terms.
            </p>
            <p>
              You must be at least <strong>18 years of age</strong> to use our
              platform. By using FutureWork, you confirm that you meet this age
              requirement.
            </p>
          </div>

          {/* 02 */}
          <div className="fwl-section" id="services">
            <div className="fwl-section__head">
              <span className="fwl-section__num">02</span>
              <h2 className="fwl-section__title">Our Services</h2>
            </div>
            <p>
              FutureWork is Nepal's verified real estate marketplace. We provide
              the following services:
            </p>
            <ul className="fwl-list">
              <li>
                Online listing and search of residential and commercial
                properties for sale and rent across Nepal including Kathmandu
                Valley, Pokhara, Chitwan, and Butwal.
              </li>
              <li>
                Connection services between buyers, sellers, tenants, and
                property owners.
              </li>
              <li>
                Property valuation guidance and market intelligence reports.
              </li>
              <li>EMI calculation tools and land unit conversion utilities.</li>
              <li>
                Assistance with legal documentation, land title verification,
                and registration processes through our partner network.
              </li>
              <li>
                Home loan facilitation through tie-ups with licensed Nepali
                banks and financial institutions.
              </li>
            </ul>
            <p>
              FutureWork acts as an intermediary platform. We are not a party to
              any property transaction between buyers and sellers unless
              explicitly stated. All transactions are subject to applicable
              Nepali law including the{" "}
              <strong>Land Revenue Act 2034 (1977)</strong> and relevant land
              registration regulations.
            </p>
          </div>

          {/* 03 */}
          <div className="fwl-section" id="user-obligations">
            <div className="fwl-section__head">
              <span className="fwl-section__num">03</span>
              <h2 className="fwl-section__title">User Obligations</h2>
            </div>
            <p>As a user of FutureWork, you agree to:</p>
            <ul className="fwl-list">
              <li>
                Provide accurate, complete, and truthful information when
                registering, listing a property, or submitting enquiries.
              </li>
              <li>
                Not post false, misleading, or fraudulent property listings or
                information.
              </li>
              <li>
                Not use our platform for any unlawful purpose or in violation of
                any applicable Nepali laws and regulations.
              </li>
              <li>
                Not attempt to circumvent, disable, or interfere with the
                platform's security features or functionality.
              </li>
              <li>
                Not engage in any form of scraping, data harvesting, or
                automated access to our platform without written permission.
              </li>
              <li>
                Not impersonate any person or entity or misrepresent your
                affiliation with any person or entity.
              </li>
              <li>
                Comply with all applicable laws regarding the purchase, sale, or
                rental of property in Nepal, including obtaining proper legal
                clearances.
              </li>
            </ul>
            <div className="fwl-highlight">
              <p>
                <strong>Important:</strong> Users who provide false information
                or engage in fraudulent activity may have their accounts
                suspended or terminated, and may be reported to the relevant
                authorities under Nepali law.
              </p>
            </div>
          </div>

          {/* 04 */}
          <div className="fwl-section" id="listings">
            <div className="fwl-section__head">
              <span className="fwl-section__num">04</span>
              <h2 className="fwl-section__title">Property Listings</h2>
            </div>
            <p>
              FutureWork endeavours to ensure that all listings on our platform
              are accurate and verified. However, we do not guarantee the
              accuracy, completeness, or timeliness of any listing information
              including property size, price, or availability.
            </p>
            <ul className="fwl-list">
              <li>
                All listings are subject to change, withdrawal, or correction
                without prior notice.
              </li>
              <li>
                Property measurements may be expressed in Ropani, Aana, Bigha,
                Kattha, Dhur, or square feet as applicable to the property's
                location in Nepal.
              </li>
              <li>
                Prices are listed in Nepalese Rupees (NPR) unless otherwise
                stated. Prices are indicative and subject to negotiation.
              </li>
              <li>
                FutureWork reserves the right to remove any listing that
                violates these terms, contains inaccurate information, or is
                deemed inappropriate.
              </li>
              <li>
                Sellers and agents are responsible for ensuring their listings
                comply with all applicable laws including the{" "}
                <strong>Consumer Protection Act 2075 (2018)</strong>.
              </li>
            </ul>
          </div>

          {/* 05 */}
          <div className="fwl-section" id="transactions">
            <div className="fwl-section__head">
              <span className="fwl-section__num">05</span>
              <h2 className="fwl-section__title">Transactions & Fees</h2>
            </div>
            <p>
              Listing a property on FutureWork is{" "}
              <strong>free of charge</strong>. FutureWork charges a commission
              on successful property transactions as follows:
            </p>
            <ul className="fwl-list">
              <li>
                A commission of{" "}
                <strong>3% of the final transaction value</strong> is charged
                upon successful completion of a sale facilitated through our
                platform.
              </li>
              <li>
                Commission rates for rental facilitation will be communicated
                separately and may vary.
              </li>
              <li>
                No commission is charged for listings that do not result in a
                completed transaction through FutureWork.
              </li>
              <li>
                All fees are subject to applicable Nepali taxes including VAT as
                required by law.
              </li>
            </ul>
            <p>
              FutureWork does not handle or process any property transaction
              funds. All payments between buyers and sellers are made directly
              between the parties and are governed by the relevant transaction
              agreements and Nepali law.
            </p>
          </div>

          {/* 06 */}
          <div className="fwl-section" id="intellectual-property">
            <div className="fwl-section__head">
              <span className="fwl-section__num">06</span>
              <h2 className="fwl-section__title">Intellectual Property</h2>
            </div>
            <p>
              All content on the FutureWork platform — including but not limited
              to logos, trademarks, text, images, graphics, interface design,
              and software — is the property of FutureWork Pvt. Ltd. and is
              protected under applicable intellectual property laws of Nepal.
            </p>
            <ul className="fwl-list">
              <li>
                You may not reproduce, distribute, modify, or create derivative
                works of our content without our prior written consent.
              </li>
              <li>
                By submitting property listings, photographs, or other content
                to FutureWork, you grant us a non-exclusive, royalty-free
                licence to use, display, and distribute that content on our
                platform and in our marketing materials.
              </li>
              <li>
                You warrant that any content you submit does not infringe the
                intellectual property rights of any third party.
              </li>
            </ul>
          </div>

          {/* 07 */}
          <div className="fwl-section" id="disclaimers">
            <div className="fwl-section__head">
              <span className="fwl-section__num">07</span>
              <h2 className="fwl-section__title">Disclaimers</h2>
            </div>
            <p>
              FutureWork provides its platform and services on an{" "}
              <strong>"as is"</strong> and <strong>"as available"</strong>{" "}
              basis. We make no warranties, express or implied, regarding the
              platform's reliability, availability, or suitability for any
              particular purpose.
            </p>
            <ul className="fwl-list">
              <li>
                We do not guarantee that the platform will be error-free,
                uninterrupted, or free from viruses or other harmful components.
              </li>
              <li>
                FutureWork does not provide legal, financial, or investment
                advice. All information is for general guidance only. You should
                seek independent legal and financial advice before entering into
                any property transaction.
              </li>
              <li>
                Market intelligence, price estimates, and EMI calculations
                provided on our platform are indicative only and should not be
                relied upon as definitive valuations.
              </li>
              <li>
                FutureWork is not responsible for any disputes arising between
                buyers, sellers, or agents outside of our direct facilitation
                services.
              </li>
            </ul>
          </div>

          {/* 08 */}
          <div className="fwl-section" id="liability">
            <div className="fwl-section__head">
              <span className="fwl-section__num">08</span>
              <h2 className="fwl-section__title">Limitation of Liability</h2>
            </div>
            <p>
              To the maximum extent permitted by Nepali law, FutureWork and its
              directors, employees, agents, and partners shall not be liable for
              any direct, indirect, incidental, special, or consequential
              damages arising from your use of our platform or services.
            </p>
            <p>This includes but is not limited to:</p>
            <ul className="fwl-list">
              <li>
                Loss of income or profit arising from any property transaction.
              </li>
              <li>
                Losses arising from reliance on inaccurate listing information.
              </li>
              <li>
                Any unauthorised access to or alteration of your data or
                account.
              </li>
              <li>
                Losses arising from disputes with other users of the platform.
              </li>
            </ul>
            <p>
              Our total liability to you for any claim arising out of these
              terms shall not exceed the amount you have paid to FutureWork in
              the twelve months preceding the claim.
            </p>
          </div>

          {/* 09 */}
          <div className="fwl-section" id="governing-law">
            <div className="fwl-section__head">
              <span className="fwl-section__num">09</span>
              <h2 className="fwl-section__title">Governing Law</h2>
            </div>
            <p>
              These Terms and Conditions are governed by and construed in
              accordance with the laws of <strong>Nepal</strong>. Any disputes
              arising in connection with these terms shall be subject to the
              exclusive jurisdiction of the courts of Kathmandu, Nepal.
            </p>
            <p>
              In the event of a dispute, the parties agree to first attempt to
              resolve the matter through good-faith negotiation. If negotiation
              fails, disputes shall be resolved through arbitration in
              accordance with the <strong>Arbitration Act 2055 (1999)</strong>{" "}
              of Nepal before any court proceedings are initiated.
            </p>
          </div>

          {/* 10 */}
          <div className="fwl-section" id="changes">
            <div className="fwl-section__head">
              <span className="fwl-section__num">10</span>
              <h2 className="fwl-section__title">Changes to Terms</h2>
            </div>
            <p>
              FutureWork reserves the right to modify these Terms and Conditions
              at any time. When we make changes, we will update the "Last
              Updated" date at the top of this page and, where appropriate,
              notify registered users by email.
            </p>
            <p>
              Your continued use of the platform after any changes constitutes
              your acceptance of the revised terms. We encourage you to review
              these terms periodically. If you do not agree to the revised
              terms, you should discontinue use of our platform.
            </p>
          </div>

          {/* Contact box */}
          <div className="fwl-contact-box">
            <div className="fwl-contact-box__text">
              <h4>Questions about our Terms?</h4>
              <p>
                Our team is happy to clarify anything. Reach out to us directly.
              </p>
            </div>
            <Link to="/contact" className="fwl-contact-box__btn">
              Contact Us <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>
      </div>

      <FutureFooter />
    </div>
  );
};

export default TermsAndConditions;

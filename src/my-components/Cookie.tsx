// ============================================================
//  CookiePolicy.tsx — FutureWork
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

  .fwc-root {
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
  .fwc-root, .fwc-root * { font-family: var(--sans); box-sizing: border-box; }
  .fwc-root { background: var(--surface); }

  /* ── Banner ── */
  .fwc-banner {
    position: relative; overflow: hidden;
    background: var(--navy);
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
    font-family: var(--serif);
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
  .fwc-banner__crumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.15s; }
  .fwc-banner__crumb a:hover { color: #7dd8e4; }
  .fwc-banner__crumb li:last-child { color: rgba(255,255,255,0.35); }

  /* ── Layout ── */
  .fwc-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 60px 20px 100px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .fwc-layout { grid-template-columns: 1fr; }
  }

  /* ── Sidebar TOC ── */
  .fwc-toc {
    position: sticky; top: 90px;
    background: var(--white);
    border: 1.5px solid var(--rule);
    border-radius: var(--r-lg);
    padding: 24px 20px;
    box-shadow: 0 2px 8px rgba(37,32,96,0.04);
  }
  @media (max-width: 900px) { .fwc-toc { position: static; } }
  .fwc-toc__title {
    font-size: 9px; font-weight: 800; letter-spacing: 1.3px;
    text-transform: uppercase; color: var(--teal);
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .fwc-toc__title::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
  .fwc-toc__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
  .fwc-toc__item {
    font-size: 13px; color: var(--ink-3); padding: 7px 10px;
    border-radius: 8px; cursor: pointer; transition: all 0.15s;
    font-weight: 500; border: 1px solid transparent;
    display: flex; align-items: center; gap: 8px; text-decoration: none;
  }
  .fwc-toc__item:hover { color: var(--navy); background: var(--navy-faint); }
  .fwc-toc__item.active { color: var(--teal); background: var(--teal-faint); border-color: rgba(28,148,164,0.2); font-weight: 600; }
  .fwc-toc__num { font-size: 10px; font-weight: 700; color: var(--ink-4); width: 18px; flex-shrink: 0; }
  .fwc-toc__updated {
    margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--rule);
    font-size: 11px; color: var(--ink-4); line-height: 1.6;
  }
  .fwc-toc__updated strong { color: var(--ink-3); display: block; margin-bottom: 2px; }

  /* ── Content ── */
  .fwc-content {
    background: var(--white);
    border: 1.5px solid var(--rule);
    border-radius: var(--r-lg);
    padding: 48px 52px;
    box-shadow: 0 2px 8px rgba(37,32,96,0.04);
  }
  @media (max-width: 700px) { .fwc-content { padding: 28px 22px; } }

  .fwc-content__intro {
    padding: 20px 22px;
    background: var(--teal-faint);
    border: 1px solid rgba(28,148,164,0.18);
    border-left: 3px solid var(--teal);
    border-radius: 0 var(--r) var(--r) 0;
    font-size: 14.5px; color: var(--ink-3); line-height: 1.75;
    margin-bottom: 40px;
  }
  .fwc-content__intro strong { color: var(--navy); }

  .fwc-section { margin-bottom: 44px; scroll-margin-top: 100px; }
  .fwc-section:last-of-type { margin-bottom: 0; }

  .fwc-section__head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1.5px solid var(--rule);
  }
  .fwc-section__num {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--navy); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
  }
  .fwc-section__title {
    font-family: var(--serif); font-size: 20px;
    color: var(--navy); margin: 0; line-height: 1.2;
  }

  .fwc-section p {
    font-size: 14.5px; color: var(--ink-3); line-height: 1.8;
    margin-bottom: 14px;
  }
  .fwc-section p:last-child { margin-bottom: 0; }
  .fwc-section strong { color: var(--navy); font-weight: 700; }

  .fwc-list {
    list-style: none; padding: 0; margin: 0 0 14px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .fwc-list li {
    font-size: 14px; color: var(--ink-3); line-height: 1.7;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .fwc-list li::before {
    content: '→'; color: var(--teal); font-size: 12px;
    flex-shrink: 0; margin-top: 3px;
  }

  .fwc-highlight {
    background: var(--navy-faint);
    border: 1px solid var(--rule);
    border-radius: var(--r);
    padding: 16px 20px;
    margin: 16px 0;
  }
  .fwc-highlight p { margin: 0; font-size: 14px; }

  .fwc-table {
    width: 100%; border-collapse: collapse; margin: 16px 0 14px;
    font-size: 13.5px;
  }
  .fwc-table th {
    background: var(--navy); color: #fff;
    padding: 10px 14px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
  }
  .fwc-table th:first-child { border-radius: 8px 0 0 0; }
  .fwc-table th:last-child { border-radius: 0 8px 0 0; }
  .fwc-table td {
    padding: 10px 14px; color: var(--ink-3); line-height: 1.6;
    border-bottom: 1px solid var(--rule);
  }
  .fwc-table tr:last-child td { border-bottom: none; }
  .fwc-table tr:nth-child(even) td { background: var(--navy-faint); }

  .fwc-contact-box {
    margin-top: 40px;
    background: var(--navy);
    border-radius: var(--r-lg);
    padding: 32px 36px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 20px; flex-wrap: wrap;
  }
  .fwc-contact-box__text h4 {
    font-family: var(--serif); font-size: 22px;
    color: #fff; margin: 0 0 6px;
  }
  .fwc-contact-box__text p { font-size: 13.5px; color: rgba(255,255,255,0.55); margin: 0; }
  .fwc-contact-box__btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 24px; border-radius: var(--r);
    background: var(--teal); color: #fff; border: none;
    font-size: 13.5px; font-weight: 700; font-family: var(--sans);
    text-decoration: none; transition: background 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .fwc-contact-box__btn:hover { background: #157a88; transform: translateY(-1px); color: #fff; }
`;

function injectStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fwc-cookie-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fwc-cookie-styles";
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
}

const SECTIONS = [
  { id: "what-are-cookies", num: "01", title: "What Are Cookies" },
  { id: "how-we-use", num: "02", title: "How We Use Cookies" },
  { id: "types-of-cookies", num: "03", title: "Types of Cookies" },
  { id: "third-party-cookies", num: "04", title: "Third-Party Cookies" },
  { id: "managing-cookies", num: "05", title: "Managing Cookies" },
  { id: "cookie-table", num: "06", title: "Cookie Reference Table" },
  { id: "local-storage", num: "07", title: "Local Storage & Similar" },
  { id: "updates", num: "08", title: "Updates to This Policy" },
];

const CookiePolicy = () => {
  injectStyles();
  const [loginModal, setLoginModal] = useState(false);
  const [activeSection, setActiveSection] = useState("what-are-cookies");
  const { session } = useClientSession();

  return (
    <div className="fwc-root">
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      {/* Banner */}
      <div className="fwc-banner">
        <div
          className="fwc-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwc-banner__inner">
          <h2 className="fwc-banner__title">
            Cookie <em>Policy</em>
          </h2>
          <ul className="fwc-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>

      {/* Layout */}
      <div className="fwc-layout">
        {/* Sidebar */}
        <aside className="fwc-toc">
          <div className="fwc-toc__title">Contents</div>
          <ul className="fwc-toc__list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  className={`fwc-toc__item${activeSection === s.id ? " active" : ""}`}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <span className="fwc-toc__num">{s.num}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="fwc-toc__updated">
            <strong>Last Updated</strong>
            June 1, 2025
          </div>
        </aside>

        {/* Content */}
        <div className="fwc-content">
          <div className="fwc-content__intro">
            This Cookie Policy explains how{" "}
            <strong>FutureWork Pvt. Ltd.</strong> uses cookies and similar
            tracking technologies when you visit our website or use our real
            estate platform. By continuing to use our platform, you consent to
            the use of cookies as described in this policy. You can manage your
            preferences at any time through your browser settings.
          </div>

          {/* 01 */}
          <div className="fwc-section" id="what-are-cookies">
            <div className="fwc-section__head">
              <span className="fwc-section__num">01</span>
              <h2 className="fwc-section__title">What Are Cookies</h2>
            </div>
            <p>
              Cookies are small text files that are placed on your device —
              computer, tablet, or mobile — when you visit a website. They are
              widely used to make websites work efficiently, improve user
              experience, and provide information to site owners.
            </p>
            <p>
              Cookies do not contain personal information such as your name or
              payment details. They typically store a unique identifier that
              links your browser session to information held on the website's
              server. Cookies can be <strong>session cookies</strong> (deleted
              when you close your browser) or{" "}
              <strong>persistent cookies</strong> (stored on your device for a
              set period).
            </p>
          </div>

          {/* 02 */}
          <div className="fwc-section" id="how-we-use">
            <div className="fwc-section__head">
              <span className="fwc-section__num">02</span>
              <h2 className="fwc-section__title">How We Use Cookies</h2>
            </div>
            <p>
              FutureWork uses cookies to provide a smooth and personalised
              experience on our real estate platform. Specifically, we use
              cookies to:
            </p>
            <ul className="fwc-list">
              <li>
                Keep you signed in to your FutureWork account across sessions so
                you do not need to log in on every visit.
              </li>
              <li>
                Remember your property search preferences, filters, and saved
                listings for a more personalised browsing experience.
              </li>
              <li>
                Understand how users navigate our platform so we can improve
                search results, listing pages, and overall usability.
              </li>
              <li>
                Measure the effectiveness of our marketing campaigns and
                understand which channels bring users to our platform.
              </li>
              <li>
                Detect and prevent fraudulent activity and protect the security
                of your account.
              </li>
              <li>
                Deliver relevant property recommendations and advertisements
                based on your browsing behaviour on our platform.
              </li>
            </ul>
          </div>

          {/* 03 */}
          <div className="fwc-section" id="types-of-cookies">
            <div className="fwc-section__head">
              <span className="fwc-section__num">03</span>
              <h2 className="fwc-section__title">Types of Cookies</h2>
            </div>
            <p>
              We categorise the cookies we use into four types based on their
              purpose:
            </p>
            <ul className="fwc-list">
              <li>
                <strong>Strictly Necessary Cookies:</strong> Essential for the
                platform to function. These include cookies that manage your
                login session, maintain security, and enable core features such
                as property search and enquiry submission. These cannot be
                disabled.
              </li>
              <li>
                <strong>Functional Cookies:</strong> Enable enhanced features
                and personalisation, such as remembering your preferred property
                type, location filters, and display currency. Disabling these
                may affect your experience.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors interact with our platform by collecting anonymous
                information about pages visited, time spent, and navigation
                paths. We use this data to improve the platform.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to track visitors
                across websites to display relevant property listings and
                advertisements. These are set by our advertising partners and
                governed by their own privacy policies.
              </li>
            </ul>
            <div className="fwc-highlight">
              <p>
                <strong>Note:</strong> You may opt out of functional, analytics,
                and marketing cookies at any time. Strictly necessary cookies
                cannot be disabled as they are essential to providing our
                service.
              </p>
            </div>
          </div>

          {/* 04 */}
          <div className="fwc-section" id="third-party-cookies">
            <div className="fwc-section__head">
              <span className="fwc-section__num">04</span>
              <h2 className="fwc-section__title">Third-Party Cookies</h2>
            </div>
            <p>
              Some cookies on our platform are set by trusted third-party
              services that we use to enhance our platform's functionality and
              measure performance. These third parties may include:
            </p>
            <ul className="fwc-list">
              <li>
                <strong>Google Analytics</strong> — for platform usage analytics
                and user behaviour insights. Google's use of data is governed by
                Google's Privacy Policy.
              </li>
              <li>
                <strong>Google Maps</strong> — for interactive property location
                maps embedded within listings across Nepal.
              </li>
              <li>
                <strong>Facebook Pixel</strong> — to measure the effectiveness
                of our advertising campaigns and deliver relevant property ads
                to users on Facebook and Instagram.
              </li>
              <li>
                <strong>Intercom</strong> — for our live chat and customer
                support features.
              </li>
            </ul>
            <p>
              FutureWork does not control third-party cookies. We encourage you
              to review the privacy and cookie policies of these third parties
              directly. We are not responsible for the content of their policies
              or their use of your data.
            </p>
          </div>

          {/* 05 */}
          <div className="fwc-section" id="managing-cookies">
            <div className="fwc-section__head">
              <span className="fwc-section__num">05</span>
              <h2 className="fwc-section__title">Managing Cookies</h2>
            </div>
            <p>
              You have full control over the cookies stored on your device. You
              can manage, restrict, or delete cookies at any time through your
              browser settings. Please note that disabling certain cookies may
              affect the functionality of our platform.
            </p>
            <ul className="fwc-list">
              <li>
                <strong>Google Chrome:</strong> Settings → Privacy and Security
                → Cookies and other site data.
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> Options → Privacy & Security →
                Cookies and Site Data.
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website
                Data.
              </li>
              <li>
                <strong>Microsoft Edge:</strong> Settings → Cookies and site
                permissions → Manage and delete cookies.
              </li>
            </ul>
            <p>
              For mobile devices, cookie management settings are typically found
              within the browser app's settings or your device's privacy
              settings. You can also opt out of interest-based advertising from
              participating companies through the{" "}
              <strong>Network Advertising Initiative</strong> or{" "}
              <strong>Digital Advertising Alliance</strong> opt-out tools.
            </p>
          </div>

          {/* 06 */}
          <div className="fwc-section" id="cookie-table">
            <div className="fwc-section__head">
              <span className="fwc-section__num">06</span>
              <h2 className="fwc-section__title">Cookie Reference Table</h2>
            </div>
            <p>
              The following table lists the primary cookies used on the
              FutureWork platform, their purpose, and their retention period:
            </p>
            <table className="fwc-table">
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>fw_session</td>
                  <td>Necessary</td>
                  <td>Maintains your login session on the platform</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>fw_auth_token</td>
                  <td>Necessary</td>
                  <td>Secure authentication token for account access</td>
                  <td>30 days</td>
                </tr>
                <tr>
                  <td>fw_prefs</td>
                  <td>Functional</td>
                  <td>Stores your search preferences and filters</td>
                  <td>90 days</td>
                </tr>
                <tr>
                  <td>fw_saved_search</td>
                  <td>Functional</td>
                  <td>Remembers your saved property searches</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>_ga</td>
                  <td>Analytics</td>
                  <td>Google Analytics — distinguishes unique users</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Analytics</td>
                  <td>Google Analytics — stores and updates a unique value</td>
                  <td>24 hours</td>
                </tr>
                <tr>
                  <td>_fbp</td>
                  <td>Marketing</td>
                  <td>
                    Facebook Pixel — tracks ad conversions and retargeting
                  </td>
                  <td>90 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 07 */}
          <div className="fwc-section" id="local-storage">
            <div className="fwc-section__head">
              <span className="fwc-section__num">07</span>
              <h2 className="fwc-section__title">
                Local Storage & Similar Technologies
              </h2>
            </div>
            <p>
              In addition to cookies, FutureWork may use other browser-based
              storage technologies including <strong>localStorage</strong> and{" "}
              <strong>sessionStorage</strong>. These function similarly to
              cookies but store data directly in your browser without an expiry
              date set by the server.
            </p>
            <ul className="fwc-list">
              <li>
                We use localStorage to store your recently viewed property
                listings, language preferences, and UI settings such as map or
                list view toggles.
              </li>
              <li>
                sessionStorage is used to maintain temporary state during your
                browsing session, such as property comparison selections and
                multi-step enquiry form data.
              </li>
              <li>
                You can clear local and session storage through your browser's
                developer tools or by clearing your browser's site data in
                privacy settings.
              </li>
            </ul>
          </div>

          {/* 08 */}
          <div className="fwc-section" id="updates">
            <div className="fwc-section__head">
              <span className="fwc-section__num">08</span>
              <h2 className="fwc-section__title">Updates to This Policy</h2>
            </div>
            <p>
              FutureWork may update this Cookie Policy from time to time to
              reflect changes in the cookies we use, changes in applicable law,
              or changes in our business practices. When we update this policy,
              we will revise the "Last Updated" date shown in the sidebar.
            </p>
            <p>
              We encourage you to review this Cookie Policy periodically. Where
              changes are material, we may also notify registered users by email
              or via a notice on our platform. Continued use of FutureWork
              following any update constitutes your acceptance of the revised
              policy.
            </p>
          </div>

          {/* Contact box */}
          <div className="fwc-contact-box">
            <div className="fwc-contact-box__text">
              <h4>Questions about our Cookie Policy?</h4>
              <p>
                Our team is happy to explain how we use cookies. Get in touch
                any time.
              </p>
            </div>
            <Link to="/contact" className="fwc-contact-box__btn">
              Contact Us <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>
      </div>

      <FutureFooter />
    </div>
  );
};

export default CookiePolicy;

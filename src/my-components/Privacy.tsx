// ============================================================
//  PrivacyPolicy.tsx — FutureWork
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

  .fwp-root {
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
  .fwp-root, .fwp-root * { font-family: var(--sans); box-sizing: border-box; }
  .fwp-root { background: var(--surface); }

  /* ── Banner ── */
  .fwp-banner {
    position: relative; overflow: hidden;
    background: var(--navy);
  }
  .fwp-banner__bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    opacity: 0.18;
  }
  .fwp-banner__inner {
    position: relative; z-index: 2;
    padding: 80px 20px 72px;
    text-align: center;
  }
  .fwp-banner__title {
    font-family: var(--serif);
    font-size: clamp(32px, 5vw, 54px);
    color: #fff; letter-spacing: -0.5px;
    margin: 0 0 18px; line-height: 1.1;
  }
  .fwp-banner__title em { color: #7dd8e4; font-style: italic; }
  .fwp-banner__crumb {
    list-style: none; padding: 0; margin: 0;
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; color: rgba(255,255,255,0.5);
  }
  .fwp-banner__crumb a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.15s; }
  .fwp-banner__crumb a:hover { color: #7dd8e4; }
  .fwp-banner__crumb li:last-child { color: rgba(255,255,255,0.35); }

  /* ── Layout ── */
  .fwp-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 60px 20px 100px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .fwp-layout { grid-template-columns: 1fr; }
  }

  /* ── Sidebar TOC ── */
  .fwp-toc {
    position: sticky; top: 90px;
    background: var(--white);
    border: 1.5px solid var(--rule);
    border-radius: var(--r-lg);
    padding: 24px 20px;
    box-shadow: 0 2px 8px rgba(37,32,96,0.04);
  }
  @media (max-width: 900px) { .fwp-toc { position: static; } }
  .fwp-toc__title {
    font-size: 9px; font-weight: 800; letter-spacing: 1.3px;
    text-transform: uppercase; color: var(--teal);
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .fwp-toc__title::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
  .fwp-toc__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
  .fwp-toc__item {
    font-size: 13px; color: var(--ink-3); padding: 7px 10px;
    border-radius: 8px; cursor: pointer; transition: all 0.15s;
    font-weight: 500; border: 1px solid transparent;
    display: flex; align-items: center; gap: 8px; text-decoration: none;
  }
  .fwp-toc__item:hover { color: var(--navy); background: var(--navy-faint); }
  .fwp-toc__item.active { color: var(--teal); background: var(--teal-faint); border-color: rgba(28,148,164,0.2); font-weight: 600; }
  .fwp-toc__num { font-size: 10px; font-weight: 700; color: var(--ink-4); width: 18px; flex-shrink: 0; }
  .fwp-toc__updated {
    margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--rule);
    font-size: 11px; color: var(--ink-4); line-height: 1.6;
  }
  .fwp-toc__updated strong { color: var(--ink-3); display: block; margin-bottom: 2px; }

  /* ── Content ── */
  .fwp-content {
    background: var(--white);
    border: 1.5px solid var(--rule);
    border-radius: var(--r-lg);
    padding: 48px 52px;
    box-shadow: 0 2px 8px rgba(37,32,96,0.04);
  }
  @media (max-width: 700px) { .fwp-content { padding: 28px 22px; } }

  .fwp-content__intro {
    padding: 20px 22px;
    background: var(--teal-faint);
    border: 1px solid rgba(28,148,164,0.18);
    border-left: 3px solid var(--teal);
    border-radius: 0 var(--r) var(--r) 0;
    font-size: 14.5px; color: var(--ink-3); line-height: 1.75;
    margin-bottom: 40px;
  }
  .fwp-content__intro strong { color: var(--navy); }

  .fwp-section { margin-bottom: 44px; scroll-margin-top: 100px; }
  .fwp-section:last-of-type { margin-bottom: 0; }

  .fwp-section__head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1.5px solid var(--rule);
  }
  .fwp-section__num {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--navy); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
  }
  .fwp-section__title {
    font-family: var(--serif); font-size: 20px;
    color: var(--navy); margin: 0; line-height: 1.2;
  }

  .fwp-section p {
    font-size: 14.5px; color: var(--ink-3); line-height: 1.8;
    margin-bottom: 14px;
  }
  .fwp-section p:last-child { margin-bottom: 0; }
  .fwp-section strong { color: var(--navy); font-weight: 700; }

  .fwp-list {
    list-style: none; padding: 0; margin: 0 0 14px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .fwp-list li {
    font-size: 14px; color: var(--ink-3); line-height: 1.7;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .fwp-list li::before {
    content: '→'; color: var(--teal); font-size: 12px;
    flex-shrink: 0; margin-top: 3px;
  }

  .fwp-highlight {
    background: var(--navy-faint);
    border: 1px solid var(--rule);
    border-radius: var(--r);
    padding: 16px 20px;
    margin: 16px 0;
  }
  .fwp-highlight p { margin: 0; font-size: 14px; }

  .fwp-contact-box {
    margin-top: 40px;
    background: var(--navy);
    border-radius: var(--r-lg);
    padding: 32px 36px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 20px; flex-wrap: wrap;
  }
  .fwp-contact-box__text h4 {
    font-family: var(--serif); font-size: 22px;
    color: #fff; margin: 0 0 6px;
  }
  .fwp-contact-box__text p { font-size: 13.5px; color: rgba(255,255,255,0.55); margin: 0; }
  .fwp-contact-box__btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 24px; border-radius: var(--r);
    background: var(--teal); color: #fff; border: none;
    font-size: 13.5px; font-weight: 700; font-family: var(--sans);
    text-decoration: none; transition: background 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .fwp-contact-box__btn:hover { background: #157a88; transform: translateY(-1px); color: #fff; }
`;

function injectStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fwp-privacy-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fwp-privacy-styles";
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
}

const SECTIONS = [
  { id: "information-we-collect", num: "01", title: "Information We Collect" },
  { id: "how-we-use", num: "02", title: "How We Use Your Information" },
  { id: "sharing-data", num: "03", title: "Sharing Your Data" },
  { id: "data-retention", num: "04", title: "Data Retention" },
  { id: "your-rights", num: "05", title: "Your Rights" },
  { id: "data-security", num: "06", title: "Data Security" },
  { id: "children", num: "07", title: "Children's Privacy" },
  { id: "third-party-links", num: "08", title: "Third-Party Links" },
  { id: "transfers", num: "09", title: "International Transfers" },
  { id: "changes", num: "10", title: "Changes to This Policy" },
];

const PrivacyPolicy = () => {
  injectStyles();
  const [loginModal, setLoginModal] = useState(false);
  const [activeSection, setActiveSection] = useState("information-we-collect");
  const { session } = useClientSession();

  return (
    <div className="fwp-root">
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      {/* Banner */}
      <div className="fwp-banner">
        <div
          className="fwp-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwp-banner__inner">
          <h2 className="fwp-banner__title">
            Privacy <em>Policy</em>
          </h2>
          <ul className="fwp-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Layout */}
      <div className="fwp-layout">
        {/* Sidebar */}
        <aside className="fwp-toc">
          <div className="fwp-toc__title">Contents</div>
          <ul className="fwp-toc__list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  className={`fwp-toc__item${activeSection === s.id ? " active" : ""}`}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <span className="fwp-toc__num">{s.num}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="fwp-toc__updated">
            <strong>Last Updated</strong>
            June 1, 2025
          </div>
        </aside>

        {/* Content */}
        <div className="fwp-content">
          <div className="fwp-content__intro">
            This Privacy Policy describes how{" "}
            <strong>FutureWork Pvt. Ltd.</strong> collects, uses, stores, and
            protects your personal information when you use our real estate
            platform in Nepal. We are committed to handling your data
            responsibly and in compliance with applicable Nepali law. By using
            FutureWork, you consent to the practices described in this policy.
          </div>

          {/* 01 */}
          <div className="fwp-section" id="information-we-collect">
            <div className="fwp-section__head">
              <span className="fwp-section__num">01</span>
              <h2 className="fwp-section__title">Information We Collect</h2>
            </div>
            <p>
              We collect information you provide directly, information generated
              through your use of our platform, and information from third
              parties. The categories of data we collect include:
            </p>
            <ul className="fwp-list">
              <li>
                <strong>Account Information:</strong> Your name, email address,
                phone number, and password when you register for a FutureWork
                account.
              </li>
              <li>
                <strong>Profile Information:</strong> Your profile photo,
                preferred property types, location preferences, and any
                additional details you choose to provide.
              </li>
              <li>
                <strong>Listing Data:</strong> Property details, photographs,
                pricing, and documentation submitted when you create a property
                listing on our platform.
              </li>
              <li>
                <strong>Transaction Information:</strong> Records of enquiries,
                negotiations, and transactions facilitated through FutureWork,
                including contact between buyers, sellers, and agents.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, search queries,
                filters applied, listings viewed, time spent on the platform,
                and navigation patterns collected automatically.
              </li>
              <li>
                <strong>Device & Technical Data:</strong> IP address, browser
                type and version, operating system, device identifiers, and
                referral URLs.
              </li>
              <li>
                <strong>Communication Data:</strong> Messages sent through our
                platform's enquiry system, support tickets, and any feedback you
                submit.
              </li>
            </ul>
          </div>

          {/* 02 */}
          <div className="fwp-section" id="how-we-use">
            <div className="fwp-section__head">
              <span className="fwp-section__num">02</span>
              <h2 className="fwp-section__title">
                How We Use Your Information
              </h2>
            </div>
            <p>
              FutureWork uses the information we collect for the following
              purposes:
            </p>
            <ul className="fwp-list">
              <li>
                To create and manage your account and provide access to our
                platform's features including property search, listing, and
                enquiry services.
              </li>
              <li>
                To connect buyers, sellers, tenants, and agents and facilitate
                property transactions across Nepal.
              </li>
              <li>
                To personalise your experience by recommending relevant property
                listings based on your search history and preferences.
              </li>
              <li>
                To send you service communications including account
                notifications, listing updates, and enquiry responses.
              </li>
              <li>
                To send you marketing communications about new listings,
                platform features, and real estate insights where you have given
                consent. You may opt out at any time.
              </li>
              <li>
                To improve our platform by analysing usage patterns, identifying
                technical issues, and conducting internal research and
                analytics.
              </li>
              <li>
                To detect, investigate, and prevent fraudulent activity,
                unauthorised access, and violations of our Terms and Conditions.
              </li>
              <li>
                To comply with our legal obligations under applicable Nepali
                law.
              </li>
            </ul>
          </div>

          {/* 03 */}
          <div className="fwp-section" id="sharing-data">
            <div className="fwp-section__head">
              <span className="fwp-section__num">03</span>
              <h2 className="fwp-section__title">Sharing Your Data</h2>
            </div>
            <p>
              FutureWork does not sell your personal information to third
              parties. We share your data only in the following circumstances:
            </p>
            <ul className="fwp-list">
              <li>
                <strong>With Other Users:</strong> When you submit an enquiry or
                initiate contact, your name and contact details are shared with
                the relevant property owner, seller, or agent to facilitate the
                transaction.
              </li>
              <li>
                <strong>With Service Providers:</strong> Trusted third-party
                vendors who assist us in operating our platform, including cloud
                hosting, analytics, payment processing, and customer support,
                under strict data processing agreements.
              </li>
              <li>
                <strong>With Financial Partners:</strong> Licensed Nepali banks
                and financial institutions through our home loan facilitation
                service, where you have expressly requested this.
              </li>
              <li>
                <strong>With Legal and Regulatory Authorities:</strong> Where
                required by law, court order, or governmental authority under
                applicable Nepali law.
              </li>
              <li>
                <strong>In Business Transfers:</strong> In the event of a
                merger, acquisition, or sale of all or part of FutureWork's
                business, user data may be transferred as part of that
                transaction.
              </li>
            </ul>
            <div className="fwp-highlight">
              <p>
                <strong>Important:</strong> All third-party service providers
                who process your data on our behalf are contractually bound to
                protect your information and use it only for the purposes we
                specify.
              </p>
            </div>
          </div>

          {/* 04 */}
          <div className="fwp-section" id="data-retention">
            <div className="fwp-section__head">
              <span className="fwp-section__num">04</span>
              <h2 className="fwp-section__title">Data Retention</h2>
            </div>
            <p>
              We retain your personal information for as long as your account
              remains active or as needed to provide our services. Specific
              retention periods include:
            </p>
            <ul className="fwp-list">
              <li>
                <strong>Account Data:</strong> Retained for the duration of your
                account and for up to 3 years after account closure for legal
                and dispute resolution purposes.
              </li>
              <li>
                <strong>Transaction Records:</strong> Retained for a minimum of
                7 years in accordance with Nepali financial record-keeping
                requirements.
              </li>
              <li>
                <strong>Usage & Analytics Data:</strong> Retained in aggregated
                or anonymised form for up to 2 years for platform improvement
                purposes.
              </li>
              <li>
                <strong>Marketing Preferences:</strong> Retained until you
                withdraw your consent or close your account.
              </li>
            </ul>
            <p>
              When data is no longer required, we securely delete or anonymise
              it. You may request deletion of your account and personal data at
              any time, subject to our legal retention obligations.
            </p>
          </div>

          {/* 05 */}
          <div className="fwp-section" id="your-rights">
            <div className="fwp-section__head">
              <span className="fwp-section__num">05</span>
              <h2 className="fwp-section__title">Your Rights</h2>
            </div>
            <p>
              You have the following rights regarding your personal information
              held by FutureWork. To exercise any of these rights, please
              contact us at the details provided below.
            </p>
            <ul className="fwp-list">
              <li>
                <strong>Right of Access:</strong> You may request a copy of the
                personal information we hold about you.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You may request that we
                correct any inaccurate or incomplete personal information.
              </li>
              <li>
                <strong>Right to Erasure:</strong> You may request deletion of
                your personal data where it is no longer necessary for the
                purpose it was collected, subject to our legal obligations.
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Where processing is
                based on consent, you may withdraw it at any time without
                affecting the lawfulness of prior processing.
              </li>
              <li>
                <strong>Right to Object:</strong> You may object to the
                processing of your data for direct marketing purposes at any
                time by using the unsubscribe link in our emails or by
                contacting us directly.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You may request your
                data in a structured, machine-readable format where technically
                feasible.
              </li>
            </ul>
            <p>
              We will respond to all valid requests within{" "}
              <strong>30 days</strong>. We may need to verify your identity
              before processing a request.
            </p>
          </div>

          {/* 06 */}
          <div className="fwp-section" id="data-security">
            <div className="fwp-section__head">
              <span className="fwp-section__num">06</span>
              <h2 className="fwp-section__title">Data Security</h2>
            </div>
            <p>
              FutureWork takes the security of your personal information
              seriously. We implement technical and organisational measures to
              protect your data against unauthorised access, loss, alteration,
              or disclosure.
            </p>
            <ul className="fwp-list">
              <li>
                All data transmitted between your browser and our servers is
                encrypted using <strong>TLS (Transport Layer Security)</strong>.
              </li>
              <li>
                Passwords are stored using industry-standard one-way hashing
                algorithms. FutureWork staff cannot view your password.
              </li>
              <li>
                Access to personal data within our organisation is restricted on
                a need-to-know basis and subject to confidentiality obligations.
              </li>
              <li>
                We conduct regular security reviews and penetration testing of
                our platform infrastructure.
              </li>
            </ul>
            <p>
              Despite these measures, no system is completely secure. In the
              event of a data breach that affects your rights or freedoms, we
              will notify you and the relevant authorities as required by
              applicable Nepali law.
            </p>
          </div>

          {/* 07 */}
          <div className="fwp-section" id="children">
            <div className="fwp-section__head">
              <span className="fwp-section__num">07</span>
              <h2 className="fwp-section__title">Children's Privacy</h2>
            </div>
            <p>
              FutureWork's platform and services are not directed at individuals
              under the age of <strong>18</strong>. We do not knowingly collect
              personal information from minors. If you are a parent or guardian
              and believe that your child has provided us with personal
              information, please contact us immediately.
            </p>
            <p>
              Upon receiving such a request, we will take prompt steps to delete
              the information from our records. If we become aware that we have
              collected data from a person under 18, we will delete that data
              without delay.
            </p>
          </div>

          {/* 08 */}
          <div className="fwp-section" id="third-party-links">
            <div className="fwp-section__head">
              <span className="fwp-section__num">08</span>
              <h2 className="fwp-section__title">Third-Party Links</h2>
            </div>
            <p>
              Our platform may contain links to third-party websites, services,
              or applications — such as partnered banks, legal services, or
              social media platforms. FutureWork is not responsible for the
              privacy practices of these third parties.
            </p>
            <p>
              We encourage you to review the privacy policies of any third-party
              site you visit. The inclusion of a link on our platform does not
              constitute an endorsement of that site's privacy practices or
              content.
            </p>
          </div>

          {/* 09 */}
          <div className="fwp-section" id="transfers">
            <div className="fwp-section__head">
              <span className="fwp-section__num">09</span>
              <h2 className="fwp-section__title">International Transfers</h2>
            </div>
            <p>
              FutureWork primarily stores and processes your data within Nepal.
              However, some of our third-party service providers — such as cloud
              infrastructure and analytics platforms — may process data outside
              of Nepal.
            </p>
            <p>
              Where data is transferred internationally, we ensure that
              appropriate safeguards are in place, including contractual
              obligations with service providers that require them to protect
              your data to a standard equivalent to or exceeding that required
              under Nepali law. By using our platform, you consent to such
              transfers where they are necessary for service delivery.
            </p>
          </div>

          {/* 10 */}
          <div className="fwp-section" id="changes">
            <div className="fwp-section__head">
              <span className="fwp-section__num">10</span>
              <h2 className="fwp-section__title">Changes to This Policy</h2>
            </div>
            <p>
              FutureWork may update this Privacy Policy periodically to reflect
              changes in our data practices, legal requirements, or platform
              features. When we make changes, we will update the "Last Updated"
              date shown in the sidebar.
            </p>
            <p>
              Where changes are material, we will notify registered users by
              email or via a prominent notice on the platform prior to the
              change taking effect. We encourage you to review this policy
              regularly. Continued use of our platform following any update
              constitutes acceptance of the revised policy.
            </p>
          </div>

          {/* Contact box */}
          <div className="fwp-contact-box">
            <div className="fwp-contact-box__text">
              <h4>Questions about your data?</h4>
              <p>
                Our data team is here to help with any privacy queries or
                requests.
              </p>
            </div>
            <Link to="/contact" className="fwp-contact-box__btn">
              Contact Us <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>
      </div>

      <FutureFooter />
    </div>
  );
};

export default PrivacyPolicy;

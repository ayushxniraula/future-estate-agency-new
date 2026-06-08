// ============================================================
//  ContactArea.tsx  — EstateAdmin client-side contact section
//  Supabase-integrated, real-estate fields, no theme changes
// ============================================================
import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

// ─── Supabase config (mirror of config.js) ─────────────────
const SUPABASE_URL = "https://wzttfewbiiakxkmgzfre.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dHRmZXdiaWlha3hrbWd6ZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY0MjksImV4cCI6MjA5NTM2MjQyOX0.-00zf6PqvccpLvBGxy4FtveqX5mCeGXJbC-ZF8ziEBk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Types ───────────────────────────────────────────────────
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  subject: string;
  message: string;
  inquiry_type: string;
  preferred_contact: string;
  preferred_time: string;
  budget_min: string;
  budget_max: string;
  move_timeline: string;
  property_id?: string;
  property_name?: string;
}

interface ContactAreaProps {
  linkedPropertyId?: string;
  linkedPropertyName?: string;
}

const INITIAL: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  subject: "",
  message: "",
  inquiry_type: "",
  preferred_contact: "",
  preferred_time: "",
  budget_min: "",
  budget_max: "",
  move_timeline: "",
};

// ─── Creative side panel data ─────────────────────────────────
const STATS = [
  { value: "1,200+", label: "Properties Listed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15 yrs", label: "Market Experience" },
  { value: "48 hr", label: "Avg. Response Time" },
];

const PROMISES = [
  {
    icon: "🔒",
    title: "Your privacy, protected",
    desc: "We never share your details with third parties.",
  },
  {
    icon: "⚡",
    title: "Fast, personal replies",
    desc: "A real agent — not a bot — responds within 48 hours.",
  },
  {
    icon: "🧭",
    title: "Expert local guidance",
    desc: "15 years navigating this market, district by district.",
  },
  {
    icon: "💼",
    title: "End-to-end support",
    desc: "From first inquiry to keys in hand, we're with you.",
  },
];

// ─── Component ───────────────────────────────────────────────
const ContactArea = ({
  linkedPropertyId,
  linkedPropertyName,
}: ContactAreaProps) => {
  const [form, setForm] = useState<ContactFormData>({
    ...INITIAL,
    property_id: linkedPropertyId ?? "",
    property_name: linkedPropertyName ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const set =
    (k: keyof ContactFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim() || !form.email.includes("@"))
      return setError("Please enter a valid email address.");
    if (!form.inquiry_type) return setError("Please select an inquiry type.");
    if (!form.message.trim()) return setError("Please enter your message.");

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        subject: form.subject.trim() || form.inquiry_type,
        message: form.message.trim(),
        inquiry_type: form.inquiry_type,
        preferred_contact: form.preferred_contact || null,
        preferred_time: form.preferred_time || null,
        budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        move_timeline: form.move_timeline || null,
        property_id: form.property_id || null,
        property_name: form.property_name || null,
        source: "website",
        status: "new",
        priority: "normal",
      };

      const { error: sbError } = await supabase
        .from("contacts")
        .insert([payload]);

      if (sbError) throw sbError;
      setSuccess(true);
      setForm({ ...INITIAL });
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed.";
      setError("Something went wrong: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-us border-op xl-mt-100 lg-pt-60">
      {/* ── Header ── */}
      <div className="inner-banner-three inner-banner text-center z-1 position-relative">
        <div
          className="bg-wrapper overflow-hidden position-relative z-1"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        >
          <div className="container position-relative z-2">
            <h2 className="mb-35 xl-mb-20 md-mb-10 pt-15 font-garamond text-white">
              Contact
            </h2>
            <ul className="theme-breadcrumb style-none d-inline-flex align-items-center justify-content-center position-relative z-1 bottom-line">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>/</li>
              <li>Contact</li>
            </ul>
          </div>
          <img
            src="/assets/images/shape/shape_35.svg"
            alt=""
            className="lazy-img shapes shape_01"
          />
          <img
            src="/assets/images/shape/shape_36.svg"
            alt=""
            className="lazy-img shapes shape_02"
          />
        </div>
      </div>

      {/* ── Creative Panel + Form ── */}
      <div className="contact-main-wrap mt-20 mb-20 lg-mt-60">
        {/* ── LEFT: Creative info panel ── */}
        <div className="contact-creative-side">
          {/* Floating blobs */}
          <div className="blob blob-1" aria-hidden="true" />
          <div className="blob blob-2" aria-hidden="true" />
          <div className="blob blob-3" aria-hidden="true" />

          <div className="creative-inner">
            {/* Eyebrow */}
            <p className="creative-eyebrow">Let's talk real estate</p>

            {/* Headline */}
            <h2 className="creative-headline">
              Your dream <br />
              <em>home is one</em>
              <br /> message away.
            </h2>

            <p className="creative-sub">
              Whether you're buying, selling, or simply exploring — our team of
              local experts is ready to guide you at every step.
            </p>

            {/* Stats strip */}
            <div className="creative-stats">
              {STATS.map((s) => (
                <div key={s.label} className="creative-stat">
                  <span className="creative-stat-value">{s.value}</span>
                  <span className="creative-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="creative-divider" />

            {/* Promises list */}
            <div className="creative-promises">
              {PROMISES.map((p) => (
                <div key={p.title} className="creative-promise">
                  <span className="creative-promise-icon" aria-hidden="true">
                    {p.icon}
                  </span>
                  <div>
                    <p className="creative-promise-title">{p.title}</p>
                    <p className="creative-promise-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact info pills */}
            <div className="creative-pills">
              <a href="tel:+8801700000000" className="creative-pill">
                <span className="creative-pill-icon">📞</span>
                +880 1700 000 000
              </a>
              <a href="mailto:hello@estateadmin.com" className="creative-pill">
                <span className="creative-pill-icon">✉️</span>
                hello@estateadmin.com
              </a>
            </div>

            {/* Decorative grid overlay */}
            <svg
              className="creative-grid-svg"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="cg"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 32 0 L 0 0 0 32"
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cg)" />
            </svg>

            {/* Floating card accent */}
            <div className="creative-card-accent">
              <div className="cca-avatar">EA</div>
              <div>
                <p className="cca-name">EstateAdmin Team</p>
                <p className="cca-tag">● Online now</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="contact-form-side" ref={formRef}>
          {success ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h4>Message Sent!</h4>
              <p>
                Thank you for reaching out. Our team will get back to you
                shortly.
              </p>
              <button
                className="contact-btn-primary"
                onClick={() => setSuccess(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h4 className="contact-form-title">Send a Message</h4>

              {linkedPropertyName && (
                <div className="contact-property-badge">
                  🏠 Enquiring about: <strong>{linkedPropertyName}</strong>
                </div>
              )}

              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="c_name">Full Name *</label>
                  <input
                    id="c_name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="c_email">Email Address *</label>
                  <input
                    id="c_email"
                    type="email"
                    placeholder="john@email.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="c_phone">Phone Number</label>
                  <input
                    id="c_phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="c_whatsapp">WhatsApp</label>
                  <input
                    id="c_whatsapp"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={form.whatsapp}
                    onChange={set("whatsapp")}
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="c_inquiry">Inquiry Type *</label>
                <div className="contact-inquiry-grid">
                  {[
                    { v: "buying", label: "🏠 Buying" },
                    { v: "renting", label: "🔑 Renting" },
                    { v: "selling", label: "🏷 Selling" },
                    { v: "valuation", label: "📊 Valuation" },
                    { v: "investment", label: "💼 Investment" },
                    { v: "viewing", label: "👁 Schedule Viewing" },
                    { v: "general", label: "💬 General" },
                  ].map(({ v, label }) => (
                    <button
                      key={v}
                      type="button"
                      className={`contact-inquiry-chip${form.inquiry_type === v ? " selected" : ""}`}
                      onClick={() =>
                        setForm((f) => ({ ...f, inquiry_type: v }))
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="c_subject">Subject</label>
                <input
                  id="c_subject"
                  type="text"
                  placeholder="e.g. Interested in 3-bedroom villa in Dhaka"
                  value={form.subject}
                  onChange={set("subject")}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="c_message">Your Message *</label>
                <textarea
                  id="c_message"
                  rows={4}
                  placeholder="Tell us what you're looking for, any specific requirements, budget range, preferred areas…"
                  value={form.message}
                  onChange={set("message")}
                  required
                />
              </div>

              <button
                type="button"
                className="contact-advanced-toggle"
                onClick={() => setShowAdvanced((v) => !v)}
              >
                {showAdvanced ? "▲" : "▼"} Additional Details{" "}
                <span>(optional)</span>
              </button>

              {showAdvanced && (
                <div className="contact-advanced">
                  <div className="contact-row">
                    <div className="contact-field">
                      <label htmlFor="c_bmin">Budget Min ($)</label>
                      <input
                        id="c_bmin"
                        type="number"
                        placeholder="50,000"
                        min={0}
                        value={form.budget_min}
                        onChange={set("budget_min")}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="c_bmax">Budget Max ($)</label>
                      <input
                        id="c_bmax"
                        type="number"
                        placeholder="500,000"
                        min={0}
                        value={form.budget_max}
                        onChange={set("budget_max")}
                      />
                    </div>
                  </div>

                  <div className="contact-row">
                    <div className="contact-field">
                      <label htmlFor="c_pcontact">Preferred Contact</label>
                      <select
                        id="c_pcontact"
                        value={form.preferred_contact}
                        onChange={set("preferred_contact")}
                      >
                        <option value="">Any method</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone call</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                    <div className="contact-field">
                      <label htmlFor="c_ptime">Best Time to Call</label>
                      <select
                        id="c_ptime"
                        value={form.preferred_time}
                        onChange={set("preferred_time")}
                      >
                        <option value="">Anytime</option>
                        <option value="morning">Morning (8am–12pm)</option>
                        <option value="afternoon">Afternoon (12pm–5pm)</option>
                        <option value="evening">Evening (5pm–8pm)</option>
                      </select>
                    </div>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="c_timeline">
                      Move-in / Purchase Timeline
                    </label>
                    <select
                      id="c_timeline"
                      value={form.move_timeline}
                      onChange={set("move_timeline")}
                    >
                      <option value="">Not sure yet</option>
                      <option value="asap">As soon as possible</option>
                      <option value="1_month">Within 1 month</option>
                      <option value="3_months">Within 3 months</option>
                      <option value="6_months">Within 6 months</option>
                      <option value="flexible">Flexible / just browsing</option>
                    </select>
                  </div>
                </div>
              )}

              {error && <div className="contact-error">{error}</div>}

              <button
                type="submit"
                className="contact-btn-primary contact-btn-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="contact-spinner" /> Sending…
                  </>
                ) : (
                  "SEND MESSAGE →"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Inline styles ── */}
      <style>{`
        /* ══════════════════════════════════════════════
           CREATIVE SIDE PANEL
        ══════════════════════════════════════════════ */
        .contact-main-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 680px;
        }
        @media (max-width: 900px) {
          .contact-main-wrap { grid-template-columns: 1fr; }
          .contact-creative-side { min-height: 480px; order: 2; }
        }

        /* ── Panel shell ── */
        .contact-creative-side {
          position: relative;
          background: #252060;
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }

        /* ── Floating blobs ── */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          pointer-events: none;
        }
        .blob-1 {
          width: 320px; height: 320px;
          background: #1C94A4;
          top: -80px; left: -80px;
          animation: blobFloat 9s ease-in-out infinite;
        }
        .blob-2 {
          width: 240px; height: 240px;
          background: #0d5a8a;
          bottom: 60px; right: -60px;
          animation: blobFloat 12s ease-in-out infinite reverse;
        }
        .blob-3 {
          width: 160px; height: 160px;
          background: #1C94A4;
          bottom: 200px; left: 40%;
          animation: blobFloat 7s ease-in-out infinite 2s;
        }
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-24px) scale(1.06); }
        }

        /* ── Grid overlay SVG ── */
        .creative-grid-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* ── Inner content ── */
        .creative-inner {
          position: relative;
          z-index: 2;
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
        }
        @media (max-width: 600px) {
          .creative-inner { padding: 36px 24px; }
        }

        /* ── Eyebrow ── */
        .creative-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #1C94A4;
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .creative-eyebrow::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 2px;
          background: #1C94A4;
          border-radius: 2px;
        }

        /* ── Headline ── */
        .creative-headline {
          font-size: clamp(30px, 3.5vw, 44px);
          font-weight: 700;
          line-height: 1.18;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -0.5px;
        }
        .creative-headline em {
          font-style: italic;
          color: #1C94A4;
        }

        /* ── Subtext ── */
        .creative-sub {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.6);
          margin: 0 0 28px;
          max-width: 360px;
        }

        /* ── Stats strip ── */
        .creative-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 28px;
        }
        @media (max-width: 600px) {
          .creative-stats { grid-template-columns: repeat(2,1fr); }
        }
        .creative-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 10px;
          border-right: 1px solid rgba(255,255,255,0.1);
          transition: background 0.2s;
        }
        .creative-stat:last-child { border-right: none; }
        .creative-stat:hover { background: rgba(28,148,164,0.12); }
        .creative-stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .creative-stat-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: rgba(255,255,255,0.45);
          text-align: center;
        }

        /* ── Divider ── */
        .creative-divider {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #1C94A4, transparent);
          border-radius: 2px;
          margin-bottom: 22px;
        }

        /* ── Promises ── */
        .creative-promises {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 28px;
        }
        .creative-promise {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          animation: fadeSlideIn 0.5s ease both;
        }
        .creative-promise:nth-child(1) { animation-delay: 0.05s; }
        .creative-promise:nth-child(2) { animation-delay: 0.12s; }
        .creative-promise:nth-child(3) { animation-delay: 0.19s; }
        .creative-promise:nth-child(4) { animation-delay: 0.26s; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .creative-promise-icon {
          width: 36px;
          height: 36px;
          background: rgba(28,148,164,0.15);
          border: 1px solid rgba(28,148,164,0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .creative-promise:hover .creative-promise-icon {
          background: rgba(28,148,164,0.28);
          border-color: rgba(28,148,164,0.55);
        }
        .creative-promise-title {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px;
        }
        .creative-promise-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin: 0;
          line-height: 1.5;
        }

        /* ── Pills ── */
        .creative-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }
        .creative-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 100px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
          font-weight: 500;
        }
        .creative-pill:hover {
          background: rgba(28,148,164,0.2);
          border-color: rgba(28,148,164,0.5);
          color: #fff;
          transform: translateY(-1px);
        }
        .creative-pill-icon { font-size: 14px; }

        /* ── Floating agent card ── */
        .creative-card-accent {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          max-width: 220px;
          backdrop-filter: blur(8px);
          animation: cardPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
        }
        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1)  translateY(0); }
        }
        .cca-avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #1C94A4, #0d5a8a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }
        .cca-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px;
        }
        .cca-tag {
          font-size: 11px;
          color: #4ade80;
          margin: 0;
          font-weight: 600;
        }

        /* ══════════════════════════════════════════════
           FORM SIDE (unchanged from original)
        ══════════════════════════════════════════════ */
        .contact-form-side {
          background: rgba(28,148,164,0.05);
          padding: 48px 44px;
        }
        @media (max-width: 600px) {
          .contact-form-side { padding: 32px 20px; }
        }
        .contact-form-title {
          font-size: 22px;
          font-weight: 700;
          color: #252060;
          margin-bottom: 22px;
        }
        .contact-property-badge {
          background: rgba(28,148,164,0.08);
          border: 1px solid rgba(28,148,164,0.25);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #1C94A4;
          margin-bottom: 18px;
        }
        .contact-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 540px) {
          .contact-row { grid-template-columns: 1fr; }
        }
        .contact-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        .contact-field label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: #5a5e7a;
          margin-bottom: 6px;
        }
        .contact-field input,
        .contact-field textarea,
        .contact-field select {
          background: #fff;
          border: 1px solid rgba(37,32,96,0.15);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: inherit;
          color: #252060;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
          resize: vertical;
        }
        .contact-field input::placeholder,
        .contact-field textarea::placeholder {
          color: #a0a3b5;
        }
        .contact-field input:focus,
        .contact-field textarea:focus,
        .contact-field select:focus {
          border-color: #1C94A4;
          box-shadow: 0 0 0 3px rgba(28,148,164,0.1);
        }
        .contact-inquiry-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4px;
        }
        .contact-inquiry-chip {
          padding: 7px 14px;
          border: 1.5px solid rgba(37,32,96,0.15);
          border-radius: 20px;
          background: #fff;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          color: #5a5e7a;
          font-family: inherit;
        }
        .contact-inquiry-chip:hover {
          border-color: #1C94A4;
          color: #1C94A4;
        }
        .contact-inquiry-chip.selected {
          background: #252060;
          border-color: #252060;
          color: #fff;
        }
        .contact-advanced-toggle {
          background: none;
          border: none;
          font-size: 12.5px;
          font-weight: 600;
          color: #8a8c9e;
          cursor: pointer;
          padding: 0;
          margin-bottom: 14px;
          font-family: inherit;
          transition: color 0.15s;
        }
        .contact-advanced-toggle:hover { color: #1C94A4; }
        .contact-advanced-toggle span {
          font-weight: 400;
          color: #b0b3c5;
        }
        .contact-advanced {
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(37,32,96,0.1);
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 16px;
        }
        .contact-error {
          background: #fff0f0;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 14px;
        }
        .contact-btn-primary {
          background: #252060;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px 28px;
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.6px;
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .contact-btn-primary:hover:not(:disabled) {
          background: #1C94A4;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(28,148,164,0.3);
        }
        .contact-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .contact-btn-submit {
          width: 100%;
          justify-content: center;
          font-size: 14px;
          padding: 16px;
          margin-top: 4px;
        }
        .contact-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: c-spin 0.7s linear infinite;
        }
        @keyframes c-spin { to { transform: rotate(360deg); } }
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 400px;
          gap: 16px;
        }
        .contact-success-icon {
          width: 64px;
          height: 64px;
          background: #1C94A4;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
        }
        .contact-success h4 {
          font-size: 22px;
          font-weight: 700;
          color: #252060;
        }
        .contact-success p {
          color: #5a5e7a;
          font-size: 14px;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
};

export default ContactArea;

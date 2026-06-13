// ============================================================
//  ContactArea.tsx — FutureWork Contact
//  Centered form, clean surface, all fields, premium feel
// ============================================================
import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

const SUPABASE_URL = "https://afwvbftvfubboorpiszu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmd3ZiZnR2ZnViYm9vcnBpc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjg4MzksImV4cCI6MjA5Njc0NDgzOX0.vw7hvZMrNeS_vqU7By6C69F1SsN_mWY6gSs2ipliLZY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const INQUIRY_CHIPS = [
  { v: "buying", label: "Buying" },
  { v: "renting", label: "Renting" },
  { v: "selling", label: "Selling" },
  { v: "valuation", label: "Valuation" },
  { v: "investment", label: "Investment" },
  { v: "viewing", label: "Schedule Viewing" },
  { v: "general", label: "General" },
];

// ─── Styles ──────────────────────────────────────────────────
const CONTACT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  .fwc-root {
    --navy:       #252060;
    --teal:       #1C94A4;
    --teal-dark:  #157a88;
    --teal-faint: rgba(28,148,164,0.08);
    --rule:       #e8e6f0;
    --surface:    #F8F7FC;
    --white:      #ffffff;
    --ink:        #0f0e1a;
    --ink-3:      #5a5e7a;
    --ink-4:      #9a9bb5;
    --serif:      'DM Serif Display', Georgia, serif;
    --sans:       'Plus Jakarta Sans', system-ui, sans-serif;
    --r:          12px;
    --r-pill:     100px;
  }
  .fwc-root, .fwc-root * {
    font-family: var(--sans);
    box-sizing: border-box;
  }

  /* ── Page shell ── */
  .fwc-root { background: var(--surface); }

  /* ── Breadcrumb banner (kept from original) ── */
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
    font-family: var(--serif); font-size: clamp(32px, 5vw, 54px);
    color: #fff; letter-spacing: -0.5px; margin: 0 0 18px; line-height: 1.1;
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

  /* ── Contact info strip ── */
  .fwc-strip {
    background: var(--white);
    border-bottom: 1px solid var(--rule);
  }
  .fwc-strip__inner {
    margin: 0 auto;
    padding: 24px 20px;
    display: flex; justify-content: center;
    flex-wrap: wrap; gap: 32px;
  }
  .fwc-strip__item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; color: var(--ink-3); text-decoration: none;
    transition: color 0.15s;
  }
  .fwc-strip__item:hover { color: var(--teal); }
  .fwc-strip__icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--teal-faint);
    border: 1px solid rgba(28,148,164,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0; transition: background 0.2s;
  }
  .fwc-strip__item:hover .fwc-strip__icon { background: rgba(28,148,164,0.15); }
  .fwc-strip__label { font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--ink-4); display: block; margin-bottom: 1px; }
  .fwc-strip__val { font-size: 13px; font-weight: 600; color: var(--navy); }

  /* ── Form wrap ── */
  .fwc-form-wrap {
    max-width: 780px; margin: 0 auto;
    padding: 64px 20px 100px;
  }

  /* ── Form card ── */
  .fwc-card {
    background: var(--white);
    border-radius: 20px;
    border: 1.5px solid var(--rule);
    box-shadow: 0 2px 8px rgba(37,32,96,0.04), 0 12px 40px rgba(37,32,96,0.07);
    overflow: hidden;
  }

  /* ── Card header ── */
  .fwc-card__head {
    background: var(--navy);
    padding: 36px 44px 32px;
    position: relative; overflow: hidden;
  }
  .fwc-card__head-ghost {
    position: absolute; right: -20px; top: -20px;
    font-family: var(--serif); font-style: italic;
    font-size: 100px; color: rgba(255,255,255,0.04);
    pointer-events: none; line-height: 1; user-select: none;
    white-space: nowrap;
  }
  .fwc-card__eyebrow {
    font-size: 9.5px; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; color: rgba(125,216,228,0.75);
    margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
  }
  .fwc-card__eyebrow::before {
    content: ''; display: block; width: 20px; height: 1.5px;
    background: rgba(125,216,228,0.55);
  }
  .fwc-card__title {
    font-family: var(--serif); font-size: clamp(22px, 3vw, 30px);
    color: #fff; margin: 0; letter-spacing: -0.3px; line-height: 1.2;
  }
  .fwc-card__title em { color: #7dd8e4; font-style: italic; }
  @media (max-width: 600px) {
    .fwc-card__head { padding: 28px 24px; }
  }

  /* ── Card body ── */
  .fwc-card__body { padding: 40px 44px 44px; }
  @media (max-width: 600px) {
    .fwc-card__body { padding: 28px 24px 32px; }
  }

  /* ── Property badge ── */
  .fwc-prop-badge {
    display: flex; align-items: center; gap: 10px;
    background: var(--teal-faint);
    border: 1px solid rgba(28,148,164,0.22);
    border-radius: 10px; padding: 11px 16px;
    font-size: 13px; color: var(--teal);
    margin-bottom: 28px; font-weight: 500;
  }
  .fwc-prop-badge strong { color: var(--navy); }

  /* ── Section divider label ── */
  .fwc-section-label {
    font-size: 9px; font-weight: 800; letter-spacing: 1.3px;
    text-transform: uppercase; color: var(--teal);
    margin: 0 0 18px; display: flex; align-items: center; gap: 10px;
  }
  .fwc-section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--rule);
  }

  /* ── Grid helpers ── */
  .fwc-grid-2 {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  }
  @media (max-width: 560px) { .fwc-grid-2 { grid-template-columns: 1fr; } }

  /* ── Field ── */
  .fwc-field { display: flex; flex-direction: column; margin-bottom: 20px; }
  .fwc-field:last-of-type { margin-bottom: 0; }
  .fwc-field label {
    font-size: 10px; font-weight: 800; letter-spacing: 0.8px;
    text-transform: uppercase; color: var(--ink-3); margin-bottom: 7px;
  }
  .fwc-field input,
  .fwc-field textarea,
  .fwc-field select {
    background: var(--surface);
    border: 1.5px solid var(--rule);
    border-radius: var(--r);
    padding: 11px 14px;
    font-size: 14px; font-family: var(--sans);
    color: var(--navy);
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    outline: none; resize: vertical; appearance: none;
    -webkit-appearance: none;
  }
  .fwc-field input::placeholder,
  .fwc-field textarea::placeholder { color: var(--ink-4); }
  .fwc-field input:focus,
  .fwc-field textarea:focus,
  .fwc-field select:focus {
    border-color: var(--teal);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(28,148,164,0.11);
  }
  /* Custom select arrow */
  .fwc-select-wrap { position: relative; }
  .fwc-select-wrap::after {
    content: '';
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid var(--navy);
    pointer-events: none;
  }
  .fwc-select-wrap select { width: 100%; padding-right: 36px; cursor: pointer; }

  /* ── Inquiry chips ── */
  .fwc-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .fwc-chip {
    padding: 7px 16px;
    border: 1.5px solid var(--rule);
    border-radius: var(--r-pill);
    background: var(--white);
    font-size: 12.5px; font-weight: 600;
    cursor: pointer; transition: all 0.16s;
    color: var(--ink-3); font-family: var(--sans);
    letter-spacing: 0.1px;
  }
  .fwc-chip:hover { border-color: var(--teal); color: var(--teal); }
  .fwc-chip.active {
    background: var(--navy); border-color: var(--navy);
    color: #fff;
  }

  /* ── Advanced toggle ── */
  .fwc-advanced-toggle {
    background: none; border: none; padding: 0;
    font-family: var(--sans); font-size: 12.5px;
    font-weight: 700; color: var(--ink-4);
    cursor: pointer; transition: color 0.15s;
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 20px; margin-top: 4px;
  }
  .fwc-advanced-toggle:hover { color: var(--teal); }
  .fwc-advanced-toggle span { font-weight: 400; }

  .fwc-advanced-panel {
    background: var(--surface);
    border: 1.5px solid var(--rule);
    border-radius: var(--r);
    padding: 22px 20px;
    margin-bottom: 20px;
  }

  /* ── Divider ── */
  .fwc-hr { height: 1px; background: var(--rule); margin: 28px 0; border: none; }

  /* ── Error ── */
  .fwc-error {
    background: #fff5f5; border: 1.5px solid #fca5a5;
    border-radius: var(--r); padding: 11px 16px;
    font-size: 13px; color: #dc2626; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }

  /* ── Submit button ── */
  .fwc-submit {
    width: 100%; padding: 16px;
    background: var(--navy); color: #fff;
    border: none; border-radius: var(--r);
    font-family: var(--sans); font-size: 14px;
    font-weight: 800; letter-spacing: 0.8px;
    cursor: pointer; transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    text-transform: uppercase;
  }
  .fwc-submit:hover:not(:disabled) {
    background: var(--teal);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(28,148,164,0.3);
  }
  .fwc-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .fwc-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: fwc-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes fwc-spin { to { transform: rotate(360deg); } }

  /* ── Success state ── */
  .fwc-success {
    padding: 80px 44px;
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .fwc-success__icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--navy);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; color: #fff; margin-bottom: 8px;
    box-shadow: 0 8px 24px rgba(37,32,96,0.2);
  }
  .fwc-success__title {
    font-family: var(--serif); font-size: 28px;
    color: var(--navy); margin: 0;
  }
  .fwc-success__sub {
    font-size: 14.5px; color: var(--ink-3);
    max-width: 320px; line-height: 1.7; margin: 0;
  }
  .fwc-success__btn {
    margin-top: 8px; padding: 11px 28px;
    border-radius: var(--r-pill);
    background: none; border: 1.5px solid var(--navy);
    font-family: var(--sans); font-size: 12.5px;
    font-weight: 700; color: var(--navy); cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.3px; text-transform: uppercase;
  }
  .fwc-success__btn:hover { background: var(--navy); color: #fff; }
`;

function injectContactStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-contact-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-contact-styles";
    el.textContent = CONTACT_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Component ───────────────────────────────────────────────
const ContactArea = ({
  linkedPropertyId,
  linkedPropertyName,
}: ContactAreaProps) => {
  injectContactStyles();

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
      setError(
        "Something went wrong: " +
          (err instanceof Error ? err.message : "Submission failed."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fwc-root contact-us xl-mt-100">
      {/* ── Banner ── */}
      <div className="fwc-banner">
        <div
          className="fwc-banner__bg"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        />
        <div className="fwc-banner__inner">
          <h2 className="fwc-banner__title">
            Contact <em>Us</em>
          </h2>
          <ul className="fwc-banner__crumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      {/* ── Contact info strip ── */}
      <div className="fwc-strip">
        <div className="fwc-strip__inner">
          <a href="tel:+9779800000000" className="fwc-strip__item">
            <div className="fwc-strip__icon">📞</div>
            <div>
              <span className="fwc-strip__label">Phone</span>
              <span className="fwc-strip__val">+977 98-0000-0000</span>
            </div>
          </a>
          <a href="mailto:hello@futurework.com.np" className="fwc-strip__item">
            <div className="fwc-strip__icon">✉️</div>
            <div>
              <span className="fwc-strip__label">Email</span>
              <span className="fwc-strip__val">hello@futurework.com.np</span>
            </div>
          </a>
          <div className="fwc-strip__item">
            <div className="fwc-strip__icon">📍</div>
            <div>
              <span className="fwc-strip__label">Office</span>
              <span className="fwc-strip__val">Durbar Marg, Kathmandu</span>
            </div>
          </div>
          <div className="fwc-strip__item">
            <div className="fwc-strip__icon">🕐</div>
            <div>
              <span className="fwc-strip__label">Hours</span>
              <span className="fwc-strip__val">Sun–Fri, 9am – 6pm</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="fwc-form-wrap" ref={formRef}>
        <div className="fwc-card">
          {/* Card header */}
          <div className="fwc-card__head">
            <div className="fwc-card__head-ghost">Message</div>
            <div className="fwc-card__eyebrow">Get in touch</div>
            <h3 className="fwc-card__title">
              Send us a <em>message</em>
            </h3>
          </div>

          {/* Card body */}
          <div className="fwc-card__body">
            {success ? (
              <div className="fwc-success">
                <div className="fwc-success__icon">✓</div>
                <h4 className="fwc-success__title">Message Sent</h4>
                <p className="fwc-success__sub">
                  Thank you for reaching out. A member of our team will get back
                  to you within 48 hours.
                </p>
                <button
                  className="fwc-success__btn"
                  onClick={() => setSuccess(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {linkedPropertyName && (
                  <div className="fwc-prop-badge">
                    🏠 Enquiring about: <strong>{linkedPropertyName}</strong>
                  </div>
                )}

                {/* Personal */}
                <div className="fwc-section-label">Your details</div>
                <div className="fwc-grid-2">
                  <div className="fwc-field">
                    <label htmlFor="c_name">Full Name *</label>
                    <input
                      id="c_name"
                      type="text"
                      placeholder="Aarav Sharma"
                      value={form.name}
                      onChange={set("name")}
                      required
                    />
                  </div>
                  <div className="fwc-field">
                    <label htmlFor="c_email">Email Address *</label>
                    <input
                      id="c_email"
                      type="email"
                      placeholder="aarav@email.com"
                      value={form.email}
                      onChange={set("email")}
                      required
                    />
                  </div>
                </div>
                <div className="fwc-grid-2">
                  <div className="fwc-field">
                    <label htmlFor="c_phone">Phone Number</label>
                    <input
                      id="c_phone"
                      type="tel"
                      placeholder="+977 98-0000-0000"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                  </div>
                  <div className="fwc-field">
                    <label htmlFor="c_whatsapp">WhatsApp</label>
                    <input
                      id="c_whatsapp"
                      type="tel"
                      placeholder="+977 98-0000-0000"
                      value={form.whatsapp}
                      onChange={set("whatsapp")}
                    />
                  </div>
                </div>

                <hr className="fwc-hr" />

                {/* Inquiry type */}
                <div className="fwc-section-label">Inquiry type *</div>
                <div className="fwc-field" style={{ marginBottom: 28 }}>
                  <div className="fwc-chips">
                    {INQUIRY_CHIPS.map(({ v, label }) => (
                      <button
                        key={v}
                        type="button"
                        className={`fwc-chip${form.inquiry_type === v ? " active" : ""}`}
                        onClick={() =>
                          setForm((f) => ({ ...f, inquiry_type: v }))
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject + message */}
                <div className="fwc-section-label">Your message</div>
                <div className="fwc-field">
                  <label htmlFor="c_subject">Subject</label>
                  <input
                    id="c_subject"
                    type="text"
                    placeholder="e.g. Interested in 3-bedroom apartment in Lalitpur"
                    value={form.subject}
                    onChange={set("subject")}
                  />
                </div>
                <div className="fwc-field">
                  <label htmlFor="c_message">Message *</label>
                  <textarea
                    id="c_message"
                    rows={5}
                    placeholder="Tell us what you're looking for — property type, preferred location, budget, any specific questions…"
                    value={form.message}
                    onChange={set("message")}
                    required
                  />
                </div>

                {/* Advanced toggle */}
                <button
                  type="button"
                  className="fwc-advanced-toggle"
                  onClick={() => setShowAdvanced((v) => !v)}
                >
                  <i
                    className={`bi bi-chevron-${showAdvanced ? "up" : "down"}`}
                  />
                  Additional details <span>(optional)</span>
                </button>

                {showAdvanced && (
                  <div className="fwc-advanced-panel">
                    <div
                      className="fwc-section-label"
                      style={{ marginBottom: 16 }}
                    >
                      Budget &amp; preferences
                    </div>
                    <div className="fwc-grid-2">
                      <div className="fwc-field">
                        <label htmlFor="c_bmin">Budget Min (NPR)</label>
                        <input
                          id="c_bmin"
                          type="number"
                          placeholder="e.g. 5000000"
                          min={0}
                          value={form.budget_min}
                          onChange={set("budget_min")}
                        />
                      </div>
                      <div className="fwc-field">
                        <label htmlFor="c_bmax">Budget Max (NPR)</label>
                        <input
                          id="c_bmax"
                          type="number"
                          placeholder="e.g. 20000000"
                          min={0}
                          value={form.budget_max}
                          onChange={set("budget_max")}
                        />
                      </div>
                    </div>
                    <div className="fwc-grid-2">
                      <div className="fwc-field">
                        <label htmlFor="c_pcontact">Preferred Contact</label>
                        <div className="fwc-select-wrap">
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
                      </div>
                      <div className="fwc-field">
                        <label htmlFor="c_ptime">Best Time to Call</label>
                        <div className="fwc-select-wrap">
                          <select
                            id="c_ptime"
                            value={form.preferred_time}
                            onChange={set("preferred_time")}
                          >
                            <option value="">Anytime</option>
                            <option value="morning">
                              Morning (8am – 12pm)
                            </option>
                            <option value="afternoon">
                              Afternoon (12pm – 5pm)
                            </option>
                            <option value="evening">Evening (5pm – 8pm)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="fwc-field" style={{ marginBottom: 0 }}>
                      <label htmlFor="c_timeline">
                        Move-in / Purchase Timeline
                      </label>
                      <div className="fwc-select-wrap">
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
                          <option value="flexible">
                            Flexible / just browsing
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="fwc-error">
                    <i className="bi bi-exclamation-circle" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="fwc-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="fwc-spinner" /> Sending…
                    </>
                  ) : (
                    <>
                      Send Message <i className="bi bi-arrow-up-right" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactArea;

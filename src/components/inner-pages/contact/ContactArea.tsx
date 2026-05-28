// ============================================================
//  ContactArea.tsx  — EstateAdmin client-side contact section
//  Supabase-integrated, real-estate fields, no theme changes
// ============================================================
import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

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
  /** Optional: pre-fill a property reference (e.g. from a listing page) */
  linkedPropertyId?: string;
  linkedPropertyName?: string;
}

// ─── Info blocks ─────────────────────────────────────────────
const INFO_BLOCKS = [
  {
    icon: "✉",
    title: "Email us anytime",
    value: "ask@homy.com",
    href: "mailto:ask@homy.com",
  },
  {
    icon: "📞",
    title: "Call our hotline",
    value: "+757 699 4478",
    href: "tel:+7576994478",
  },
  {
    icon: "💬",
    title: "Live chat support",
    value: "www.homylivechat.com",
    href: "https://www.homylivechat.com",
  },
];

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

  // ─── Handlers ──────────────────────────────────────────────
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

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="contact-us border-top xl-mt-100 pt-80 lg-pt-60">
      {/* ── Header ── */}
      <div className="container">
        <div className="row">
          <div className="col-xxl-9 col-xl-8 col-lg-10 m-auto text-center">
            <h3 className="contact-heading">
              Questions? Feel Free to Reach Out
              <br />
              <em>Via Message.</em>
            </h3>
            <p className="contact-subheading">
              Our team typically responds within one business day.
            </p>
          </div>
        </div>
      </div>

      {/* ── Info blocks ── */}
      <div className="address-banner mt-60 lg-mt-40">
        <div className="container">
          <div className="contact-info-row">
            {INFO_BLOCKS.map((b, i) => (
              <a
                key={i}
                href={b.href}
                className="contact-info-card"
                target={b.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <div className="contact-info-icon">{b.icon}</div>
                <div className="contact-info-text">
                  <p className="contact-info-title">{b.title}</p>
                  <span className="contact-info-value">{b.value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map + Form ── */}
      <div className="contact-main-wrap mt-80 lg-mt-60">
        <div className="contact-map-side">
          <iframe
            title="Office Location"
            className="contact-map-iframe"
            src="https://maps.google.com/maps?width=600&height=400&hl=en&q=dhaka+collage&t=&z=12&ie=UTF8&iwloc=B&output=embed"
            loading="lazy"
          />
        </div>

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

              {/* ── Row 1: Name + Email ── */}
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

              {/* ── Row 2: Phone + WhatsApp ── */}
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

              {/* ── Inquiry type ── */}
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

              {/* ── Subject ── */}
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

              {/* ── Message ── */}
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

              {/* ── Advanced (collapsible) ── */}
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
                  {/* Budget */}
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

                  {/* Preferred contact + time */}
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

                  {/* Move-in timeline */}
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

              {/* ── Error ── */}
              {error && <div className="contact-error">{error}</div>}

              {/* ── Submit ── */}
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
        /* ── Layout ── */
        .contact-heading {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700;
          line-height: 1.25;
          color: #1a1a2e;
        }
        .contact-heading em {
          font-style: italic;
          color: #f15a29;
        }
        .contact-subheading {
          color: #888;
          margin-top: 10px;
          font-size: 15px;
        }

        /* ── Info row ── */
        .contact-info-row {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 0 16px;
        }
        .contact-info-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 24px;
          background: #fff;
          border: 1px solid #ebebeb;
          border-radius: 12px;
          text-decoration: none;
          flex: 1;
          min-width: 220px;
          max-width: 320px;
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
        }
        .contact-info-card:hover {
          box-shadow: 0 8px 32px rgba(241,90,41,0.1);
          border-color: rgba(241,90,41,0.3);
          transform: translateY(-2px);
        }
        .contact-info-icon {
          width: 46px;
          height: 46px;
          background: #1a1a2e;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .contact-info-title {
          font-size: 13px;
          font-weight: 600;
          color: #444;
          margin: 0 0 2px;
        }
        .contact-info-value {
          font-size: 13px;
          color: #f15a29;
          font-weight: 500;
        }

        /* ── Map + Form wrapper ── */
        .contact-main-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 680px;
        }
        @media (max-width: 900px) {
          .contact-main-wrap { grid-template-columns: 1fr; }
          .contact-map-side { height: 300px; order: 2; }
        }
        .contact-map-side { overflow: hidden; }
        .contact-map-iframe {
          width: 100%;
          height: 100%;
          min-height: 500px;
          border: none;
          display: block;
        }
        .contact-form-side {
          background: #fdf5f0;
          padding: 48px 44px;
        }
        @media (max-width: 600px) {
          .contact-form-side { padding: 32px 20px; }
        }

        /* ── Form internals ── */
        .contact-form-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 22px;
        }
        .contact-property-badge {
          background: #fff3ed;
          border: 1px solid rgba(241,90,41,0.25);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #c04010;
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
          color: #555;
          margin-bottom: 6px;
        }
        .contact-field input,
        .contact-field textarea,
        .contact-field select {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: inherit;
          color: #222;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
          resize: vertical;
        }
        .contact-field input::placeholder,
        .contact-field textarea::placeholder {
          color: #aaa;
        }
        .contact-field input:focus,
        .contact-field textarea:focus,
        .contact-field select:focus {
          border-color: #f15a29;
          box-shadow: 0 0 0 3px rgba(241,90,41,0.08);
        }

        /* ── Inquiry chips ── */
        .contact-inquiry-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4px;
        }
        .contact-inquiry-chip {
          padding: 7px 14px;
          border: 1.5px solid #ddd;
          border-radius: 20px;
          background: #fff;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          color: #444;
          font-family: inherit;
        }
        .contact-inquiry-chip:hover {
          border-color: #f15a29;
          color: #f15a29;
        }
        .contact-inquiry-chip.selected {
          background: #f15a29;
          border-color: #f15a29;
          color: #fff;
        }

        /* ── Advanced section ── */
        .contact-advanced-toggle {
          background: none;
          border: none;
          font-size: 12.5px;
          font-weight: 600;
          color: #888;
          cursor: pointer;
          padding: 0;
          margin-bottom: 14px;
          font-family: inherit;
          transition: color 0.15s;
        }
        .contact-advanced-toggle:hover { color: #f15a29; }
        .contact-advanced-toggle span {
          font-weight: 400;
          color: #bbb;
        }
        .contact-advanced {
          background: rgba(255,255,255,0.6);
          border: 1px solid #e8e0d8;
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 16px;
        }

        /* ── Error ── */
        .contact-error {
          background: #fff0f0;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 14px;
        }

        /* ── Submit button ── */
        .contact-btn-primary {
          background: #f15a29;
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
          background: #d94a1a;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(241,90,41,0.3);
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

        /* ── Spinner ── */
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

        /* ── Success ── */
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
          background: #f15a29;
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
          color: #1a1a2e;
        }
        .contact-success p {
          color: #666;
          font-size: 14px;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
};

export default ContactArea;

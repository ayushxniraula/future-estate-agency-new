// ============================================================
//  RegisterForm.tsx  →  src/components/forms/RegisterForm.tsx
// ============================================================

import { useState } from "react";
import { supabase } from "../../my-components/supabase";

const REGISTER_FORM_STYLES = `
  .fw-register-form .fw-field {
    margin-bottom: 18px;
  }
  .fw-register-form .fw-field label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #7a7d96;
    margin-bottom: 7px;
  }
  .fw-register-form .fw-field input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid rgba(37,32,96,0.12);
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    color: #252060;
    background: #f8f8fc;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .fw-register-form .fw-field input::placeholder { color: #b0b3c5; }
  .fw-register-form .fw-field input:focus {
    border-color: #1C94A4;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(28,148,164,0.1);
  }
  .fw-register-form .fw-field input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── Error alert ── */
  .fw-register-form .fw-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: rgba(220,38,38,0.06);
    border: 1px solid rgba(220,38,38,0.2);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 13px;
    color: #dc2626;
    margin-bottom: 18px;
    line-height: 1.4;
  }
  .fw-register-form .fw-error-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

  /* ── Info note box ── */
  .fw-register-form .fw-info-note {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    background: rgba(28,148,164,0.06);
    border: 1px solid rgba(28,148,164,0.18);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 12.5px;
    color: #3a6e77;
    margin-bottom: 18px;
    line-height: 1.5;
  }
  .fw-register-form .fw-info-note-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }

  /* ── Submit button ── */
  .fw-register-form .fw-submit-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #252060 0%, #1a3a6b 60%, #1C94A4 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    font-family: inherit;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .fw-register-form .fw-submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
  }
  .fw-register-form .fw-submit-btn:hover:not(:disabled)::after {
    background: rgba(255,255,255,0.08);
  }
  .fw-register-form .fw-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(37,32,96,0.25);
  }
  .fw-register-form .fw-submit-btn:active:not(:disabled) { transform: translateY(0); }
  .fw-register-form .fw-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  /* ── Spinner ── */
  .fw-register-form .fw-btn-spinner {
    display: inline-block;
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: fw-reg-spin 0.65s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  @keyframes fw-reg-spin { to { transform: rotate(360deg); } }

  /* ── Footer note ── */
  .fw-register-form .fw-form-note {
    text-align: center;
    font-size: 12px;
    color: #a0a3b5;
    margin-top: 14px;
    line-height: 1.5;
  }

  /* ── Success state ── */
  .fw-register-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 12px 0 8px;
    gap: 0;
  }
  .fw-register-success-icon {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1C94A4, #252060);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; color: #fff;
    margin-bottom: 18px;
    box-shadow: 0 8px 24px rgba(28,148,164,0.3);
    animation: fw-pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes fw-pop-in {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .fw-register-success h4 {
    font-size: 20px;
    font-weight: 800;
    color: #252060;
    margin-bottom: 10px;
  }
  .fw-register-success p {
    font-size: 13.5px;
    color: #5a5e7a;
    line-height: 1.65;
    max-width: 320px;
    margin-bottom: 22px;
  }
  .fw-register-success p strong { color: #252060; }
  .fw-register-success .fw-success-email-badge {
    display: inline-block;
    background: rgba(28,148,164,0.08);
    border: 1px solid rgba(28,148,164,0.2);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12.5px;
    font-weight: 600;
    color: #1C94A4;
    margin: 4px 0 16px;
    word-break: break-all;
  }
  .fw-register-success .fw-back-btn {
    padding: 11px 28px;
    border: 1.5px solid rgba(37,32,96,0.2);
    border-radius: 12px;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #252060;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }
  .fw-register-success .fw-back-btn:hover {
    border-color: #1C94A4;
    background: rgba(28,148,164,0.05);
    color: #1C94A4;
  }
`;

function injectRegisterFormStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-register-form-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-register-form-styles";
    el.textContent = REGISTER_FORM_STYLES;
    document.head.appendChild(el);
  }
}

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  injectRegisterFormStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { data: existing } = await supabase
      .from("pending_users")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .limit(1);

    if (existing && existing.length > 0) {
      setError(
        "This email is already registered. Please wait for admin approval or try logging in.",
      );
      setLoading(false);
      return;
    }

    const { error: insertErr } = await supabase.from("pending_users").insert([
      {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        status: "pending",
      },
    ]);

    setLoading(false);

    if (insertErr) {
      setError(insertErr.message);
      return;
    }

    setSubmittedEmail(email.trim().toLowerCase());
    setSuccess(true);
    setFullName("");
    setEmail("");
    setPhone("");
  };

  if (success) {
    return (
      <div className="fw-register-success">
        <div className="fw-register-success-icon">✓</div>
        <h4>Request Submitted!</h4>
        <p>
          Your account is under review. Once approved, an admin will email your{" "}
          <strong>username</strong> and <strong>password</strong> to:
        </p>
        <span className="fw-success-email-badge">📧 {submittedEmail}</span>
        <button className="fw-back-btn" onClick={() => setSuccess(false)}>
          ← Back to Form
        </button>
      </div>
    );
  }

  return (
    <form className="fw-register-form" onSubmit={handleSubmit} noValidate>
      {/* Full Name */}
      <div className="fw-field">
        <label htmlFor="rf_name">Full Name</label>
        <input
          id="rf_name"
          type="text"
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div className="fw-field">
        <label htmlFor="rf_email">Email Address</label>
        <input
          id="rf_email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {/* Phone */}
      <div className="fw-field">
        <label htmlFor="rf_phone">Phone Number</label>
        <input
          id="rf_phone"
          type="tel"
          placeholder="+977 98XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
          autoComplete="tel"
        />
      </div>

      {/* Info note */}
      <div className="fw-info-note">
        <span className="fw-info-note-icon">ℹ</span>
        <span>
          An admin will review your request and email your login credentials
          once approved.
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="fw-error" role="alert">
          <span className="fw-error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="fw-submit-btn" disabled={loading}>
        {loading ? (
          <>
            <span className="fw-btn-spinner" />
            Submitting…
          </>
        ) : (
          "Request Access →"
        )}
      </button>

      <p className="fw-form-note">
        Already have credentials? Switch to the{" "}
        <strong style={{ color: "#252060" }}>Login</strong> tab.
      </p>
    </form>
  );
};

export default RegisterForm;

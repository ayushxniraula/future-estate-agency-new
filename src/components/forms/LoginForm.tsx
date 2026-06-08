import { useState } from "react";
import { supabase } from "../../my-components/supabase";

export const CLIENT_SESSION_KEY = "ea_client_session";

const LOGIN_FORM_STYLES = `
  .fw-login-form .fw-field {
    margin-bottom: 18px;
  }
  .fw-login-form .fw-field label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #7a7d96;
    margin-bottom: 7px;
  }
  .fw-login-form .fw-field input {
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
  .fw-login-form .fw-field input::placeholder { color: #b0b3c5; }
  .fw-login-form .fw-field input:focus {
    border-color: #1C94A4;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(28,148,164,0.1);
  }
  .fw-login-form .fw-field input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── Password wrapper with show/hide toggle ── */
  .fw-login-form .fw-password-wrap {
    position: relative;
  }
  .fw-login-form .fw-password-wrap input {
    padding-right: 44px;
  }
  .fw-login-form .fw-pw-toggle {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    cursor: pointer; padding: 0;
    color: #b0b3c5; font-size: 15px;
    transition: color 0.2s;
    line-height: 1;
  }
  .fw-login-form .fw-pw-toggle:hover { color: #252060; }

  /* ── Error alert ── */
  .fw-login-form .fw-error {
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
  .fw-login-form .fw-error-icon {
    font-size: 15px; flex-shrink: 0; margin-top: 1px;
  }

  /* ── Submit button ── */
  .fw-login-form .fw-submit-btn {
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
  .fw-login-form .fw-submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
  }
  .fw-login-form .fw-submit-btn:hover:not(:disabled)::after {
    background: rgba(255,255,255,0.08);
  }
  .fw-login-form .fw-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(37,32,96,0.25);
  }
  .fw-login-form .fw-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .fw-login-form .fw-submit-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* ── Loading spinner inside button ── */
  .fw-login-form .fw-btn-spinner {
    display: inline-block;
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: fw-spin 0.65s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  @keyframes fw-spin { to { transform: rotate(360deg); } }

  /* ── Footer note ── */
  .fw-login-form .fw-form-note {
    text-align: center;
    font-size: 12px;
    color: #a0a3b5;
    margin-top: 14px;
  }
  .fw-login-form .fw-form-note strong { color: #252060; }
`;

function injectLoginFormStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-login-form-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-login-form-styles";
    el.textContent = LOGIN_FORM_STYLES;
    document.head.appendChild(el);
  }
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  injectLoginFormStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { data: users, error: fetchErr } = await supabase
      .from("pending_users")
      .select("id, full_name, email, phone, status, username, password_plain")
      .eq("email", email.trim().toLowerCase())
      .limit(1);

    setLoading(false);

    if (fetchErr) {
      setError("Something went wrong. Please try again.");
      return;
    }
    if (!users || users.length === 0) {
      setError("No account found with that email.");
      return;
    }

    const user = users[0];

    if (user.status === "pending") {
      setError(
        "Your account is pending approval. You'll receive an email once verified.",
      );
      return;
    }

    if (user.status === "verified") {
      if (user.password_plain !== password.trim()) {
        setError("Incorrect password. Check your credentials email.");
        return;
      }
      localStorage.setItem(
        CLIENT_SESSION_KEY,
        JSON.stringify({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          username: user.username,
          ts: Date.now(),
        }),
      );
      window.location.reload();
      return;
    }

    setError("Your account status is unrecognised. Please contact support.");
  };

  return (
    <form className="fw-login-form" onSubmit={handleSubmit} noValidate>
      {/* Email */}
      <div className="fw-field">
        <label htmlFor="lf_email">Email Address</label>
        <input
          id="lf_email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="fw-field">
        <label htmlFor="lf_password">Password</label>
        <div className="fw-password-wrap">
          <input
            id="lf_password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="fw-pw-toggle"
            onClick={() => setShowPw((v) => !v)}
            tabIndex={-1}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? "🔒" : "👁️"}{" "}
          </button>
        </div>
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
            Signing in…
          </>
        ) : (
          "Sign In →"
        )}
      </button>

      <p className="fw-form-note">
        Don't have an account? Switch to the <strong>Signup</strong> tab above.
      </p>
    </form>
  );
};

export default LoginForm;

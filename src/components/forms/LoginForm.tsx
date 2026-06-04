// ============================================================
//  LoginForm.tsx  →  src/components/forms/LoginForm.tsx
//
//  Login flow:
//    1. Look up email in pending_users
//    2. If not found           → "No account found"
//    3. If status = pending    → "Your account is pending approval"
//    4. If status = verified   → compare password_plain
//    5. On match               → save session to localStorage, reload
// ============================================================

import { useState } from "react";
import { supabase } from "../../my-components/supabase";

// Key used to persist the logged-in client session
export const CLIENT_SESSION_KEY = "ea_client_session";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // ── 1. Fetch user record ──────────────────────────────
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

    // ── 2. No account ─────────────────────────────────────
    if (!users || users.length === 0) {
      setError("No account found with that email.");
      return;
    }

    const user = users[0];

    // ── 3. Pending approval ───────────────────────────────
    if (user.status === "pending") {
      setError(
        "Your account is pending approval. You will receive an email once verified.",
      );
      return;
    }

    // ── 4. Verified — check password ──────────────────────
    if (user.status === "verified") {
      if (user.password_plain !== password.trim()) {
        setError("Incorrect password. Check your credentials email.");
        return;
      }

      // ── 5. Success — persist session ───────────────────
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

      // Reload so the app can read the session and redirect
      window.location.reload();
      return;
    }

    // Fallback for any unexpected status value
    setError("Your account status is unrecognised. Please contact support.");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="input-group-meta position-relative mb-25">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div className="input-group-meta position-relative mb-20">
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div
          className="mb-20"
          role="alert"
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.3)",
            color: "#f87171",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div className="input-group-meta mb-10">
        <button
          type="submit"
          className="btn-eight fw-500 tran3s d-block mt-10"
          disabled={loading}
          style={{ width: "100%", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </div>

      <p
        className="text-center color-dark"
        style={{ fontSize: 12, marginTop: 12 }}
      >
        Don't have an account? Switch to the <strong>Signup</strong> tab.
      </p>
    </form>
  );
};

export default LoginForm;

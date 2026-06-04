// ============================================================
//  RegisterForm.tsx  →  src/components/forms/RegisterForm.tsx
// ============================================================

import { useState } from "react";
import { supabase } from "../../my-components/supabase";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

    // Check for duplicate email
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

    // Insert signup request
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

    setSuccess(true);
    setFullName("");
    setEmail("");
    setPhone("");
  };

  if (success) {
    return (
      <div className="text-center" style={{ padding: "20px 0" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(52,211,153,0.12)",
            border: "1px solid rgba(52,211,153,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 24,
            color: "#34d399",
          }}
        >
          ✓
        </div>
        <h4 className="fw-500 mb-10">Request Submitted!</h4>
        <p className="color-dark fs-16" style={{ lineHeight: 1.6 }}>
          Your account request is under review. Once approved, an admin will
          email your <strong>username</strong> and <strong>password</strong> to{" "}
          <strong>{email || "your email"}</strong>.
        </p>
        <button
          className="btn-eight fw-500 tran3s mt-20"
          style={{ padding: "10px 28px" }}
          onClick={() => setSuccess(false)}
        >
          Back to Form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="input-group-meta position-relative mb-25">
        <label>Full Name *</label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="input-group-meta position-relative mb-25">
        <label>Email Address *</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="input-group-meta position-relative mb-25">
        <label>Phone Number *</label>
        <input
          type="tel"
          placeholder="+1 234 567 8900"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
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
          {loading ? "Submitting…" : "Request Access →"}
        </button>
      </div>

      <p
        className="text-center color-dark"
        style={{ fontSize: 12, marginTop: 12 }}
      >
        An admin will review and email your login credentials.
      </p>
    </form>
  );
};

export default RegisterForm;

import { useState } from "react";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import { Link } from "react-router-dom";

const tab_title: string[] = ["Login", "Signup"];

const LOGIN_MODAL_STYLES = `
  /* ── Backdrop ── */
  .fw-login-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(18, 16, 48, 0.65);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 1040;
    animation: fw-backdrop-in 0.25s ease;
  }
  @keyframes fw-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Dialog ── */
  .fw-login-modal {
    position: fixed;
    inset: 0;
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .fw-login-modal-card {
    background: #ffffff;
    border-radius: 24px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 32px 80px rgba(37,32,96,0.22), 0 0 0 1px rgba(37,32,96,0.06);
    animation: fw-modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
    position: relative;
    overflow: hidden;
  }
  @keyframes fw-modal-in {
    from { opacity: 0; transform: translateY(24px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Top accent bar ── */
  .fw-login-modal-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
  }

  /* ── Inner padding ── */
  .fw-login-modal-body {
    padding: 40px 44px 36px;
  }
  @media (max-width: 520px) {
    .fw-login-modal-body { padding: 32px 24px 28px; }
  }

  /* ── Close button ── */
  .fw-login-close {
    position: absolute;
    top: 18px; right: 18px;
    width: 36px; height: 36px;
    border: none; border-radius: 50%;
    background: rgba(37,32,96,0.06);
    color: #252060;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.2s;
    z-index: 2;
  }
  .fw-login-close:hover {
    background: #252060;
    color: #fff;
    transform: rotate(90deg);
  }

  /* ── Tab switcher ── */
  .fw-login-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: rgba(37,32,96,0.05);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 32px;
    list-style: none;
    gap: 0;
  }
  .fw-login-tabs .nav-item { display: contents; }
  .fw-login-tabs .nav-link {
    width: 100%;
    padding: 10px 0;
    border: none;
    border-radius: 10px;
    background: transparent;
    font-size: 14px;
    font-weight: 700;
    color: #8a8c9e;
    cursor: pointer;
    transition: all 0.22s;
    letter-spacing: 0.2px;
  }
  .fw-login-tabs .nav-link:hover { color: #252060; }
  .fw-login-tabs .nav-link.active {
    background: #ffffff;
    color: #252060;
    box-shadow: 0 2px 12px rgba(37,32,96,0.12);
  }

  /* ── Headings ── */
  .fw-login-modal-body h2 {
    font-size: 26px;
    font-weight: 800;
    color: #252060;
    margin-bottom: 6px;
    line-height: 1.2;
  }
  .fw-login-modal-body .fw-login-sub {
    font-size: 14px;
    color: #8a8c9e;
    margin-bottom: 28px;
  }
  .fw-login-modal-body .fw-login-sub a {
    color: #1C94A4;
    font-weight: 700;
    text-decoration: none;
  }
  .fw-login-modal-body .fw-login-sub a:hover { color: #252060; }

  /* ── OR divider ── */
  .fw-login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
  }
  .fw-login-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(37,32,96,0.1);
  }
  .fw-login-divider-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #b0b3c5;
  }

  /* ── Social buttons ── */
  .fw-login-social-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .fw-login-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 12px;
    border: 1.5px solid rgba(37,32,96,0.12);
    border-radius: 12px;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #252060;
    text-decoration: none;
    transition: all 0.2s;
  }
  .fw-login-social-btn img { width: 18px; height: 18px; }
  .fw-login-social-btn:hover {
    border-color: #1C94A4;
    background: rgba(28,148,164,0.05);
    color: #252060;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(28,148,164,0.12);
  }
`;

function injectLoginModalStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-login-modal-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-login-modal-styles";
    el.textContent = LOGIN_MODAL_STYLES;
    document.head.appendChild(el);
  }
}

const LoginModal = ({ loginModal, setLoginModal }: any) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: any) => setActiveTab(index);

  injectLoginModalStyles();

  if (!loginModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fw-login-modal-backdrop"
        onClick={() => setLoginModal(false)}
      />

      {/* Dialog */}
      <div className="fw-login-modal" role="dialog" aria-modal="true">
        <div className="fw-login-modal-card">
          {/* Gradient top bar via ::before */}

          {/* Close */}
          <button
            className="fw-login-close"
            onClick={() => setLoginModal(false)}
            aria-label="Close"
          >
            ✕
          </button>

          <div className="fw-login-modal-body">
            {/* Tab switcher */}
            <ul className="fw-login-tabs nav nav-tabs w-100">
              {tab_title.map((tab, index) => (
                <li
                  key={index}
                  className="nav-item"
                  onClick={() => handleTabClick(index)}
                >
                  <button
                    className={`nav-link ${activeTab === index ? "active" : ""}`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            {/* Tab content */}
            <div className="tab-content">
              {/* Login */}
              <div
                className={`tab-pane fade ${activeTab === 0 ? "show active" : ""}`}
              >
                <h2>Welcome Back!</h2>
                <p className="fw-login-sub">
                  Don&apos;t have an account?{" "}
                  <Link to="#" onClick={() => handleTabClick(1)}>
                    Sign up
                  </Link>
                </p>
                <LoginForm />
              </div>

              {/* Register */}
              <div
                className={`tab-pane fade ${activeTab === 1 ? "show active" : ""}`}
              >
                <h2>Create Account</h2>
                <p className="fw-login-sub">
                  Already have an account?{" "}
                  <Link to="#" onClick={() => handleTabClick(0)}>
                    Login
                  </Link>
                </p>
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;

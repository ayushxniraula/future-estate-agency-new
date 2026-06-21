// ============================================================
//  NavMenu.tsx — FutureWork branded navigation
//  #252060 (navy) + #1C94A4 (teal) brand palette
//  Features:
//   • Smooth animated mobile drawer (no Bootstrap collapse)
//   • Active route indicator with animated teal underline
//   • Scroll-aware sticky header with shadow on scroll
//   • Staggered link reveal animation on drawer open
//   • Keyboard-accessible (Escape closes drawer)
//   • Full mobile responsiveness
//   • Login modal trigger instead of route navigation
//   • Protected route guard for /sell (requires auth)
//   • "Features" dropdown grouping Property Compare, Heat Map, Smart Finder
// ============================================================

import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// ─── Nav items ────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", to: "/" },
  { label: "Buy", to: "/buy" },
  { label: "Sell", to: "/sell" },
  { label: "About", to: "/about" },
  { label: "Calculator", to: "/calculator" },
  { label: "Contact", to: "/contact" },
];

// Items grouped under the "Features" dropdown
const FEATURE_ITEMS = [
  { label: "Property Compare", to: "/propcompare" },
  { label: "Heat Map", to: "/heatmap" },
  { label: "Smart Finder", to: "/smart" },
];

// ─── Routes that require authentication ───────────────────────
const PROTECTED_ROUTES = [""];

// ─── Styles ───────────────────────────────────────────────────
const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  :root {
    --fw-navy:       #252060;
    --fw-navy-deep:  #1a1650;
    --fw-teal:       #1C94A4;
    --fw-teal-light: #7de3ef;
    --fw-white:      #ffffff;
    --fw-offwhite:   #f8f9fc;
    --fw-rule:       #e8eaf2;
    --fw-ink:        #2d2f4a;
    --fw-muted:      #6b7191;
    --fw-font-body:  'DM Sans', system-ui, sans-serif;
    --fw-font-disp:  'DM Serif Display', Georgia, serif;
    --fw-nav-h:      76px;
    --fw-shadow:     0 2px 24px rgba(37,32,96,0.09);
  }

  /* ── Header shell ── */
  .fw-header {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    height: var(--fw-nav-h);
    background: var(--fw-white);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    font-family: var(--fw-font-body);
  }
  .fw-header.scrolled {
    border-bottom-color: var(--fw-rule);
    box-shadow: var(--fw-shadow);
  }

  /* ── Inner layout ── */
  .fw-header__inner {
    display: flex;
    align-items: center;
    height: 120%;
    padding: 0 32px;
    gap: 0;
    max-width: 1560px;
    margin: 0 auto;
  }
  @media (max-width: 1200px) { .fw-header__inner { padding: 0 24px; } }
  @media (max-width: 767px)  { .fw-header__inner { padding: 0 18px; } }

  /* ── Logo ── */
  .fw-logo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-right: 36px;
  }
  .fw-logo img {
    height: 45px;
    width: auto;
    display: block;
  }
  @media (max-width: 1199px) { .fw-logo { margin-right: 0; } }

  /* ── Desktop nav ── */
  .fw-nav {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
    gap: 2px;
  }
  @media (max-width: 1199px) { .fw-nav { display: none; } }

  .fw-nav__item { position: relative; }

  .fw-nav__link {
    display: flex;
    align-items: center;
    padding: 8px 13px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--fw-ink);
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
    position: relative;
    letter-spacing: 0.1px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: var(--fw-font-body);
  }
  .fw-nav__link::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 13px;
    right: 13px;
    height: 2px;
    border-radius: 2px;
    background: var(--fw-teal);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.24s cubic-bezier(0.34,1.56,0.64,1);
  }
  .fw-nav__link:hover {
    color: var(--fw-navy);
    background: rgba(37,32,96,0.04);
  }
  .fw-nav__link:hover::after { transform: scaleX(1); }
  .fw-nav__link.active {
    color: var(--fw-navy);
    font-weight: 600;
  }
  .fw-nav__link.active::after {
    transform: scaleX(1);
    background: linear-gradient(90deg, var(--fw-navy), var(--fw-teal));
  }

  /* Protected route lock icon hint */
  .fw-nav__link[data-protected="true"]:not(.active)::before {
    font-size: 9px;
    position: absolute;
    top: 4px;
    right: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .fw-nav__link[data-protected="true"]:not(.active):hover::before {
    opacity: 0.5;
  }

  /* ── Features dropdown ── */
  .fw-dropdown {
    position: relative;
  }

  .fw-dropdown__trigger {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 13px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--fw-ink);
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
    position: relative;
    letter-spacing: 0.1px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: var(--fw-font-body);
  }
  .fw-dropdown__trigger::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 13px;
    right: 13px;
    height: 2px;
    border-radius: 2px;
    background: var(--fw-teal);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.24s cubic-bezier(0.34,1.56,0.64,1);
  }
  .fw-dropdown__trigger:hover {
    color: var(--fw-navy);
    background: rgba(37,32,96,0.04);
  }
  .fw-dropdown__trigger:hover::after,
  .fw-dropdown__trigger.active::after { transform: scaleX(1); }
  .fw-dropdown__trigger.active {
    color: var(--fw-navy);
    font-weight: 600;
  }
  .fw-dropdown__trigger.active::after {
    background: linear-gradient(90deg, var(--fw-navy), var(--fw-teal));
  }

  .fw-dropdown__caret {
    width: 12px;
    height: 12px;
    transition: transform 0.22s cubic-bezier(0.34,1.2,0.64,1);
    flex-shrink: 0;
    margin-top: 1px;
  }
  .fw-dropdown.open .fw-dropdown__caret {
    transform: rotate(180deg);
  }

  .fw-dropdown__menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 200px;
    background: var(--fw-white);
    border: 1px solid var(--fw-rule);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(37,32,96,0.12);
    padding: 6px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-6px) scale(0.97);
    transform-origin: top left;
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.2,0.64,1);
    z-index: 100;
  }
  .fw-dropdown.open .fw-dropdown__menu {
    opacity: 1;
    pointer-events: all;
    transform: translateY(0) scale(1);
  }

  .fw-dropdown__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--fw-ink);
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    font-family: var(--fw-font-body);
    letter-spacing: 0.1px;
    white-space: nowrap;
  }
  .fw-dropdown__item:hover {
    background: rgba(37,32,96,0.05);
    color: var(--fw-navy);
  }
  .fw-dropdown__item.active {
    background: linear-gradient(120deg, rgba(37,32,96,0.08), rgba(28,148,164,0.10));
    color: var(--fw-navy);
    font-weight: 600;
  }
  .fw-dropdown__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--fw-teal);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .fw-dropdown__item:hover .fw-dropdown__dot,
  .fw-dropdown__item.active .fw-dropdown__dot {
    opacity: 1;
  }

  /* ── Right side: Login + hamburger ── */
  .fw-header__right {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    flex-shrink: 0;
  }

  .fw-login-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 22px;
    border-radius: 50px;
    border: 1.5px solid var(--fw-navy);
    color: var(--fw-navy);
    font-size: 13px;
    font-weight: 600;
    font-family: var(--fw-font-body);
    text-decoration: none;
    transition: all 0.22s ease;
    white-space: nowrap;
    letter-spacing: 0.2px;
    background: transparent;
    cursor: pointer;
  }
  .fw-login-btn svg { transition: transform 0.22s ease; }
  .fw-login-btn:hover {
    background: var(--fw-navy);
    color: var(--fw-white);
  }
  .fw-login-btn:hover svg { transform: rotate(45deg); }

  /* ── Hamburger button ── */
  .fw-burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    border: 1.5px solid var(--fw-rule);
    background: transparent;
    cursor: pointer;
    padding: 0;
    transition: border-color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .fw-burger:hover {
    border-color: var(--fw-navy);
    background: rgba(37,32,96,0.04);
  }
  @media (max-width: 1199px) { .fw-burger { display: flex; } }

  .fw-burger__bar {
    display: block;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: var(--fw-navy);
    transition: transform 0.3s cubic-bezier(0.23,1,0.32,1), opacity 0.2s, width 0.2s;
    transform-origin: center;
  }
  .fw-burger.open .fw-burger__bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .fw-burger.open .fw-burger__bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .fw-burger.open .fw-burger__bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── Mobile drawer overlay ── */
  .fw-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(37,32,96,0.45);
    backdrop-filter: blur(4px);
    z-index: 998;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .fw-drawer-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  /* ── Mobile drawer panel ── */
  .fw-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(340px, 88vw);
    background: var(--fw-white);
    z-index: 999;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .fw-drawer.open { transform: translateX(0); }

  .fw-drawer::before {
    content: '';
    display: block;
    height: 4px;
    background: linear-gradient(90deg, var(--fw-navy), var(--fw-teal));
    flex-shrink: 0;
  }

  .fw-drawer__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--fw-rule);
    flex-shrink: 0;
  }
  .fw-drawer__logo img { height: 38px; width: auto; }
  .fw-drawer__close {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1.5px solid var(--fw-rule);
    background: transparent;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--fw-navy);
    font-size: 18px;
    transition: all 0.2s;
    line-height: 1;
  }
  .fw-drawer__close:hover {
    background: var(--fw-navy);
    border-color: var(--fw-navy);
    color: var(--fw-white);
  }

  .fw-drawer__nav {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px 20px;
    list-style: none;
    margin: 0;
    scrollbar-width: none;
  }
  .fw-drawer__nav::-webkit-scrollbar { display: none; }

  .fw-drawer__nav-item {
    opacity: 0;
    transform: translateX(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(1)  { transition-delay: 0.04s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(2)  { transition-delay: 0.08s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(3)  { transition-delay: 0.12s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(4)  { transition-delay: 0.16s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(5)  { transition-delay: 0.20s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(6)  { transition-delay: 0.24s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(7)  { transition-delay: 0.28s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(8)  { transition-delay: 0.32s; }
  .fw-drawer.open .fw-drawer__nav-item:nth-child(9)  { transition-delay: 0.36s; }
  .fw-drawer.open .fw-drawer__nav-item { opacity: 1; transform: translateX(0); }

  .fw-drawer__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 16px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    color: var(--fw-ink);
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
    margin-bottom: 2px;
    font-family: var(--fw-font-body);
    letter-spacing: 0.1px;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  .fw-drawer__link:hover {
    background: rgba(37,32,96,0.05);
    color: var(--fw-navy);
  }
  .fw-drawer__link.active {
    background: linear-gradient(120deg, rgba(37,32,96,0.08), rgba(28,148,164,0.10));
    color: var(--fw-navy);
    font-weight: 700;
  }
  .fw-drawer__link .fw-drawer__chevron {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--fw-rule);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    color: var(--fw-muted);
    flex-shrink: 0;
    transition: background 0.18s, color 0.18s;
  }
  .fw-drawer__link:hover .fw-drawer__chevron,
  .fw-drawer__link.active .fw-drawer__chevron {
    background: var(--fw-teal);
    color: var(--fw-white);
  }
  .fw-drawer__link.active {
    position: relative;
    padding-left: 20px;
  }
  .fw-drawer__link.active::before {
    content: '';
    position: absolute;
    left: 0; top: 8px; bottom: 8px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, var(--fw-navy), var(--fw-teal));
  }
  .fw-drawer__link[data-protected="true"] .fw-drawer__lock {
    font-size: 11px;
    opacity: 0.45;
    margin-right: 4px;
  }

  /* ── Features section in drawer ── */
  .fw-drawer__section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px 4px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--fw-muted);
    font-family: var(--fw-font-body);
  }
  .fw-drawer__section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--fw-rule);
  }

  .fw-drawer__sub-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 16px 11px 28px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--fw-ink);
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
    margin-bottom: 2px;
    font-family: var(--fw-font-body);
    letter-spacing: 0.1px;
  }
  .fw-drawer__sub-link:hover {
    background: rgba(37,32,96,0.05);
    color: var(--fw-navy);
  }
  .fw-drawer__sub-link.active {
    background: linear-gradient(120deg, rgba(37,32,96,0.08), rgba(28,148,164,0.10));
    color: var(--fw-navy);
    font-weight: 700;
    position: relative;
    padding-left: 32px;
  }
  .fw-drawer__sub-link.active::before {
    content: '';
    position: absolute;
    left: 16px; top: 8px; bottom: 8px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, var(--fw-navy), var(--fw-teal));
  }
  .fw-drawer__sub-link .fw-drawer__chevron {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--fw-rule);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    color: var(--fw-muted);
    flex-shrink: 0;
    transition: background 0.18s, color 0.18s;
  }
  .fw-drawer__sub-link:hover .fw-drawer__chevron,
  .fw-drawer__sub-link.active .fw-drawer__chevron {
    background: var(--fw-teal);
    color: var(--fw-white);
  }

  /* ── Drawer footer ── */
  .fw-drawer__foot {
    padding: 16px 24px 28px;
    border-top: 1px solid var(--fw-rule);
    flex-shrink: 0;
  }
  .fw-drawer__login {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: linear-gradient(120deg, var(--fw-navy), #1e1a6e);
    color: var(--fw-white);
    font-size: 14px;
    font-weight: 600;
    font-family: var(--fw-font-body);
    text-decoration: none;
    transition: opacity 0.2s, box-shadow 0.2s;
    letter-spacing: 0.2px;
    box-shadow: 0 6px 20px rgba(37,32,96,0.22);
    border: none;
    cursor: pointer;
  }
  .fw-drawer__login:hover { opacity: 0.9; box-shadow: 0 8px 28px rgba(37,32,96,0.3); }
  .fw-drawer__login svg { transition: transform 0.22s; }
  .fw-drawer__login:hover svg { transform: rotate(45deg); }

  /* ── Body scroll lock ── */
  body.fw-nav-open { overflow: hidden; }

  /* ── Spacer ── */
  .fw-header-spacer { height: var(--fw-nav-h); }
`;

function injectNavStyles() {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("fw-nav-styles")
  ) {
    const el = document.createElement("style");
    el.id = "fw-nav-styles";
    el.textContent = NAV_STYLES;
    document.head.appendChild(el);
  }
}

// ─── Component ────────────────────────────────────────────────
const NavMenu = ({ onLoginClick, session }: any) => {
  injectNavStyles();

  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // ── Scroll-aware shadow ───────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close drawer on route change ─────────────────────────
  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ── Body scroll lock ─────────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle("fw-nav-open", drawerOpen);
    return () => document.body.classList.remove("fw-nav-open");
  }, [drawerOpen]);

  // ── Escape key closes drawer / dropdown ──────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (drawerOpen) setDrawerOpen(false);
        if (dropdownOpen) setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, dropdownOpen]);

  // ── Close dropdown on outside click ─────────────────────
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [dropdownOpen]);

  const logout = () => {
    localStorage.removeItem("ea_client_session");
    window.location.reload();
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  const isFeatureActive = FEATURE_ITEMS.some((item) => isActive(item.to));

  const isProtectedAndUnauthed = (path: string) =>
    PROTECTED_ROUTES.includes(path) && !session;

  const handleNavClick = (
    e: React.MouseEvent,
    path: string,
    closeDrawer = false,
  ) => {
    if (isProtectedAndUnauthed(path)) {
      e.preventDefault();
      if (closeDrawer) setDrawerOpen(false);
      onLoginClick();
    } else if (closeDrawer) {
      setDrawerOpen(false);
    }
  };

  return (
    <>
      {/* ── Fixed header ── */}
      <header className={`fw-header${scrolled ? " scrolled" : ""}`}>
        <div className="fw-header__inner">
          {/* Logo */}
          <Link to="/" className="fw-logo">
            <img src="/assets/ayu.png" alt="Future Work" />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation">
            <ul className="fw-nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.to} className="fw-nav__item">
                  <Link
                    to={item.to}
                    className={`fw-nav__link${isActive(item.to) ? " active" : ""}`}
                    aria-current={isActive(item.to) ? "page" : undefined}
                    data-protected={
                      PROTECTED_ROUTES.includes(item.to) ? "true" : undefined
                    }
                    onClick={(e) => handleNavClick(e, item.to)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Features dropdown */}
              <li
                ref={dropdownRef}
                className={`fw-nav__item fw-dropdown${dropdownOpen ? " open" : ""}`}
              >
                <button
                  className={`fw-dropdown__trigger${isFeatureActive ? " active" : ""}`}
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  Features
                  <svg
                    className="fw-dropdown__caret"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="fw-dropdown__menu" role="menu">
                  {FEATURE_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      className={`fw-dropdown__item${isActive(item.to) ? " active" : ""}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="fw-dropdown__dot" aria-hidden="true" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
          </nav>

          {/* LOGIN LOGOUT BUTTON */}
          {/* <div className="fw-header__right">
            {!session ? (
              <button
                onClick={onLoginClick}
                className="fw-login-btn d-none d-lg-inline-flex"
              >
                <span>Login / Sign Up</span>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M1 10L10 1M10 1H3M10 1V8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="fw-login-btn d-none d-lg-inline-flex"
                onClick={logout}
              >
                <span>Logout</span>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M1 10L10 1M10 1H3M10 1V8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            <button
              className={`fw-burger${drawerOpen ? " open" : ""}`}
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              aria-controls="fw-mobile-drawer"
            >
              <span className="fw-burger__bar" />
              <span className="fw-burger__bar" />
              <span className="fw-burger__bar" />
            </button>
          </div> */}
        </div>
      </header>

      <div className="fw-header-spacer" aria-hidden="true" />

      <div
        className={`fw-drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        id="fw-mobile-drawer"
        ref={drawerRef}
        className={`fw-drawer${drawerOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="fw-drawer__head">
          <Link
            to="/"
            className="fw-drawer__logo"
            onClick={() => setDrawerOpen(false)}
          >
            <img src="/assets/images/logo/logo_01.svg" alt="Future Work" />
          </Link>
          <button
            className="fw-drawer__close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <ul className="fw-drawer__nav" role="navigation">
          {NAV_ITEMS.map((item) => {
            const needsAuth = isProtectedAndUnauthed(item.to);
            return (
              <li key={item.to} className="fw-drawer__nav-item">
                <Link
                  to={item.to}
                  className={`fw-drawer__link${isActive(item.to) ? " active" : ""}`}
                  aria-current={isActive(item.to) ? "page" : undefined}
                  data-protected={needsAuth ? "true" : undefined}
                  onClick={(e) => handleNavClick(e, item.to, true)}
                >
                  <span>
                    {needsAuth && (
                      <span className="fw-drawer__lock" aria-hidden="true">
                        🔒{" "}
                      </span>
                    )}
                    {item.label}
                  </span>
                  <span className="fw-drawer__chevron" aria-hidden="true">
                    ›
                  </span>
                </Link>
              </li>
            );
          })}

          <li className="fw-drawer__nav-item">
            <div className="fw-drawer__section-label">Features</div>
            {FEATURE_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`fw-drawer__sub-link${isActive(item.to) ? " active" : ""}`}
                aria-current={isActive(item.to) ? "page" : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                <span>{item.label}</span>
                <span className="fw-drawer__chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </li>
        </ul>

        {/* Drawer footer */}
        <div className="fw-drawer__foot">
          {!session ? (
            <button
              onClick={() => {
                setDrawerOpen(false);
                onLoginClick();
              }}
              className="fw-drawer__login"
            >
              <span>Login / Sign Up</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="fw-drawer__login"
              onClick={() => setDrawerOpen(false)}
            >
              <span>My Account</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default NavMenu;

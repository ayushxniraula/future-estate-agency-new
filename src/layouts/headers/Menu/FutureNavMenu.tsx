import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavMenu = () => {
  const [navClick, setNavClick] = useState<any>();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navClick]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <ul className="navbar-nav align-items-lg-center">
      <li className="d-block d-lg-none">
        <div className="logo">
          <Link to="/" className="d-block">
            <img src="/assets/images/logo/logo_01.svg" alt="" />
          </Link>
        </div>
      </li>

      <li className={`nav-item ${isActive("/") ? "dashboard-menu" : ""}`}>
        <Link
          onClick={() => setNavClick(!navClick)}
          className="nav-link"
          to="/"
        >
          Dashboard
        </Link>
      </li>

      <li className={`nav-item ${isActive("/buy") ? "dashboard-menu" : ""}`}>
        <Link
          onClick={() => setNavClick(!navClick)}
          className="nav-link"
          to="/buy"
        >
          Buy
        </Link>
      </li>

      <li className={`nav-item ${isActive("/sell") ? "dashboard-menu" : ""}`}>
        <Link
          onClick={() => setNavClick(!navClick)}
          className="nav-link"
          to="/sell"
        >
          Sell
        </Link>
      </li>

      <li className={`nav-item ${isActive("/about") ? "dashboard-menu" : ""}`}>
        <Link
          onClick={() => setNavClick(!navClick)}
          className="nav-link"
          to="/about"
        >
          About
        </Link>
      </li>
      <li
        className={`nav-item ${isActive("/calculator") ? "dashboard-menu" : ""}`}
      >
        <Link
          onClick={() => setNavClick(!navClick)}
          className="nav-link"
          to="/calculator"
        >
          Calculator
        </Link>
      </li>
      <li
        className={`nav-item ${isActive("/propcompare") ? "dashboard-menu" : ""}`}
      >
        <Link
          onClick={() => setNavClick(!navClick)}
          className="nav-link"
          to="/propcompare"
        >
          Property Compare
        </Link>
      </li>

      <li
        className={`nav-item ${isActive("/contact") ? "dashboard-menu" : ""}`}
      >
        <Link
          onClick={() => setNavClick(!navClick)}
          className="nav-link"
          to="/contact"
        >
          Contact
        </Link>
      </li>
    </ul>
  );
};

export default NavMenu;

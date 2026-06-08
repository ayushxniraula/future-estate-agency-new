import { useState, useCallback } from "react";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
import Brand from "../components/homes/home-four/Brand";
import FancyBanner from "../components/common/FancyBanner";
import FutureFooter from "../layouts/footers/FutureFooter";
import { Link } from "react-router-dom";
import NavMenu from "../layouts/headers/Menu/FutureNavMenu";
import { useClientSession } from "./userclientsession";
import LoginModal from "../modals/LoginModal";

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

function fmtNPR(v: number): string {
  const r = Math.round(v);
  if (r >= 10_000_000) return `रु ${(r / 10_000_000).toFixed(2)} Cr`;
  if (r >= 100_000) return `रु ${(r / 100_000).toFixed(2)} L`;
  return `रु ${r.toLocaleString("en-IN")}`;
}

function fmtShort(v: number): string {
  const r = Math.round(v);
  if (r >= 10_000_000) return `${(r / 10_000_000).toFixed(1)} Cr`;
  if (r >= 100_000) return `${(r / 100_000).toFixed(1)} L`;
  return r.toLocaleString("en-IN");
}

function calcEMI(principal: number, annualRate: number, tenureYears: number) {
  const r = annualRate / 12 / 100;
  const n = Math.round(tenureYears * 12);
  if (n === 0) return { emi: 0, totalInterest: 0, totalPayment: 0, n: 0 };
  if (r === 0)
    return { emi: principal / n, totalInterest: 0, totalPayment: principal, n };
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  return { emi, totalInterest: totalPayment - principal, totalPayment, n };
}

function buildAmortSchedule(
  principal: number,
  annualRate: number,
  n: number,
  emi: number,
) {
  const r = annualRate / 12 / 100;
  let bal = principal;
  const rows: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[] = [];
  let yPri = 0,
    yInt = 0,
    yr = 0;

  for (let i = 1; i <= n; i++) {
    const intPay = bal * r;
    const priPay = emi - intPay;
    bal = Math.max(0, bal - priPay);
    yPri += priPay;
    yInt += intPay;
    if (i % 12 === 0 || i === n) {
      yr++;
      rows.push({ year: yr, principal: yPri, interest: yInt, balance: bal });
      yPri = 0;
      yInt = 0;
    }
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────
//  Range Slider
// ─────────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}

function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="calc-field">
      <div className="calc-field-head">
        <span className="calc-label">{label}</span>
        <div className="calc-value-box">
          {prefix && <span className="calc-affix">{prefix}</span>}
          <input
            type="number"
            className="calc-num-input"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = Math.min(max, Math.max(min, Number(e.target.value)));
              onChange(v);
            }}
          />
          {suffix && <span className="calc-affix">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        className="calc-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--pct": `${pct.toFixed(1)}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Donut Chart (SVG)
// ─────────────────────────────────────────────────────────────

function DonutChart({ principalPct }: { principalPct: number }) {
  const r = 60,
    cx = 80,
    cy = 80;
  const circ = 2 * Math.PI * r;
  const intPct = 1 - principalPct;
  const dI = intPct * circ;
  const dP = principalPct * circ;

  return (
    <svg
      viewBox="0 0 160 160"
      className="donut-svg"
      role="img"
      aria-label="Donut chart showing principal vs interest"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--c-rule)"
        strokeWidth={22}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--c-interest)"
        strokeWidth={22}
        strokeDasharray={`${dI.toFixed(2)} ${circ.toFixed(2)}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--c-ink)"
        strokeWidth={22}
        strokeDasharray={`${dP.toFixed(2)} ${(circ - dP).toFixed(2)}`}
        strokeDashoffset={(-dI).toFixed(2)}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize={10}
        fill="var(--c-ink-3)"
      >
        principal
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontSize={16}
        fontWeight={600}
        fill="var(--c-ink)"
      >
        {Math.round(principalPct * 100)}%
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  EMI Calculator
// ─────────────────────────────────────────────────────────────

function EMICalculator() {
  const [amount, setAmount] = useState(5_000_000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(20);
  const [tenureMode, setTenureMode] = useState<"yr" | "mo">("yr");
  const [showAmort, setShowAmort] = useState(false);

  const tenureYears = tenureMode === "yr" ? tenure : tenure / 12;
  const { emi, totalInterest, totalPayment, n } = calcEMI(
    amount,
    rate,
    tenureYears,
  );
  const principalPct = totalPayment > 0 ? amount / totalPayment : 0.5;

  const amortRows = showAmort ? buildAmortSchedule(amount, rate, n, emi) : [];

  function switchTenureMode(m: "yr" | "mo") {
    if (m === tenureMode) return;
    if (m === "mo") setTenure(Math.min(360, tenure * 12));
    else setTenure(Math.max(1, Math.round(tenure / 12)));
    setTenureMode(m);
  }

  return (
    <div className="emi-wrap">
      <div className="emi-cols">
        {/* ── Inputs ── */}
        <div className="emi-inputs">
          <RangeSlider
            label="Loan amount"
            value={amount}
            min={100_000}
            max={100_000_000}
            step={50_000}
            prefix="रु"
            onChange={setAmount}
          />
          <RangeSlider
            label="Annual interest rate"
            value={rate}
            min={1}
            max={30}
            step={0.1}
            suffix="%"
            onChange={setRate}
          />

          {/* Tenure with mode switch */}
          <div className="calc-field">
            <div className="calc-field-head">
              <span className="calc-label">Loan tenure</span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div className="tenure-switch">
                  <button
                    className={`tenure-btn${tenureMode === "yr" ? " active" : ""}`}
                    onClick={() => switchTenureMode("yr")}
                  >
                    Yr
                  </button>
                  <button
                    className={`tenure-btn${tenureMode === "mo" ? " active" : ""}`}
                    onClick={() => switchTenureMode("mo")}
                  >
                    Mo
                  </button>
                </div>
                <div className="calc-value-box">
                  <input
                    type="number"
                    className="calc-num-input"
                    value={tenure}
                    min={1}
                    max={tenureMode === "yr" ? 30 : 360}
                    step={1}
                    onChange={(e) =>
                      setTenure(
                        Math.min(
                          tenureMode === "yr" ? 30 : 360,
                          Math.max(1, Number(e.target.value)),
                        ),
                      )
                    }
                  />
                  <span className="calc-affix">{tenureMode}</span>
                </div>
              </div>
            </div>
            <input
              type="range"
              className="calc-range"
              min={1}
              max={tenureMode === "yr" ? 30 : 360}
              step={1}
              value={tenure}
              style={
                {
                  "--pct": `${((tenure - 1) / ((tenureMode === "yr" ? 30 : 360) - 1)) * 100}%`,
                } as React.CSSProperties
              }
              onChange={(e) => setTenure(Number(e.target.value))}
            />
          </div>

          {/* Metric summary chips */}
          <div className="metric-row">
            <div className="metric-chip">
              <span className="metric-chip__label">Monthly EMI</span>
              <span className="metric-chip__value">{fmtShort(emi)}</span>
            </div>
            <div className="metric-chip">
              <span className="metric-chip__label">Total interest</span>
              <span className="metric-chip__value interest">
                {fmtShort(totalInterest)}
              </span>
            </div>
            <div className="metric-chip">
              <span className="metric-chip__label">Total payment</span>
              <span className="metric-chip__value">
                {fmtShort(totalPayment)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Results card ── */}
        <div className="emi-results">
          <div className="donut-container">
            <DonutChart principalPct={principalPct} />
            <div className="donut-legend">
              <span>
                <span className="leg-dot leg-dot--primary" />
                Principal
              </span>
              <span>
                <span className="leg-dot leg-dot--interest" />
                Interest
              </span>
            </div>
          </div>

          <div className="result-list">
            <div className="result-row">
              <span className="result-row__label">Monthly EMI</span>
              <span className="result-row__value result-row__value--emi">
                {fmtNPR(emi)}
              </span>
            </div>
            <div className="result-row">
              <span className="result-row__label">Total interest payable</span>
              <span className="result-row__value result-row__value--int">
                {fmtNPR(totalInterest)}
              </span>
            </div>
            <div className="result-row">
              <span className="result-row__label">Principal amount</span>
              <span className="result-row__value">{fmtNPR(amount)}</span>
            </div>
            <div className="result-row">
              <span className="result-row__label">Total payment</span>
              <span className="result-row__value">{fmtNPR(totalPayment)}</span>
            </div>
          </div>

          <button
            className="amort-toggle-btn"
            onClick={() => setShowAmort(!showAmort)}
          >
            <i
              className={`fa-solid ${showAmort ? "fa-chevron-up" : "fa-table"} me-2`}
            />
            {showAmort ? "Hide" : "View"} amortization schedule
          </button>
        </div>
      </div>

      {/* ── Amortization table ── */}
      {showAmort && (
        <div className="amort-section">
          <div className="amort-scroll">
            <table className="amort-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal paid</th>
                  <th>Interest paid</th>
                  <th>Remaining balance</th>
                </tr>
              </thead>
              <tbody>
                {amortRows.map((row) => (
                  <tr key={row.year}>
                    <td>Year {row.year}</td>
                    <td>{fmtNPR(row.principal)}</td>
                    <td style={{ color: "var(--c-interest)" }}>
                      {fmtNPR(row.interest)}
                    </td>
                    <td>{fmtNPR(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Unit Converter
// ─────────────────────────────────────────────────────────────

const UNIT_FACTORS: Record<string, number> = {
  ropani: 5476,
  aana: 342.25,
  paisa: 85.5625,
  daam: 21.390625,
  bigha: 72900,
  kattha: 3645,
  dhur: 182.25,
  sqft: 1,
  sqm: 10.7639,
};

function fmtUnit(v: number, decimals = 4): string {
  if (isNaN(v) || !isFinite(v)) return "";
  return parseFloat(v.toFixed(decimals)).toString();
}

type UnitValues = Record<string, string>;

function UnitGroup({
  title,
  subtitle,
  icon,
  fields,
  values,
  onChange,
}: {
  title: string;
  subtitle: string;
  icon: string;
  fields: { key: string; label: string }[];
  values: UnitValues;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <div className="unit-card">
      <div className="unit-card__head">
        <i className={`fa-solid ${icon}`} />
        <div>
          <div className="unit-card__title">{title}</div>
          <div className="unit-card__sub">{subtitle}</div>
        </div>
      </div>
      {fields.map(({ key, label }) => (
        <div className="unit-row" key={key}>
          <label htmlFor={`u-${key}`}>{label}</label>
          <input
            id={`u-${key}`}
            type="number"
            min={0}
            value={values[key]}
            placeholder="0"
            onChange={(e) => onChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

function UnitCalculator() {
  const empty: UnitValues = Object.fromEntries(
    Object.keys(UNIT_FACTORS).map((k) => [k, ""]),
  );
  const [vals, setVals] = useState<UnitValues>(empty);

  const handleChange = useCallback((src: string, raw: string) => {
    if (raw === "") {
      setVals({ ...empty });
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num) || num < 0) {
      setVals({ ...empty });
      return;
    }
    const sqft = num * UNIT_FACTORS[src];
    const next: UnitValues = { ...empty, [src]: raw };
    Object.keys(UNIT_FACTORS).forEach((u) => {
      if (u !== src)
        next[u] = fmtUnit(sqft / UNIT_FACTORS[u], u === "sqft" ? 2 : 4);
    });
    setVals(next);
  }, []);

  return (
    <div className="unit-wrap">
      <div className="unit-grid">
        <UnitGroup
          title="Ropani system"
          subtitle="Hilly & mountain region"
          icon="fa-mountain-sun"
          fields={[
            { key: "ropani", label: "Ropani" },
            { key: "aana", label: "Aana" },
            { key: "paisa", label: "Paisa" },
            { key: "daam", label: "Daam" },
          ]}
          values={vals}
          onChange={handleChange}
        />
        <UnitGroup
          title="Bigha system"
          subtitle="Terai region"
          icon="fa-seedling"
          fields={[
            { key: "bigha", label: "Bigha" },
            { key: "kattha", label: "Kattha" },
            { key: "dhur", label: "Dhur" },
          ]}
          values={vals}
          onChange={handleChange}
        />
        <UnitGroup
          title="Feet / meter"
          subtitle="International standard"
          icon="fa-ruler-combined"
          fields={[
            { key: "sqft", label: "Sq. feet" },
            { key: "sqm", label: "Sq. meter" },
          ]}
          values={vals}
          onChange={handleChange}
        />
      </div>

      <div className="unit-ref">
        <p className="unit-ref__title">Quick reference</p>
        <ul className="unit-ref__list">
          <li>1 Ropani = 16 Aana = 5,476 sq.ft</li>
          <li>1 Bigha = 20 Kattha = 72,900 sq.ft</li>
          <li>1 Kattha = 20 Dhur = 3,645 sq.ft</li>
          <li>1 Aana = 4 Paisa = 342.25 sq.ft</li>
          <li>1 Bigha ≈ 13.31 Ropani</li>
          <li>1 Sq. meter = 10.7639 sq.ft</li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────

const Calculator = () => {
  const [tab, setTab] = useState<"emi" | "unit">("emi");
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();

  return (
    <Wrapper>
      <SEO pageTitle="Calculator – EMI & Land Unit" />
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />

      {/* ── Banner ── */}
      <div className="inner-banner-three inner-banner text-center z-1 position-relative">
        <div
          className="bg-wrapper overflow-hidden position-relative z-1"
          style={{ backgroundImage: `url(/assets/images/media/img_51.jpg)` }}
        >
          <div className="container position-relative z-2">
            <h2 className="mb-35 xl-mb-20 md-mb-10 pt-15 font-garamond text-white">
              Calculator
            </h2>
            <ul className="theme-breadcrumb style-none d-inline-flex align-items-center justify-content-center position-relative z-1 bottom-line">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>/</li>
              <li>Calculator</li>
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

      {/* ── Calculator section ── */}
      <div className="calculator-section mt-20 xl-mt-110 mb-150 xl-mb-110">
        <div className="container">
          {/* Tab switcher */}
          <div className="calc-tab-bar mb-20">
            <button
              className={`calc-tab-btn${tab === "emi" ? " active" : ""}`}
              onClick={() => setTab("emi")}
            >
              <i className="fa-solid fa-percent me-2" />
              EMI Calculator
            </button>
            <button
              className={`calc-tab-btn${tab === "unit" ? " active" : ""}`}
              onClick={() => setTab("unit")}
            >
              <i className="fa-solid fa-ruler-combined me-2" />
              Unit Calculator
            </button>
          </div>

          {/* Panel */}
          <div className="calc-panel">
            {tab === "emi" ? (
              <>
                <div className="calc-panel-header mb-50">
                  <h3 className="calc-panel-title">EMI Calculator</h3>
                  <p className="calc-panel-desc">
                    Calculate your monthly loan installment instantly. Results
                    include a full amortization breakdown.
                  </p>
                </div>
                <EMICalculator />
              </>
            ) : (
              <>
                <div className="calc-panel-header mb-50">
                  <h3 className="calc-panel-title">Land Unit Converter</h3>
                  <p className="calc-panel-desc">
                    Convert between Nepal's land measurement systems — Ropani,
                    Aana, Bigha, Kattha, and international units.
                  </p>
                </div>
                <UnitCalculator />
              </>
            )}
          </div>
        </div>
      </div>

      <Brand />
      <FancyBanner />
      <FutureFooter />

      <style>{`
        /* ─── FutureWork Design Tokens ─── */
        :root {
          --c-ink:       #252060;
          --c-ink-2:     #3d3880;
          --c-ink-3:     #8a88a8;
          --c-rule:      #e8e7f0;
          --c-surface:   #f5f5fb;
          --c-interest:  #1C94A4;
          --c-teal:      #1C94A4;
          --c-teal-light:#e8f7f9;
          --radius-md:   10px;
          --radius-lg:   16px;
          --shadow-card: 0 1px 3px rgba(37,32,96,.06), 0 4px 16px rgba(37,32,96,.08);
        }

        /* ─── Tab bar ─── */
        .calc-tab-bar {
          display: flex;
          gap: 0;
          border-bottom: 2px solid var(--c-rule);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .calc-tab-btn {
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 600;
          color: var(--c-ink-3);
          cursor: pointer;
          margin-bottom: -2px;
          transition: color .2s, border-color .2s;
          white-space: nowrap;
        }
        .calc-tab-btn.active {
          color: var(--c-ink);
          border-bottom-color: var(--c-ink);
        }
        .calc-tab-btn:hover:not(.active) { color: var(--c-ink-2); }

        /* ─── Panel header ─── */
        .calc-panel-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--c-ink);
          margin-bottom: 10px;
        }
        .calc-panel-desc { color: var(--c-ink-3); font-size: 16px; }

        /* ─── EMI layout ─── */
        .emi-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 991px) { .emi-cols { grid-template-columns: 1fr; } }

        /* ─── Slider fields ─── */
        .calc-field { margin-bottom: 1.5rem; }
        .calc-field-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .calc-label { font-size: 14px; font-weight: 600; color: var(--c-ink-2); }
        .calc-value-box {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--c-surface);
          border: 1.5px solid var(--c-rule);
          border-radius: var(--radius-md);
          padding: 5px 10px;
          transition: border-color .2s;
        }
        .calc-value-box:focus-within { border-color: var(--c-ink); }
        .calc-affix { font-size: 12px; font-weight: 600; color: var(--c-ink-3); }
        .calc-num-input {
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 700;
          color: var(--c-ink);
          width: 80px;
          text-align: right;
          outline: none;
          -moz-appearance: textfield;
        }
        .calc-num-input::-webkit-outer-spin-button,
        .calc-num-input::-webkit-inner-spin-button { -webkit-appearance: none; }

        .calc-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(
            to right,
            var(--c-ink) 0%,
            var(--c-ink) var(--pct, 50%),
            var(--c-rule) var(--pct, 50%),
            var(--c-rule) 100%
          );
        }
        .calc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--c-ink);
          box-shadow: 0 2px 8px rgba(37,32,96,.2);
          cursor: pointer;
          transition: transform .15s;
        }
        .calc-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .calc-range::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--c-ink);
          cursor: pointer;
        }

        /* ─── Tenure switch ─── */
        .tenure-switch {
          display: flex;
          background: var(--c-surface);
          border: 1.5px solid var(--c-rule);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .tenure-btn {
          border: none;
          background: transparent;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          color: var(--c-ink-3);
          cursor: pointer;
          transition: background .2s, color .2s;
        }
        .tenure-btn.active {
          background: var(--c-ink);
          color: #fff;
          border-radius: calc(var(--radius-md) - 2px);
        }

        /* ─── Metric chips ─── */
        .metric-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 1.5rem;
        }
        @media (max-width: 480px) {
          .metric-row { grid-template-columns: 1fr 1fr; }
        }
        .metric-chip {
          background: var(--c-surface);
          border: 1px solid var(--c-rule);
          border-radius: var(--radius-md);
          padding: 12px 14px;
        }
        .metric-chip__label {
          display: block;
          font-size: 11px;
          color: var(--c-ink-3);
          margin-bottom: 4px;
        }
        .metric-chip__value {
          font-size: 18px;
          font-weight: 700;
          color: var(--c-ink);
        }
        .metric-chip__value.interest { color: var(--c-interest); }

        /* ─── Results card ─── */
        .emi-results {
          background: var(--c-surface);
          border: 1px solid var(--c-rule);
          border-top: 3px solid var(--c-ink);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .donut-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .donut-svg { width: 150px; height: 150px; }
        .donut-legend {
          display: flex;
          gap: 14px;
          font-size: 12px;
          color: var(--c-ink-3);
          align-items: center;
        }
        .leg-dot {
          display: inline-block;
          width: 10px; height: 10px;
          border-radius: 2px;
          margin-right: 5px;
          vertical-align: middle;
        }
        .leg-dot--primary  { background: var(--c-ink); }
        .leg-dot--interest { background: var(--c-interest); }

        .result-list { display: flex; flex-direction: column; }
        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 11px 0;
          border-bottom: 1px solid var(--c-rule);
          gap: 12px;
        }
        .result-row:last-child { border-bottom: none; }
        .result-row__label { font-size: 13px; color: var(--c-ink-3); flex: 1; }
        .result-row__value { font-size: 15px; font-weight: 700; color: var(--c-ink); white-space: nowrap; }
        .result-row__value--emi { font-size: 18px; color: var(--c-ink); }
        .result-row__value--int { color: var(--c-interest); }

        .amort-toggle-btn {
          width: 100%;
          padding: 10px;
          border: 1.5px solid var(--c-rule);
          border-radius: var(--radius-md);
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--c-ink-2);
          cursor: pointer;
          transition: background .2s, border-color .2s, color .2s;
        }
        .amort-toggle-btn:hover {
          background: var(--c-ink);
          border-color: var(--c-ink);
          color: #fff;
        }

        /* ─── Amortization table ─── */
        .amort-section { margin-top: 2rem; }
        .amort-scroll {
          max-height: 280px;
          overflow-y: auto;
          overflow-x: auto;
          border: 1px solid var(--c-rule);
          border-radius: var(--radius-md);
          -webkit-overflow-scrolling: touch;
        }
        .amort-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 480px; }
        .amort-table th {
          position: sticky;
          top: 0;
          background: var(--c-ink);
          color: rgba(255,255,255,0.85);
          font-size: 11px;
          font-weight: 600;
          text-align: left;
          padding: 8px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          z-index: 1;
        }
        .amort-table td {
          padding: 8px 14px;
          border-bottom: 1px solid var(--c-rule);
          color: var(--c-ink-2);
        }
        .amort-table tr:last-child td { border-bottom: none; }
        .amort-table tbody tr:hover td { background: var(--c-surface); }

        /* ─── Unit converter ─── */
        .unit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 575px) {
          .unit-grid { grid-template-columns: 1fr; }
        }
        .unit-card {
          background: #fff;
          border: 1px solid var(--c-rule);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .unit-card__head {
          background: var(--c-ink);
          color: #fff;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .unit-card__head i { font-size: 16px; opacity: .7; }
        .unit-card__title { font-size: 14px; font-weight: 600; }
        .unit-card__sub { font-size: 11px; opacity: .65; margin-top: 2px; }
        .unit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 18px;
          border-bottom: 1px solid var(--c-rule);
        }
        .unit-row:last-child { border-bottom: none; }
        .unit-row label { font-size: 13px; font-weight: 500; color: var(--c-ink-2); }
        .unit-row input {
          width: 130px;
          border: 1.5px solid var(--c-rule);
          border-radius: var(--radius-md);
          padding: 7px 11px;
          font-size: 13px;
          font-weight: 700;
          color: var(--c-ink);
          text-align: right;
          outline: none;
          background: var(--c-surface);
          transition: border-color .2s, box-shadow .2s;
          -moz-appearance: textfield;
        }
        .unit-row input::-webkit-outer-spin-button,
        .unit-row input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .unit-row input:focus {
          border-color: var(--c-teal);
          box-shadow: 0 0 0 3px rgba(28,148,164,.12);
          background: #fff;
        }
        @media (max-width: 400px) {
          .unit-row input { width: 100px; }
        }

        .unit-ref {
          background: var(--c-surface);
          border: 1px solid var(--c-rule);
          border-left: 3px solid var(--c-teal);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
        }
        .unit-ref__title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .8px;
          color: var(--c-ink-3);
          margin-bottom: 12px;
        }
        .unit-ref__list {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 6px;
          padding: 0;
          margin: 0;
        }
        .unit-ref__list li {
          font-size: 13px;
          color: var(--c-ink-3);
          padding: 5px 0;
          border-bottom: 1px solid var(--c-rule);
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .unit-ref__list li::before {
          content: "→";
          color: var(--c-teal);
          font-size: 11px;
          flex-shrink: 0;
          margin-top: 1px;
        }
      `}</style>
    </Wrapper>
  );
};

export default Calculator;

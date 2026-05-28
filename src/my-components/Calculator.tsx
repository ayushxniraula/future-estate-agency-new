import { useState, useCallback } from "react";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
import Brand from "../components/homes/home-four/Brand";
import FancyBanner from "../components/common/FancyBanner";
import FutureFooter from "../layouts/footers/FutureFooter";
import FutureHeader from "../layouts/headers/FutureHeader";
import { Link } from "react-router-dom";

// ─── EMI Calculator ──────────────────────────────────────────────────────────

const EMI_MIN = { amount: 100000, rate: 1, tenure: 1 };
const EMI_MAX = { amount: 100000000, rate: 30, tenure: 30 };

function formatNPR(value: number) {
  return "रु " + Math.round(value).toLocaleString("en-IN");
}

function calcEMI(principal: number, annualRate: number, tenureYears: number) {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0)
    return { emi: principal / n, totalInterest: 0, totalPayment: principal };
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  return { emi, totalInterest, totalPayment };
}

function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  prefix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="calc-field mb-30">
      <div className="d-flex justify-content-between align-items-center mb-10">
        <label className="calc-label">{label}</label>
        <div className="calc-value-box">
          {prefix && <span className="calc-prefix">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => {
              const v = Math.min(max, Math.max(min, Number(e.target.value)));
              onChange(v);
            }}
            className="calc-input"
          />
          {unit && <span className="calc-unit">{unit}</span>}
        </div>
      </div>
      <div className="slider-track-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="calc-slider"
          style={{ "--pct": `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

function EMICalculator() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(20);
  const [tenureType, setTenureType] = useState<"yearly" | "monthly">("yearly");

  const tenureYears = tenureType === "yearly" ? tenure : tenure / 12;
  const { emi, totalInterest, totalPayment } = calcEMI(
    amount,
    rate,
    tenureYears,
  );

  // Pie chart data
  const principalPct = totalPayment > 0 ? (amount / totalPayment) * 100 : 50;
  const interestPct = 100 - principalPct;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * r;
  const dashP = (principalPct / 100) * circumference;
  const dashI = (interestPct / 100) * circumference;

  return (
    <div className="emi-calc-wrap">
      <div className="row gx-xl-5">
        {/* Left – inputs */}
        <div className="col-lg-6">
          <RangeSlider
            label="Loan Amount"
            value={amount}
            min={EMI_MIN.amount}
            max={EMI_MAX.amount}
            step={50000}
            prefix="रु"
            onChange={setAmount}
          />
          <RangeSlider
            label="Interest Rate"
            value={rate}
            min={EMI_MIN.rate}
            max={EMI_MAX.rate}
            step={0.1}
            unit="%"
            onChange={setRate}
          />
          <div className="calc-field mb-30">
            <div className="d-flex justify-content-between align-items-center mb-10">
              <label className="calc-label">Loan Tenure</label>
              <div className="tenure-tabs">
                <button
                  className={`tenure-tab ${tenureType === "yearly" ? "active" : ""}`}
                  onClick={() => {
                    if (tenureType === "monthly") {
                      setTenure(Math.max(1, Math.round(tenure / 12)));
                      setTenureType("yearly");
                    }
                  }}
                >
                  Yr
                </button>
                <button
                  className={`tenure-tab ${tenureType === "monthly" ? "active" : ""}`}
                  onClick={() => {
                    if (tenureType === "yearly") {
                      setTenure(tenure * 12);
                      setTenureType("monthly");
                    }
                  }}
                >
                  Mo
                </button>
              </div>
            </div>
            <div className="slider-track-wrap">
              <div className="d-flex justify-content-between align-items-center mb-8">
                <div className="calc-value-box">
                  <input
                    type="number"
                    value={tenure}
                    min={tenureType === "yearly" ? 1 : 1}
                    max={tenureType === "yearly" ? 30 : 360}
                    onChange={(e) => {
                      const v = Math.min(
                        tenureType === "yearly" ? 30 : 360,
                        Math.max(1, Number(e.target.value)),
                      );
                      setTenure(v);
                    }}
                    className="calc-input"
                  />
                  <span className="calc-unit">
                    {tenureType === "yearly" ? "Yr" : "Mo"}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={tenureType === "yearly" ? 30 : 360}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="calc-slider"
                style={
                  {
                    "--pct": `${((tenure - 1) / ((tenureType === "yearly" ? 30 : 360) - 1)) * 100}%`,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>

        {/* Right – results */}
        <div className="col-lg-6">
          <div className="emi-results-card">
            {/* Donut chart */}
            <div className="donut-wrap">
              <svg viewBox="0 0 180 180" className="donut-svg">
                {/* background ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="#e8edf2"
                  strokeWidth="22"
                />
                {/* interest arc */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="#f4a261"
                  strokeWidth="22"
                  strokeDasharray={`${dashI} ${circumference}`}
                  strokeDashoffset={0}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
                {/* principal arc */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="var(--prime-three, #1b6ca8)"
                  strokeWidth="22"
                  strokeDasharray={`${dashP} ${circumference}`}
                  strokeDashoffset={-dashI}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
                <text
                  x={cx}
                  y={cy - 8}
                  textAnchor="middle"
                  className="donut-label-sm"
                >
                  Loan EMI
                </text>
                <text
                  x={cx}
                  y={cy + 14}
                  textAnchor="middle"
                  className="donut-label-lg"
                >
                  {Math.round(emi).toLocaleString("en-IN")}
                </text>
              </svg>
              <div className="donut-legend">
                <span
                  className="legend-dot"
                  style={{ background: "var(--prime-three, #1b6ca8)" }}
                />
                <span>Principal</span>
                <span
                  className="legend-dot ms-3"
                  style={{ background: "#f4a261" }}
                />
                <span>Interest</span>
              </div>
            </div>

            {/* Result rows */}
            <div className="result-rows">
              <div className="result-row">
                <span className="result-row__label">Loan EMI</span>
                <span className="result-row__value highlight">
                  {formatNPR(emi)}
                </span>
              </div>
              <div className="result-row">
                <span className="result-row__label">
                  Total Interest Payable
                </span>
                <span className="result-row__value interest">
                  {formatNPR(totalInterest)}
                </span>
              </div>
              <div className="result-row">
                <span className="result-row__label">
                  Total Payment (Principal + Interest)
                </span>
                <span className="result-row__value">
                  {formatNPR(totalPayment)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Unit / Land Calculator ───────────────────────────────────────────────────

// Conversion base: everything in sq. ft.
const UNITS = {
  // Ropani system
  ropani: 5476,
  aana: 342.25,
  paisa: 85.5625,
  daam: 21.390625,
  // Bigha system
  bigha: 72900,
  kattha: 3645,
  dhur: 182.25,
  // Metric/Imperial
  sqft: 1,
  sqm: 10.7639,
};

type UnitKey = keyof typeof UNITS;

function toSqFt(value: number, unit: UnitKey): number {
  return value * UNITS[unit];
}

function fromSqFt(sqft: number, unit: UnitKey): number {
  return sqft / UNITS[unit];
}

function fmt(v: number, decimals = 4): string {
  if (isNaN(v) || !isFinite(v)) return "";
  // trim trailing zeros
  return parseFloat(v.toFixed(decimals)).toString();
}

interface LandState {
  ropani: string;
  aana: string;
  paisa: string;
  daam: string;
  bigha: string;
  kattha: string;
  dhur: string;
  sqft: string;
  sqm: string;
}

const empty: LandState = {
  ropani: "",
  aana: "",
  paisa: "",
  daam: "",
  bigha: "",
  kattha: "",
  dhur: "",
  sqft: "",
  sqm: "",
};

function UnitCalculator() {
  const [vals, setVals] = useState<LandState>(empty);

  const handleChange = useCallback((unit: UnitKey, raw: string) => {
    if (raw === "" || raw === "-") {
      setVals(empty);
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num) || num < 0) {
      setVals(empty);
      return;
    }
    const base = toSqFt(num, unit);
    setVals({
      ropani: fmt(fromSqFt(base, "ropani")),
      aana: fmt(fromSqFt(base, "aana")),
      paisa: fmt(fromSqFt(base, "paisa")),
      daam: fmt(fromSqFt(base, "daam")),
      bigha: fmt(fromSqFt(base, "bigha")),
      kattha: fmt(fromSqFt(base, "kattha")),
      dhur: fmt(fromSqFt(base, "dhur")),
      sqft: fmt(base, 2),
      sqm: fmt(fromSqFt(base, "sqm"), 4),
    });
  }, []);

  function field(label: string, unit: UnitKey) {
    return (
      <div className="unit-field">
        <label className="unit-label">{label}</label>
        <input
          type="number"
          min={0}
          value={vals[unit]}
          placeholder="0"
          onChange={(e) => handleChange(unit, e.target.value)}
          className="unit-input"
        />
      </div>
    );
  }

  return (
    <div className="unit-calc-wrap">
      <div className="row gx-xl-5">
        {/* Ropani system */}
        <div className="col-lg-4 col-md-6 mb-40">
          <div className="unit-group-card">
            <div className="unit-group-header">
              <i className="fa-solid fa-mountain-sun me-2"></i>
              Ropani System
              <span className="unit-group-sub">Hilly & Mountain Region</span>
            </div>
            {field("Ropani", "ropani")}
            {field("Aana", "aana")}
            {field("Paisa", "paisa")}
            {field("Daam", "daam")}
          </div>
        </div>

        {/* Bigha system */}
        <div className="col-lg-4 col-md-6 mb-40">
          <div className="unit-group-card">
            <div className="unit-group-header">
              <i className="fa-solid fa-seedling me-2"></i>
              Bigha System
              <span className="unit-group-sub">Terai Region</span>
            </div>
            {field("Bigha", "bigha")}
            {field("Kattha", "kattha")}
            {field("Dhur", "dhur")}
          </div>
        </div>

        {/* Metric / Imperial */}
        <div className="col-lg-4 col-md-12 mb-40">
          <div className="unit-group-card">
            <div className="unit-group-header">
              <i className="fa-solid fa-ruler-combined me-2"></i>
              Feet / Meter
              <span className="unit-group-sub">International Standard</span>
            </div>
            {field("Sq. Feet", "sqft")}
            {field("Sq. Meter", "sqm")}
          </div>

          {/* Quick reference */}
          <div className="unit-reference mt-20">
            <p className="unit-ref-title">Quick Reference</p>
            <ul className="unit-ref-list">
              <li>1 Ropani = 16 Aana = 5,476 sq.ft</li>
              <li>1 Bigha = 20 Kattha = 72,900 sq.ft</li>
              <li>1 Kattha = 20 Dhur = 3,645 sq.ft</li>
              <li>1 Aana = 4 Paisa = 342.25 sq.ft</li>
              <li>1 Bigha ≈ 13.31 Ropani</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const Calculator = () => {
  const [tab, setTab] = useState<"emi" | "unit">("emi");

  return (
    <Wrapper>
      <SEO pageTitle={"Calculator – EMI & Land Unit"} />
      <FutureHeader style_1={true} style_2={false} />

      {/* Banner */}
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

      {/* Calculator Section */}
      <div className="calculator-section mt-150 xl-mt-110 mb-150 xl-mb-110">
        <div className="container">
          {/* Tab switcher */}
          <div className="calc-tab-bar mb-60">
            <button
              className={`calc-tab-btn ${tab === "emi" ? "active" : ""}`}
              onClick={() => setTab("emi")}
            >
              <i className="fa-solid fa-percent me-2"></i>
              EMI Calculator
            </button>
            <button
              className={`calc-tab-btn ${tab === "unit" ? "active" : ""}`}
              onClick={() => setTab("unit")}
            >
              <i className="fa-solid fa-ruler-combined me-2"></i>
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
                    Calculate your monthly loan installment instantly. Enter the
                    loan amount, interest rate, and tenure to get started.
                  </p>
                </div>
                <EMICalculator />
              </>
            ) : (
              <>
                <div className="calc-panel-header mb-50">
                  <h3 className="calc-panel-title">Land Unit Converter</h3>
                  <p className="calc-panel-desc">
                    Convert between Nepal's land measurement units — Ropani,
                    Aana, Bigha, Kattha, and international sq. feet / meters.
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

      {/* Scoped styles */}
      <style>{`
        /* ── Tab Bar ── */
        .calc-tab-bar {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid #e8edf2;
          padding-bottom: 0;
        }
        .calc-tab-btn {
          background: none;
          border: none;
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 600;
          color: #6c757d;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          transition: color 0.25s, border-color 0.25s;
          border-radius: 0;
          letter-spacing: 0.3px;
        }
        .calc-tab-btn.active {
          color: var(--prime-three, #1b6ca8);
          border-bottom-color: var(--prime-three, #1b6ca8);
        }
        .calc-tab-btn:hover:not(.active) {
          color: #343a40;
        }

        /* ── Panel header ── */
        .calc-panel-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 10px;
        }
        .calc-panel-desc {
          color: #6c757d;
          font-size: 16px;
        }

        /* ── EMI Slider ── */
        .calc-label {
          font-size: 15px;
          font-weight: 600;
          color: #343a40;
        }
        .calc-value-box {
          display: flex;
          align-items: center;
          background: #f0f4f8;
          border-radius: 8px;
          padding: 4px 12px;
          gap: 4px;
        }
        .calc-prefix, .calc-unit {
          font-size: 13px;
          font-weight: 600;
          color: var(--prime-three, #1b6ca8);
        }
        .calc-input {
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a2e;
          width: 80px;
          text-align: right;
          outline: none;
          -moz-appearance: textfield;
        }
        .calc-input::-webkit-outer-spin-button,
        .calc-input::-webkit-inner-spin-button { -webkit-appearance: none; }

        .slider-track-wrap { padding: 4px 0; }

        .calc-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 3px;
          background: linear-gradient(
            to right,
            var(--prime-three, #1b6ca8) 0%,
            var(--prime-three, #1b6ca8) var(--pct, 50%),
            #dde3eb var(--pct, 50%),
            #dde3eb 100%
          );
          outline: none;
          cursor: pointer;
        }
        .calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--prime-three, #1b6ca8);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .calc-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .calc-slider::-moz-range-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--prime-three, #1b6ca8);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        }

        /* ── Tenure Tabs ── */
        .tenure-tabs {
          display: flex;
          background: #f0f4f8;
          border-radius: 8px;
          overflow: hidden;
        }
        .tenure-tab {
          border: none;
          background: transparent;
          padding: 5px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          color: #6c757d;
          transition: background 0.2s, color 0.2s;
        }
        .tenure-tab.active {
          background: var(--prime-three, #1b6ca8);
          color: #fff;
          border-radius: 6px;
        }

        /* ── EMI Results Card ── */
        .emi-results-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 30px;
          border: 1px solid #e2e8f0;
          height: 100%;
        }

        /* ── Donut Chart ── */
        .donut-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }
        .donut-svg {
          width: 160px;
          height: 160px;
        }
        .donut-label-sm {
          font-size: 10px;
          fill: #6c757d;
          font-weight: 500;
        }
        .donut-label-lg {
          font-size: 14px;
          fill: #1a1a2e;
          font-weight: 700;
        }
        .donut-legend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6c757d;
          margin-top: 10px;
        }
        .legend-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        /* ── Result Rows ── */
        .result-rows { display: flex; flex-direction: column; gap: 0; }
        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 14px 0;
          border-bottom: 1px solid #e8edf2;
          gap: 12px;
        }
        .result-row:last-child { border-bottom: none; }
        .result-row__label { font-size: 14px; color: #6c757d; flex: 1; }
        .result-row__value {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          white-space: nowrap;
        }
        .result-row__value.highlight { color: var(--prime-three, #1b6ca8); font-size: 18px; }
        .result-row__value.interest { color: #f4a261; }

        /* ── Unit Calculator ── */
        .unit-group-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }
        .unit-group-header {
          background: var(--prime-three, #1b6ca8);
          color: #fff;
          padding: 16px 20px;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
        }
        .unit-group-sub {
          font-size: 11px;
          font-weight: 400;
          opacity: 0.75;
          width: 100%;
          margin-top: 2px;
          display: block;
        }
        .unit-field {
          display: flex;
          align-items: center;
          padding: 0 20px;
          border-bottom: 1px solid #f0f4f8;
        }
        .unit-field:last-child { border-bottom: none; }
        .unit-label {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          padding: 14px 0;
        }
        .unit-input {
          width: 130px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
          text-align: right;
          outline: none;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s;
          -moz-appearance: textfield;
        }
        .unit-input::-webkit-outer-spin-button,
        .unit-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .unit-input:focus {
          border-color: var(--prime-three, #1b6ca8);
          box-shadow: 0 0 0 3px rgba(27,108,168,0.12);
          background: #fff;
        }

        /* ── Reference Box ── */
        .unit-reference {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
        }
        .unit-ref-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--prime-three, #1b6ca8);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .unit-ref-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .unit-ref-list li {
          font-size: 12px;
          color: #6c757d;
          padding: 4px 0;
          border-bottom: 1px solid #eef1f5;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .unit-ref-list li:last-child { border-bottom: none; }
        .unit-ref-list li::before {
          content: "→";
          color: var(--prime-three, #1b6ca8);
          font-weight: 700;
          font-size: 11px;
        }
      `}</style>
    </Wrapper>
  );
};

export default Calculator;

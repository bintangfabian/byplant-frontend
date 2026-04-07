/*
  byplant — App.jsx
  Neumorphic dashboard
*/

import { useSensor } from "./hooks/useSensor";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ============================================================
// THEME
// ============================================================
const BG = "#E8E6F2";
const BG_LIGHT = "#F1EFFA";
const TEXT = "#2A2A3D";
const TEXT_DIM = "#8A8AA3";
const ACCENT = "#4ADE80";
const ACCENT_DARK = "#16A34A";

// Neumorphic shadow presets
const RAISED = `8px 8px 18px rgba(163, 161, 197, 0.45), -8px -8px 18px rgba(255, 255, 255, 0.95)`;
const RAISED_SM = `5px 5px 12px rgba(163, 161, 197, 0.4), -5px -5px 12px rgba(255, 255, 255, 0.9)`;
const INSET = `inset 5px 5px 10px rgba(163, 161, 197, 0.45), inset -5px -5px 10px rgba(255, 255, 255, 0.9)`;
const INSET_SM = `inset 3px 3px 6px rgba(163, 161, 197, 0.45), inset -3px -3px 6px rgba(255, 255, 255, 0.9)`;

// ============================================================
// HELPERS
// ============================================================
function getSoilStatus(percent) {
  if (percent === null || percent === undefined) return { label: "NO DATA", color: TEXT_DIM };
  if (percent < 20) return { label: "DRY", color: "#D97706" };
  if (percent < 40) return { label: "LOW", color: "#CA8A04" };
  if (percent < 70) return { label: "IDEAL", color: ACCENT_DARK };
  return { label: "WET", color: "#2563EB" };
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning!";
  if (h < 18) return "Good Afternoon!";
  return "Good Evening!";
}

function formatNow() {
  const d = new Date();
  const date = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return `${date} - ${time} WIB`;
}

// ============================================================
// SPROUT LOGO
// ============================================================
function SproutLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 90 L50 55"
        stroke={ACCENT_DARK}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M50 60 C50 40, 30 30, 15 35 C20 55, 35 65, 50 60 Z"
        stroke={ACCENT_DARK}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 60 C50 40, 70 30, 85 35 C80 55, 65 65, 50 60 Z"
        stroke={ACCENT_DARK}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ============================================================
// LCD READOUT (digital-style)
// ============================================================
function LcdReadout({ icon, value, unit, big = false }) {
  return (
    <div style={{
      background: BG,
      borderRadius: 18,
      padding: big ? "18px 22px" : "14px 18px",
      boxShadow: INSET,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      minHeight: big ? 70 : 56,
    }}>
      <div style={{ color: TEXT_DIM, fontSize: big ? 18 : 15, opacity: 0.6 }}>{icon}</div>
      <div style={{
        fontFamily: "'Courier New', ui-monospace, monospace",
        fontWeight: 700,
        fontSize: big ? 36 : 28,
        color: TEXT,
        letterSpacing: 1,
        fontVariantNumeric: "tabular-nums",
        textShadow: "1px 1px 0 rgba(255,255,255,0.5)",
      }}>
        {value}
        <span style={{ fontSize: big ? 13 : 11, marginLeft: 4, opacity: 0.7 }}>{unit}</span>
      </div>
    </div>
  );
}

// ============================================================
// NEUMORPHIC CARD
// ============================================================
function Card({ children, style }) {
  return (
    <div style={{
      background: BG,
      borderRadius: 28,
      padding: 22,
      boxShadow: RAISED,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ============================================================
// SECTION LABEL
// ============================================================
function SectionLabel({ icon, children }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: ACCENT_DARK,
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 14,
    }}>
      <span style={{ opacity: 0.8 }}>{icon}</span>
      {children}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const { latest, chartData, connected, lastUpdate, refresh } = useSensor();

  const soilPct = latest?.soil_pct ?? null;
  const status = getSoilStatus(soilPct);

  const soilDisplay = soilPct !== null ? String(soilPct).padStart(3, "0") : "---";

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
      maxWidth: 430,
      margin: "0 auto",
      color: TEXT,
      padding: "20px 18px 100px",
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        button:active { box-shadow: ${INSET_SM} !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: -0.5,
        }}>
          byplant <span style={{ fontSize: 10, color: TEXT_DIM, fontWeight: 500, verticalAlign: "middle" }}>v1.0</span>
        </div>
        <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 2 }}>
          By bintang
        </div>
      </div>

      {/* HERO */}
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <SproutLogo size={88} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
          {greeting()}
        </div>
        <div style={{
          marginTop: 6,
          fontSize: 12,
          color: connected ? ACCENT_DARK : TEXT_DIM,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: connected ? ACCENT : "#C4C4D4",
            boxShadow: connected ? `0 0 8px ${ACCENT}` : "none",
            animation: connected ? "pulse 2s infinite" : "none",
          }} />
          {connected ? "Connected" : "Offline"}
        </div>
        <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 4, fontFamily: "monospace" }}>
          {formatNow()}
        </div>
      </div>

      {/* REALTIME SENSORS CARD */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <LcdReadout icon="◐" value={soilDisplay} unit="%" big />
          <LcdReadout icon="◉" value={status.label.padStart(5, " ")} unit="" big />
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          color: ACCENT_DARK,
          fontSize: 12,
          fontWeight: 600,
        }}>
          <span>⚡</span> Realtime Sensors
        </div>
      </Card>

      {/* PUMP / DEVICE BUTTONS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        {[
          { label: "Arduino", letter: "A", ok: !!latest },
          { label: "Realtime", letter: "B", ok: connected },
        ].map((item) => (
          <div key={item.label} style={{
            background: BG,
            borderRadius: 24,
            padding: "20px 14px 14px",
            boxShadow: RAISED,
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 42,
              fontWeight: 700,
              color: item.ok ? ACCENT_DARK : TEXT_DIM,
              letterSpacing: -1,
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {item.letter}
            </div>
            <div style={{ fontSize: 12, color: TEXT_DIM, fontWeight: 500 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* PRESETS */}
      <SectionLabel icon="≡">Presets</SectionLabel>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <div style={{
          flex: 1,
          background: BG,
          borderRadius: 18,
          padding: "14px 18px",
          boxShadow: INSET,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ color: TEXT_DIM, fontSize: 16 }}>‹</div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              fontSize: 14,
              color: TEXT,
              letterSpacing: 1.5,
            }}>
              MONSTERA
            </div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              fontSize: 13,
              color: TEXT_DIM,
              letterSpacing: 1,
              marginTop: 2,
            }}>
              40 - 70 %
            </div>
          </div>
          <div style={{ color: TEXT_DIM, fontSize: 16 }}>›</div>
        </div>
        <button style={{
          background: BG,
          border: "none",
          borderRadius: 16,
          padding: "14px 18px",
          boxShadow: RAISED_SM,
          color: ACCENT_DARK,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
        }}>
          Set !
        </button>
      </div>

      {/* RANGE & STATUS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
        <div>
          <SectionLabel icon="✿">Soil Range</SectionLabel>
          <div style={{
            background: BG,
            borderRadius: 18,
            padding: "16px 18px",
            boxShadow: INSET,
            textAlign: "center",
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            fontSize: 18,
            color: TEXT,
            letterSpacing: 1.5,
          }}>
            0 - 100
          </div>
        </div>
        <div>
          <SectionLabel icon="△">Status</SectionLabel>
          <div style={{
            background: BG,
            borderRadius: 18,
            padding: "16px 18px",
            boxShadow: INSET,
            textAlign: "center",
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            fontSize: 18,
            color: status.color,
            letterSpacing: 1.5,
          }}>
            {status.label}
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <SectionLabel icon="↻">History · 24H</SectionLabel>
      <Card style={{ marginBottom: 22, padding: "18px 16px 12px" }}>
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT_DARK} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={ACCENT_DARK} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: TEXT_DIM }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: TEXT_DIM }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: BG_LIGHT,
                  border: "none",
                  borderRadius: 10,
                  boxShadow: RAISED_SM,
                  fontSize: 11,
                }}
                labelStyle={{ color: TEXT_DIM }}
              />
              <Area
                type="monotone"
                dataKey="soil"
                stroke={ACCENT_DARK}
                strokeWidth={2.5}
                fill="url(#soilGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{
            height: 150, display: "flex",
            alignItems: "center", justifyContent: "center",
            color: TEXT_DIM, fontSize: 12,
          }}>
            Belum cukup data
          </div>
        )}
      </Card>

      {/* REFRESH */}
      <button
        onClick={refresh}
        style={{
          width: "100%",
          padding: "16px",
          background: BG,
          color: ACCENT_DARK,
          border: "none",
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.5,
          cursor: "pointer",
          boxShadow: RAISED,
          textTransform: "uppercase",
        }}
      >
        ↻ Refresh History
      </button>

      <div style={{
        textAlign: "center",
        fontSize: 10,
        color: TEXT_DIM,
        marginTop: 18,
      }}>
        Wait for stable 10–15 sec
      </div>
    </div>
  );
}

/*
  PlantWatch PWA — App.jsx
  Dashboard utama monitoring tanaman
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
// STATUS HELPERS
// ============================================================
function getSoilInfo(percent) {
  if (percent === null || percent === undefined)
    return { label: "—", color: "#888", bg: "#f0f0f0", emoji: "❓" };
  if (percent < 20)
    return { label: "Sangat kering", color: "#854F0B", bg: "#FAEEDA", emoji: "🏜️" };
  if (percent < 40)
    return { label: "Agak kering", color: "#BA7517", bg: "#FFF3DC", emoji: "😐" };
  if (percent < 70)
    return { label: "Optimal", color: "#0F6E56", bg: "#E1F5EE", emoji: "✅" };
  return { label: "Terlalu basah", color: "#185FA5", bg: "#E6F1FB", emoji: "💧" };
}

function timeAgo(date) {
  if (!date) return "Belum ada data";
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 10) return "Baru saja";
  if (sec < 60) return `${sec} detik lalu`;
  return `${Math.floor(sec / 60)} menit lalu`;
}

// ============================================================
// KOMPONEN KARTU SENSOR
// ============================================================
function SensorCard({ label, value, unit, percent, barColor, icon }) {
  return (
    <div style={{
      background: "var(--card-bg, #f8f8f6)",
      borderRadius: 14,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      <div style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: "#1a1a1a", fontVariantNumeric: "tabular-nums" }}>
        {value ?? "—"}
        <span style={{ fontSize: 13, fontWeight: 400, color: "#888", marginLeft: 3 }}>{unit}</span>
      </div>
      {percent !== undefined && (
        <div style={{ height: 4, background: "#e0e0e0", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, percent))}%`,
            background: barColor,
            borderRadius: 2,
            transition: "width 0.8s ease",
          }} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOMPONEN STATUS BADGE
// ============================================================
function StatusBadge({ connected }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      fontSize: 11, fontFamily: "monospace",
      color: connected ? "#0F6E56" : "#854F0B",
      background: connected ? "#E1F5EE" : "#FAEEDA",
      borderRadius: 20, padding: "4px 10px",
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: connected ? "#1D9E75" : "#EF9F27",
        animation: connected ? "pulse 1.5s infinite" : "none",
      }} />
      {connected ? "LIVE" : "OFFLINE"}
    </div>
  );
}

// ============================================================
// TOOLTIP CUSTOM UNTUK GRAFIK
// ============================================================
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff", border: "0.5px solid #e0e0e0",
        borderRadius: 8, padding: "8px 12px", fontSize: 12,
      }}>
        <div style={{ color: "#888", marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 600, color: "#1D9E75" }}>
          Tanah: {payload[0].value}%
        </div>
      </div>
    );
  }
  return null;
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const { latest, chartData, connected, lastUpdate, refresh } = useSensor();

  const soilPct = latest?.soil_pct ?? null;
  const soilInfo = getSoilInfo(soilPct);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f2",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: 430,
      margin: "0 auto",
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: "#fff",
        padding: "16px 20px",
        borderBottom: "0.5px solid #ebebeb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>
            🌿 PlantWatch
          </div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>
            Update: {timeAgo(lastUpdate)}
          </div>
        </div>
        <StatusBadge connected={connected} />
      </div>

      <div style={{ padding: "16px 16px 80px" }}>

        {/* KARTU TANAMAN */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "16px",
          marginBottom: 12,
          border: "0.5px solid #ebebeb",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "#E1F5EE", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>🌿</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>Monstera Deliciosa</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Arduino Nano — Meja kerja</div>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 500,
              padding: "4px 10px", borderRadius: 20,
              background: soilInfo.bg, color: soilInfo.color,
            }}>
              {soilInfo.emoji} {soilInfo.label}
            </div>
          </div>
        </div>

        {/* SENSOR GRID */}
        <div style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          Data Sensor Realtime
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <SensorCard
            label="Kelembapan Tanah"
            value={soilPct}
            unit="%"
            percent={soilPct}
            barColor="#7F77DD"
            icon="🌱"
          />
          <SensorCard
            label="Status Tanah"
            value={soilInfo.emoji}
            unit={soilInfo.label}
            icon="📊"
          />
        </div>

        {/* STATUS KONEKSI */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 16,
        }}>
          {[
            { label: "Arduino", ok: !!latest, desc: latest ? "Aktif" : "Belum ada data" },
            { label: "MQTT", ok: connected, desc: connected ? "Terhubung" : "Terputus" },
            { label: "WebSocket", ok: connected, desc: connected ? "Sinkron" : "Offline" },
          ].map((item) => (
            <div key={item.label} style={{
              background: "#fff", border: "0.5px solid #ebebeb",
              borderRadius: 12, padding: "10px 10px",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: item.ok ? "#1D9E75" : "#EF9F27",
                }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{item.label}</div>
              </div>
              <div style={{ fontSize: 11, color: "#999" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* GRAFIK HISTORIS */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "14px 16px",
          border: "0.5px solid #ebebeb",
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>
              Historis Kelembapan Tanah
            </div>
            <div style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>24 JAM</div>
          </div>

          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7F77DD" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7F77DD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "#aaa" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: "#aaa" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="soil"
                  stroke="#7F77DD"
                  strokeWidth={2}
                  fill="url(#soilGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: 140, display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#bbb", fontSize: 13,
            }}>
              Belum cukup data untuk grafik
            </div>
          )}
        </div>

        {/* TOMBOL REFRESH */}
        <button
          onClick={refresh}
          style={{
            width: "100%", padding: "12px",
            background: "#1D9E75", color: "#fff",
            border: "none", borderRadius: 12,
            fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}
        >
          🔄 Refresh Data Historis
        </button>
      </div>

      {/* BOTTOM NAV */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#fff", borderTop: "0.5px solid #ebebeb",
        display: "flex", justifyContent: "space-around",
        padding: "10px 0 16px",
      }}>
        {[
          { icon: "📊", label: "Dashboard", active: true },
          { icon: "🌿", label: "Tanaman", active: false },
          { icon: "🔔", label: "Notifikasi", active: false },
          { icon: "⚙️", label: "Pengaturan", active: false },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2,
            fontSize: 10,
            color: item.active ? "#1D9E75" : "#aaa",
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

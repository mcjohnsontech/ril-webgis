import type { ConnectionStatus, Pothole } from "../types/pothole";
import { ThemeToggle } from "./ThemeToggle";

interface StatsBarProps {
  potholes: Pothole[];
  status: ConnectionStatus;
  isPulsing: boolean;
}

function isToday(isoTimestamp: string): boolean {
  const date = new Date(isoTimestamp);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function StatsBar({ potholes, status, isPulsing }: StatsBarProps) {
  const total = potholes.length;
  const today = potholes.filter((p) => isToday(p.timestamp)).length;
  const severe = potholes.filter((p) => p.severity === "high").length;

  const dotClass = isPulsing
    ? "live-dot is-pulsing"
    : status === "live"
    ? "live-dot is-live"
    : status === "offline"
    ? "live-dot is-offline"
    : "live-dot";

  const statusLabel =
    status === "live" ? "Live" : status === "offline" ? "Offline" : "Connecting";

  return (
    <div className="stats-bar panel">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {/* Road-with-marker glyph: a route line with a defect point */}
            <path d="M3 19c3-5 4-9 4-13M21 19c-3-5-4-9-4-13" strokeLinecap="round" />
            <circle cx="12" cy="13" r="2.4" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <div className="brand-text">
          <p className="brand-title">Road Integrity Layer</p>
          <span className="brand-subtitle">Lagos Network Monitor</span>
        </div>
      </div>

      <div className="stats-group">
        <div className="stat">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Tracked</div>
        </div>
        <div className="stat">
          <div className="stat-value">{today}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat">
          <div className="stat-value">{severe}</div>
          <div className="stat-label">Severe</div>
        </div>
      </div>

      <div className="top-right-controls">
        <div className="live-pill">
          <span className={dotClass} />
          {statusLabel}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}

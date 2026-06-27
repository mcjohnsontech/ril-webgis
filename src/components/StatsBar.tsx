import type { ConnectionStatus, Pothole } from "../types/pothole";

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
        <p className="brand-title">RIL</p>
        <span className="brand-subtitle">Road Integrity Layer · Lagos</span>
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

      <div className="live-pill">
        <span className={dotClass} />
        {statusLabel}
      </div>
    </div>
  );
}

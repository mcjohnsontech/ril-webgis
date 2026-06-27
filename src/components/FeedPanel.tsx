import type { Pothole } from "../types/pothole";
import { SEVERITY_COLOR, SEVERITY_LABEL } from "../lib/severity";

interface FeedPanelProps {
  potholes: Pothole[];
  selectedId: string | number | null;
  newestId: string | number | null;
  onSelect: (pothole: Pothole) => void;
}

function timeAgo(isoTimestamp: string): string {
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function FeedPanel({ potholes, selectedId, newestId, onSelect }: FeedPanelProps) {
  // Most recent first — this is a live feed, newest reports matter most.
  const sorted = [...potholes].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="feed-panel panel">
      <div className="feed-header">
        <h2>Live Feed</h2>
      </div>
      <div className="feed-list">
        {sorted.length === 0 ? (
          <div className="feed-empty">No road failures reported yet. Reports from the field will appear here.</div>
        ) : (
          sorted.map((pothole) => (
            <div
              key={pothole.id}
              className={`feed-item ${pothole.id === selectedId ? "is-selected" : ""} ${
                pothole.id === newestId ? "is-new" : ""
              }`}
              onClick={() => onSelect(pothole)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(pothole)}
            >
              <span
                className="severity-chip"
                style={{ background: SEVERITY_COLOR[pothole.severity ?? "low"] }}
              />
              <div className="feed-item-text">
                <div className="feed-item-title">
                  {SEVERITY_LABEL[pothole.severity ?? "low"]} pothole
                </div>
                <div className="feed-item-meta">{timeAgo(pothole.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

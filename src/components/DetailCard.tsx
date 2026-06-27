import type { Pothole } from "../types/pothole";
import { SEVERITY_COLOR, SEVERITY_LABEL } from "../lib/severity";

interface DetailCardProps {
  pothole: Pothole;
  onClose: () => void;
}

export function DetailCard({ pothole, onClose }: DetailCardProps) {
  const severity = pothole.severity ?? "low";
  const color = SEVERITY_COLOR[severity];

  return (
    <div className="detail-card panel">
      <div className="detail-image-wrap">
        {pothole.image_url ? (
          <img src={pothole.image_url} alt="Pothole snapshot from edge node" />
        ) : (
          <div className="detail-image-placeholder">No image captured</div>
        )}
      </div>
      <div className="detail-body">
        <div className="detail-header-row">
          <h3 className="detail-title">Report #{pothole.id}</h3>
          <button className="detail-close" onClick={onClose} aria-label="Close detail card">
            ×
          </button>
        </div>

        <div className="detail-row">
          <span className="detail-row-label">Severity</span>
          <span
            className="severity-badge"
            style={{ background: `${color}26`, color }}
          >
            {SEVERITY_LABEL[severity]}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Detected</span>
          <span className="detail-row-value">
            {new Date(pothole.timestamp).toLocaleString()}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Pixel area</span>
          <span className="detail-row-value">
            {pothole.pothole_pixel_area ? `${pothole.pothole_pixel_area} px²` : "—"}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Coordinates</span>
          <span className="detail-row-value">
            {pothole.latitude.toFixed(5)}, {pothole.longitude.toFixed(5)}
          </span>
        </div>
      </div>
    </div>
  );
}

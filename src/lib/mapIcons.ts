import L from "leaflet";
import type { PotholeSeverity } from "../types/pothole";
import { SEVERITY_COLOR } from "../lib/severity";

// Custom SVG pin per Henry's preference for bespoke icons over default Leaflet
// markers — a simple teardrop with a hazard-diamond cutout reads as "road defect"
// at a glance, distinct from generic location pins.
function pinSvg(color: string): string {
  return `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z"
            fill="${color}" stroke="#0B0D10" stroke-width="1.5"/>
      <rect x="11" y="10" width="8" height="8" rx="1.5"
            transform="rotate(45 15 14)" fill="#0B0D10" opacity="0.85"/>
    </svg>
  `;
}

const iconCache = new Map<PotholeSeverity, L.DivIcon>();

export function getPotholeIcon(severity: PotholeSeverity): L.DivIcon {
  const cached = iconCache.get(severity);
  if (cached) return cached;

  const icon = L.divIcon({
    className: "pothole-marker",
    html: pinSvg(SEVERITY_COLOR[severity]),
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });

  iconCache.set(severity, icon);
  return icon;
}

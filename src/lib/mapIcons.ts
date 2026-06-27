import L from "leaflet";
import type { PotholeSeverity } from "../types/pothole";
import { SEVERITY_COLOR } from "../lib/severity";

// Custom SVG pin per Henry's preference for bespoke icons over default Leaflet
// markers — a simple teardrop with a hazard-diamond cutout reads as "road defect"
// at a glance, distinct from generic location pins.
function pinSvg(color: string): string {
  // A soft white halo behind the colored teardrop keeps the marker legible
  // against both the dark and light CARTO basemaps without theme-aware re-render.
  return `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="17" cy="40" rx="6" ry="2" fill="#000000" opacity="0.18"/>
      <path d="M17 2C8.7 2 2 8.7 2 17c0 10.5 15 25 15 25s15-14.5 15-25C32 8.7 25.3 2 17 2z"
            fill="#ffffff" opacity="0.9"/>
      <path d="M17 4C9.8 4 4 9.8 4 17c0 9.5 13 23 13 23s13-13.5 13-23C30 9.8 24.2 4 17 4z"
            fill="${color}" stroke="#06120E" stroke-width="1.4"/>
      <rect x="13" y="12" width="8" height="8" rx="1.5"
            transform="rotate(45 17 16)" fill="#06120E" opacity="0.85"/>
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
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -40],
  });

  iconCache.set(severity, icon);
  return icon;
}

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import type { Pothole } from "../types/pothole";
import { getPotholeIcon } from "../lib/mapIcons";
import { useTheme } from "../lib/ThemeContext";

// Lagos centroid — matches the center used in Henry's other GIS workspace app for consistency.
const LAGOS_CENTER: [number, number] = [6.5244, 3.3792];
const DEFAULT_ZOOM = 12;

const TILE_URLS = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
};

const TILE_ATTRIBUTION =
  '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

interface PotholeMapProps {
  potholes: Pothole[];
  onMarkerClick: (pothole: Pothole) => void;
  flyToId: string | number | null;
}

function FlyToOnInsert({ potholes, flyToId }: { potholes: Pothole[]; flyToId: string | number | null }) {
  const map = useMap();

  useEffect(() => {
    if (flyToId === null) return;
    const target = potholes.find((p) => p.id === flyToId);
    if (target) {
      map.flyTo([target.latitude, target.longitude], Math.max(map.getZoom(), 14), {
        duration: 1.2,
      });
    }
  }, [flyToId, potholes, map]);

  return null;
}

export function PotholeMap({ potholes, onMarkerClick, flyToId }: PotholeMapProps) {
  const { theme } = useTheme();

  return (
    <MapContainer
      center={LAGOS_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      style={{ height: "100%", width: "100%", background: "var(--bg-void)" }}
    >
      {/* Keying on theme forces react-leaflet to swap the tile source cleanly
          rather than trying to diff URLs on an existing layer instance. */}
      <TileLayer key={theme} url={TILE_URLS[theme]} attribution={TILE_ATTRIBUTION} />
      {potholes.map((pothole) => (
        <Marker
          key={pothole.id}
          position={[pothole.latitude, pothole.longitude]}
          icon={getPotholeIcon(pothole.severity ?? "low")}
          eventHandlers={{ click: () => onMarkerClick(pothole) }}
        />
      ))}
      <FlyToOnInsert potholes={potholes} flyToId={flyToId} />
    </MapContainer>
  );
}

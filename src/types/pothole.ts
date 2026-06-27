// Shape of a row returned by `potholes_view` (lat/lng already parsed from PostGIS geometry)
export interface Pothole {
  id: string | number;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO 8601
  pothole_pixel_area: number | null;
  image_url: string | null;
  severity?: PotholeSeverity; // derived client-side from pixel area, see lib/severity.ts
}

export type PotholeSeverity = "low" | "medium" | "high";

// Shape of the raw `potholes` table row delivered over the Realtime INSERT payload.
// Note: `location` here is a raw PostGIS geometry/WKB string, NOT lat/lng floats —
// that parsing only happens in `potholes_view`. We re-fetch the view rather than
// parse WKB on the client, per the integration doc's recommended "quick fix" path.
export interface PotholeRealtimeRow {
  id: string | number;
  location: string;
  timestamp: string;
  pothole_pixel_area: number | null;
  image_url: string | null;
}

export type ConnectionStatus = "connecting" | "live" | "offline";

import type { Pothole, PotholeSeverity } from "../types/pothole";

// Pixel-area thresholds are a placeholder heuristic — swap these for whatever
// calibration the CV model on the Pi actually produces (e.g. area-to-real-world
// size via known camera height/angle). Keeping the logic isolated here means
// that calibration change is a one-file edit, not a hunt through the UI.
const MEDIUM_THRESHOLD_PX = 1500;
const HIGH_THRESHOLD_PX = 4000;

export function classifySeverity(pixelArea: number | null): PotholeSeverity {
  if (pixelArea === null) return "low";
  if (pixelArea >= HIGH_THRESHOLD_PX) return "high";
  if (pixelArea >= MEDIUM_THRESHOLD_PX) return "medium";
  return "low";
}

export function withSeverity(pothole: Omit<Pothole, "severity">): Pothole {
  return { ...pothole, severity: classifySeverity(pothole.pothole_pixel_area) };
}

export const SEVERITY_COLOR: Record<PotholeSeverity, string> = {
  low: "#5B9AD6",
  medium: "#E8A83C",
  high: "#E0543E",
};

export const SEVERITY_LABEL: Record<PotholeSeverity, string> = {
  low: "Minor",
  medium: "Moderate",
  high: "Severe",
};

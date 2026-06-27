import { useState } from "react";
import { usePotholes, useRecentlyChanged } from "./hooks/usePotholes";
import { PotholeMap } from "./components/PotholeMap";
import { StatsBar } from "./components/StatsBar";
import { FeedPanel } from "./components/FeedPanel";
import { DetailCard } from "./components/DetailCard";
import { ThemeProvider } from "./lib/ThemeContext";
import type { Pothole } from "./types/pothole";
import "./components/dashboard.css";

function Dashboard() {
  const { potholes, status, lastInsertId } = usePotholes();
  const isPulsing = useRecentlyChanged(lastInsertId);
  const [selected, setSelected] = useState<Pothole | null>(null);

  const handleSelect = (pothole: Pothole) => setSelected(pothole);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <PotholeMap potholes={potholes} onMarkerClick={handleSelect} flyToId={lastInsertId} />

      <StatsBar potholes={potholes} status={status} isPulsing={isPulsing} />

      <FeedPanel
        potholes={potholes}
        selectedId={selected?.id ?? null}
        newestId={lastInsertId}
        onSelect={handleSelect}
      />

      {selected && <DetailCard pothole={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

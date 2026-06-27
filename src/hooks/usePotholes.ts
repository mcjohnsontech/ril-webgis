import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { withSeverity } from "../lib/severity";
import type { ConnectionStatus, Pothole } from "../types/pothole";

interface UsePotholesResult {
  potholes: Pothole[];
  status: ConnectionStatus;
  lastInsertId: string | number | null;
  refetch: () => Promise<void>;
}

export function usePotholes(): UsePotholesResult {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [lastInsertId, setLastInsertId] = useState<string | number | null>(null);

  // Realtime delivers the raw table row (WKT/WKB geometry, unparsed), while
  // potholes_view gives us clean lat/lng. Rather than parse PostGIS geometry
  // client-side, we re-fetch the view on every INSERT — simplest correct path
  // for a near-real-time feed at pothole-reporting volumes (not firehose-scale).
  const fetchFromView = useCallback(async () => {
    const { data, error } = await supabase.from("potholes_view").select("*");

    if (error) {
      console.error("Failed to fetch potholes_view:", error.message);
      return;
    }

    setPotholes((data ?? []).map(withSeverity));
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      await fetchFromView();
      if (isMounted) setStatus("connecting"); // baseline loaded, now arming realtime
    })();

    const channel = supabase
      .channel("public:potholes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "potholes" },
        (payload) => {
          setLastInsertId(payload.new.id);
          fetchFromView();
        }
      )
      .subscribe((subscriptionStatus) => {
        if (!isMounted) return;
        if (subscriptionStatus === "SUBSCRIBED") setStatus("live");
        if (subscriptionStatus === "CHANNEL_ERROR" || subscriptionStatus === "TIMED_OUT") {
          setStatus("offline");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [fetchFromView]);

  return { potholes, status, lastInsertId, refetch: fetchFromView };
}

// Exposed for components that just need to know "did something change recently"
// without subscribing to the full list (e.g. the pulse indicator).
export function useRecentlyChanged(lastInsertId: string | number | null, durationMs = 2400) {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (lastInsertId === null) return;
    setIsActive(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsActive(false), durationMs);
    return () => clearTimeout(timeoutRef.current);
  }, [lastInsertId, durationMs]);

  return isActive;
}

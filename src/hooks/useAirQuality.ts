import { useQuery } from "@tanstack/react-query";
import type { Station, StationAQIData } from "@/types/airquality";

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
}

function useStations() {
  return useQuery<Station[]>({
    queryKey: ["aq-stations"],
    queryFn: () => fetchJson("/api/airquality/stations"),
    staleTime: Infinity,
  });
}

function useStationAQI(eoi: string | null) {
  return useQuery<StationAQIData>({
    queryKey: ["aq-station", eoi],
    queryFn: () => fetchJson(`/api/airquality/station?eoi=${eoi}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!eoi,
  });
}

export { useStations, useStationAQI };
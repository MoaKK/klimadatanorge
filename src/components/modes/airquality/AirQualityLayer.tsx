"use client";

import { useEffect, useState } from "react";
import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import { useStations } from "@/hooks/useAirQuality";

const SOURCE_ID = "aq-stations";
const LAYER_ID = "aq-station-circles";
const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as never[] };

type Props = {
  onStationSelect: (eoi: string, name: string, kommune: string) => void;
};

function AirQualityLayer({ onStationSelect }: Props) {
  const map = useMapStore((s) => s.map);
  const [layersReady, setLayersReady] = useState(false);
  const { data: stations } = useStations();

  useEffect(() => {
    if (!map) return;
    try {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: "geojson", data: EMPTY_FC });
      }
      if (!map.getLayer(LAYER_ID)) {
        map.addLayer({
          id: LAYER_ID,
          type: "circle",
          source: SOURCE_ID,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 6, 10, 12],
            "circle-color": "#818cf8",
            "circle-opacity": 0.9,
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#ffffff",
          },
        });
      }
      setLayersReady(true);
    } catch { return; }

    return () => {
      setLayersReady(false);
      if (!map.loaded()) return;
      try {
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch (err) { console.error("AirQualityLayer cleanup error:", err); }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layersReady || !stations) return;
    const fc = {
      type: "FeatureCollection" as const,
      features: stations.map((s) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [s.longitude, s.latitude] },
        properties: { eoi: s.eoi, name: s.name, kommune: s.kommune.name },
      })),
    };
    try {
      (map.getSource(SOURCE_ID) as GeoJSONSource)?.setData(fc);
    } catch { }
  }, [map, layersReady, stations]);

  useEffect(() => {
    if (!map || !layersReady) return;

    const handleClick = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const { eoi, name, kommune } = feature.properties as {
        eoi: string; name: string; kommune: string;
      };
      onStationSelect(eoi, name, kommune);
    };

    const handleMouseEnter = () => { map.getCanvas().style.cursor = "pointer"; };
    const handleMouseLeave = () => { map.getCanvas().style.cursor = ""; };

    map.on("click", LAYER_ID, handleClick);
    map.on("mouseenter", LAYER_ID, handleMouseEnter);
    map.on("mouseleave", LAYER_ID, handleMouseLeave);

    return () => {
      map.off("click", LAYER_ID, handleClick);
      map.off("mouseenter", LAYER_ID, handleMouseEnter);
      map.off("mouseleave", LAYER_ID, handleMouseLeave);
    };
  }, [map, layersReady, onStationSelect]);

  return null;
}

export { AirQualityLayer };
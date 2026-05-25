"use client";

import { useEffect, useMemo, useRef } from "react";
import type { GeoJSONSource } from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import type { Co2Record } from "@/types/co2";
import {
  SOURCE_ID, FILL_ID, OUTLINE_ID,
  LABEL_SOURCE_ID, LABEL_ID, LABEL_LNGLAT,
  buildColorScale,
} from "./utils";

type Props = { data: Co2Record[]; year: number };

function Co2Layer({ data, year }: Props) {
  const map = useMapStore((s) => s.map);
  const layersReady = useRef(false);
  const colorScale = useMemo(() => buildColorScale(data), [data]);

  useEffect(() => {
    if (!map) return;

    try {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: "geojson", data: "/data/norway.json" });
      }
      if (!map.getLayer(FILL_ID)) {
        map.addLayer({
          id: FILL_ID, type: "fill", source: SOURCE_ID,
          paint: { "fill-color": "#ccc", "fill-opacity": 0.7 },
        });
      }
      if (!map.getLayer(OUTLINE_ID)) {
        map.addLayer({
          id: OUTLINE_ID, type: "line", source: SOURCE_ID,
          paint: { "line-color": "#fff", "line-width": 1 },
        });
      }
      if (!map.getSource(LABEL_SOURCE_ID)) {
        map.addSource(LABEL_SOURCE_ID, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "Point", coordinates: LABEL_LNGLAT }, properties: { label: "" } }],
          },
        });
      }
      if (!map.getLayer(LABEL_ID)) {
        map.addLayer({
          id: LABEL_ID, type: "symbol", source: LABEL_SOURCE_ID,
          layout: { "text-field": ["get", "label"], "text-size": 30, "text-anchor": "bottom" },
          paint: { "text-color": "#ffffff", "text-halo-color": "rgba(0,0,0,0.6)", "text-halo-width": 2 },
        });
      }
      layersReady.current = true;
    } catch {
      return;
    }

    return () => {
      layersReady.current = false;
      try {
        if (map.getLayer(LABEL_ID)) map.removeLayer(LABEL_ID);
        if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);
        if (map.getLayer(OUTLINE_ID)) map.removeLayer(OUTLINE_ID);
        if (map.getLayer(FILL_ID)) map.removeLayer(FILL_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch {}
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layersReady.current) return;
    const record = data.find((r) => r.year === year);
    if (!record) return;
    try {
      map.setPaintProperty(FILL_ID, "fill-color", record.co2 > 0 ? colorScale(record.co2) : "#ccc");
      (map.getSource(LABEL_SOURCE_ID) as GeoJSONSource)?.setData({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Point", coordinates: LABEL_LNGLAT }, properties: { label: `${record.co2.toFixed(1)} Mt CO₂` } }],
      });
    } catch {}
  }, [map, year, data, colorScale]);

  return null;
}

export { Co2Layer };

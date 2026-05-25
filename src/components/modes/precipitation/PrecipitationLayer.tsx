"use client";

import { useEffect, useMemo, useState } from "react";
import type { GeoJSONSource } from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import type { PrecipitationData } from "@/types/precipitation";
import {
  SOURCE_ID, FILL_ID, OUTLINE_ID,
  LABEL_SOURCE_ID, LABEL_ID, LABEL_LNGLAT, EMPTY_FC,
  buildColorScale, buildFC, getNorwayMean,
} from "./utils";

type Props = { data: PrecipitationData; year: number };

function PrecipitationLayer({ data, year }: Props) {
  const map = useMapStore((s) => s.map);
  const [layersReady, setLayersReady] = useState(false);
  const colorScale = useMemo(() => buildColorScale(data), [data]);

  useEffect(() => {
    if (!map) return;

    try {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: "geojson", data: EMPTY_FC });
      }
      if (!map.getLayer(FILL_ID)) {
        map.addLayer({
          id: FILL_ID, type: "fill", source: SOURCE_ID,
          paint: { "fill-color": ["get", "color"], "fill-opacity": 0.7 },
        });
      }
      if (!map.getLayer(OUTLINE_ID)) {
        map.addLayer({
          id: OUTLINE_ID, type: "line", source: SOURCE_ID,
          paint: { "line-color": "rgba(255,255,255,0.1)", "line-width": 0.5 },
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
      setLayersReady(true);
    } catch {
      return;
    }

    return () => {
      setLayersReady(false);
      if (!map.loaded()) return;
      try {
        if (map.getLayer(LABEL_ID)) map.removeLayer(LABEL_ID);
        if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);
        if (map.getLayer(OUTLINE_ID)) map.removeLayer(OUTLINE_ID);
        if (map.getLayer(FILL_ID)) map.removeLayer(FILL_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch (err) { console.error("PrecipitationLayer cleanup error:", err); }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layersReady) return;
    const yearIndex = data.years.indexOf(year);
    if (yearIndex === -1) return;
    try {
      (map.getSource(SOURCE_ID) as GeoJSONSource)?.setData(buildFC(data, yearIndex, colorScale));
      const mean = getNorwayMean(data, yearIndex);
      const label = mean !== null ? `${Math.round(mean)} mm` : "";
      (map.getSource(LABEL_SOURCE_ID) as GeoJSONSource)?.setData({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Point", coordinates: LABEL_LNGLAT }, properties: { label } }],
      });
    } catch { }
  }, [map, year, data, colorScale, layersReady]);

  return null;
}

export { PrecipitationLayer };
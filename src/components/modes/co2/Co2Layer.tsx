"use client";

import { useEffect, useMemo } from "react";
import * as d3 from "d3";
import type { GeoJSONSource } from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import type { Co2Record } from "@/types/co2";

const SOURCE_ID = "norway-co2";
const FILL_ID = "norway-co2-fill";
const OUTLINE_ID = "norway-co2-outline";
const LABEL_SOURCE_ID = "norway-co2-label";
const LABEL_ID = "norway-co2-label-text";
const LABEL_LNGLAT: [number, number] = [10, 63];

type Props = {
  data: Co2Record[];
  year: number;
};

function Co2Layer({ data, year }: Props) {
  const map = useMapStore((s) => s.map);

  const colorScale = useMemo(() => {
    const values = data.map((r) => r.co2).filter((v) => v > 0);
    return d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain([d3.min(values) ?? 0, d3.max(values) ?? 100]);
  }, [data]);

  useEffect(() => {
    if (!map) return;

    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: "/data/norway.json",
    });

    map.addLayer({
      id: FILL_ID,
      type: "fill",
      source: SOURCE_ID,
      paint: { "fill-color": "#ccc", "fill-opacity": 0.7 },
    });

    map.addLayer({
      id: OUTLINE_ID,
      type: "line",
      source: SOURCE_ID,
      paint: { "line-color": "#fff", "line-width": 1 },
    });

    map.addSource(LABEL_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: LABEL_LNGLAT },
            properties: { label: "" },
          },
        ],
      },
    });

    map.addLayer({
      id: LABEL_ID,
      type: "symbol",
      source: LABEL_SOURCE_ID,
      layout: {
        "text-field": ["get", "label"],
        "text-size": 30,
        "text-anchor": "bottom",
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "rgba(0,0,0,0.6)",
        "text-halo-width": 2,
      },
    });

    return () => {
      if (!(map as any).style) return;
      if (map.getLayer(LABEL_ID)) map.removeLayer(LABEL_ID);
      if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);
      if (map.getLayer(OUTLINE_ID)) map.removeLayer(OUTLINE_ID);
      if (map.getLayer(FILL_ID)) map.removeLayer(FILL_ID);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !map.getLayer(FILL_ID)) return;

    const record = data.find((r) => r.year === year);
    if (!record) return;

    map.setPaintProperty(FILL_ID, "fill-color", colorScale(record.co2));

    const source = map.getSource(LABEL_SOURCE_ID) as GeoJSONSource;
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: LABEL_LNGLAT },
            properties: { label: `${record.co2.toFixed(1)} Mt CO₂` },
          },
        ],
      });
    }
  }, [map, year, data, colorScale]);

  return null;
}

export { Co2Layer };
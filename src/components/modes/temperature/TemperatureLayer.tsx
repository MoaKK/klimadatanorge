"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import type { GeoJSONSource } from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import type { TemperatureData } from "@/types/temperature";

const SOURCE_ID = "temperature-grid";
const FILL_ID = "temperature-grid-fill";
const OUTLINE_ID = "temperature-grid-outline";
const LABEL_SOURCE_ID = "temperature-label";
const LABEL_ID = "temperature-label-text";
const LABEL_LNGLAT: [number, number] = [10, 63];

const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as never[] };

type Props = {
  data: TemperatureData;
  year: number;
};

function buildFC(
  data: TemperatureData,
  yearIndex: number,
  colorScale: (v: number) => string
) {
  return {
    type: "FeatureCollection" as const,
    features: data.cells.map((cell) => {
      const anomaly = yearIndex >= 0 ? cell.data[yearIndex] : null;
      return {
        type: "Feature" as const,
        geometry: cell.geometry,
        properties: {
          color: anomaly !== null ? colorScale(anomaly) : "rgba(128,128,128,0.3)",
        },
      };
    }),
  };
}

function getNorwayMean(data: TemperatureData, yearIndex: number): number | null {
  if (yearIndex < 0) return null;
  const values = data.cells
    .map((c) => c.data[yearIndex])
    .filter((v): v is number => v !== null);
  return values.length > 0 ? (d3.mean(values) ?? null) : null;
}

function TemperatureLayer({ data, year }: Props) {
  const map = useMapStore((s) => s.map);
  const layersReady = useRef(false);

  const colorScale = useMemo(() => {
    const allValues = data.cells.flatMap((c) =>
      c.data.filter((v): v is number => v !== null)
    );
    const maxAbs = d3.max(allValues.map(Math.abs)) ?? 3;
    return d3
      .scaleDiverging((t) => d3.interpolateRdBu(1 - t))
      .domain([-maxAbs, 0, maxAbs]);
  }, [data]);

  useEffect(() => {
    if (!map) return;

    try {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: "geojson", data: EMPTY_FC });
      }
      if (!map.getLayer(FILL_ID)) {
        map.addLayer({
          id: FILL_ID,
          type: "fill",
          source: SOURCE_ID,
          paint: { "fill-color": ["get", "color"], "fill-opacity": 0.7 },
        });
      }
      if (!map.getLayer(OUTLINE_ID)) {
        map.addLayer({
          id: OUTLINE_ID,
          type: "line",
          source: SOURCE_ID,
          paint: { "line-color": "rgba(255,255,255,0.1)", "line-width": 0.5 },
        });
      }

      if (!map.getSource(LABEL_SOURCE_ID)) {
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
      }
      if (!map.getLayer(LABEL_ID)) {
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
      } catch {
        // map was destroyed before cleanup
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layersReady.current) return;

    const yearIndex = data.years.indexOf(year);

    try {
      const gridSource = map.getSource(SOURCE_ID) as GeoJSONSource;
      if (gridSource) {
        gridSource.setData(buildFC(data, yearIndex, colorScale));
      }

      const mean = getNorwayMean(data, yearIndex);
      const label = mean !== null
        ? `${mean >= 0 ? "+" : ""}${mean.toFixed(2)}°C`
        : "";

      const labelSource = map.getSource(LABEL_SOURCE_ID) as GeoJSONSource;
      if (labelSource) {
        labelSource.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: LABEL_LNGLAT },
              properties: { label },
            },
          ],
        });
      }
    } catch {
      // map was destroyed mid-update
    }
  }, [map, year, data, colorScale]);

  return null;
}

export { TemperatureLayer };
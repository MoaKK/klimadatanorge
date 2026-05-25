import * as d3 from "d3";
import type { TemperatureData } from "@/types/temperature";

export const SOURCE_ID = "temperature-grid";
export const FILL_ID = "temperature-grid-fill";
export const OUTLINE_ID = "temperature-grid-outline";
export const LABEL_SOURCE_ID = "temperature-label";
export const LABEL_ID = "temperature-label-text";
export const LABEL_LNGLAT: [number, number] = [10, 63];
export const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as never[] };

export function buildColorScale(data: TemperatureData) {
  const allValues = data.cells.flatMap((c) => c.data.filter((v): v is number => v !== null));
  const maxAbs = d3.max(allValues.map(Math.abs)) ?? 3;
  return d3.scaleDiverging((t) => d3.interpolateRdBu(1 - t)).domain([-maxAbs, 0, maxAbs]);
}

export function buildFC(
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
        properties: { color: anomaly !== null ? colorScale(anomaly) : "rgba(128,128,128,0.3)" },
      };
    }),
  };
}

export function getNorwayMean(data: TemperatureData, yearIndex: number): number | null {
  if (yearIndex < 0) return null;
  const values = data.cells.map((c) => c.data[yearIndex]).filter((v): v is number => v !== null);
  return values.length > 0 ? (d3.mean(values) ?? null) : null;
}

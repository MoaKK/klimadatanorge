import * as d3 from "d3";
import type { PrecipitationData } from "@/types/precipitation";

const SOURCE_ID = "precipitation-grid";
const FILL_ID = "precipitation-grid-fill";
const OUTLINE_ID = "precipitation-grid-outline";
const LABEL_SOURCE_ID = "precipitation-label";
const LABEL_ID = "precipitation-label-text";
const LABEL_LNGLAT: [number, number] = [10, 63];
const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as never[] };

function buildColorScale(data: PrecipitationData) {
  const allValues = data.cells.flatMap((c) => c.data.filter((v): v is number => v !== null));
  const [min, max] = [d3.min(allValues) ?? 0, d3.max(allValues) ?? 4000];
  return d3.scaleSequential(d3.interpolateBlues).domain([min, max]);
}

function buildFC(data: PrecipitationData, yearIndex: number, colorScale: (v: number) => string) {
  return {
    type: "FeatureCollection" as const,
    features: data.cells.map((cell) => {
      const value = yearIndex >= 0 ? cell.data[yearIndex] : null;
      return {
        type: "Feature" as const,
        geometry: cell.geometry,
        properties: { color: value !== null ? colorScale(value) : "rgba(128,128,128,0.3)" },
      };
    }),
  };
}

function getNorwayMean(data: PrecipitationData, yearIndex: number): number | null {
  if (yearIndex < 0) return null;
  const values = data.cells.map((c) => c.data[yearIndex]).filter((v): v is number => v !== null);
  return values.length > 0 ? (d3.mean(values) ?? null) : null;
}

export {
  SOURCE_ID, FILL_ID, OUTLINE_ID,
  LABEL_SOURCE_ID, LABEL_ID, LABEL_LNGLAT, EMPTY_FC,
  buildColorScale, buildFC, getNorwayMean,
};
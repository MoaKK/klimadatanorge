import * as d3 from "d3";
import type { Co2Record } from "@/types/co2";

export const SOURCE_ID = "norway-co2";
export const FILL_ID = "norway-co2-fill";
export const OUTLINE_ID = "norway-co2-outline";
export const LABEL_SOURCE_ID = "norway-co2-label";
export const LABEL_ID = "norway-co2-label-text";
export const LABEL_LNGLAT: [number, number] = [10, 63];

export function buildColorScale(data: Co2Record[]) {
  const values = data.map((r) => r.co2).filter((v) => v > 0);
  return d3
    .scaleSequential(d3.interpolateYlOrRd)
    .domain([d3.min(values) ?? 0, d3.max(values) ?? 100]);
}

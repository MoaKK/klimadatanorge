"use client";

import maplibregl from "maplibre-gl";
import type { Scenario } from "@/types/sealevel";
import { PROJECTIONS, YEARS } from "@/data/sealevel";

export const TERRAIN_SOURCE = "sealevel-terrain";
export const FLOOD_LAYER = "sealevel-flood";
export const LABEL_SOURCE = "sealevel-label";
export const LABEL_LAYER = "sealevel-label-text";
export const LABEL_LNGLAT: [number, number] = [0, 10];
export const PROTOCOL = "terrarium-flood";

let _protocolRegistered = false;

export function ensureProtocol() {
  if (_protocolRegistered) return;
  if (typeof OffscreenCanvas === "undefined") return;

  maplibregl.addProtocol(PROTOCOL, async (params) => {
    const vMatch = params.url.match(/[?&]v=([^&]+)/);
    const threshold = vMatch ? parseFloat(vMatch[1]) : 0;

    // MapLibre substitutes {z}/{x}/{y} before invoking the protocol handler,
    // so params.url contains real tile coordinates, not template placeholders.
    const tileUrl = params.url
      .replace(`${PROTOCOL}://`, "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/")
      .replace(/\?.*$/, "");

    const res = await fetch(tileUrl);
    if (!res.ok) throw new Error(`Terrain tile fetch failed: ${res.status}`);

    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const elevation = r * 256 + g + b / 256 - 32768;
      // elevation < 0: naturally below sea level (Death Valley, polders, etc.)
      // 0.005 lower bound for positive elevations excludes ocean pixels encoded as exactly 0m
      if ((elevation < 0 || elevation >= 0.005) && elevation < threshold) {
        data[i] = 20; data[i + 1] = 100; data[i + 2] = 255; data[i + 3] = 165;
      } else {
        data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const outBlob = await canvas.convertToBlob();
    return { data: await outBlob.arrayBuffer() };
  });
  _protocolRegistered = true;
}

export function tileTemplate(threshold: number) {
  return `${PROTOCOL}://{z}/{x}/{y}.png?v=${threshold.toFixed(4)}`;
}

export function labelData(mm: number) {
  return {
    type: "FeatureCollection" as const,
    features: [{
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: LABEL_LNGLAT },
      properties: { label: `+${mm} mm` },
    }],
  };
}

export function getThreshold(year: number, scenario: Scenario): number {
  const idx = YEARS.indexOf(year);
  return idx >= 0 ? PROJECTIONS[scenario][idx] : PROJECTIONS[scenario][0];
}
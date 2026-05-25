"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { GeoJSONSource } from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import type { Scenario } from "@/types/sealevel";
import { PROJECTIONS, YEARS } from "@/data/sealevel";

const TERRAIN_SOURCE = "sealevel-terrain";
const FLOOD_LAYER = "sealevel-flood";
const LABEL_SOURCE = "sealevel-label";
const LABEL_LAYER = "sealevel-label-text";
const LABEL_LNGLAT: [number, number] = [0, 10];
const PROTOCOL = "terrarium-flood";

// Shared with the protocol handler -- updated before tile reload
let _threshold = 0.06;
let _protocolRegistered = false;

function ensureProtocol() {
  if (_protocolRegistered) return;
  _protocolRegistered = true;

  maplibregl.addProtocol(PROTOCOL, async (params) => {
    // Strip our cache-busting ?v= param before hitting AWS
    const tileUrl = params.url
      .replace(`${PROTOCOL}://`, "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/")
      .replace(/\?.*$/, "");

    const res = await fetch(tileUrl);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = new OffscreenCanvas(256, 256);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, 256, 256);
    const { data } = imageData;
    const threshold = _threshold;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Terrarium: height_m = R*256 + G + B/256 - 32768
      const elevation = r * 256 + g + b / 256 - 32768;
      if (elevation >= 0.005 && elevation < threshold) {
        data[i] = 20; data[i + 1] = 100; data[i + 2] = 255; data[i + 3] = 165;
      } else {
        data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const outBlob = await canvas.convertToBlob();
    return { data: await outBlob.arrayBuffer() };
  });
}

// Include threshold in URL so MapLibre treats each value as a different tile (cache bust)
function tileTemplate(threshold: number) {
  return `${PROTOCOL}://{z}/{x}/{y}.png?v=${threshold.toFixed(4)}`;
}

function labelData(mm: number) {
  return {
    type: "FeatureCollection" as const,
    features: [{
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: LABEL_LNGLAT },
      properties: { label: `+${mm} mm` },
    }],
  };
}

type Props = { year: number; scenario: Scenario };

function getThreshold(year: number, scenario: Scenario): number {
  const idx = YEARS.indexOf(year);
  return idx >= 0 ? PROJECTIONS[scenario][idx] : PROJECTIONS[scenario][0];
}

function SeaLevelLayer({ year, scenario }: Props) {
  const map = useMapStore((s) => s.map);
  const layersReady = useRef(false);

  useEffect(() => {
    if (!map) return;
    layersReady.current = false;
    ensureProtocol();

    const initThreshold = PROJECTIONS.medium[0];
    _threshold = initThreshold;

    try {
      map.addSource(TERRAIN_SOURCE, {
        type: "raster",
        tiles: [tileTemplate(initThreshold)],
        tileSize: 256,
        maxzoom: 15,
        attribution: 'Elevation: <a href="https://registry.opendata.aws/terrain-tiles/">AWS Terrain Tiles</a>',
      });
      map.addLayer({
        id: FLOOD_LAYER,
        type: "raster",
        source: TERRAIN_SOURCE,
        paint: { "raster-opacity": 1, "raster-fade-duration": 0 },
      });

      map.addSource(LABEL_SOURCE, {
        type: "geojson",
        data: labelData(Math.round(initThreshold * 1000)),
      });
      map.addLayer({
        id: LABEL_LAYER,
        type: "symbol",
        source: LABEL_SOURCE,
        layout: {
          "text-field": ["get", "label"],
          "text-size": 28,
          "text-anchor": "bottom",
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "rgba(0,0,0,0.7)",
          "text-halo-width": 2,
        },
      });

      layersReady.current = true;
    } catch {
      return;
    }

    return () => {
      layersReady.current = false;
      try {
        if (map.getLayer(LABEL_LAYER)) map.removeLayer(LABEL_LAYER);
        if (map.getSource(LABEL_SOURCE)) map.removeSource(LABEL_SOURCE);
        if (map.getLayer(FLOOD_LAYER)) map.removeLayer(FLOOD_LAYER);
        if (map.getSource(TERRAIN_SOURCE)) map.removeSource(TERRAIN_SOURCE);
      } catch { }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layersReady.current) return;

    const threshold = getThreshold(year, scenario);
    const mm = Math.round(threshold * 1000);
    _threshold = threshold;

    try {
      (map.getSource(LABEL_SOURCE) as GeoJSONSource)?.setData(labelData(mm));

      // setTiles busts the cache -- MapLibre sees a new URL and calls the protocol handler
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map.getSource(TERRAIN_SOURCE) as any)?.setTiles([tileTemplate(threshold)]);
    } catch { }
  }, [map, year, scenario]);

  return null;
}

export { SeaLevelLayer };
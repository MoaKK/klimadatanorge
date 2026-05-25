"use client";

import { useEffect, useState } from "react";
import type { GeoJSONSource, RasterTileSource } from "maplibre-gl";
import { useMapStore } from "@/store/mapStore";
import type { Scenario } from "@/types/sealevel";
import {
  TERRAIN_SOURCE, FLOOD_LAYER, LABEL_SOURCE, LABEL_LAYER,
  ensureProtocol, tileTemplate, labelData, getThreshold,
} from "./utils";

type Props = { year: number; scenario: Scenario };

function SeaLevelLayer({ year, scenario }: Props) {
  const map = useMapStore((s) => s.map);
  const [layersReady, setLayersReady] = useState(false);

  useEffect(() => {
    if (!map) return;
    setLayersReady(false);
    ensureProtocol();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initThreshold = getThreshold(year, scenario);

    const cleanup = () => {
      if (!map.loaded()) return;
      try {
        if (map.getLayer(LABEL_LAYER)) map.removeLayer(LABEL_LAYER);
        if (map.getSource(LABEL_SOURCE)) map.removeSource(LABEL_SOURCE);
        if (map.getLayer(FLOOD_LAYER)) map.removeLayer(FLOOD_LAYER);
        if (map.getSource(TERRAIN_SOURCE)) map.removeSource(TERRAIN_SOURCE);
      } catch { }
    };

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
      setLayersReady(true);
    } catch {
      cleanup();
      return;
    }

    return () => {
      setLayersReady(false);
      cleanup();
    };
    // year and scenario intentionally omitted: setup only runs when map changes,
    // and the second effect handles all subsequent updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!map || !layersReady) return;

    const threshold = getThreshold(year, scenario);
    const mm = Math.round(threshold * 1000);

    try {
      (map.getSource(LABEL_SOURCE) as GeoJSONSource)?.setData(labelData(mm));
      (map.getSource(TERRAIN_SOURCE) as RasterTileSource)?.setTiles([tileTemplate(threshold)]);
    } catch { }
  }, [map, year, scenario, layersReady]);

  return null;
}

export { SeaLevelLayer };

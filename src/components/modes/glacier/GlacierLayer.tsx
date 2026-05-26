"use client";

import { useEffect, useState } from "react";
import { Popup } from "maplibre-gl";
import type { MapLayerMouseEvent } from "maplibre-gl";
import type { GeoJSONSource } from "maplibre-gl";
import { useTranslations } from "next-intl";
import { useMapStore } from "@/store/mapStore";
import { SOURCE_ID, FILL_ID, OUTLINE_ID, LABEL_SOURCE_ID, LABEL_ID, LABEL_LNGLAT, PERIODS } from "./utils";

const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as never[] };

type Props = { periodIndex: number };

function GlacierLayer({ periodIndex }: Props) {
  const map = useMapStore((s) => s.map);
  const [layersReady, setLayersReady] = useState(false);
  const t = useTranslations("modes.glacier");

  useEffect(() => {
    if (!map) return;
    try {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: "geojson", data: EMPTY_FC });
      }
      if (!map.getLayer(FILL_ID)) {
        map.addLayer({
          id: FILL_ID, type: "fill", source: SOURCE_ID,
          paint: { "fill-color": "#bfdbfe", "fill-opacity": 0.7 },
        });
      }
      if (!map.getLayer(OUTLINE_ID)) {
        map.addLayer({
          id: OUTLINE_ID, type: "line", source: SOURCE_ID,
          paint: { "line-color": "#3b82f6", "line-width": 0.5 },
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
    } catch { return; }

    return () => {
      setLayersReady(false);
      if (!map.loaded()) return;
      try {
        if (map.getLayer(LABEL_ID)) map.removeLayer(LABEL_ID);
        if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);
        if (map.getLayer(OUTLINE_ID)) map.removeLayer(OUTLINE_ID);
        if (map.getLayer(FILL_ID)) map.removeLayer(FILL_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch (err) { console.error("GlacierLayer cleanup error:", err); }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layersReady) return;
    const period = PERIODS[periodIndex];
    if (!period) return;

    let cancelled = false;

    fetch(`/data/glaciers-${period.key}.geojson`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        try {
          (map.getSource(SOURCE_ID) as GeoJSONSource)?.setData(data);
          (map.getSource(LABEL_SOURCE_ID) as GeoJSONSource)?.setData({
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: { type: "Point", coordinates: LABEL_LNGLAT },
              properties: { label: `${period.totalArea.toLocaleString()} km²` },
            }],
          });
        } catch { }
      })
      .catch(() => { });

    return () => { cancelled = true; };
  }, [map, periodIndex, layersReady]);

  useEffect(() => {
    if (!map || !layersReady) return;

    const handleClick = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const name = feature.properties?.name as string | null;
      const area = feature.properties?.area_km2 as number | null;
      const displayName = name?.trim() ? name : t("unnamedGlacier");
      const areaText = area != null ? `${Number(area).toLocaleString()} km²` : "";
      new Popup({ closeButton: true, maxWidth: "180px" })
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${displayName}</strong>${areaText ? `<br/><span style="color:#a1a1aa">${areaText}</span>` : ""}`)
        .addTo(map);
    };

    const handleMouseEnter = () => { map.getCanvas().style.cursor = "pointer"; };
    const handleMouseLeave = () => { map.getCanvas().style.cursor = ""; };

    map.on("click", FILL_ID, handleClick);
    map.on("mouseenter", FILL_ID, handleMouseEnter);
    map.on("mouseleave", FILL_ID, handleMouseLeave);

    return () => {
      map.off("click", FILL_ID, handleClick);
      map.off("mouseenter", FILL_ID, handleMouseEnter);
      map.off("mouseleave", FILL_ID, handleMouseLeave);
    };
  }, [map, layersReady, t]);

  return null;
}

export { GlacierLayer };
"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapLocales } from "@/utils/mapLocales";
import { useMapStore } from "@/store/mapStore";

const NORWAY_CENTER: [number, number] = [15, 65];
const DEFAULT_ZOOM = 4;
const OFMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const { setMap } = useMapStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OFMAP_STYLE,
      center: NORWAY_CENTER,
      zoom: DEFAULT_ZOOM,
      locale: mapLocales[locale],
    });

    map.on("load", () => setMap(map));

    return () => {
      setMap(null);
      map.remove();
    };
  }, [locale, setMap]);


  return <div ref={ containerRef } className="relative w-full h-full" />;
}

export { MapView };
"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapLocales } from "@/utils/mapLocales";

const NORWAY_CENTER: [number, number] = [15, 65];
const DEFAULT_ZOOM = 4;
const OFMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OFMAP_STYLE,
      center: NORWAY_CENTER,
      zoom: DEFAULT_ZOOM,
      locale: mapLocales[locale],
    });

    return () => map.remove();
  }, [locale]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export { MapView };
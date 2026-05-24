"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const NORWAY_CENTER: [number, number] = [15, 65];
const DEFAULT_ZOOM = 4;
const OFMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const MapView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OFMAP_STYLE,
      center: NORWAY_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    return () => map.remove();
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export { MapView };
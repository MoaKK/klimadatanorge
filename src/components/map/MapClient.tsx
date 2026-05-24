"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  { ssr: false }
);

const MapClient = () => <MapView />;

export { MapClient };

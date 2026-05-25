"use client";

import dynamic from "next/dynamic";

const VantaGlobe = dynamic(
  () => import("@/components/home/VantaGlobe").then((m) => m.VantaGlobe),
  { ssr: false }
);

function VantaGlobeClient() {
  return <VantaGlobe />;
}

export { VantaGlobeClient };
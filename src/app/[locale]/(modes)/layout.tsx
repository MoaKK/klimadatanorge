import { Suspense } from "react";
import { MapClient } from "@/components/map/MapClient";
import { MapSkeleton } from "@/components/map/MapSkeleton";

function ModesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<MapSkeleton />}>
        <MapClient />
      </Suspense>
      {children}
    </>
  );
}

export default ModesLayout;
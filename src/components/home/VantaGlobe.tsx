"use client";

import { useEffect, useRef } from "react";

function VantaGlobe() {
  const el = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effect = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      import("three"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      import("vanta/dist/vanta.globe.min" as any),
    ]).then(([THREE, { default: GLOBE }]) => {
      if (!mounted || !el.current) return;
      effect.current = GLOBE({
        el: el.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        backgroundColor: 0x000000,
        color: 0xfafafa,
        color2: 0xf50000,
        size: 0.8,
      });
    });

    return () => {
      mounted = false;
      effect.current?.destroy();
    };
  }, []);

  return <div ref={el} className="absolute inset-0" />;
}

export { VantaGlobe };
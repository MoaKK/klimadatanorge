"use client";

import { useState, useEffect, useRef } from "react";
import { GlacierLayer } from "./GlacierLayer";
import { GlacierSlider } from "./GlacierSlider";
import { GlacierChart } from "./GlacierChart";
import { PERIODS } from "./utils";

function GlacierMode() {
  const [periodIndex, setPeriodIndex] = useState(PERIODS.length - 1);
  const urlTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const i = parseInt(p.get("period") ?? "", 10);
    if (Number.isFinite(i) && i >= 0 && i < PERIODS.length) setPeriodIndex(i);
  }, []);

  useEffect(() => {
    if (urlTimeout.current) clearTimeout(urlTimeout.current);
    urlTimeout.current = setTimeout(() => {
      window.history.replaceState(null, "", `?period=${periodIndex}`);
    }, 300);
    return () => { if (urlTimeout.current) clearTimeout(urlTimeout.current); };
  }, [periodIndex]);

  return (
    <>
      <GlacierLayer periodIndex={periodIndex} />
      <GlacierChart periodIndex={periodIndex} />
      <GlacierSlider periodIndex={periodIndex} onChange={setPeriodIndex} />
    </>
  );
}

export { GlacierMode };
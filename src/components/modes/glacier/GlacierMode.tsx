"use client";

import { useState, useEffect } from "react";
import { GlacierLayer } from "./GlacierLayer";
import { GlacierSlider } from "./GlacierSlider";
import { GlacierChart } from "./GlacierChart";
import { PERIODS } from "./utils";

function GlacierMode() {
  const [periodIndex, setPeriodIndex] = useState(PERIODS.length - 1);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const i = parseInt(p.get("period") ?? "", 10);
    if (Number.isFinite(i) && i >= 0 && i < PERIODS.length) setPeriodIndex(i);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", `?period=${periodIndex}`);
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
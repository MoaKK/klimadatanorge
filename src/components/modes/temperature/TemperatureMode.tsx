"use client";

import { useState, useEffect, useRef } from "react";
import { TemperatureLayer } from "./TemperatureLayer";
import { TemperatureSlider } from "./TemperatureSlider";
import { TemperatureChart } from "./TemperatureChart";
import type { TemperatureData } from "@/types/temperature";

type Props = {
  data: TemperatureData;
  minYear: number;
  maxYear: number;
};

function TemperatureMode({ data, minYear, maxYear }: Props) {
  const [year, setYear] = useState(maxYear);
  const urlTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const y = parseInt(p.get("year") ?? "", 10);
    if (Number.isFinite(y) && y >= minYear && y <= maxYear) setYear(y);
  }, [minYear, maxYear]);

  useEffect(() => {
    if (urlTimeout.current) clearTimeout(urlTimeout.current);
    urlTimeout.current = setTimeout(() => {
      window.history.replaceState(null, "", `?year=${year}`);
    }, 300);
    return () => { if (urlTimeout.current) clearTimeout(urlTimeout.current); };
  }, [year]);

  return (
    <>
      <TemperatureLayer data={data} year={year} />
      <TemperatureChart data={data} year={year} />
      <TemperatureSlider year={year} min={minYear} max={maxYear} onChange={setYear} />
    </>
  );
}

export { TemperatureMode };
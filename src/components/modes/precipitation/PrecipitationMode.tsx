"use client";

import { useState, useEffect, useRef } from "react";
import type { PrecipitationData } from "@/types/precipitation";
import { MIN_YEAR, MAX_YEAR } from "@/data/precipitation";
import { PrecipitationLayer } from "./PrecipitationLayer";
import { PrecipitationSlider } from "./PrecipitationSlider";
import { PrecipitationChart } from "./PrecipitationChart";

type Props = { data: PrecipitationData };

function PrecipitationMode({ data }: Props) {
  const [year, setYear] = useState(MAX_YEAR);
  const urlTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const y = parseInt(p.get("year") ?? "", 10);
    if (Number.isFinite(y) && y >= MIN_YEAR && y <= MAX_YEAR) setYear(y);
  }, []);

  useEffect(() => {
    if (urlTimeout.current) clearTimeout(urlTimeout.current);
    urlTimeout.current = setTimeout(() => {
      window.history.replaceState(null, "", `?year=${year}`);
    }, 300);
    return () => { if (urlTimeout.current) clearTimeout(urlTimeout.current); };
  }, [year]);

  return (
    <>
      <PrecipitationLayer data={data} year={year} />
      <PrecipitationChart data={data} year={year} />
      <PrecipitationSlider year={year} min={MIN_YEAR} max={MAX_YEAR} onChange={setYear} />
    </>
  );
}

export { PrecipitationMode };
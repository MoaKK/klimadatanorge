"use client";

import { useState } from "react";
import { Co2Layer } from "./Co2Layer";
import { Co2Slider } from "./Co2Slider";
import { Co2Chart } from "./Co2Chart";
import type { Co2Record } from "@/types/co2";

type Props = {
  data: Co2Record[];
  minYear: number;
  maxYear: number;
};

function Co2Mode({ data, minYear, maxYear }: Props) {
  const [year, setYear] = useState(maxYear);

  return (
    <>
      <Co2Layer data={data} year={year} />
      <Co2Chart data={data} year={year} />
      <Co2Slider year={year} min={minYear} max={maxYear} onChange={setYear} />
    </>
  );
}

export { Co2Mode };
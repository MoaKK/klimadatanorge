"use client";

import { useState } from "react";
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

  return (
    <>
      <TemperatureLayer data={data} year={year} />
      <TemperatureChart data={data} year={year} />
      <TemperatureSlider year={year} min={minYear} max={maxYear} onChange={setYear} />
    </>
  );
}

export { TemperatureMode };
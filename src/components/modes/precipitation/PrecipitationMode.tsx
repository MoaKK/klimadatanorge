"use client";

import { useState } from "react";
import type { PrecipitationData } from "@/types/precipitation";
import { MIN_YEAR, MAX_YEAR } from "@/data/precipitation";
import { PrecipitationLayer } from "./PrecipitationLayer";
import { PrecipitationSlider } from "./PrecipitationSlider";
import { PrecipitationChart } from "./PrecipitationChart";

type Props = { data: PrecipitationData };

function PrecipitationMode({ data }: Props) {
  const [year, setYear] = useState(MAX_YEAR);

  return (
    <>
      <PrecipitationLayer data={data} year={year} />
      <PrecipitationChart data={data} year={year} />
      <PrecipitationSlider year={year} min={MIN_YEAR} max={MAX_YEAR} onChange={setYear} />
    </>
  );
}

export { PrecipitationMode };
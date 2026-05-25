"use client";

import { useState } from "react";
import { SeaLevelLayer } from "./SeaLevelLayer";
import { SeaLevelSlider } from "./SeaLevelSlider";
import { SeaLevelChart } from "./SeaLevelChart";
import type { Scenario } from "@/types/sealevel";
import { MIN_YEAR, MAX_YEAR } from "@/data/sealevel";

function SeaLevelMode() {
  const [year, setYear] = useState(MIN_YEAR);
  const [scenario, setScenario] = useState<Scenario>("medium");

  return (
    <>
      <SeaLevelLayer year={year} scenario={scenario} />
      <SeaLevelChart year={year} scenario={scenario} />
      <SeaLevelSlider
        year={year}
        min={MIN_YEAR}
        max={MAX_YEAR}
        scenario={scenario}
        onYearChange={setYear}
        onScenarioChange={setScenario}
      />
    </>
  );
}

export { SeaLevelMode };
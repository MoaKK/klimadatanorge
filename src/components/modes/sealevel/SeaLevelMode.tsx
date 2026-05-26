"use client";

import { useState, useEffect } from "react";
import { SeaLevelLayer } from "./SeaLevelLayer";
import { SeaLevelSlider } from "./SeaLevelSlider";
import { SeaLevelChart } from "./SeaLevelChart";
import type { Scenario } from "@/types/sealevel";
import { MIN_YEAR, MAX_YEAR, YEARS } from "@/data/sealevel";

const VALID_SCENARIOS: Scenario[] = ["low", "medium", "high"];

function SeaLevelMode() {
  const [year, setYear] = useState(MIN_YEAR);
  const [scenario, setScenario] = useState<Scenario>("medium");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const y = parseInt(p.get("year") ?? "", 10);
    if (YEARS.includes(y)) setYear(y);
    const s = p.get("scenario") as Scenario;
    if (VALID_SCENARIOS.includes(s)) setScenario(s);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", `?year=${year}&scenario=${scenario}`);
  }, [year, scenario]);

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
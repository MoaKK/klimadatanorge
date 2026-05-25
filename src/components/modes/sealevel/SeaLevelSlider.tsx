"use client";

import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ModeHelp } from "@/components/modes/ModeHelp";
import type { Scenario } from "@/types/sealevel";

type Props = {
  year: number;
  min: number;
  max: number;
  scenario: Scenario;
  onYearChange: (year: number) => void;
  onScenarioChange: (scenario: Scenario) => void;
};

const SCENARIOS: Scenario[] = ["low", "medium", "high"];

function SeaLevelSlider({ year, min, max, scenario, onYearChange, onScenarioChange }: Props) {
  const t = useTranslations("modes.sealevel");

  return (
    <div className="absolute bottom-8 left-1/2 z-10 w-[clamp(16rem,50vw,36rem)] -translate-x-1/2 rounded-xl bg-background/80 px-6 py-4 backdrop-blur-sm animate-in fade-in duration-1000">
      <ModeHelp className="absolute -top-8 left-0">
        {t("sliderHelp")}
      </ModeHelp>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground sm:text-sm">{min}</span>
        <span aria-live="polite" aria-atomic="true" className="text-base font-semibold sm:text-xl">{year}</span>
        <span className="text-xs text-muted-foreground sm:text-sm">{max}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={10}
        value={[year]}
        onValueChange={([val]) => onYearChange(val)}
        className="cursor-pointer"
        aria-label={t("sliderAriaLabel")}
      />
      <div className="mt-4 flex gap-2" role="group" aria-label={t("scenarioLabel")}>
        {SCENARIOS.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={scenario === s ? "default" : "secondary"}
            className="flex-1"
            onClick={() => onScenarioChange(s)}
            aria-pressed={scenario === s}
          >
            {t(`scenario.${s}`)}
          </Button>
        ))}
      </div>
    </div>
  );
}

export { SeaLevelSlider };
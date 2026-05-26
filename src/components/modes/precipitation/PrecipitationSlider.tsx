"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ModeHelp } from "@/components/modes/ModeHelp";

type Props = {
  year: number;
  min: number;
  max: number;
  onChange: (year: number) => void;
};

function PrecipitationSlider({ year, min, max, onChange }: Props) {
  const t = useTranslations("modes.precipitation");
  const tUi = useTranslations("ui");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (year >= max) {
        setPlaying(false);
        onChange(min);
      } else {
        onChange(year + 1);
      }
    }, 500);
    return () => clearInterval(id);
  }, [playing, year, max, min, onChange]);

  return (
    <div className="absolute bottom-8 left-1/2 z-10 w-[clamp(16rem,50vw,36rem)] -translate-x-1/2 rounded-xl bg-background/80 px-6 py-4 backdrop-blur-sm animate-in fade-in duration-1000">
      <ModeHelp className="absolute -top-8 left-0">
        { t("sliderHelp") }
      </ModeHelp>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground sm:text-sm">{ min }</span>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={ () => setPlaying((p) => !p) }
            aria-label={ playing ? tUi("pause") : tUi("play") }
          >
            { playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" /> }
          </Button>
          <span aria-live="polite" aria-atomic="true" className="text-base font-semibold sm:text-xl">{ year }</span>
        </div>
        <span className="text-xs text-muted-foreground sm:text-sm">{ max }</span>
      </div>
      <div className="relative">
        <Slider
          min={ min }
          max={ max }
          step={ 1 }
          value={ [year] }
          onValueChange={ ([val]) => onChange(val) }
          className="cursor-pointer"
          aria-label={ t("sliderAriaLabel") }
        />
      </div>
    </div>
  );
}

export { PrecipitationSlider };
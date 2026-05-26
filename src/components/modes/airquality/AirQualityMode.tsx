"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ModeHelp } from "@/components/modes/ModeHelp";
import { AirQualityLayer } from "./AirQualityLayer";
import { AirQualityPanel } from "./AirQualityPanel";

type Selected = { eoi: string; name: string; kommune: string };

function AirQualityMode() {
  const [selected, setSelected] = useState<Selected | null>(null);
  const t = useTranslations("modes.airquality");

  const handleSelect = useCallback((eoi: string, name: string, kommune: string) => {
    setSelected({ eoi, name, kommune });
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <AirQualityLayer onStationSelect={handleSelect} />
      <AirQualityPanel
        eoi={selected?.eoi ?? null}
        stationName={selected?.name ?? null}
        kommune={selected?.kommune ?? null}
        onClose={handleClose}
      />
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-in fade-in duration-1000">
          <ModeHelp>{t("help")}</ModeHelp>
        <div className="rounded-xl bg-background/80 px-5 py-3 backdrop-blur-sm flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{t("clickHint")}</p>
        </div>
      </div>
    </>
  );
}

export { AirQualityMode };
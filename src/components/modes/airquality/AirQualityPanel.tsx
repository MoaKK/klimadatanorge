"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useStationAQI } from "@/hooks/useAirQuality";

type Props = {
  eoi: string | null;
  stationName: string | null;
  kommune: string | null;
  onClose: () => void;
};

function getAQIColor(aqi: number): string {
  if (aqi < 2) return "#3F9F41";
  if (aqi < 3) return "#FFCB00";
  if (aqi < 4) return "#FF8C00";
  return "#CF0000";
}

type AQIKey = "aqiLow" | "aqiModerate" | "aqiHigh" | "aqiVeryHigh";

function getAQIKey(aqi: number): AQIKey {
  if (aqi < 2) return "aqiLow";
  if (aqi < 3) return "aqiModerate";
  if (aqi < 4) return "aqiHigh";
  return "aqiVeryHigh";
}

function AirQualityPanel({ eoi, stationName, kommune, onClose }: Props) {
  const t = useTranslations("modes.airquality");
  const { data, isLoading, isError } = useStationAQI(eoi);

  if (!eoi) return null;

  const current = data?.data.time[0];
  const aqi = current?.variables.AQI?.value;
  const no2 = current?.variables.no2_concentration?.value;
  const pm25 = current?.variables.pm25_concentration?.value;
  const pm10 = current?.variables.pm10_concentration?.value;
  const o3 = current?.variables.o3_concentration?.value;

  return (
    <div className="absolute right-4 top-5 z-10 w-64 animate-in fade-in duration-200">
      <div className="rounded-xl bg-background/85 p-4 backdrop-blur-sm shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 pr-2">
            <p className="font-semibold text-sm leading-tight truncate">{stationName}</p>
            <p className="text-xs text-muted-foreground">{kommune}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 shrink-0 -mt-0.5 -mr-1"
            onClick={onClose}
            aria-label={t("close")}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {isLoading && (
          <p className="text-xs text-muted-foreground">{t("loading")}</p>
        )}

        {isError && (
          <p className="text-xs text-destructive">{t("error")}</p>
        )}

        {data && aqi != null && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: getAQIColor(aqi) }}
              />
              <span className="font-semibold text-sm">{t(getAQIKey(aqi))}</span>
              <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                {t("aqiLabel")} {aqi.toFixed(1)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs border-t border-border/40 pt-2.5">
              {no2 != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NO₂</span>
                  <span className="tabular-nums">{no2.toFixed(1)} µg/m³</span>
                </div>
              )}
              {pm25 != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PM2.5</span>
                  <span className="tabular-nums">{pm25.toFixed(1)} µg/m³</span>
                </div>
              )}
              {pm10 != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PM10</span>
                  <span className="tabular-nums">{pm10.toFixed(1)} µg/m³</span>
                </div>
              )}
              {o3 != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">O₃</span>
                  <span className="tabular-nums">{o3.toFixed(1)} µg/m³</span>
                </div>
              )}
            </div>

            <p className="mt-2.5 text-[10px] text-muted-foreground">
              {t("updatedLabel")}: {new Date(data.meta.reftime).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export { AirQualityPanel };
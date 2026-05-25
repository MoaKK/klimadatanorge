"use client";

import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { useTranslations } from "next-intl";
import type { Scenario } from "@/types/sealevel";
import { PROJECTIONS, YEARS } from "@/data/sealevel";

const MARGIN = { top: 12, right: 12, bottom: 24, left: 54 };
const WIDTH = 300;
const HEIGHT = 180;
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const SCENARIO_COLORS: Record<Scenario, string> = {
  low: "rgba(96,165,250,0.9)",
  medium: "rgba(251,191,36,0.9)",
  high: "rgba(239,68,68,0.9)",
};

type DataPoint = { year: number; low: number; medium: number; high: number };

type Props = { year: number; scenario: Scenario };

function SeaLevelChart({ year, scenario }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const t = useTranslations("modes.sealevel");

  const series: DataPoint[] = useMemo(
    () => YEARS.map((y, i) => ({
      year: y,
      low: PROJECTIONS.low[i] * 1000,
      medium: PROJECTIONS.medium[i] * 1000,
      high: PROJECTIONS.high[i] * 1000,
    })),
    []
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear()
      .domain([YEARS[0], YEARS[YEARS.length - 1]])
      .range([0, INNER_W]);

    const allVals = series.flatMap((r) => [r.low, r.medium, r.high]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(allVals) as number])
      .nice()
      .range([INNER_H, 0]);

    const g = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    g.append("g")
      .attr("transform", `translate(0,${INNER_H})`)
      .call(d3.axisBottom(x).ticks(4).tickFormat(d3.format("d")))
      .call((a) => a.select(".domain").remove())
      .selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}mm`))
      .call((a) => a.select(".domain").remove())
      .selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "12px");

    (["low", "medium", "high"] as Scenario[]).forEach((s) => {
      const isActive = s === scenario;
      g.append("path")
        .datum(series)
        .attr("fill", "none")
        .attr("stroke", SCENARIO_COLORS[s])
        .attr("stroke-width", isActive ? 2 : 1)
        .attr("stroke-opacity", isActive ? 1 : 0.35)
        .attr("d", d3.line<DataPoint>()
          .x((r) => x(r.year))
          .y((r) => y(r[s]))
          .curve(d3.curveMonotoneX)
        );
    });

    const record = series.find((r) => r.year === year);
    if (record) {
      const cx = x(record.year);
      g.append("line")
        .attr("x1", cx).attr("x2", cx)
        .attr("y1", 0).attr("y2", INNER_H)
        .attr("stroke", "rgba(255,255,255,0.4)")
        .attr("stroke-dasharray", "3,3");
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", y(record[scenario]))
        .attr("r", 4)
        .attr("fill", SCENARIO_COLORS[scenario]);
    }
  }, [series, year, scenario]);

  return (
    <div className="absolute right-4 top-5 z-10 rounded-xl bg-background/80 p-3 backdrop-blur-sm">
      <svg ref={svgRef} width={WIDTH} height={HEIGHT} role="img" aria-label={t("chartAriaLabel")} />
    </div>
  );
}

export { SeaLevelChart };
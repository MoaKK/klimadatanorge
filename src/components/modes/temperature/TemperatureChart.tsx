"use client";

import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { useTranslations } from "next-intl";
import type { TemperatureData } from "@/types/temperature";

const MARGIN = { top: 12, right: 12, bottom: 24, left: 36 };
const WIDTH = 300;
const HEIGHT = 180;
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

type YearAnomaly = { year: number; anomaly: number };

type Props = {
  data: TemperatureData;
  year: number;
};

function TemperatureChart({ data, year }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const t = useTranslations("modes.temperature");

  const series: YearAnomaly[] = useMemo(() => {
    return data.years.map((y, i) => {
      const values = data.cells
        .map((c) => c.data[i])
        .filter((v): v is number => v !== null);
      const mean = values.length > 0 ? d3.mean(values) ?? 0 : 0;
      return { year: y, anomaly: parseFloat(mean.toFixed(2)) };
    });
  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain(d3.extent(series, (r) => r.year) as [number, number])
      .range([0, INNER_W]);

    const yExtent = d3.extent(series, (r) => r.anomaly) as [number, number];
    const yMax = Math.max(Math.abs(yExtent[0]), Math.abs(yExtent[1]));

    const y = d3
      .scaleLinear()
      .domain([-yMax, yMax])
      .nice()
      .range([INNER_H, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    g.append("line")
      .attr("x1", 0).attr("x2", INNER_W)
      .attr("y1", y(0)).attr("y2", y(0))
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 1);

    g.append("path")
      .datum(series)
      .attr("fill", "rgba(239,68,68,0.25)")
      .attr(
        "d",
        d3.area<YearAnomaly>()
          .x((r) => x(r.year))
          .y0(y(0))
          .y1((r) => y(Math.max(0, r.anomaly)))
          .curve(d3.curveMonotoneX)
      );

    g.append("path")
      .datum(series)
      .attr("fill", "rgba(59,130,246,0.25)")
      .attr(
        "d",
        d3.area<YearAnomaly>()
          .x((r) => x(r.year))
          .y0((r) => y(Math.min(0, r.anomaly)))
          .y1(y(0))
          .curve(d3.curveMonotoneX)
      );

    g.append("path")
      .datum(series)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.7)")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3.line<YearAnomaly>()
          .x((r) => x(r.year))
          .y((r) => y(r.anomaly))
          .curve(d3.curveMonotoneX)
      );

    g.append("g")
      .attr("transform", `translate(0,${INNER_H})`)
      .call(d3.axisBottom(x).ticks(4).tickFormat(d3.format("d")))
      .call((a) => a.select(".domain").remove())
      .selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}°`))
      .call((a) => a.select(".domain").remove())
      .selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "12px");

    const record = series.find((r) => r.year === year);
    if (record) {
      const cx = x(record.year);
      const cy = y(record.anomaly);

      g.append("line")
        .attr("x1", cx).attr("x2", cx)
        .attr("y1", 0).attr("y2", INNER_H)
        .attr("stroke", "rgba(255,255,255,0.4)")
        .attr("stroke-dasharray", "3,3");

      g.append("circle")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", 4)
        .attr("fill", record.anomaly >= 0 ? "rgb(239,68,68)" : "rgb(59,130,246)");
    }
  }, [series, year]);

  return (
    <div className="absolute right-4 top-5 z-10 w-68 sm:w-[350px] rounded-xl bg-background/80 p-3 backdrop-blur-sm animate-in fade-in duration-1000">
      <svg
        ref={ svgRef }
        viewBox={ `0 0 ${WIDTH} ${HEIGHT}` }
        width="100%"
        style={ { aspectRatio: `${WIDTH}/${HEIGHT}` } }
        role="img"
        aria-label={ t("chartAriaLabel") }
      />
    </div>
  );
}

export { TemperatureChart };
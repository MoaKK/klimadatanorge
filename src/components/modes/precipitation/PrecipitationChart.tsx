"use client";

import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { useTranslations } from "next-intl";
import type { PrecipitationData } from "@/types/precipitation";

const MARGIN = { top: 12, right: 12, bottom: 24, left: 44 };
const WIDTH = 300;
const HEIGHT = 180;
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

type YearTotal = { year: number; total: number };

type Props = { data: PrecipitationData; year: number };

function PrecipitationChart({ data, year }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const t = useTranslations("modes.precipitation");

  const series: YearTotal[] = useMemo(() => {
    return data.years.map((y, i) => {
      const values = data.cells
        .map((c) => c.data[i])
        .filter((v): v is number => v !== null);
      const mean = values.length > 0 ? d3.mean(values) ?? 0 : 0;
      return { year: y, total: parseFloat(mean.toFixed(1)) };
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

    const yExtent = d3.extent(series, (r) => r.total) as [number, number];
    const y = d3
      .scaleLinear()
      .domain([yExtent[0] * 0.9, yExtent[1] * 1.05])
      .nice()
      .range([INNER_H, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    g.append("path")
      .datum(series)
      .attr("fill", "rgba(59,130,246,0.2)")
      .attr(
        "d",
        d3.area<YearTotal>()
          .x((r) => x(r.year))
          .y0(INNER_H)
          .y1((r) => y(r.total))
          .curve(d3.curveMonotoneX)
      );

    g.append("path")
      .datum(series)
      .attr("fill", "none")
      .attr("stroke", "rgba(59,130,246,0.8)")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3.line<YearTotal>()
          .x((r) => x(r.year))
          .y((r) => y(r.total))
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
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}`))
      .call((a) => a.select(".domain").remove())
      .selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "12px");

    const record = series.find((r) => r.year === year);
    if (record) {
      const cx = x(record.year);
      const cy = y(record.total);

      g.append("line")
        .attr("x1", cx).attr("x2", cx)
        .attr("y1", 0).attr("y2", INNER_H)
        .attr("stroke", "rgba(255,255,255,0.4)")
        .attr("stroke-dasharray", "3,3");

      g.append("circle")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", 4)
        .attr("fill", "rgb(59,130,246)");
    }
  }, [series, year]);

  return (
    <div className="absolute right-4 top-5 z-10 rounded-xl bg-background/80 p-3 backdrop-blur-sm">
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label={t("chartAriaLabel")}
      />
    </div>
  );
}

export { PrecipitationChart };
"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Co2Record } from "@/types/co2";

const MARGIN = { top: 12, right: 12, bottom: 24, left: 44 };
const WIDTH = 300;
const HEIGHT = 180;
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

type Props = {
  data: Co2Record[];
  year: number;
};

function Co2Chart({ data, year }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const filtered = data.filter((r) => r.co2 > 0);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(filtered, (r) => r.year) as [number, number])
      .range([0, INNER_W]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(filtered, (r) => r.co2) ?? 100])
      .nice()
      .range([INNER_H, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    g.append("path")
      .datum(filtered)
      .attr("fill", "rgba(255,255,255,0.08)")
      .attr(
        "d",
        d3
          .area<Co2Record>()
          .x((r) => x(r.year))
          .y0(INNER_H)
          .y1((r) => y(r.co2))
          .curve(d3.curveMonotoneX)
      );

    g.append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.7)")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line<Co2Record>()
          .x((r) => x(r.year))
          .y((r) => y(r.co2))
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
      .call(d3.axisLeft(y).ticks(3).tickFormat((d) => `${d}Mt`))
      .call((a) => a.select(".domain").remove())
      .selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "12px");

    const record = filtered.find((r) => r.year === year);
    if (record) {
      const cx = x(record.year);
      const cy = y(record.co2);

      g.append("line")
        .attr("x1", cx).attr("x2", cx)
        .attr("y1", 0).attr("y2", INNER_H)
        .attr("stroke", "rgba(255,255,255,0.4)")
        .attr("stroke-dasharray", "3,3");

      g.append("circle")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", 4)
        .attr("fill", "white");
    }
  }, [data, year]);

  return (
    <div className="absolute right-4 top-5 z-10 rounded-xl bg-background/80 p-3 backdrop-blur-sm">
      <svg ref={svgRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
}

export { Co2Chart };
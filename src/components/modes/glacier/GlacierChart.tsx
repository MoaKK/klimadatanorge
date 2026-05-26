"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTranslations } from "next-intl";
import { PERIODS } from "./utils";

const WIDTH = 300;
const HEIGHT = 140;
const MARGIN = { top: 12, right: 8, bottom: 28, left: 44 };

type Props = { periodIndex: number };

function GlacierChart({ periodIndex }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const t = useTranslations("modes.glacier");

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const w = WIDTH - MARGIN.left - MARGIN.right;
    const h = HEIGHT - MARGIN.top - MARGIN.bottom;
    const g = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const x = d3.scaleBand()
      .domain(PERIODS.map((_, i) => String(i)))
      .range([0, w])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, (d3.max(PERIODS, (p) => p.totalArea) ?? 4000) * 1.1])
      .range([h, 0]);

    g.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(x).tickFormat((d) => PERIODS[Number(d)].label.slice(0, 4)))
      .call((ax) => ax.select(".domain").remove())
      .selectAll("text")
      .attr("fill", "#71717a")
      .style("font-size", "10px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}`))
      .call((ax) => ax.select(".domain").remove())
      .call((ax) => ax.selectAll(".tick line").attr("stroke", "#27272a"))
      .selectAll("text")
      .attr("fill", "#71717a")
      .style("font-size", "10px");

    g.selectAll(".bar")
      .data(PERIODS)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => x(String(i)) ?? 0)
      .attr("y", (p) => y(p.totalArea))
      .attr("width", x.bandwidth())
      .attr("height", (p) => h - y(p.totalArea))
      .attr("fill", "#3b82f6")
      .attr("opacity", (p, i) => i === periodIndex ? 1 : p.partial ? 0.25 : 0.45)
      .attr("rx", 2);
  }, [periodIndex]);

  return (
    <div className="absolute right-4 top-5 z-10 w-68 sm:w-[350px] animate-in fade-in duration-200">
      <div className="rounded-xl bg-background/80 p-3 backdrop-blur-sm">
        <p className="mb-1 text-xs font-medium text-muted-foreground">{t("chartTitle")}</p>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width="100%"
          style={{ aspectRatio: `${WIDTH}/${HEIGHT}` }}
          aria-label={t("chartAriaLabel")}
        />
      </div>
    </div>
  );
}

export { GlacierChart };
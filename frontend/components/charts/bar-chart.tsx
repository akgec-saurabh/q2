"use client";
import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;
type BarProps = {
  width: number;
  height: number;
  data: { feature: string; total: number }[];
};

export const BarChart = ({ width, height, data }: BarProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const groups = data.map((d) => d.feature);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(groups)
      .range([0, boundsHeight])
      .padding(BAR_PADDING);
  }, [boundsHeight, groups]);

  const [min, max] = d3.extent(data.map((d) => d.total));
  console.log(min, max);

  // X axis
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 4000])
      .range([0, boundsWidth]);
  }, [boundsWidth]);

  const allShapes = data.map((d, i) => {
    const y = yScale(d.feature);
    if (y === undefined) return null;

    return (
      <g key={i}>
        <rect
          x={xScale(0)}
          y={yScale(d.feature)}
          width={xScale(d.total)}
          height={yScale.bandwidth()}
          opacity={0.7}
          stroke="#9d174d"
          fill="#9d174d"
          fillOpacity={0.3}
          strokeWidth={1}
          rx={1}
        />
        <text
          x={xScale(d.total) + (xScale(d.total + 10) > boundsWidth ? -10 : +10)}
          y={y + yScale.bandwidth() / 2}
          textAnchor={xScale(d.total + 10) > boundsWidth ? "end" : "start"}
          alignmentBaseline="central"
          fontSize={12}
          opacity={xScale(d.total) > 90 ? 1 : 0} // hide label if bar is not wide enough
        >
          {d.total}
        </text>
      </g>
    );
  });

  const grid = xScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i}>
        <line
          x1={xScale(value)}
          x2={xScale(value)}
          y1={0}
          y2={boundsHeight}
          stroke="#808080"
          opacity={0.2}
        />
        <text
          x={xScale(value)}
          y={boundsHeight + 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={9}
          stroke="#808080"
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const svgElement = d3.select(svgRef.current);
      svgElement.selectAll("*").remove();

      // Add y-axis
      const yAxisGenerator = d3.axisLeft(yScale);
      svg.append("g").call(yAxisGenerator);
    }
  }, [yScale]);

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
        >
          {grid}
          {allShapes}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
          ref={svgRef}
        ></g>
      </svg>
    </div>
  );
};

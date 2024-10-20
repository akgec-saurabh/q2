"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type DataPoint = { x: string; y: number };
type LineChartProps = {
  width: number;
  height: number;
  data: DataPoint[];
};

export const LineChart = ({ width, height, data }: LineChartProps) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Convert date strings into Date objects
  const formattedData = data
    .map((d) => ({
      x: new Date(d.x), // Convert x to Date object
      y: d.y,
    }))
    .filter((d) => !isNaN(d.x.getTime())); // Filter out invalid Date objects

  // Y axis
  const [min, max] = d3.extent(formattedData, (d) => d.y);
  console.log(min, max);
  const yScale = d3
    .scaleLinear()
    .domain([0, max || 0])
    .range([boundsHeight, 0]);

  // X axis using d3.scaleTime
  const [xMin, xMax] = d3.extent(formattedData, (d) => d.x);
  const xScale = d3
    .scaleTime()
    .domain([xMin, xMax] as [Date, Date])
    .range([0, boundsWidth]);

  // Render the X and Y axis using d3.js
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    // X axis with time format
    const xAxisGenerator = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => d3.timeFormat("%Y-%m-%d")(d as Date));
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    // Y axis
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const lineBuilder = d3
    .line<{ x: Date; y: number }>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const linePath = lineBuilder(formattedData);
  if (!linePath) return null;

  // Build the circles
  const allCircles = formattedData.map((item, i) => {
    return (
      <circle
        key={i}
        cx={xScale(item.x)}
        cy={yScale(item.y)}
        r={4}
        fill={"#cb1dd1"}
      />
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <path
            d={linePath}
            opacity={0.3}
            stroke="#cb1dd1"
            fill="none"
            strokeWidth={2}
          />
          {allCircles}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
    </div>
  );
};

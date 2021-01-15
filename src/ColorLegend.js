import React from "react";

const ColorLegend = ({ colorScale, domain, range }) => {
  const rectWidth = 40;
  const rectHeight = 8;
  // const formatPercent = (d, i) => format(".0%")(d).replace("%", "");
  return (
    <svg width={rectWidth * (domain.length - 1)} height={30}>
      <g className="color-legend">
        {/* <text className="legend-title" x={rectWidth * 3} y={0}></text> */}
        {range.map((d, i) => {
          return (
            <rect
              className="legend-rect"
              key={d}
              fill={d}
              width={rectWidth}
              height={rectHeight}
              x={i * rectWidth}
              y={0}
            ></rect>
          );
        })}
        {domain.map((d, i) => {
          return (
            <g
              className="legend-tick"
              key={d}
              transform={`translate(${i * rectWidth}, ${0})`}
            >
              <line
                className="tick-line"
                x1={0}
                x2={0}
                y1={0}
                y2={rectHeight * 1.5}
              ></line>
              <text className="tick-text" y={rectHeight * 3}>
                {d}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default ColorLegend;

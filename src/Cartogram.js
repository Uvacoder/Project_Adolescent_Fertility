import React, { Fragment, useRef } from "react";
import { centroids } from "../../data/data.json";
import { forceSimulation, forceX, forceY, forceManyBody } from "d3-force";
import { geoRobinson } from "d3-geo-projection";
import Tooltip from "./Tooltip";

const centroidMap = centroids.reduce((obj, item) => {
  obj[item.id] = item;
  return obj;
}, {});

const margin = {
  top: 0,
  right: 0,
  bottom: 7.5,
  left: 0,
};

const Cartogram = (props) => {
  const { width, height, data, colorScale, areaScale } = props;
  const tooltipRef = useRef(null);
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const nodePadding = chartWidth / 500;
  const projection = geoRobinson()
    .scale(chartWidth * 0.2)
    .translate([chartWidth * 0.41, chartHeight * 0.666]);

  areaScale.range([1, chartWidth / 6.5]);

  data.forEach((d) => {
    const { lat, lng } = centroidMap[d.code];
    d.pos = projection([lng, lat]);
    d.area = areaScale(d.pop);
    d.poor_area = areaScale(d.poor_pop);
    [d.x, d.y] = d.pos;
  });

  const collide = () => {
    for (var k = 0, iterations = 4, strength = 0.5; k < iterations; ++k) {
      for (var i = 0, n = data.length; i < n; ++i) {
        for (var a = data[i], j = i + 1; j < n; ++j) {
          var b = data[j],
            x = a.x + a.vx - b.x - b.vx,
            y = a.y + a.vy - b.y - b.vy,
            lx = Math.abs(x),
            ly = Math.abs(y),
            r = a.area / 2 + b.area / 2 + nodePadding;
          if (lx < r && ly < r) {
            if (lx > ly) {
              lx = (lx - r) * (x < 0 ? -strength : strength);
              a.vx -= lx;
              b.vx += lx;
            } else {
              ly = (ly - r) * (y < 0 ? -strength : strength);
              a.vy -= ly;
              b.vy += ly;
            }
          }
        }
      }
    }
  };
  const applyForce = (nodes) => {
    const simulation = forceSimulation(nodes)
      .force(
        "x",
        forceX()
          .x(
            (d) =>
              projection([centroidMap[d.code].lng, centroidMap[d.code].lat])[0]
          )
          .strength(1)
      )
      .force(
        "y",
        forceY()
          .y(
            (d) =>
              projection([centroidMap[d.code].lng, centroidMap[d.code].lat])[1]
          )
          .strength(1)
      )
      .force("charge", forceManyBody().strength(-1))
      .force("collide", collide)
      .stop();

    let i = 0;
    while (simulation.alpha() > 0.01 && i < 500) {
      simulation.tick();
      i++;
      //console.log(`${Math.round((100 * i) / 200)}%`);
    }
  };
  applyForce(data);

  return (
    <Fragment>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g className="symbol-layer">
            {data.map((d) => {
              return (
                <g
                  className={`country-g ${d.code}-g`}
                  key={d.code}
                  transform={`translate(${d.x}, ${d.y})`}
                  onMouseOver={() => {
                    const end = d.x > chartWidth / 2 ? true : false;
                    const xOffset = d.area / 2 + 5;
                    const yOffset = margin.top;

                    tooltipRef.current.handleMouseOver(
                      d,
                      d.x,
                      d.y,
                      xOffset,
                      yOffset,
                      chartWidth,
                      end
                    );
                  }}
                  onMouseOut={() => {
                    tooltipRef.current.handleMouseOut();
                  }}
                >
                  <rect
                    className="country-pop-rect"
                    x={-d.area / 2}
                    y={-d.area / 2}
                    width={d.area}
                    height={d.area}
                    // fill={colorScale(d.rate)}
                  ></rect>
                  <rect
                    className="country-poor-rect"
                    x={-d.poor_area / 2}
                    y={-d.poor_area / 2}
                    width={d.poor_area}
                    height={d.poor_area}
                    fill={colorScale(d.rate)}
                  ></rect>
                  {d.poor_area > 25 && (
                    <text className="country-label">{d.code}</text>
                  )}
                  {d.code === "USA" && (
                    <g>
                      <text
                        className="key-text"
                        x={-d.area / 2}
                        y={-d.area - height / 20}
                      >
                        Total population
                      </text>
                      <line
                        className="key-line"
                        x1={-d.area / 3}
                        x2={-d.area / 3}
                        y1={-d.area / 2}
                        y2={-d.area + 10 - height / 20}
                      ></line>
                      <text className="key-text" x={d.poor_area / 2 + 10}>
                        Population in poverty
                      </text>
                      <line
                        className="key-line"
                        x1={d.poor_area / 2}
                        x2={d.poor_area / 2 + 7.5}
                        y1={0}
                        y2={0}
                      ></line>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </g>
        {/* <g
        className="color-legend"
        transform={`translate(${width * 0.65}, ${height * 0.9})`}
      >
        <text className="legend-title" x={rectWidth * 3} y={-rectHeight}>
          Poverty rate
        </text>
        {colorScale.range().map((d, i) => {
          return (
            <rect
              className="legend-rect"
              key={d}
              fill={d}
              width={rectWidth}
              height={rectHeight}
              x={i * rectWidth}
            ></rect>
          );
        })}
        {colorScale.quantiles().map((d, i) => {
          return (
            <g
              className="legend-tick"
              key={d}
              transform={`translate(${(i + 1) * rectWidth}, ${0})`}
            >
              <line
                className="tick-line"
                x1={0}
                x2={0}
                y1={0}
                y2={rectHeight * 1.5}
              ></line>
              <text className="tick-text" y={rectHeight * 3}>{`${formatPercent(
                d
              )}${i == 0 ? "%" : ""}`}</text>
            </g>
          );
        })}
      </g> */}
        <g className="size-legend"></g>
      </svg>
      <Tooltip ref={tooltipRef} />
    </Fragment>
  );
};

export default Cartogram;

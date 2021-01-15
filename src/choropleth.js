import React from "react";
import "../../scss/charts/Choropleth.scss";
import countries from "../../data/dataformap.json";
import { feature, mesh } from "topojson";
// import { geoEqualEarth } from "d3-geo-projection";
import { geoPath, geoEqualEarth } from "d3-geo";

const noDataColor = "#cccccc";
const features = feature(countries, countries.objects.countries);
const meshes = mesh(countries, countries.objects.countries, (a, b) => a !== b);

const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const Choropleth = (props) => {
  const { width, data, colorScale, state } = props;
  const ratio = 0.5;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = width * ratio - margin.top - margin.bottom;
  const projection = geoEqualEarth()
    .fitExtent(
      [
        [margin.left, margin.top],
        [chartWidth, chartHeight],
      ],
      features
    )
    .scale(width * 0.21)
    .translate([width * 0.44, width * ratio * 0.55]);
  const path = geoPath().projection(projection);
  return (
    <svg width={width} height={width * ratio}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g className="country-layer">
          {features.features.map((feature, i) => {
            return (
              <path
                className={`country-path path-${feature.properties.id}`}
                key={`path-${i}`}
                d={path(feature)}
                fill={(() => {
                  const val = data[feature.properties.id];
                  if (val) {
                    return colorScale(val[state]);
                  }
                  return noDataColor;
                })()}
              ></path>
            );
          })}
        </g>
        <g className="mesh-layer">
          <path className="mesh-path" d={path(meshes)}></path>
        </g>
      </g>
    </svg>
  );
};

export default Choropleth;
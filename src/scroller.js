import React, { useState, Fragment } from "react";
import Select from "react-select";
import Choropleth from "../charts/Choropleth";
import ColorLegend from "../charts/ColorLegend";
import { Scrollama, Step } from "react-scrollama";
import useResizeObserver from "use-resize-observer/polyfilled";
import ContainerDimensions from "react-container-dimensions";
import { ascending, descending } from "d3-array";
import {
  pefa_grades_final,
  covid_gov_stringency,
  pefa_compare_indicators,
} from "../../data/data.json";
import { schemeOrRd } from "d3-scale-chromatic";
import { scaleThreshold } from "d3-scale";
import Grades from "../charts/Grades";
import Radar from "../charts/Radar";

const sorted_grades = pefa_grades_final.sort(
  (a, b) =>
    descending(ascending(a.after, a.before), ascending(b.after, b.before)) ||
    descending(a.after, b.after) ||
    descending(a.before, b.before)
);

const Scroller = ({ props }) => {
  const { id, scenes, title, subtitle, source } = props;
  const [stringencyState, setStringencyState] = useState("3/1/2020");
  const [highlighted, setHighlighted] = useState(null);
  const [highlightedGrades, setHighlightedGrades] = useState(null);
  // const [selectedCountry, setSelectedCountry] = useState(null);

  const options = pefa_compare_indicators.map((d, i) => ({
    value: i,
    label: d.country,
  }));

  // const stringencyDict = covid_gov_stringency.reduce((obj, item) => {
  //   obj[item.country_code] = item;
  //   return obj;
  // }, {});

  const stringencyScale = scaleThreshold()
    .domain([20, 40, 60, 80])
    .range(schemeOrRd[5]);

  const createMarkup = (text) => {
    return { __html: text };
  };

  const { ref } = useResizeObserver({
    onResize: ({ width, height }) => {
      ref.current.style.top = `${(window.innerHeight - height) / 2}px`;
    },
  });

  const handleStepEnter = ({ element, data }) => {
    const scene = data.id;
    // console.log(scene);
    if (scene === "mar1") {
      setStringencyState("3/1/2020");
    } else if (scene === "apr1") {
      setStringencyState("4/1/2020");
    } else if (scene === "radar-1") {
      setHighlighted({ value: 21, label: "Indonesia" });
    } else if (scene === "radar-2") {
      setHighlighted({ value: 18, label: "Ghana" });
    } else if (scene === "radar-3") {
      setHighlighted({ value: 2, label: "Argentina" });
    } else if (scene === "radar-4") {
      setHighlighted(null);
    } else if (scene === "grades-1") {
      setHighlightedGrades(null);
    } else if (scene === "grades-2") {
      setHighlightedGrades(16);
    } else if (scene === "grades-3") {
      setHighlightedGrades(null);
    }
  };

  const getGraphic = (width, height, id) => {
    return {
      "stringency-graphic": (
        <Fragment>
          <div className="color-legend">
            <ColorLegend
              colorScale={stringencyScale}
              domain={[0, 20, 40, 60, 80, 100]}
              range={stringencyScale.range()}
            ></ColorLegend>
          </div>
          <div className="choropleth-chart">
            <Choropleth
              id={id}
              width={width}
              colorScale={stringencyScale}
              data={covid_gov_stringency}
              state={stringencyState}
            ></Choropleth>
          </div>
        </Fragment>
      ),
      "forecasting-transparency-independence": (
        <Fragment>
          <div className="select-container">
            <Select
              options={options}
              value={highlighted}
              onChange={setHighlighted}
              className="country-select"
              placeholder="Select a country"
              // isDisabled={filter !== "all"}
              isClearable={true}
            />
          </div>
          <div className="radar-chart">
            <Radar
              width={width}
              height={width}
              data={pefa_compare_indicators}
              highlighted={highlighted}
            ></Radar>
          </div>
        </Fragment>
      ),
      "pefa-grades": (
        <div className="grades-chart">
          <Grades
            width={width}
            height={height}
            data={sorted_grades}
            highlighted={highlightedGrades}
          ></Grades>
        </div>
      ),
    };
  };

  const handleStepExit = ({ element, data, direction }) => {
    if (data.id === "radar-1" && direction === "up") {
      setHighlighted(null);
    }
  };

  return (
    <div className="scroller" id={id}>
      <div className="scroll-graphic" ref={ref}>
        <div className={`${props.size}-wrapper`}>
          <p className="chart-title">{title}</p>
          <p className="chart-dek">{subtitle}</p>
          <div className={`inner-wrapper`}>
            <ContainerDimensions>
              {({ width, height }) =>
                getGraphic(width, height, id)[props.graphic]
              }
            </ContainerDimensions>
          </div>
          {props.note ? (
            <p
              className="chart-note"
              dangerouslySetInnerHTML={createMarkup(props.note)}
            ></p>
          ) : (
            ""
          )}
          <p
            className="chart-source"
            dangerouslySetInnerHTML={createMarkup(source)}
          ></p>
        </div>
      </div>
      <div className="scroll-scenes">
        <Scrollama
          offset={1}
          onStepEnter={handleStepEnter}
          onStepExit={handleStepExit}
        >
          {scenes.map((scene, i) => {
            return (
              <Step data={scene} index={i} key={`scene-${i}`}>
                <div className="scene">
                  <div className="article-wrapper scroller-text">
                    <p dangerouslySetInnerHTML={createMarkup(scene.text)}></p>
                  </div>
                </div>
              </Step>
            );
          })}
        </Scrollama>
      </div>
    </div>
  );
};

export default Scroller;

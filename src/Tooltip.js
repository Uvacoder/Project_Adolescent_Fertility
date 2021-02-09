import React, { forwardRef, useState, useImperativeHandle } from "react";
import { format } from "d3-format";
import { intword, intcomma } from "journalize";

const formatPercent = format(".1%");

const Tooltip = forwardRef((props, ref) => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({
    left: 0,
    top: 0,
    opacity: 0,
  });

  const handleMouseOver = (d, dx, dy, xOffset, yOffset, chartWidth, end) => {
    setActive(true);
    if (end) {
      setTooltipStyle({
        right: `${chartWidth - (dx - xOffset)}px`,
        top: `${dy + yOffset}px`,
      });
    } else {
      setTooltipStyle({
        left: `${dx + xOffset}px`,
        top: `${dy + yOffset}px`,
      });
    }
    setSelected(d);
  };

  const handleMouseOut = () => {
    setActive(false);
  };

  useImperativeHandle(ref, () => {
    return {
      handleMouseOver: handleMouseOver,
      handleMouseOut: handleMouseOut,
    };
  });

  return (
    <div className={`tooltip${active ? " active" : ""}`} style={tooltipStyle}>
      <div className="tooltip-country">{selected ? selected.country : ""}</div>
      <div className="tooltip-poverty">
        {selected
          ? selected.poor_pop >= 1000000
            ? intword(Math.round(selected.poor_pop))
            : intcomma(Math.round(selected.poor_pop))
          : ""}{" "}
        (
        <span className="bold">
          {selected ? formatPercent(selected.rate) : ""}
        </span>
        ) in poverty in {selected ? selected.year : ""}
      </div>
    </div>
  );
});

export default Tooltip;

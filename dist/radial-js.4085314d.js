// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"radial-js.js":[function(require,module,exports) {
function initiateRadialChart() {
  var mode = 'Play';
  var timeout;
  var speed = 1200;
  var margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  };
  var width = 560 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  var svg = d3.select('#radar-live-chart') //d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var center = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // center.on("click", function() {
  // })
  // var playButton = d3.select("#play-button");
  // playButton.on("click", function() {
  //   if (mode === "Play") {
  //     mode = "Stop"
  //     playButton.text("Play")
  //     stopLoop();
  //   } else {
  //     mode = "Play"
  //     playButton.text("Stop")
  //     playLoop();
  //   }
  // })
  //Change event for year selected

  d3.select("#year-selected").on("change", function () {
    var _this = this;

    var data = raw_json_data.find(function (item) {
      return item.Year == _this.value;
    });
    mode = "Stop";
    stopLoop();
    change(data);
  });
  var radius = Math.min(width, height) / 2 + 10;
  var radiusTextSpacing = 55;
  var fullCircle = 2 * Math.PI;
  var dotRadius = 4;
  var x = d3.scaleBand().range([0, 2 * Math.PI]);
  var y = d3.scaleRadial().range([0, radius]);
  var z = d3.scaleTime().range([radius, 0]); // A filter shamelessly stolen from Nadieh Bremer

  var filter = svg.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '7').attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  var areaRuns = d3.areaRadial().angle(function (d) {
    return x(d.Region);
  }).outerRadius(function (d) {
    return y(d.Value);
  }) // .curve(d3.curveCatmullRomClosed)
  // .curve(d3.curveCatmullRomClosed.alpha(0));
  // .curve(d3.curveCardinal.tension(0.5));
  .curve(d3.curveLinearClosed);
  var chart_title, runs, hoverCirclesRuns, labels;
  var yTick, yAxis; // TODO: Update variable, Get dynamic data from server

  var raw_json_data = [{
    "Year": "2010",
    "Data": [{
      "Region": "EAS",
      "Value": "20.072114",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "20.9688877661965",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "30.7524460570081",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "115.176700970633",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "70.3932662981317",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "39.4521806264201",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "43.3104530606295",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2011",
    "Data": [{
      "Region": "EAS",
      "Value": "20.588081729857",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "20.4681440292032",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "28.5936623498961",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "113.55241388591",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "69.2865255279987",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "40.0251119377137",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "40.6595839220271",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2012",
    "Data": [{
      "Region": "EAS",
      "Value": "20.9557397491113",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "19.9614509560383",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "26.4355245365078",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "111.90814056992",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "68.1723762870795",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "40.6309626496809",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "38.0078949169445",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2013",
    "Data": [{
      "Region": "EAS",
      "Value": "20.9115905223091",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "19.3561871781597",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "24.9141341936224",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "110.049607180282",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "67.1531940114908",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "40.6395043735482",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "35.5715016377883",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2014",
    "Data": [{
      "Region": "EAS",
      "Value": "20.8373777809131",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "18.7726859069412",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "23.3992229635975",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "108.206223869023",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "66.1339079981389",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "40.6017724457825",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "33.1144994870789",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2015",
    "Data": [{
      "Region": "EAS",
      "Value": "20.7927291470796",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "18.2086803071959",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "21.8899735487449",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "106.385944010197",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "65.1129054186921",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "40.4988228269663",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "30.6349804819207",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2016",
    "Data": [{
      "Region": "EAS",
      "Value": "20.7303920630287",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "17.6388596528956",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "20.3731213412371",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "104.575840549692",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "64.0671852799992",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "40.2426989322918",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "28.1174953037681",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2017",
    "Data": [{
      "Region": "EAS",
      "Value": "20.6689835926567",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "17.0886924276063",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "18.8554418232832",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "102.788585175762",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "63.0300016489983",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "39.9706780005772",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "25.584972419587",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }, {
    "Year": "2018",
    "Data": [{
      "Region": "EAS",
      "Value": "20.6900901276043",
      "Name": "East Asia and the Pacific",
      "Color": "#000000",
      "Position": 0
    }, {
      "Region": "ECS",
      "Value": "16.6254477998961",
      "Name": "Europe & Central Asia",
      "Color": "#000000",
      "Position": 1
    }, {
      "Region": "NAC",
      "Value": "17.6419501986564",
      "Name": "North America",
      "Color": "#000000",
      "Position": 2
    }, {
      "Region": "SSF",
      "Value": "101.220225106526",
      "Name": "Sub-Saharan Africa",
      "Color": "#000000",
      "Position": 3
    }, {
      "Region": "LCN",
      "Value": "62.0981418807705",
      "Name": "Latin America & the Caribbean",
      "Color": "#000000",
      "Position": 4
    }, {
      "Region": "MEA",
      "Value": "39.7044596608902",
      "Name": "Middle East & North Africa",
      "Color": "#000000",
      "Position": 5
    }, {
      "Region": "SAS",
      "Value": "24.5230468897055",
      "Name": "South Asia",
      "Color": "#000000",
      "Position": 6
    }]
  }];
  on_new_data_load(raw_json_data[0]); // //Function to render story if needed
  // function renderStory(data) {
  //   console.log(data)
  //   let story = `In ${data.Year} ...`;
  //   d3.select("#small_story").html(story)
  // }

  var loop_counter = 0;

  function playLoop() {
    timeout = setTimeout(function () {
      if (mode === "Play") {
        loop_counter++;

        if (loop_counter >= raw_json_data.length) {
          loop_counter = 0;
        } //Call render story
        // renderStory(raw_json_data[loop_counter])


        change(raw_json_data[loop_counter]);
        playLoop();
      } // Speed of loop in milliseconds

    }, speed);
  }

  function stopLoop() {
    clearTimeout(timeout);
  }

  playLoop(); // Draw inital chart when new data is loaded

  function on_new_data_load(load_data) {
    var data = load_data.Data;
    chart_title = svg.append("text").attr("x", width / 2).attr("y", 0 - margin.top / 2).attr("text-anchor", "middle").style("font-size", "25px").style("fill", '#000000') // .style("text-decoration")  
    .text(load_data.Year);
    data = data.sort(function (a, b) {
      return parseInt(a.Value) > parseInt(b.Value);
    });
    x.domain(data.map(function (d) {
      return d.Region;
    }));
    y.domain([0, 140]);
    z.domain([0, 140]);
    var xAxis = center.append("g").attr("text-anchor", "middle");
    var xTick = xAxis.selectAll("g").data(data).enter().append("g");
    xTick.append("line").attr("class", "x-tick").attr("y2", radius).attr("transform", function (d) {
      return "rotate(" + x(d.Region) / fullCircle * 360 + ")";
    });
    xTick.append("line").attr("class", "x-tick-long").attr("y1", radius).attr("y2", radius + 30).attr("transform", function (d) {
      return "rotate(" + x(d.Region) / fullCircle * 360 + ")";
    });
    yAxis = center.append("g").attr("text-anchor", "middle");
    addAxis(0);
    labels = xTick.append("g").attr("class", "label");
    labels.append("text").attr("y", radius + radiusTextSpacing).attr("x", function (d) {
      return Math.cos(x(d.Region) + Math.PI / 2) * (radius + radiusTextSpacing);
    }).attr("y", function (d) {
      return Math.sin(x(d.Region) + Math.PI / 2) * (radius + radiusTextSpacing);
    }).attr("dy", "0.30em").style("fill", function (d) {
      return d.Color;
    }).text(function (d) {
      return d.Name;
    }).call(wrap, 70, 12); // wrap the text in <= 30 pixels

    ;
    runs = center.append("g");
    append_base_path(load_data);
    runs.append("path").datum(data).attr("id", "runs-path").attr("class", "runs").attr("d", areaRuns).attr("transform", "rotate(180)").style("filter", "url(#glow)").on("mouseover", function () {
      d3.select(".times").transition().style("fill-opacity", 0.05);
    }).on("mouseout", function () {
      d3.select(".times").transition().style("fill-opacity", 0.35);
    });
    runs.selectAll("circle").data(data).enter().append("circle").attr("class", "dot-run").attr("cy", function (d) {
      return y(d.Value);
    }).attr("r", dotRadius).attr("transform", function (d) {
      return "rotate(" + x(d.Region) / fullCircle * 360 + ")";
    }).style("filter", "url(#glow)");
    hoverCirclesRuns = center.append("g");
    hoverCirclesRuns.selectAll("circle").data(data).enter().append("circle").attr("class", "hover-dot").attr("cy", function (d) {
      return y(d.Value);
    }).attr("r", dotRadius * 4).attr("transform", function (d) {
      return "rotate(" + x(d.Region) / fullCircle * 360 + ")";
    }).on("mouseover", function (d) {
      var multiplier = y(Math.round(d.Value));
      var unit = "avg";
      var labelText = Math.round(d.Value).toString() + " births per 1,000 teenagers";
      d3.select(this.parentNode).append("text").attr("x", function () {
        return Math.cos(x(d.Region) + Math.PI / 2) * multiplier;
      }).attr("y", function () {
        return Math.sin(x(d.Region) + Math.PI / 2) * multiplier;
      }).attr("dy", "-1em").style("fill", "#000000").style("font-size", "small").attr("text-anchor", "middle").text(labelText);
    }).on("mouseout", function (d) {
      d3.select(this.parentNode).select("text").remove(); // d3.select(this.parentNode).select("rect").remove();
    });
  }

  function append_base_path(load_data) {
    var data = load_data.Data;
    runs.append("path").datum(data).style("fill", "none").style("stroke-width", "1px").style("stroke", "#000000").attr("id", "base-runs-path").attr("d", areaRuns).attr("transform", "rotate(180)"); // Create Label for 2010

    var base_runs_path = d3.select("#base-runs-path");
    var pathEl = base_runs_path.node();
    var BBox = pathEl.getBBox();
    runs.append("text").attr("fill", "#000000").attr('x', BBox.x).attr('y', BBox.y).attr('width', BBox.width).attr('height', BBox.height).style("text-anchor", "end").style("font-size", "13px").text("2010");
    runs.append("line").style("fill", "#000000").style("stroke", "#000000").style("stroke-width", "1px").attr("x1", BBox.x + 2).attr("y1", BBox.y - 5).attr("x2", BBox.x + 14).attr("y2", BBox.y - 5);
  } // Update chart date


  function change(load_data) {
    var data = load_data.Data;
    chart_title.transition().duration(1000).text(load_data.Year);
    runs.select("#runs-path").datum(data).transition().duration(1000).attr("d", function (d) {
      return areaRuns(d);
    }).style("fill", function () {
      return "#bcbddc";
    });
    runs.selectAll("circle").data(data).transition().duration(1000).attr("cy", function (d) {
      return y(d.Value);
    }).style("fill", function () {
      return "#bcbddc";
    });
    hoverCirclesRuns.selectAll("circle").data(data).attr("cy", function (d) {
      return y(d.Value);
    });
  }

  function addAxis(time) {
    yTick = yAxis.selectAll("g").data(function () {
      return [20, 40, 60, 80, 120]; // console.log(y.ticks(4).slice(0))
      // return  y.ticks(4).slice(0);
    }) // .ticks(ticksAmount)
    .enter().append("g").attr("class", "y-tick");
    yTick.append("circle").transition().duration(time * 3).attr("r", function (d) {
      return y(d);
    });
    yTick.append("text").transition().duration(time * 3).attr("y", function (d) {
      return -y(d);
    }).attr("dy", "0.35em").text(function (d) {
      return d;
    });
  }

  function wrap(text, width, fontSize) {
    text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1,
          // ems
      x = text.attr("x"),
          y = text.attr("y"),
          dy = 0,
          //parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em").style("font-size", fontSize);

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));

        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").style("font-size", fontSize).text(word);
        }
      }
    });
  }
}

window.onload = initiateRadialChart;
},{}],"../../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58335" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","radial-js.js"], null)
//# sourceMappingURL=/radial-js.4085314d.js.map
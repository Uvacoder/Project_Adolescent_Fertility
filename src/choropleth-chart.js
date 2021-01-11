import * as d3 from 'd3'
import * as topojson from 'topojson'
// import legend from 'd3-svg-legend'
// import { scaleBand } from 'd3-scale'

let margin = { top: 10, left: 10, right: 10, bottom: 10 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#choropleth-chart')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// map and projection
var projection = d3
  .geoEqualEarth()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2])
var path = d3.geoPath().projection(projection)

// create a variable to store data from the csv
var data = d3.map()

// create color scale for the choropleth
var colorScale = d3
  .scaleThreshold()
  .domain(d3.range(0, 160))
  .range(d3.schemeRdPu[8])
   // .unknown('#ffffff')


// Legend
// var g = svg
//   .append('g')
//   .attr('class', 'legendThreshold')
//   .attr('transform', 'translate(20,20)')
// g.append('text')
//   .attr('class', 'caption')
//   .attr('x', 0)
//   .attr('y', -6)
//   .text('Students')
// var labels = ['0', '1-5', '6-10', '11-25', '26-100', '101-1000', '> 1000']

// var legend = d3
//   .legendColor()
//   .labels(function(d) {
//     return labels[d.i]
//   })
//   .shapePadding(4)
//   .scale(colorScale)
// svg.select('.legendThreshold').call(legend)

// NEW LEGEND
// var quantize = d3
//   .scaleQuantize()
//   .domain([0, 0.15])
//   .range(
//     d3.range(9).map(function(i) {
//       return 'q' + i + '-9'
//     })
//   )

// svg
//   .append('g')
//   .attr('class', 'legendQuant')
//   .attr('transform', 'translate(20,20)')

// var legend = d3
//   .legendColor()
//   .labelFormat(d3.format('.2f'))
//   .useClass(true)
//   .title('A really long title')
//   .titleWidth(100)
//   .scale(quantize)

// svg.select('.legendQuant').call(legend)

// read in the data

var promises = [
  d3.json('https://enjalot.github.io/wwsd/data/world/world-110m.geojson'),
  d3.csv(require('./data/dataformap.csv'), function(d) {
    data.set(d.id, +d.YR2018)
  })
]

Promise.all(promises).then(ready)

function ready([json]) {
  // console.log(json)
  // console.log(json.features)

  svg
    .append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(json.features)
    .enter()
    .append('path')
    .attr('fill', function(d) {
      if (d) {
        return colorScale((d.YR2018 = data.get(d.id)))
      } else {
        return '#ccc'
      }
    })
    // .style(
    //   'fill',
    //   d => (d ? colorScale((d.YR2018 = data.get(d.id))) : 'white')
    // )
    .attr('d', path)
    .attr('stroke', '#888888')
    .attr('stroke-width', 0.5)
}
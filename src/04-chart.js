import * as d3 from 'd3'
import { nest } from 'd3-collection';

var margin = {
  top: 50,
  right: 20,
  bottom: 30,
  left: 20,
}

let height = 700 - margin.top - margin.bottom

let width = 1000 - margin.left - margin.right

let svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(0,0)')

var radiusScale = d3.scaleSqrt().domain([0, 3000]).range([2, 100])

var colorScale = d3.scaleSqrt().domain([0, 200]).range(['#E5D4F3', '#b379ce'])

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

var forceXSeparate = d3
  .forceX(function (d) {
    if (d.Region === 'North America') {
      return 280
    } else if (d.Region === 'South Asia') {
      return 480
    } else if (d.Region === 'Latin America & Caribbean') {
      return 700
    } else if (d.Region === 'Middle East & North Africa') {
      return 280
    } else if (d.Region === 'Europe & Central Asia') {
      return 480
    } else if (d.Region === 'East Asia & Pacific') {
      return 700
    } else if (d.Region === 'Sub-Saharan Africa') {
      return 280
    }
  })
  .strength(0.1)

var forceYSeparate = d3
  .forceY(function (d) {
    if (d.Region === 'North America') {
      return 200
    } else if (d.Region === 'South Asia') {
      return 200
    } else if (d.Region === 'Latin America & Caribbean') {
      return 500
    } else if (d.Region === 'Middle East & North Africa') {
      return 500
    } else if (d.Region === 'Europe & Central Asia') {
      return 200
    } else if (d.Region === 'East Asia & Pacific') {
      return 200
    } else if (d.Region === 'Sub-Saharan Africa') {
      return 500
    }
  })
  .strength(0.1)

var forceXCombine = d3.forceX(width / 2).strength(0.08)
var forceYCombine = d3.forceY(height / 2).strength(0.08)

var forceCollide = d3
  .forceCollide((d) => radiusScale(d.Adolescent_Fertility_Rate) + 5)
  .strength(1)
var forceCharge = d3.forceManyBody().strength(-15)

var simulation = d3
  .forceSimulation()
  .force('x', forceXCombine)
  .force('y', forceYCombine)
  .force('collide', forceCollide)
  .force('charge', forceCharge)

d3.csv(require('./data/Regions.1612449415590.csv'))
  .then(ready)
  .catch((err) => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(datapoints)22

  datapoints.forEach((d) => {
    // console.log(d)
    d.Adolescent_Fertility_Rate = +d.Adolescent_Fertility_Rate
  })

  var nested = d3
    .nest()
    .key(function (d) {
      return d.Region
    })
    .entries(datapoints)

  // make a list of Arab spring countries
  var arabSpring = [
    'Angola',
    'Benin',
    'Botswana',
    'Burkina Faso',
    'Burundi',
    'Cameroon',
    'Cape Verde',
    'Central African Republic',
    'Chad',
    'Comoros',
    'Democratic Republic of the Congo',
    'Equatorial Guinea',
    'Eritrea',
    'Ethiopia',
    'Gabon',
    'Gambia',
    'Ghana',
    'Guinea',
    'Guinea Bissau',
    'Ivory Coast',
    'Kenya',
    'Lesotho',
    'Liberia',
    'Madagascar',
    'Malawi',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Mozambique',
    'Namibia',
    'Niger',
    'Nigeria',
    'Republic of Congo',
    'Rwanda',
    'Sao Tome and Principe',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Sudan',
    'Swaziland',
    'Togo',
    'Uganda',
    'United Republic of Tanzania',
    'Zambia',
    'Zimbabwe',
  ]

  var topData = [
    'Niger',
    'Mali',
    'Chad',
    'Liberia',
    'Mozambique',
    'Angola',
    'Equatorial Guinea',
    'Guinea',
    'Malawi',
    'Central African Republic',
  ]

  var circles = svg
    .selectAll('.countries')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', (d) => radiusScale(d.Adolescent_Fertility_Rate))
    .attr('opacity', 0.95)
    .attr('class', (d) => {
      // console.log(d.ADMIN.toLowerCase().replace(/[^a-z]*/g, ''))
      return d.ADMIN.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .classed('countries', true)
    .attr('id', function (d, i) {
      return 'country' + i
    })
    .classed('niger', (d) => {
      // console.log(d)
      if (d.ADMIN === 'Niger') {
        return true
      }
    })
    .classed('mali', (d) => {
      // console.log(d)
      if (d.ADMIN === 'Mali') {
        return true
      }
    })
    .classed('arab-spring', (d) => {
      if (arabSpring.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    .classed('top-ten', (d) => {
      if (topData.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    .attr('fill', (d) => colorScale(d.Adolescent_Fertility_Rate))
    .on('mousemove', function (d) {
      div
        .html(d.ADMIN + '<br>' + d.Adolescent_Fertility_Rate.toLocaleString())
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
        .style('display', 'block')
    })
    .on('mouseover', function (d, i) {
      div.transition().style('opacity', 0.9)
      div
        .html(d.ADMIN + '<br>' + d.Adolescent_Fertility_Rate.toLocaleString())
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
      d3.select('#country' + i)
        .transition()
        .style('stroke', 'white')
        .style('stroke-width', 2.5)
    })
    .on('mouseout', function (d, i) {
      div.transition().style('opacity', 0)
      d3.select('#country' + i)
        .transition()
        .style('stroke', 'none')
        .style('stroke-width', 0)
    })

  svg
    .selectAll('.continent-label')
    .data(nested)
    .enter()
    .append('text')
    .text((d) => d.key)
    .attr('font-size', 18)
    .attr('font-weight', 500)
    .attr('class', 'continent-label')
    .attr('x', function (d) {
      if (d.Region === 'North America') {
        return 250
      } else if (d.Region === 'South Asia') {
        return 500
      } else if (d.Region === 'Latin America & Caribbean') {
        return 750
      } else if (d.Region === 'Middle East & North Africa') {
        return 250
      } else if (d.Region === 'Europe & Central Asia') {
        return 500
      } else if (d.Region === 'East Asia & Pacific') {
        return 750
      } else if (d.Region === 'Sub-Saharan Africa') {
        return 250
      }
    })
    .attr('y', function (d) {
      if (d.Region === 'North America') {
        return 0
      } else if (d.Region === 'South Asia') {
        return 0
      } else if (d.Region === 'Latin America & Caribbean') {
        return 0
      } else if (d.Region === 'Middle East & North Africa') {
        return 0
      } else if (d.Region === 'Europe & Central Asia') {
        return 0
      } else if (d.Region === 'East Asia & Pacific') {
        return 0
      } else if (d.Region === 'Sub-Saharan Africa') {
        return 0
      }
    })
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .attr('opacity', 0.7)
    .attr('visibility', 'hidden')

  // add text-label on each circle
  var nodeText = svg
    .selectAll('.countries-label')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'countries-label')
    .text(function (d) {
      return d.ADMIN + '\n' + d.Adolescent_Fertility_Rate.toLocaleString()
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('fill', 'white')
    .classed('niger-label', (d) => {
      // console.log(d)
      if (d.ADMIN === 'Niger') {
        return true
      }
    })
    .classed('mali-label', (d) => {
      // console.log(d)
      if (d.ADMIN === 'Mali') {
        return true
      }
    })
    .classed('arab-spring-label', (d) => {
      if (arabSpring.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    .classed('top-ten-label', (d) => {
      if (topData.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    .style('visibility', 'hidden')

  simulation.nodes(datapoints).on('tick', ticked)

  function ticked() {
    circles
      .attr('cx', function (d) {
        // console.log(d)
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
    nodeText
      .attr('x', function (d) {
        // console.log(d)
        return d.x
      })
      .attr('y', function (d) {
        return d.y
      })
  }

  svg
    .selectAll('.legend-entry')
    .append('text')
    .text('legend')
    .attr('x', 300)
    .attr('y', 200)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')

  d3.select('#origin').on('stepin', () => {
    svg
      .selectAll('.countries')
      .attr('fill', (d) => colorScale(d.Adolescent_Fertility_Rate))
    svg.selectAll('.countries-label').style('visibility', 'hidden')
    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to Asia
  d3.select('#asia').on('stepin', () => {
    svg
      .selectAll('.arab-spring')
      .transition()
      .attr('fill', (d) => colorScale(d.Adolescent_Fertility_Rate))
    svg.selectAll('.niger').transition().attr('fill', '#f7545d')
    svg.selectAll('.mali').transition().attr('fill', '#f7545d')
    svg
      .selectAll('.arab-spring-label')
      .transition()
      .style('visibility', 'hidden')
    svg
      .selectAll('.mali-label')
      .transition()
      .style('visibility', 'visible')
      .transition()

    svg.selectAll('.continent-label').transition().style('visibility', 'hidden')

    svg.selectAll('.niger-label').style('visibility', 'visible')
    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      // .force('charge', d3.forceManyBody().strength(-15))
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to Arab spring
  d3.select('#arab-spring').on('stepin', () => {
    // console.log('I scroll down to arab spring')
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', (d) => colorScale(d.Adolescent_Fertility_Rate))
    svg.selectAll('.arab-spring').transition().attr('fill', '#f7545d')
    svg.selectAll('.countries-label').transition().style('visibility', 'hidden')
    svg
      .selectAll('.arab-spring-label')
      .transition()
      .style('visibility', 'visible')

    svg.selectAll('.continent-label').transition().style('visibility', 'hidden')

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to separate bubbles based on continent
  d3.select('#split').on('stepin', () => {
    // console.log('I scroll down to separate step')
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', (d) => colorScale(d.Adolescent_Fertility_Rate))
    svg.selectAll('.countries-label').style('visibility', 'hidden')

    svg
      .selectAll('.continent-label')
      .transition()
      .style('visibility', 'visible')

    simulation
      .force('x', forceXSeparate)
      .force('y', forceYSeparate)
      // .force('charge', forceCharge)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to show top ten countries in different continent
  d3.select('#split-highlight').on('stepin', () => {
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', (d) => colorScale(d.Adolescent_Fertility_Rate))
    svg.selectAll('.top-ten').transition().attr('fill', '#f7545d')
    svg.selectAll('.top-ten-label').transition().style('visibility', 'visible')
  })
}

function convertToLocaleString(val) {
  try {
    return val.toLocaleString()
  } catch (error) {
    return null
  }
}

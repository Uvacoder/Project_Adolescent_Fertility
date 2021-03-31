import * as d3 from 'd3'
import { nest } from 'd3-collection';

var margin = {top: 20, right: 5, bottom: 20, left: -15}

let height = 720 - margin.top - margin.bottom

let width = 1200 - margin.left - margin.right

let svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radiusScale = d3.scaleSqrt().domain([0, 5000]).range([2, 100])

var color = d3.scaleSequential(d3.interpolateMagma)
.domain([0, 190])

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

var forceXSeparate = d3
  .forceX(function (d) {
    if (d.Region === 'Sub-Saharan Africa') {
      return 280
    } else if (d.Region === 'Latin America & Caribbean') {
      return 500
    } else if (d.Region === 'Middle East & North Africa') {
      return 720
    } else if (d.Region === 'South Asia') {
      return 420
    } else if (d.Region === 'Europe & Central Asia') {
      return 600
    } else if (d.Region === 'East Asia & Pacific') {
      return 780
    } else if (d.Region === 'North America') {
      return 280
     }
  })
  .strength(0.1)

var forceYSeparate = d3
  .forceY(function (d) {
    if (d.Region === 'Sub-Saharan Africa') {
      return 200
    } else if (d.Region === 'Latin America & Caribbean') {
      return 200
    } else if (d.Region === 'Middle East & North Africa') {
      return 200
    } else if (d.Region === 'South Asia') {
      return 500
    } else if (d.Region === 'Europe & Central Asia') {
      return 500
    } else if (d.Region === 'East Asia & Pacific') {
      return 500
    } else if (d.Region === 'North America') {
      return 500
     }
  })
  .strength(0.1)

var forceXCombine = d3.forceX(width / 2).strength(0.10)
var forceYCombine = d3.forceY(height / 2).strength(0.10)

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

d3.csv(require('./data/allcontinentdata.csv'))
  .then(ready)
  .catch((err) => console.log('Failed on', err))

function ready(datapoints) {

  datapoints.forEach((d) => {
    d.Adolescent_Fertility_Rate = +d.Adolescent_Fertility_Rate
  })

  var nested = nest()
    .key(function (d) {
      return d.Region
    })
    .entries(datapoints)



  // make a list of Arab spring countries
  var arabSpring = [
    'Mozambique',
    'Niger',
    'Mali',
    'Chad',
    'Liberia',
    'Angola',
    'Equatorial Guinea',
    'Guinea',
    'Malawi',
    'Central African Republic',
    'Democratic Republic of the Congo',
    'Zambia',
    'United Republic of Tanzania',
    'Uganda',
    'Republic of Congo',
    'Sierra Leone',
    'Madagascar',
    'Nigeria',
    'Guinea Bissau',
    'Cameroon',
    'Burkina Faso',
    'Ivory Coast'
  ]

  var topData = [
    'Zimbabwe',
    'Zambia',
    'Yemen Rep',
    'West Bank and Gaza',
    'Venezuela',
    'Uruguay',
    'Uganda',
    'Togo',
    'Tanzania',
    'Tajikistan',
    'Suriname',
    'Sudan',
    'South Sudan',
    'South Africa',
    'Somalia',
    'Solomon Islands',
    'Sierra Leone',
    'Seychelles',
    'Senegal',
    'Sao Tome and Principe',
    'Philippines',
    'Peru',
    'Paraguay',
    'Papua New Guinea',
    'Panama',
    'Nigeria',
    'Niger',
    'Nicaragua',
    'Nepal',
    'Namibia',
    'Mozambique',
    'Mexico',
    'Mauritania',
    'Mali',
    'Malawi',
    'Madagascar',
    'Liberia',
    'Lesotho',
    'Lao PDR',
    'Kenya',
    'Jamaica',
    'Iraq',
    'Honduras',
    'Haiti',
    'Guyana',
    'Guinea-Bissau',
    'Guinea',
    'Guatemala',
    'Ghana',
    'The Gambia',
    'Gabon',
    'Ethiopia',
    'Eswatini',
    'Eritrea',
    'Equatorial Guinea',
    'El Salvador',
    'Egypt',
    'Ecuador',
    'Dominican Republic',
    'Cuba',
    'Ivory Coast',
    'Costa Rica',
    'Democratic Republic of Congo',
    'Republic of Congo',
    'Comoros',
    'Colombia',
    'Chad',
    'Central African Republic',
    'Cameroon',
    'Cambodia',
    'Cabo Verde',
    'Burundi',
    'Burkina Faso',
    'Brazil',
    'Bolivia',
    'Benin',
    'Belize',
    'Bangladesh',
    'Azerbaijan',
    'Argentina',
    'Angola',
    'Afghanistan']

  var circles = svg
    .selectAll('.countries')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', (d) => radiusScale(d.Adolescent_Fertility_Rate))
    .style('opacity', .95)
    .attr('class', (d) => {
      return d.ADMIN
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
    .classed('Korea', (d) => {
      // console.log(d)
      if (d.ADMIN === 'Democratic People’s Republic of Korea') {
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
    .attr('fill', d => color(d.Adolescent_Fertility_Rate))
    .on('mousemove', function(d, i) {
      div
        .html(i.ADMIN + '<br>' + 'Adolescent fertility rate: '+ convertToLocaleString(i.Adolescent_Fertility_Rate) +' per 1,000 women (ages 15-19)')//.toLocaleString())
        .style('left', d.pageX + 'px')
        .style('top', d.pageY - 28 + 'px')
        .style('display', 'block')
        .attr("dy", "-1em")
        .style("fill", "#000000")
        .style("font-size", "small")
        .attr("text-anchor", "middle")
    })
    .on('mouseover', function(d, i) {
      div.transition().style('opacity', 0.9)
      div
        .html(i.ADMIN + '<br>' + 'Adolescent fertility rate: '+ convertToLocaleString(i.Adolescent_Fertility_Rate) +' per 1,000 women (ages 15-19)')//.toLocaleString())
        .style('left', d.pageX + 'px')
        .style('top', d.pageY - 28 + 'px')
        .attr("dy", "-1em")
        .style("fill", "#000000")
        .style("font-size", "small")
        .attr("text-anchor", "middle")

      d3.select('#country' + i)
        .transition()
        .style('stroke', 'white')
        .style('stroke-width', 2.5)
    })
    .on('mouseout', function(d, i) {
      div.transition().style('opacity', 0)
      d3.select('#country' + i)
        .transition()
        .style('stroke', 'none')
        .style('stroke-width', 0)
    })

  svg
    .selectAll('.region-label')
    .data(nested)
    .enter()
    .append('text')
    .text((d) => d.key)
    .attr('font-size', 15)
    .attr('font-weight', 300)
    .attr('fill', '#000000')
    .attr('class', 'region-label')
    .attr('x', function (d) {
      if (d.key === 'Sub-Saharan Africa') {
        return 250
      } else if (d.key === 'Latin America & Caribbean') {
        return 500
      } else if (d.key === 'Middle East & North Africa') {
        return 750
      } else if (d.key === 'South Asia') {
        return 400
      } else if (d.key === 'Europe & Central Asia') {
        return 600
      } else if (d.key === 'East Asia & Pacific') {
        return 800
      } else if (d.key === 'North America') {
        return 230
       }
    })
    .attr('y', function (d) {
      if (d.Region === 'Sub-Saharan Africa') {
        return 0
      } else if (d.key === 'Latin America & Caribbean') {
        return 0
      } else if (d.key === 'Middle East & North Africa') {
        return 0
      } else if (d.key === 'South Asia') {
        return 400
      } else if (d.key === 'Europe & Central Asia') {
        return 400
      } else if (d.key === 'East Asia & Pacific') {
        return 400
      } else if (d.key === 'North America') {
        return 400
       }
    })
    .attr('fill', '#000000')
    .attr('text-anchor', 'middle')
    .attr('visibility', 'hidden')

  // add text-label on each circle
  var nodeText = svg
    .selectAll('.ADMIN-label')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'ADMIN-label')
    .text(function (d) {
      return d.ADMIN
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('fill', '#000000')
    .classed('niger-label', (d) => {
      if (d.ADMIN === 'Niger') {
        return true
      }
    })
    .classed('Korea-label', (d) => {
      if (d.ADMIN === 'Democratic People’s Republic of Korea') {
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
    svg.selectAll('.countries').attr('fill', d => color(d.Adolescent_Fertility_Rate))
    svg.selectAll('.ADMIN-label').style('visibility', 'hidden')
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
      .attr('fill', (d) => color(d.Adolescent_Fertility_Rate))
    svg.selectAll('.niger').transition()
    svg.selectAll('.Democratic People’s Republic of Korea').transition()
    svg
      .selectAll('.arab-spring-label')
      .transition()
      .style('visibility', 'hidden')
    svg
      .selectAll('.Korea-label')
      .transition()
      .style('visibility', 'visible')
      .transition()

    svg.selectAll('.region-label').transition().style('visibility', 'hidden')

    svg.selectAll('.niger-label').transition().style('visibility', 'visible')
    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to Arab spring
  d3.select('#arab-spring').on('stepin', () => {
    // console.log('I scroll down to arab spring')
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', (d) => color(d.Adolescent_Fertility_Rate))
    svg.selectAll('.arab-spring').transition()
    svg.selectAll('.ADMIN-label').transition().style('visibility', 'hidden')
    svg
      .selectAll('.arab-spring-label')
      .transition()
      .style('visibility', 'visible')

    svg.selectAll('.region-label').transition().style('visibility', 'hidden')

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
      .attr('fill', (d) => color(d.Adolescent_Fertility_Rate))
    svg.selectAll('.ADMIN-label').style('visibility', 'hidden')

    svg
      .selectAll('.region-label')
      .transition()
      .style('visibility', 'visible')

    simulation
      .force('x', forceXSeparate)
      .force('y', forceYSeparate)
      // .force('charge', forceCharge)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to show top ten countries in different regions
  d3.select('#split-highlight').on('stepin', () => {
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', (d) => color(d.Adolescent_Fertility_Rate))
    svg.selectAll('.top-ten').transition()
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
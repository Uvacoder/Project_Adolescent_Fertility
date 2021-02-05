import * as d3 from 'd3'
import {nest} from 'd3-collection';

var margin = {
  top: 50,
  right: 20,
  bottom: 30,
  left: 20
}

let height = 700 - margin.top - margin.bottom

let width = 1000 - margin.left - margin.right

let svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', 'translate(0,0)')
var radiusScale = d3
  .scaleSqrt()
  .domain([0, 3000])
  .range([2, 100])

var colorScale = d3
  .scaleSqrt()
  .domain([0, 200])
  .range(['#E5D4F3', '#b379ce'])

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

var forceXSeparate = d3
  .forceX(function(d) {
    if (d.Region === 'Europe & Central Asia') {
      // console.log(d.continent)
      return 280
    } else if (d.Region === 'Sub-Saharan Africa') {
      // console.log(d.continent)
      return 480
    }
  })
  .strength(0.1)

var forceYSeparate = d3
  .forceY(function(d) {
    if (d.Region === 'Europe & Central Asia') {
      return 200
    } else if (d.Region === 'Sub-Saharan Africa') {
      return 200
    }
  })
  .strength(0.1)

var forceXCombine = d3.forceX(width / 2).strength(0.08)
var forceYCombine = d3.forceY(height / 2).strength(0.08)

var forceCollide = d3.forceCollide(d => radiusScale(d.Adolescent_Fertility_Rate) + 5).strength(1)
var forceCharge = d3.forceManyBody().strength(-15)

var simulation = d3
  .forceSimulation()
  .force('x', forceXCombine)
  .force('y', forceYCombine)
  .force('collide', forceCollide)
  .force('charge', forceCharge)

d3.csv(require('/data/all.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  console.log(datapoints)

  datapoints.forEach(d => {
    // console.log(d)
    d.Adolescent_Fertility_Rate = +d.Adolescent_Fertility_Rate
  })

  var nested = nest()
    .key(function(d) {
      return d.Region
    })
    .entries(datapoints)

  // make a list of Sub Saharan Countries
  var Africa= [
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
'Zimbabwe'
  ]

var Europe_Central= [
'Albania',
'Armenia',
'Austria',
'Azerbaijan',
'Belarus',
'Belgium',
'Bosnia and Herzegovina',
'Bulgaria',
'Croatia',
'Cyprus',
'Czech Republic',
'Denmark',
'Estonia',
'Faroe Islands',
'Finland',
'France',
'Georgia',
'Germany',
'Gibraltar',
'Greece',
'Hungary',
'Iceland',
'Ireland',
'Isle of Man',
'Italy',
'Kazakhstan',
'Kyrgyzstan',
'Latvia',
'Liechtenstein',
'Lithuania',
'Luxembourg',
'Macedonia',
'Moldova',
'Monaco',
'Montenegro',
'Netherlands',
'Norway',
'Poland',
'Portugal',
'Republic of Serbia',
'Romania',
'Russia',
'San Marino',
'Slovakia',
'Slovenia',
'Spain',
'Sweden',
'Switzerland',
'Tajikistan',
'Turkey',
'Turkmenistan',
'Ukraine',
'United Kingdom',
'Uzbekistan'
  ]

var topData= 
[
'Niger',
'Mali',
'Chad',
'Liberia',
'Mozambique',
'Angola',
'Equatorial Guinea',
'Guinea',
'Malawi',
'Central African Republic'
]

  var circles = svg
    .selectAll('.countries')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d.Adolescent_Fertility_Rate))
    .attr('opacity', 0.95)
    .attr('class', d => {
      // console.log(d.ADMIN.toLowerCase().replace(/[^a-z]*/g, ''))
      return d.ADMIN.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .classed('countries', true)
    .attr('id', function(d, i) {
      return 'country' + i
    })
    .classed('niger', d => {
      // console.log(d)
      if (d.ADMIN === 'Niger') {
        return true
      }
    })
    .classed('chad', d => {
      // console.log(d)
      if (d.ADMIN === 'Chad') {
        return true
      }
    })
    .classed('Africa_', d => {
      if (Africa.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    .classed('top-ten', d => {
      if (topData.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    .attr('fill', d => colorScale(d.Adolescent_Fertility_Rate))
    .on('mousemove', function(d, i) {
      div
        .html(i.ADMIN + '<br>' + convertToLocaleString(i.Adolescent_Fertility_Rate))//.toLocaleString())
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
        .html(i.ADMIN + '<br>' + convertToLocaleString(i.Adolescent_Fertility_Rate)) //.toLocaleString())
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
    .selectAll('.continent-label')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('font-size', 18)
    .attr('font-weight', 500)
    

    .attr('x', function(d) {
      if (d.key === 'Europe & Central Asia') {
        // console.log(d.key)
        return 250
      } else if (d.key === 'Sub-Saharan Africa') {
        // console.log(d.key)
        return 500
      }
    })
    .attr('y', function(d) {
      if (d.key === 'Europe & Central Asia') {
        return 0
      } else if (d.key === 'Sub-Saharan Africa') {
        return 0
      }
    })
    
    .attr("dy", "-1em")
    .style("fill", "#000000")
    .style("font-size", "small")
    .attr("text-anchor", "middle")

    .attr('opacity', 0.7)
    // .attr('visibility', 'hidden')

  // add text-label on each circle
  var nodeText = svg
    .selectAll('.countries-label')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'countries-label')
    .text(function(d) {
      return d.ADMIN + '\n' + convertToLocaleString(d.Adolescent_Fertility_Rate) //.toLocaleString()
    })
    .attr("dy", "-1em")
    .style("fill", "#000000")
    .style("font-size", "small")
    .attr("text-anchor", "middle")


    .classed('Niger-label', d => {
      // console.log(d)
      if (d.ADMIN === 'Niger') {
        return true
      }
    })
    .classed('Chad-label', d => {
      // console.log(d)
      if (d.ADMIN === 'Chad') {
        return true
      }
    })
    .classed('Africa-label', d => {
      if (Africa.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    .classed('top-ten-label', d => {
      if (topData.indexOf(d.ADMIN) !== -1) {
        return true
      }
    })
    // .style('visibility', 'hidden')

  simulation.nodes(datapoints).on('tick', ticked)

  function ticked() {
    circles
      .attr('cx', function(d) {
        // console.log(d)
        return d.x
      })
      .attr('cy', function(d) {
        return d.y
      })
    nodeText
      .attr('x', function(d) {
        // console.log(d)
        return d.x
      })
      .attr('y', function(d) {
        return d.y
      })
  }


  svg
    .selectAll('.legend-entry')
    .append('text')
    .text('legend')
    .attr('x',300)
    .attr('y',200)
    .attr('fill','black')
    .attr('text-anchor', 'middle')

  d3.select('#origin').on('stepin', () => {
    // console.log('I scroll back')
    svg.selectAll('.countries').attr('fill', d => colorScale(d.Adolescent_Fertility_Rate))
    // svg.selectAll('.countries-label').style('visibility', 'hidden')
    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to Africa
  d3.select('#Africa').on('stepin', () => {
    // console.log('I scroll down to Africa')
    svg
      .selectAll('.Africa_')
      .transition()
      .attr('fill', d => colorScale(d.Adolescent_Fertility_Rate))
    svg
      .selectAll('.niger')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.chad')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.Africa-label')
      .transition()
      // .style('visibility', 'hidden')
    svg
      .selectAll('.Chad-label')
      .transition()
      .style('visibility', 'visible')
      .transition()

    svg
      .selectAll('.continent-label')
      .transition()
      // .style('visibility', 'hidden')

    svg.selectAll('.niger-label').style('visibility', 'visible')
    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      // .force('charge', d3.forceManyBody().strength(-15))
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to Asia
  d3.select('#Asia').on('stepin', () => {
    // console.log('I scroll down to Asia')
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', d => colorScale(d.Adolescent_Fertility_Rate))
    svg
      .selectAll('.Africa_')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.countries-label')
      .transition()
      // .style('visibility', 'hidden')
    svg
      .selectAll('.Africa-label')
      .transition()
      // .style('visibility', 'visible')

    svg
      .selectAll('.continent-label')
      .transition()
      .style('visibility', 'hidden')

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      // .force('collide', forceCollide)
      // .force('charge', d3.forceManyBody().strength(-15))
      .alphaTarget(0.25)
      .restart()
  })

  // scroll to separate bubbles based on continent
  d3.select('#split').on('stepin', () => {
    // console.log('I scroll down to separate step')
    svg
      .selectAll('.countries')
      .transition()
      .attr('fill', d => colorScale(d.Adolescent_Fertility_Rate))
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
      .attr('fill', d => colorScale(d.Adolescent_Fertility_Rate))
    svg
      .selectAll('.top-ten')
      .transition()
      .attr('fill', '#f7545d')
    svg
      .selectAll('.top-ten-label')
      .transition()
      .style('visibility', 'visible')
  })
}

function convertToLocaleString(val) {
  try {
    return val.toLocaleString()   
  } catch (error) {
    return null
  }
}
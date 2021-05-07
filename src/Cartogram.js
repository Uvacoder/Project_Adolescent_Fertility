import * as d3 from 'd3'
import { nest } from 'd3-collection'
import * as topojson from 'topojson'
import legend from 'd3-svg-legend';

var plants = {},
	startYear = 1960,
	endYear = 2018,
    currentYear = startYear;

 var width = 1200,
     height = 500;
//var width = window.innerWidth-100,
//  height = window.innerHeight-100;

var projection = d3.geoEqualEarth()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

var colorScale = d3.scaleSequential(d3.interpolateMagma).domain([0, max])


var g = svg.append("g");

g.append( "rect" )
  .attr("width",width)
  .attr("height",height)
  .attr("fill","white")
  .attr("opacity",0)
  .on("mouseover",function(){
    hoverData = null;
    if ( probe ) probe.style("display","none");
  })

queue()
    .defer(d3.json, ('https://enjalot.github.io/wwsd/data/world/world-110m.geojson'))
    .defer(d3.csv, "mapdata.csv")
    .await(ready);

function ready(error, us, sequence) {
  if (error) throw error;

	svg.append("path")
      .attr("class", "countries")
      .datum(topojson.feature(countries, world.objects.countries))
      .attr("d", path);
      
      
      .on("mouseover", function(d) {
						div.transition()
								.style("left", (d3.event.pageX + 10) + "px")
								.style("top", (d3.event.pageY - 80) + "px")
								.duration(200)
								.style("opacity", .9);
						div.html("<strong>" + d.Country + "</strong><br/>" +
						"<br/>" + d['Income Group'] + ", " + d.state)

				 })
					.on("mouseout", function(d) {
						div.transition()
							 .duration(500)
							 .style("opacity", 0);
						});

		update(currentYear,false)

		d3.select("#slider")
				.call(
					chroniton()
						.domain([new Date(startYear, 1, 1), new Date(endYear, 1, 1)])
						.labelFormat(function(date) {
							return Math.ceil((date.getFullYear()) / 1) * 1;
						})
						.width(600)
						.on('change', function(date) {
							var newYear = Math.ceil((date.getFullYear()) / 1) * 1;
							if (newYear != currentYear) {
									currentYear = newYear;
									// circle
									// 	.remove();
									update(currentYear,true);
							}
						})
						.playButton(true)
						.playbackRate(0.2)
						.loop(true)
				);

		var legend = svg.append("g")
									.attr("id","legend")
									.attr("transform", "translate(" + (width - 260) + "," + (height - 185) + ")");

		legend.append("circle")
					.attr("class","symbol symbol--gain")
					.attr("r",5)
					.attr("cx",5)
					.attr("cy",10);
		legend.append("circle")
					.attr("class","symbol symbol--loss")
					.attr("r",5)
					.attr("cx",5)
					.attr("cy",30);

		legend.append("text").text("Births per 1000 women ages 15-19")
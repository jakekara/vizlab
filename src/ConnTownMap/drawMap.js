var connTowns = require("./shapes/ct-towns.json")
var topojson = require("topojson");
// var d3 = require("d3");

var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-geo"),
);

export default function(config){

    var root = d3.select(config.root).html(""),
    bbox = root.node().getBoundingClientRect(),
    width = bbox.width,
    height = width / 1.65,
    outlineFilter = config.outlineFilter || function(){ return true };

    var svg = root.append("svg")
    .attr("width", width)
    .attr("height", height);
    
    var projection = d3.geoMercator()
    .rotate([72.7, 0, 0])
    .center([0, 41.52])
    .scale(width * 22)
    .translate([width/ 2, height / 2]);;

    var path = d3.geoPath()
    .projection(projection)    

    var towns = svg.selectAll('.town')
        .data(topojson.feature(connTowns, connTowns.objects.towns).features)
        .enter()
        .append('path')
        .classed('town', true)
        .attr('d', path)
        .attr("data-town", function(d){ return d.id})

    // draw the outline of the state
    var state = svg.append("path")
        .style("stroke-width", 2)
        .classed("state", true)
        .attr("d", path(topojson.merge(connTowns, connTowns.objects.towns.geometries.filter(outlineFilter))));

    return { towns, state}
}
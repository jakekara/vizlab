var { connTowns } = require("./shapes");
var topojson = require("topojson");
// var d3 = require("d3");

var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-geo"),
);

function getPath(width, height){
    var projection = d3.geoMercator()
    .rotate([72.7, 0, 0])
    .center([0, 41.52])
    .scale(width * 22)
    .translate([width / 2, height / 2]);;

    var path = d3.geoPath()
        .projection(projection);

    return path
}

function drawConnMapBase(rootID) {

    var root = d3.select(rootID).html(""),
        bbox = root.node().getBoundingClientRect(),
        width = bbox.width,
        height = width / 1.65,
        svg = root.append("svg")
            .attr("width", width)
            .attr("height", height);

    return svg;

}

function addMapLayer(svg, shape) {

}

function addStateOutline(svg) {

    var state = svg.append("g").append("path")
        .style("stroke-width", 2)
        .classed("state", true)
        .attr("d", path(topojson.merge(connTowns.topo, connTowns.obj.geometries)));

}

export default function (config, shape, placeClass) {

    var root = d3.select(config.root),
        bbox = root.node().getBoundingClientRect(),
        width = bbox.width,
        height = width / 1.65,
        svg = config.svg || root.append("svg")
            .attr("width", width)
            .attr("height", height),
        g = svg.append("g"),
        outlineFilter = config.outlineFilter || function () { return true };

    // shape defaults to towns, but can be overriden witha anything 
    // exported from ./shapes
    var topology = shape.topo || connTowns,
        featureObject = shape.obj || connTowns.objects.towns;

    var projection = d3.geoMercator()
        .rotate([72.7, 0, 0])
        .center([0, 41.52])
        .scale(width * 22)
        .translate([width / 2, height / 2]);;

    var path = d3.geoPath()
        .projection(projection)

    var places = g.selectAll('.sub-state')
        // .data(topojson.feature(connTowns, connTowns.objects.towns).features)
        .data(topojson.feature(topology, featureObject).features)
        .enter()
        .append('path')
        .classed('sub-state', true)
        .classed(placeClass, true)
        .attr('d', path)
        .attr("data-place", function (d) { return d.id })

    // draw the outline of the state
    var state = g.append("path")
        .style("stroke-width", 2)
        .classed("state", true)
        .attr("d", path(topojson.merge(connTowns.topo, connTowns.obj.geometries.filter(outlineFilter))));

    return { places, state, svg }
}

import ThrottledViz  from "../ThrottledViz";
import "./style/main.scss";

var connTowns = require("./shapes/ct_towns.json");
var topojson = require("topojson");

var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-geo"),
);

// var d3 = Object.assign({},
//     require("d3-selection"),
//     require("d3-geo"));

class ConnTownMap extends ThrottledViz {

    constructor(data, config){
        super(data, config);
        this.draw = this.draw.bind(this);
        this.draw();
    }

    draw(){
        var root = d3.select("#root").html(""),
        bbox = root.node().getBoundingClientRect(),
        width = bbox.width,
        height = width / 1.65;
    
        var svg = d3.select("#root").append("svg")
        .attr("width", width)
        .attr("height", height);
        
        var projection = d3.geoMercator()
        .rotate([72.7, 0, 0])
        .center([0, 41.52])
        .scale(width * 22)
        .translate([width/ 2, height / 2]);;
    
        var path = d3.geoPath()
        .projection(projection)    
    
        this.towns = svg.selectAll('.town')
            .data(topojson.feature(connTowns, connTowns.objects.ct_towns_s).features)
            .enter()
            .append('path')
            .attr('class', 'town')
            .attr('d', path)
            .attr("data-town", function(d){ return d.id})
    
    }
}

export {ConnTownMap};
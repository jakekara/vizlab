"use strict";
import ThrottledViz  from "../ThrottledViz";
import "./style/main.scss";
import drawMap from "./drawMap";

class ConnTownMap extends ThrottledViz {

    constructor(data, config){
        super(data, config);
        this.draw = this.draw.bind(this);
        this.draw();
    }

    draw(){
        console.log("Drawing ConnTownMap");
        var config = this.config;
        config.root = config.root || "#root";
        var {towns, state} = drawMap(this.config);
        this.towns = towns;
        this.state = state;
        (this.config.drawCallback || function(){})();

    }

    // draw(){
    //     var root = d3.select("#root").html(""),
    //     bbox = root.node().getBoundingClientRect(),
    //     width = bbox.width,
    //     height = width / 1.65,
    //     outlineFilter = this.config.outlineFilter || function(){ return true };
    
    //     var svg = d3.select("#root").append("svg")
    //     .attr("width", width)
    //     .attr("height", height);
        
    //     var projection = d3.geoMercator()
    //     .rotate([72.7, 0, 0])
    //     .center([0, 41.52])
    //     .scale(width * 22)
    //     .translate([width/ 2, height / 2]);;
    
    //     var path = d3.geoPath()
    //     .projection(projection)    
    
    //     this.towns = svg.selectAll('.town')
    //         .data(topojson.feature(connTowns, connTowns.objects["cb_2017_09_cousub_500k"]).features)
    //         .enter()
    //         .append('path')
    //         .classed('town', true)
    //         .attr('d', path)
    //         .attr("data-town", function(d){ return d.id})

    //     // draw the outline of the state
    //     var state = svg.append("path")
    //         .style("stroke-width", 2)
    //         .classed("state", true)
    //         .attr("d", path(topojson.merge(connTowns, connTowns.objects.cb_2017_09_cousub_500k.geometries.filter(outlineFilter))));
    // }
}

export {ConnTownMap};

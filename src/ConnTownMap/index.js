"use strict";
import ThrottledViz from "../ThrottledViz";
import "./style/main.scss";
// import drawMap from "./drawMap";
import shapes from "./shapes";

var topojson = require("topojson");

var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-geo"),
);

class ConnTownLayer {

    constructor() {
        this.shape = shapes.connTowns;
        this.placeClass = "town";
        this.draw = this.draw.bind(this);
    }

    draw(svg, path) {

        this.g = svg.append("g")
            .classed(this.placeClass + "-layer", true)


        var topology = this.shape.topo,
            featureObject = this.shape.obj,
            placeClass = this.placeClass;

        this.places = this.g.selectAll('.sub-state')
            // .data(topojson.feature(connTowns, connTowns.objects.towns).features)
            .data(topojson.feature(topology, featureObject).features)
            .enter()
            .append('path')
            .classed('sub-state', true)
            .classed(placeClass, true)
            .attr('d', path)
            .attr("data-place", function (d) { return d.id });
    }

}

class ConnElemSchoolDistrictLayer extends ConnTownLayer {

    constructor() {
        super();
        this.shape = shapes.connElemDistricts;
        this.placeClass = "elem-district";
        this.draw = this.draw.bind(this);
    }

}

class ConnSecondarySchoolDistrictLayer extends ConnTownLayer {
    constructor() {
        super();
        this.shape = shapes.connSecondaryDistricts;
        this.placeClass = "secondary-district";
        this.draw = this.draw.bind(this);
    }
}

class ConnUnifiedSchoolDistrictLayer extends ConnTownLayer {
    constructor() {
        super();
        this.shape = shapes.connUnifiedDistricts;
        this.placeClass = "unified-district";
        this.draw = this.draw.bind(this);
    }
}


class ConnStateOutlineLayer {

    draw(svg, path) {

        var g = svg.append("g").classed("state-layer", true);

        // draw the outline of the state
        this.places = g.append("path")
            .style("stroke-width", 2)
            .classed("state", true)
            .attr("d", path(topojson.merge(shapes.connTowns.topo, shapes.connTowns.obj.geometries)));
    }
}

class ConnMap extends ThrottledViz {

    constructor(data, config) {
        super(data, config);
        this.draw = this.draw.bind(this);
        this.addLayer = this.addLayer.bind(this);

        // override this in subclass to make maps of other ct things
        // like school districts
        this.shape = shapes.connTowns;
        this.placeClass = "town";
        this.layers = [];
        // this.draw();
    }

    draw() {

        var config = Object.assign({}, this.config);
        config.root = config.root || "#root";

        var root = d3.select(config.root).html(""),
            bbox = root.node().getBoundingClientRect(),
            width = bbox.width,
            height = width / 1.65,
            svg = config.svg || root.append("svg")
                .attr("width", width)
                .attr("height", height);

        var projection = d3.geoMercator()
            .rotate([72.7, 0, 0])
            .center([0, 41.52])
            .scale(width * 22)
            .translate([width / 2, height / 2]);;

        var path = d3.geoPath()
            .projection(projection)

        this.layers.forEach(x => x.draw(svg, path));

        // add the state outline 
        (new ConnStateOutlineLayer()).draw(svg, path);

        (this.config.drawCallback || function () { })();

        // var config = this.config;
        // config.root = config.root || "#root";
        // var { places, state, svg} = drawMap(this.config, this.shape, this.placeClass);
        // this.svg = svg;
        // this.places = places;
        // this.state = state;
        // (this.config.drawCallback || function(){})();

    }

    addLayer(layer){
        this.layers.push(layer);
    }

    // clear() {
    //     if (!this.svg) { return };
    //     this.svg.html("");
    // }

}

export { 
    ConnMap, 
    ConnElemSchoolDistrictLayer, 
    ConnUnifiedSchoolDistrictLayer, 
    ConnSecondarySchoolDistrictLayer, 
    ConnTownLayer };

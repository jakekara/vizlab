/**
 * Add a legend to d3
 */

 import "./css/index.scss";

var d3 = Object.assign({}, require("d3-selection"));

export default class Legend{

    constructor(parentSelection, data, config){
        this.root = parentSelection;
        this.data = data;
        this.config = config;

        this.draw = this.draw.bind(this);
    }


    draw(){

        var legendContainer = this.root.append("div")
        .classed("legend-container", true);

        var data = this.data || [];

        var items = legendContainer.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("div")
        .classed("legend-item", true)
        .each(function(d){ 
            var c = d.class || ""
            d3.select(this).classed(c, true)
        })

        var itemWidgents = items
        .append("div")
        .classed("item-widget", true)

        var itemLabels = items
        .append("div")
        .classed("item-label", true)
        .text(d => d.label)
        
    }


}
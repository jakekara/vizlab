import ThrottledViz  from "../ThrottledViz";
import "./style/main.scss";

var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
    require("d3-array"));

class SegmentedBar extends ThrottledViz {

    constructor(data, config){
        super(data, config);
        this.data = data || [];
        this.config = config || {};
        
        this.draw = this.draw.bind(this);
    }

    draw(){
        // copy the variables I'm going to use into local context so I can keep all the thises in one place
        var config = this.config,
            data = this.data,
            margin = this.config.margin,
            rowLabelKey = this.config.labelKey || "label",
            colors = this.config.colors || ["gray"],
            axisPadding = this.config.axisPadding || 0;


        // set up skeleton of viz
        var root = d3.select("#root").html(""),
        title = root.append("div").classed("title", true).text(config.title || "" ),
        explainer = root.append("div").classed("explainer", true).text(config.explainer || ""),
        vizRoot = root.append("div").classed("viz-root", true),
        byline = root.append("div").classed("byline", true).text(config.byline),
        sourceline = root.append("div").classed("sourceline", true).text(config.sourceline);

        var barHeight = this.data.barHeight || 60,
            height = barHeight * data.length,
            bbox = root.node().getBoundingClientRect(),
            width = bbox.width;
 
        // get the names of the segments of a row
        function rowSegments(_){
            return config.segments;
        }

        // get the sum of a row's segments
        function rowTotal(row){
            var segments = rowSegments(row);
            var i;
            var sum;
            for(i = 0; i < segments.length; i++ ){
                var segment = segments[i];
                sum = (sum || 0) + Number(row[segment] || 0);
            }
            return sum;
        }

        var minVal = function(){
            return Math.min(0,d3.min(data.map(rowTotal)));
        }();

        var maxVal = function(){
            return Math.max(0,d3.max(data.map(rowTotal)));
        }();

        function rowLabel(row){
            return row[rowLabelKey]
        }

        var rowLabels = data.map(rowLabel);

        function rowSegmentArray(row){
            return rowSegments().map(k => row[k]);
        }

        // create scales 
        var xScale = d3.scaleLinear()
        .range([margin.left, width - margin.right])
        .domain([minVal, maxVal]);

        var yScale = d3.scaleBand()
        .domain(rowLabels)
        .range([margin.top, height - margin.bottom])
        .padding(axisPadding)

        // create svg
        var svg = vizRoot.append("svg")
        .attr("height", height + "px")
        .attr("width", width + "px");


        
        // create bar groups
        var barContainer = svg.append("g").classed(".bar-container", true),
        bars = barContainer.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .classed("bar", true)
        .attr("transform",function(_,i){
            return "translate(0," + yScale(rowLabels[i]) + ")";
        });


        // create segments
        var segments = bars.selectAll(".segment")
        .data(function(d){ return rowSegmentArray(d) })
        .enter()
        .append("rect")
        .classed("segment", true)
        .style("fill", function(_,i){ 
            return colors[i % colors.length];})
        .attr("data-segment", function(_, i){ return rowSegments()[i]; })
        .attr("height", yScale.bandwidth())  
        .attr("width", function(d){ return Math.abs(xScale(0) - xScale(d));})  
        .attr("x", function(d, i, arr){ 
            var ret = xScale(0);
            if (d < 0){
                ret = xScale(d)
            }
            var i = i - 1;
            for (i; i >= 0; i--){
                var w = Number(d3.select(arr[i]).attr("width"));
                if (d < 0){ w = 0 - w}
                ret += w;
            }
            return ret;
        });

        // add labels
        var labelGroup = svg.append("g").classed("label-group", true);
        var labels = labelGroup.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .text(function(d, i){ return rowLabels[i]})
        .attr("transform",function(d,i){
            var yOffset = yScale(rowLabels[i]) + yScale.bandwidth() / 2 + d3.select(this).node().getBBox().height / 4;
            var xOffset = xScale(0) + 2;
            if (rowTotal(d) > 0){ 
                xOffset = xScale(0) - 2 - d3.select(this).node().getBBox().width;
            }
            return "translate(" + xOffset +"," + yOffset + ")";
        });

        // add xAxis
        var xAxis = d3.axisBottom(xScale)
        .tickSize(height - margin.bottom - margin.top)
        var xAxisGroup = svg.append("g").classed("x-axis-group", true)
        .attr("transform","translate(0," + margin.top + ")")
        .call(xAxis);
    }
    
}

export {SegmentedBar};
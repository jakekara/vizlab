import ThrottledViz from "../ThrottledViz";
import Legend from "../Legend";
import "./style/main.scss";

var numeral = require("numeraljs");

var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
    require("d3-array"));

class SegmentedBar extends ThrottledViz {

    constructor(data, config) {
        super(data, config);
        this.data = data || [];
        this.config = config || {};
        this.config.margin = {
            top: 0,
            left: 1,
            right: 1,
            bottom: 0
        }

        this.draw = this.draw.bind(this);
    }

    draw() {
        // copy the variables I'm going to use into local context so I can keep all the thises in one place
        var config = this.config,
            data = this.data,
            margin = this.config.margin,
            rowLabelKey = config.labelColumn || "label",
            columnOptions = config.columnOptions || {},
            colors = this.config.colors || ["gray"],
            axisPadding = this.config.axisPadding || 0;


        // set up skeleton of viz
        var root = d3.select("#root").html(""),
            title = root.append("div").classed("title", true).text(config.title || ""),
            explainer = root.append("div").classed("explainer", true).text(config.explainer || ""),
            legendBox = root.append("div").classed("legend-box", true),
            vizRoot = root.append("div").classed("viz-root", true),
            byline = root.append("div").classed("byline", true).text(config.byline),
            sourceline = root.append("div").classed("sourceline", true).text(config.sourceline);

        var barHeight = this.data.barHeight || 40,
            height = barHeight * data.length,
            bbox = root.node().getBoundingClientRect(),
            width = bbox.width;

        function cols() {
            return Object.keys(data[0] || {}).filter(a => a !== rowLabelKey);
        }

        // get the names of the segments of a row
        function rowSegments() {
            return cols();
            //return config.segments;
        }

        // get the color of a given segment
        function segmentColor(s){
            var i = rowSegments().indexOf(s);
            try {
                var c = columnOptions[rowSegments()[i]].color;

                var color = `rgba(${c.r},${c.g},${c.b},${c.a})`;
                return color;

            } catch (e) {
                return "black";
            }

        }

        // get the sum of a row's segments
        function rowTotal(row) {
            var segments = rowSegments(row);
            var i;
            var sum;
            for (i = 0; i < segments.length; i++) {
                var segment = segments[i];
                sum = (sum || 0) + numeral(row[segment] || 0).value();
            }
            return sum;
        }

        var minVal = function () {
            return Math.min(0, d3.min(data.map(rowTotal)));
        }();

        var maxVal = function () {
            return Math.max(0, d3.max(data.map(rowTotal)));
        }();

        function rowLabel(row) {
            return row[rowLabelKey]
        }

        var rowLabels = data.map(rowLabel);

        function rowSegmentArray(row) {
            return rowSegments().map(k => row[k]);
        }

        // create scales 
        var xScale = d3.scaleLinear()
            .range([margin.left, width - margin.right])
            .domain([minVal, maxVal])
            .nice();

        var yScale = d3.scaleBand()
            .domain(rowLabels)
            .range([margin.top, height - margin.bottom])
            .padding(axisPadding)

        var caption = vizRoot.append("div")
        .classed("mono", true)
        .classed("caption", true).html("&nbsp;")

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
                .attr("data-bar", function(_, i){ return rowLabels[i]})
                .attr("transform", function (_, i) {
                    return "translate(0," + yScale(rowLabels[i]) + ")";
                });


        // create segments
        var segments = bars.selectAll(".segment")
            .data(function (d) { return rowSegmentArray(d) })
            .enter()
            .append("rect")
            .classed("segment", true)
            .style("fill", function (_, i) {
                return segmentColor(rowSegments()[i]);
                // try {
                //     var c = columnOptions[rowSegments()[i]].color;

                //     var color = `rgba(${c.r},${c.g},${c.b},${c.a})`;
                //     return color;

                // } catch (e) {
                //     return "black";
                // }
                // //return colors[i % colors.length];
            })
            .attr("data-segment", function (_, i) { return rowSegments()[i]; })
            .attr("height", yScale.bandwidth())
            .attr("width", function (d) { return Math.abs(xScale(0) - xScale(numeral(d).value())); })
            .attr("x", function (d, i, arr) {
                var ret = xScale(0);
                if (d < 0) {
                    ret = xScale(d)
                }
                var i = i - 1;
                for (i; i >= 0; i--) {
                    var w = numeral(d3.select(arr[i]).attr("width")).value();
                    if (d < 0) { w = 0 - w }
                    ret += w;
                }
                return ret;
            })
            .on("mouseover", function(d){
                var rowLabel = d3.select(this.parentNode).attr("data-bar")
                var label = d3.select(this).attr("data-segment");
                caption.text(rowLabel + " :: " + label + ": " + fullFmt(d));
            })
            .on("mouseout", function(){ caption.html("&nbsp;")})

        // add labels
        var labelGroup = svg.append("g").classed("label-group", true);
        var labels = labelGroup.selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .text(function (d, i) { return rowLabels[i] })
            .attr("transform", function (d, i) {
                var yOffset = yScale(rowLabels[i]) + yScale.bandwidth() / 2 + d3.select(this).node().getBBox().height / 4;
                var xOffset = xScale(0) + 2;
                if (rowTotal(d) > 0) {
                    xOffset = xScale(0) - 2 - d3.select(this).node().getBBox().width;
                }
                return "translate(" + xOffset + "," + yOffset + ")";
            });
        
        var shortFmt = x => numeral(x).value()//.format("0a").toUpperCase() 
        var fullFmt = x => (config.valuePrefix || "") +  shortFmt(x) + (config.valueSuffix || "");

        // add xAxis
        var xAxis = d3.axisBottom(xScale)
            .tickSize(height - margin.bottom - margin.top)
            .ticks(Math.round(width / 80))
            .tickFormat( function(v, i){
                if(i > 0){ return shortFmt(v);}
                return fullFmt(v);
            })

        var xAxisGroup = svg.append("g").classed("x-axis-group", true)
        .classed("mono", true)
            .attr("transform", "translate(0," + margin.top + ")")
            .call(xAxis);

        // add a legend
        if (config.showLegend !== false){
            var legend = new Legend(legendBox, rowSegments().map(function(a){
                return {
                    "label":a,
                    "color":segmentColor(a)    
                }
            }));
            legend.draw();
        }


        // minimize the left margin
        // get the left-most label's x value
        var leftOffset = labelGroup.node().getBBox().x;
        if (leftOffset < 0) {
            //this.config.margin.left = Math.abs(leftOffset) + 4; 
            this.config.margin.left += 1;
            this.draw();
        }

        // minimize the bottom margin
        var bottomBBox = xAxisGroup.node().getBBox();
        if (height + margin.bottom - margin.top < bottomBBox.height) {
            // this.config.margin.bottom += 1;
            this.config.margin.bottom = bottomBBox.height - height;
            this.draw();
        }

        // minimize the right margin
        var axisLeft = bottomBBox.width + bottomBBox.x;
        console.log(axisLeft, width)

        if (axisLeft > width) {
            this.config.margin.right += 1
            this.draw();

        }
    }

}

export { SegmentedBar };
import { 
    ConnMap, 
    ConnTownLayer, 
    ConnElemSchoolDistrictLayer, 
    ConnSecondarySchoolDistrictLayer, 
    ConnUnifiedSchoolDistrictLayer 
} from "../ConnTownMap";

import ThrottledViz from "../ThrottledViz";
// import { InputArea } from "./InputArea";
// import townRents from "./data/rent.json";
import "./style/main.scss";
import { Slider } from "../Inputs";
var inventoryData = require("./data/timetable-Percentage.json");

import * as d3 from "d3";

class ConnHousingInventory extends ThrottledViz {

    constructor(props) {
        super(props);

        this.draw = this.draw.bind(this);
        this.updateYear = this.updateYear.bind(this);
        this.updateSchoolCutoff = this.updateSchoolCutoff.bind(this);
        this.update = this.update.bind(this);
        // this.mapDidDraw = this.mapDidDraw.bind(this);

        this.draw();
    }

    update(){
        this.updateYear();
        this.updateSchoolCutoff();
    } 

    updateYear(year) {
        this.year = Number(year) || this.year || 1992;

        var color = d3.scaleLinear()
            .domain([0.0, 10.0])
            .range(["white", "steelblue"]);

        var y = this.year;

        d3.selectAll("path.town").style("fill", function (d) {
            try { 
                var townName = d3.select(this).attr("data-place"),
                pct = inventoryData[townName][String(y)];

                // TAKE THIS OUT FOR PRODUCTION
                // Data needs to be cleaned a little more
                if (pct > 100) pct = pct / 100;

                var ret = color(pct) || "white"; 
                console.log(townName, pct, ret, color());
                return ret;
            } catch { return "white" }
            
        })

    }

    updateSchoolCutoff(score) {
        // this.income = Number(income || this.income);
        // this.updateRent((this.income * 0.3) / 12);
    }

    draw() {

        var root = d3.select("#root").html("");

        // add input area
        root.append("div").attr("id", "year-input-area");
        root.append("div").attr("id", "score-input-area");

        root.append("div").attr("id", "map-root");
        // add map

        var map = new ConnMap([], {root:"#map-root", drawCallback:this.update});
        var townLayer = new ConnTownLayer(),
            elemLayer = new ConnElemSchoolDistrictLayer(),
            secondaryLayer = new ConnSecondarySchoolDistrictLayer(),
            unifiedLayer =  new ConnUnifiedSchoolDistrictLayer();

        map.addLayer(townLayer);
        map.addLayer(elemLayer);
        map.addLayer(secondaryLayer);
        map.addLayer(unifiedLayer);

        map.draw();

        var yearSlider = new Slider({
            root: "year-input-area",
            min: 1992,
            step: 5,
            value: this.year || 1992,
            max: 2018,
            callback: this.updateYear
        });

        var schoolScoreSlider = new Slider({
            root: "score-input-area",
            min: 0,
            step: 5,
            value: this.schoolScore || 80,
            max: 100,
            callback: this.updateSchoolCutoff
        })

        yearSlider.draw();
        schoolScoreSlider.draw();

        this.updateSchoolCutoff(this.schoolCutoff || 80);
        this.updateYear(this.year);

        // this.updateIncome(this.income || 50 * 1000);

        // console.log("incomeSlider value", incomeSlider.value);
        // this.updateIncome(incomeSlider.value);

        // when an input changes, update the map
    }

}

export { ConnHousingInventory };
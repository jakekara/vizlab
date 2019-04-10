import { 
    ConnMap, 
    ConnTownLayer, 
    // ConnElemSchoolDistrictLayer, 
    // ConnSecondarySchoolDistrictLayer, 
    // ConnUnifiedSchoolDistrictLayer 
} from "../ConnTownMap";

import ThrottledViz from "../ThrottledViz";
// import { InputArea } from "./InputArea";
import townRents from "./data/rent.json";
import "./style/main.scss";

import { Slider } from "../Inputs"

import * as d3 from "d3";

class ConnHousingOptions extends ThrottledViz {

    constructor(props) {
        super(props);

        this.draw = this.draw.bind(this);
        this.updateRent = this.updateRent.bind(this);
        this.updateIncome = this.updateIncome.bind(this);
        // this.mapDidDraw = this.mapDidDraw.bind(this);

        this.draw();
    }

    updateRent(rent) {
        this.rent = Number(rent);
        var rent = this.rent;
        d3.selectAll("path.town").classed("can-afford", function (d) {
            var ret = townRents[d.id].rent <= rent;
            if (ret) { return ret }
            return false;

        })

    }

    updateIncome(income) {
        this.income = Number(income || this.income);
        this.updateRent((this.income * 0.3) / 12);
    }

    // mapDidDraw() {
    //     // this.updateIncome(this.income);
    // }

    draw() {
        console.log("Drawing ConnHousingOptions")

        var root = d3.select("#root").html("");

        // add input area
        var inputArea = root.append("div").attr("id", "input-area");
        var mapRoot = root.append("div").attr("id", "map-root");
        // add map

        var map = new ConnMap([], {root:"#map-root", drawCallback:this.updateIncome});
        var townLayer = new ConnTownLayer();
            // elemLayer = new ConnElemSchoolDistrictLayer(),
            // secondaryLayer = new ConnSecondarySchoolDistrictLayer(),
            // unifiedLayer =  new ConnUnifiedSchoolDistrictLayer();

        map.addLayer(townLayer);
        // map.addLayer(elemLayer);
        // map.addLayer(secondaryLayer);
        // map.addLayer(unifiedLayer);


        map.draw();

        var incomeSlider = new Slider({
            root: "input-area",
            min: 0,
            step: 500,
            value: this.income,
            max: 112 * 1000,
            callback: this.updateIncome
        })

        incomeSlider.draw();

        this.updateIncome(this.income || 50 * 1000);

        console.log("Drew", this)


        // console.log("incomeSlider value", incomeSlider.value);
        // this.updateIncome(incomeSlider.value);

        // when an input changes, update the map
    }

}

export { ConnHousingOptions };
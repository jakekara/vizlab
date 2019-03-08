import { ConnTownMap } from "../ConnTownMap"
import ThrottledViz from "../ThrottledViz";
// import { InputArea } from "./InputArea";
import townRents from "./data/rent.json";
import "./style/main.scss";

import { Slider } from "../Inputs"

import * as d3 from "d3";

class ConnHousingOptions extends ThrottledViz{

    constructor(props){
        super(props);

        this.draw = this.draw.bind(this);
        this.updateRent = this.updateRent.bind(this);
        this.updateIncome = this.updateIncome.bind(this);
        this.mapDidDraw = this.mapDidDraw.bind(this);

        this.draw();
    }

    updateRent(rent){
        this.rent = Number(rent);
        var rent = this.rent;
        d3.selectAll("path.town").classed("can-afford", function(d){
            var ret = townRents[d.id].rent <= rent;
            if (ret){ return ret}
            return false;
            
        })

    }

    updateIncome(income){
        this.income = Number(income || this.income);
        this.updateRent((this.income * 0.3) / 12);

    }

    mapDidDraw(){
        console.log("mapDidDraw", this.income)
        this.updateIncome(this.income)
    }

    draw(){
        console.log("Drawing ConnHousingOptions")

        var root = d3.select("#root").html("");

        // add input area
        root.append("div").attr("id","input-area");
        var mapRoot = root.append("div").attr("id", "map-root");
        // add map
        var map = new ConnTownMap([], {
            root:"#map-root",
            drawCallback: this.mapDidDraw
        });
        map.draw();

        this.income = this.income || 50 * 1000;
        var incomeSlider = new Slider({
            root:"input-area",
            min:0,
            step: 500,
            value: this.income,
            max:112 * 1000,
            callback: this.updateIncome
        })
        incomeSlider.draw();

        console.log("incomeSlider value", incomeSlider.value);
        this.updateIncome(incomeSlider.value);

        // when an input changes, update the map
    }

}

export {ConnHousingOptions};
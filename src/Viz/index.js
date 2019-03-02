import "./style/main.scss";
var pym = require("pym.js");

export default class Viz {
    constructor(data, config){
        //this.divID = divID || "root";
        this.data = data;
        this.config = config || {}

        // a lot of viz will use this
        this.config.margin = this.config.margin || {
            "top":20,
            "bottom":20,
            "left":20,
            "right":20
        }

        this.draw = this.draw.bind(this);
        pym.Child({polling:500})
    }

    draw(){

    }
}

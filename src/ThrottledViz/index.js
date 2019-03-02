import Viz from "../Viz";

export default class ThrottledViz extends Viz {

    constructor(data, config){
        super(data, config);

        this.scheduleRedraw = this.scheduleRedraw.bind(this);
        this.setupListeners = this.setupListeners.bind(this);

        this.setupListeners();
    
    }

    setupListeners(){
        if (window.addEventListener){ window.addEventListener("resize", this.scheduleRedraw, false); }
        else if (window.attachEvent) { window.attachEvent("onresize", this.scheduleRedraw); }

    }
    scheduleRedraw(){
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.draw, 150);
    }


}
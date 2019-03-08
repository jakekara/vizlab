export default class Slider {
    constructor(config){
        this.config = config;
        this.draw = this.draw.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    setValue(v){
        var callback = this.config.callback || function(){}
        this.value = Number(v);
        callback(v);
        this.label.innerHTML = v;
    }

    handleChange(e){
        this.setValue(e.target.value);
    }

    draw(){

        var root = document.getElementById(this.config.root || "root"),
        min = this.config.min || 0,
        max = this.config.max || 100,
        step = this.config.step || null,
        value = this.config.value || (min + max) / 2;

        root.innerHTML = "";

        var slider = document.createElement("input")
        slider.setAttribute("type", "range");
        slider.setAttribute("min", min);
        slider.setAttribute("max", max);
        slider.setAttribute("value", value);
        slider.setAttribute("step", step)


        slider.addEventListener("change", this.handleChange)

        root.appendChild(slider);

        this.label = document.createElement("div");
        this.label.className = "slider-label";
        root.appendChild(this.label)

        this.setValue(value);


    }
}
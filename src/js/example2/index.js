import {Fractal, Perlin} from "../../../package/dist/index.esm.js";
import Example from "./../Example";
import Noise from "../../../package/src/core/Noise.js";

class NoiseExample extends Example {
    constructor(){
        super();
        this.init();
    }

    init(){
        var time = Date.now();
        this.noise = new Noise({
            size: 1024,
            exposition: 0.6,
            rgb: true,
            density: 1,
            complexity: 6,
            dynamic: true,
            reading: true,
            offset: [0, 0, 0]
        })

        this.performancesNotices.push({
            name: "Build duration",
            value: Date.now() - time
        })

        this.addTest("Simple call", ()=>{
            var total = 0;
            var count = 100;
            for(var i=0; i<count; i++){
                var time = Date.now();
                this.noise.draw();
                total += Date.now() - time;
            }
            return total / count; 
        })

        super.init();
    }

    initGUI(){
        this.gui.add(this.noise, "density", 0, 20).onChange(() => this.noise.draw());
        this.gui.add(this.noise, "complexity", 0, 20).onChange(() => this.noise.draw());
        this.gui.add(this.noise, "stepExposition", 0, 5).onChange(() => this.noise.draw());
        this.gui.add(this.noise, "rgb", 0, 5).onChange(() => this.noise.draw());
        this.gui.add(this.noise, "exposition", 0, 5).onChange(() => this.noise.draw());
    }

    loop(time){
        this.noise.offset[2] = time*0.5;
        this.noise.draw();
        super.loop();
    }

} 

export default new NoiseExample();
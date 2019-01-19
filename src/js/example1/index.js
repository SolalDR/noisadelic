import {Perlin, Fractal, Brownian} from "../../../package/dist/index.esm.js";
import SimplexNoise from "simplex-noise";
import Example from "./../Example";

class Example1 extends Example {
    constructor(){
        super();
        this.init();
    }

    init(){
        var time = Date.now();
        this.noise = new Brownian({
            size: 1024,
            exposition: 0.6,
            rgb: false,
            density: 1,
            complexity: 6,
            dynamic: true,
            reading: true
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

} 

export default new Example1();


// var simplex = new SimplexNoise();

// var time = performance.now();
// var a = 0;
// for(var i=0; i<100000; i++){
//     simplex.noise2D(0, a += 0.01);
// }
// console.log("Simplex: ", performance.now() - time);


// var time = performance.now();
// var a = 0;
// for(var i=0; i<100000; i++){
//     noise.at(0, a += 1);
// }
// console.log("Noisadelic", performance.now() - time);



// document.body.appendChild(noise.canvas);

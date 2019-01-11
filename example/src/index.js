import {Brownian} from "./../../dist/index.esm.js";

console.time();
var noise = new Brownian({
    size: 1024,
    rgb: true,
    density: 1,
    exposition: 0.8
})
console.timeEnd();

var img = noise.convertImg();
var canvas = noise.convertCanvas();
var info = noise.at(0.5, 1);

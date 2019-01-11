import {Brownian} from "./../package/dist/index.esm.js";

console.time();
var noise = new Brownian({
    size: 1024,
    rgb: true,
    density: 1,
    exposition: 0.8,
    dynamic: true
})
console.timeEnd();

document.body.appendChild(noise.canvas);





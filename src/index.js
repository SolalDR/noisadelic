import {Brownian, Fractal} from "./../package/dist/index.esm.js";
import { request } from "https";

console.time();
var noise = new Fractal({
    size: 1024,
    rgb: true,
    density: 10,
    exposition: 0.8,
    dynamic: true,
    offset: [0, 0]
})
console.timeEnd();

var render = ()=>{
    noise.depth += 0.001;
    noise.draw();
    requestAnimationFrame(render);
}
requestAnimationFrame(render)

document.body.appendChild(noise.canvas);

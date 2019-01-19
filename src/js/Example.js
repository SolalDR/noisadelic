import gui from "./gui";
import {createElement} from "./dom-helper";

class Example {
    
    constructor({
        name = ""
    } = {}){
        this.gui = gui.addFolder(name);
        this.performancesNotices = [];
        this.time = 0.;
    }

    init(){
        this.element = document.createElement("div");
        this.element.classList.add("box");
        this.element.innerHTML = "";
        this.element.appendChild(this.noise.canvas);
        this.element.appendChild(this.noise.canvas);
        
        document.querySelector(".main").appendChild(this.element);
        
        var detail = document.createElement("div");

        this.performancesNotices.forEach(notice => {
            var noticeElement = createElement(`<p class="box__detail">${notice.name}: ${notice.value}ms</p>`);
            detail.appendChild(noticeElement);
        })

        this.element.appendChild(detail);
        this.initGUI();

        if( this.noise.dynamic ){
            this.loop();
        }
    }

    addTest(name, callback){
        var value = callback.call(this);
        this.performancesNotices.push({ name, value });
        console.log(value);
    }

    initGUI(){

    }

    loop(){
        this.time += 0.001;
        requestAnimationFrame(this.loop.bind(this, this.time));
    }
}

export default Example;
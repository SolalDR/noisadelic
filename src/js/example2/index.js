import {Fractal, Perlin} from "../../../package/dist/index.esm.js";
import Example from "./../Example";
import Noise from "../../../package/src/core/Noise.js";
import * as THREE from "three";
import "three-dat.gui";

class NoiseExample extends Example {
    constructor(){
        super();
        this.init();
    }

    init(){
        var time = Date.now();
        this.noise = new Noise({ 
            rgb: true,
            spherical: true,
            normalize: true,
            dynamic: true,
            offset: [0, 0, 0]
        })

        this.noiseDiffuse = new Noise({ 
            rgb: false,
            spherical: true,
            dynamic: true,
            density: 0.1,
            offset: [0, 0, 0]
        })

        this.displacementNoise = new Noise({ 
            spherical: true,
            rgb: true,
            dynamic: true,
            offset: [0, 0, 0],
            density: 0.1
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

        this.initScene();
        super.init();
        this.element.appendChild( this.renderer.domElement );
    }

    initGUI(){
        this.gui.add(this.noise, "density", 0, 20).onChange(() => this.noise.draw());
        this.gui.add(this.noise, "rgb", 0, 5).onChange(() => this.noise.draw());
        this.gui.add(this.noise, "exposition", 0, 5).onChange(() => this.noise.draw());
    }

    initScene(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( 1024, 1024 );

        this.normalMap = new THREE.CanvasTexture(this.noise.canvas);
        this.displacementMap = new THREE.CanvasTexture(this.displacementNoise.canvas);

        console.log(this.normalMap)

        var geometry = new THREE.SphereGeometry( 1, 64, 64 );
        var material = new THREE.MeshStandardMaterial( { 
            color: new THREE.Color('rgb(255, 177, 0)'),
            normalMap: this.normalMap,
            displacementMap: this.displacementMap,
            map: new THREE.CanvasTexture(this.noiseDiffuse.canvas),
            metalnessMap: this.normalMap,
            roughnessMap: this.displacementMap,
            alphaMap: new THREE.CanvasTexture(this.noiseDiffuse.canvas),
            metalness: 0.95,
            roughness: 0.5
        } );

        this.gui.addMaterial('Material', material);
        this.mesh = new THREE.Mesh( geometry, material );
        this.scene.add( this.mesh );

        var light = new THREE.AmbientLight();
        var lightPoint = new THREE.PointLight();
        lightPoint.position.set(0, 0, 2)

        this.scene.add(light);
        this.scene.add(lightPoint);

        this.camera.position.z = 5;
    }

    loop(time){
        this.noise.offset[2] = time*2.;
        this.displacementNoise.offset[2] = time*2;
        this.displacementNoise.offset[1] = time;
        this.displacementNoise.offset[0] = -time;
        
        this.normalMap.needsUpdate = true;
        this.displacementMap.needsUpdate = true;

        this.noise.draw();
        this.displacementNoise.draw();

        this.mesh.rotation.y += 0.002
        this.renderer.render(this.scene, this.camera)
        super.loop();
    }

} 

export default new NoiseExample();
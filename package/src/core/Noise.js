import vertexShader from "./../shaders/noise/vertex.glsl";
import fragmentShader from "./../shaders/noise/fragment.glsl";
import Context from "./Context";

/**
 * @class A Noise noise generator
 * @param {int} size The size of your texture
 * @param {float} density Increase the amount of detail
 * @param {float} exposition Between 0 & 1 
 * @param {boolean} rgb If true, the texture generated will be in the 3 channel RGB (default is false => grayscale)
 * @param {boolean} dynamic If true, the texture will keep his WebGLRenderingContext and you can regenerate you're noise (very fast) 
 * @param {[float, float]} offset The offset start of the noise, usefull to create animated noise (default is null, offset will be generated randomly)
 * @todo Use ConWebGLRenderingContexttext.texImage2D()
 */
class Noise {

    /**
     * @constructor
     * @param {Object} params A config object
     */
    constructor({
        size = 512,
        density = 1,
        rgb = false,
        exposition = 0.5, 
        dynamic = false,
        offset = null,
        complexity = 5,
        stepExposition = 0.5
    } = {}){

        this.context = new Context();
        this.canvas = this.context.canvas;

        this.defines = {
            RGB: false,
            NORMALIZE: false,
            SPHERICAL: false
        }

        this.program = this.context.createProgram(vertexShader, fragmentShader);
        
        this.attributes = {
            position: this.context.gl.getAttribLocation(this.program, "a_position"),
            uv: this.context.gl.getAttribLocation(this.program, "a_uv")
        }
        
        this.uniforms = {
            resolution: this.context.gl.getUniformLocation(this.program, "u_resolution"),
            density: this.context.gl.getUniformLocation(this.program, "u_density"),
            offset: this.context.gl.getUniformLocation(this.program, "u_offset"),
            exposition: this.context.gl.getUniformLocation(this.program, "u_exposition"),
            complexity: this.context.gl.getUniformLocation(this.program, "u_complexity"),
            stepExposition: this.context.gl.getUniformLocation(this.program, "u_step_exposition"),
            RGB: this.context.gl.getUniformLocation(this.program, "RGB")
        }
        
        this.size = size;
        this.density = density;
        this.exposition = exposition;
        this.rgb = rgb;
        this.dynamic = dynamic;
        this.offset = offset;
        this.complexity = complexity;
        this.stepExposition = stepExposition;

        this.draw();
    }
    
    /**
     * Draw a new canvas
     * @returns {Canvas}
     */
    draw(){
        if(!this.context) {
            console.error("Noise: Trying to draw on a static noise, create a Noise with dynamic equal true");
            return;
        }
        
        var offset = this.offset ? this.offset : [Math.random(), Math.random()]

        var gl = this.context.gl;
        
        // Resize
        this.context.canvas.width = this.size;
        this.context.canvas.height = this.size;
        gl.viewport(0, 0, this.size, this.size);
        
        // Clear
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use
        gl.useProgram(this.program);
        
        // Position
        gl.enableVertexAttribArray(this.attributes.position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.context.positionBuffer);
        gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 0, 0);
        
        // Uvs
        gl.enableVertexAttribArray(this.attributes.uv);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.context.uvBuffer);
        gl.vertexAttribPointer( this.attributes.uv, 2,gl.FLOAT, false, 0, 0);
        
        // Uniforms
        gl.uniform1f(this.uniforms.complexity, this.complexity);
        gl.uniform1f(this.uniforms.resolution, this.size);
        gl.uniform1f(this.uniforms.density, this.density * 10);
        gl.uniform1f(this.uniforms.exposition, this.exposition);
        gl.uniform1f(this.uniforms.stepExposition, this.stepExposition);
        gl.uniform3f(this.uniforms.offset, offset[0], offset[1], offset[2]);
        
        gl.uniform1f(this.uniforms.RGB, this.rgb === true ? 1 : 0);

        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    
        
        if(!this.dynamic) {
            gl.deleteBuffer(this.context.uvBuffer);
            gl.deleteBuffer(this.context.positionBuffer);
            this.save();
        }
        
        return this.canvas;
    }

    /**
     * Convert the canvas to an image element, if noise is static 
     * @returns {Image}
     */
    convertImage(){
        var image = new Image();
        image.src = this.canvas.toDataURL();
        this.image = image;
        return this.image;
    }

    /**
     * Save pixel buffer
     * @param {*} x 
     * @param {*} y 
     */
    save(){
        var pixels = new Uint8Array(this.size*this.size*4);
        this.context.gl.readPixels(0, 0, this.size, this.size, this.context.gl.RGBA, this.context.gl.UNSIGNED_BYTE, pixels); 
        this.buffer = pixels;
    }
     
    /**
     * 
     * @param {float} x 
     * @param {float} y 
     */
    atRGB(x, y){
        var rank = (y*this.size + x)*3; 
        return [
            this.buffer[rank],
            this.buffer[rank + 1],
            this.buffer[rank + 2]
        ]
    }

    at(x, y) {
        // var pX = Math.floor(x);
        // var pY = Math.floor(y);
        // var fX = x%(1/this.size);
        // var fY = x%(1/this.size);
        return this.buffer[
            (
                (
                    Math.floor( x*512 ) +
                    Math.floor( y*512 )*this.size 
                )*4
            )%this.buffer.length
        ]
    }
}

Noise.RGB = 1;

export default Noise;
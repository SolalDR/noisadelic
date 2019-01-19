import vertexShader from "./../shaders/perlin/vertex.glsl";
import fragmentShader from "./../shaders/perlin/fragment.glsl";
import Context from "./Context";

/**
 * @class A Perlin noise generator
 * @param {int} size The size of your texture
 * @param {float} density Increase the amount of detail
 * @param {float} exposition Between 0 & 1 
 * @param {boolean} rgb If true, the texture generated will be in the 3 channel RGB (default is false => grayscale)
 * @param {boolean} dynamic If true, the texture will keep his WebGLRenderingContext and you can regenerate you're noise (very fast) 
 * @param {[float, float]} offset The offset start of the noise, usefull to create animated noise (default is null, offset will be generated randomly)
 * @todo Use ConWebGLRenderingContexttext.texImage2D()
 */
class Perlin {

    /**
     * @constructor
     * @param {Object} params A config object
     */
    constructor({
        size = 512,
        density = 10,
        rgb = false,
        exposition = 0.5, 
        dynamic = false,
        offset = null
    } = {}){

        this.context = new Context();
        this.canvas = this.context.canvas;

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
            RGB: this.context.gl.getUniformLocation(this.program, "RGB")
        }
        
        this.size = size;
        this.density = density;
        this.exposition = exposition;
        this.rgb = rgb;
        this.dynamic = dynamic;
        this.offset = offset;

        this.draw();
    }
    
    /**
     * Draw a new canvas
     * @returns {Canvas}
     */
    draw(){
        if(!this.context) {
            console.error("Perlin: Trying to draw on a static noise, create a Perlin with dynamic equal true");
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
        gl.uniform1f(this.uniforms.resolution, this.size);
        gl.uniform1f(this.uniforms.density, this.density * 10);
        gl.uniform1f(this.uniforms.exposition, this.exposition);
        gl.uniform2f(this.uniforms.offset, offset[0], offset[1]);
        
        gl.uniform1f(this.uniforms.RGB, this.rgb === true ? 1 : 0);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        
        if(!this.dynamic) {
            gl.deleteBuffer(this.context.uvBuffer);
            gl.deleteBuffer(this.context.positionBuffer);
            this.context = null;
        }

        return this.canvas;
    }

    /**
     * Convert the canvas to an image element, if noise is static 
     * @returns {Image}
     */
    convertImage(){
        var image = new Image();
        image.src = this.canvas.toDataURL();
        this.image = image;
        return this.image;
    }
    
    /**
     * 
     * @param {float} x 
     * @param {float} y 
     */
    at(x, y){
        console.warn("Perlin: Depreciated method Perlin.at(x, y), need to be improved");
        if (this.context) { 
            console.error("Perlin: Object need to be dynamic to use this method");
            return; 
        }
        var gl = this.context.gl;
        return gl.readPixels(x, y, 1, 1, gl.RGB_INTEGER, type, pixels); 
    }
}

Perlin.RGB = 1;

export default Perlin;
import vertexShader from "./../shaders/brownian/vertex.glsl";
import fragmentShader from "./../shaders/brownian/fragment.glsl";
import context from "./context";

class Brownian {
    constructor({
        size = 512,
        density = 1,
        rgb = false,
        exposition = 0.5
    } = {}){
        this.program = context.createProgram(vertexShader, fragmentShader);
        
        this.attributes = {
            position: context.gl.getAttribLocation(this.program, "a_position"),
            uv: context.gl.getAttribLocation(this.program, "a_uv")
        }

        this.uniforms = {
            resolution: context.gl.getUniformLocation(this.program, "u_resolution"),
            density: context.gl.getUniformLocation(this.program, "u_density"),
            offset: context.gl.getUniformLocation(this.program, "u_offset"),
            exposition: context.gl.getUniformLocation(this.program, "u_exposition"),
            RGB: context.gl.getUniformLocation(this.program, "RGB")
        }

        this.size = size;
        this.density = density;
        this.exposition = exposition;
        this.rgb = rgb;

        this.draw();
    }

    draw(){
        var gl = context.gl;

        // Resize
        context.canvas.width = this.size;
        context.canvas.height = this.size;
        gl.viewport(0, 0, this.size, this.size);
        
        // Clear
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use
        gl.useProgram(this.program);
        
        // Position
        gl.enableVertexAttribArray(this.attributes.position);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.positionBuffer);
        gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 0, 0);
        
        // Uvs
        gl.enableVertexAttribArray(this.attributes.uv);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.uvBuffer);
        gl.vertexAttribPointer( this.attributes.uv, 2,gl.FLOAT, false, 0, 0);
    
        // Uniforms
        gl.uniform1f(this.uniforms.resolution, this.size);
        gl.uniform1f(this.uniforms.density, this.density * 10);
        gl.uniform1f(this.uniforms.exposition, this.exposition);
        gl.uniform2f(this.uniforms.offset, Math.random(), Math.random());

        gl.uniform1f(this.uniforms.RGB, this.rgb === true ? 1 : 0);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    
    convertImg(){
        
    }
    
    convertCanvas(){
        
    }
    
    at(){
        
    }
}

Brownian.RGB = 1;

export default Brownian;
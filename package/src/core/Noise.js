import vertexShader from './../shaders/noise/vertex.glsl';
import fragmentShader from './../shaders/noise/fragment.glsl';
import Context from './Context';

/**
 * A Noise generator
 * @param {bool} rgb Define if the texture will be encoded in RGB or Grayscale (default is grayscale)
 * @param {bool} normalize Define if the texture will be used for a normal map. This attribute work with normalIntensity
 * @param {bool} spherical Create a spherical texture
 * @param {int} size The size of your texture
 * @param {float} density Increase the amount of detail
 * @param {float} exposition Between 0 & 1
 * @param {boolean} dynamic If true, the texture will keep his WebGLRenderingContext and you can regenerate you're noise (very fast)
 * @param {[float, float, float]} offset The offset start of the noise, usefull to create animated noise (default is null, offset will be generated randomly)
 */
class Noise {

  constructor ({
    rgb = false,
    normalize = false,
    spherical = false,
    size = 512,
    density = 1,
    exposition = 0.5,
    dynamic = false,
    offset = null,
    normalIntensity = 1
  } = {}) {

    this.context = new Context();
    this.canvas = this.context.canvas;

    this.defines = {
      RGB: rgb,
      NORMALIZE: normalize,
      SPHERICAL: spherical
    };

    this.vertexSource = vertexShader;
    this.fragmentSource = fragmentShader;

    this.registerDefines();

    this.program = this.context.createProgram(this.vertexSource, this.fragmentSource);

    this.attributes = {
      position: this.context.gl.getAttribLocation(this.program, 'a_position'),
      uv: this.context.gl.getAttribLocation(this.program, 'a_uv')
    };

    this.uniforms = {
      resolution: this.context.gl.getUniformLocation(this.program, 'u_resolution'),
      density: this.context.gl.getUniformLocation(this.program, 'u_density'),
      offset: this.context.gl.getUniformLocation(this.program, 'u_offset'),
      exposition: this.context.gl.getUniformLocation(this.program, 'u_exposition'),
      normalIntensity: this.context.gl.getUniformLocation(this.program, 'u_normal_intensity'),
      RGB: this.context.gl.getUniformLocation(this.program, 'RGB')
    };

    this.size = size;
    this.density = density;
    this.exposition = exposition;
    this.rgb = rgb;
    this.dynamic = dynamic;
    this.offset = offset;
    this.normalIntensity = normalIntensity;

    this.draw();

  }

  registerDefines () {

    Object.keys(this.defines).forEach((key) => {

      if(this.defines[ key ] === true) this.fragmentSource = `#define ${ key }\r${ this.fragmentSource }`;

    });

  }

  /**
   * Draw a new canvas
   * @returns {Canvas} The canvas
   */
  draw () {

    if(!this.context) {

      console.warn('Noise: Trying to draw on a static noise, create a Noise with dynamic equal true');
      return;

    }

    let offset = this.offset ? this.offset : [Math.random(), Math.random(), Math.random()];
    let gl = this.context.gl;

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
    gl.vertexAttribPointer(this.attributes.uv, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    gl.uniform1f(this.uniforms.resolution, this.size);
    gl.uniform1f(this.uniforms.density, this.density * 10);
    gl.uniform1f(this.uniforms.exposition, this.exposition);
    gl.uniform3f(this.uniforms.offset, offset[ 0 ], offset[ 1 ], offset[ 2 ]);

    if(this.defines.NORMALIZE) gl.uniform1f(this.uniforms.normalIntensity, this.normalIntensity);


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
   * @returns {Image} Return a Image object in base 64
   */
  convertImage () {

    let image = new Image();
    image.src = this.canvas.toDataURL();
    this.image = image;
    return this.image;

  }

  /**
   * Save pixel buffer
   * @returns {void}
   */
  save () {

    let pixels = new Uint8Array(this.size * this.size * 4);
    this.context.gl.readPixels(0, 0, this.size, this.size, this.context.gl.RGBA, this.context.gl.UNSIGNED_BYTE, pixels);
    this.buffer = pixels;

  }

  /**
   *
   * @param {float} x X coordinate
   * @param {float} y Y coordinate
   * @returns {[float, float, float]} Return an array with values [x, y, z]
   */
  atRGB (x, y) {

    let rank = (y * this.size + x) * 3;
    return [
      this.buffer[ rank ],
      this.buffer[ rank + 1 ],
      this.buffer[ rank + 2 ]
    ];

  }

  /**
   * Todo
   * @param {float} x X coordinate
   * @param {float} y Y coordinate
   * @returns {float} Return the noise value
   */
  at (x, y) {

    /*
     * var pX = Math.floor(x);
     * var pY = Math.floor(y);
     * var fX = x%(1/this.size);
     * var fY = x%(1/this.size);
     */
    return this.buffer[
      (
        Math.floor(x * 512) +
                    Math.floor(y * 512) * this.size
      ) * 4 % this.buffer.length
    ];

  }

}

Noise.RGB = 1;

export default Noise;

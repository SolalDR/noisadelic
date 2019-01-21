/**
 * @class
 */
class Context {

  /**
   * @constructor
   */
  constructor () {

    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl');
    if (!this.gl) throw new Error('WebGL n\'est pas disponible');


    this.createBuffer();

  }

  /**
   * Create a plane buffer
   * @returns {void}
   */
  createBuffer () {

    let positions = [ -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1 ];
    let uvs = [ 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1 ];

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    this.uvBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);

  }

  /**
   * Create a shader on the webgl context
   * @param {int} type WebGL constant gl.VERTEX_SHADER || gl.FRAGMENT_SHADER
   * @param {string} source The source of the shader
   * @returns {void}
   */
  createShader (type, source) {

    let shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) return shader;


    let compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    console.warn(`Shader compiled successfully: ${ compiled }`);
    let compilationLog = this.gl.getShaderInfoLog(shader);
    console.warn(`Shader compiler log: ${ compilationLog }`);

    this.gl.deleteShader(shader);

  }

  /**
   * Create a program on the webgl context
   * @param {string} vertexSource The source of the vertex shader
   * @param {string} fragmentSource The source of the fragment shader
   * @returns {void}
   */
  createProgram (vertexSource, fragmentSource) {

    let vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    let fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    let program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

    if (success) return program;

  }

}

export default Context;

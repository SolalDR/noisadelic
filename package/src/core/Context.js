class Context {
  constructor(){
    this.canvas = document.createElement("canvas");
    this.gl = this.canvas.getContext("webgl");
    if (!this.gl) {
      throw new Error("WebGL n'est pas disponible")
      return;
    }
    
    this.createBuffer();
  }
  
  createBuffer(){
    var positions = [ -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1 ];
    var uvs = [ 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1 ];

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    this.uvBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);    
  }
  
  createShader(type, source) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    var success = this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    var compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    console.error('Shader compiled successfully: ' + compiled);
    var compilationLog = this.gl.getShaderInfoLog(shader);
    console.error('Shader compiler log: ' + compilationLog);

    this.gl.deleteShader(shader);
  }
  
  
  createProgram(vertexSource, fragmentSource){
    var vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    var fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
  
    if (success) {
      return program;
    }
  }
}

export default Context;
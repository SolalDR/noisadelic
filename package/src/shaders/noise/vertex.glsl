attribute vec4 a_position;
attribute vec4 a_uv;
varying vec2 v_uv;
void main() {
    v_uv = a_uv.xy;
    gl_Position = a_position;
}
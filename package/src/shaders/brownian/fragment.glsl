precision highp float;
#define M_PI 3.14159265358979323846

uniform float u_complexity;
uniform float u_resolution;
uniform float u_exposition;
uniform float u_density;
uniform vec2 u_offset;
uniform float u_step_exposition;
uniform bool RGB;
varying vec2 v_uv;


float hash(in vec2 p, in float scale) {
	// This is tiling part, adjusts with the scale...
	p = mod(p, scale);
	return fract(sin(dot(p, vec2(27.16898, 38.90563))) * 5151.5473453);
}

float noise(in vec2 p, in float scale ) {
	vec2 f;
	p *= scale;

	// Separate integer from fractional
	f = fract(p);		
    p = floor(p);
	
	// Cosine interpolation approximation
    f = f*f*(3.0-2.0*f);

	// Quad interpolation
	float x00 = hash(p, scale);
	float x10 = hash(p + vec2(1.0, 0.0), scale);
	float x01 = hash(p + vec2(0.0, 1.0), scale);
	float x11 = hash(p + vec2(1.0, 1.0), scale);

	// Interpolation x - y
    float res = mix(
		mix(x00, x10, f.x),
		mix(x01, x11, f.x),
		f.y
	);

    return res;
}

//----------------------------------------------------------------------------------------
float fBm(in vec2 p, in float scale, in vec2 offset, in float complexity){
    p += offset;

	float f = 0.0;
    p = mod(p, scale);
	float amp = u_exposition;
	
	for (float i = 0.; i < 20.; i+=1.)
	{
		f += noise(p, scale) * amp;
		amp *= u_step_exposition;
		scale *= 2.;

		if( i >= complexity ){
			break;
		} 
	}
	return min(f, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution;
    
	vec3 color;
	if( RGB == true ){
		color = vec3(
			fBm(uv, u_density, u_offset, u_complexity),
			fBm(uv, u_density, u_offset + vec2(0.3, 0.3), u_complexity),
			fBm(uv, u_density, u_offset + vec2(0.6, 0.6), u_complexity)
		);
	} else {
    	color = vec3(
			fBm(uv, u_density, u_offset, u_complexity)
		);
	}

    gl_FragColor = vec4(vec3(color), 1.);
}
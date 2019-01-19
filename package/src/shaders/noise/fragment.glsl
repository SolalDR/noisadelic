precision highp float;
#define M_PI 3.14159265358979323846

uniform float u_resolution;
uniform float u_density;
uniform vec3 u_offset;
varying vec2 v_uv;
uniform bool RGB;



float hash(in vec3 p, in float scale) {
	// This is tiling part, adjusts with the scale...
	p = mod(p, scale);
	return fract(sin(dot(p, vec3(27.16898, 38.90563, 44.53211512))) * 5151.5473453);
}



float noise(in vec3 p, in float scale) {
	vec3 f;
	p *= scale;
	f = fract(p);		
    p = floor(p);

	f = f*f*(3.0 - 2.0*f);

	float x000 = hash(p, scale);
	float x100 = hash(p + vec3(1.0, 0.0, 0.0), scale);
	float x010 = hash(p + vec3(0.0, 1.0, 0.0), scale);
	float x110 = hash(p + vec3(1.0, 1.0, 0.0), scale);
	
	float x001 = hash(p + vec3(0.0, 0.0, 1.0), scale);
	float x101 = hash(p + vec3(1.0, 0.0, 1.0), scale);
	float x011 = hash(p + vec3(0.0, 1.0, 1.0), scale);
	float x111 = hash(p + vec3(1.0, 1.0, 1.0), scale);
	
	float res = mix(
		mix(
			mix(x000, x100, f.x),
			mix(x010, x110, f.x),
			f.y
		),
		mix(
			mix(x001, x101, f.x),
			mix(x011, x111, f.x),
			f.y
		),
		f.z
	);

	return res;
}

float fBm(in vec3 p, in float scale){

	float f = 0.0;
    p = mod(p, scale);
	float amp = 0.6;
	
	for (float i = 0.; i < 5.; i+=1.)
	{
		f += noise(p, scale) * amp;
		amp *= 0.5;
		scale *= 2.;

	}
	return min(f, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution;
    
	// vec3 color = vec3(fBm(vec3(uv, 0.) + u_offset, 10.));

	vec3 color;
	if( RGB == true ){
		color = vec3(
			fBm(vec3(uv, 0.) + u_offset, u_density),
			fBm(vec3(uv, 0.) + u_offset + vec3(0.3), u_density),
			fBm(vec3(uv, 0.) + u_offset + vec3(0.6), u_density)
		);
	} else {
    	color = vec3(
			fBm(vec3(uv, 0.) + u_offset, u_density)
		);
	}

	color = (normalize((color - vec3(0.5)) + vec3(0., 0., 0.5)) + 1.)/2.;	

    gl_FragColor = vec4(vec3(color), 1.);
}
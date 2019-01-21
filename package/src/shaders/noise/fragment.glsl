#define M_PI 3.14159265358979323846
#define X_RAND 27.16898
#define Y_RAND 38.90563
#define Z_RAND 44.53211512
#define FACTOR_RAND 5151.5473453

precision highp float;

uniform float u_resolution;
uniform float u_exposition;
uniform float u_density;
uniform vec3 u_offset;
varying vec2 v_uv;

#ifdef NORMALIZE
	uniform float u_normal_intensity;
#endif


float hash(in vec3 p, in float scale) {
	// This is tiling part, adjusts with the scale...
	p = mod(p, scale);
	return fract(sin(dot(p, vec3(X_RAND, Y_RAND, Z_RAND))) * FACTOR_RAND);
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
	float amp = u_exposition;
	
	for (float i = 0.; i < 5.; i+=1.)
	{
		f += noise(p, scale) * amp;
		amp *= 0.5;
		scale *= 2.;

	}
	return min(f, 1.0);
}

void main() {
	vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 uv = vec3(coord.x, coord.y, 0.);
	vec3 color;
	float dentity = u_density;
    
	#ifdef SPHERICAL
		uv = (uv - vec3(0.5))*2.;
		uv = vec3(
			cos(uv.y*M_PI/2.) * cos(uv.x*M_PI),
			sin(uv.y*M_PI/2.),
			cos(uv.y*M_PI/2.) * sin(uv.x*M_PI)
		);
	#endif

	#ifdef RGB
		color = vec3(
			fBm(uv + u_offset, dentity),
			fBm(uv + u_offset + vec3(0.3), dentity),
			fBm(uv + u_offset + vec3(0.6), dentity)
		);
	#else
    	color = vec3(
			fBm(uv + u_offset, dentity)
		);
	#endif

	#ifdef NORMALIZE
		color = (normalize((color - vec3(0.5)) + vec3(0., 0., u_normal_intensity)) + 1.)/2.;	
	#endif

    gl_FragColor = vec4(vec3(color), 1.);
}
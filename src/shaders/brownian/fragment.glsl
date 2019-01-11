precision highp float;
#define M_PI 3.14159265358979323846

uniform float u_resolution;
uniform float u_exposition;
uniform float u_density;
uniform vec2 u_offset;
uniform bool RGB;

varying vec2 v_uv;

//----------------------------------------------------------------------------------------
float Hash(in vec2 p, in float scale)
{
	// This is tiling part, adjusts with the scale...
	p = mod(p, scale);
	return fract(sin(dot(p, vec2(27.16898, 38.90563))) * 5151.5473453);
}

//----------------------------------------------------------------------------------------
float Noise(in vec2 p, in float scale )
{
	vec2 f;
	
	p *= scale;

	f = fract(p);		// Separate integer from fractional
    p = floor(p);
	
    f = f*f*(3.0-2.0*f);	// Cosine interpolation approximation
	
    float res = mix(mix(Hash(p, 				 scale),
						Hash(p + vec2(1.0, 0.0), scale), f.x),
					mix(Hash(p + vec2(0.0, 1.0), scale),
						Hash(p + vec2(1.0, 1.0), scale), f.x), f.y);
    return res;
}

//----------------------------------------------------------------------------------------
float fBm(in vec2 p, in float scale, in vec2 offset){
    p += offset;

	float f = 0.0;
    p = mod(p, scale);
	float amp = u_exposition;
	
	for (int i = 0; i < 5; i++)
	{
		f += Noise(p, scale) * amp;
		amp *= .5;
		scale *= 2.;
	}
	return min(f, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution;
    
	vec3 color;
	if( RGB == true ){
		color = vec3(
			fBm(uv, u_density, u_offset),
			fBm(uv, u_density, u_offset + vec2(0.3, 0.3)),
			fBm(uv, u_density, u_offset + vec2(0.6, 0.6))
		);
	} else {
    	color = vec3(
			fBm(uv, u_density, u_offset)
		);
	}
    
    
    gl_FragColor = vec4(color, 1.);
}
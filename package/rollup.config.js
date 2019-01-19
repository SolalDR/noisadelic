import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import glsl from 'rollup-plugin-glsl';
import glslify from 'rollup-plugin-glslify';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'howLongUntilLunch',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			glslify({
				baseDir: 'src/shaders'
			}),
			resolve(), // so Rollup can find `ms`
			commonjs()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			glsl({
				include: '/**/*.glsl',
	 			exclude: ['**/index.html'],
				sourceMap: false
			})
		]
	}
];

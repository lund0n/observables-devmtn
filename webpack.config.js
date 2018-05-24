const { readdirSync, statSync } = require('fs')
const { resolve } = require('path')
const {
	addPlugins,
	createConfig,
	env,
	entryPoint,
	setOutput,
	sourceMaps,
	webpack,
} = require('@webpack-blocks/webpack2')
const babel = require('@webpack-blocks/babel6')
const devServer = require('@webpack-blocks/dev-server2')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const examples = readdirSync(resolve('src')).filter(example =>
	statSync(resolve('src', example)).isDirectory(),
)

module.exports = createConfig([
	entryPoint(
		examples.reduce(
			(entryPoints, entryPoint) => {
				entryPoints[entryPoint] = `./src/${entryPoint}/index`
				return entryPoints
			},
			{
				vendor: ['rxjs/Rx', 'react', 'react-dom'],
			},
		),
	),
	setOutput({
		path: resolve('dist'),
		filename: '[name].[hash].js',
	}),
	addPlugins([
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor'], // Specify the common bundle's name.
			minChunks(module) {
				// this assumes your vendor imports exist in the node_modules directory
				return module.context && module.context.indexOf('node_modules') !== -1
			},
		}),
	]),
	babel(),
	env('development', [
		addPlugins(
			[
				new HtmlWebpackPlugin({
					chunks: [],
					template: './src/index.html',
				}),
			].concat(
				examples.map(
					example =>
						new HtmlWebpackPlugin({
							chunks: ['vendor'].concat(example),
							filename: `${example}/index.html`,
							template: `./src/${example}/index.html`,
						}),
				),
			),
		),
		devServer({
			port: 3000,
		}),
		devServer.proxy({
			'/api': {
				target: 'http://localhost:3001',
				pathRewrite: { '^/api': '' },
			},
		}),
		sourceMaps(),
	]),
])

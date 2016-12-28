var webpack = require('webpack')
var path = require("path");
var fs = require("fs");
var srcDir = './src'
// var destDir = process.env.dir || "dest";

function getEntry() {
	var jsPath = path.resolve(srcDir, 'js');
	var dirs = fs.readdirSync(jsPath);
	var matchs = [], files = {};
	dirs.forEach(function (item) {
		matchs = item.match(/(.+)\.js$/);
		if (matchs) {
			// files[matchs[1]] = path.resolve(srcDir, 'js', item);
			files[matchs[1]] = srcDir + '/js/' + item;
		}
	});
	return files;
}

module.exports = {
	devtool: "source-map",
	entry: getEntry(),
	output: {
		path: path.resolve(__dirname, srcDir + "/js-tmp"), //文件输出目录
		// publicPath: srcDir + "/js/",		//用于配置文件发布路径，如CDN或本地服务器
		filename: "[name].js",		//根据入口文件输出的对应多个文件名
	},
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: "babel",
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	resolve: {
		//查找依赖的时候的会以此查找这里设置的几个文件名来查找文件
		modulesDirectories: ["node_modules", "src/js"],
		extensions: ['', '.js', '.jsx', 'css'],
		root: [
			path.resolve(__dirname),
			path.resolve(__dirname, 'src')
		]
	},
}
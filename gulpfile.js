var gulp = require("gulp");
var gutil = require("gulp-util");
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var webpackProductionConfig = require('./webpack.production.config.js');

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
	gulp.watch(['components/**/*', 'actions/**/*', 'stores/**/*', 'alt.js', 'index.js'], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["copy", 'css']);

gulp.task('copy', ['clean', 'webpack:build'], function(callback) {
	gulp.src(['./images/**/*', './bundle.js'], { base: '.' })
		.pipe(gulp.dest('./dist/'));
	callback();
});

gulp.task('clean', function() {
	return del(['dist']);
})

gulp.task('css', ['clean'], function() {
	return gulp.src('./style.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist/'));
});

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	webpackProductionConfig.plugins = webpackProductionConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(webpackProductionConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// create a single instance of the compiler to allow caching
var devCompiler = webpack(webpackConfig);

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", function(callback) {
	// Start a webpack-dev-server
	new WebpackDevServer(webpack(webpackConfig), {
        historyApiFallback: true,
		stats: {
			colors: true,
		}
	}).listen(3001, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:3001/webpack-dev-server/index.html");
	});
});

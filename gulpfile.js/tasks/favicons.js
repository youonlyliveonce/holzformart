var config = require('../config')
if(!config.tasks.favicons) return

var gulp = require('gulp');
var favicons = require('gulp-favicons');
var gutil = require("gulp-util");

gulp.task("favicons", function () {
	return gulp.src(config.root.src + config.tasks.favicons.src).pipe(favicons({
			appName: config.root.appName,
			appDescription: config.root.appDescription,
			developerName: null,
			developerURL: null,
			background: config.tasks.favicons.background,
			path: "",
			url: "",
			display: "standalone",
			orientation: "portrait",
			version: "1.0",
			logging: false,
			online: false,
			preferOnline: false,
			icons: {
					android: true,              // Create Android homescreen icon. `boolean`
					appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
					appleStartup: true,         // Create Apple startup images. `boolean`
					coast: { offset: 25 },      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset: offsetInPercentage }`
					favicons: true,             // Create regular favicons. `boolean`
					firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
					windows: true,              // Create Windows 8 tile icons. `boolean`
					yandex: true                // Create Yandex browser icon. `boolean`
			}
	}))
	.on("error", gutil.log)
	.pipe(gulp.dest(config.root.dest + config.tasks.favicons.dest));
});

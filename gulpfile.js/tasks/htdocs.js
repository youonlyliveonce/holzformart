var config      = require('../config')
if(!config.tasks.htdocs) return

var browserSync = require('browser-sync')
var gulp        = require('gulp')
var path        = require('path')

var htdocsTask = function() {
	return gulp.src(config.root.src + config.tasks.htdocs.src + '/**')
		.pipe(gulp.dest(config.root.dest + config.tasks.htdocs.dest ))
		.pipe(browserSync.stream())
}

gulp.task('htdocs', htdocsTask)
module.exports = htdocsTask

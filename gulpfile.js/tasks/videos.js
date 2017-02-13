var config = require('../config')
if(!config.tasks.videos) return

var browserSync = require('browser-sync')
var changed     = require('gulp-changed')
var gulp        = require('gulp')
var path        = require('path')

var paths = {
  src: path.join(config.root.src, config.tasks.videos.src, '/**'),
  dest: path.join(config.root.dest, config.tasks.videos.dest)
}

var downloadsTask = function() {
  return gulp.src(paths.src)
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
}

gulp.task('videos', downloadsTask)
module.exports = downloadsTask

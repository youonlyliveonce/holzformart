var config = require('../config').tasks.iconFont
if(!config) return

var gulp = require('gulp')
  , sass = require('gulp-sass')
  , iconfont = require('gulp-iconfont')
  , consolidate = require('gulp-consolidate');

var iconFontTask = function() {

  return gulp.src(config.src)
    .pipe(iconfont({
      fontName: config.options.fontName
    , formats: config.options.formats
    , appendCodepoints: config.options.appendCodepoints
    , centerHorizontally: config.options.centerHorizontally
    , normalize: config.options.normalize
    , prependUnicode: config.options.prependUnicode
    }))
    .on('glyphs', function (glyphs) {
      gulp.src(config.template)
        .pipe(consolidate('lodash', {
          glyphs: glyphs
        , fontName: config.options.fontName
        , fontPath: config.fontPath
        , className: config.className
        }))
        .pipe(gulp.dest(config.dest));
    })
    .pipe(gulp.dest(config.fontsDest));
}

gulp.task('iconFont', iconFontTask)
module.exports = iconFontTask
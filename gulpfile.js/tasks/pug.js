var config = require('../config')
var pugPath = config.tasks.pug
if(!pugPath) return

var gulp = require('gulp')
var gulpif = require('gulp-if')
var path = require('path')
var browserSync = require('browser-sync')
var gulpData = require('gulp-data');
var yaml = require('js-yaml');
var yamlinc = require('yaml-include');
var fs = require('fs')
var pug = require('gulp-pug')


var getData = function(file) {
  if(pugPath.data){
  	var dir = path.dirname(file.path),
  		base = path.basename(file.path, '.pug'),
  		fileSrc = dir + '/' + base + pugPath.data.ext,
  		fileDest = fileSrc.replace(pugPath.data.src, pugPath.data.dest),
  		fileData;


    // console.log("fileDest:",fileDest);
    // console.log("fileSrc:",fileSrc);

  	if( !fs.existsSync(fileDest) ){
  		return;
  	}

  	fileData = fs.readFileSync(fileDest);


  	if (pugPath.data.ext == ".yml"){
      yamlcontent = yaml.safeLoad(fileData, { schema: yamlinc.YAML_INCLUDE_SCHEMA })
      // console.log("yamlcontent:",yamlcontent);
  		return yamlcontent;
  	} else {
  		return JSON.parse(fileData);
  	}
  }
}

var pugTask = function() {

	// if(pugPath.lngs){
 //      for (var key in pugPath.lngs) {
	// 	return gulp.src(config.root.src + pugPath.lngs[key].src)
	// 		.pipe(gulpData(getData))
	// 		.pipe(pug({
	// 			client: false,
	// 			pretty: true
	// 		}))
	// 		.pipe(gulp.dest(config.root.dest + pugPath.lngs[key].dest))
	// 		.pipe(browserSync.stream());
 //      }
 //    } else {
	// 	return gulp.src(config.root.src + pugPath.src)
	// 		.pipe(gulpData(getData))
	// 		.pipe(pug({
	// 			client: false,
	// 			pretty: true
	// 		.pipe(gulp.dest(config.root.dest + pugPath.dest))
	// 		}))
	// 		.pipe(browserSync.stream())
 //    }
	return gulp.src(config.root.src + "/" + config.tasks.pug.render)
		.pipe(gulpData(getData))
		.pipe(pug({
				client: false,
				pretty: true
			}))
		.pipe(gulp.dest(config.root.dest + config.tasks.pug.dest))
		.pipe(browserSync.stream())

}

gulp.task('pug', pugTask)
module.exports = pugTask

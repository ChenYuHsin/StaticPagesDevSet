var gulp                    = require('gulp'),
		connect                 = require('gulp-connect'),
  	compass                 = require('gulp-compass');

		concat                  = require('gulp-concat'),
    minifyCSS               = require('gulp-minify-css'),
    uglify                  = require('gulp-uglify'),
    rename                  = require("gulp-rename"),
		del                     = require('del');

// 利用compass編譯scss
gulp.task('compass',['clean_css'],function(){
  return gulp.src('sass/*.*')
    .pipe(compass({
				// config_file: './style/scss/config.rb',
        css: './css', //輸出位置
        sass: 'sass/', //來源位置
        style: 'compact', //nested, expanded, compact, compressed 壓縮格式
				comments: false, //是否要註解 預設為true
          }))
          .pipe(gulp.dest('./css')); //輸出位置，非必要

});

// 開啟web_server
gulp.task('server_on',function(){
	connect.server({
		livereload:true,
	});
});

// 重新整理頁面
gulp.task('reload',function(){
	gulp.src('*.html')
		.pipe(connect.reload());
});

// 合併所有 css檔案成 all.css
gulp.task('concat_css',['compass'],function(){
	return gulp.src('./css/*.css')
		.pipe(concat('all.css'))
		.pipe(gulp.dest('./css/all'));
});

// 壓縮 all.css成 all.min.css
gulp.task('minify_css',['concat_css'], function() {
  return gulp.src('./css/all/all.css')
    .pipe(minifyCSS({
       keepBreaks: true,
    }))
    .pipe(rename(function(path) {
      path.basename += ".min";
      path.extname   = ".css";
    }))
    .pipe(gulp.dest('./'));
});

// 壓縮 js檔
gulp.task('uglify', function() {
    return gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname   = ".js";
        }))
        .pipe(gulp.dest('./'));
});

// 編譯前先刪除舊的 css檔案
gulp.task('clean_css',function(){
	return del('css/*.css');
});


// 監視各檔案有沒有變化
gulp.task('watch',function(){
	gulp.watch('*.html',['reload']);
  gulp.watch('sass/*.*',['minify_css']);
  gulp.watch('*.css',['reload']);
	gulp.watch('./js/*.js',['uglify']);
	gulp.watch('log.min.js',['reload']);
});


//gulp.task('default',['minify-css','uglify'])
gulp.task('default',['server_on','watch']);

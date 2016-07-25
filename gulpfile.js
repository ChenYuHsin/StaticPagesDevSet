var gulp= require('gulp'),
	connect= require('gulp-connect');
  compass   = require('gulp-compass');

gulp.task('compass',function(){
  gulp.src('sass/*.*')
    .pipe(compass({
// config_file: './style/scss/config.rb',
        css: './build',   //輸出位置
        sass: 'sass/',  //來源位置
        style: 'compact', //nested, expanded, compact, compressed 壓縮格式
				comments: false, //是否要註解 預設為true
          }))
          .pipe(gulp.dest('./build')); //輸出位置，非必要

});

gulp.task('server',function(){
	connect.server({
		livereload:true,
	});
});

gulp.task('reload',function(){
	gulp.src('*.html')
		.pipe(connect.reload());
});

gulp.task('watch',function(){
	gulp.watch('*.html',['reload']);
  gulp.watch('sass/*.*',['compass']);
  gulp.watch('build/*.css',['reload']);
});

gulp.task('default',['server','watch']);

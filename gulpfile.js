// 載入 plugins
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    notify       = require('gulp-notify'),
    del          = require('del'),
    connect      = require('gulp-connect'),
    cache        = require('gulp-cache'),
    htmlmin      = require('gulp-htmlmin'),
    runSeq       = require('run-sequence');



// 路徑變數
var dirs ={
  src: "src",
  dest: "dist"
};

var stylePath = {
  srcFiles: dirs.src + "/scss/*.scss",
  dest: dirs.dest + "/css"
};

var scriptPath = {
  srcFiles: dirs.src + "/js/*.js",
  dest: dirs.dest + "/js"
};

var imgPath = {
  srcFiles: dirs.src + "/img/*/*",
  dest: dirs.dest + "/img"
};

// 編譯 SCSS 、加前綴並壓縮
gulp.task('processSCSS', function() {
  return gulp.src(stylePath.srcFiles)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: true,
      remove: true
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(stylePath.dest))
    .pipe(notify({ message: 'SCSS processed' }))
    .pipe(connect.reload());
});

// 檢查 js 並 uglify
gulp.task('processJS', function() {
  return gulp.src(scriptPath.srcFiles)
    .pipe(jshint('.jshintrc')) //讀取jshint設定檔，可以自訂檢查輸出項目
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(gulp.dest(scriptPath.dest))
    .pipe(notify({message:'js processed'}))
    .pipe(connect.reload());
});

// 壓縮圖片檔
gulp.task('processIMG', function() {
  return gulp.src(imgPath.srcFiles)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(imgPath.dest))
    .pipe(notify({ message: 'images processed'}))
    .pipe(connect.reload());
});

// 壓縮 HTML
gulp.task('processHTML', function () {
    var options = {
        removeComments: true,//清除HTML註釋
        collapseWhitespace: true,//壓縮HTML
        collapseBooleanAttributes: true,//省略布爾屬性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//刪除所有空格作屬性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//刪除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//刪除<style>和<link>的type="text/css"
        minifyJS: true,//壓縮頁面JS
        minifyCSS: true//壓縮頁面CSS
    };
    return gulp.src(dirs.src+'/index.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./'))
        .pipe(notify({message:"HTML processed"}))
        .pipe(connect.reload());
});



// 清掉舊的 dist 資料夾，並免不必要的錯誤
gulp.task('cleanDist', function() {
  return del([dirs.dest]);
});

// 開啟俱 LiveReload 的 web server
gulp.task('runServer',function(){
	connect.server({
		livereload:true,
    port: 8888,
	});
});

// 重新整理 index.html
gulp.task('reloadIndex',function(){
	return gulp.src('./index.html')
		.pipe(connect.reload())
    .pipe(notify({message:'index.html reloaded'}));
});


// Default task
gulp.task('default', function(cb){
  runSeq('cleanDist',
  ['processSCSS','processJS','processIMG','processHTML'],
  'watch',
  cb)
});

// Watch
gulp.task('watch', ['runServer'], function() {
  // Watch .scss files
  gulp.watch(stylePath.srcFiles, ['processSCSS']);
  // Watch .js files
  gulp.watch(scriptPath.srcFiles, ['processJS']);
  // Watch image files
  gulp.watch(imgPath.srcFiles,['processIMG']);
  // Watch index.html
  gulp.watch(dirs.src+'/index.html', ['processHTML']);
});

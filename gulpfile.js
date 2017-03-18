/*!
 * gulp
 * npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */


// Load plugins
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    del          = require('del'),
    connect      = require('gulp-connect'),
    cache        = require('gulp-cache'),
    htmlmin      = require('gulp-htmlmin');



// 路徑變數
var mainDirs ={
  src: "src",
  dest: "dist"
};

var stylePath = {
  src: mainDirs.src + "/scss/*.scss",
  dest: mainDirs.dest + "/css"
};

var scriptPath = {
  src: mainDirs.src + "/js/*.js",
  dest: mainDirs.dest + "/js"
};

var imgPath = {
  src: mainDirs.src + "/img/*/*",
  dest: mainDirs.dest + "/img"
};

var htmlPath = {
  src: mainDirs.src + "/index.html",
  dest: mainDirs.dest
};


// 編譯scss
gulp.task('processSCSS', function() {
  return gulp.src(stylePath.src)
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

// 檢查 js並合併壓縮
gulp.task('processJS', function() {
  return gulp.src(scriptPath.src)
    .pipe(jshint('.jshintrc')) //讀取jshint設定檔，可以自訂檢查輸出項目
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(gulp.dest(scriptPath.dest))
    .pipe(notify({message:'js processed'}))
    .pipe(connect.reload());
});

// Images 壓縮圖片
gulp.task('processIMG', function() {
  return gulp.src(imgPath.src)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(imgPath.dest))
    .pipe(notify({ message: 'images processed'}))
    .pipe(connect.reload());
});

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
    return gulp.src(htmlPath.src+'/index.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(htmlPath.dest))
        .pipe(notify({message:"html optimized"}))
        .pipe(connect.reload());
});


// Clean 清掉舊的 dist 檔案，並免不必要的錯誤
gulp.task('cleanDist', function() {
  return del([mainDirs.dest]);
});

// 開啟含 livereload的 web_server
gulp.task('runServer',function(){
	connect.server({
		livereload:true,
    port: 8888,
	});
});

// 重新整理頁面
gulp.task('reloadIndex',function(){
	return gulp.src(mainDirs+'/index.html')
		.pipe(connect.reload())
    .pipe(notify({message:'index.html reloaded'}));
});


// Default task
gulp.task('default', ['cleanDist','processSCSS','processJS','processIMG','processHTML']);

// Watch
gulp.task('watch', ['server_on'], function() {
  // Watch .scss files
  gulp.watch(stylePath.src+'/*.scss', ['compile-scss']);
  // Watch .js files
  gulp.watch(scriptPath.src+'/*.js', ['optimize-js']);
  // Watch image files
  gulp.watch(imgPath.src+'/*',['optimize-img']);
  // Watch index.html
  gulp.watch(htmlPath+'/index.html', ['reload-index']);
});

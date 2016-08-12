/*!
 * gulp
 * npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
    connect = require('gulp-connect');
    htmlmin = require('gulp-htmlmin');
    gulp_sass= require('gulp-sass')


// 編譯scss
gulp.task('compile_scss', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(gulp_sass())
    .pipe(gulp.dest('src/css'))
    .pipe(notify({ message: 'compiled scss' }));
});

// 合併 *.min.css -> all.min.css
gulp.task('combine_css',['compile_scss'],function(){
  return gulp.src('src/css/*.css')
    .pipe(concat('all.css'))
    .pipe(cssnano())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({message:'combine_css is done.'}));
    //.pipe(connect.reload())
    //.pipe(notify({message:"reload complete"}));
});

// 檢查 js並合併壓縮
gulp.task('optimize_js', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint('.jshintrc')) //讀取jshint設定檔，可以自訂檢查輸出項目
    .pipe(jshint.reporter('default'))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('src/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task complete' }));
    //.pipe(connect.reload())
    //.pipe(notify({message:"reload complete"}));
});

// Images 壓縮圖片
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
    //.pipe(connect.reload())
    //.pipe(notify({message:"reload complete"}));
});

gulp.task('html', function () {
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
    return gulp.src('src/index.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
        //.pipe(connect.reload())
        //.pipe(notify({message:"reload complete"}));
});


// Clean 清掉舊的 dist 檔案，並免不必要的錯誤
gulp.task('clean', function() {
  return del(['dist/css', 'dist/js', 'dist/images']);
});

// 開啟含 livereload的 web_server
gulp.task('server_on',function(){
	connect.server({
		livereload:true,
	});
});

// 重新整理頁面
gulp.task('reload',function(){
	return gulp.src('dist/index.html')
		.pipe(connect.reload())
    .pipe(notify({message:'reload completed'}));
});


// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('combine_css', 'optimize_js', 'images','html');
});

// Watch
gulp.task('watch', ['server_on'], function() {

  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['combine_css']);

  // Watch .js files
  gulp.watch('src/js/*.js', ['optimize_js']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  gulp.watch('src/index.html', ['html']);

  // Watch any files in dist/, reload on change
  gulp.watch('dist/**',['reload']);

});


/*目前這種配置的問題在於 watch監看檔案變化時，無法在適當的時機
reload。因為我單獨把 reload寫成一個 task，而在 watch後只能執
行一個 task...


本來希望：
  watch監看
    檔案變化 -> 先處理（編譯scss或壓縮合併之類的） -> reload

*/

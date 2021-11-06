const gulp = require('gulp');
const del = require('del');
// pug потом можно подключить
const gulpSass = require('gulp-sass')(require('sass'));
const gulpAutoprefixer = require('gulp-autoprefixer');
// gulp babel потом можно подключить
const gulpImageMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();


function delBuild() {
   return del('build');
}

function fonts(){
   return gulp.src('#dev/fonts/**/*.*')
      .pipe(gulp.dest('build/fonts'));
}

function html() {
   return gulp.src('#dev/index.html')
      .pipe(gulp.dest('build'));
}

function normalize() {
   return gulp.src('#dev/scss/normalize.css')
      .pipe(gulp.dest('build/css'));
}

function scss2css() {
   return gulp.src('#dev/scss/style.scss')
      .pipe(gulpSass())
      .pipe(gulpAutoprefixer())
      .pipe(browserSync.stream())
      .pipe(gulp.dest('build/css'));
}

function script() {
   return gulp.src('#dev/js/script.js')
      .pipe(browserSync.stream())
      .pipe(gulp.dest('build/js'));
}

function imageMin() {
   return gulp.src([
      '#dev/img/**/*.{jpg,jpeg,gif,png,svg}',
      '!#dev/img/sprites/*',])
      .pipe(gulpImageMin([
         gulpImageMin.gifsicle({ interlaced: true }),
         gulpImageMin.mozjpeg({ quality: 75, progressive: true }),
         gulpImageMin.optipng({ optimizationLevel: 5 }),
         gulpImageMin.svgo({
            plugins: [
               { removeViewBox: true },
               { cleanupIDs: false }
            ]
         })
      ]))
      .pipe(gulp.dest('build/img/'))
}

function watch (){
   browserSync.init({
      server: {
         baseDir: "build"
      },
      notify: false
   });

   gulp.watch('#dev/*.html', html);
   gulp.watch('#dev/scss/*.scss', scss2css);
   gulp.watch('#dev/img/**/*.{jpg,jpeg,gif,png,svg}', imageMin);
   gulp.watch('#dev/js/*.js', script);
   gulp.watch('build/*.html').on('change', browserSync.reload);
}

exports.default = gulp.series(delBuild, fonts, html, normalize, scss2css, imageMin, script, watch);

// добавить удаление папки
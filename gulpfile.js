const { src, dest, watch, parallel, series } = require('gulp');

const scss           = require('gulp-sass')(require('sass'));
const browserSync    = require('browser-sync').create();
const autoprefixer   = require('gulp-autoprefixer');
const imagemin       = require('gulp-imagemin');
const del            = require('del');


function browsersync() {
   browserSync.init({
      server: {
         baseDir: 'app/'
      }
   });
}

function cleanDist () {
   return del('dist')
}

function images() {
   return src('app/img/**/*')
      .pipe(imagemin(
         [
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
               plugins: [
                  { removeViewBox: true },
                  { cleanupIDs: false }
               ]
            })
         ]
      ))
      .pipe(dest('dist/img'))
}

function styles() {
   return src('app/scss/style.scss')
      .pipe(scss({outputStyle: 'expanded'}))
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 10 version'],
         grid: true
      }))
      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
}

function scripts() {
   return src('app/js/main.js')
      .pipe(browserSync.stream())
}

function build() {
   return src([
      'app/css/style.css',
      'app/fonts/**/*',
      'app/js/main.js',
      'app/*.html',
   ], {base: 'app'})
      .pipe(dest('dist'))
}

function watching() {
   watch(['app/scss/**/*.scss'], styles);
   watch(['app/js/*.js'], scripts);
   watch(['app/*.html']).on('change', browserSync.reload);
}


exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);
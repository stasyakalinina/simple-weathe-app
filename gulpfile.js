const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// const path = {
//   sourcePath: "./src",
//   buildPath: "./build",
//   scssPath: "/style",
//   cssPath: "/css",
//   jsPath: "/js",
//   jsModulesPath: "/modules",
//   imgPath: "/img",
//   svgPath: "/svg",
//   fontsPath: "/fonts",
//   fontsPattern: "/**/*.{woff,woff2}",
//   imgPattern: "/**/*.{jpg,jpeg,png,gif}",
//   scssPattern: "/**/*.{scss,sass}",
//   svgPattern: "/*.svg",
//   htmlPattern: "/**/!(_)*.html",
//   jsPattern: "/**/!(_)*.js"
// };

gulp.task('styles', () => {
  return gulp.src('./src/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(plumber())
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('styles.css'))
  .pipe(postcss([autoprefixer()]))
  .pipe(csso())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp.src('./src/**/*.js')
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream());
});

gulp.task("compress", () => {
  return gulp.src('./src/img/**/*.{jpg,jpeg,png,gif,svg}', { since: gulp.lastRun("compress") })
    .pipe(imagemin([
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.svgo(),
      imagemin.optipng({
        optimizationLevel: 3
      })
    ]))
    .pipe(gulp.dest('./build/img'));
});

gulp.task("copy", () => {
  return gulp.src(['./src/fonts/**/*.{woff,woff2}'], {
    base: path.sourcePath,
    since: gulp.lastRun("copy")
  })
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('clean', () => {
  return del(['build/*']);
});

gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('./src/**/*.scss', gulp.series('styles'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('scripts'));
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('build', gulp.series('clean','styles','scripts', 'copy', 'compress'));

gulp.task('dev', gulp.series('styles', 'scripts', 'watch'));

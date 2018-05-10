const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')

gulp.task('css', function () {
  gulp.src('./src/*.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie > 8']
    }))
    .pipe(cleanCSS())
    .pipe(rename('ife.css'))
    .pipe(gulp.dest('./lib'))
})

gulp.task('default', ['css'])

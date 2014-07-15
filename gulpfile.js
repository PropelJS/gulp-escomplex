var gulp = require('gulp');
var complexity = require('./index');

gulp.task('complexity', function () {
  return gulp.src([
    'index.js',
    'gulpfile.js'
  ])
  .pipe(complexity())
  .pipe(gulp.dest('./complexity'));
});

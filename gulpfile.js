var gulp = require('gulp');
var complexity = require('./index');

gulp.task('complexity', function () {
  return gulp.src([
    'index.js'
  ])
  .pipe(complexity());
});

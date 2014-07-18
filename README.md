# Code Complexity Analysis for Gulp

This module does static analysis of source files and prepares them for a `reporter`.

See also: [gulp-escomplex-reporter-json](https://github.com/JerrySievert/gulp-escomplex-reporter-json)

It uses `escomplex` to do the heavy lifting.

## Installing

```
$ npm install gulp-escomplex
```

## Usage

```
gulp.task('complexity', function () {
  return gulp.src([
    'index.js',
    'gulpfile.js'
  ])
  .pipe(complexity({
    packageName: 'gulp-escomplex',
    packageVersion: '1.0.1beta4'
  }));
});
```

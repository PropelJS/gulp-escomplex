// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var escomplex = require('escomplex');
var esprima = require('esprima');
var walker = require('escomplex-ast-moz');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-escomplex';

function prefixStream() {
  var stream = through();
  return stream;
}

function getSyntaxTree(source) {
  return esprima.parse(source, {
    loc: true
  });
}

function performAnalysis(ast, options) {
  return escomplex.analyse(ast, walker, options);
}

function analyseSource(source, options) {
  return performAnalysis(getSyntaxTree(source), options);
}

// Plugin level function(dealing with files)
function gulpESComplex() {

  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if (file.isNull()) {
      // Do nothing if no contents
    }
    if (file.isBuffer()) {
      file.contents = file.contents;
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(prefixStream());
    }

    console.log(analyseSource(file.contents.toString('utf-8'), {}));
    console.log(file.path, file.cwd, file.path.split(file.cwd)[1]);
    this.push(file);
    return callback();

  });

  // returning the file stream
  return stream;
}

// Exporting the plugin main function
module.exports = gulpESComplex;

var through = require('through2');
var gutil = require('gulp-util');
var escomplex = require('escomplex');
var esprima = require('esprima');
var walker = require('escomplex-ast-moz');

var json = require('./lib/json');

var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-escomplex';

function getSyntaxTree (source) {
  return esprima.parse(source, {
    loc: true
  });
}

function performAnalysis (ast, options) {
  return escomplex.analyse(ast, walker, options);
}

function analyseSource (source, options) {
  return performAnalysis(getSyntaxTree(source), options);
}

// Plugin level function(dealing with files)
function gulpESComplex (options) {
  // setup defaults
  options = options || { };

  // define newmi by default
  options.complexity = options.complexity || { };
  options.complexity.newmi = (
    (options.complexity.newmi !== undefined && !!!options.complexity.newmi !== false) ?
    options.complexity.newmi : true
  );

  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if (file.isNull()) {
      // Do nothing if no contents
    }
    if (file.isBuffer()) {
      file.contents = file.contents;
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(through());
    }

    var analysis = analyseSource(file.contents.toString('utf-8'), options.complexity);
    file.contents = new Buffer(JSON.stringify(analysis));

    this.push(file);

    callback();
  });

  // returning the file stream
  return stream;
}

// Exporting the plugin main function
module.exports = gulpESComplex;

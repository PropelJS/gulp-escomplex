'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var escomplex = require('escomplex-js');

var pack = require('./package.json');

var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-escomplex';

function analyseSource (source, options) {
  return escomplex.analyse(source, options);
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
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if (!file.isNull()) {
      var analysis = analyseSource(file.contents.toString('utf-8'), options.complexity);
      analysis.meta = {
        analysis: pack.name,
        analysisVersion: pack.version
      };

      if (options.packageName) {
        analysis.meta.packageName = options.packageName;
      }

      if (options.packageVersion) {
        analysis.meta.packageVersion = options.packageVersion;
      }

      analysis.meta.fileName = file.relative;

      file.analysis = new Buffer(JSON.stringify(analysis));
    }


    this.push(file);

    callback();
  });

  // returning the file stream
  return stream;
}

// Exporting the plugin main function
module.exports = gulpESComplex;

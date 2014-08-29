var test = require('tape'),
    vinyl = require('vinyl'),
    complex = require('../');

var textContentsInput = 'function foo (test) { console.log(test); }';

var testFile = new vinyl({
  cwd: "/home/jerry/work",
  base: "/home/jerry/work/test",
  path: "/home/jerry/work/test/file.js",
  contents: new Buffer(textContentsInput)
});

test('should run complexity on files', function (t) {
  t.plan(8);

  var stream = complex();
  stream.on('data', function (newFile) {
    t.ok(newFile, 'emits a file');
    t.ok(newFile.path, 'file has a path');
    t.ok(newFile.contents, 'file has contents');
    t.ok(newFile.analysis, 'file has complexity information');
    t.ok(newFile instanceof vinyl, 'file is Vinyl');
    t.ok(newFile.analysis instanceof Buffer, 'file analysis are a buffer');

    var analysis = JSON.parse(newFile.analysis.toString('utf8'));

    t.ok(analysis.aggregate, 'analysis should have an aggregate');
    t.equal(analysis.meta.fileName, 'file.js', 'fileName should be correct');
  });

  stream.write(testFile);
});

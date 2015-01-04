"use strict";

var grunt = require("grunt"),
    path = require("path");

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.tsc = {

  setUp: function(done) {
    // setup here if necessary
    done();
  },

  options_default: function(test) {
    var name = "options_default",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build []");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10: function(test) {
    var name = "options_v1.0",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11: function(test) {
    var name = "options_v1.1",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13: function(test) {
    var name = "options_v1.3",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14: function(test) {
    var name = "options_v1.4",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest: function(test) {
    var name = "options_ver_latest",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default: function(test) {
    var name = "options_ver_default",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10_sourcemap: function(test) {
    var name = "options_v1.0_sourcemap",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11_sourcemap: function(test) {
    var name = "options_v1.1_sourcemap",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13_sourcemap: function(test) {
    var name = "options_v1.3_sourcemap",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_sourcemap: function(test) {
    var name = "options_v1.4_sourcemap",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_sourcemap: function(test) {
    var name = "options_ver_latest_sourcemap",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default_sourcemap: function(test) {
    var name = "options_ver_default_sourcemap",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10_sourcemap_declaration: function(test) {
    var name = "options_v1.0_sourcemap_declaration",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources,declaration=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11_sourcemap_declaration: function(test) {
    var name = "options_v1.1_sourcemap_declaration",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources,declaration=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13_sourcemap_declaration: function(test) {
    var name = "options_v1.3_sourcemap_declaration",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources,declaration=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_sourcemap_declaration: function(test) {
    var name = "options_v1.4_sourcemap_declaration",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources,declaration=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_sourcemap_declaration: function(test) {
    var name = "options_ver_latest_sourcemap_declaration",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources,declaration=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default_sourcemap_declaration: function(test) {
    var name = "options_ver_default_sourcemap_declaration",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default,sourcemap=true,mapRoot=/public/maps,sourceRoot=/public/sources,declaration=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10_comments_off: function(test) {
    var name = "options_v1.0_comments_off",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0,comments=false]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11_comments_off: function(test) {
    var name = "options_v1.1_comments_off",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1,comments=false]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13_comments_off: function(test) {
    var name = "options_v1.3_comments_off",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3,comments=false]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_comments_off: function(test) {
    var name = "options_v1.4_comments_off",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,comments=false]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_comments_off: function(test) {
    var name = "options_ver_latest_comments_off",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,comments=false]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default_comments_off: function(test) {
    var name = "options_ver_default_comments_off",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default,comments=false]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10_comments_on: function(test) {
    var name = "options_v1.0_comments_on",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0,comments=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11_comments_on: function(test) {
    var name = "options_v1.1_comments_on",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1,comments=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13_comments_on: function(test) {
    var name = "options_v1.3_comments_on",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3,comments=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_comments_on: function(test) {
    var name = "options_v1.4_comments_on",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,comments=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_comments_on: function(test) {
    var name = "options_ver_latest_comments_on",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,comments=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default_comments_on: function(test) {
    var name = "options_ver_default_comments_on",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default,comments=true]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10_es3: function(test) {
    var name = "options_v1.0_es3",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0,target=es3]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11_es3: function(test) {
    var name = "options_v1.1_es3",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1,target=es3]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13_es3: function(test) {
    var name = "options_v1.3_es3",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3,target=es3]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_es3: function(test) {
    var name = "options_v1.4_es3",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,target=es3]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_es3: function(test) {
    var name = "options_ver_latest_es3",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,target=es3]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default_es3: function(test) {
    var name = "options_ver_default_es3",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default,target=es3]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10_es6: function(test) {
    var name = "options_v1.0_es6",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0,target=es5]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11_es5: function(test) {
    var name = "options_v1.1_es5",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1,target=es5]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13_es5: function(test) {
    var name = "options_v1.3_es5",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3,target=es5]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_es5: function(test) {
    var name = "options_v1.4_es5",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,target=es5]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_es5: function(test) {
    var name = "options_ver_latest_es5",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,target=es5]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default_es5: function(test) {
    var name = "options_ver_default_es5",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default,target=es5]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_es6: function(test) {
    var name = "options_v1.4_es6",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,target=es6]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_es6: function(test) {
    var name = "options_ver_latest_es6",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,target=es6]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v10_target_latest: function(test) {
    var name = "options_v1.0_target_latest",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.0,target=latest]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v11_target_latest: function(test) {
    var name = "options_v1.1_target_latest",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.1,target=latest]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v13_target_latest: function(test) {
    var name = "options_v1.3_target_latest",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.3,target=latest]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_v14_target_latest: function(test) {
    var name = "options_v1.4_target_latest",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=1.4,target=latest]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_latest_target_latest: function(test) {
    var name = "options_ver_latest_target_latest",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=latest,target=latest]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  },

  options_ver_default_target_latest: function(test) {
    var name = "options_ver_default_target_latest",
        expected = grunt.file.expand(
            {
              cwd: path.join("tests/expected", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort(),
        dest = grunt.file.expand(
            {
              cwd: path.join("tests/dest", name),
              filter: function (filename) {
                return grunt.file.isFile(filename);
              }
            },
            ["*", "**/*"]
        ).sort();
    test.expect(expected.length + 1);
    test.deepEqual(expected, dest, "Checking file names in build [version=default,target=latest]");
    expected.forEach(function (filename) {
      var expected = grunt.file.read(path.join("tests/expected", name, filename)),
          dest = grunt.file.read(path.join("tests/dest", name, filename));
      test.equal(expected, dest, "Checking file [" + filename + "]");
    });
    test.done();
  }

};

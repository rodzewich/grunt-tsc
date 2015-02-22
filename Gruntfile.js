/*global module, require, process, setTimeout */

var fs      = require("fs"),
    spawn   = require("child_process").spawn,
    path    = require("path"),
    rows    = process.stdout.rows,
    columns = process.stdout.columns,
    cwd     = process.cwd();

process.stdout.on('resize', function () {
    "use strict";
    rows    = process.stdout.rows;
    columns = process.stdout.columns;
});

module.exports = function (grunt) {
    "use strict";

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: [
                'Gruntfile.js',
                'src/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
            options: {
                banner: grunt.file.read("src/banner.txt")
            },
            compile: {
                files: [
                    {
                        expand : false,
                        dest   : "tasks/tsc.js",
                        src    : "src/*.js"
                    }
                ]
            }
        },
        // Build test data.
        tsc: grunt.file.readJSON("tests/fixtures.json"),
        // Unit tests.
        nodeunit: {
            tests: ['tests/*_test.js']
        },
        // Clean temp files.
        clean: {
            tests: ['tests/dest']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('src');

    grunt.registerTask("download", "Download libraries.", function () {
        var done            = this.async(),
            project         = "https://github.com/Microsoft/TypeScript.git",
            versions        = {},
            tempExists      = false,
            tempIsFile      = false,
            tempIsDirectory = false,
            binExists       = false,
            binIsFile       = false,
            binIsDirectory  = false,
            additionalVersion;
        function typeOf(value) {
            var type  = String(Object.prototype.toString.call(value) || '').slice(8, -1) || 'Object',
                types = ['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function', 'Null', 'Number', 'Object', 'String', 'Undefined'];
            if (types.indexOf(type) !== -1) {
                type = type.toLowerCase();
            }
            return type;
        }
        function deferred(actions) {
            function iterate() {
                setTimeout(function () {
                    var action = actions.shift();
                    if (typeOf(action) === "function") {
                        action(iterate);
                    }
                }, 0);
            }
            iterate();
        }
        function displayPropertyWithPadding(property, value) {
            var array = new Array(10 - property.length);
            grunt.log.writeln(array.join(" ") + property.green + " " + value);
        }
        function mkdir(dir, callback) {
            deferred([
                function (iterate) {
                    fs.exists(dir, function (exists) {
                        if (exists) {
                            callback(null);
                        } else {
                            iterate();
                        }
                    });
                },
                function () {
                    mkdir(path.dirname(dir), function (error) {
                        if (error) {
                            callback(error);
                        } else {
                            fs.mkdir(dir, function (error) {
                                callback(error || null);
                            });
                        }
                    });
                }
            ]);
        }
        function copy(path1, path2, callback) {
            var content;
            deferred([
                function (next) {
                    mkdir(path.join(cwd, path.dirname(path2)), function (error) {
                        if (error) {
                            callback(error);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.readFile(path1, function (error, data) {
                        if (error) {
                            callback(error);
                        } else {
                            content = data;
                            next();
                        }
                    });
                },
                function (next) {
                    fs.writeFile(path2, content, function (error) {
                        if (error) {
                            callback(error);
                        } else {
                            next();
                        }
                    });
                },
                function () {
                    callback(null);
                }
            ]);
        }
        function displayError(error) {
            grunt.log.write(">>".red + " " + String(error.name).red + " " + error.message);
        }
        function displayErrorContent(content) {
            content.split(/(?:\n|\r)+/).forEach(function (item) {
                item = item.replace(/\s+$/, "");
                item = item.replace(/\s+/, " ");
                if (item) {
                    while (item) {
                        item = item.replace(/^\s+/, "");
                        grunt.log.write(">>".red + " ");
                        grunt.log.writeln(item.substr(0, columns - 3));
                        item = item.substr(columns - 3);
                    }
                }
            });
        }
        deferred([
            // create "bin" directory
            function (next) {
                fs.exists("bin", function (exists) {
                    binExists = exists;
                    next();
                });
            },
            function (next) {
                if (binExists) {
                    fs.stat("bin", function (error, stats) {
                        if (error) {
                            displayError(error);
                            done(false);
                        } else {
                            binIsDirectory = stats.isDirectory();
                            binIsFile = !stats.isDirectory();
                            next();
                        }
                    });
                } else {
                    next();
                }
            },
            function (next) {
                var remove,
                    errors = [];
                if (binIsFile) {
                    fs.unlink("bin", function (error) {
                        if (error) {
                            displayError(error);
                            done(false);
                        } else {
                            next();
                        }
                    });
                } else if (binIsDirectory) {
                    remove = spawn("rm", ["-rf", "bin"]);
                    remove.stdout.on("data", function (data) {
                        errors.push(data.toString("utf8"));
                    });
                    remove.stderr.on("data", function (data) {
                        errors.push(data.toString("utf8"));
                    });
                    remove.on("close", function (code) {
                        if (code !== 0) {
                            displayErrorContent(errors.join(""));
                            done(true);
                        } else {
                            next();
                        }
                    });
                } else {
                    next();
                }
            },
            function (next) {
                fs.mkdir("bin", function (error) {
                    if (error) {
                        displayError(error);
                        done(false);
                    } else {
                        displayPropertyWithPadding("create", path.join(cwd, "bin"));
                        next();
                    }
                });
            },
            // create "temp" directory
            function (next) {
                fs.exists("temp", function (exists) {
                    tempExists = exists;
                    next();
                });
            },
            function (next) {
                if (tempExists) {
                    fs.stat("temp", function (error, stats) {
                        if (error) {
                            displayError(error);
                            done(false);
                        } else {
                            tempIsDirectory = stats.isDirectory();
                            tempIsFile = !stats.isDirectory();
                            next();
                        }
                    });
                } else {
                    next();
                }
            },
            function (next) {
                var remove,
                    errors = [];
                if (tempIsFile) {
                    fs.unlink("temp", function (error) {
                        if (error) {
                            displayError(error);
                            done(false);
                        } else {
                            next();
                        }
                    });
                } else if (tempIsDirectory) {
                    remove = spawn("rm", ["-rf", "temp"]);
                    remove.stdout.on("data", function (data) {
                        errors.push(data.toString("utf8"));
                    });
                    remove.stderr.on("data", function (data) {
                        errors.push(data.toString("utf8"));
                    });
                    remove.on("close", function (code) {
                        if (code !== 0) {
                            displayErrorContent(errors.join(""));
                            done(false);
                        } else {
                            next();
                        }
                    });
                } else {
                    next();
                }
            },
            function (next) {
                fs.mkdir("temp", function (error) {
                    if (error) {
                        displayError(error);
                        done(false);
                    } else {
                        displayPropertyWithPadding("create", path.join(cwd, "temp"));
                        next();
                    }
                });
            },
            // checkout project
            function (next) {
                var errors = [],
                    process = spawn("/usr/bin/env", ["git", "clone", project, "temp"]);
                process.stdout.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                process.stderr.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                process.on("close", function (code) {
                    if (code !== 0) {
                        displayErrorContent(errors.join(""));
                        done(false);
                    } else {
                        displayPropertyWithPadding("checkout", project);
                        next();
                    }
                });
            },
            function (next) {
                var errors  = [],
                    process = spawn("/usr/bin/env", ["git", "checkout", "master"], {cwd: "temp"});
                process.stdout.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                process.stderr.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                process.on("close", function (code) {
                    if (code !== 0) {
                        displayErrorContent(errors.join(""));
                        done(false);
                    } else {
                        next();
                    }
                });
            },
            function (next) {
                var process = spawn("/usr/bin/env", ["git", "pull"], {cwd: "temp"}),
                    errors  = [];
                process.stdout.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                process.stderr.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                process.on("close", function (code) {
                    if (code !== 0) {
                        displayErrorContent(errors.join(""));
                        done(false);
                    } else {
                        next();
                    }
                });
            },
            function (next) {
                var content = "",
                    process = spawn("/usr/bin/env", ["git", "branch", "-a", "--no-color"], {cwd: "temp"}),
                    errors  = [];
                process.stdout.on("data", function (data) {
                    content += data.toString("utf8");
                    errors.push(data.toString("utf8"));
                });
                process.stderr.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                process.on("close", function (code) {
                    var temp = [];
                    if (code !== 0) {
                        displayErrorContent(errors.join(""));
                        done(false);
                    } else {
                        content.split("\n").forEach(function (version) {
                            if (/^\s+\S+\/release-\d+\.\d+(?:\.\d+)?$/.test(version)) {
                                temp.push(version.replace(/^\s+\S+\/release-(\d+\.\d+(?:\.\d+)?)$/, "$1"));
                            }
                        });
                        temp.sort();
                        temp.forEach(function (version) {
                            versions[version.replace(/^(\d+\.\d+)(?:\.\d+)?$/, "$1")] = version;
                        });
                        versions.latest = "master";
                        versions.default = temp[temp.length - 2];
                        next();
                    }
                });
            },
            function (next) {
                var actions = [];
                Object.keys(versions).forEach(function (version) {
                    var branch = versions[version],
                        folder = path.join("bin", "v" + version);
                    if (branch !== "master") {
                        branch = "release-" + branch;
                    }
                    if (["default", "latest"].indexOf(version) !== -1) {
                        folder = path.join("bin", version);
                    }
                    actions.push(function (next) {
                        var errors = [],
                            process;
                        process = spawn("/usr/bin/env", ["git", "checkout", branch], {cwd: "temp"});
                        process.stdout.on("data", function (data) {
                            errors.push(data.toString("utf8"));
                        });
                        process.stderr.on("data", function (data) {
                            errors.push(data.toString("utf8"));
                        });
                        process.on("close", function (code) {
                            if (code !== 0) {
                                displayErrorContent(errors.join(""));
                                done(false);
                            } else {
                                next();
                            }
                        });
                    });
                    // copy bin files
                    actions.push(function (next) {
                        var stack = [],
                            files = [];
                        deferred([
                            function (next) {
                                fs.readdir("temp/bin", function (error, result) {
                                    if (error) {
                                        displayError(error);
                                        done(false);
                                    } else {
                                        result.forEach(function (filename) {
                                            if (filename === "tsc.js" || filename.substr(-5) === ".d.ts") {
                                                files.push(path.join("temp/bin", filename));
                                            }
                                        });
                                        next();
                                    }
                                });
                            },
                            function (next) {
                                files.forEach(function (filename) {
                                    stack.push(function (next) {
                                        var target = path.join(folder, path.basename(filename));
                                        copy(filename, target, function (error) {
                                            if (error) {
                                                displayError(error);
                                                done(false);
                                            } else {
                                                next();
                                            }
                                        });
                                    });
                                });
                                stack.push(function () {
                                    displayPropertyWithPadding("create", path.join(cwd, folder));
                                    next();
                                });
                                deferred(stack);
                            },
                            function () {
                                next();
                            }
                        ]);
                    });
                });
                actions.push(function () {
                    next();
                });
                deferred(actions);
            },
            function (next) {
                var content = "",
                    errors  = [],
                    args    = ["bin/latest/tsc.js"],
                    command;
                args.push("--version");
                command = spawn(process.execPath, args);
                command.stderr.on("data", function (data) {
                    errors.push(String(data || ""));
                });
                command.stdout.on("data", function (data) {
                    content += data.toString();
                    errors.push(String(data || ""));
                });
                command.on("close", function (code) {
                    if (code !== 0) {
                        displayErrorContent(errors.join("\n"));
                    } else {
                        if (/^.*version\s+(\S+).*$/im.test(content)) {
                            additionalVersion = content.replace(/^.*version\s+(\S+).*$/im, "$1").split("\r").join("").split("\n").join("").split(".").slice(0, 2).join(".");
                        }
                        next();
                    }
                });
            },
            function (next) {
                var content = "",
                    errors  = [],
                    command;
                if (typeOf(versions[additionalVersion]) === "undefined") {
                    command = spawn("cp", ["-R", "bin/latest", path.join("bin", "v" + additionalVersion)]);
                    command.stderr.on("data", function (data) {
                        errors.push(String(data || ""));
                    });
                    command.stdout.on("data", function (data) {
                        content += data.toString();
                        errors.push(String(data || ""));
                    });
                    command.on("close", function (code) {
                        if (code !== 0) {
                            displayErrorContent(errors.join("\n"));
                        } else {
                            versions[additionalVersion] = "master";
                            next();
                        }
                    });
                } else {
                    next();
                }
            },
            function (next) {
                var versionKeys = Object.keys(versions).sort();
                fs.writeFile("bin/versions.js", "/* Allow TypeScript versions */\nmodule.exports = [" + versionKeys.map(function (version) { return JSON.stringify(version); }).join(", ") + "];", {encoding: "utf8"}, function (error) {
                    if (error) {
                        displayError(error);
                        done(false);
                    } else {
                        next();
                    }
                });
            },
            // clean
            function (next) {
                var remove = spawn("rm", ["-rf", "temp"]),
                    errors = [];
                remove.stdout.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                remove.stderr.on("data", function (data) {
                    errors.push(data.toString("utf8"));
                });
                remove.on("close", function (code) {
                    if (code !== 0) {
                        displayErrorContent(errors.join(""));
                        done(false);
                    } else {
                        displayPropertyWithPadding("clean", path.join(cwd, "temp"));
                        next();
                    }
                });

            },
            // finish
            function () {
                done(true);
            }
        ]);
    });

    grunt.registerTask("test", "Test project.", ["tsc", "nodeunit", "clean:tests"]);
    grunt.registerTask("compile", "Compile project.", ["jshint:all", "uglify:compile"]);
    grunt.registerTask("default", "Build project.", ["download", "compile", "test"]);

};
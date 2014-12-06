/*jslint */
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

    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            options: {
                banner: grunt.file.read("src/banner.txt")
            },
            compile: {
                files: [{
                    expand : false,
                    dest   : "tasks/tsc.js",
                    src    : "src/*.js"
                }]
            }
        }
    });

    grunt.registerTask("update", "Update dependencies.", function () {
        var done            = this.async(),
            project         = "https://github.com/Microsoft/TypeScript.git",
            versions        = {},
            tempExists      = false,
            tempIsFile      = false,
            tempIsDirectory = false,
            binExists       = false,
            binIsFile       = false,
            binIsDirectory  = false;
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
                fs.mkdir("bin", parseInt("777", 8), function (error) {
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
                fs.mkdir("temp", parseInt("777", 8), function (error) {
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
                        versions.default = temp[0];
                        next();
                    }
                });
            },
            function (next) {
                fs.writeFile("bin/versions.js", "module.exports=" + JSON.stringify(Object.keys(versions)) + ";", {encoding: "utf8", mode: parseInt("666", 8)}, function (error) {
                    if (error) {
                        displayError(error);
                        done(false);
                    } else {
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
                    actions.push(function (next) {
                        var stack = [];
                        grunt.file.expand([
                            "temp/bin/*.d.ts",
                            "temp/bin/tsc.js"
                        ]).forEach(function (filename) {
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
                    });
                });
                actions.push(function () {
                    next();
                });
                deferred(actions);
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

    grunt.registerTask("compile", "Compile project.", ["uglify:compile"]);
    grunt.registerTask("default", "Build project.", ["update", "compile"]);

};
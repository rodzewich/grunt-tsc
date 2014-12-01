/*jslint */
/*global module, require, process, setTimeout */

var fs      = require("fs"),
    spawn   = require("child_process").spawn,
    path    = require("path"),
    rows    = process.stdout.rows,
    columns = process.stdout.columns;

process.stdout.on('resize', function () {
    "use strict";
    rows    = process.stdout.rows;
    columns = process.stdout.columns;
});

module.exports = function (grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            binaries: {
                files: [{
                    expand: true,
                    dest: "bin",
                    cwd: "temp/typescript/bin",
                    src: [
                        "*.d.ts",
                        "tsc.js"
                    ]
                }]
            }
        },
        uglify: {
            options: {
                banner: grunt.file.read("src/banner.txt")
            },
            tasks: {
                files: [{
                    expand : false,
                    dest   : "tasks/tsc.js",
                    src    : "src/*.js"
                }]
            }
        },
        clean: [
            "temp"
        ]
    });

    grunt.registerTask("dependencies", "Download source dependencies.", function () {
        var done = this.async();

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

        var exists,
            versions = {},
            binExists;

        deferred([
            function (next) {
                fs.exists("temp/typescript", function (result) {
                    exists = result;
                    next();
                });
            },
            function (next) {
                var process,
                    errors;
                if (!exists) {
                    process = spawn("/usr/bin/env", ["git", "clone", "https://github.com/Microsoft/TypeScript.git", "temp/typescript"]);
                    errors  = [];
                    process.stderr.on("data", function (data) {
                        errors.push(String(data || ""));
                    });
                    process.on("close", function (code) {
                        if (code !== 0) {
                            // todo: display errors
                        } else {
                            next();
                        }
                    });
                } else {
                    next();
                }
            },
            function (next) {
                var content = "",
                    process = spawn("/usr/bin/env", ["git", "checkout", "master"], {cwd: "temp/typescript"}),
                    errors  = [];
                process.stdout.on("data", function (data) {
                    content += data.toString("utf8");
                    errors.push(String(data || ""));
                });
                process.stderr.on("data", function (data) {
                    errors.push(String(data || ""));
                });
                process.on("close", function (code) {
                    if (code !== 0) {
                        // todo: display errors
                        console.log(errors.join("\n"));
                    } else {
                        next();
                    }
                });
            },
            function (next) {
                var process = spawn("/usr/bin/env", ["git", "pull"], {cwd: "temp/typescript"}),
                    errors  = [];
                process.stderr.on("data", function (data) {
                    errors.push(String(data || ""));
                });
                process.on("close", function (code) {
                    if (code !== 0) {
                        // todo: display errors
                        console.log(errors.join("\n"));
                    } else {
                        next();
                    }
                });
            },
            function (next) {
                var content = "",
                    process = spawn("/usr/bin/env", ["git", "branch", "-a", "--no-color"], {cwd: "temp/typescript"}),
                    errors  = [];
                process.stdout.on("data", function (data) {
                    content += data.toString("utf8");
                    errors.push(String(data || ""));
                });
                process.stderr.on("data", function (data) {
                    errors.push(String(data || ""));
                });
                process.on("close", function (code) {
                    var temp = [];
                    if (code !== 0) {
                        // todo: display errors
                        console.log(errors.join("\n"));
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
                fs.exists("bin", function (exists) {
                    binExists = exists;
                    next();
                });
            },
            function (next) {
                if (!binExists) {
                    fs.mkdir("bin", parseInt("777", 8), function (error) {
                        if (error) {
                            // todo: display error
                        } else {
                            next();
                        }
                    });
                } else {
                    next();
                }
            },
            function (next) {
                fs.writeFile("bin/versions.js", "module.exports=" + JSON.stringify(Object.keys(versions)) + ";", {encoding: "utf8", mode: parseInt("666", 8)}, function (error) {
                    if (error) {
                        // todo: display error
                        console.log(String(error));
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
                        var content = "",
                            errors  = [],
                            process;
                        process = spawn("/usr/bin/env", ["git", "checkout", branch], {cwd: "temp/typescript"});
                        process.stdout.on("data", function (data) {
                            content += data.toString("utf8");
                            errors.push(String(data || ""));
                        });
                        process.stderr.on("data", function (data) {
                            errors.push(String(data || ""));
                        });
                        process.on("close", function (code) {
                            if (code !== 0) {
                                // todo: display errors
                                console.log(errors.join("\n"));
                            } else {
                                next();
                            }
                        });
                    });
                    actions.push(function (next) {
                        grunt.file.expand([
                            "temp/typescript/bin/*.d.ts",
                            "temp/typescript/bin/tsc.js"
                        ]).forEach(function (filename) {
                            grunt.file.copy(filename, path.join(folder, path.basename(filename)));
                        });
                        next();
                    });
                });
                actions.push(function () {
                    next();
                });
                deferred(actions);
            },
            function () {
                done();
            }
        ]);
    });

    grunt.registerTask("default", "Build package.", ["uglify:tasks"]);
    grunt.registerTask("update", "Update source dependencies.", ["dependencies", "copy:binaries", "clean"]);

};
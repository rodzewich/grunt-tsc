/*jslint */
/*global module, require, process, setTimeout */

var fs      = require("fs"),
    spawn   = require("child_process").spawn,
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
        function showErrors(string) {
            string.split(/(?:\n|\r)+/).forEach(function (item) {
                item = item.replace(/\s+$/, '');
                item = item.replace(/\s+/, ' ');
                if (item) {
                    while (item) {
                        item = item.replace(/^\s+/, '');
                        grunt.log.write(' * '.yellow);
                        grunt.log.writeln(item.substr(0, columns - 3));
                        item = item.substr(columns - 3);
                    }
                }
            });
        }
        function cloneSources() {
            var process = spawn("/usr/bin/env", ["git", "clone", "https://github.com/Microsoft/TypeScript.git", "temp/typescript"]),
                errors  = [];
            process.stderr.on("data", function (data) {
                errors.push(String(data || ""));
            });
            process.on("close", function (code) {
                if (code !== 0) {
                    showErrors(errors.join("\n"));
                } else {
                    done();
                }
            });
        }
        function pullSources() {
            var process = spawn("/usr/bin/env", ["git", "pull"], {cwd: "temp/typescript"}),
                errors  = [];
            process.stderr.on("data", function (data) {
                errors.push(String(data || ""));
            });
            process.on("close", function (code) {
                if (code !== 0) {
                    showErrors(errors.join("\n"));
                } else {
                    done();
                }
            });
        }
        function checkExists2() {
            fs.stat("temp/typescript", function (error, stats) {
                if (error) {
                    // todo: stop process and show errors
                    throw new Error("bla bla bla");
                } else if (!stats.isDirectory()) {
                    // todo: stop process and show errors
                    throw new Error("bla bla bla");
                } else {
                    pullSources();
                }
            });
        }
        function checkExists1() {
            fs.exists("temp/typescript", function (exists) {
                if (!exists) {
                    cloneSources();
                } else {
                    checkExists2();
                }
            });
        }
        checkExists1();
    });

    grunt.registerTask("default", "Build package.", ["uglify:tasks"]);
    grunt.registerTask("update", "Update source dependencies.", ["dependencies", "copy:binaries", "clean"]);

};
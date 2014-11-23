/*jslint */
/*global module */

module.exports = function (grunt) {
    "use strict";

    grunt.loadTasks("../src");

    grunt.initConfig({
        tsc: {
            options: {
                target             : "es3",
                module             : "amd",
                declaration        : true,
                comments           : true,
                sourcemap          : true,
                implicitAny        : true,
                preserveConstEnums : false,
                sourceRoot         : "/public/sources",
                mapRoot            : "/public/maps",
                encoding           : "utf8",
                references         : [
                    "refs/*",
                    "refs/**/*"
                ]
            },
            task: {
                files: [
                    {
                        ext    : ".js",
                        expand : true,
                        dest   : "dest",
                        cwd    : "src",
                        src    : [
                            "*.ts",
                            "**/*.ts",
                            "!*.d.ts",
                            "!**/*.d.ts"
                        ]
                    },
                    {
                        expand : false,
                        dest   : "dest/core.js",
                        cwd    : "src",
                        src    : [
                            "*.ts",
                            "**/*.ts",
                            "!*.d.ts",
                            "!**/*.d.ts"
                        ]
                    }
                ]
            }
        }
    });

    grunt.registerTask("default", "Test all.", ["tsc"]);

};
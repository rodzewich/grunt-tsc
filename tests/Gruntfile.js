/*global module */

module.exports = function (grunt) {
    "use strict";

    grunt.loadTasks("../src");

    grunt.initConfig({
        tsc: {
            options: {
                library            : true,
                target             : "es5",
                module             : "amd",
                declaration        : true,
                comments           : true,
                sourcemap          : true,
                implicitAny        : true,
                preserveConstEnums : false,
                sourceRoot         : "/public/sources",
                mapRoot            : "/public/maps",
                encoding           : "utf8",
                version            : "1.4",
                //compiler           : "/usr/local/lib/node_modules/typescript/bin/tsc.js",
                references         : [
                    "refs/*",
                    "refs/**/*"
                ]
            },
            task1: {
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
/*jslint */
/*global module */

module.exports = function (grunt) {
    "use strict";

    grunt.loadTasks("../src");

    grunt.initConfig({
        tsc: {
            options: {
                library            : true,
                coreLibrary        : true,
                domLibrary         : true,
                scriptHostLibrary  : true,
                webWorkerLibrary   : true,
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
                compilerVersion    : "1.1",
                compiler           : "/usr/local/lib/node_modules/typescript/bin/tsc.js",
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
            },
            task2: {}
        }
    });

    grunt.registerTask("default", "Test all.", ["tsc"]);

};
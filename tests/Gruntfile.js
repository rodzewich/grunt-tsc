/*jslint */
/*global module */

module.exports = function (grunt) {
    "use strict";

    grunt.loadTasks("../src");

    grunt.initConfig({
        tsc: {
            options: {
                target             : "es6",
                module             : "amd",
                declaration        : true,
                comments           : true,
                sourcemap          : true,
                implicitAny        : true,
                preserveConstEnums : false,
                sourceRoot         : "/public/sources",
                mapRoot            : "/public/maps",
                encoding           : "utf8",
                compilerVersion    : "latest",
//                references         : [
//                    "refs/*",
//                    "refs/**/*"
//                ]
            },
            task1: {
                files: [
                    {
                        expand : true,
                        cwd    : "../../Class/xlib/utils",
                        dest   : "build/public",
                        ext    : ".js",
                        src    : [
                            "core.ts",
                            "utils/dom.ts",
                            "utils/deferred/*.ts",
                            "utils/deferred/**/*.ts",
                            "utils/loader/*.ts",
                            "utils/loader/**/*.ts",
                            "utils/require/*.ts",
                            "utils/require/**/*.ts",
                            "utils/storage/*.ts",
                            "utils/storage/**/*.ts",
                            "utils/service/*.ts",
                            "utils/service/**/*.ts",
                            "utils/dependency/*.ts",
                            "utils/dependency/**/*.ts",
                            "app/init/browser.ts",
                            "app/init/node.ts",
                            "!utils/loader/builder/browser/*.ts",
                            "!utils/loader/builder/browser/**/*.ts",
                            "!utils/loader/factory/browser/*.ts",
                            "!utils/loader/factory/browser/**/*.ts",
                            "!*.d.ts",
                            "!**/*.d.ts"
                        ]
                    },
                    {
                        expand : false,
                        dest   : "dest/core.js",
                        cwd    : "../../Class/xlib",
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
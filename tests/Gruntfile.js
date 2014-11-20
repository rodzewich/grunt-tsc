/*jslint */
/*global module */

module.exports = function (grunt) {
    "use struct";

    grunt.loadTasks("../src");

    grunt.initConfig({
        tsc: {
            options: {
                target             : "latest",
                module             : "commonjs",
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
                    }
                ]
            }
        }
    });

    grunt.registerTask("default", "Test all.", ["tsc"]);

};
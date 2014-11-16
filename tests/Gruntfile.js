/*jslint */
/*global module */

module.exports = function(grunt) {

    grunt.loadTasks('../src');

    grunt.loadNpmTasks('grunt-typescript');

    grunt.initConfig({
        tsc: {
            test1: {
                options: {
                    target: "es3",
                    module: "commonjs",
                    declaration: true,
                    comments: true,
                    sourcemap: true,
                    implicitAny: true,
                    preserveConstEnums: false,
                    sourceRoot: '',
                    mapRoot: '',
                    encoding: "utf8"
                },
                files: [
                    {
                        ext    : '.js',
                        expand : true,
                        dest   : 'dest',
                        cwd    : 'src',
                        src    : [
                            '*.ts',
                            '!*.d.ts'
                        ]
                    }
                ]
            }
        }
    });


    grunt.registerTask('default', 'Test all.', ['tsc']);

};
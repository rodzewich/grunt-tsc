/*jslint */
/*global module */

module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-git');

    grunt.initConfig({
        gitclone: {
            typescript: {
                options: {
                    repository: 'https://github.com/Microsoft/TypeScript.git',
                    branch: 'master',
                    directory: 'temp/typescript'
                }
            },
            xlib: {
                options: {
                    repository: 'https://github.com/rodzewich/Class.git',
                    branch    : 'master',
                    directory : 'temp/xlib'
                }
            }
        }
    });

};
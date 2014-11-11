/*jslint */
/*global module, require */

var fs = require('fs'),
    spawn = require('child_process').spawn;

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
            }
        }
    });

    grunt.registerTask('dependencies', function() {
        var done = this.async();
        function fetchSources() {
            var process = spawn('/usr/bin/env', ['git', 'clone', 'https://github.com/Microsoft/TypeScript.git', 'temp/typescript']);
            process.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
            });
            process.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            process.on('close', function (code) {
                console.log('child process exited with code ' + code);
            });
        }
        function updateSources() {
            var process = spawn('/usr/bin/env', ['git', 'pull'], {cwd: 'temp/typescript'});
            process.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
            });
            process.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            process.on('close', function (code) {
                console.log('child process exited with code ' + code);
            });
        }
        function checkExists2() {
            fs.stat('temp/typescript', function (error, stats) {
                if (error) {
                    // todo: stop process and show errors
                    throw new Error('bla bla bla');
                } else if (!stats.isDirectory()) {
                    // todo: stop process and show errors
                    throw new Error('bla bla bla');
                } else {
                    updateSources();
                }
            });
        }
        function checkExists1() {
            fs.exists('temp/typescript', function (exists) {
                if (!exists) {
                    fetchSources();
                } else {
                    checkExists2();
                }
            });
        }
        checkExists1();
    });

    grunt.registerTask('default', ['dependencies']);

};
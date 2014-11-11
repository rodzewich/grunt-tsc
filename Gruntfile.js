/*jslint */
/*global module, require */

var fs = require('fs'),
    spawn = require('child_process').spawn;

module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            binaries: {
                files: [{
                    expand: true,
                    dest: 'bin',
                    cwd: 'temp/typescript/bin',
                    src: '*'
                }]
            }
        },
        uglify: {
            options: {
                banner: grunt.file.read('banner.txt')
            },
            tasks: {
                files: [{
                    expand: false,
                    dest: 'tasks/tsc.js',
                    src: 'src/*.js'
                }]
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
                done();
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
                done();
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

    grunt.registerTask('default', ['dependencies', 'copy:binaries', 'uglify:tasks']);

};
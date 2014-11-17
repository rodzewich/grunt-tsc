/*jslint */
/*global module, require, setTimeout */

var spawn = require('child_process').spawn,
    path = require('path'),
    fs = require('fs');

// todo: noResolve
// todo: ignoreError
// todo: references
// todo: noLib
// see: https://www.npmjs.org/package/grunt-typescript

module.exports = function (grunt) {
    "use strict";

    grunt.registerMultiTask('tsc', 'Compile *.ts files', function () {

        var self = this,
            files = self.files,
            done = this.async(),
            time1 = Number(new Date()),
            countDeclarations = 0,
            countDestinations = 0,
            countMaps = 0,
            options,
            encoding,
            declaration,
            sourcemap,
            target,
            module,
            mapRoot,
            sourceRoot,
            compilerPath,
            comments,
            implicitAny,
            preserveConstEnums;

        compile();

        function getOptions() {
            if (typeof options === 'undefined') {
                options = self.options() || {};
            }
            return options;
        }

        function getTarget() {
            var options,
                temp;
            if (typeof target !== 'string') {
                options = getOptions();
                temp = String(options.target || '').toUpperCase();
                if (typeof options.target === 'undefined' || temp === 'DEFAULT') {
                    target = 'ES3';
                } else if (temp === 'LATEST') {
                    target = 'ES6';
                } else if (['ES3', 'ES5', 'ES6'].indexOf(temp) !== -1) {
                    target = temp;
                } else {
                    throw new Error('bla bla bla');
                }
            }
            return target;
        }

        function getModule() {
            var options,
                temp;
            if (typeof module !== 'string') {
                options = getOptions();
                temp = String(options.module || '').toLowerCase();
                if (typeof options.module === 'undefined') {
                    module = 'commonjs';
                } else if (['commonjs', 'amd'].indexOf(temp) !== -1) {
                    module = temp;
                } else {
                    throw new Error('bla bla bla');
                }
            }
            return module;
        }

        function getCompilerPath() {
            if (typeof compilerPath === 'undefined') {
                compilerPath = path.join(__dirname, '../bin/tsc.js');
            }
            return compilerPath;
        }

        function hasDeclaration() {
            var options;
            if (typeof declaration === 'undefined') {
                options = getOptions();
                if (typeof options.declaration === 'string') {
                    declaration = ['off', 'no', 'false', '0', ''].indexOf(String(options.declaration).toLowerCase()) === -1;
                } else {
                    declaration = !!options.declaration;
                }
            }
            return !!declaration;
        }

        function hasComments() {
            var options;
            if (typeof comments === 'undefined') {
                options = getOptions();
                if (typeof options.comments === 'undefined') {
                    comments = true;
                } else if (typeof options.comments === 'string') {
                    comments = ['off', 'no', 'false', '0', ''].indexOf(String(options.comments).toLowerCase()) === -1;
                } else {
                    comments = !!options.comments;
                }
            }
            return !!comments;
        }

        function hasSourceMap() {
            var options;
            if (typeof sourcemap === 'undefined') {
                options = getOptions();
                if (typeof options.sourcemap === 'string') {
                    sourcemap = ['off', 'no', 'false', '0', ''].indexOf(String(options.sourcemap).toLowerCase()) === -1;
                } else {
                    sourcemap = !!options.sourcemap;
                }
            }
            return !!sourcemap;
        }

        function hasImplicitAny() {
            var options;
            if (typeof implicitAny === 'undefined') {
                options = getOptions();
                if (typeof options.implicitAny === 'undefined') {
                    implicitAny = true;
                } else if (typeof options.implicitAny === 'string') {
                    implicitAny = ['off', 'no', 'false', '0', ''].indexOf(String(options.implicitAny).toLowerCase()) === -1;
                } else {
                    implicitAny = !!options.implicitAny;
                }
            }
            return !!implicitAny;
        }

        function hasPreserveConstEnums() {
            var options;
            if (typeof preserveConstEnums === 'undefined') {
                options = getOptions();
                if (typeof options.preserveConstEnums === 'string') {
                    preserveConstEnums = ['off', 'no', 'false', '0', ''].indexOf(String(options.preserveConstEnums).toLowerCase()) === -1;
                } else {
                    preserveConstEnums = !!options.preserveConstEnums;
                }
            }
            return !!preserveConstEnums;
        }

        function getSourceRoot() {
            if (typeof sourceRoot === 'undefined') {
                sourceRoot = String(options.sourceRoot || '') || null;
            }
            return sourceRoot;
        }

        function getMapRoot() {
            if (typeof mapRoot === 'undefined') {
                mapRoot = String(options.mapRoot || '') || null;
            }
            return mapRoot;
        }

        function getEncoding() {
            var options;
            if (typeof encoding === 'undefined') {
                options = getOptions();
                encoding = String(options.encoding || 'utf8') || 'utf8';
            }
            return encoding;
        }

        function getSize(value) {
            var suffix = ['B', 'K', 'M', 'G', 'T'],
                ext = suffix.shift(),
                useDot = false,
                temp;
            while (value > 1024) {
                value = value / 1024;
                ext = suffix.shift();
                useDot = true;
            }
            temp = String(value + 0.0001).split('.');
            return (temp[0] + (useDot ? '.' + temp[1].substr(0, 1) : '')) + ext;
        }

        function getCompilerVersion(callback) {
            var content = '',
                process = spawn('/usr/bin/env', ['node', getCompilerPath(), '--version']);
            process.stderr.on('data', function (data) {
                content += data.toString();
            });
            process.stdout.on('data', function (data) {
                content += data.toString();
            });
            process.on('close', function (code) {
                if (code !== 0) {
                    // todo: show error
                } else {
                    if (/^.*version\s+(\S+).*$/im.test(content)) {
                        callback(content.replace(/^.*version\s+(\S+).*$/im, '$1').split('\r').join('').split('\n').join(''));
                    } else {
                        callback('unknown');
                    }
                }
            });
        }

        // todo: delete
        function time(value) {
            var temp = String(value / 1000 + 0.0001).split('.');
            return temp[0] + (temp.length > 1 ? '.' + temp[1].substr(0, 3) : '.000') + 's';
        }

        function complete() {
            var count = countDestinations + countDeclarations + countMaps;
            grunt.log.writeln(
                [
                    '%count% files'.replace(/%count%/g, String(count)).cyan + ' created.',
                        ' js: ' + '%count% files'.replace(/%count%/g, String(countDestinations)).cyan + ',',
                        ' map: ' + '%count% files'.replace(/%count%/g, String(countMaps)).cyan + ',',
                        ' declaration: ' + '%count% files'.replace(/%count%/g, String(countDeclarations)).cyan + ' ',
                        '(354ms)'
                ].join('')
            );
            done(); // todo call by success result
        }

        function iterate(item) {
            var expand,
                destination,
                workingDirectory,
                sources;

            if (hasExpand()) {
                compileManyToMany();
            } else {
                compileManyToOne();
            }


            function hasExpand() {
                if (typeof expand === 'undefined') {
                    expand = !!item.orig.expand;
                }
                return expand;
            }

            function getSources() {
                if (typeof sources === 'undefined') {
                    sources = item.src;
                }
                return sources;
            }

            function getDestination() {
                if (typeof destination === 'undefined') {
                    destination = String(item.dest || '');
                }
                return destination;
            }

            function getWorkingDirectory() {
                if (typeof workingDirectory === 'undefined') {
                    workingDirectory = String(item.cwd || '');
                }
                return workingDirectory;
            }

            function compileManyToMany() {
                var args = [
                        'node',     getCompilerPath(),
                        '--target', getTarget(),
                        '--module', getModule()
                    ],
                    errors = [],
                    time = Number(new Date()),
                    process,
                    sourceFile,
                    sourceDirectory,
                    result,
                    mapResult,
                    mapDestination,
                    declarationResult,
                    declarationDestination,
                    source;
                if (!hasComments()) {
                    args.push('--removeComments');
                }
                if (hasDeclaration()) {
                    args.push('--declaration');
                }
                if (!hasImplicitAny()) {
                    args.push('--noImplicitAny');
                }
                if (hasPreserveConstEnums()) {
                    args.push('--preserveConstEnums');
                }
                if (hasSourceMap()) {
                    args.push('--sourcemap');
                    if (getSourceRoot() !== null) {
                        args.push('--sourceRoot', getSourceRoot());
                    }
                    if (getMapRoot() !== null) {
                        args.push('--mapRoot', getMapRoot());
                    }
                }
                args.push(getSourceFile());
                process = spawn(
                    '/usr/bin/env', args,
                    {cwd: getSourceDirectory()}
                );
                process.stderr.on('data', function (data) {
                    errors.push(data.toString());
                });
                process.on('close', function (code) {
                    if (code !== 0) {
                        // todo: show error
                    } else {
                        moveFiles();
                    }
                });

                function getTime() {
                    var temp = String((Number(new Date() - time)) / 1000 + 0.0001).split('.');
                    return temp[0] + (temp.length > 1 ? '.' + temp[1].substr(0, 3) : '.000') + 's';
                }
                function getResult() {
                    var source;
                    var extension;
                    var filename;
                    var directory;
                    if (typeof result === 'undefined') {
                        source    = getSource();
                        extension = path.extname(source);
                        filename  = path.basename(source, extension);
                        directory = path.dirname(source);
                        result    = path.join(directory, filename + '.js');
                    }
                    return result;
                }
                function getMapResult() {
                    var source;
                    var extension;
                    var filename;
                    var directory;
                    if (typeof mapResult === 'undefined') {
                        source    = getSource();
                        extension = path.extname(source);
                        filename  = path.basename(source, extension);
                        directory = path.dirname(source);
                        mapResult = path.join(directory, filename + '.js.map');
                    }
                    return mapResult;
                }
                function getMapDestination() {
                    var destination;
                    var directory;
                    var extension;
                    var filename;
                    if (typeof mapDestination === 'undefined') {
                        destination    = getDestination();
                        extension      = path.extname(destination);
                        filename       = path.basename(destination, extension);
                        directory      = path.dirname(destination);
                        mapDestination = path.join(directory, filename + '.js.map');

                    }
                    return mapDestination;
                }
                function getDeclarationResult() {
                    var source;
                    var extension;
                    var filename;
                    var directory;
                    if (typeof declarationResult === 'undefined') {
                        source    = getSource();
                        extension = path.extname(source);
                        filename  = path.basename(source, extension);
                        directory = path.dirname(source);
                        declarationResult = path.join(directory, filename + '.d.ts');
                    }
                    return declarationResult;
                }
                function getDeclarationDestination() {
                    var destination;
                    var directory;
                    var extension;
                    var filename;
                    if (typeof declarationDestination === 'undefined') {
                        destination    = getDestination();
                        extension      = path.extname(destination);
                        filename       = path.basename(destination, extension);
                        directory      = path.dirname(destination);
                        declarationDestination = path.join(directory, filename + '.d.ts');

                    }
                    return declarationDestination;
                }
                function getSource() {
                    if (typeof source === 'undefined') {
                        source = String(getSources()[0] || '');
                    }
                    return source;
                }
                function getSourceFile() {
                    if (typeof sourceFile !== 'string') {
                        sourceFile = path.basename(getSources()[0]);
                    }
                    return sourceFile;
                }
                function getSourceDirectory() {
                    if (typeof sourceDirectory !== 'string') {
                        sourceDirectory = path.dirname(getSources()[0]);
                    }
                    return sourceDirectory;
                }
                function moveFiles() {
                    var workers = 0,
                        firstRun = true;
                    moveJavascript();
                    if (hasDeclaration()) {
                        moveDeclaration();
                    }
                    if (hasSourceMap()) {
                        moveSourceMap();
                    }

                    function move(path1, path2, callback) {
                        // todo: fix this
                        setTimeout(function () {
                            grunt.file.copy(path1, path2, {encoding: getEncoding()});
                            grunt.file.delete(path1, {force: true});
                            callback(null, fs.statSync(path2), path2);
                        }, 0);
                    }
                    function callback(error, stats, path) {
                        if (error) {
                            // todo: show error
                        } else {
                            workers--;

                            if (firstRun) {
                                grunt.log.write('Compile'.green + ' ' + getSource() + ' (' + getTime() + ')');
                            }

                            grunt.log.write((firstRun ? ' -> ' : ', ') + path + ' (' + getSize(stats.size) + ')');

                            if (!workers) {
                                grunt.log.writeln('.');
                                if (files.length) {
                                    iterate(files.shift());
                                } else {
                                    complete();
                                }
                            }

                            firstRun = false;
                        }
                    }
                    function moveJavascript() {
                        workers++;
                        countDestinations++;
                        move(
                            getResult(),
                            getDestination(),
                            callback
                        );
                    }
                    function moveDeclaration() {
                        workers++;
                        countDeclarations++;
                        move(
                            getDeclarationResult(),
                            getDeclarationDestination(),
                            callback
                        );
                    }
                    function moveSourceMap() {
                        workers++;
                        countMaps++;
                        move(
                            getMapResult(),
                            getMapDestination(),
                            callback
                        );
                    }
                }
            }

            function compileManyToOne() {
                var args = [
                        'node',     getCompilerPath(),
                        '--target', getTarget(),
                        '--module', getModule()
                    ],
                    errors = [],
                    process;
                if (!hasComments()) {
                    args.push('--removeComments');
                }
                if (hasDeclaration()) {
                    args.push('--declaration');
                }
                if (!hasImplicitAny()) {
                    args.push('--noImplicitAny');
                }
                if (hasPreserveConstEnums()) {
                    args.push('--preserveConstEnums');
                }
                if (hasSourceMap()) {
                    args.push('--sourcemap');
                    if (getSourceRoot() !== null) {
                        args.push('--sourceRoot', getSourceRoot());
                    }
                    if (getMapRoot() !== null) {
                        args.push('--mapRoot', getMapRoot());
                    }
                }
                getSources().forEach(function (source) {
                    args.push(path.join(getWorkingDirectory(), source));
                });
                args.push('--out', getDestination());
                process = spawn('/usr/bin/env', args);
                process.stderr.on('data', function (data) {
                    errors.push(data.toString());
                });
                process.on('close', function (code) {
                    if (code !== 0) {
                        grunt.verbose.or.error().error(errors.join('\n'));
                        grunt.fail.warn('Something went wrong.');
                        done(false);
                    } else {
                        grunt.log.writeln(
                            'Compile %count% file(s), %time% sec'.
                                replace(/%count%/g, String(getSources().length).cyan).
                                replace(/%time%/g, time(Number(new Date()) - time1).cyan)
                        );
                        done(true);
                    }
                });
            }
        }
        function compile() {
            getCompilerVersion(function (version) {
                grunt.log.writeln('Compiler version: ' + version.green);
                grunt.log.writeflags({
                    target:             getTarget(),
                    module:             getModule(),
                    declaration:        hasDeclaration().toString(),
                    comments:           hasComments().toString(),
                    sourcemap:          hasSourceMap().toString(),
                    implicitAny:        hasImplicitAny().toString(),
                    preserveConstEnums: hasPreserveConstEnums().toString(),
                    sourceRoot:         getSourceRoot(),
                    mapRoot:            getMapRoot(),
                    encoding:           getEncoding()
                }, 'Options');
                if (files.length) {
                    iterate(files.shift());
                } else {
                    complete();
                }
            });
        }
    });

};
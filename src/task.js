/*jslint */
/*global module, require, setTimeout */

var spawn = require('child_process').spawn,
    path = require('path'),
    fs = require('fs');

function Deferred() {
    "use strict";
    this.actions = [];
}
Deferred.prototype.actions = null;
Deferred.prototype.add = function (action) {
    "use strict";
    this.actions.push(action);
};
Deferred.prototype.run = function (callback) {
    "use strict";
    var self = this,
        actions = this.actions;
    function next(action) {
        setTimeout(function () {
            action(
                function () {
                    if (actions.length) {
                        next(actions.shift());
                    } else {
                        callback();
                    }
                },
                function (error) {
                    self.actions = [];
                    callback(error);
                }
            );
        }, 0);
    }
    function start() {
        if (actions.length) {
            next(actions.shift());
        } else {
            callback();
        }
    }
    start();
};

module.exports = function (grunt) {
    "use strict";

    var target = {
        ES3:    'es3',
        ES5:    'es5',
        ES6:    'es6',
        LATEST: 'latest'
    };

    function writeFile(pathname, data, options, callback) {
        // todo: use async functions
        grunt.file.write(pathname, data, options);
        callback();
    }

    grunt.registerMultiTask('typescript', 'Compile *.ts files', function () {

        var self           = this,
            files          = self.files,
            length         = files.length,
            done           = this.async(),
            time1          = Number(new Date()),
            options        = self.options({
                encoding: 'utf8'
            }),
            encoding       = String(options.encoding || 'utf8') || 'utf8',
            declaration    = !!options.declaration,
            sourcemap      = !!options.sourcemap,
            removeComments = !!options.removeComments,
            target         = String(options.target || '').toLowerCase(),
            module         = String(options.module || '').toLowerCase(),
        // mapRoot - это дополнительный префикс перед указанием на *.map файлы внутри скомпилированного *.js
            mapRoot        = String(options.mapRoot || '') || null,
        // sourceRoot - это дополнительный префикс перед указанием на исходные файлы внутри скомпилированного *.map
            sourceRoot     = String(options.sourceRoot || '') || null;

        if (['es3', 'es5'].indexOf(target) === -1) {
            target = 'es3';
        }
        if (['commonjs', 'amd'].indexOf(module) === -1) {
            module = 'commonjs';
        }

        function size(value) {
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
        function time(value) {
            var temp = String(value / 1000 + 0.0001).split('.');
            return temp[0] + (temp.length > 1 ? '.' + temp[1].substr(0, 3) : '.000') + 's';
        }
        function end() {
            grunt.log.writeln(
                'Created %count% icon(s), %time% sec'.
                    replace(/%count%/g, String(length).cyan).
                    replace(/%time%/g, time(Number(new Date()) - time1).cyan)
            );
            done(); // todo call by success result
        }
        function next(item) {
            var expand = !!item.orig.expand,
                sources = item.src,
                dest   = String(item.dest || ''),
                cwd    = String(item.cwd || ''),
                time2  = Number(new Date()),
                deferred = new Deferred();
            if (expand) {

                deferred.add(function (success, error) {
                    var args = [],
                        errors = [],
                        process;
                    args.push(path.join(__dirname, '../bin/tsc'));
                    args.push('--target', target.toUpperCase());
                    args.push('--module', module);
                    if (declaration) {
                        args.push('--declaration');
                    }
                    if (removeComments) {
                        args.push('--removeComments');
                    }
                    if (sourcemap) {
                        args.push('--sourcemap');
                        if (sourceRoot !== null) {
                            args.push('--sourceRoot', sourceRoot);
                        }
                        if (mapRoot !== null) {
                            args.push('--mapRoot', mapRoot);
                        }
                    }
                    //args.push('--out', path.basename(dest));
                    args.push(path.basename(sources[0]));
                    process = spawn('/usr/bin/env', args, {
                        cwd: path.dirname(sources[0])/*,
                         env: process.env*/
                    });
                    process.stderr.on('data', function (data) {
                        errors.push(data.toString());
                    });
                    process.on('close', function (code) {
                        if (code !== 0) {
                            grunt.verbose.or.error().error(errors.join('\n'));
                            grunt.fail.warn('Something went wrong.');
                            error();
                        } else {
                            success();
                        }
                    });
                });
                deferred.add(function (success, error) {
                    var source       = sources[0],
                        extname      = path.extname(source),
                        basename     = path.basename(source, extname),
                        dirname      = path.dirname(source),
                        filename     = path.join(dirname, basename + '.js'),
                        readOptions  = {
                            encoding : encoding,
                            flag     : 'r'
                        },
                        writeOptions = {
                            encoding : encoding,
                            mode     : 438, // todo: read from options
                            flag     : 'w'
                        },
                        content;
                    fs.readFile(filename, readOptions, function (err1, data) {
                        if (err1) {
                            error(err1);
                        } else {
                            content = data;
                            writeFile(dest, content, writeOptions, function (err2) {
                                if (err2) {
                                    error(err2);
                                } else {
                                    fs.unlink(filename, function (err3) {
                                        if (err3) {
                                            error(err3);
                                        } else {
                                            success();
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                deferred.add(function (success, error) {
                    fs.stat(dest, function (err, stats) {
                        if (err) {
                            error(err);
                        } else {
                            grunt.log.writeln(
                                'Compiled: %source% %time%'.
                                    replace(/%source%/g, sources[0].green).
                                    replace(/%time%/g, time(Number(new Date()) - time2)).bold
                            );
                            grunt.log.writeln(
                                '  %dot% %dest% %size%'.
                                    replace(/%dot%/g,  '*'.green).
                                    replace(/%dest%/g, dest.cyan).
                                    replace(/%size%/g, size(stats.size))
                            );
                            success();
                        }
                    });
                });
                deferred.add(function (success, error) {
                    var source       = sources[0],
                        extname      = path.extname(source),
                        basename     = path.basename(source, extname),
                        dirname      = path.dirname(source),
                        filename     = path.join(dirname, basename + '.d.ts'),
                        target       = path.join(path.dirname(dest), path.basename(dest, '.js') + '.d.ts'),
                        readOptions  = {
                            encoding : encoding,
                            flag     : 'r'
                        },
                        writeOptions = {
                            encoding : encoding,
                            mode     : 438, // todo: read from options
                            flag     : 'w'
                        },
                        content;
                    if (declaration) {
                        fs.readFile(filename, readOptions, function (err1, data) {
                            if (err1) {
                                error(err1);
                            } else {
                                content = data;
                                writeFile(target, content, writeOptions, function (err2) {
                                    if (err2) {
                                        error(err2);
                                    } else {
                                        fs.unlink(filename, function (err3) {
                                            if (err3) {
                                                error(err3);
                                            } else {
                                                success();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        success();
                    }
                });
                deferred.add(function (success, error) {
                    var target = path.join(path.dirname(dest), path.basename(dest, '.js') + '.d.ts');
                    fs.stat(target, function (err, stats) {
                        if (err) {
                            error(err);
                        } else {
                            grunt.log.writeln(
                                '  %dot% %dest% %size%'.
                                    replace(/%dot%/g,  '*'.green).
                                    replace(/%dest%/g, target.cyan).
                                    replace(/%size%/g, size(stats.size))
                            );
                            success();
                        }
                    });
                });
                deferred.add(function (success, error) {
                    var extname = path.extname(sources[0]),
                        basename = path.basename(sources[0], extname),
                        dirname = path.dirname(sources[0]),
                        filename = path.join(dirname, basename + '.js.map'),
                        target = path.join(path.dirname(dest), path.basename(dest, '.js') + '.js.map'),
                        content;
                    if (sourcemap) {
                        fs.readFile(filename, {
                            encoding: 'utf8', // todo: read from options
                            flag: 'r'
                        }, function (err1, data) {
                            if (err1) {
                                error(err1);
                            } else {
                                content = data;
                                writeFile(target, content, {encoding: 'utf8', mode: 438, flag: 'w'}, function (err2) {
                                    if (err2) {
                                        error(err2);
                                    } else {
                                        fs.unlink(filename, function (err3) {
                                            if (err3) {
                                                error(err3);
                                            } else {
                                                success();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        success();
                    }
                });
                deferred.add(function (success, error) {
                    var target = path.join(path.dirname(dest), path.basename(dest, '.js') + '.js.map');
                    fs.stat(target, function (err, stats) {
                        if (err) {
                            error(err);
                        } else {
                            grunt.log.writeln(
                                '  %dot% %dest% %size%'.
                                    replace(/%dot%/g,  '*'.green).
                                    replace(/%dest%/g, target.cyan).
                                    replace(/%size%/g, size(stats.size))
                            );
                            success();
                        }
                    });
                });
                deferred.run(function (error) {
                    if (error) {
                        grunt.verbose.or.error().error(error.message);
                        grunt.fail.warn('Something went wrong.');
                    } else {
                        if (files.length) {
                            next(files.shift());
                        } else {
                            end();
                        }
                    }
                });
            } else {
                (function () {
                    var args = [],
                        errors = [],
                        process;
                    args.push('tsc');
                    args.push('--target', target.toUpperCase());
                    args.push('--module', module);
                    if (declaration) {
                        args.push('--declaration');
                    }
                    if (removeComments) {
                        args.push('--removeComments');
                    }
                    if (sourcemap) {
                        args.push('--sourcemap');
                        if (sourceRoot !== null) {
                            args.push('--sourceRoot', sourceRoot);
                        }
                        if (mapRoot !== null) {
                            args.push('--mapRoot', mapRoot);
                        }
                    }
                    sources.forEach(function (source) {
                        args.push(path.join(cwd, source));
                    });
                    args.push('--out', dest);
                    process = spawn('/usr/bin/env', args/*, {
                     cwd: path.dirname(sources[0]),
                     env: process.env
                     }*/);
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
                                    replace(/%count%/g, String(sources.length).cyan).
                                    replace(/%time%/g, time(Number(new Date()) - time1).cyan)
                            );
                            done(true);
                        }
                    });
                })();
            }
        }

        function start() {
            if (files.length) {
                next(files.shift());
            } else {
                end();
            }
        }
        start();

    });

};
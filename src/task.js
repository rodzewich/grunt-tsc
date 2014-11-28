/*jslint */
/*global module, require, process, __dirname, setTimeout */

// todo: adjust use options.compilerVersion

var spawn    = require("child_process").spawn,
    path     = require("path"),
    fs       = require("fs"),
    os       = require("os"),
    rows     = process.stdout.rows,
    columns  = process.stdout.columns,
    cwd      = process.cwd();

process.stdout.on("resize", function () {
    "use strict";
    rows    = process.stdout.rows;
    columns = process.stdout.columns;
});

module.exports = function (grunt) {
    "use strict";
    grunt.registerMultiTask("tsc", "Compile *.ts files", function () {
        var self   = this,
            files  = self.files,
            length = files.length,
            done   = this.async(),
            time1  = Number(new Date()),
            countDeclarations = 0,
            countDestinations = 0,
            countMaps = 0,
            options,
            nodePath,
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
            preserveConstEnums,
            references,
            coreLibrary,
            library,
            domLibrary,
            scriptHostLibrary,
            webWorkerLibrary,
            system,
            windows;
        compile();
        function getSystem() {
            if (typeof system === "undefined") {
                system = os.type();
            }
            return system;
        }
        function isWindows() {
            if (typeof windows === "undefined") {
                windows = /^windows/i.test(getSystem());
            }
            return windows;
        }
        function deferred(actions) {
            iterate();
            function iterate() {
                setTimeout(function () {
                    var action = actions.shift();
                    if (typeof action === "function") {
                        action(iterate);
                    }
                }, 0);
            }
        }
        function mkdir(dir, callback) {
            deferred([
                function (iterate) {
                    fs.exists(dir, function (exists) {
                        if (exists) {
                            callback(null);
                        } else {
                            iterate();
                        }
                    });
                },
                function () {
                    mkdir(path.dirname(dir), function (error) {
                        if (error) {
                            callback(error);
                        } else {
                            // todo: adjust use options.dirMode
                            fs.mkdir(dir, 511, function (error) {
                                grunt.log.debug("mkdir", dir);
                                callback(error || null); // todo: adjust error type
                            });
                        }
                    });
                }
            ]);
        }
        function move(path1, path2, fileMode, dirMode, callback) {
            var stats,
                content;
            // todo: adjust use fileMode
            // todo: adjust use dirMode
            deferred([
                function (iterate) {
                    mkdir(path.join(cwd, path.dirname(path2)), function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            iterate();
                        }
                    });
                },
                function (iterate) {
                    fs.readFile(path1, {encoding: getEncodingOption()}, function (error, data) {
                        if (error) {
                            callback(error, null);
                        } else {
                            content = data;
                            grunt.log.debug("read", path1);
                            iterate();
                        }
                    });
                },
                function (iterate) {
                    fs.writeFile(path2, content, {encoding: getEncodingOption()}, function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            grunt.log.debug("write", path2);
                            iterate();
                        }
                    });
                },
                function (iterate) {
                    fs.stat(path2, function (error, result) {
                        if (error) {
                            callback(error, null);
                        } else {
                            stats = result;
                            iterate();
                        }
                    });
                },
                function (iterate) {
                    fs.unlink(path1, function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            grunt.log.debug("delete", path1);
                            iterate();
                        }
                    });
                },
                function () {
                    callback(null, stats, path2);
                }
            ]);
        }
        function compilePropertyNameWithPadding(value) {
            return (new Array(20 - value.length)).join(" ") + value + ": ";
        }
        function displayErrorContent(string) {
            string.split(/(?:\n|\r)+/).forEach(function (item) {
                item = item.replace(/\s+$/, "");
                item = item.replace(/\s+/, " ");
                if (item) {
                    while (item) {
                        item = item.replace(/^\s+/, "");
                        grunt.log.write(" * ".yellow);
                        grunt.log.writeln(item.substr(0, columns - 3));
                        item = item.substr(columns - 3);
                    }
                }
            });
        }
        function displayCompleteReport() {
            var count = countDestinations + countDeclarations + countMaps;
            grunt.log.writeln(
                [
                    "Created ", String(count).cyan, " files. ",
                    "js: ", String(countDestinations).cyan, " files, ",
                    "map: ", String(countMaps).cyan, " files, ",
                    "declaration: ", String(countDeclarations).cyan, " files ",
                    "(354ms)"
                ].join("")
            );
        }
        function isTypescriptError(content) {

        }
        function displayTypescriptError(content) {

        }
        function displayError(error) {

        }
        function getOptions() {
            if (typeof options === "undefined") {
                options = self.options() || {};
            }
            return options;
        }
        function getFileModeOption() {}
        function getDirModeOption() {}
        function getNodePathOption(callback) {
            var temp,
                stats,
                options,
                actions = [
                    function () {
                        fs.exists(temp, function (resolve) {
                            if (!resolve) {
                                handler(new Error("Incorrect \"nodePath\" option, path not found."), null);
                            } else {
                                iterate();
                            }
                        });
                    },
                    function () {
                        fs.realpath(temp, function (error, realpath) {
                            if (error) {
                                handler(error, null); // todo: adjust error type
                            } else if (realpath !== temp) {
                                handler(new Error("Incorrect \"nodePath\" option, path should be absolute."), null);
                            } else {
                                iterate();
                            }
                        });
                    },
                    function () {
                        fs.stat(temp, function (error, result) {
                            if (error) {
                                handler(error, null); // todo: adjust error type
                            } else {
                                stats = result;
                                iterate();
                            }
                        });
                    },
                    function () {
                        if (!stats.isFile()) {
                            handler(new Error("Incorrect \"nodePath\" option, path should be a file."), null);
                        } else {
                            iterate();
                        }
                    },
                    function () {
                        if (stats.mode === 0) { // todo: fix this, file should be executable.
                            handler(new Error("Incorrect \"nodePath\" option, file should be executable."), null);
                        } else {
                            iterate();
                        }
                    },
                    function () {
                        nodePath = temp;
                        handler(null, nodePath);
                    }
                ];
            if (typeof nodePath === "undefined") {
                options = getOptions();
                if (typeof options.nodePath === "undefined") {
                    nodePath = "node";
                    handler(null, nodePath);
                } else {
                    temp = String(options.nodePath || "");
                    iterate();
                }
            } else {
                handler(null, nodePath);
            }
            function handler(error, nodePath) {
                setTimeout(function () {
                    callback(error, nodePath);
                }, 0);
            }
            function iterate() {
                setTimeout(function () {
                    actions.shift()();
                }, 0);
            }
        }
        function hasLibraryOption() {
            var options;
            if (typeof library === "undefined") {
                options = getOptions();
                if (typeof options.library === "string") {
                    library = ["off", "no", "false", "0", ""].indexOf(String(options.library).toLowerCase()) === -1;
                } else {
                    library = !!options.library;
                }
                library = library || (hasDomLibraryOption() && hasScriptHostLibraryOption() && hasWebWorkerLibraryOption());
            }
            return library;
            function hasDomLibraryOption() {
                var result     = false,
                    options    = getOptions(),
                    domLibrary = options.domLibrary;
                if (typeof domLibrary === "string") {
                    result = ["off", "no", "false", "0", ""].indexOf(String(domLibrary).toLowerCase()) === -1;
                } else {
                    result = !!domLibrary;
                }
                return result;
            }
            function hasScriptHostLibraryOption() {
                var result            = false,
                    options           = getOptions(),
                    scriptHostLibrary = options.scriptHostLibrary;
                if (typeof scriptHostLibrary === "string") {
                    result = ["off", "no", "false", "0", ""].indexOf(String(scriptHostLibrary).toLowerCase()) === -1;
                } else {
                    result = !!scriptHostLibrary;
                }
                return result;
            }
            function hasWebWorkerLibraryOption() {
                var result           = false,
                    options          = getOptions(),
                    webWorkerLibrary = options.webWorkerLibrary;
                if (typeof webWorkerLibrary === "string") {
                    result = ["off", "no", "false", "0", ""].indexOf(String(webWorkerLibrary).toLowerCase()) === -1;
                } else {
                    result = !!webWorkerLibrary;
                }
                return result;
            }
        }
        function hasCoreLibraryOption() {
            var options;
            if (typeof coreLibrary === "undefined") {
                options = getOptions();
                if (typeof options.coreLibrary === "string") {
                    coreLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.coreLibrary).toLowerCase()) === -1;
                } else {
                    coreLibrary = !!options.coreLibrary;
                }
                coreLibrary = coreLibrary && !(hasLibraryOption() || hasDomLibraryOption() || hasScriptHostLibraryOption() || hasWebWorkerLibraryOption());
            }
            return coreLibrary;
        }
        function hasDomLibraryOption() {
            var options;
            if (typeof domLibrary === "undefined") {
                options = getOptions();
                if (typeof options.domLibrary === "string") {
                    domLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.domLibrary).toLowerCase()) === -1;
                } else {
                    domLibrary = !!options.domLibrary;
                }
                domLibrary = domLibrary && !hasLibraryOption();
            }
            return domLibrary;
        }
        function hasScriptHostLibraryOption() {
            var options;
            if (typeof scriptHostLibrary === "undefined") {
                options = getOptions();
                if (typeof options.scriptHostLibrary === "string") {
                    scriptHostLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.scriptHostLibrary).toLowerCase()) === -1;
                } else {
                    scriptHostLibrary = !!options.scriptHostLibrary;
                }
                scriptHostLibrary = scriptHostLibrary && !hasLibraryOption();
            }
            return scriptHostLibrary;
        }
        function hasWebWorkerLibraryOption() {
            var options;
            if (typeof webWorkerLibrary === "undefined") {
                options = getOptions();
                if (typeof options.webWorkerLibrary === "string") {
                    webWorkerLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.webWorkerLibrary).toLowerCase()) === -1;
                } else {
                    webWorkerLibrary = !!options.webWorkerLibrary;
                }
                webWorkerLibrary = webWorkerLibrary && !hasLibraryOption();
            }
            return webWorkerLibrary;
        }
        function getReferencesOption() {
            var options;
            if (typeof references === "undefined") {
                options = getOptions();
                references = [];
                if (hasCoreLibraryOption()) {
                    references.push("node_modules/grunt-tsc/bin/lib.core.d.ts");
                }
                if (hasLibraryOption()) {
                    references.push("node_modules/grunt-tsc/bin/lib.d.ts");
                }
                if (hasDomLibraryOption()) {
                    references.push("node_modules/grunt-tsc/bin/lib.dom.d.ts");
                }
                if (hasScriptHostLibraryOption()) {
                    references.push("node_modules/grunt-tsc/bin/lib.scriptHost.d.ts");
                }
                if (hasWebWorkerLibraryOption()) {
                    references.push("node_modules/grunt-tsc/bin/lib.webworker.d.ts");
                }
                if (typeof options.references !== "undefined") {
                    try {
                        references = references.concat(grunt.file.expand({
                            filter: function (filename) {
                                return grunt.file.isFile(filename) &&
                                    filename.substr(-5).toLowerCase() === ".d.ts";
                            }
                        }, options.references));
                    } catch (error) {
                        references = [];
                        throw new Error("Incorrect references: " + String(error || ""));
                    }
                }
            }
            return references;
        }
        function getTargetOption() {
            var options,
                temp;
            if (typeof target !== "string") {
                options = getOptions();
                temp = String(options.target || "").toUpperCase();
                if (typeof options.target === "undefined" || temp === "DEFAULT") {
                    target = "ES3";
                } else if (temp === "LATEST") {
                    target = "ES6";
                } else if (["ES3", "ES5", "ES6"].indexOf(temp) !== -1) {
                    target = temp;
                } else {
                    throw new Error("Incorrect \"target\" option, must be \"default\", \"es3\", \"es5\", \"es6\" or \"latest\".");
                }
            }
            return target;
        }
        function getModuleOption() {
            var options,
                temp;
            if (typeof module !== "string") {
                options = getOptions();
                temp = String(options.module || "").toLowerCase();
                if (typeof options.module === "undefined") {
                    module = "commonjs";
                } else if (["commonjs", "amd"].indexOf(temp) !== -1) {
                    module = temp;
                } else {
                    throw new Error("Incorrect \"module\" option, must be \"commonjs\" or \"amd\".");
                }
            }
            return module;
        }
        function getCompilerPath() {
            if (typeof compilerPath === "undefined") {
                compilerPath = path.join(__dirname, "../bin/tsc.js");
            }
            return compilerPath;
        }
        function hasDeclarationOption() {
            var options;
            if (typeof declaration === "undefined") {
                options = getOptions();
                if (typeof options.declaration === "string") {
                    declaration = ["off", "no", "false", "0", ""].indexOf(String(options.declaration).toLowerCase()) === -1;
                } else {
                    declaration = !!options.declaration;
                }
            }
            return !!declaration;
        }
        function hasCommentsOption() {
            var options;
            if (typeof comments === "undefined") {
                options = getOptions();
                if (typeof options.comments === "undefined") {
                    comments = true;
                } else if (typeof options.comments === "string") {
                    comments = ["off", "no", "false", "0", ""].indexOf(String(options.comments).toLowerCase()) === -1;
                } else {
                    comments = !!options.comments;
                }
            }
            return !!comments;
        }
        function hasSourceMapOption() {
            var options;
            if (typeof sourcemap === "undefined") {
                options = getOptions();
                if (typeof options.sourcemap === "string") {
                    sourcemap = ["off", "no", "false", "0", ""].indexOf(String(options.sourcemap).toLowerCase()) === -1;
                } else {
                    sourcemap = !!options.sourcemap;
                }
            }
            return !!sourcemap;
        }
        function hasImplicitAnyOption() {
            var options;
            if (typeof implicitAny === "undefined") {
                options = getOptions();
                if (typeof options.implicitAny === "undefined") {
                    implicitAny = true;
                } else if (typeof options.implicitAny === "string") {
                    implicitAny = ["off", "no", "false", "0", ""].indexOf(String(options.implicitAny).toLowerCase()) === -1;
                } else {
                    implicitAny = !!options.implicitAny;
                }
            }
            return !!implicitAny;
        }
        function hasPreserveConstEnumsOption() {
            var options;
            if (typeof preserveConstEnums === "undefined") {
                options = getOptions();
                if (typeof options.preserveConstEnums === "string") {
                    preserveConstEnums = ["off", "no", "false", "0", ""].indexOf(String(options.preserveConstEnums).toLowerCase()) === -1;
                } else {
                    preserveConstEnums = !!options.preserveConstEnums;
                }
            }
            return !!preserveConstEnums;
        }
        function getSourceRootOption() {
            if (typeof sourceRoot === "undefined") {
                sourceRoot = String(options.sourceRoot || "") || null;
            }
            return sourceRoot;
        }
        function getMapRootOption() {
            if (typeof mapRoot === "undefined") {
                mapRoot = String(options.mapRoot || "") || null;
            }
            return mapRoot;
        }
        function getEncodingOption() {
            var options;
            if (typeof encoding === "undefined") {
                options = getOptions();
                encoding = String(options.encoding || "utf8") || "utf8";
            }
            return encoding;
        }
        function getFileSize(value) {
            var suffix = ["B", "K", "M", "G", "T"],
                ext = suffix.shift(),
                useDot = false,
                temp;
            while (value > 1024) {
                value = value / 1024;
                ext = suffix.shift();
                useDot = true;
            }
            temp = String(value + 0.0001).split(".");
            return (temp[0] + (useDot ? "." + temp[1].substr(0, 1) : "")) + ext;
        }
        function getCompilerVersion(callback) {
            var content = "",
                errors  = [],
                args    = [],
                command = "node",
                process;
            if (!isWindows()) {
                args.push("node");
                command = "/usr/bin/env";
            }
            args.push(getCompilerPath());
            args.push("--version");
            grunt.log.debug("command:", command);
            grunt.log.debug("args:", args.join(" "));
            process = spawn(command, args);
            process.stderr.on("data", function (data) {
                errors.push(String(data || ""));
            });
            process.stdout.on("data", function (data) {
                content += data.toString();
            });
            process.on("close", function (code) {
                if (code !== 0) {
                    displayErrorContent(errors.join("\n"));
                    done(false);
                } else {
                    if (/^.*version\s+(\S+).*$/im.test(content)) {
                        callback(content.replace(/^.*version\s+(\S+).*$/im, "$1").split("\r").join("").split("\n").join(""));
                    } else {
                        callback("unknown");
                    }
                }
            });
        }
        // todo: delete
        function time(value) {
            var temp = String(value / 1000 + 0.0001).split(".");
            return temp[0] + (temp.length > 1 ? "." + temp[1].substr(0, 3) : ".000") + "s";
        }
        function complete() {
            displayCompleteReport();
            done(true);
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
                if (typeof expand === "undefined") {
                    // todo: fix this, may be use item.expand.
                    expand = !!item.orig.expand;
                }
                return expand;
            }
            function getSources() {
                if (typeof sources === "undefined") {
                    sources = item.src;
                }
                return sources;
            }
            function getDestination() {
                if (typeof destination === "undefined") {
                    destination = String(item.dest || "");
                }
                return destination;
            }
            function getWorkingDirectory() {
                if (typeof workingDirectory === "undefined") {
                    workingDirectory = "";
                    if (typeof item.cwd !== "undefined") {
                        workingDirectory = String(item.cwd || "");
                    } else if (item.orig && typeof item.orig.cwd !== "undefined") {
                        workingDirectory = String(item.orig.cwd || "");
                    }
                }
                return workingDirectory;
            }
            function compileManyToMany() {
                var args    = [],
                    command = "node",
                    errors  = [],
                    time    = Number(new Date()),
                    compilerProcess,
                    sourceFile,
                    sourceDirectory,
                    result,
                    mapResult,
                    mapDestination,
                    declarationResult,
                    declarationDestination,
                    source;
                getNodePathOption(function (nodePath) {
                    try {
                        if (!isWindows()) {
                            command = "/usr/bin/env";
                            args.push("node");
                        }
                        args.push(getCompilerPath());
                        args.push("--target", getTargetOption());
                        args.push("--module", getModuleOption());
                        if (!hasCommentsOption()) {
                            args.push("--removeComments");
                        }
                        if (hasDeclarationOption()) {
                            args.push("--declaration");
                        }
                        if (!hasImplicitAnyOption()) {
                            args.push("--noImplicitAny");
                        }
                        if (hasPreserveConstEnumsOption()) {
                            args.push("--preserveConstEnums");
                        }
                        if (hasSourceMapOption()) {
                            args.push("--sourcemap");
                            if (getSourceRootOption() !== null) {
                                args.push("--sourceRoot", getSourceRootOption());
                            }
                            if (getMapRootOption() !== null) {
                                args.push("--mapRoot", getMapRootOption());
                            }
                        }
                        getReferencesOption().forEach(function (filename) {
                            args.push(path.relative(getSourceDirectory(), filename));
                        });
                        args.push(getSourceFile());
                        grunt.log.debug("command:", command);
                        grunt.log.debug("args:", args.join(" "));
                        grunt.log.debug("cwd:", getSourceDirectory());
                        compilerProcess = spawn(command, args, {cwd: getSourceDirectory()});
                        compilerProcess.stderr.on("data", function (data) {
                            errors.push(data.toString());
                        });
                        compilerProcess.stdout.on("data", function (data) {
                            errors.push(data.toString());
                        });
                        compilerProcess.on("close", function (code) {
                            if (code !== 0) {
                                displayErrorContent(errors.join("\n"));
                                grunt.fail.warn("Something went wrong.");
                                done(false);
                            } else {
                                moveFiles(function (error) {

                                });
                            }
                        });
                    } catch (error) {
                        displayError(error);
                        done(false);
                    }
                });
                function getTime() {
                    var temp = String((Number(new Date() - time)) / 1000 + 0.0001).split(".");
                    return temp[0] + (temp.length > 1 ? "." + temp[1].substr(0, 3) : ".000") + "s";
                }
                function getResult() {
                    var source,
                        extension,
                        filename,
                        directory;
                    if (typeof result === "undefined") {
                        source    = getSource();
                        extension = path.extname(source);
                        filename  = path.basename(source, extension);
                        directory = path.dirname(source);
                        result    = path.join(directory, filename + ".js");
                    }
                    return result;
                }
                function getMapResult() {
                    var source,
                        extension,
                        filename,
                        directory;
                    if (typeof mapResult === "undefined") {
                        source    = getSource();
                        extension = path.extname(source);
                        filename  = path.basename(source, extension);
                        directory = path.dirname(source);
                        mapResult = path.join(directory, filename + ".js.map");
                    }
                    return mapResult;
                }
                function getMapDestination() {
                    var destination;
                    var directory;
                    var extension;
                    var filename;
                    if (typeof mapDestination === "undefined") {
                        destination    = getDestination();
                        extension      = path.extname(destination);
                        filename       = path.basename(destination, extension);
                        directory      = path.dirname(destination);
                        mapDestination = path.join(directory, filename + ".js.map");

                    }
                    return mapDestination;
                }
                function getDeclarationResult() {
                    var source;
                    var extension;
                    var filename;
                    var directory;
                    if (typeof declarationResult === "undefined") {
                        source    = getSource();
                        extension = path.extname(source);
                        filename  = path.basename(source, extension);
                        directory = path.dirname(source);
                        declarationResult = path.join(directory, filename + ".d.ts");
                    }
                    return declarationResult;
                }
                function getDeclarationDestination() {
                    var destination,
                        directory,
                        extension,
                        filename;
                    if (typeof declarationDestination === "undefined") {
                        destination            = getDestination();
                        extension              = path.extname(destination);
                        filename               = path.basename(destination, extension);
                        directory              = path.dirname(destination);
                        declarationDestination = path.join(directory, filename + ".d.ts");

                    }
                    return declarationDestination;
                }
                function getSource() {
                    if (typeof source === "undefined") {
                        source = String(getSources()[0] || "");
                    }
                    return source;
                }
                function getSourceFile() {
                    if (typeof sourceFile !== "string") {
                        sourceFile = path.basename(getSources()[0]);
                    }
                    return sourceFile;
                }
                function getSourceDirectory() {
                    if (typeof sourceDirectory !== "string") {
                        sourceDirectory = path.dirname(getSources()[0]);
                    }
                    return sourceDirectory;
                }
                function moveFiles() {
                    var workers = 0,
                        firstRun = true,
                        actions = [],
                        dirMode = 0,
                        fileMode = 0;
                    moveJavascript();
                    if (hasSourceMapOption()) {
                        moveSourceMap();
                    }
                    if (hasDeclarationOption()) {
                        moveDeclaration();
                    }
                    actions.push(function () {

                    });
                    function callback(error, stats, path) {
                        function displayStdout() {
                            var prefix = "output",
                                temp = String(path).toLowerCase();
                            if (temp.substr(-5) === ".d.ts") {
                                prefix = "declaration";
                            } else if (temp.substr(-7) === ".js.map") {
                                prefix = "sourcemap";
                            }
                            grunt.log.writeln(compilePropertyNameWithPadding(prefix) + path.cyan + " (" + String(getFileSize(stats.size)).yellow + ")");
                        }
                        if (error) {
                            displayErrorContent(String(error || ""));
                            done(false);
                        } else {
                            workers--;
                            if (firstRun) {
                                grunt.log.writeln(">>>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + getSource().green + " (" + String(getTime()).yellow + ")");
                            }
                            displayStdout();
                            if (!workers) {
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
                        actions.push(function (iterate) {
                            move(getResult(), getDestination(), fileMode, dirMode, function (error, stats, path) {
                                callback(error, stats, path);
                                if (!error) {
                                    iterate();
                                }
                            });
                        });
                    }
                    function moveDeclaration() {
                        workers++;
                        countDeclarations++;
                        actions.push(function (iterate) {
                            move(getDeclarationResult(), getDeclarationDestination(), fileMode, dirMode, function (error, stats, path) {
                                callback(error, stats, path);
                                if (!error) {
                                    iterate();
                                }
                            });
                        });
                    }
                    function moveSourceMap() {
                        workers++;
                        countMaps++;
                        actions.push(function (iterate) {
                            move(getMapResult(), getMapDestination(), fileMode, dirMode, function (error, stats, path) {
                                callback(error, stats, path);
                                if (!error) {
                                    iterate();
                                }
                            });
                        });
                    }
                    deferred(actions);
                }
            }
            function compileManyToOne() {
                var args = [],
                    command = "node",
                    errors = [],
                    declaration,
                    sourcemap,
                    process;
                if (!isWindows()) {
                    command = "/usr/bin/env";
                    args.push("node");
                }
                args.push(getCompilerPath());
                args.push("--target", getTargetOption());
                args.push("--module", getModuleOption());
                if (!hasCommentsOption()) {
                    args.push("--removeComments");
                }
                if (hasDeclarationOption()) {
                    args.push("--declaration");
                }
                if (!hasImplicitAnyOption()) {
                    args.push("--noImplicitAny");
                }
                if (hasPreserveConstEnumsOption()) {
                    args.push("--preserveConstEnums");
                }
                if (hasSourceMapOption()) {
                    args.push("--sourcemap");
                    if (getSourceRootOption() !== null) {
                        args.push("--sourceRoot", getSourceRootOption());
                    }
                    if (getMapRootOption() !== null) {
                        args.push("--mapRoot", getMapRootOption());
                    }
                }
                getReferencesOption().forEach(function (filename) {
                    args.push(filename);
                });
                getSources().forEach(function (source) {
                    args.push(path.join(getWorkingDirectory(), source));
                });
                args.push("--out", getDestination());
                grunt.log.debug("command:", command);
                grunt.log.debug("args:", args.join(" "));
                process = spawn(command, args);
                process.stdout.on("data", function (data) {
                    errors.push(data.toString());
                });
                process.stderr.on("data", function (data) {
                    errors.push(data.toString());
                });
                process.on("close", function (code) {
                    if (code !== 0) {
                        displayErrorContent(errors.join("\n"));
                        grunt.fail.warn("Something went wrong.");
                        done(false);
                    } else {
                        grunt.log.writeln(">>>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + String(getSources().length).green + " file(s) (" + time(Number(new Date()) - time1).yellow + ")");
                        countDestinations++;
                        getSources().forEach(function (source) {
                            grunt.log.writeln(compilePropertyNameWithPadding("input") + path.join(getWorkingDirectory(), source).green);
                        });
                        grunt.log.writeln(compilePropertyNameWithPadding("output") + getDestination().cyan + " (" + String("000B").yellow + ")");
                        if (hasDeclarationOption()) {
                            countDeclarations++;
                            grunt.log.writeln(compilePropertyNameWithPadding("declaration") + getDeclaration().cyan + " (" + String("000B").yellow + ")");
                        }
                        if (hasSourceMapOption()) {
                            countMaps++;
                            grunt.log.writeln(compilePropertyNameWithPadding("sourcemap") + getSourceMap().cyan + " (" + String("000B").yellow + ")");
                        }
                        if (files.length) {
                            iterate(files.shift());
                        } else {
                            complete();
                        }
                    }
                });
                function getDeclaration() {
                    var destination,
                        extname,
                        dirname,
                        basename;
                    if (typeof declaration === "undefined") {
                        destination = getDestination();
                        extname = path.extname(destination);
                        dirname = path.dirname(destination);
                        basename = path.basename(destination, extname);
                        declaration = path.join(dirname, basename + ".d.ts");
                    }
                    return declaration;
                }
                function getSourceMap() {
                    if (typeof sourcemap === "undefined") {
                        sourcemap = getDestination() + ".map";
                    }
                    return sourcemap;
                }
            }
        }
        function compile() {
            getCompilerVersion(function (version) {
                grunt.log.writeflags({
                    target:             getTargetOption(),
                    module:             getModuleOption(),
                    declaration:        hasDeclarationOption().toString(),
                    comments:           hasCommentsOption().toString(),
                    sourcemap:          hasSourceMapOption().toString(),
                    implicitAny:        hasImplicitAnyOption().toString(),
                    preserveConstEnums: hasPreserveConstEnumsOption().toString(),
                    sourceRoot:         getSourceRootOption(),
                    mapRoot:            getMapRootOption(),
                    encoding:           getEncodingOption(),
                    library:            hasLibraryOption().toString(),
                    coreLibrary:        hasCoreLibraryOption().toString(),
                    domLibrary:         hasDomLibraryOption().toString(),
                    scriptHostLibrary:  hasScriptHostLibraryOption().toString(),
                    webWorkerLibrary:   hasWebWorkerLibraryOption().toString(),
                    compilerVersion:    version
                }, "options");
                if (getReferencesOption().length) {
                    grunt.log.writeflags(getReferencesOption(), "references");
                }
                if (files.length) {
                    iterate(files.shift());
                } else {
                    complete();
                }
            });
        }
    });

};

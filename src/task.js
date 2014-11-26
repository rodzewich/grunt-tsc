/*jslint */
/*global module, require, process, __dirname, setTimeout */

// todo: adjust use options.compilerVersion

var spawn    = require("child_process").spawn,
    path     = require("path"),
    fs       = require("fs"),
    os       = require("os"),
    rows     = process.stdout.rows,
    columns  = process.stdout.columns;

process.stdout.on("resize", function () {
    "use strict";
    rows    = process.stdout.rows;
    columns = process.stdout.columns;
});

module.exports = function (grunt) {
    "use strict";
    grunt.registerMultiTask("tsc", "Compile *.ts files", function () {
        var self = this,
            files = self.files,
            length = files.length,
            done = this.async(),
            time1 = Number(new Date()),
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
        function getTitle(value) {
            return (new Array(20 - value.length)).join(" ") + value + ": ";
        }
        function displayErrors(string) {
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
        function getOptions() {
            if (typeof options === "undefined") {
                options = self.options() || {};
            }
            return options;
        }
        function getNodePath(callback) {
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
                                handler(error, null); // todo: adjust type error
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
                                handler(error, null); // todo: adjust type error
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
        function isLibrary() {
            var options;
            if (typeof library === "undefined") {
                options = getOptions();
                if (typeof options.library === "string") {
                    library = ["off", "no", "false", "0", ""].indexOf(String(options.library).toLowerCase()) === -1;
                } else {
                    library = !!options.library;
                }
                library = library || (isDomLibrary() && isScriptHostLibrary() && isWebWorkerLibrary());
            }
            return library;
            function isDomLibrary() {
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
            function isScriptHostLibrary() {
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
            function isWebWorkerLibrary() {
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
        function isCoreLibrary() {
            var options;
            if (typeof coreLibrary === "undefined") {
                options = getOptions();
                if (typeof options.coreLibrary === "string") {
                    coreLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.coreLibrary).toLowerCase()) === -1;
                } else {
                    coreLibrary = !!options.coreLibrary;
                }
                coreLibrary = coreLibrary && !(isLibrary() || isDomLibrary() || isScriptHostLibrary() || isWebWorkerLibrary());
            }
            return coreLibrary;
        }
        function isDomLibrary() {
            var options;
            if (typeof domLibrary === "undefined") {
                options = getOptions();
                if (typeof options.domLibrary === "string") {
                    domLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.domLibrary).toLowerCase()) === -1;
                } else {
                    domLibrary = !!options.domLibrary;
                }
                domLibrary = domLibrary && !isLibrary();
            }
            return domLibrary;
        }
        function isScriptHostLibrary() {
            var options;
            if (typeof scriptHostLibrary === "undefined") {
                options = getOptions();
                if (typeof options.scriptHostLibrary === "string") {
                    scriptHostLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.scriptHostLibrary).toLowerCase()) === -1;
                } else {
                    scriptHostLibrary = !!options.scriptHostLibrary;
                }
                scriptHostLibrary = scriptHostLibrary && !isLibrary();
            }
            return scriptHostLibrary;
        }
        function isWebWorkerLibrary() {
            var options;
            if (typeof webWorkerLibrary === "undefined") {
                options = getOptions();
                if (typeof options.webWorkerLibrary === "string") {
                    webWorkerLibrary = ["off", "no", "false", "0", ""].indexOf(String(options.webWorkerLibrary).toLowerCase()) === -1;
                } else {
                    webWorkerLibrary = !!options.webWorkerLibrary;
                }
                webWorkerLibrary = webWorkerLibrary && !isLibrary();
            }
            return webWorkerLibrary;
        }
        function getReferences() {
            var options;
            if (typeof references === "undefined") {
                options = getOptions();
                references = [];
                if (isCoreLibrary()) {
                    references.push("node_modules/grunt-tsc/bin/lib.core.d.ts");
                }
                if (isLibrary()) {
                    references.push("node_modules/grunt-tsc/bin/lib.d.ts");
                }
                if (isDomLibrary()) {
                    references.push("node_modules/grunt-tsc/bin/lib.dom.d.ts");
                }
                if (isScriptHostLibrary()) {
                    references.push("node_modules/grunt-tsc/bin/lib.scriptHost.d.ts");
                }
                if (isWebWorkerLibrary()) {
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
        function getTarget() {
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
        function getModule() {
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
        function hasDeclaration() {
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
        function hasComments() {
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
        function hasSourceMap() {
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
        function hasImplicitAny() {
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
        function hasPreserveConstEnums() {
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
        function getSourceRoot() {
            if (typeof sourceRoot === "undefined") {
                sourceRoot = String(options.sourceRoot || "") || null;
            }
            return sourceRoot;
        }
        function getMapRoot() {
            if (typeof mapRoot === "undefined") {
                mapRoot = String(options.mapRoot || "") || null;
            }
            return mapRoot;
        }
        function getEncoding() {
            var options;
            if (typeof encoding === "undefined") {
                options = getOptions();
                encoding = String(options.encoding || "utf8") || "utf8";
            }
            return encoding;
        }
        function getSize(value) {
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
                    displayErrors(errors.join("\n"));
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
                var args = [],
                    command = "node",
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
                getNodePath(function (path) {
                    try {
                        if (!isWindows()) {
                            command = "/usr/bin/env";
                            args.push("node");
                        }
                        args.push(getCompilerPath());
                        args.push("--target", getTarget());
                        args.push("--module", getModule());
                        if (!hasComments()) {
                            args.push("--removeComments");
                        }
                        if (hasDeclaration()) {
                            args.push("--declaration");
                        }
                        if (!hasImplicitAny()) {
                            args.push("--noImplicitAny");
                        }
                        if (hasPreserveConstEnums()) {
                            args.push("--preserveConstEnums");
                        }
                        if (hasSourceMap()) {
                            args.push("--sourcemap");
                            if (getSourceRoot() !== null) {
                                args.push("--sourceRoot", getSourceRoot());
                            }
                            if (getMapRoot() !== null) {
                                args.push("--mapRoot", getMapRoot());
                            }
                        }
                        getReferences().forEach(function (filename) {
                            args.push(path.relative(getSourceDirectory(), filename));
                        });
                        args.push(getSourceFile());
                        grunt.log.debug("command:", command);
                        grunt.log.debug("args:", args.join(" "));
                        grunt.log.debug("cwd:", getSourceDirectory());
                        process = spawn(command, args, {cwd: getSourceDirectory()});
                        process.stderr.on("data", function (data) {
                            errors.push(data.toString());
                        });
                        process.stdout.on("data", function (data) {
                            errors.push(data.toString());
                        });
                        process.on("close", function (code) {
                            if (code !== 0) {
                                displayErrors(errors.join("\n"));
                                grunt.fail.warn("Something went wrong.");
                                done(false);
                            } else {
                                moveFiles();
                            }
                        });
                    } catch (error) {
                        // todo: show errors
                    }
                });
                function getTime() {
                    var temp = String((Number(new Date() - time)) / 1000 + 0.0001).split(".");
                    return temp[0] + (temp.length > 1 ? "." + temp[1].substr(0, 3) : ".000") + "s";
                }
                function getResult() {
                    var source;
                    var extension;
                    var filename;
                    var directory;
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
                    var source;
                    var extension;
                    var filename;
                    var directory;
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
                        firstRun = true;
                    moveJavascript();
                    if (hasSourceMap()) {
                        moveSourceMap();
                    }
                    if (hasDeclaration()) {
                        moveDeclaration();
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
                        function showStdout() {
                            var prefix = "output";
                            if (path.substr(-5) === ".d.ts") {
                                prefix = "declaration";
                            } else if (path.substr(-7) === ".js.map") {
                                prefix = "sourcemap";
                            }
                            grunt.log.writeln(getTitle(prefix) + path.cyan + " (" + String(getSize(stats.size)).yellow + ")");
                        }
                        if (error) {
                            displayErrors(String(error || ""));
                            done(false);
                        } else {
                            workers--;
                            if (firstRun) {
                                grunt.log.writeln(">>>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + getSource().green + " (" + String(getTime()).yellow + ")");
                            }
                            showStdout();
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
                args.push("--target", getTarget());
                args.push("--module", getModule());
                if (!hasComments()) {
                    args.push("--removeComments");
                }
                if (hasDeclaration()) {
                    args.push("--declaration");
                }
                if (!hasImplicitAny()) {
                    args.push("--noImplicitAny");
                }
                if (hasPreserveConstEnums()) {
                    args.push("--preserveConstEnums");
                }
                if (hasSourceMap()) {
                    args.push("--sourcemap");
                    if (getSourceRoot() !== null) {
                        args.push("--sourceRoot", getSourceRoot());
                    }
                    if (getMapRoot() !== null) {
                        args.push("--mapRoot", getMapRoot());
                    }
                }
                getReferences().forEach(function (filename) {
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
                        displayErrors(errors.join("\n"));
                        grunt.fail.warn("Something went wrong.");
                        done(false);
                    } else {
                        grunt.log.writeln(">>>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + String(getSources().length).green + " file(s) (" + time(Number(new Date()) - time1).yellow + ")");
                        countDestinations++;
                        getSources().forEach(function (source) {
                            grunt.log.writeln(getTitle("input") + path.join(getWorkingDirectory(), source).green);
                        });
                        grunt.log.writeln(getTitle("output") + getDestination().cyan + " (" + String("000B").yellow + ")");
                        if (hasDeclaration()) {
                            countDeclarations++;
                            grunt.log.writeln(getTitle("declaration") + getDeclaration().cyan + " (" + String("000B").yellow + ")");
                        }
                        if (hasSourceMap()) {
                            countMaps++;
                            grunt.log.writeln(getTitle("sourcemap") + getSourceMap().cyan + " (" + String("000B").yellow + ")");
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
                grunt.log.writeln("compiler: " + version.green);
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
                    encoding:           getEncoding(),
                    library:            isLibrary().toString(),
                    coreLibrary:        isCoreLibrary().toString(),
                    domLibrary:         isDomLibrary().toString(),
                    scriptHostLibrary:  isScriptHostLibrary().toString(),
                    webWorkerLibrary:   isWebWorkerLibrary().toString()
                }, "options");
                if (getReferences().length) {
                    grunt.log.writeflags(getReferences(), "references");
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

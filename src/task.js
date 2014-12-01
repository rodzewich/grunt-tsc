/*jslint */
/*global module, require, process, __dirname, setTimeout */

var spawn    = require("child_process").spawn,
    path     = require("path"),
    fs       = require("fs"),
    os       = require("os"),
    rows     = process.stdout.rows,
    columns  = process.stdout.columns,
    cwd      = process.cwd(),
    execPath = process.execPath,
    versions = require(path.resolve(__dirname, "../bin/versions.js"));

process.stdout.on("resize", function () {
    "use strict";
    rows    = process.stdout.rows;
    columns = process.stdout.columns;
});

// todo: adjust use options.compilerVersion

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
            fileMode,
            dirMode,
            compiler,
            nodePath,
            realCompilerVersion,
            compilerVersion;
        function typeOf(value) {
            var type  = String(Object.prototype.toString.call(value) || '').slice(8, -1) || 'Object',
                types = ['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function', 'Null', 'Number', 'Object', 'String', 'Undefined'];
            if (types.indexOf(type) !== -1) {
                type = type.toLowerCase();
            }
            return type;
        }
        function deferred(actions) {
            function iterate() {
                setTimeout(function () {
                    var action = actions.shift();
                    if (typeOf(action) === "function") {
                        action(iterate);
                    }
                }, 0);
            }
            iterate();
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
                            fs.mkdir(dir, getDirModeOption(), function (error) {
                                callback(error || null);
                            });
                        }
                    });
                }
            ]);
        }
        function move(path1, path2, callback) {
            var stats,
                content;
            deferred([
                function (next) {
                    mkdir(path.join(cwd, path.dirname(path2)), function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.readFile(path1, {encoding: getEncodingOption()}, function (error, data) {
                        if (error) {
                            callback(error, null);
                        } else {
                            content = data;
                            next();
                        }
                    });
                },
                function (next) {
                    fs.writeFile(path2, content, {encoding: getEncodingOption()}, function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.unlink(path1, function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.chmod(path2, getFileModeOption(), function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.stat(path2, function (error, result) {
                        if (error) {
                            callback(error, null);
                        } else {
                            stats = result;
                            next();
                        }
                    });
                },
                function () {
                    callback(null, stats, path2);
                }
            ]);
        }
        function executable(mode) {
            return (mode & 73) === 73;
        }
        function compilePropertyNameWithPadding(value) {
            var array = new Array(20 - value.length);
            return array.join(" ") + value + ": ";
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
            if (!length) {
                grunt.log.writeln("Nothing to compile.".yellow);
            } else {
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
        }
        function isTypescriptError(content) {

        }
        function displayTypescriptError(content) {

        }
        function displayError(error) {

        }
        function getOptions() {
            if (typeOf(options) === "undefined") {
                options = self.options() || {};
            }
            return options;
        }
        function getFileModeOption() {
            var opt,
                temp;
            if (typeOf(fileMode) === "undefined") {
                opt = getOptions();
                temp = String(opt.fileMode || "");
                if (typeOf(opt.fileMode) === "undefined") {
                    temp = "644";
                } else if (!/^[0-7]{3,3}$/.test(temp)) {
                    throw new Error("bla bla bla");
                }
                fileMode = parseInt(temp, 8);
            }
            return fileMode;
        }
        function getDirModeOption() {
            var opt,
                temp;
            if (typeOf(dirMode) === "undefined") {
                opt = getOptions();
                temp = String(opt.dirMode || "");
                if (typeOf(opt.dirMode) === "undefined") {
                    temp = "755";
                } else if (!/^[0-7]{3,3}$/.test(temp)) {
                    throw new Error("bla bla bla");
                }
                dirMode = parseInt(temp, 8);
            }
            return dirMode;
        }
        function fetchCompilerOption(callback) {
            var opt = getOptions(),
                stats,
                temp;
            function handler(error, resolve) {
                setTimeout(function () {
                    callback(error, resolve);
                });
            }
            deferred([
                function (next) {
                    if (typeOf(temp) === "undefined") {
                        handler(null, null);
                    } else {
                        next();
                    }
                },
                function (next) {
                    fs.exists(temp, function (resolve) {
                        if (!resolve) {
                            callback(new Error("Incorrect \"compiler\" option, file not found."), null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.realpath(temp, function (error, realpath) {
                        if (error) {
                            handler(new Error("Incorrect \"compiler\" option, file not found."), null);
                        } else {
                            temp = realpath;
                            next();
                        }
                    });
                },
                function (next) {
                    fs.stat(temp, function (error, result) {
                        if (error) {
                            handler(new Error("Incorrect \"compiler\" option: " + error.message), null);
                        } else {
                            stats = result;
                            next();
                        }
                    });
                },
                function (next) {
                    if (!stats.isFile()) {
                        handler(new Error("Incorrect \"compiler\" option, path should be a file."), null);
                    } else {
                        next();
                    }
                },
                function () {
                    handler(null, temp);
                }
            ]);
            if (typeOf(opt.compiler) !== "undefined") {
                temp = String(opt.compiler);
            }
        }
        function getCompilerOption() {
            return compiler || getCompilerDefault();
        }
        function setCompilerOption(value) {
            compiler = value || getCompilerDefault();
        }
        function fetchNodePathOption(callback) {
            var opt = getOptions(),
                temp,
                stats;
            function handler(error, resolve) {
                setTimeout(function () {
                    callback(error, resolve);
                });
            }
            deferred([
                function (next) {
                    if (typeOf(temp) === "undefined") {
                        handler(null, null);
                    } else {
                        next();
                    }
                },
                function (next) {
                    fs.exists(temp, function (resolve) {
                        if (!resolve) {
                            callback(new Error("Incorrect \"nodePath\" option, file not found."), null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.realpath(temp, function (error, realpath) {
                        if (error) {
                            handler(new Error("Incorrect \"nodePath\" option, file not found."), null);
                        } else {
                            temp = realpath;
                            next();
                        }
                    });
                },
                function (next) {
                    fs.stat(temp, function (error, result) {
                        if (error) {
                            handler(new Error("Incorrect \"nodePath\" option: " + error.message), null);
                        } else {
                            stats = result;
                            next();
                        }
                    });
                },
                function (next) {
                    if (!stats.isFile()) {
                        handler(new Error("Incorrect \"nodePath\" option, path should be a file."), null);
                    } else {
                        next();
                    }
                },
                function (next) {
                    if (!executable(stats.mode)) {
                        handler(new Error("Incorrect \"nodePath\" option, file should be executable."), null);
                    } else {
                        next();
                    }
                },
                function () {
                    handler(null, temp);
                }
            ]);
            if (typeOf(opt.nodePath) !== "undefined") {
                temp = String(opt.nodePath);
            }
        }
        function getNodePathOption() {
            return nodePath || execPath;
        }
        function setNodePathOption(value) {
            nodePath = value || execPath;
        }
        function hasLibraryOption() {
            var opt;
            function hasDomLibraryOption() {
                var result = false,
                    temp   = opt.domLibrary;
                if (typeOf(temp) === "string") {
                    result = ["off", "no", "false", "0", ""].indexOf(String(temp).toLowerCase()) === -1;
                } else {
                    result = !!temp;
                }
                return result;
            }
            function hasScriptHostLibraryOption() {
                var result = false,
                    temp   = opt.scriptHostLibrary;
                if (typeOf(temp) === "string") {
                    result = ["off", "no", "false", "0", ""].indexOf(String(temp).toLowerCase()) === -1;
                } else {
                    result = !!temp;
                }
                return result;
            }
            function hasWebWorkerLibraryOption() {
                var result = false,
                    temp   = opt.webWorkerLibrary;
                if (typeOf(temp) === "string") {
                    result = ["off", "no", "false", "0", ""].indexOf(String(temp).toLowerCase()) === -1;
                } else {
                    result = !!temp;
                }
                return result;
            }
            if (typeOf(library) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.library) === "string") {
                    library = ["off", "no", "false", "0", ""].indexOf(String(opt.library).toLowerCase()) === -1;
                } else {
                    library = !!opt.library;
                }
                library = library || (hasDomLibraryOption() && hasScriptHostLibraryOption() && hasWebWorkerLibraryOption());
            }
            return library;
        }
        function hasCoreLibraryOption() {
            var opt;
            if (typeOf(coreLibrary) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.coreLibrary) === "string") {
                    coreLibrary = ["off", "no", "false", "0", ""].indexOf(String(opt.coreLibrary).toLowerCase()) === -1;
                } else {
                    coreLibrary = !!opt.coreLibrary;
                }
                coreLibrary = coreLibrary && !(hasLibraryOption() || hasDomLibraryOption() || hasScriptHostLibraryOption() || hasWebWorkerLibraryOption());
            }
            return coreLibrary;
        }
        function hasDomLibraryOption() {
            var opt;
            if (typeOf(domLibrary) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.domLibrary) === "string") {
                    domLibrary = ["off", "no", "false", "0", ""].indexOf(String(opt.domLibrary).toLowerCase()) === -1;
                } else {
                    domLibrary = !!opt.domLibrary;
                }
                domLibrary = domLibrary && !hasLibraryOption();
            }
            return domLibrary;
        }
        function hasScriptHostLibraryOption() {
            var opt;
            if (typeOf(scriptHostLibrary) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.scriptHostLibrary) === "string") {
                    scriptHostLibrary = ["off", "no", "false", "0", ""].indexOf(String(opt.scriptHostLibrary).toLowerCase()) === -1;
                } else {
                    scriptHostLibrary = !!opt.scriptHostLibrary;
                }
                scriptHostLibrary = scriptHostLibrary && !hasLibraryOption();
            }
            return scriptHostLibrary;
        }
        function hasWebWorkerLibraryOption() {
            var opt;
            if (typeOf(webWorkerLibrary) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.webWorkerLibrary) === "string") {
                    webWorkerLibrary = ["off", "no", "false", "0", ""].indexOf(String(opt.webWorkerLibrary).toLowerCase()) === -1;
                } else {
                    webWorkerLibrary = !!opt.webWorkerLibrary;
                }
                webWorkerLibrary = webWorkerLibrary && !hasLibraryOption();
            }
            return webWorkerLibrary;
        }
        function getReferencesOption() {
            var opt;
            if (typeOf(references) === "undefined") {
                opt = getOptions();
                references = [];
                if (hasCoreLibraryOption()) {
                    references.push(path.join("node_modules/grunt-tsc/bin", getCompilerVersionOption(), "lib.core.d.ts"));
                }
                if (hasLibraryOption()) {
                    references.push(path.join("node_modules/grunt-tsc/bin", getCompilerVersionOption(), "lib.d.ts"));
                }
                if (hasDomLibraryOption()) {
                    references.push(path.join("node_modules/grunt-tsc/bin", getCompilerVersionOption(), "lib.dom.d.ts"));
                }
                if (hasScriptHostLibraryOption()) {
                    references.push(path.join("node_modules/grunt-tsc/bin", getCompilerVersionOption(), "lib.scriptHost.d.ts"));
                }
                if (hasWebWorkerLibraryOption()) {
                    references.push(path.join("node_modules/grunt-tsc/bin", getCompilerVersionOption(), "lib.webworker.d.ts"));
                }
                if (typeOf(opt.references) !== "undefined") {
                    try {
                        references = references.concat(grunt.file.expand({
                            filter: function (filename) {
                                return grunt.file.isFile(filename) &&
                                    filename.substr(-5).toLowerCase() === ".d.ts";
                            }
                        }, opt.references));
                    } catch (error) {
                        references = [];
                        throw new Error("Incorrect references: " + String(error || ""));
                    }
                }
            }
            return references;
        }
        function getTargetOption() {
            var opt,
                temp;
            if (typeOf(target) !== "string") {
                opt = getOptions();
                temp = String(opt.target || "").toUpperCase();
                if (typeOf(opt.target) === "undefined" || temp === "DEFAULT") {
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
            var opt,
                temp;
            if (typeOf(module) !== "string") {
                opt = getOptions();
                temp = String(opt.module || "").toLowerCase();
                if (typeOf(opt.module) === "undefined") {
                    module = "commonjs";
                } else if (["commonjs", "amd"].indexOf(temp) !== -1) {
                    module = temp;
                } else {
                    throw new Error("Incorrect \"module\" option, must be \"commonjs\" or \"amd\".");
                }
            }
            return module;
        }
        function getCompilerDefault() {
            if (typeOf(compilerPath) === "undefined") {
                compilerPath = path.resolve(__dirname, "../bin/" + getCompilerVersionOption() + "/tsc.js");
            }
            return compilerPath;
        }
        function hasDeclarationOption() {
            var opt;
            if (typeOf(declaration) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.declaration) === "string") {
                    declaration = ["off", "no", "false", "0", ""].indexOf(String(opt.declaration).toLowerCase()) === -1;
                } else {
                    declaration = !!opt.declaration;
                }
            }
            return !!declaration;
        }
        function hasCommentsOption() {
            var opt;
            if (typeOf(comments) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.comments) === "undefined") {
                    comments = true;
                } else if (typeOf(opt.comments) === "string") {
                    comments = ["off", "no", "false", "0", ""].indexOf(String(opt.comments).toLowerCase()) === -1;
                } else {
                    comments = !!opt.comments;
                }
            }
            return !!comments;
        }
        function hasSourceMapOption() {
            var opt;
            if (typeOf(sourcemap) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.sourcemap) === "string") {
                    sourcemap = ["off", "no", "false", "0", ""].indexOf(String(opt.sourcemap).toLowerCase()) === -1;
                } else {
                    sourcemap = !!opt.sourcemap;
                }
            }
            return !!sourcemap;
        }
        function hasImplicitAnyOption() {
            var opt;
            if (typeOf(implicitAny) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.implicitAny) === "undefined") {
                    implicitAny = true;
                } else if (typeOf(opt.implicitAny) === "string") {
                    implicitAny = ["off", "no", "false", "0", ""].indexOf(String(opt.implicitAny).toLowerCase()) === -1;
                } else {
                    implicitAny = !!opt.implicitAny;
                }
            }
            return !!implicitAny;
        }
        function hasPreserveConstEnumsOption() {
            var opt;
            if (typeOf(preserveConstEnums) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.preserveConstEnums) === "string") {
                    preserveConstEnums = ["off", "no", "false", "0", ""].indexOf(String(opt.preserveConstEnums).toLowerCase()) === -1;
                } else {
                    preserveConstEnums = !!opt.preserveConstEnums;
                }
            }
            return !!preserveConstEnums;
        }
        function getSourceRootOption() {
            var opt = getOptions();
            if (typeOf(sourceRoot) === "undefined") {
                sourceRoot = String(opt.sourceRoot || "") || null;
            }
            return sourceRoot;
        }
        function getMapRootOption() {
            var opt = getOptions();
            if (typeOf(mapRoot) === "undefined") {
                mapRoot = String(opt.mapRoot || "") || null;
            }
            return mapRoot;
        }
        function getEncodingOption() {
            var opt;
            if (typeOf(encoding) === "undefined") {
                opt = getOptions();
                encoding = String(opt.encoding || "utf8") || "utf8";
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
        function fetchRealCompilerVersion(callback) {
            var content = "",
                errors  = [],
                args    = [],
                command = getNodePathOption(),
                process;
            args.push(getCompilerOption());
            args.push("--version");
            grunt.log.debug("command:", command);
            grunt.log.debug("args:", args.join(" "));
            process = spawn(command, args);
            process.stderr.on("data", function (data) {
                errors.push(String(data || ""));
            });
            process.stdout.on("data", function (data) {
                content += data.toString();
                errors.push(String(data || ""));
            });
            process.on("close", function (code) {
                if (code !== 0) {
                    callback(errors.join("\n"));
                } else {
                    if (/^.*version\s+(\S+).*$/im.test(content)) {
                        callback(null, content.replace(/^.*version\s+(\S+).*$/im, "$1").split("\r").join("").split("\n").join(""));
                    } else {
                        callback(null, "unknown");
                    }
                }
            });
        }
        function getRealCompilerVersion() {
            return realCompilerVersion || "unknown";
        }
        function setRealCompilerVersion(value) {
            realCompilerVersion = value || "unknown";
        }
        function fetchDeclarationsPaths(callback) {

        }
        function setDeclarationsPaths(paths) {}
        function getDeclarationsPaths() {}
        function getCompilerVersionOption() {
            var opt,
                temp;
            if (typeOf(compilerVersion) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.compilerVersion) !== "undefined") {
                    temp = String(opt.compilerVersion || "").toLowerCase();
                    if (versions.indexOf(temp) === -1) {
                        throw new Error("bla bla bla");
                    }
                    compilerVersion = temp;
                } else {
                    compilerVersion = "default";
                }
                if (["default", "latest"].indexOf(compilerVersion) === -1) {
                    compilerVersion = "v" + compilerVersion;
                }
            }
            return compilerVersion;
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
            function hasExpand() {
                if (typeof expand === "undefined") {
                    // todo: fix this, may be use item.expand.
                    expand = !!item.orig.expand;
                }
                return expand;
            }
            function getSources() {
                if (typeOf(sources) === "undefined") {
                    sources = item.src;
                }
                return sources;
            }
            function getDestination() {
                if (typeOf(destination) === "undefined") {
                    destination = String(item.dest || "");
                }
                return destination;
            }
            function getWorkingDirectory() {
                if (typeOf(workingDirectory) === "undefined") {
                    workingDirectory = "";
                    if (typeOf(item.cwd) !== "undefined") {
                        workingDirectory = String(item.cwd || "");
                    } else if (item.orig && typeOf(item.orig.cwd) !== "undefined") {
                        workingDirectory = String(item.orig.cwd || "");
                    }
                }
                return workingDirectory;
            }
            function compileManyToMany() {
                var args    = [],
                    errors  = [],
                    time    = Number(new Date()),
                    command,
                    compilerProcess,
                    sourceFile,
                    sourceDirectory,
                    result,
                    mapResult,
                    mapDestination,
                    declarationResult,
                    declarationDestination,
                    source;
                try {
                    command = getNodePathOption();
                    args.push(getCompilerOption());
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
                            moveResult(function (error) {
                                if (error) {
                                    displayError(error);
                                    done(false);
                                    return;
                                }
                                if (files.length) {
                                    iterate(files.shift());
                                } else {
                                    complete();
                                }
                            });
                        }
                    });
                } catch (error) {
                    displayError(error);
                    done(false);
                }
                function getTime() {
                    var temp = String((Number(new Date() - time)) / 1000 + 0.0001).split(".");
                    return temp[0] + (temp.length > 1 ? "." + temp[1].substr(0, 3) : ".000") + "s";
                }
                function getResult() {
                    var src, ext, name, dir;
                    if (typeOf(result) === "undefined") {
                        src  = getSource();
                        ext  = path.extname(src);
                        name = path.basename(src, ext);
                        dir  = path.dirname(src);
                        result = path.join(dir, name + ".js");
                    }
                    return result;
                }
                function getMapResult() {
                    var src, ext, name, dir;
                    if (typeOf(mapResult) === "undefined") {
                        src  = getSource();
                        ext  = path.extname(src);
                        name = path.basename(src, ext);
                        dir  = path.dirname(src);
                        mapResult = path.join(dir, name + ".js.map");
                    }
                    return mapResult;
                }
                function getMapDestination() {
                    var dest, dir, ext, name;
                    if (typeOf(mapDestination) === "undefined") {
                        dest = getDestination();
                        ext  = path.extname(dest);
                        name = path.basename(dest, ext);
                        dir  = path.dirname(dest);
                        mapDestination = path.join(dir, name + ".js.map");

                    }
                    return mapDestination;
                }
                function getDeclarationResult() {
                    var source,
                        extension,
                        filename,
                        directory;
                    if (typeOf(declarationResult) === "undefined") {
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
                    if (typeOf(declarationDestination) === "undefined") {
                        destination            = getDestination();
                        extension              = path.extname(destination);
                        filename               = path.basename(destination, extension);
                        directory              = path.dirname(destination);
                        declarationDestination = path.join(directory, filename + ".d.ts");

                    }
                    return declarationDestination;
                }
                function getSource() {
                    if (typeOf(source) === "undefined") {
                        source = String(getSources()[0] || "");
                    }
                    return source;
                }
                function getSourceFile() {
                    if (typeOf(sourceFile) !== "string") {
                        sourceFile = path.basename(getSources()[0]);
                    }
                    return sourceFile;
                }
                function getSourceDirectory() {
                    if (typeOf(sourceDirectory) !== "string") {
                        sourceDirectory = path.dirname(getSources()[0]);
                    }
                    return sourceDirectory;
                }
                function moveResult(callback) {
                    var firstRun = true,
                        actions = [];
                    function handler(next, error, stats, path) {
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
                            callback(error);
                        } else {
                            if (firstRun) {
                                grunt.log.writeln(">>>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + getSource().green + " (" + String(getTime()).yellow + ")");
                            }
                            displayStdout();
                            firstRun = false;
                            next();
                        }
                    }
                    function moveJavascript() {
                        countDestinations += 1;
                        actions.push(function (next) {
                            var path1 = getResult(),
                                path2 = getDestination();
                            move(path1, path2, function (error, stats, path) {
                                handler(next, error, stats, path);
                            });
                        });
                    }
                    function moveDeclaration() {
                        countDeclarations += 1;
                        actions.push(function (next) {
                            var path1 = getDeclarationResult(),
                                path2 = getDeclarationDestination();
                            move(path1, path2, function (error, stats, path) {
                                handler(next, error, stats, path);
                            });
                        });
                    }
                    function moveSourceMap() {
                        countMaps += 1;
                        actions.push(function (next) {
                            var path1 = getMapResult(),
                                path2 = getMapDestination();
                            move(path1, path2, function (error, stats, path) {
                                handler(next, error, stats, path);
                            });
                        });
                    }
                    moveJavascript();
                    if (hasSourceMapOption()) {
                        moveSourceMap();
                    }
                    if (hasDeclarationOption()) {
                        moveDeclaration();
                    }
                    actions.push(function () {
                        callback(null);
                    });
                    deferred(actions);
                }
            }
            function compileManyToOne() {
                var args = [],
                    errors = [],
                    command,
                    declaration,
                    sourcemap,
                    process;
                function getDeclaration() {
                    var destination,
                        extname,
                        dirname,
                        basename;
                    if (typeOf(declaration) === "undefined") {
                        destination = getDestination();
                        extname     = path.extname(destination);
                        dirname     = path.dirname(destination);
                        basename    = path.basename(destination, extname);
                        declaration = path.join(dirname, basename + ".d.ts");
                    }
                    return declaration;
                }
                function getSourceMap() {
                    if (typeOf(sourcemap) === "undefined") {
                        sourcemap = getDestination() + ".map";
                    }
                    return sourcemap;
                }
                command = getNodePathOption();
                args.push(getCompilerOption());
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
                    var outputSize,
                        declarationSize,
                        sourcemapSize;
                    if (code !== 0) {
                        displayErrorContent(errors.join("\n"));
                        grunt.fail.warn("Something went wrong.");
                        done(false);
                    } else {
                        countDestinations++;
                        grunt.log.writeln(">>>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + String(getSources().length).green + " file(s) (" + time(Number(new Date()) - time1).yellow + ")");
                        getSources().forEach(function (source) {
                            grunt.log.writeln(compilePropertyNameWithPadding("input") + path.join(getWorkingDirectory(), source).green);
                        });
                        deferred([
                            function (next) {
                                fs.stat(getDestination(), function (error, stats) {
                                    if (error) {
                                        // todo: display error
                                    } else {
                                        outputSize = stats.mode;
                                        next();
                                    }
                                });
                            },
                            function (next) {
                                if (hasSourceMapOption()) {
                                    fs.stat(getSourceMap(), function (error, stats) {
                                        if (error) {
                                            // todo: display error
                                        } else {
                                            sourcemapSize = stats.mode;
                                            next();
                                        }
                                    });
                                } else {
                                    next();
                                }
                            },
                            function (next) {
                                if (hasDeclarationOption()) {
                                    fs.stat(getDeclaration(), function (error, stats) {
                                        if (error) {
                                            // todo: display error
                                        } else {
                                            declarationSize = stats.mode;
                                            next();
                                        }
                                    });
                                } else {
                                    next();
                                }
                            },
                            function () {
                                grunt.log.writeln(compilePropertyNameWithPadding("output") + getDestination().cyan + " (" + getFileSize(outputSize).yellow + ")");
                                if (hasSourceMapOption()) {
                                    countMaps++;
                                    grunt.log.writeln(compilePropertyNameWithPadding("sourcemap") + getSourceMap().cyan + " (" + getFileSize(sourcemapSize).yellow + ")");
                                }
                                if (hasDeclarationOption()) {
                                    countDeclarations++;
                                    grunt.log.writeln(compilePropertyNameWithPadding("declaration") + getDeclaration().cyan + " (" + getFileSize(declarationSize).yellow + ")");
                                }
                                if (files.length) {
                                    iterate(files.shift());
                                } else {
                                    complete();
                                }
                            }
                        ]);
                    }
                });
            }
            if (hasExpand()) {
                compileManyToMany();
            } else {
                compileManyToOne();
            }
        }
        function compile() {
            deferred([
                function (next) {
                    fetchCompilerOption(function (error, compiler) {
                        if (error) {
                            displayError(error);
                        } else {
                            setCompilerOption(compiler);
                            next();
                        }
                    });
                },
                function (next) {
                    fetchNodePathOption(function (error, nodePath) {
                        if (error) {
                            displayError(error);
                        } else {
                            setNodePathOption(nodePath);
                            next();
                        }
                    });
                },
                function (next) {
                    fetchRealCompilerVersion(function (errorContent, version) {
                        if (errorContent) {
                            displayErrorContent(errorContent);
                        } else {
                            setRealCompilerVersion(version);
                            next();
                        }
                    });
                },
                function () {
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
                        compilerVersion:    getRealCompilerVersion(),
                        compiler:           getCompilerOption(),
                        nodePath:           getNodePathOption(),
                        fileMode:           getFileModeOption().toString(8),
                        dirMode:            getDirModeOption().toString(8)
                    }, "options");
                    if (getReferencesOption().length) {
                        grunt.log.writeflags(getReferencesOption(), "references");
                    }
                    if (files.length) {
                        iterate(files.shift());
                    } else {
                        complete();
                    }
                }
            ]);
        }
        compile();
    });
};

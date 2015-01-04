/*global module, require, process, __dirname, setTimeout */

var spawn    = require("child_process").spawn,
    path     = require("path"),
    fs       = require("fs"),
    rows     = process.stdout.rows,
    columns  = process.stdout.columns,
    cwd      = process.cwd(),
    execPath = process.execPath,
    compilerVersions;

process.stdout.on("resize", function () {
    "use strict";
    rows    = process.stdout.rows;
    columns = process.stdout.columns;
});

function getVersions() {
    "use strict";
    if (!compilerVersions) {
        compilerVersions = require(path.resolve(__dirname, "../bin/versions.js"));
    }
    return compilerVersions;
}

function typeOf(value) {
    "use strict";
    var type  = String(Object.prototype.toString.call(value) || '').slice(8, -1) || 'Object',
        types = ['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function', 'Null', 'Number', 'Object', 'String', 'Undefined'];
    if (types.indexOf(type) !== -1) {
        type = type.toLowerCase();
    }
    return type;
}

function deferred(actions) {
    "use strict";
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
    "use strict";
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
                    fs.mkdir(dir, function (error) {
                        callback(error || null);
                    });
                }
            });
        }
    ]);
}

module.exports = function (grunt) {
    "use strict";
    grunt.registerMultiTask("tsc", "Compile typescript files", function () {
        var self   = this,
            files  = self.files,
            length = files.length,
            done   = this.async(),
            time1  = Number(new Date()),
            versions = getVersions(),
            filesForClean     = [],
            countDeclarations = 0,
            countDestinations = 0,
            countMaps = 0,
            options,
            declaration,
            sourcemap,
            target,
            module,
            mapRoot,
            sourceRoot,
            comments,
            implicitAny,
            preserveConstEnums,
            references,
            system,
            library,
            compiler,
            compilerDefault,
            node,
            version,
            realVersion;

        function move(path1, path2, callback) {
            var stats, content;
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
                    fs.readFile(path1, function (error, data) {
                        if (error) {
                            callback(error, null);
                        } else {
                            content = data;
                            next();
                        }
                    });
                },
                function (next) {
                    fs.writeFile(path2, content, function (error) {
                        if (error) {
                            callback(error, null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    var filename = path.resolve(cwd, path1);
                    if (filesForClean.indexOf(filename) === -1) {
                        filesForClean.push(filename);
                    }
                    next();
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

        function getOptions() {
            if (typeOf(options) === "undefined") {
                options = self.options() || {};
            }
            return options;
        }

        function getBool(value, defaults) {
            if (typeOf(value) === "undefined") {
                return !!defaults;
            }
            if (typeOf(value) === "string") {
                return ["off", "no", "false", "0", ""].indexOf(String(value).toLowerCase()) === -1;
            }
            return !!value;
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
                        grunt.log.write(">>".red + " ");
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
                // todo: implement display time
                grunt.log.writeln(">>".green + " complete " + String(count).green + " files(s) (" + String(time(Number(new Date()) - time1)).yellow + ")");
                grunt.log.writeln(compilePropertyNameWithPadding("javascript") + String(countDestinations).cyan + " file(s)");
                grunt.log.writeln(compilePropertyNameWithPadding("declaration") + String(countDeclarations).cyan + " file(s)");
                grunt.log.writeln(compilePropertyNameWithPadding("sourcemap") + String(countMaps).cyan + " file(s)");
            }
        }

        function displayError(error) {
            grunt.log.writeln(">>".red + " " + String(error.name).red + " " + error.message);
            grunt.log.writeln(error.stack.split(/(?:\n|\r)+/).slice(1).map(function (element) { return ">>".red + " " + element; }).join("\n"));
        }

        function displayWarning(content) {
            grunt.log.writeln(">> WARNING:".yellow + " " + String(content));
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
                        handler(new Error("Incorrect \"compiler\" option, should be path to file."), null);
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
            if (typeOf(opt.compiler) !== "undefined" && typeOf(opt.version) !== "undefined") {
                displayWarning("Option \"version\" ignored, because option \"compiler\" used instead.");
            }
        }

        function getCompilerOption() {
            return compiler || getCompilerDefault();
        }

        function setCompilerOption(value) {
            compiler = value || getCompilerDefault();
        }

        function fetchNodeOption(callback) {
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
                            callback(new Error("Incorrect \"node\" option, file not found."), null);
                        } else {
                            next();
                        }
                    });
                },
                function (next) {
                    fs.realpath(temp, function (error, realpath) {
                        if (error) {
                            handler(new Error("Incorrect \"node\" option, file not found."), null);
                        } else {
                            temp = realpath;
                            next();
                        }
                    });
                },
                function (next) {
                    fs.stat(temp, function (error, result) {
                        if (error) {
                            handler(new Error("Incorrect \"node\" option: " + error.message), null);
                        } else {
                            stats = result;
                            next();
                        }
                    });
                },
                function (next) {
                    if (!stats.isFile()) {
                        handler(new Error("Incorrect \"node\" option, path should be a file."), null);
                    } else {
                        next();
                    }
                },
                function (next) {
                    if ((stats.mode & 73) !== 73) {
                        handler(new Error("Incorrect \"node\" option, file should be executable."), null);
                    } else {
                        next();
                    }
                },
                function () {
                    handler(null, temp);
                }
            ]);
            if (typeOf(opt.node) !== "undefined") {
                temp = String(opt.node);
            }
        }

        function getNodeOption() {
            return node || execPath;
        }

        function setNodeOption(value) {
            node = value || execPath;
        }

        function getLibDeclaration() {
            return path.relative(cwd, path.join(__dirname, "../bin", getVersionOption(), "lib.d.ts"));
        }

        function hasLibraryOption() {
            var notSystem;
            if (typeOf(library) === "undefined") {
                library = getBool(getOptions().library);
                notSystem = !getSystemOption().length;
                if (library && !notSystem) {
                    displayWarning("Option \"library\" ignored, because option \"system\" used instead.");
                }
                library = library && notSystem;
            }
            return library;
        }

        function getSystemOption() {
            var opt;
            if (typeOf(system) !== "array") {
                system = [];
                opt = getOptions();
                if (typeOf(opt.system) !== "undefined") {
                    system = grunt.file.expand({
                        cwd: path.relative(cwd, path.join(__dirname, "../bin", getVersionOption())),
                        filter: function (filename) {
                            return grunt.file.isFile(filename) &&
                                filename.substr(-5).toLowerCase() === ".d.ts";
                        }
                    }, opt.system);
                }
                system = system.map(function (filename) {
                    return path.relative(cwd, path.join(__dirname, "../bin", getVersionOption(), filename));
                });
            }
            return system;
        }

        function getReferencesOption() {
            var opt;
            if (typeOf(references) === "undefined") {
                opt = getOptions();
                references = [];
                if (hasLibraryOption()) {
                    references.push(getLibDeclaration());
                }
                references = references.concat(getSystemOption());
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
            var opt, temp, ver;
            if (typeOf(target) !== "string") {
                opt  = getOptions();
                temp = String(opt.target || "").toUpperCase();
                ver  = parseFloat(getRealVersion());
                if (typeOf(opt.target) === "undefined" || temp === "DEFAULT") {
                    target = "ES3";
                } else if (temp === "LATEST") {
                    target = ver < 1.4 ? "ES5" : "ES6";
                } else if ((["ES3", "ES5", "ES6"].indexOf(temp) !== -1 && ver >= 1.4) || (["ES3", "ES5"].indexOf(temp) !== -1 && ver < 1.4)) {
                    target = temp;
                } else {
                    throw new Error("Incorrect \"target\" option, must be \"default\", \"es3\", \"es5\"" + (ver < 1.4 ? ", \"es6\"" : "") + " or \"latest\".");
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
            if (typeOf(compilerDefault) === "undefined") {
                compilerDefault = path.join(__dirname, "../bin", getVersionOption(), "tsc.js");
            }
            return compilerDefault;
        }

        function hasDeclarationOption() {
            if (typeOf(declaration) === "undefined") {
                declaration = getBool(getOptions().declaration);
            }
            return !!declaration;
        }

        function hasCommentsOption() {
            if (typeOf(comments) === "undefined") {
                comments = getBool(getOptions().comments, true);
            }
            return !!comments;
        }

        function hasSourceMapOption() {
            if (typeOf(sourcemap) === "undefined") {
                sourcemap = getBool(getOptions().sourcemap);
            }
            return !!sourcemap;
        }

        function hasImplicitAnyOption() {
            if (typeOf(implicitAny) === "undefined") {
                implicitAny = getBool(getOptions().implicitAny, true);
            }
            return !!implicitAny;
        }

        function hasPreserveConstEnumsOption() {
            if (typeOf(preserveConstEnums) === "undefined") {
                preserveConstEnums = getBool(getOptions().preserveConstEnums);
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

        function fetchRealVersion(callback) {
            var content = "",
                errors  = [],
                args    = [],
                command = getNodeOption(),
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
                var ver;
                if (code !== 0) {
                    callback(errors.join("\n"));
                } else {
                    if (/^.*version\s+(\S+).*$/im.test(content)) {
                        ver = content.replace(/^.*version\s+(\S+).*$/im, "$1").split("\r").join("").split("\n").join("").split(".").slice(0, 2).join(".");
                        callback(null, versions.indexOf(ver) !== -1 ? ver : "latest");
                    } else {
                        callback(null, "latest");
                    }
                }
            });
        }

        function getRealVersion() {
            return realVersion || "unknown";
        }

        function setRealVersion(value) {
            realVersion = value || "unknown";
        }

        function getVersionOption() {
            var opt,
                temp;
            if (typeOf(version) === "undefined") {
                opt = getOptions();
                if (typeOf(opt.version) !== "undefined") {
                    temp = String(opt.version || "").toLowerCase();
                    if (versions.indexOf(temp) === -1) {
                        throw new Error("Incorrect \"version\" option, should be " + versions.slice(0, versions.length - 1).map(function (element) { return "\"" + element + "\""; }).join(", ") + " or \"" + versions[versions.length - 1] + "\".");
                    }
                    version = temp;
                } else {
                    version = "default";
                }
                if (["default", "latest"].indexOf(version) === -1) {
                    version = "v" + version;
                }
            }
            return version;
        }

        // todo: delete
        function time(value) {
            var temp = String(value / 1000 + 0.0001).split(".");
            return temp[0] + (temp.length > 1 ? "." + temp[1].substr(0, 3) : ".000") + "s";
        }

        function complete() {
            deferred([
                // remove temporary files
                function (next) {
                    var actions = [];
                    filesForClean.forEach(function (filepath) {
                        actions.push(function (next) {
                            var exists = false;
                            deferred([
                                function (next) {
                                    fs.exists(filepath, function (result) {
                                        exists = result;
                                        next();
                                    });
                                },
                                function (next) {
                                    if (exists) {
                                        fs.unlink(filepath, function () {
                                            grunt.log.debug("unlink", filepath);
                                            next();
                                        });
                                    } else {
                                        next();
                                    }
                                },
                                function () {
                                    next();
                                }
                            ]);
                        });
                    });
                    actions.push(function () {
                        next();
                    });
                    deferred(actions);
                },
                // display complete report
                function () {
                    displayCompleteReport();
                    done(true);
                }
            ]);
        }

        function iterate(item) {
            var expand,
                destination,
                workingDirectory,
                sources;
            function hasExpand() {
                if (typeOf(expand) === "undefined") {
                    if (typeOf(item.expand) !== "undefined") {
                        expand = !!item.expand;
                    } else if (["off", "no", "false", "0", ""].indexOf(String(item.orig.expand).toLowerCase()) !== -1) {
                        expand = false;
                    } else {
                        expand = !!item.orig.expand;
                    }
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
                function getTime() {
                    var temp = String((Number(new Date() - time)) / 1000 + 0.0001).split(".");
                    return temp[0] + (temp.length > 1 ? "." + temp[1].substr(0, 3) : ".000") + "s";
                }
                function getSource() {
                    if (typeOf(source) === "undefined") {
                        source = String(getSources()[0] || "");
                    }
                    return source;
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
                    var src, ext, name, dir;
                    if (typeOf(declarationResult) === "undefined") {
                        src  = getSource();
                        ext  = path.extname(src);
                        name = path.basename(src, ext);
                        dir  = path.dirname(src);
                        declarationResult = path.join(dir, name + ".d.ts");
                    }
                    return declarationResult;
                }
                function getDeclarationDestination() {
                    var dest, dir, ext, name;
                    if (typeOf(declarationDestination) === "undefined") {
                        dest = getDestination();
                        ext  = path.extname(dest);
                        name = path.basename(dest, ext);
                        dir  = path.dirname(dest);
                        declarationDestination = path.join(dir, name + ".d.ts");

                    }
                    return declarationDestination;
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
                            var prefix = "javascript",
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
                                grunt.log.writeln(">>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + getSource().green + " (" + String(getTime()).yellow + ")");
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
                try {
                    command = getNodeOption();
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
                                } else if (files.length) {
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
            }
            function compileManyToOne() {
                var args = [],
                    errors = [],
                    time2 = Number(new Date()),
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
                try {
                    command = getNodeOption();
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
                            countDestinations += 1;
                            grunt.log.writeln(">>".green + " compile (" + String(length - files.length).yellow + " of " + String(length).yellow + ") " + String(getSources().length).green + " file(s) (" + time(Number(new Date()) - time2).yellow + ")");
                            getSources().forEach(function (source) {
                                grunt.log.writeln(compilePropertyNameWithPadding("typescript") + path.join(getWorkingDirectory(), source).green);
                            });
                            deferred([
                                function (next) {
                                    fs.stat(getDestination(), function (error, stats) {
                                        if (error) {
                                            displayError(error);
                                            done(false);
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
                                                displayError(error);
                                                done(false);
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
                                                displayError(error);
                                                done(false);
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
                                    grunt.log.writeln(compilePropertyNameWithPadding("javascript") + getDestination().cyan + " (" + getFileSize(outputSize).yellow + ")");
                                    if (hasSourceMapOption()) {
                                        countMaps += 1;
                                        grunt.log.writeln(compilePropertyNameWithPadding("sourcemap") + getSourceMap().cyan + " (" + getFileSize(sourcemapSize).yellow + ")");
                                    }
                                    if (hasDeclarationOption()) {
                                        countDeclarations += 1;
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
                } catch (error) {
                    displayError(error);
                    done(false);
                }
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
                            done(false);
                        } else {
                            try {
                                setCompilerOption(compiler);
                                next();
                            } catch (err) {
                                displayError(err);
                            }
                        }
                    });
                },
                function (next) {
                    fetchNodeOption(function (error, node) {
                        if (error) {
                            displayError(error);
                            done(false);
                        } else {
                            setNodeOption(node);
                            next();
                        }
                    });
                },
                function (next) {
                    fetchRealVersion(function (errorContent, version) {
                        if (errorContent) {
                            displayErrorContent(errorContent);
                        } else {
                            setRealVersion(version);
                            next();
                        }
                    });
                },
                function () {
                    try {
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
                            version:            getRealVersion(),
                            compiler:           getCompilerOption(),
                            node:               getNodeOption(),
                            library:            hasLibraryOption().toString(),
                            system:             getSystemOption(),
                            references:         getReferencesOption()
                        }, "options");
                        if (files.length) {
                            iterate(files.shift());
                        } else {
                            complete();
                        }
                    } catch (error) {
                        displayError(error);
                        done(false);
                    }
                }
            ]);
        }

        compile();
    });
};

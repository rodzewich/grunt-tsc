# grunt-tsc [![NPM version](https://badge.fury.io/js/grunt-tsc.png)](http://badge.fury.io/js/grunt-tsc) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/grunt-tsc.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/grunt-tsc)
[![Npm Downloads](https://nodei.co/npm-dl/grunt-tsc.png?height=3&months=1)](https://www.npmjs.org/package/grunt-tsc)

Compile typescript files via [grunt](http://gruntjs.com/) tasks.

## Documentation

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a Gruntfile as well as install and use [Grunt](http://gruntjs.com/) plugins. Once you're familiar with that process, you may install this plugin with this command:

``` shell
npm install grunt-tsc --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of javascript:

``` javascript
grunt.loadNpmTasks("grunt-tsc");
```

Then add some configuration for the plugin like so:

``` javascript
grunt.initConfig({
    tsc: {
        options: {
            // global options
        },
        task_name: {
            options: {
                // task options
            },
            files: [{
                expand : true,
                dest   : "dest",
                cwd    : "src",
                ext    : ".js",
                src    : [
                    "*.ts",
                    "!*.d.ts"
                ]
            }]
        }
    }
});
```

## Options

### options.target

* **type** &lt;string&gt;
* **default** "default"

Specify ECMAScript target version: "default", "es3", "es5", "es6" or "latest".


### options.module

* **type** &lt;string&gt;
* **default** "commonjs"

Specify module code generation: "commonjs" or "amd".


### options.declaration

* **type** &lt;boolean&gt;
* **default** false

Generates corresponding *.d.ts file.


### options.comments

* **type** &lt;boolean&gt;
* **default** true

Emit comments to output.


### options.sourcemap

* **type** &lt;boolean&gt;
* **default** false

Generates corresponding *.map file.


### options.implicitAny

* **type** &lt;boolean&gt;
* **default** false

Warn on expressions and declarations with an implied "any" type.


### options.preserveConstEnums

* **type** &lt;boolean&gt;
* **default** false

Do not erase const enum declarations in generated code.


### options.sourceRoot

* **type** &lt;string&gt;
* **default** null

Specifies the location where debugger should locate typescript files instead of source locations.


### options.mapRoot

* **type** &lt;string&gt;
* **default** null

Specifies the location where debugger should locate map files instead of generated locations.


### options.references

* **type** &lt;string|string[]&gt;
* **default** []

Additional *.d.ts references.


### options.system

* **type** &lt;string|string[]&gt;
* **default** []

Additional *.d.ts references. Find references in current compiler folder (maybe custom compiler folder too).


### options.library

* **type** &lt;boolean&gt;
* **default** false

Enable general library references (include all references).


### options.version

* **type** &lt;string&gt;
* **default** "latest"

Compiler version, allow values: "1.0", "1.1", "1.3", "1.4", "default" and "latest".


### options.compiler

* **type** &lt;string&gt;
* **default** null

Path to tsc compiler (allow paths to *.js files). Example: "/usr/local/lib/node_modules/typescript/bin/tsc.js" for default system installation.


### options.node

* **type** &lt;string&gt;
* **default** null


## Example

``` javascript
grunt.initConfig({
    tsc: {
        // global options
        options: {
        },
        task_name: {
            // task options
            options: {
                target:             "default",
                module:             "commonjs",
                declaration:        true,
                comments:           true,
                sourcemap:          true,
                implicitAny:        true,
                preserveConstEnums: false,
                sourceRoot:         "/public/sources",
                mapRoot:            "/public/maps"
            },
            files: [
                // Compile many to many
                {
                    expand : true,
                    dest   : "dest",
                    cwd    : "src",
                    ext    : ".js",
                    src    : [
                        "*.ts",
                        "!*.d.ts"
                    ]
                },
                // Compile many to one
                {
                }
            ]
        }
    }
});
```


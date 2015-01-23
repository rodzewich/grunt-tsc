# grunt-tsc [![NPM version](https://badge.fury.io/js/grunt-tsc.png)](http://badge.fury.io/js/grunt-tsc) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/grunt-tsc.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/grunt-tsc)
[![Npm Downloads](https://nodei.co/npm-dl/grunt-tsc.png?height=3&months=3)](https://www.npmjs.org/package/grunt-tsc)

Compile typescript files via [grunt](http://gruntjs.com/) tasks.

## Documentation

You'll need to install grunt-tsc first:

``` shell
npm install grunt-tsc --save-dev
```

Or add the following line to devDependencies in your package.json:

``` javascript
"grunt-tsc": "",
```

Then modify your Gruntfile.js file by adding the following line:

``` javascript
grunt.loadNpmTasks('grunt-tsc');
```

Then add some configuration for the plugin like so:

``` javascript
grunt.initConfig({
    tsc: {
        // global options
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
        task: {
            // task options
            options: {},
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

Warn on expressions and declarations with an implied 'any' type.


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

Additional *.d.ts references.


### options.library

* **type** &lt;boolean&gt;
* **default** false

Enable general library references (include all references).

### options.node

### options.version

### options.compiler

## Examples

``` javascript
grunt.initConfig({
    tsc: {
        test1: {
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


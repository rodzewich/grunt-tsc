# grunt-tsc [![NPM version](https://badge.fury.io/js/grunt-tsc.png)](http://badge.fury.io/js/grunt-jsdoc) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/grunt-tsc.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-tsc.png?downloads=true&stars=true)

Compile *.ts files via [grunt](http://gruntjs.com/) tasks.

## Documentation

You'll need to install grunt-tsc first:

```
npm install grunt-tsc --save-dev
```

or add the following line to `devDependencies` in your `package.json`

``` javascript
"grunt-tsc": "",
```

Then modify your `Gruntfile.js` file by adding the following line:

``` javascript
grunt.loadNpmTasks('grunt-tsc');
```

Then add some configuration for the plugin like so:

``` javascript
grunt.initConfig({
    tsc: {
    }
});
```

## Options

### options.target

* **type** string
* **default** "default"

Specify ECMAScript target version: "DEFAULT", "ES3", "ES5", "ES6" or "LATEST".


### options.module

* **type** string
* **default** "commonjs"

Specify module code generation: 'commonjs' or 'amd'.


### options.declaration

* **type** boolean
* **default** false

Generates corresponding '.d.ts' file.


### options.comments

* **type** boolean
* **default** true

Do not emit comments to output.


### options.sourcemap

* **type** boolean
* **default** false

Generates corresponding '.map' file.


### options.implicitAny

* **type** boolean
* **default** false

Warn on expressions and declarations with an implied 'any' type.


### options.preserveConstEnums

* **type** boolean
* **default** false

Do not erase const enum declarations in generated code.


### options.sourceRoot

* **type** string
* **default** null

Specifies the location where debugger should locate TypeScript files instead of source locations.


### options.mapRoot

* **type** string
* **default** null

Specifies the location where debugger should locate map files instead of generated locations.


### options.encoding

* **type** string
* **default** "utf8"

encoding


## Examples

```javascript
grunt.initConfig({
    tsc: {
        test1: {
            options: {
                target:             "es3",
                module:             "commonjs",
                declaration:        true,
                comments:           true,
                sourcemap:          true,
                implicitAny:        true,
                preserveConstEnums: false,
                sourceRoot:         "/public/sources",
                mapRoot:            "/public/maps",
                encoding:           "utf8"
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


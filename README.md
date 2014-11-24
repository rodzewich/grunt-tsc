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
            mapRoot:            "/public/maps",
            encoding:           "utf8"
        },
        task1: {
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

* **type** `<string>`
* **default** `"default"`

Specify ECMAScript target version: "default", "es3", "es5", "es6" or "latest".


### options.module

* **type** `<string>`
* **default** `"commonjs"`

Specify module code generation: "commonjs" or "amd".


### options.declaration

* **type** `<boolean>`
* **default** `false`

Generates corresponding *.d.ts file.


### options.comments

* **type** `<boolean>`
* **default** `true`

Emit comments to output.


### options.sourcemap

* **type** `<boolean>`
* **default** `false`

Generates corresponding *.map file.


### options.implicitAny

* **type** `<boolean>`
* **default** `false`

Warn on expressions and declarations with an implied 'any' type.


### options.preserveConstEnums

* **type** `<boolean>`
* **default** `false`

Do not erase const enum declarations in generated code.


### options.sourceRoot

* **type** `<string>`
* **default** `null`

Specifies the location where debugger should locate typescript files instead of source locations.


### options.mapRoot

* **type** `<string>`
* **default** `null`

Specifies the location where debugger should locate map files instead of generated locations.


### options.encoding

* **type** `<string>`
* **default** `"utf8"`

Source file encoding.


### options.references

* **type** `<string|string[]>`
* **default** `[]`

Additional *.d.ts references.


### options.library

* **type** `<boolean>`
* **default** `false`

Enable general library references (include all references).


### options.coreLibrary

* **type** `<boolean>`
* **default** `false`

Enable core library references only.


### options.domLibrary

* **type** `<boolean>`
* **default** `false`

Enable dom library references (include core references).


### options.scriptHostLibrary

* **type** `<boolean>`
* **default** `false`

Enable windows scripts library references (include core references).


### options.webWorkerLibrary

* **type** `<boolean>`
* **default** `false`

Enable web worker library references (include core references).


## Examples

```javascript
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


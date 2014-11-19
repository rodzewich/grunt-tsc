# grunt-tsc [![NPM version](https://badge.fury.io/js/grunt-tsc.png)](http://badge.fury.io/js/grunt-jsdoc) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/grunt-tsc.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-tsc.png?downloads=true&stars=true)

Compile *.ts files via [grunt](http://gruntjs.com/) tasks.

## Documentation

You'll need to install grunt-tsc first:

```
npm install grunt-tsc --save-dev
```

or add the following line to __devDependencies__ in your `package.json`

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


### options.encoding

* **type** &lt;string&gt;
* **default** "utf8"

Source file encoding.


### options.references

* **type** &lt;string|string[]&gt;
* **default** []

Additional *.d.ts references.


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


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
* **default** default

description


### options.module

* **type** string
* **default** commonjs

description


### options.declaration

* **type** boolean
* **default** false

description


### options.comments

* **type** boolean
* **default** true

description


### options.sourcemap

* **type** boolean
* **default** false

description


### options.implicitAny

* **type** boolean
* **default** false

description


### options.preserveConstEnums

* **type** boolean
* **default** false

description


### options.sourceRoot

* **type** string
* **default** null

description


### options.mapRoot

* **type** string
* **default** null

description


### options.encoding

* **type** string
* **default** utf8

description


## Examples

```javascript
grunt.initConfig({
    tsc: {
        test1: {
            options: {
                target: "es3",
                module: "commonjs",
                declaration: true,
                comments: true,
                sourcemap: true,
                implicitAny: true,
                preserveConstEnums: false,
                sourceRoot: '',
                mapRoot: '',
                encoding: "utf8"
            },
            files: [
                // Compile many to many
                {
                    ext    : '.js',
                    expand : true,
                    dest   : 'dest',
                    cwd    : 'src',
                    src    : [
                        '*.ts',
                        '!*.d.ts'
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


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

### options.preserveConstEnums

**type**: `boolean`

**default**: `false`

Do not erase const enum declarations in generated code.

### options.removeComments

**type**: `boolean`

**default**: `false`

Do not emit comments to output.

### options.sourceMap

**type**: `boolean`
**default**: `false`
Generates corresponding *.map file.


### options.target

## Example



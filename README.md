# Makeify

Makeify is a utility to create deeply nested objects from paths. Similar to lodash's `_.set`. Makeify uses [ES6 proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to enable a convenient syntax.

[![NPM Version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/johnste/makeify.svg?branch=master)](https://travis-ci.org/johnste/makeify)

## How to use

```
import makeify from 'makeify'

const value = makeify().deeply.nested[1]('a value'); //  === { deeply: { nested : [undefined, 'a value '] } }

```

## Browser and server support

ES6 Proxies are currently supported by the latest stable version of Chrome, Firefox and Edge. It is not supported by Node 5.x or Safari yet.

[ES6 compatibility table: Proxy](http://kangax.github.io/compat-table/es6/#test-Proxy)

## Install

`npm install makeify`

## API

### `makeify().any.path['here'][3](optionalValue)`

The path is any valid javascript path. Makeify will return an object matching the path with the final property being set to the `optionalValue`

[npm-image]: https://img.shields.io/npm/v/makeify.svg
[npm-url]: https://npmjs.org/package/makeify

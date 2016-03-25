# Makeify

Makeify is a utility to create deeply nested objects from paths. Similar to lodash's `_.set`. Makeify uses [ES6 proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to enable a convenient syntax.

[![NPM Version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/johnste/makeify.svg?branch=master)](https://travis-ci.org/johnste/makeify)
[![Dependency Status](https://david-dm.org/johnste/makeify.svg)](https://david-dm.org/johnste/makeify)
[![devDependency Status](https://david-dm.org/johnste/makeify/dev-status.svg)](https://david-dm.org/johnste/makeify#info=devDependencies)
## How to use

```javascript
import makeify from 'makeify'

// Create a new object
const value = makeify().deeply.nested[1]('a value'); //  === { deeply: { nested : [undefined, 'a value '] } }

// Mutate an existing object
const obj = { key: 'value' }
makeify(obj).key2('value 2') // obj === { key: 'value', key2: 'value 2'}

```

## Browser and server support

ES6 Proxies are currently supported by the latest stable version of Chrome, Firefox and Edge. It is not supported by Node 5.x or Safari yet.

[ES6 compatibility table: Proxy](http://kangax.github.io/compat-table/es6/#test-Proxy)

## Install

`npm install makeify`

## API

### `makeify().any.path['here'][3](optionalValue)`

The path is any valid javascript property path.
*Returns* an object matching the path with the final property being set to the `optionalValue`

### `makeify(object).any.path['here'][3](optionalValue)`

Mutates `object` and adds the path to it.
*Returns* the `object` with added properties.

[npm-image]: https://img.shields.io/npm/v/makeify.svg
[npm-url]: https://npmjs.org/package/makeify

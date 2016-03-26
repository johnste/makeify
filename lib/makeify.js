(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory)
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory()
	} else {
		// Browser globals (root is window)
		root.makeify = factory()
	}
}(this, function () {

	function createObjectFromPath(originalObject, path = []) {
		return function(defaultValue) {
			if (path.length === 0) {
				return originalObject === undefined ? defaultValue : originalObject
			}

			const firstKey = path[0]

			// if no object is supplied, create an object or an array based on the first available key
			const result = originalObject || (Number.isInteger(firstKey) ? new Array(firstKey + 1) : {})
			let current = result

			path.forEach((key, index) => {
				const nextKey = (path.length > index + 1) ? path[index + 1] : undefined
				const isLastKey = (path.length === index + 1)

				// If there is a next key and that key is a number, create this node as an array
				if (Number.isInteger(nextKey)) {
					current[key] = new Array(nextKey + 1)
				} else {
					current[key] = isLastKey ? defaultValue : {}
				}

				current = current[key]
			})

			return result
		}
	}

	function isNumberLike(value) {
		var reg = /^\d+$/
		var number = parseFloat(value, 10)
		return (value.match(reg) && Number.isInteger(number) && (number >= 0))
	}

	function makeify(originalObject) {
		if (arguments.length === 1) {
			const type = typeof originalObject
			if (!["object", "function"].includes(type)) {
				throw new TypeError(`Cannot mutate immutable arguments, "${typeof originalObject}" supplied`)
			}

			if ([null, undefined].includes(originalObject)) {
				throw new TypeError('Cannot mutate null or undefined')
			}
		}

		function handler(path) {
			return {
				get: (target, key, receiver) => {
					// If we're trying to get the prototype, return it
					if (target[key] && target[key].isPrototypeOf(target)) {
						return target[key]
					}

					// If the key is a symbol, return normal object
					// TODO: Add support for well-known symbols when browser
					// support is better
					if (typeof key == 'symbol') {
						return target[key]
					}

					if (isNumberLike(key)) {
						key = parseInt(key, 10)
					}

					const newPath = [...path, key]
					return getProxy(createObjectFromPath(originalObject, newPath), newPath)
				}
			}
		}

		function getProxy(obj, path = []) {
			return new Proxy(obj, handler(path))
		}

		return getProxy(createObjectFromPath(originalObject))
	}

	return makeify
}));
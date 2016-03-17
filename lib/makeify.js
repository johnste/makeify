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

	function isNumber(value) {
		var reg = /^\d+$/
		var number = parseFloat(value, 10)
		return (value.match(reg) && Number.isInteger(number) && (number >= 0))
	}

	function makeify(originalObject) {
		const path = []

		if (arguments.length === 1) {
			const type = typeof originalObject
			if (!["object", "function"].includes(type)) {
				throw new TypeError(`Cannot mutate immutable arguments, "${typeof originalObject}" supplied`)
			}

			if ([null, undefined].includes(originalObject)) {
				throw new TypeError('Cannot mutate null or undefined')
			}
		}

		function createObjectFromPath() {
			return function(defaultValue) {
				if (path.length === 0) {
					return originalObject === undefined ? defaultValue : originalObject
				}

				const firstKey = path[0]
				// if no object is supplied, create an object or an array based on the first available key
				const result = originalObject || ((typeof firstKey === "number") ? new Array(firstKey + 1) : {})
				let current = result

				path.forEach((key, index) => {
					const nextKey = (path.length > index + 1) ? path[index + 1] : undefined
					const isLastKey = (path.length === index + 1)

					// If there is a next key and that key is a number, create this node as an array
					if (typeof nextKey === "number") {
						current[key] = new Array(nextKey + 1)
					} else {
						current[key] = isLastKey ? defaultValue : {}
					}

					current = current[key]
				})

				return result
			}
		}

		function handler() {
			return {
				get: function(target, key, receiver){
						if (typeof key == 'symbol' || key == '__proto__') {
							return target[key]
						}

						path.push(isNumber(key) ? parseInt(key, 10) : key)
						return getProxy(createObjectFromPath())
					}
			}
		}

		function getProxy(obj) {
			return new Proxy(obj, handler())
		}

		return getProxy(createObjectFromPath())
	}

	return makeify
}));
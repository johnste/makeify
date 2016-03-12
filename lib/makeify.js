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

	function makeify() {
		const path = []

		function createObjectFromPath() {
			return function(val) {
				const firstKey = path[0]
				const obj = ((typeof firstKey === "number") ? new Array(firstKey + 1) : {})
				let current = obj

				path.forEach((key, index, array) => {
					const nextKey = (array.length > index + 1) ? array[index + 1] : false
					const isLastKey = (array.length === index + 1)

					if (typeof nextKey === "number") {
						current[key] = new Array(nextKey + 1)
					} else {
						current[key] = isLastKey ? val : {}
					}

					current = current[key]
				})

				return obj
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

		return getProxy((val) => val)
	}

	// Just return a value to define the module export.
	// This example returns an object, but the module
	// can return a function as the exported value.
	return makeify
}));
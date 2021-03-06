define(['lib/makeify'], (makeify) => {
	describe("creates values", () => {
		it("should return the default value when called without path", () => {
			expect(makeify()(), 'undefined').to.be.undefined
			expect(makeify()('a value'), '[0]').to.be.equal('a value')
		})

		it("should create properties based on simple paths", () => {
			expect(makeify().a(), '.a').to.be.deep.equal({
				a: undefined
			})

			expect(makeify()[0](), '[0]').to.be.deep.equal([
				undefined
			])
		})

		it("should create properties with values based on simple paths", () => {
			expect(makeify().a('a string'), '.a = "a string"').to.be.deep.equal({
				a: 'a string'
			})

			expect(makeify()[0]({a: 'something'}), '[0] = { a : something }').to.be.deep.equal([
				{a: 'something'}
			])
		})

		it("should create an object and not an array when given negative integer values", () => {
			expect(makeify()[-1](), '[-1]').to.be.deep.equal({
				'-1': undefined
			})
		})

		it("should create properties based on more complex paths", () => {
			const result = { a: [, {b: { c: undefined }}] }
			expect(makeify().a[1].b['c'](), '.a[1].b[\'c\']').to.be.deep.equal(result)

			const result2 = [{ b: { c: { c: undefined } } } ]
			expect(makeify()[0].b.c['c'](), '[0].b.c[\'c\']').to.be.deep.equal(result2)
		})
	})

	describe("mutates values", () => {
		it("should return the given object", () => {
			const obj = { a: 'A' }
			const obj2 = makeify(obj).b('B')
			expect(obj, 'add b=B returns object').to.be.equal(obj)
		})

		it("should return the given object unchanged", () => {
			const obj = { a: 'A' }
			expect(makeify(obj)(), 'noop').to.be.equal(obj)
		})

		it("should mutate a given object", () => {
			const obj = { a: 'A' }
			makeify(obj).b()
			expect(obj, 'add b=undefined').to.be.deep.equal({ a: 'A', b: undefined })
		})

		it("should mutate a given object with a default value", () => {
			const obj = { a: 'A' }
			makeify(obj).b('B')
			expect(obj, 'add b=B').to.be.deep.equal({ a: 'A', b: 'B' })
		})

		it("should mutate a given array", () => {
			const array = ['a']
			makeify(array)[1]('b')
			expect(array, '[a,b]').to.be.deep.equal(['a', 'b'])
		})

		it("should mutate a given object and not change it to an array", () => {
			const obj = { a: 'A' }
			makeify(obj)[0]('B')
			expect(obj, 'add 0=b').to.be.deep.equal({ a: 'A', '0': 'B' })
		})

		it("should NOT throw a TypeError when supplied with mutable arguments", () => {
			expect(() => makeify({}), 'cake').not.to.throw(TypeError)
			expect(() => makeify(() => 'test'), 'cake').not.to.throw(TypeError)
		})

		it("should throw a TypeError when supplied with immutable arguments", () => {
			expect(() => makeify(null), 'null').to.throw(TypeError)
			expect(() => makeify(undefined), 'undefined').to.throw(TypeError)
			expect(() => makeify(2), 'number').to.throw(TypeError)
			expect(() => makeify(Symbol()), 'Symbol').to.throw(TypeError)
			expect(() => makeify(true), 'Boolean').to.throw(TypeError)
		})
	})

	describe("reuse paths", () => {
		it("should be able to reuse object paths", () => {
			const m = makeify().a
			const b = m.b
			const c = m.c

			expect(b('foo')).to.be.deep.equal({a:{b:'foo'}})
			expect(c()).to.be.deep.equal({a:{c:undefined}})
		})

		it("should be able to reuse array paths", () => {
			const m = makeify().a
			const b = m[0]
			const c = m[1]

			expect(b('foo')).to.be.deep.equal({a:['foo']})
			expect(c('bar')).to.be.deep.equal({a:[, 'bar']})
		})
	})
})

define(['lib/makeify'], (makeify) => {
	describe("makeify", function() {
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
			// For some reason, the results are not considered equal if set as
			// a: [undefined, {b: ...}] so we're creating the object in two steps
			const result = { a: [] }
			result.a[1] = {b: { c: undefined }}
			expect(makeify().a[1].b['c'](), '.a[1].b[\'c\']').to.be.deep.equal(result)

			const result2 = [{ b: { c: { c: undefined } } } ]
			expect(makeify()[0].b.c['c'](), '[0].b.c[\'c\']').to.be.deep.equal(result2)
		})
	})
})
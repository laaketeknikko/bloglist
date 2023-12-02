const listHelper = require('../utils/list_helper')
const blogTestData = require('./test_data')



test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


describe('total likes', () => {
        
    test('total likes', () => {
        const result = listHelper.totalLikes(blogTestData)
        expect(result).toBe(36)
    })

    test('total likes with no blogs', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })
    
    test('total likes with one blog', () => {
        const result = listHelper.totalLikes([blogTestData[0]])
        expect(result).toBe(blogTestData[0].likes)
    })

})



describe("Favourite blog", () => {

    test("when no blogs", () => {
        const result = listHelper.favouriteBlog([])
        expect(result.length).toBe(0)
    })

    test("when one blog", () => {
        const result = listHelper.favouriteBlog([blogTestData[0]])
        expect(result).toEqual(blogTestData[0])
    })

    test("when multiple blogs", () => {
        const result = listHelper.favouriteBlog(blogTestData)
        // Blog 2 has most likes
        expect(result).toEqual(blogTestData[2])
    })

    test("when multiple same blogs", () => {
        const result = listHelper.favouriteBlog([blogTestData[0], blogTestData[0]])
        expect(result).toEqual(blogTestData[0])
    })
})

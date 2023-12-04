const listHelper = require('../utils/list_helper')
const {blogTestData} = require('./test_data')



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


describe("Most blogs", () => {
    
    test("with multiple blogs", () => {
        const result = listHelper.mostBlogs(blogTestData)
        expect(result).toBe("Robert C. Martin")
    })

    test("with no blogs", () => {
        const result = listHelper.mostBlogs([])
        expect(result).toBe("")
    })

    test("with one blog", () => {
        const result = listHelper.mostBlogs([blogTestData[0]])
        expect(result).toBe("Michael Chan")
    })
})


describe("Most likes", () => {

    test("with no blogs", () => {
        const result = listHelper.mostLikes([])
        expect(result).toBe(null)
    })

    test("with no blogs, Lodash version", () => {
        const result = listHelper.mostLikes_lodash([])
        expect(result).toBe(null)
    })

    test("with one blog", () => {
        const result = listHelper.mostLikes([blogTestData[0]])
        expect(result).toEqual({
            author: blogTestData[0].author,
            likes: blogTestData[0].likes
        })
    })

    test("with one blog, Lodash version", () => {
        const result = listHelper.mostLikes_lodash([blogTestData[1]])
        expect(result).toEqual({
            author: blogTestData[1].author,
            likes: blogTestData[1].likes
        })
    })

    test("with many blogs", () => {
        const result = listHelper.mostLikes(blogTestData)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })

    test("with many blogs", () => {
        const result = listHelper.mostLikes_lodash(blogTestData)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })

})

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app')
const testData = require("./test_data")
const Blog = require('../mongoose_models/Blog');
const logger = require('../utils/logger');

const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testData.blogTestData)
})

describe("GET API tests", () => {

test("The correct number of blogs is returned and the return format is JSON",
async () => {
    
    const result = await api.get("/api/blogs")
    .expect(200)
    .expect('Content-Type', /application\/json/)
        
    expect(result.body.length).toBe(testData.blogTestData.length)
})


test("_id field is replaced by id field in blogs posts",
async () => {
    const result = await api.get("/api/blogs")
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(result.body[0].id).toBeDefined()
    expect(result.body[0]._id).toBeFalsy()
})
})


describe("POST API tests", () => {

test("POST to /api/blogs inserts a blog into the database",
async () => {
    const postResult = await api.post("/api/blogs")
   .send(testData.newBlogData)
   .expect(201)
   .expect('Content-Type', /application\/json/)

   // Expect returned data to match sent data
   expect(postResult.body.title).toBe(testData.newBlogData.title)
   expect(postResult.body.author).toBe(testData.newBlogData.author)
   expect(postResult.body.url).toBe(testData.newBlogData.url)
   expect(postResult.body.likes).toBe(testData.newBlogData.likes)

   // Expect to find such a document in the database
   const blogResult = await Blog.findOne({title: testData.newBlogData.title})
   expect(blogResult.title).toBe(testData.newBlogData.title)
   expect(blogResult.author).toBe(testData.newBlogData.author)
   expect(blogResult.url).toBe(testData.newBlogData.url)
   expect(blogResult.likes).toBe(testData.newBlogData.likes)

   // Expect the number of documents in the database to increase by 1
   const blogCount = await Blog.countDocuments()
   expect(blogCount).toBe(testData.blogTestData.length + 1)
})


test("POST to /api/blogs with no likes inserts a blog into the database",
async () => {
    const postResult = await api.post("/api/blogs")
  .send(testData.newBlogData_noLikes)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  // Expect document to be inserted with 0 likes
  expect(postResult.body.likes).toBe(0)

  // Expect document to be fetched with 0 likes
  const blogResult = await Blog.findOne({title: testData.newBlogData_noLikes.title})
  expect(blogResult.likes).toBe(0)
})


test("POST to /api/blogs with no title returns status 400",
async () => {
    const postResult = await api.post("/api/blogs")
    .send(testData.newBlogData_noTitle)
    .expect(400)
})


test("POST to /api/blogs with no url returns status 400",
async () => {
    const postResult = await api.post("/api/blogs")
    .send(testData.newBlogData_noTitle)
    .expect(400)
})

})


describe("DELETE API tests", () => {

test("DELETE to /api/blogs/:id deletes a blog from the database",
async () => {
    const blog = await Blog.findOne({})
    
    const deleteResult = await api.delete(`/api/blogs/${blog.id}`)
    .expect(200)

    expect(blog.title).toEqual(deleteResult.body.title)
    
    expect(await Blog.countDocuments()).toBe(testData.blogTestData.length - 1)
})

})


describe("PUT API tests", () => {

test("PUT to /api/blogs/:id updates a blog",
async () => {
    const blog = await Blog.findOne({})
    blog.title = "PUT to /api/blogs/:id updates a blog"
    blog.likes = blog.likes + 10
    blog.url = "PUTtoapi.com"
    blog.author = "noname author"

    const result = await api.put(`/api/blogs/${blog._id}`)
    .send(blog.toJSON())
    .expect(200)

    const updatedBlog = await Blog.findOne({title: blog.title})

    expect(updatedBlog.title).toEqual(blog.title)
    expect(updatedBlog.likes).toEqual(blog.likes)
    expect(updatedBlog.url).toEqual(blog.url)
    expect(updatedBlog.author).toEqual(blog.author)
})
})

afterAll(async () => {
    await mongoose.connection.close()
})

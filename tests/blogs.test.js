const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app')
const testData = require("./test_data")
const Blog = require('../mongoose_models/Blog');
const User = require("../mongoose_models/User");
const logger = require('../utils/logger');
const deepClone = require("deep-clone").default
const bcrypt = require("bcrypt")
const config = require("../utils/config")

const api = supertest(app)

let userToken = null

const salts = config.BCRYPT_SALTS


beforeEach(async () => {
    
    // Repopulate the blogs collection
    await Blog.deleteMany({})
    await Blog.insertMany(testData.circularBlogTestData)

    // Repopulate the users collection
    await User.deleteMany({})
    const newUserData = deepClone(testData.circularUserData)

    newUserData[0].passwordHash = 
        await bcrypt.hash(newUserData[0].password, salts);
    newUserData[1].passwordHash =
        await bcrypt.hash(newUserData[1].password, salts);
    
    await User.insertMany(newUserData)

    // Create references
    const savedUsers = await User.find({})
    const savedBlogs = await Blog.find({})
    savedUsers[0].blogs = [
        savedBlogs[0]._id,
        savedBlogs[1]._id, 
        savedBlogs[2]._id,
        savedBlogs[3]._id]
    savedBlogs[0].user = savedUsers[0]._id
    savedBlogs[1].user = savedUsers[0]._id
    savedBlogs[2].user = savedUsers[0]._id
    savedBlogs[3].user = savedUsers[0]._id
    await savedUsers[0].save()
    await savedBlogs[0].save()
    await savedBlogs[1].save()
    await savedBlogs[2].save()
    await savedBlogs[3].save()
    

    // Get the user token
    const result = await api.post("/api/login").send({
        username: testData.newUserData[0].username,
        password: testData.newUserData[0].password
    })

    userToken = result.body.token
})



describe("GET API tests without authentication", () => {

    test("The correct number of blogs is returned and the return format is JSON",
    async () => {
        
        const result = await api.get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/)
            
        expect(result.body.length).toBe(testData.blogTestData.length)
    }, 1000000)


    test("_id field is replaced by id field in blogs posts",
    async () => {
        const result = await api.get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(result.body[0].id).toBeDefined()
        expect(result.body[0]._id).toBeFalsy()
    }, 1000000)
})



describe("POST API tests with", () => {

test("POST to /api/blogs inserts a blog into the database while user authenticated",
async () => {
    const postResult = await api.post("/api/blogs")
    .set({"Authorization": `Bearer ${userToken}`})
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
}, 1000000)

test("POST to /api/blogs without authentication doesn't insert a new blog",
async () => {

    const startBlogCount = await Blog.countDocuments()

    const postResult = await api.post("/api/blogs")
    .send(testData.newBlogData)
    .expect(401)
    .expect('Content-Type', /application\/json/)

    const endBlogCount = await Blog.countDocuments()
    expect(endBlogCount).toBe(startBlogCount)

    const savedBlog = await Blog.findOne({
        title: testData.newBlogData.title,
        author: testData.newBlogData.author})
    expect(savedBlog).toBeFalsy()
})

test("POST to /api/blogs with no likes inserts a blog into the database",
async () => {
    const postResult = await api.post("/api/blogs")
  .send(testData.newBlogData_noLikes)
  .set({"Authorization": `Bearer ${userToken}`})
  .expect(201)
  .expect('Content-Type', /application\/json/)

  // Expect document to be inserted with 0 likes
  expect(postResult.body.likes).toBe(0)

  // Expect document to be fetched with 0 likes
  const blogResult = await Blog.findOne({title: testData.newBlogData_noLikes.title})
  expect(blogResult.likes).toBe(0)
}, 1000000)


test("POST to /api/blogs with no title returns status 400",
async () => {
    const postResult = await api.post("/api/blogs")
    .set({"Authorization": `Bearer ${userToken}`})
    .send(testData.newBlogData_noTitle)
    .expect(400)
}, 1000000)


test("POST to /api/blogs with no url returns status 400",
async () => {
    const postResult = await api.post("/api/blogs")
    .set({"Authorization": `Bearer ${userToken}`})
    .send(testData.newBlogData_noTitle)
    .expect(400)
}, 1000000)

})


describe("DELETE API tests while authenticated", () => {

test("DELETE to /api/blogs/:id deletes a blog from the database",
async () => {

    const blog = await Blog.findOne({})
    const deleteResult = await api.delete(`/api/blogs/${blog._id}`)
    .set({"Authorization": `Bearer ${userToken}`})
    .expect(200)

    expect(await Blog.countDocuments()).toBe(testData.circularBlogTestData.length - 1)
    const deletedBlogById = await Blog.findById(blog._id)
    expect(deletedBlogById).toBeFalsy()
    const deletedBlogByTitle = await Blog.findOne({title: blog.title})
    expect(deletedBlogByTitle).toBeFalsy()
}, 1000000)

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
    .set({"Authorization": `Bearer ${userToken}`})
    .send(blog.toJSON())
    .expect(200)

    const updatedBlog = await Blog.findOne({title: blog.title})

    expect(updatedBlog.title).toEqual(blog.title)
    expect(updatedBlog.likes).toEqual(blog.likes)
    expect(updatedBlog.url).toEqual(blog.url)
    expect(updatedBlog.author).toEqual(blog.author)
}, 1000000)
})

afterAll(async () => {
    await mongoose.connection.close()
})

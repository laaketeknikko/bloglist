const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app')
const testData = require("./test_data")
const Blog = require('../mongoose_models/Blog')

const api = supertest(app)



beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testData)
})

test("The correct number of blogs is returned and the return format is JSON",
async () => {
    
    const result = await api.get("/api/blogs")
    .expect(200)
    .expect('Content-Type', /application\/json/)
        
    expect(result.body.length).toBe(testData.length)
})



afterAll(async () => {
    await mongoose.connection.close()
})

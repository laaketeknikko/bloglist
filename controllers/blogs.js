const blogsRouter = require("express").Router();
const Blog = require("../mongoose_models/Blog");
const logger = require('../utils/logger');



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
})


blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    response.json(blog)
})


blogsRouter.put('/:id', async (request, response) => {
    
    const result = await Blog.findByIdAndUpdate(
        request.params.id,
        {author: request.body.author,
        title: request.body.title,
        url: request.body.url,
        likes: request.body.likes},
        {runValidators: true})

    response.status(200).json(result)
})

module.exports = blogsRouter;

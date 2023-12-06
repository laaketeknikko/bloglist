const blogsRouter = require("express").Router();
const Blog = require("../mongoose_models/Blog");
const logger = require('../utils/logger');
const User = require("../mongoose_models/User");
const jwt = require("jsonwebtoken")
const JWTTokenExtractor = require("../middleware/JWTTokenExtractor")
const userExtractor = require("../middleware/userExtractor")


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user")
    response.json(blogs)
})


blogsRouter.post('/', [JWTTokenExtractor, userExtractor],
    async (request, response) => {

        const user = request.user

        if (!user) {
            return response.status(401).json({ error: "Unauthorized" })
        }
        else {
            const blog = new Blog(request.body)
            blog.user = user.id
            const result = await blog.save()
            await user.blogs.push(result.id)
            await user.save()

            return response.status(201).json(result)
        }
    })

/*
blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    response.json(blog)
})
*/

blogsRouter.delete("/:id", [JWTTokenExtractor, userExtractor],
    async (request, response) => {

        const blog = await Blog.findById(request.params.id)
        const user = request.user

        if (!blog || !user) {
            return response.status(401).json({ error: "Unauthorized" })
        }
        if (blog.user.toString() === user._id.toString()) {
            await blog.deleteOne()
            await user.blogs.pull(request.params.id)
            await user.save()

            response.status(200).json({ message: "Blog deleted" })
        }
        else {
            response.status(401).json({ error: "Unauthorized" })
        }
    })


blogsRouter.put('/:id', [JWTTokenExtractor, userExtractor],
    async (request, response) => {

        const user = request.user
        if (!user) {
            return response.status(401).json({ error: "Unauthorized" })
        }

        const blog = await Blog.findById(request.params.id)
        if (!blog || blog.user.toString() !== user.id.toString()) {
            return response.status(401).json({ error: "Unauthorized" })
        }

        const result = await Blog.findByIdAndUpdate(
            request.params.id,
            {
                author: request.body.author,
                title: request.body.title,
                url: request.body.url,
                likes: request.body.likes
            },
            { runValidators: true })

        response.status(200).json(result)
    })

module.exports = blogsRouter;

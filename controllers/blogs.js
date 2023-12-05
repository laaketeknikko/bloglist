const blogsRouter = require("express").Router();
const Blog = require("../mongoose_models/Blog");
const logger = require('../utils/logger');
const User = require("../mongoose_models/User");
const jwt = require("jsonwebtoken")



const getTokenFrom = request => {
    const authorization = request.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user")
    response.json(blogs)
})

// The exercise 4.17 says to use populate() when saving a new blog to find 
// a random user. I have no idea how this would be done and why you would do it.
// It makes no sense to me.
blogsRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: "Invalid token"})
    }
    const user = await User.findById(decodedToken.id)
    
    const blog = new Blog(request.body)
    blog.user = user.id
    const result = await blog.save()
    user.blogs.push(result.id)
    await user.save()

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
        likes: request.body.likes,
        user: request.body.user},
        {runValidators: true})

    response.status(200).json(result)
})

module.exports = blogsRouter;

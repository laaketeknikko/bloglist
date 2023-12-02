const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return 0
    }
    return blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)    
}


const favouriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return []
    }
    return blogs.reduce((max, current) => {
        if (current.likes >= max.likes) {
            return current
        }
        return max
    }, blogs[0])
}


module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}

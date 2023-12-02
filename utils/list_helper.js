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

// Probably not for large arrays
const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return  []
    }
    // First reduce blogs to a map of author:blogs
    let result = blogs.reduce((totals, current) => {
        totals[current.author] ?
        totals[current.author] += 1 : 
        totals[current.author] = 1
        
        return totals
    }, {})

    // Then reduce by number of blogs
    result = Object.entries(result)
    .reduce((max, current) => {
        if (current[1] >= max[1]) {
            max[0] = current[0]
            max[1] = current[1]
        }
        return max
    }, ["", 0])

    return result[0]
}


module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}

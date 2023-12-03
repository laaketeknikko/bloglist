const lodash = require('lodash');



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
        return  ""
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


const mostLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }
    // First reduce blogs to a map of author:blogs
    let result = blogs.reduce((totals, current) => {
        totals[current.author]?
        totals[current.author] += current.likes : 
        totals[current.author] = current.likes
        
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
   })

   return {
    author: result[0],
    likes: result[1]
   }
}


const mostLikes_lodash = (blogs) => {

    if (!blogs || blogs.length === 0) {
        return null
    }

    // Returns an array with authors as keys
    const result = lodash.groupBy(blogs, (blog) => {
        return blog.author
    })

    const maxLikes = Object.entries(result).reduce((mostLiked, current) => {
        const authorLikes = current[1].reduce((totalLikes, current) => {
            return current.likes + totalLikes
        }, 0)

        if (authorLikes > mostLiked.likes) {
            mostLiked.author = current[0]
            mostLiked.likes = authorLikes
        }
        return mostLiked
        
    }, {author: "", likes: 0})
    
    return maxLikes
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes,
    mostLikes_lodash
}

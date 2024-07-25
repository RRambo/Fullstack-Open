const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (sum, blog) => {
        return sum > blog.likes
            ? sum
            : blog.likes
    }
    const favorite = blogs.find((blog) => blog.likes === blogs.reduce(reducer, 0))

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    const counted = _.countBy(blogs, 'author')
    const favoriteAuthor = _.maxBy(Object.keys(counted), key => counted[key])

    return {
        author: favoriteAuthor,
        blogs: Math.max(...Object.values(counted))
    }
}

const mostLikes = (blogs) => {
    const authors = _.reduce(blogs, (result, value) => {
        (result[value.author] || (result[value.author] = [])).push(value.likes)
        return result
    }, {})
    /*
    authors format is now {
        'Michael Chan': [ 7 ],
        'Edsger W. Dijkstra': [ 5, 12 ],
        'Robert C. Martin': [ 10, 0, 2 ]
    }
    */
    const favoriteAuthor = _.maxBy(Object.keys(authors), key => _.sum(authors[key]))
    const sumOfLikes = _.sum(authors[favoriteAuthor])

    return {
        author: favoriteAuthor,
        likes: sumOfLikes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
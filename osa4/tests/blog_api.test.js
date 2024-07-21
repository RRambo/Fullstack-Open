const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('the correct amount of blogs returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('id field is named correctly', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const idShape = blogToView.id !== undefined
        ? 'id'
        : blogToView._id !== undefined
            ? '_id'
            : 'unknown'

    //getting the key of blogsAtStart[0] by the value
    assert.strictEqual(idShape, 'id')
})

describe('adding a blog', () => {
    test('succeeds with valid data', async () => {
        const newBlog = {
            title: 'a new blog',
            author: 'myself',
            url: 'no url',
            likes: 0,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const title = response.body.map(r => r.title)

        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

        assert(title.includes('a new blog'))
    })

    test('makes likes 0 if the field is empty', async () => {
        const newBlog = {
            title: 'a new blog',
            author: 'myself',
            url: 'no url',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        const newBlogs = await helper.blogsInDb()
        const savedBlog = newBlogs.find((blog) => blog.title === 'a new blog')

        assert.deepStrictEqual(savedBlog.likes, 0)
    })

    test('fails if title or url field is missing', async () => {
        const blogWithNoUrl = {
            title: 'a new blog',
            author: 'myself',
            likes: 0,
        }

        await api
            .post('/api/blogs')
            .send(blogWithNoUrl)
            .expect(400)

        const blogWithNoTitle = {
            author: 'myself',
            url: 'www.blog.fi',
            likes: 0,
        }

        await api
            .post('/api/blogs')
            .send(blogWithNoTitle)
            .expect(400)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
})

describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

        const title = blogsAtEnd.map(r => r.title)
        assert(!title.includes(blogToDelete.title))
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
    })
})

describe('editing or updating a blog', () => {
    test('succeeds with valid data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: 'updated blog',
            author: 'myself',
            url: 'no url',
            likes: 100,
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const likes = response.body.map(r => r.likes)
        const titles = response.body.map(n => n.title)

        assert(likes.includes(100))
        assert(titles.includes('updated blog'))
    })
})

after(async () => {
    await mongoose.connection.close()
})
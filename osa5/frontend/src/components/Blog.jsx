import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, blogToDelete }) => {
    const [visible, setVisible] = useState(false)
    const [username, setUsername] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUsername(user.username)
        }
    }, [])

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }
    const showRemoveButton = username === blog.user.username ? { display: '' } : { display: 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const addLike = (event) => {
        event.preventDefault()

        updateBlog({
            title: blog.title,
            author: blog.author,
            user: blog.user.id,
            url: blog.url,
            likes: blog.likes + 1,
            id: blog.id
        })
    }

    const removeBlog = (event) => {
        event.preventDefault()

        blogToDelete({
            title: blog.title,
            author: blog.author,
            id: blog.id
        })
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle}>
            <div className='blog'>
                {blog.title} {blog.author}
                <button style={hideWhenVisible} onClick={toggleVisibility} id='viewButton'>view</button>
                <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
                <div style={showWhenVisible} id='blogInfo'>
                    <div>{blog.url}</div>
                    <div>likes {blog.likes} <button onClick={addLike}>like</button></div>
                    <div>{blog.user.name}</div>
                    <div><button style={showRemoveButton} onClick={removeBlog}>remove</button></div>
                </div>
            </div>
        </div>
    )

}

Blog.propTypes = {
    blog: PropTypes.object.isRequired
}

export default Blog
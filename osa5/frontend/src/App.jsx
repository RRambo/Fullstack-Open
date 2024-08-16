import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [classToCall, setClassToCall] = useState('notification')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const addBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility()

        try {
            await blogService.create(blogObject)
            await blogService.getAll().then(blogs => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))

            setClassToCall('notification')
            setNotificationMessage(
                `a new blog ${blogObject.title} by ${blogObject.author} added`
            )
            setTimeout(() => {
                setNotificationMessage(null)
            }, 3000)

        } catch (exception) {
            setClassToCall('error')
            setNotificationMessage(exception.message)
            setTimeout(() => {
                setNotificationMessage(null)
            }, 3000)
        }
    }

    const addLike = async (blogObject) => {
        try {
            await blogService.update(blogObject.id, blogObject)
            await blogService.getAll().then(blogs => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))

        } catch (exception) {
            setClassToCall('error')
            setNotificationMessage(exception.message)
            setTimeout(() => {
                setNotificationMessage(null)
            }, 3000)
        }
    }

    const deleteBlog = async (blogToDelete) => {
        if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
            try {
                await blogService.remove(blogToDelete.id)
                await blogService.getAll().then(blogs => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))

                setClassToCall('notification')
                setNotificationMessage(
                    `blog ${blogToDelete.title} removed`
                )
                setTimeout(() => {
                    setNotificationMessage(null)
                }, 3000)
            } catch (exception) {
                setClassToCall('error')
                setNotificationMessage(exception.message)
                setTimeout(() => {
                    setNotificationMessage(null)
                }, 3000)
            }
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogAppUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            setClassToCall('notification')
            setNotificationMessage('logged in')
            setTimeout(() => {
                setNotificationMessage(null)
            }, 3000)
        } catch (exception) {
            setClassToCall('error')
            setNotificationMessage('wrong username or password')
            setTimeout(() => {
                setNotificationMessage(null)
            }, 3000)
        }
    }

    const handelLogout = () => {
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
        setClassToCall('notification')
        setNotificationMessage('logged out')
        setTimeout(() => {
            setNotificationMessage(null)
        }, 3000)
    }

    const blogFormRef = useRef()

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification message={notificationMessage} classToCall={classToCall} />

                <form data-testid='loginForm' onSubmit={handleLogin}>
                    <div>
                        username
                        <input
                            type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
                        password
                        <input
                            type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button type="submit">login</button>
                </form>
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={notificationMessage} classToCall={classToCall} />

            <div>
                <p>
                    {user.name} logged in
                    <button onClick={handelLogout}>log out</button>
                </p>
            </div>

            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
            </Togglable>
            <div id='blogs'>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} updateBlog={addLike} blogToDelete={deleteBlog} />
                )}
            </div>
        </div>
    )
}

export default App
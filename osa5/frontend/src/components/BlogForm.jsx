import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: ''
    })

    const addBlog = (event) => {
        event.preventDefault()
        createBlog(newBlog)

        setNewBlog({
            title: '',
            author: '',
            url: ''
        })
    }

    return (
        <div id='blogForm'>
            <h2>create a new blog</h2>
            <form onSubmit={addBlog}>
                <div>title:
                    <input
                        id='titleInput' value={newBlog.title} onChange={event => setNewBlog({
                            title: event.target.value,
                            author: newBlog.author,
                            url: newBlog.url
                        })}
                    />
                </div>
                <div>author:
                    <input
                        id='authorInput' value={newBlog.author} onChange={event => setNewBlog({
                            title: newBlog.title,
                            author: event.target.value,
                            url: newBlog.url
                        })}
                    />
                </div>
                <div>url:
                    <input
                        id='urlInput' value={newBlog.url} onChange={event => setNewBlog({
                            title: newBlog.title,
                            author: newBlog.author,
                            url: event.target.value
                        })}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author', () => {
    const blog = {
        title: 'the blog title',
        author: 'the author of blog',
        user: {
            username: 'Kalle',
            name: 'Kalle Boja',
            id: '123'
        },
        url: 'https://www.fi',
        likes: 0,
    }

    render(<Blog blog={blog} />)

    const title = screen.getByText(
        'the blog title', { exact: false }
    )

    const author = screen.getByText(
        'the author of blog', { exact: false }
    )

    expect(title).toBeDefined()
    expect(author).toBeDefined()
})

test('clicking the view button shows more info on the blog', async () => {
    const blog = {
        title: 'the blog title',
        author: 'the author of blog',
        user: {
            username: 'Kalle',
            name: 'Kalle Boja',
            id: '123'
        },
        url: 'https://www.fi',
        likes: 0,
    }

    const container = render(
        <Blog blog={blog} />
    ).container

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const viewButton = container.querySelector('#viewButton')
    expect(viewButton).toHaveStyle('display: none')

    const moreBlogInfo = container.querySelector('#blogInfo')
    expect(moreBlogInfo).not.toHaveStyle('display: none')
})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'the blog title',
        author: 'the author of blog',
        user: {
            username: 'Kalle',
            name: 'Kalle Boja',
            id: '123'
        },
        url: 'https://www.fi',
        likes: 0,
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockHandler} />)

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
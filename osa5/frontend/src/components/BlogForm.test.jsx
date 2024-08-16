import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm prop calls the right info when blog is created', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    const container = render(<BlogForm createBlog={mockHandler} />).container

    const titleInput = container.querySelector('#titleInput')
    const authorInput = container.querySelector('#authorInput')
    const urlInput = container.querySelector('#urlInput')

    const createButton = screen.getByText('create')

    await user.type(titleInput, 'blog#1')
    await user.type(authorInput, 'Kalle')
    await user.type(urlInput, 'www.fi')

    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('blog#1')
    expect(mockHandler.mock.calls[0][0].author).toBe('Kalle')
    expect(mockHandler.mock.calls[0][0].url).toBe('www.fi')
})
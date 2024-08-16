const loginWith = async (page, username, password) => {
    await page.locator('input[name="Username"]').fill(username)
    await page.locator('input[name="Password"]').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.locator('#titleInput').fill(title)
    await page.locator('#authorInput').fill(author)
    await page.locator('#urlInput').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(`${title}  ${author}`).waitFor()
}

const likeBlog = async (page, title, numberOfLikes) => {
    const blogToLike = await page.getByText(title)
    await blogToLike.getByRole('button', { name: 'view' }).click()
    for (let i = 0; i < numberOfLikes;) {
        await page.getByRole('button', { name: 'like' }).click()
        i++
        await blogToLike.getByText(i).waitFor()
    }
    await page.getByRole('button', { name: 'hide' }).click()
}

export { loginWith, createBlog, likeBlog }
const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Superuser',
                username: 'root',
                password: 'salainen'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const loginForm = await page.getByTestId('loginForm')
        await expect(loginForm).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'root', 'salainen')
            await expect(page.getByText('Superuser logged in')).toBeVisible
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'wrong', 'wrong')

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('wrong username or password')

            await expect(page.getByText('Superuser logged in')).not.toBeVisible
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'root', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Beat it', 'Michael Jackson', 'www.mj.com')

            await expect(page.getByText('a new blog Beat it by Michael Jackson')).toBeVisible()
            await expect(page.getByText('Beat it Michael Jackson')).toBeVisible()
        })

        test('blog can be liked', async ({ page }) => {
            await createBlog(page, 'Beat it', 'Michael Jackson', 'www.mj.com')

            await likeBlog(page, 'Beat it', 1)
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await page.getByText(/1/).waitFor()

            await expect(page.getByText('likes')).toHaveText(/1/)
        })

        test('blog can be removed', async ({ page }) => {
            await createBlog(page, 'Beat it', 'Michael Jackson', 'www.mj.com')

            await page.getByRole('button', { name: 'view' }).click()
            page.once('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()

            await expect(page.getByText('blog Beat it removed')).toBeVisible()
            await expect(page.getByText('Beat it Michael Jackson')).not.toBeVisible()
        })

        test('remove button cant be seen by other users', async ({ page, request }) => {
            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Guest',
                    username: 'guest',
                    password: '1234'
                }
            })
            
            await createBlog(page, 'Beat it', 'Michael Jackson', 'www.mj.com')

            await page.getByRole('button', { name: 'log out' }).click()
            await loginWith(page, 'guest', '1234')

            await page.getByRole('button', { name: 'view' }).click()

            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })

        test('blogs are ordered by likes', async ({ page }) => {
            await createBlog(page, 'Beat it', 'Michael Jackson', 'www.mj.com')
            await createBlog(page, 'Stairway to heaven', 'Led Zeppelin', 'www.lz.com')
            await createBlog(page, 'Wind of change', 'Scorpions', 'www.scorpions.com')

            await likeBlog(page, 'Beat it', 1)
            await likeBlog(page, 'Stairway to heaven', 2)
            await likeBlog(page, 'Wind of change', 3)

            const blogOrder = await page.locator('#blogs').innerText()

            await expect(blogOrder).toMatch(/Wind of change[\s\S]*Stairway to heaven[\s\S]*Beat it/)
            await expect(blogOrder).not.toMatch(/Beat it[\s\S]*Stairway to heaven[\s\S]*Wind of change/)
        })
    })
})
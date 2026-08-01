import { test, expect } from '@playwright/test'
import { setupApiMocks, MOCK_USER, MOCK_TOKEN } from './fixtures'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test('login page displays form fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Login to your account')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: /Login/ })).toBeVisible()
  })

  test('login form has required fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('#email')).toHaveAttribute('type', 'email')
    await expect(page.locator('#email')).toHaveAttribute('required')
    await expect(page.locator('#password')).toHaveAttribute('type', 'password')
    await expect(page.locator('#password')).toHaveAttribute('required')
  })

  test('successful login navigates to dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')
  })

  test('login stores token in localStorage', async ({ page }) => {
    await page.goto('/login')

    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBe(MOCK_TOKEN)
  })

  test('login error displays error message', async ({ page }) => {
    await setupApiMocks(page, {
      loginError: { status: 400, message: 'Invalid credentials.' },
    })

    await page.goto('/login')

    await page.locator('#email').fill('wrong@example.com')
    await page.locator('#password').fill('wrongpass')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page.getByText('Invalid credentials.')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL('/login')
  })

  test('login link to register page works', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: 'Register here' }).click()
    await expect(page).toHaveURL('/register')
  })

  test('register page displays form fields', async ({ page }) => {
    await page.goto('/register')

    await expect(page.getByText('Create your account')).toBeVisible()
    await expect(page.locator('#name')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('#confirmPassword')).toBeVisible()
    await expect(page.getByRole('button', { name: /Create Account/ })).toBeVisible()
  })

  test('register form has required fields with correct types', async ({ page }) => {
    await page.goto('/register')

    await expect(page.locator('#name')).toHaveAttribute('type', 'text')
    await expect(page.locator('#name')).toHaveAttribute('required')
    await expect(page.locator('#email')).toHaveAttribute('type', 'email')
    await expect(page.locator('#email')).toHaveAttribute('required')
    await expect(page.locator('#password')).toHaveAttribute('type', 'password')
    await expect(page.locator('#password')).toHaveAttribute('required')
    await expect(page.locator('#confirmPassword')).toHaveAttribute('type', 'password')
    await expect(page.locator('#confirmPassword')).toHaveAttribute('required')
  })

  test('successful registration navigates to dashboard', async ({ page }) => {
    await page.goto('/register')

    await page.locator('#name').fill('New User')
    await page.locator('#email').fill('new@example.com')
    await page.locator('#password').fill('password123')
    await page.locator('#confirmPassword').fill('password123')
    await page.getByRole('button', { name: /Create Account/ }).click()

    await expect(page).toHaveURL('/dashboard')
  })

  test('registration stores token in localStorage', async ({ page }) => {
    await page.goto('/register')

    await page.locator('#name').fill('New User')
    await page.locator('#email').fill('new@example.com')
    await page.locator('#password').fill('password123')
    await page.locator('#confirmPassword').fill('password123')
    await page.getByRole('button', { name: /Create Account/ }).click()

    await expect(page).toHaveURL('/dashboard')
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBe(MOCK_TOKEN)
  })

  test('password mismatch shows error on register', async ({ page }) => {
    await page.goto('/register')

    await page.locator('#name').fill('New User')
    await page.locator('#email').fill('new@example.com')
    await page.locator('#password').fill('password123')
    await page.locator('#confirmPassword').fill('different123')
    await page.getByRole('button', { name: /Create Account/ }).click()

    await expect(page.getByText('Passwords do not match.')).toBeVisible()
    await expect(page).toHaveURL('/register')
  })

  test('register error from backend displays message', async ({ page }) => {
    await setupApiMocks(page, {
      registerError: { status: 400, message: 'User already exists.' },
    })

    await page.goto('/register')

    await page.locator('#name').fill('New User')
    await page.locator('#email').fill('existing@example.com')
    await page.locator('#password').fill('password123')
    await page.locator('#confirmPassword').fill('password123')
    await page.getByRole('button', { name: /Create Account/ }).click()

    await expect(page.getByText('User already exists.')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL('/register')
  })

  test('register link to login page works', async ({ page }) => {
    await page.goto('/register')

    await page.getByRole('link', { name: 'Login here' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('header shows Dashboard and Logout after login', async ({ page }) => {
    await page.goto('/login')

    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')

    // Header should now show Dashboard link and Logout button
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
  })

  test('logout clears token and updates header', async ({ page }) => {
    await page.goto('/login')

    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click()

    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeNull()

    // Header should show Login link again
    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible()
  })
})
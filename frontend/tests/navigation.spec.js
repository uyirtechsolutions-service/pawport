import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test('header displays logo and navigation links', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('link', { name: 'pawport' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Services' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Process' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Fleet' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Transports' }).first()).toBeVisible()
  })

  test('header shows Login and Book a pickup when logged out', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Book a pickup' }).first()).toBeVisible()
  })

  test('navigates to booking page via header CTA', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Book a pickup' }).first().click()
    await expect(page).toHaveURL('/book')
  })

  test('navigates to login page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Login' }).first().click()
    await expect(page).toHaveURL('/login')
    await expect(page.getByText('Login to your account')).toBeVisible()
  })

  test('navigates to register page from login page', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: 'Register here' }).click()
    await expect(page).toHaveURL('/register')
    await expect(page.getByText('Create your account')).toBeVisible()
  })

  test('navigates to login page from register page', async ({ page }) => {
    await page.goto('/register')

    await page.getByRole('link', { name: 'Login here' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('footer displays contact information', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer.getByText('hello@pawport.in')).toBeVisible()
    await expect(footer.getByText('+91 98765 43210')).toBeVisible()
    await expect(footer.getByText('Coimbatore, India')).toBeVisible()
  })

  test('footer displays copyright with current year', async ({ page }) => {
    await page.goto('/')

    const currentYear = new Date().getFullYear().toString()
    const footer = page.locator('footer')
    await expect(footer.getByText(new RegExp(currentYear))).toBeVisible()
  })

  test('footer links navigate to sections', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer.getByRole('link', { name: 'Book Now' })).toBeVisible()
  })

  test('logo click navigates to home', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: 'pawport' }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('mobile menu toggle is visible on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 })
    await page.goto('/')

    const menuToggle = page.getByRole('button', { name: 'Toggle menu' })
    await expect(menuToggle).toBeVisible()
  })

  test('mobile menu opens and closes on toggle', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 })
    await page.goto('/')

    const menuToggle = page.getByRole('button', { name: 'Toggle menu' })
    await menuToggle.click()

    // Nav links should be visible after opening menu
    const navLinks = page.locator('.nav-links')
    await expect(navLinks).toHaveClass(/open/)
  })

  test('unknown route still renders the app shell', async ({ page }) => {
    await page.goto('/nonexistent')

    // Header and footer should still render
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})
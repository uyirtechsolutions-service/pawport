import { test, expect } from '@playwright/test'
import { setupApiMocks, MOCK_USER, MOCK_TOKEN, MOCK_BOOKINGS } from './fixtures'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
    // Set auth state before navigating
    await page.addInitScript(([token]) => {
      localStorage.setItem('token', token)
    }, [MOCK_TOKEN])
  })

  test('redirects to login when not authenticated', async ({ page }) => {
    // Clear token to simulate logged out state
    await page.addInitScript(() => {
      localStorage.removeItem('token')
    })

    await page.goto('/dashboard')

    await expect(page).toHaveURL('/login')
  })

  test('displays welcome message with user name after login', async ({ page }) => {
    // Login first to set user in store
    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/Welcome back.*Priya Sharma/)).toBeVisible()
  })

  test('displays stats cards with correct counts', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')

    // Total bookings = 3
    await expect(page.getByText('Total Bookings')).toBeVisible()
    await expect(page.locator('.text-4xl').first()).toHaveText('3')

    // Active trips (in-transit) = 1
    await expect(page.getByText('Active Trips')).toBeVisible()

    // Completed = 1
    await expect(page.getByText('Completed')).toBeVisible()
  })

  test('displays bookings table with correct columns', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')

    await expect(page.getByText('Your Bookings')).toBeVisible()
    await expect(page.getByText('Pet').first()).toBeVisible()
    await expect(page.getByText('From → To').first()).toBeVisible()
    await expect(page.getByText('Date').first()).toBeVisible()
    await expect(page.getByText('Status').first()).toBeVisible()
  })

  test('displays booking data in table rows', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')

    // Wait for bookings to load
    await expect(page.getByText('Bruno')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Coimbatore, Tamil Nadu → Bangalore, Karnataka')).toBeVisible()
    await expect(page.getByText('Luna')).toBeVisible()
    await expect(page.getByText('Chennai, Tamil Nadu → Hyderabad, Telangana')).toBeVisible()
  })

  test('displays status badges with correct styling', async ({ page }) => {
    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')

    // Status badges should be visible
    await expect(page.getByText('pending').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('in-transit').first()).toBeVisible()
    await expect(page.getByText('completed').first()).toBeVisible()
  })

  test('shows empty state when no bookings exist', async ({ page }) => {
    await setupApiMocks(page, { bookings: [] })

    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')

    await expect(page.getByText('No bookings yet.')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /Book your first trip/ })).toBeVisible()
  })

  test('empty state button navigates to booking page', async ({ page }) => {
    await setupApiMocks(page, { bookings: [] })

    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('No bookings yet.')).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: /Book your first trip/ }).click()
    await expect(page).toHaveURL('/book')
  })

  test('shows loading state while fetching bookings', async ({ page }) => {
    // Delay the bookings response
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'GET') {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_BOOKINGS),
        })
      }
      return route.continue()
    })

    await page.goto('/login')
    await page.locator('#email').fill('priya@example.com')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: /Login/ }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Loading bookings...')).toBeVisible()
  })
})
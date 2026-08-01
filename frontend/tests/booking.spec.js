import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures'

test.describe('BookingForm', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test('displays all form fields on booking page', async ({ page }) => {
    await page.goto('/book')

    await expect(page.locator('#petCategory')).toBeVisible()
    await expect(page.locator('#bookingDate')).toBeVisible()
    await expect(page.locator('#userEmail')).toBeVisible()
    await expect(page.locator('#userName')).toBeVisible()
    await expect(page.locator('#pickupPlace')).toBeVisible()
    await expect(page.locator('#dropoffPlace')).toBeVisible()
    await expect(page.locator('#preferredTime')).toBeVisible()
    await expect(page.locator('#petName')).toBeVisible()
    await expect(page.locator('#notes')).toBeVisible()
  })

  test('pet category dropdown has all pet type options', async ({ page }) => {
    await page.goto('/book')

    const select = page.locator('#petCategory')
    await expect(select).toBeVisible()

    const options = select.locator('option')
    await expect(options).toHaveCount(9) // 1 placeholder + 8 pet types

    await expect(select.locator('option', { hasText: 'Dog — Small (under 10 kg)' })).toHaveCount(1)
    await expect(select.locator('option', { hasText: 'Cat' })).toHaveCount(1)
    await expect(select.locator('option', { hasText: 'Bird' })).toHaveCount(1)
    await expect(select.locator('option', { hasText: 'Other' })).toHaveCount(1)
  })

  test('preferred time dropdown has all time window options', async ({ page }) => {
    await page.goto('/book')

    const select = page.locator('#preferredTime')
    const options = select.locator('option')
    await expect(options).toHaveCount(6) // 1 placeholder + 5 time windows
  })

  test('submit button is visible with correct label', async ({ page }) => {
    await page.goto('/book')

    await expect(page.getByRole('button', { name: /Compose booking email/ })).toBeVisible()
  })

  test('form submission with valid data shows confirmation', async ({ page }) => {
    await page.goto('/book')

    // Fill the form
    await page.locator('#petCategory').selectOption('Dog — Small (under 10 kg)')
    await page.locator('#bookingDate').fill('2025-12-15')
    await page.locator('#userEmail').fill('test@example.com')
    await page.locator('#userName').fill('Test User')
    await page.locator('#pickupPlace').fill('Coimbatore, Tamil Nadu')
    await page.locator('#dropoffPlace').fill('Bangalore, Karnataka')
    await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
    await page.locator('#petName').fill('Bruno')
    await page.locator('#notes').fill('Friendly dog')

    // Submit - mock window.open to prevent actual popup
    await page.addInitScript(() => {
      window.open = () => null
    })

    await page.getByRole('button', { name: /Compose booking email/ }).click()

    // Confirmation should appear
    await expect(page.getByText(/Email draft ready/)).toBeVisible({ timeout: 10000 })
  })

  test('confirmation message includes manual fallback link', async ({ page }) => {
    await page.goto('/book')

    await page.locator('#petCategory').selectOption('Cat')
    await page.locator('#bookingDate').fill('2025-12-15')
    await page.locator('#userEmail').fill('test@example.com')
    await page.locator('#userName').fill('Test User')
    await page.locator('#pickupPlace').fill('Chennai')
    await page.locator('#dropoffPlace').fill('Madurai')
    await page.locator('#preferredTime').selectOption('Flexible — anytime')

    await page.addInitScript(() => {
      window.open = () => null
    })

    await page.getByRole('button', { name: /Compose booking email/ }).click()

    await expect(page.getByText(/Email draft ready/)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('link', { name: 'click here' })).toBeVisible()
  })

  test('manual fallback link has correct mailto href', async ({ page }) => {
    await page.goto('/book')

    await page.locator('#petCategory').selectOption('Cat')
    await page.locator('#bookingDate').fill('2025-12-15')
    await page.locator('#userEmail').fill('test@example.com')
    await page.locator('#userName').fill('Test User')
    await page.locator('#pickupPlace').fill('Chennai')
    await page.locator('#dropoffPlace').fill('Madurai')
    await page.locator('#preferredTime').selectOption('Flexible — anytime')

    await page.addInitScript(() => {
      window.open = () => null
    })

    await page.getByRole('button', { name: /Compose booking email/ }).click()

    await expect(page.getByText(/Email draft ready/)).toBeVisible({ timeout: 10000 })
    const fallbackLink = page.getByRole('link', { name: 'click here' })
    const href = await fallbackLink.getAttribute('href')
    expect(href).toContain('mailto:hello@pawport.in')
    expect(href).toContain('subject=')
    expect(href).toContain('body=')
    // Bug check: body should NOT contain double-encoded %0D%0A (should be %250D%250A if double-encoded)
    // After fix, the body should contain proper newlines, not %250D%250A
    expect(href).not.toContain('%250D%250A')
  })

  test('form requires pet category selection', async ({ page }) => {
    await page.goto('/book')

    // Try to submit without selecting pet category
    const petCategorySelect = page.locator('#petCategory')
    await expect(petCategorySelect).toHaveValue('')

    // The select has required attribute
    await expect(petCategorySelect).toHaveAttribute('required')
  })

  test('form requires pickup and dropoff locations', async ({ page }) => {
    await page.goto('/book')

    await expect(page.locator('#pickupPlace')).toHaveAttribute('required')
    await expect(page.locator('#dropoffPlace')).toHaveAttribute('required')
  })

  test('email field has correct type', async ({ page }) => {
    await page.goto('/book')

    await expect(page.locator('#userEmail')).toHaveAttribute('type', 'email')
    await expect(page.locator('#userEmail')).toHaveAttribute('required')
  })

  test('date field has correct type', async ({ page }) => {
    await page.goto('/book')

    await expect(page.locator('#bookingDate')).toHaveAttribute('type', 'date')
    await expect(page.locator('#bookingDate')).toHaveAttribute('required')
  })

  test('pet name and notes fields are optional', async ({ page }) => {
    await page.goto('/book')

    await expect(page.locator('#petName')).not.toHaveAttribute('required')
    await expect(page.locator('#notes')).not.toHaveAttribute('required')
  })

  test('booking form is also present on home page', async ({ page }) => {
    await page.goto('/')

    // Scroll to booking form
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await expect(page.locator('#petCategory')).toBeVisible()
  })

  test('form handles backend error gracefully', async ({ page }) => {
    await setupApiMocks(page, {
      bookingError: { status: 500, message: 'Server error' },
    })

    await page.goto('/book')

    await page.locator('#petCategory').selectOption('Dog — Small (under 10 kg)')
    await page.locator('#bookingDate').fill('2025-12-15')
    await page.locator('#userEmail').fill('test@example.com')
    await page.locator('#userName').fill('Test User')
    await page.locator('#pickupPlace').fill('Coimbatore')
    await page.locator('#dropoffPlace').fill('Bangalore')
    await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')

    await page.addInitScript(() => {
      window.open = () => null
    })

    await page.getByRole('button', { name: /Compose booking email/ }).click()

    // After fix: error message should be shown, not success confirmation
    await expect(page.getByText(/Server error/)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/Email draft ready/)).not.toBeVisible()
  })
})
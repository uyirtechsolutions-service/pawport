import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures'

test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test('displays hero section with headline and CTAs', async ({ page }) => {
    await page.goto('/')

    // Headline
    await expect(page.locator('h1')).toContainText('Getting your best friend')
    await expect(page.locator('h1')).toContainText('safely')

    // CTA buttons
    await expect(page.getByRole('link', { name: /Book a pickup/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /See how it works/ })).toBeVisible()
  })

  test('displays location badge with Coimbatore text', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/Coimbatore.*pet transport across India/)).toBeVisible()
  })

  test('displays hero tags for service types', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Ground Transport').first()).toBeVisible()
    await expect(page.getByText('Flight Escort').first()).toBeVisible()
    await expect(page.getByText('International Relocation').first()).toBeVisible()
    await expect(page.getByText('Local Pet Taxi').first()).toBeVisible()
  })

  test('displays stats badge with 2,000+ safe trips', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('2,000+')).toBeVisible()
    await expect(page.getByText('safe trips')).toBeVisible()
  })

  test('displays services section with 4 service cards', async ({ page }) => {
    await page.goto('/')
    await page.goto('/#services')

    const servicesSection = page.locator('#services')
    await expect(servicesSection).toBeVisible()
    await expect(page.getByText('Ground Transport').nth(1)).toBeVisible()
    await expect(page.getByText('Flight Escort').nth(1)).toBeVisible()
    await expect(page.getByText('International Relocation').nth(1)).toBeVisible()
    await expect(page.getByText('Local Pet Taxi').nth(1)).toBeVisible()
  })

  test('displays process section with 5 steps', async ({ page }) => {
    await page.goto('/#process')

    const processSection = page.locator('#process')
    await expect(processSection).toBeVisible()
    await expect(page.getByText('Book').first()).toBeVisible()
    await expect(page.getByText('Health & Docs Check')).toBeVisible()
    await expect(page.getByText('Pickup')).toBeVisible()
    await expect(page.getByText('In Transit')).toBeVisible()
    await expect(page.getByText('Safe Arrival')).toBeVisible()
  })

  test('displays fleet section with 4 columns', async ({ page }) => {
    await page.goto('/#fleet')

    const fleetSection = page.locator('#fleet')
    await expect(fleetSection).toBeVisible()
    await expect(page.getByText('Vehicles').first()).toBeVisible()
    await expect(page.getByText('Safety & Care').first()).toBeVisible()
    await expect(page.getByText('Documentation').first()).toBeVisible()
    await expect(page.getByText('Support').first()).toBeVisible()
  })

  test('displays philosophy section with quote', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/We never treats a pet like cargo/)).toBeVisible()
    await expect(page.getByText(/We treat cargo like it's someone's best friend/)).toBeVisible()
  })

  test('displays transports section with recent trips', async ({ page }) => {
    await page.goto('/#transports')

    const transportsSection = page.locator('#transports')
    await expect(transportsSection).toBeVisible()
    await expect(page.getByText('Interstate Relocation')).toBeVisible()
    await expect(page.getByText('Chennai to Bangalore, next-day delivery')).toBeVisible()
  })

  test('displays booking form section on home page', async ({ page }) => {
    await page.goto('/#contact')

    await expect(page.getByText(/Ready to move your best friend/)).toBeVisible()
    await expect(page.locator('#petCategory')).toBeVisible()
    await expect(page.locator('#bookingDate')).toBeVisible()
  })
})
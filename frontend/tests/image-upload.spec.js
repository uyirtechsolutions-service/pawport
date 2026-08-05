import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEST_IMAGE_PATH = path.join(__dirname, '../../images/story-1.jpeg')

test.describe('Image Upload - Booking Form', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test.describe('Image Upload UI', () => {
    test('displays image upload area on step 1', async ({ page }) => {
      await page.goto('/book')
      await expect(page.locator('label:has-text("Click to upload photo")')).toBeVisible()
      await expect(page.locator('input[type="file"][accept="image/*"]')).toBeAttached()
    })

    test('upload area has correct label "Pet Photo *"', async ({ page }) => {
      await page.goto('/book')
      await expect(page.locator('label:has-text("Pet Photo *")')).toBeVisible()
    })

    test('file input accepts only image files', async ({ page }) => {
      await page.goto('/book')
      const acceptAttr = await page.locator('input[type="file"]').getAttribute('accept')
      expect(acceptAttr).toBe('image/*')
    })
  })

  test.describe('Image Upload Functionality', () => {
    test('successfully uploads a valid image and shows preview', async ({ page }) => {
      await page.goto('/book')
      await page.locator('#petType').selectOption('🐕 Dog')
      
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(TEST_IMAGE_PATH)
      
      const preview = page.locator('img[alt="Preview"]')
      await expect(preview).toBeVisible({ timeout: 5000 })
      await expect(preview).toHaveClass(/w-24 h-24 object-cover rounded-xl/)
    })

    test('preview has base64 data URL as src', async ({ page }) => {
      await page.goto('/book')
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(TEST_IMAGE_PATH)
      
      const preview = page.locator('img[alt="Preview"]')
      await expect(preview).toBeVisible()
      const src = await preview.getAttribute('src')
      expect(src).toMatch(/^data:image\//)
    })

    test('shows remove button after upload', async ({ page }) => {
      await page.goto('/book')
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(TEST_IMAGE_PATH)
      await expect(page.locator('img[alt="Preview"]')).toBeVisible()
      await expect(page.locator('button:has-text("×")')).toBeVisible()
    })

    test('removes image when remove button is clicked', async ({ page }) => {
      await page.goto('/book')
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(TEST_IMAGE_PATH)
      await expect(page.locator('img[alt="Preview"]')).toBeVisible()
      
      await page.locator('button:has-text("×")').click()
      await expect(page.locator('img[alt="Preview"]')).not.toBeVisible()
      await expect(page.locator('label:has-text("Click to upload photo")')).toBeVisible()
    })

    test('can re-upload after removing', async ({ page }) => {
      await page.goto('/book')
      const fileInput = page.locator('input[type="file"]')
      
      await fileInput.setInputFiles(TEST_IMAGE_PATH)
      await expect(page.locator('img[alt="Preview"]')).toBeVisible()
      
      await page.locator('button:has-text("×")').click()
      await expect(page.locator('img[alt="Preview"]')).not.toBeVisible()
      
      await fileInput.setInputFiles(TEST_IMAGE_PATH)
      await expect(page.locator('img[alt="Preview"]')).toBeVisible()
    })
  })

  test.describe('Image Validation', () => {
    test('shows error toast for non-image files', async ({ page }) => {
      await page.goto('/book')
      const textFile = path.join(__dirname, 'test-file.txt')
      fs.writeFileSync(textFile, 'not an image')
      
      await page.locator('input[type="file"]').setInputFiles(textFile)
      await expect(page.locator('text=Only image files are allowed')).toBeVisible({ timeout: 3000 })
      fs.unlinkSync(textFile)
    })

    test('shows error toast for files larger than 5MB', async ({ page }) => {
      await page.goto('/book')
      const largeFile = path.join(__dirname, 'large-image.jpg')
      fs.writeFileSync(largeFile, Buffer.alloc(6 * 1024 * 1024))
      
      await page.locator('input[type="file"]').setInputFiles(largeFile)
      await expect(page.locator('text=Image must be smaller than 5MB')).toBeVisible({ timeout: 3000 })
      fs.unlinkSync(largeFile)
    })

    test('requires pet photo before proceeding', async ({ page }) => {
      await page.goto('/book')
      await page.locator('#petType').selectOption('🐕 Dog')
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('text=Please upload a pet photo')).toBeVisible({ timeout: 3000 })
      await expect(page.locator('label:has-text("Click to upload photo")')).toBeVisible()
    })
  })

  test.describe('Form Submission with Base64 Image', () => {
    test('submits form with image and receives success response', async ({ page }) => {
      let requestReceived = false
      
      await page.route('**/api/orders', async (route) => {
        requestReceived = true
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Booking sent', transporter: 'sent', buyer: 'sent' }),
        })
      })
      
      await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
      })
      
      await page.goto('/book')
      
      // Step 1: Pet Info
      await page.locator('#petType').selectOption('🐕 Dog')
      await page.locator('#petName').fill('Bruno')
      await page.locator('#petBreed').fill('Labrador')
      await page.locator('#petAge').fill('2 years')
      await page.locator('#petWeight').fill('15 kg')
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH)
      await expect(page.locator('img[alt="Preview"]')).toBeVisible()
      await page.locator('button:has-text("Next")').click()
      
      // Step 2: Trip
      await expect(page.locator('#bookingDate')).toBeVisible({ timeout: 5000 })
      await page.locator('input[placeholder="Search city, pincode, or address..."]').first().fill('Chennai')
      await page.locator('input[placeholder="Search city, pincode, or address..."]').last().fill('Bangalore')
      await page.locator('#bookingDate').fill('2026-12-15')
      await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
      await page.locator('#transportMode').selectOption('🚐 Ground Transport')
      await page.locator('button:has-text("Next")').click()
      
      // Step 3: Contact
      await expect(page.locator('#buyerName')).toBeVisible({ timeout: 5000 })
      await page.locator('#buyerName').fill('Test User')
      await page.locator('#buyerWhatsapp').fill('919876543210')
      
      await page.locator('button:has-text("Send via WhatsApp")').click()
      
      // Wait for response
      await page.waitForResponse('**/api/orders')
      
      // Verify request was sent
      expect(requestReceived).toBe(true)
    })

    test('shows success toast after submission', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Booking sent', transporter: 'sent', buyer: 'sent' }),
        })
      })
      
      await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
      })
      
      await page.goto('/book')
      
      await page.locator('#petType').selectOption('🐕 Dog')
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH)
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#bookingDate')).toBeVisible({ timeout: 5000 })
      await page.locator('input[placeholder="Search city, pincode, or address..."]').first().fill('Chennai')
      await page.locator('input[placeholder="Search city, pincode, or address..."]').last().fill('Bangalore')
      await page.locator('#bookingDate').fill('2026-12-15')
      await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
      await page.locator('#transportMode').selectOption('🚐 Ground Transport')
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#buyerName')).toBeVisible({ timeout: 5000 })
      await page.locator('#buyerName').fill('Test User')
      await page.locator('#buyerWhatsapp').fill('919876543210')
      
      await page.locator('button:has-text("Send via WhatsApp")').click()
      await expect(page.locator('text=Booking sent!')).toBeVisible({ timeout: 10000 })
    })

    test('handles API error gracefully', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Failed to process booking' }),
        })
      })
      
      await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
      })
      
      await page.goto('/book')
      
      await page.locator('#petType').selectOption('🐕 Dog')
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH)
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#bookingDate')).toBeVisible({ timeout: 5000 })
      await page.locator('input[placeholder="Search city, pincode, or address..."]').first().fill('Chennai')
      await page.locator('input[placeholder="Search city, pincode, or address..."]').last().fill('Bangalore')
      await page.locator('#bookingDate').fill('2026-12-15')
      await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
      await page.locator('#transportMode').selectOption('🚐 Ground Transport')
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#buyerName')).toBeVisible({ timeout: 5000 })
      await page.locator('#buyerName').fill('Test User')
      await page.locator('#buyerWhatsapp').fill('919876543210')
      
      await page.locator('button:has-text("Send via WhatsApp")').click()
      await expect(page.locator('text=Failed to process booking')).toBeVisible({ timeout: 10000 })
    })

    test('shows loading state during submission', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Booking sent', transporter: 'sent', buyer: 'sent' }),
        })
      })
      
      await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
      })
      
      await page.goto('/book')
      
      await page.locator('#petType').selectOption('🐕 Dog')
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH)
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#bookingDate')).toBeVisible({ timeout: 5000 })
      await page.locator('input[placeholder="Search city, pincode, or address..."]').first().fill('Chennai')
      await page.locator('input[placeholder="Search city, pincode, or address..."]').last().fill('Bangalore')
      await page.locator('#bookingDate').fill('2026-12-15')
      await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
      await page.locator('#transportMode').selectOption('🚐 Ground Transport')
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#buyerName')).toBeVisible({ timeout: 5000 })
      await page.locator('#buyerName').fill('Test User')
      await page.locator('#buyerWhatsapp').fill('919876543210')
      
      await page.locator('button:has-text("Send via WhatsApp")').click()
      await expect(page.locator('button:has-text("Sending...")')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('button:has-text("Sending...")')).toBeDisabled({ timeout: 5000 })
    })
  })

  test.describe('Image Formats', () => {
    test('accepts JPEG images', async ({ page }) => {
      await page.goto('/book')
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH)
      await expect(page.locator('img[alt="Preview"]')).toBeVisible()
    })

    test('accepts PNG images', async ({ page }) => {
      const pngFile = path.join(__dirname, 'test-image.png')
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ])
      fs.writeFileSync(pngFile, pngBuffer)
      
      await page.goto('/book')
      await page.locator('input[type="file"]').setInputFiles(pngFile)
      await expect(page.locator('img[alt="Preview"]')).toBeVisible()
      fs.unlinkSync(pngFile)
    })
  })

  test.describe('Confirmation Screen', () => {
    test('shows confirmation after successful submission', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Booking sent', transporter: 'sent', buyer: 'sent' }),
        })
      })
      
      await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
      })
      
      await page.goto('/book')
      
      await page.locator('#petType').selectOption('🐕 Dog')
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH)
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#bookingDate')).toBeVisible({ timeout: 5000 })
      await page.locator('input[placeholder="Search city, pincode, or address..."]').first().fill('Chennai')
      await page.locator('input[placeholder="Search city, pincode, or address..."]').last().fill('Bangalore')
      await page.locator('#bookingDate').fill('2026-12-15')
      await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
      await page.locator('#transportMode').selectOption('🚐 Ground Transport')
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#buyerName')).toBeVisible({ timeout: 5000 })
      await page.locator('#buyerName').fill('Test User')
      await page.locator('#buyerWhatsapp').fill('919876543210')
      
      await page.locator('button:has-text("Send via WhatsApp")').click()
      await expect(page.locator('text=Booking Sent!')).toBeVisible({ timeout: 10000 })
      await expect(page.locator('text=Check your WhatsApp')).toBeVisible()
    })

    test('can book another pet from confirmation', async ({ page }) => {
      await page.route('**/api/orders', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Booking sent', transporter: 'sent', buyer: 'sent' }),
        })
      })
      
      await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
      })
      
      await page.goto('/book')
      
      await page.locator('#petType').selectOption('🐕 Dog')
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH)
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#bookingDate')).toBeVisible({ timeout: 5000 })
      await page.locator('input[placeholder="Search city, pincode, or address..."]').first().fill('Chennai')
      await page.locator('input[placeholder="Search city, pincode, or address..."]').last().fill('Bangalore')
      await page.locator('#bookingDate').fill('2026-12-15')
      await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
      await page.locator('#transportMode').selectOption('🚐 Ground Transport')
      await page.locator('button:has-text("Next")').click()
      
      await expect(page.locator('#buyerName')).toBeVisible({ timeout: 5000 })
      await page.locator('#buyerName').fill('Test User')
      await page.locator('#buyerWhatsapp').fill('919876543210')
      
      await page.locator('button:has-text("Send via WhatsApp")').click()
      await expect(page.locator('text=Booking Sent!')).toBeVisible({ timeout: 10000 })
      
      await page.locator('button:has-text("Book Another Pet")').click()
      await expect(page.locator('#petType')).toBeVisible()
      await expect(page.locator('label:has-text("Click to upload photo")')).toBeVisible()
    })
  })
})
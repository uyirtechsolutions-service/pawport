import { test, expect } from '@playwright/test'

test.describe('Back Button Visibility', () => {
  // List of viewport sizes to test: small laptop, standard desktop, large monitor
  const VIEWPORTS = [
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
    { width: 1600, height: 1024 },
  ]

  for (const viewport of VIEWPORTS) {
    test(`Back button is visible after advancing to step 1 at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/book')

      // Fill step 0: Pet Info — select pet type and upload a tiny test image
      await page.locator('#petType').selectOption('🐕 Dog')

      // Upload a small image (required to proceed)
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'test-pet.png',
        mimeType: 'image/png',
        buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
      })

      // The Back button is not visible on step 0, so we just verify Next exists
      const nextButton = page.getByRole('button', { name: /Next/ })
      await expect(nextButton).toBeVisible()

      // Click Next to go to step 1
      await nextButton.click()

      // On step 1 (Trip), Back button should be visible
      const backButton = page.getByRole('button', { name: /Back/ })
      await expect(backButton).toBeVisible({ timeout: 5000 })

      // Also verify Back button is within the viewport
      const box = await backButton.boundingBox()
      expect(box).not.toBeNull()
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)

      // Next button should still be visible on step 1
      await expect(nextButton).toBeVisible()

      // Fill trip fields and go to step 2
      await page.locator('#bookingDate').fill('2026-08-01')
      await page.locator('#preferredTime').selectOption('Morning (9 AM – 12 PM)')
      await page.locator('#transportMode').selectOption('🚐 Ground Transport')
      await nextButton.click()

      // On step 2 (Contact), Back button should remain visible
      await expect(backButton).toBeVisible({ timeout: 5000 })

      const box2 = await backButton.boundingBox()
      expect(box2).not.toBeNull()
      expect(box2.y + box2.height).toBeLessThanOrEqual(viewport.height)
    })
  }

  test('Back + Next buttons stay visible when viewport is resized smaller', async ({ page }) => {
    // Start at a large viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/book')

    // Go to step 1
    await page.locator('#petType').selectOption('🐕 Dog')
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test-pet.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
    })
    await page.getByRole('button', { name: /Next/ }).click()

    const backButton = page.getByRole('button', { name: /Back/ })
    const nextButton = page.getByRole('button', { name: /Next/ })
    await expect(backButton).toBeVisible()
    await expect(nextButton).toBeVisible()

    // Resize to smaller viewport
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.waitForTimeout(300) // let layout settle

    // Verify both buttons are still in viewport
    await expect(backButton).toBeVisible()
    const box = await backButton.boundingBox()
    expect(box).not.toBeNull()
    expect(box.y + box.height).toBeLessThanOrEqual(768)

    await expect(nextButton).toBeVisible()
    const nextBox = await nextButton.boundingBox()
    expect(nextBox).not.toBeNull()
    expect(nextBox.y + nextBox.height).toBeLessThanOrEqual(768)
  })
})

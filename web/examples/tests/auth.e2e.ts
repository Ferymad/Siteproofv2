import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    // Check form elements exist
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')

    // Should redirect to error page
    await expect(page).toHaveURL('/error')
  })

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})
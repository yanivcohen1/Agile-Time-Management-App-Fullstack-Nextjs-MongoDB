import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Ship fast, stay organized, and keep every todo in sync.')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Create an account' }).click();
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByText('Create your account')).toBeVisible();
  });

  test('should have login form elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create one' })).toBeVisible();
  });

  test('should have register form elements', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[type="text"]')).toBeVisible(); // name field
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });
});

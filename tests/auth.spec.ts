import { test, expect } from '@playwright/test';

test('register, login, and add application from dashboard', async ({ page }) => {
  const uniqueEmail = `testuser+${Date.now()}@example.com`;
  const password = 'password123';

  await page.goto('http://localhost:5173/login');

  // Register a new user
  await page.getByRole('button', { name: 'Create an Account' }).click();
  const registerModal = page.locator('div.fixed:has-text("Register")');
  const registerForm = registerModal.locator('form');
  await registerForm.locator('label:has-text("Full Name") + input').fill('E2E Test User');
  await registerForm.locator('label:has-text("Email Address") + input').fill(uniqueEmail);
  await registerForm.locator('label:has-text("Password") + input').fill(password);
  await registerForm.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/login/);

  // Login with the newly registered user
  const loginForm = page.locator('form').first();
  await loginForm.locator('label:has-text("Email Address") + input').fill(uniqueEmail);
  await loginForm.locator('label:has-text("Password") + input').fill(password);
  await loginForm.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Navigate to applications and add a new application
  await page.goto('http://localhost:5173/applications');
  await expect(page).toHaveURL(/\/applications/);

  await page.getByRole('button', { name: '+ Add Application' }).click();
  const addAppModal = page.locator('div.fixed:has-text("Add Application")');
  await expect(addAppModal).toBeVisible();

  await addAppModal.locator('label:has-text("Company") + input').fill('Palantir');
  await addAppModal.locator('label:has-text("Role") + input').fill('Forward Deployed Engineer');
  await addAppModal.getByRole('button', { name: 'Save Application' }).click();

  await expect(page.locator('table')).toContainText('Palantir');
  await expect(page.locator('table')).toContainText('Forward Deployed Engineer');
  await expect(page).toHaveURL(/\/applications/);
});

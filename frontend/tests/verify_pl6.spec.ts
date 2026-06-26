import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// Unique email per test run to avoid 409 conflicts with a persistent DB
const RUN_ID = Date.now();
function email(n: number) { return `pl6_${RUN_ID}_${n}@test.com`; }

async function signUp(page: any, em: string, pw = 'password123') {
  await page.click('button:has-text("Sign in")');
  await page.click('button:has-text("Sign up")');
  await page.fill('#auth-email', em);
  await page.fill('#auth-password', pw);
  await page.click('button:has-text("Create account")');
  await page.waitForSelector('button[aria-label="User menu"]', { timeout: 8000 });
}

test.describe('PL-6 verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('1. Home page shows Sign in button when unauthenticated', async ({ page }) => {
    await expect(page.locator('h1:has-text("Legal Document Creator")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
    await expect(page.locator('button[aria-label="User menu"]')).not.toBeVisible();
    await page.screenshot({ path: '/tmp/pl6_01_home.png' });
  });

  test('2. Auth modal has email/password fields and sign up toggle', async ({ page }) => {
    await page.click('button:has-text("Sign in")');
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('#auth-email')).toBeVisible();
    await expect(page.locator('#auth-password')).toBeVisible();
    // Toggle to sign up
    await page.click('button:has-text("Sign up")');
    await expect(page.locator('h2:has-text("Create account")')).toBeVisible();
    await page.screenshot({ path: '/tmp/pl6_02_modal.png' });
  });

  test('3. Sign up shows success toast and user avatar', async ({ page }) => {
    await signUp(page, email(3));
    await expect(page.locator('text=Account created')).toBeVisible();
    await expect(page.locator('button[aria-label="User menu"]')).toBeVisible();
    await page.screenshot({ path: '/tmp/pl6_03_after_signup.png' });
  });

  test('4. My Documents shows empty state for new authenticated user', async ({ page }) => {
    await signUp(page, email(4));
    await page.goto(BASE + '/my-documents/');
    await sleep(1500);
    await page.screenshot({ path: '/tmp/pl6_04_my_docs_empty.png' });
    await expect(page.locator('text=No documents yet')).toBeVisible();
  });

  test('5 & 7. Creator page shows disclaimer and download button', async ({ page }) => {
    await page.goto(BASE + '/create/csa/');
    await sleep(3000);
    await expect(page.locator('button:has-text("Download PDF")')).toBeVisible();
    await expect(page.locator('text=Legal Disclaimer')).toBeVisible();
    await page.screenshot({ path: '/tmp/pl6_05_creator_disclaimer.png' });
  });

  test('5b & 6. Download saves to history; My Documents shows the doc', async ({ page }) => {
    await signUp(page, email(5));
    await page.goto(BASE + '/create/csa/');
    await sleep(3000);

    await page.click('button:has-text("Download PDF")');
    await expect(page.locator('text=saved to your history')).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: '/tmp/pl6_06_after_download.png' });

    await page.goto(BASE + '/my-documents/');
    await sleep(2000);
    await page.screenshot({ path: '/tmp/pl6_07_my_docs_with_doc.png' });
    await expect(page.locator('h3:has-text("Cloud Service Agreement")')).toBeVisible();
  });

  test('8. Sign out reverts to Sign in button', async ({ page }) => {
    await signUp(page, email(6));
    await page.click('button[aria-label="User menu"]');
    await expect(page.locator('text=Sign out')).toBeVisible();
    await page.click('button:has-text("Sign out")');
    await sleep(300);
    await page.screenshot({ path: '/tmp/pl6_08_after_signout.png' });
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
    await expect(page.locator('button[aria-label="User menu"]')).not.toBeVisible();
  });
});

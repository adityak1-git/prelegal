import { test, expect } from '@playwright/test';

test.describe('Mutual NDA Creator', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Layout ──────────────────────────────────────────────────────────────────

  test('page loads with correct header and two-column layout', async ({ page }) => {
    await expect(page.getByText('Mutual NDA Creator')).toBeVisible();
    await expect(page.getByText('Common Paper MNDA v1.0')).toBeVisible();
    await expect(page.getByText('Live Preview')).toBeVisible();
    await expect(page.getByText('Download PDF')).toBeVisible();
  });

  test('form sections are present', async ({ page }) => {
    await expect(page.getByText('Agreement Terms')).toBeVisible();
    await expect(page.getByText('Parties & Signatures')).toBeVisible();
  });

  // ── Live preview — initial state ─────────────────────────────────────────────

  test('preview shows the MNDA title', async ({ page }) => {
    await expect(
      page.getByRole('article').getByRole('heading', { name: 'Mutual Non-Disclosure Agreement' })
    ).toBeVisible();
  });

  test('preview shows default purpose text', async ({ page }) => {
    const preview = page.getByRole('article');
    await expect(preview.getByText(/Evaluating whether to enter into a business relationship/)).toBeVisible();
  });

  test('preview renders all 11 standard terms', async ({ page }) => {
    const preview = page.getByRole('article');
    for (let i = 1; i <= 11; i++) {
      await expect(preview.locator(`text=/^${i}\\./`).first()).toBeVisible();
    }
  });

  // ── Form interaction — live preview updates ───────────────────────────────────

  test('typing in Purpose field updates the preview', async ({ page }) => {
    const textarea = page.locator('#purpose');
    await textarea.clear();
    await textarea.fill('Testing a new product launch strategy.');

    const preview = page.getByRole('article');
    await expect(preview.getByText('Testing a new product launch strategy.')).toBeVisible();
  });

  test('changing Governing Law updates section 9 in the preview', async ({ page }) => {
    await page.locator('#governingLaw').fill('California');

    const preview = page.getByRole('article');
    await expect(preview.getByText(/laws of the State of California/)).toBeVisible();
  });

  test('changing Jurisdiction updates section 9 in the preview', async ({ page }) => {
    await page.locator('#jurisdiction').fill('San Francisco, CA');

    const preview = page.getByRole('article');
    await expect(preview.getByText(/courts located in San Francisco, CA/)).toBeVisible();
  });

  test('switching MNDA Term to "continues until terminated" updates the preview', async ({ page }) => {
    await page.locator('input[name="mndaTermType"][value="continues"]').check();

    const preview = page.getByRole('article');
    await expect(preview.getByText(/Continues until terminated/)).toBeVisible();
  });

  test('switching Term of Confidentiality to "in perpetuity" updates the preview', async ({ page }) => {
    await page.locator('input[name="confidentialityTermType"][value="perpetuity"]').check();

    const preview = page.getByRole('article');
    await expect(preview.getByText(/In perpetuity/)).toBeVisible();
  });

  test('MNDA term years field updates preview text', async ({ page }) => {
    const yearsInput = page.locator('input[aria-label="MNDA term years"]');
    await yearsInput.fill('3');

    const preview = page.getByRole('article');
    await expect(preview.getByText(/Expires 3 year\(s\) from Effective Date/)).toBeVisible();
  });

  // ── Parties section ───────────────────────────────────────────────────────────

  test('entering Party 1 name shows italic signature in preview', async ({ page }) => {
    await page.locator('#party1-name').fill('Alice Smith');

    const preview = page.getByRole('article');
    // Name should appear in the signature row
    await expect(preview.getByText('Alice Smith').first()).toBeVisible();
  });

  test('entering Party 2 company name appears in preview', async ({ page }) => {
    await page.locator('#party2-company').fill('Acme Corp');

    const preview = page.getByRole('article');
    await expect(preview.getByText('Acme Corp')).toBeVisible();
  });

  test('filling both parties shows both names in preview', async ({ page }) => {
    await page.locator('#party1-name').fill('Alice Smith');
    await page.locator('#party2-name').fill('Bob Jones');

    const preview = page.getByRole('article');
    await expect(preview.getByText('Alice Smith').first()).toBeVisible();
    await expect(preview.getByText('Bob Jones').first()).toBeVisible();
  });

  // ── Download button ───────────────────────────────────────────────────────────

  test('Download PDF button is visible and enabled', async ({ page }) => {
    // Wait for dynamic import to hydrate
    const btn = page.getByRole('button', { name: /Download PDF/ });
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(btn).toBeEnabled();
  });

  test('clicking Download PDF triggers a file download', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Download PDF/ });
    await expect(btn).toBeVisible({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      btn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  // ── MNDA term years disabled when "continues" selected ─────────────────────

  test('years input is disabled when MNDA term is set to "continues"', async ({ page }) => {
    await page.locator('input[name="mndaTermType"][value="continues"]').check();
    const yearsInput = page.locator('input[aria-label="MNDA term years"]');
    await expect(yearsInput).toBeDisabled();
  });

  test('years input is enabled when MNDA term is set to "expires"', async ({ page }) => {
    // Default is 'expires' — confirm it is enabled
    const yearsInput = page.locator('input[aria-label="MNDA term years"]');
    await expect(yearsInput).toBeEnabled();
  });

});

import { test, expect } from '@playwright/test';

test.describe('Catalog Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page shows catalog header', async ({ page }) => {
    await expect(page.getByText('Legal Document Creator')).toBeVisible();
    await expect(page.getByText('Prelegal')).toBeVisible();
  });

  test('catalog lists all 12 document types', async ({ page }) => {
    await expect(page.getByText('Mutual Non-Disclosure Agreement').first()).toBeVisible();
    await expect(page.getByText('Cloud Service Agreement')).toBeVisible();
    await expect(page.getByText('Design Partner Agreement')).toBeVisible();
    await expect(page.getByText('Service Level Agreement')).toBeVisible();
    await expect(page.getByText('Professional Services Agreement')).toBeVisible();
    await expect(page.getByText('Data Processing Agreement')).toBeVisible();
    await expect(page.getByText('Software License Agreement')).toBeVisible();
    await expect(page.getByText('Partnership Agreement')).toBeVisible();
    await expect(page.getByText('Pilot Agreement')).toBeVisible();
    await expect(page.getByText('Business Associate Agreement')).toBeVisible();
    await expect(page.getByText('AI Addendum')).toBeVisible();
  });

  test('clicking a document type navigates to its creator', async ({ page }) => {
    await page.locator('a[href="/create/csa/"]').click();
    await expect(page).toHaveURL(/\/create\/csa/);
  });
});

test.describe('Mutual NDA Creator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create/mutual-nda/');
  });

  test('page loads with correct header and two-column layout', async ({ page }) => {
    await expect(page.getByRole('banner').getByRole('heading', { name: 'Mutual Non-Disclosure Agreement' })).toBeVisible();
    await expect(page.getByText('Prelegal')).toBeVisible();
    await expect(page.getByText('Live Preview')).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PDF/ })).toBeVisible({ timeout: 10_000 });
  });

  test('AI Legal Assistant panel is visible', async ({ page }) => {
    await expect(page.getByText('AI Legal Assistant')).toBeVisible();
    await expect(page.getByPlaceholder('Type your message…')).toBeVisible();
  });

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

  test('Download PDF button is visible and enabled', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Download PDF/ });
    await expect(btn).toBeVisible({ timeout: 10_000 });
    await expect(btn).toBeEnabled();
  });

  test('clicking Download PDF triggers a file download', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Download PDF/ });
    await expect(btn).toBeVisible({ timeout: 10_000 });

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      btn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });
});

test.describe('Generic Document Creator (Pilot Agreement)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create/pilot/');
  });

  test('page loads with pilot agreement header', async ({ page }) => {
    await expect(page.getByRole('banner').getByRole('heading', { name: 'Pilot Agreement' })).toBeVisible();
    await expect(page.getByText('AI Legal Assistant')).toBeVisible();
  });

  test('preview shows Pilot Agreement title', async ({ page }) => {
    await expect(
      page.getByRole('article').getByRole('heading', { name: 'Pilot Agreement' })
    ).toBeVisible();
  });

  test('preview shows Pilot Terms section', async ({ page }) => {
    await expect(page.getByRole('article').getByText('Pilot Terms')).toBeVisible();
  });

  test('preview shows Provider and Customer sections', async ({ page }) => {
    const article = page.getByRole('article');
    await expect(article.getByRole('heading', { name: 'Provider' })).toBeVisible();
    await expect(article.getByRole('heading', { name: 'Customer' })).toBeVisible();
  });

  test('Download PDF button is visible and enabled', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Download PDF/ });
    await expect(btn).toBeVisible({ timeout: 10_000 });
    await expect(btn).toBeEnabled();
  });
});

test.describe('Generic Document Creator (Cloud Service Agreement)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create/csa/');
  });

  test('page loads with CSA header', async ({ page }) => {
    await expect(page.getByRole('banner').getByRole('heading', { name: 'Cloud Service Agreement' })).toBeVisible();
  });

  test('preview shows Agreement Terms section', async ({ page }) => {
    await expect(page.getByRole('article').getByText('Agreement Terms')).toBeVisible();
  });

  test('preview shows Provider and Customer party sections', async ({ page }) => {
    const article = page.getByRole('article');
    await expect(article.getByText('Provider').first()).toBeVisible();
    await expect(article.getByText('Customer').first()).toBeVisible();
  });

  test('back link navigates to catalog', async ({ page }) => {
    await page.getByText('Prelegal').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Legal Document Creator')).toBeVisible();
  });
});

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: frontend/tests/nda-creator.spec.ts >> Mutual NDA Creator >> changing Governing Law updates section 9 in the preview
- Location: frontend/tests/nda-creator.spec.ts:52:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Mutual NDA Creator', () => {
  4   | 
  5   |   test.beforeEach(async ({ page }) => {
> 6   |     await page.goto('/');
      |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  7   |   });
  8   | 
  9   |   // ── Layout ──────────────────────────────────────────────────────────────────
  10  | 
  11  |   test('page loads with correct header and two-column layout', async ({ page }) => {
  12  |     await expect(page.getByText('Mutual NDA Creator')).toBeVisible();
  13  |     await expect(page.getByText('Common Paper MNDA v1.0')).toBeVisible();
  14  |     await expect(page.getByText('Live Preview')).toBeVisible();
  15  |     await expect(page.getByText('Download PDF')).toBeVisible();
  16  |   });
  17  | 
  18  |   test('form sections are present', async ({ page }) => {
  19  |     await expect(page.getByText('Agreement Terms')).toBeVisible();
  20  |     await expect(page.getByText('Parties & Signatures')).toBeVisible();
  21  |   });
  22  | 
  23  |   // ── Live preview — initial state ─────────────────────────────────────────────
  24  | 
  25  |   test('preview shows the MNDA title', async ({ page }) => {
  26  |     await expect(page.getByRole('article').getByText('Mutual Non-Disclosure Agreement')).toBeVisible();
  27  |   });
  28  | 
  29  |   test('preview shows default purpose text', async ({ page }) => {
  30  |     const preview = page.getByRole('article');
  31  |     await expect(preview.getByText(/Evaluating whether to enter into a business relationship/)).toBeVisible();
  32  |   });
  33  | 
  34  |   test('preview renders all 11 standard terms', async ({ page }) => {
  35  |     const preview = page.getByRole('article');
  36  |     for (let i = 1; i <= 11; i++) {
  37  |       await expect(preview.locator(`text=/^${i}\\./`).first()).toBeVisible();
  38  |     }
  39  |   });
  40  | 
  41  |   // ── Form interaction — live preview updates ───────────────────────────────────
  42  | 
  43  |   test('typing in Purpose field updates the preview', async ({ page }) => {
  44  |     const textarea = page.locator('#purpose');
  45  |     await textarea.clear();
  46  |     await textarea.fill('Testing a new product launch strategy.');
  47  | 
  48  |     const preview = page.getByRole('article');
  49  |     await expect(preview.getByText('Testing a new product launch strategy.')).toBeVisible();
  50  |   });
  51  | 
  52  |   test('changing Governing Law updates section 9 in the preview', async ({ page }) => {
  53  |     await page.locator('#governingLaw').fill('California');
  54  | 
  55  |     const preview = page.getByRole('article');
  56  |     await expect(preview.getByText(/laws of the State of California/)).toBeVisible();
  57  |   });
  58  | 
  59  |   test('changing Jurisdiction updates section 9 in the preview', async ({ page }) => {
  60  |     await page.locator('#jurisdiction').fill('San Francisco, CA');
  61  | 
  62  |     const preview = page.getByRole('article');
  63  |     await expect(preview.getByText(/courts located in San Francisco, CA/)).toBeVisible();
  64  |   });
  65  | 
  66  |   test('switching MNDA Term to "continues until terminated" updates the preview', async ({ page }) => {
  67  |     await page.locator('input[name="mndaTermType"][value="continues"]').check();
  68  | 
  69  |     const preview = page.getByRole('article');
  70  |     await expect(preview.getByText(/Continues until terminated/)).toBeVisible();
  71  |   });
  72  | 
  73  |   test('switching Term of Confidentiality to "in perpetuity" updates the preview', async ({ page }) => {
  74  |     await page.locator('input[name="confidentialityTermType"][value="perpetuity"]').check();
  75  | 
  76  |     const preview = page.getByRole('article');
  77  |     await expect(preview.getByText(/In perpetuity/)).toBeVisible();
  78  |   });
  79  | 
  80  |   test('MNDA term years field updates preview text', async ({ page }) => {
  81  |     const yearsInput = page.locator('input[aria-label="MNDA term years"]');
  82  |     await yearsInput.fill('3');
  83  | 
  84  |     const preview = page.getByRole('article');
  85  |     await expect(preview.getByText(/Expires 3 year\(s\) from Effective Date/)).toBeVisible();
  86  |   });
  87  | 
  88  |   // ── Parties section ───────────────────────────────────────────────────────────
  89  | 
  90  |   test('entering Party 1 name shows italic signature in preview', async ({ page }) => {
  91  |     await page.locator('#party1-name').fill('Alice Smith');
  92  | 
  93  |     const preview = page.getByRole('article');
  94  |     // Name should appear in the signature row
  95  |     await expect(preview.getByText('Alice Smith').first()).toBeVisible();
  96  |   });
  97  | 
  98  |   test('entering Party 2 company name appears in preview', async ({ page }) => {
  99  |     await page.locator('#party2-company').fill('Acme Corp');
  100 | 
  101 |     const preview = page.getByRole('article');
  102 |     await expect(preview.getByText('Acme Corp')).toBeVisible();
  103 |   });
  104 | 
  105 |   test('filling both parties shows both names in preview', async ({ page }) => {
  106 |     await page.locator('#party1-name').fill('Alice Smith');
```
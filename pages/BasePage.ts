import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string, waitUntil: 'domcontentloaded' | 'networkidle' = 'domcontentloaded') {
    await this.page.goto(url, { waitUntil });
  }

  async acceptCookiesIfPresent(selector = 'button:has-text("Accept"), button:has-text("accept")') {
    const btn = this.page.locator(selector).first();
    try {
      if (await btn.isVisible()) {
        await btn.click().catch(() => null);
      }
    } catch {
      // ignore
    }
  }

  async waitNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  
  // * Progressive scroll to trigger lazy-loading.
   
  async progressiveScroll(times = 8, y = 800, delayMs = 200) {
    for (let i = 0; i < times; i++) {
      await this.page.mouse.wheel(0, y);
      await this.page.waitForTimeout(delayMs);
    }
  }

   //* Generic helper: scroll through a list until count stops changing or attempts exhausted.
   
  async scrollUntilStableCount(
    locator: Locator,
    {
      maxAttempts = 10,
      delayMs = 2000,
      verboseLabel,
    }: { maxAttempts?: number; delayMs?: number; verboseLabel?: string } = {}
  ): Promise<number> {
    let previous = 0;
    let current = await locator.count();
    let attempts = 0;

    if (verboseLabel) console.log(`Starting count (${verboseLabel}): ${current}`);

    while (current > previous && attempts < maxAttempts) {
      previous = current;

      const last = locator.last();
      await last.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(delayMs);

      current = await locator.count();
      attempts++;
    }

    if (verboseLabel) console.log(`Final count (${verboseLabel}): ${current}`);
    return current;
  }
}
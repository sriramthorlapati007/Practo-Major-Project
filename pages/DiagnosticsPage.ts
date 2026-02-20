import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DiagnosticsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('https://www.practo.com/tests', 'domcontentloaded');
  }

  async getCitiesServed(): Promise<string[]> {
    // Anchor near bottom of /tests page
    const citiesAnchor = this.page
      .locator('text=Practo Associate Labs provides services to the following cities')
      .first();

    // be resilient
    await citiesAnchor.waitFor({ state: 'visible', timeout: 15000 });

    const container = citiesAnchor.locator('xpath=ancestor-or-self::*[self::p or self::div][1]');
    const fullText = (await container.textContent())?.replace(/\s+/g, ' ').trim() || '';
    const afterColon = fullText.includes(':') ? fullText.split(':').slice(1).join(':').trim() : '';

    const raw = afterColon.split(',').map((s) => s.trim()).filter(Boolean);
    const cities = Array.from(new Set(raw.map((c) => c.replace(/\.$/, '').trim())));
    return cities;
  }
}
``
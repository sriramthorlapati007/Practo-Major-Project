import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly labTestsTab: Locator;

  constructor(page: Page) {
    super(page);
    this.labTestsTab = this.page.locator('.product-tab__title', { hasText: 'Lab Tests' });
  }

  async open() {
    await this.goto('https://www.practo.com/', 'domcontentloaded');
  }

  async goToHospitalsSearch(city: string) {
    const url = `https://www.practo.com/search/hospitals?results_type=hospital&q=%5B%7B%22word%22%3A%22hospital%22%2C%22autocompleted%22%3Atrue%2C%22category%22%3A%22type%22%7D%5D&city=${encodeURIComponent(
      city
    )}`;
    await this.goto(url, 'networkidle');
  }

  async clickLabTestsTab() {
    await this.labTestsTab.click();
    await this.waitNetworkIdle();
  }

  async getLabTestsTopCityTexts(): Promise<string[]> {
    const items = this.page.locator('.u-margint--standard');
    const count = await items.count();
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await items.nth(i).innerText()).trim();
      if (text) out.push(text);
    }
    return out;
  }
}
import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HospitalsSearchPage extends BasePage {
  private readonly open24x7: Locator;
  private readonly ratings: Locator;

  constructor(page: Page) {
    super(page);
    // Value-based text nodes often stable on the listing
    this.open24x7 = this.page.locator("xpath=//*[text()='Open 24x7']");
    this.ratings = this.page.locator("xpath=//*[text()='4.0' or text()='4.5']");
  }

  async countOpen24x7WithScroll(maxAttempts = 10, delayMs = 2000): Promise<number> {
    return this.scrollUntilStableCount(this.open24x7, {
      maxAttempts,
      delayMs,
      verboseLabel: "Open 24x7",
    });
  }

  async countRatingsWithScroll(maxAttempts = 10, delayMs = 2000): Promise<number> {
    return this.scrollUntilStableCount(this.ratings, {
      maxAttempts,
      delayMs,
      verboseLabel: "Ratings 4.0/4.5",
    });
  }

  async getOpen24x7HospitalTitles(): Promise<string[]> {
    const open24Cards = this.page.locator('li', { has: this.page.getByText('Open 24x7') });
    const titles = await open24Cards
      .locator('h2')
      .evaluateAll((nodes) =>
        nodes
          .map((n) => (n.getAttribute('title') || n.textContent || '').trim())
          .filter(Boolean)
      );
    return titles;
  }

  async getRatedHospitalTitles(): Promise<string[]> {
    const ratedCards = this.page.locator('li', {
      has: this.page.locator("xpath=//*[text()='4.0' or text()='4.5']"),
    });
    const titles = await ratedCards
      .locator('h2')
      .evaluateAll((nodes) =>
        nodes
          .map((n) => (n.getAttribute('title') || n.textContent || '').trim())
          .filter(Boolean)
      );
    return titles;
  }
}
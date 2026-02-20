import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type LocalValidation = {
  isValidName: boolean;
  isValidCompany: boolean;
  isValidPhone: boolean;
  isValidEmail: boolean;
  errorsFound: boolean;
};

export class CorporateWellnessPage extends BasePage {
  private readonly name: Locator;
  private readonly company: Locator;
  private readonly phone: Locator;
  private readonly email: Locator;
  private readonly sizeDropdown: Locator;
  private readonly interestDropdown: Locator;
  private readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.name = this.page.locator('input[name="name"], input[placeholder*="Name" i]').first();
    this.company = this.page.locator('input[placeholder="Organization Name"]').first();
    this.phone = this.page.locator('input[placeholder="Contact Number"]').first();
    this.email = this.page.locator('input[placeholder="Official Email ID"]').first();
    this.sizeDropdown = this.page.locator('#organizationSize').first();
    this.interestDropdown = this.page.locator('#interestedIn').first();
    this.submit = this.page.locator('button[type="submit"]').first();
  }

  async open() {
    await this.goto('https://www.practo.com/plus/corporate?demo=true', 'domcontentloaded');
  }

  async waitForReady() {
    await this.name.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillForm(data: {
    name: string;
    company: string;
    phone: string;
    email: string;
    size: string;
    interest: string;
  }) {
    await this.name.fill(data.name);
    await this.company.fill(data.company);
    await this.phone.fill(data.phone);
    await this.email.fill(data.email);
    await this.sizeDropdown.selectOption(data.size);
    await this.interestDropdown.selectOption(data.interest);
  }

  async localValidate(): Promise<LocalValidation> {
    const name = (await this.name.inputValue()).trim();
    const company = (await this.company.inputValue()).trim();
    const phone = (await this.phone.inputValue()).trim();
    const email = (await this.email.inputValue()).trim();

    const isValidName = name.length >= 3;
    const isValidCompany = company.length >= 3;
    const isValidPhone = /^[0-9]{10}$/.test(phone);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const errorsFound = !isValidName || !isValidCompany || !isValidPhone || !isValidEmail;

    return { isValidName, isValidCompany, isValidPhone, isValidEmail, errorsFound };
  }

  async submitForm() {
    await this.submit.click({ force: true });
  }

  async getInlineErrorMessages(): Promise<string[]> {
    const errors = this.page.locator(
      '.error, .invalid, .helper, [role="alert"], [aria-live="polite"], [data-error]'
    );
    await this.page.waitForTimeout(1000);
    const messages = (await errors.allTextContents()).map((t) => t.trim()).filter(Boolean);
    return messages;
  }
}
``
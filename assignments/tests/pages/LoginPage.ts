import { Page, expect } from "@playwright/test";
import { CREDENTIALS, SELECTORS } from "../utils/constants";
import { login, takeScreenshot } from "../utils/helpers";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async performLogin() {
    await login(this.page, CREDENTIALS.username, CREDENTIALS.password);
  }

  async validateLogin() {
    const title = this.page.locator(SELECTORS.productsTitle);
    await expect(title).toBeVisible();
  }

  async captureLandingPage() {
    await takeScreenshot(this.page, "tests/output/products_page.png");
  }
}

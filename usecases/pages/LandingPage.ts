import { Page, expect } from "@playwright/test";

export class LandingPage {
  constructor(private page: Page) {}

  async init() {
    await this.page.goto("https://healthcaresuccess.com");
  }

  async getMenuItems(): Promise<string[]> {
    const menuItems = await this.page
      .locator("#menu-top-navigation > li > a")
      .allTextContents();
    return menuItems.map((item) => item.trim()).filter(Boolean); // filter out null || undefined
  }

  async verifyLandingPageScreenshot() {
    await expect(this.page).toHaveScreenshot("myImage.png", {
      fullPage: true,
    });
  }
}

import { test } from "@playwright/test";
import { LandingPage } from "../pages/LandingPage";
import { ContactPage } from "../pages/ContactPage";
import sampData from "../data/input.json";
import { ContactFormData } from "../types";

test.describe("My Suite", () => {
  test("display menu and compare screenshot", async ({ page }) => {
    const landingPage = new LandingPage(page);

    await landingPage.init();

    const menus = await landingPage.getMenuItems();
    console.log("Menu List:", menus);
    console.log("Menu count:", menus.length);

    await landingPage.verifyLandingPageScreenshot();
  });

  test("fills the contact form", async ({ page }) => {
    const landingPage = new LandingPage(page);
    const contactPage = new ContactPage(page);

    await landingPage.init();

    await contactPage.clickContactMenu();
    await contactPage.scrollToView();
    await contactPage.fillContactForm(sampData as ContactFormData);

    await page.waitForTimeout(5000);
  });
});

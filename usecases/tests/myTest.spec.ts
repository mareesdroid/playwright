import { test } from "@playwright/test";
import { LandingPage } from "../pages/LandingPage";
import { ContactPage } from "../pages/ContactPage";
import { AboutPage } from "../pages/AboutPage";
import sampData from "../data/input.json";
import { ContactFormData } from "../types";
import { JsonWriter } from "../utils/jsonWriter";

test.describe("My Suite", () => {
  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.init();
  });

  test("display menu and compare screenshot", async ({ page }) => {
    const landingPage = new LandingPage(page);

    const menus = await landingPage.getMenuItems();
    console.log("Menu List:", menus);
    console.log("Menu count:", menus.length);

    await landingPage.verifyLandingPageScreenshot();
  });

  test("fills the contact form", async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.clickContactMenu();
    await contactPage.scrollToView();
    await contactPage.fillContactForm(sampData as ContactFormData);

    await page.waitForTimeout(5000);
  });

  test("scrape testimonials", async ({ page }) => {
    const testimonialsPage = new AboutPage(page);

    await testimonialsPage.navigateToTestimonials();

    const testimonials = await testimonialsPage.getTestimonials();

    JsonWriter.write("testimonials.json", testimonials);
  });
});

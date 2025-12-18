import { test } from "@playwright/test";
import { LandingPage } from "../pages/LandingPage";
import { ContactPage } from "../pages/ContactPage";
import { AboutPage } from "../pages/AboutPage";
import sampData from "../data/input.json";
import { ContactFormData } from "../types";
import { JsonWriter } from "../utils/jsonWriter";

test.describe("My Suite", () => {
  let i = 1;
  test.beforeEach(async ({ page }) => {
    console.log(`/////// Starting test: ${i} ///////`);
    const landingPage = new LandingPage(page);
    await landingPage.init();
  });
  test.afterEach(async ({ page }) => {
    console.log(`/////// Ending test: ${i} ///////`);
    i++;
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

    console.log("Total Testimonials: ", testimonials.length);
    JsonWriter.write("testimonials.json", testimonials);
    console.log("Saved to json");
  });
});

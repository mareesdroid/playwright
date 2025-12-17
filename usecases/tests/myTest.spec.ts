import { test } from "@playwright/test";
import { LandingPage } from "../pages/LandingPage";

test.describe("My Suite", () => {
  test("display menu and compare screenshot", async ({ page }) => {
    const landingPage = new LandingPage(page);

    await landingPage.init();

    const menus = await landingPage.getMenuItems();
    console.log("Menu List:", menus);
    console.log("Menu count:", menus.length);

    await landingPage.verifyLandingPageScreenshot();
  });
});

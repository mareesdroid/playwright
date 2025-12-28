import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test("SauceDemo login flow with modular structure", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.performLogin();
  await loginPage.validateLogin();
  await loginPage.captureLandingPage();
});

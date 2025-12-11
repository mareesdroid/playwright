import { test, expect, chromium } from "@playwright/test";

/**
 * Assertion
 */
test("basic assertion", async () => {
  const x = 10;
  // expect(x).toBeGreaterThan(5);
  expect(x).toEqual(10);
  // expect(x).not.toBeNull();
});

test("element assertion", async ({ page }) => {
  await page.goto("https://playwright.dev");

  const getStartedLink = page.getByRole("link", { name: "Get Started" });

  await expect(getStartedLink).toBeVisible();
  await expect(getStartedLink).toHaveText("Get started");
  await expect(getStartedLink).toHaveAttribute("href", "/docs/intro");
});

test("page level assertion", async ({ page }) => {
  await page.goto("https://playwright.dev");

  await expect(page).toHaveTitle(/Playwright/); // regex
  await expect(page).toHaveURL("https://playwright.dev/");
});

/**
 * Locator
 */
test("xpath locator", async ({ page }) => {
  await page.goto("https://gitlab.com");

  /**
   * to find xpath
   * console window
   * rClick the elem and copy xpath
   */
  const signInButton = page.locator(
    '//*[@id="be-navigation-desktop"]/div/div/div[2]/div/a'
  );

  await expect(signInButton).toBeVisible();
  await signInButton.click();
});

test("text Locator", async ({ page }) => {
  await page.goto("https://saucelabs.com");

  const element = page.locator("text=Sign In");

  await expect(element).toBeVisible();
  await element.click();
});

test("role by locator", async ({ page }) => {
  await page.goto("https://google.com");
  await page.getByRole("button", { name: "Google Search" }).click();
  await expect(
    page.getByRole("button", { name: "Google Search" })
  ).toBeVisible();
});

test("placeholder selector", async ({ page }) => {
  await page.goto("https://saucedemo.com");

  // fill login creds
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");

  // click login
  await page.getByRole("button", { name: "Login" }).click();

  // check if product is visible
  await expect(page.getByText("Products")).toBeVisible();
});

test("attr selector", async ({ page }) => {
  await page.goto("https://saucedemo.com");

  // fill login creds
  await page.fill('input[data-test="username"]', "standard_user");
  await page.fill('input[data-test="password"]', "secret_sauce");

  await page.click('input[data-test="login-button"]');

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

test("className selector", async ({ page }) => {
  await page.goto("https://saucedemo.com");

  await page.fill(".input_error.form_input", "standard_user");
  await page.fill('.input_error.form_input[type="password"]', "secret_sauce");

  await page.click(".btn_action");

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

test("id selector", async ({ page }) => {
  await page.goto("https://saucedemo.com");

  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");

  await page.pause();
  await page.click("#login-button");
  await page.waitForTimeout(2000);
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

/**
 * roleby
 */

test("roleBy implementation", async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.pause();
  await page.goto("https://google.com");
  await page.getByRole("combobox", { name: "Search" }).fill("Training");
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Google Search" }).first().click();
});

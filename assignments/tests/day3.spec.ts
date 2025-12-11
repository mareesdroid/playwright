import { test, expect } from "@playwright/test";

test("Herokuapp Login Validation", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");

  await page.fill("#username", "tomsmith");
  await page.fill("#password", "SuperSecretPassword!");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator(".flash.success")).toContainText(
    "You logged into a secure area!"
  );
});

test("OrangeHRM Login Validation", async ({ page }) => {
  await page.goto(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  );

  await page.getByPlaceholder("Username").fill("Admin");
  await page.getByPlaceholder("Password").fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("h6")).toHaveText("Dashboard");
});

test("Herokuapp Login using locator()", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");

  await page.locator("#username").fill("tomsmith");
  await page.locator("#password").fill("SuperSecretPassword!");

  await page.locator('button[type="submit"]').click();

  await expect(page.locator(".flash.success")).toContainText(
    "You logged into a secure area!"
  );
});

test("Click the API link", async ({ page }) => {
  await page.goto("https://playwright.dev");

  const apiLink = page.getByRole("link", { name: "API" });
  await apiLink.click();

  await expect(page).toHaveURL(/.*api/);
});

test("playwright fill()", async ({ page }) => {
  await page.goto("https://practicetestautomation.com/practice-test-login/");

  await page.locator('input[id="username"]').fill("student");
  await page.locator('input[id="password"]').fill("Password123");

  await page.locator('button[id="submit"]').click();

  await expect(page.getByText("Logged In Successfully")).toBeVisible();
  // optional test signup if possible
});

test("element assertion", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");

  await page.locator('input[id="username"]').fill("tomsmith");
  await page.locator('input[id="password"]').fill("SuperSecretPassword!");

  await page.locator('button[type="submit"]').click();

  const successMessage = page.locator(".flash.success");
  await expect(successMessage).toContainText("You logged into a secure area!");
});

test("Checkbox", async ({ page }) => {
  await page.goto("https://leafground.com/checkbox.xhtml");

  const basicCheckbox = await page.locator(`//*[@id="j_idt87:j_idt89"]/div[2]`);

  await basicCheckbox.waitFor({ state: "visible" });
  await basicCheckbox.click();

  const multiCheckbox = page.locator(
    "div#j_idt87\\:multiple div.ui-chkbox-box"
  );

  const count = await multiCheckbox.count();

  // Check each checkbox
  for (let i = 0; i < count; i++) {
    await multiCheckbox.nth(i).click();
  }

  // Validate all checkboxes are selected
  for (let i = 0; i < count; i++) {
    await expect(multiCheckbox.nth(i)).toHaveClass(/ui-state-active/);
  }
});

test("Check all checkboxes", async ({ page }) => {
  await page.goto("https://practice.expandtesting.com/checkboxes");

  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();

  for (let i = 0; i < count; i++) {
    const cb = checkboxes.nth(i);
    if (!(await cb.isChecked())) {
      await cb.click();
    }
  }

  for (let i = 0; i < count; i++) {
    await expect(checkboxes.nth(i)).toBeChecked();
  }
});

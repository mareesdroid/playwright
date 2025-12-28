import { test, expect, Page } from "@playwright/test";

const url = "https://the-internet.herokuapp.com/login";
const username = "tomsmith";

const fillAndClickLogin = async (page: Page, password: string) => {
  await page.goto(url);
  const inputs = page.locator("input");
  await inputs.nth(0).fill(username);
  await inputs.nth(1).fill(password);

  const buttons = page.locator("button");
  await buttons.nth(0).click();
};

test("Login and validate success message", async ({ page }) => {
  const password = "SuperSecretPassword!";

  await fillAndClickLogin(page, password);

  const flash = page.locator("#flash");
  await expect(flash).toContainText("You logged into a secure area!");
});

test("Invalid login validation using filter with hasText", async ({ page }) => {
  const password = "test123";

  await fillAndClickLogin(page, password);

  const errorMessage = page
    .locator("div.flash")
    .filter({ hasText: "Your username is invalid!" });

  await expect(errorMessage).toBeVisible();
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

test("Radio Button Validation - Select Yes", async ({ page }) => {
  await page.goto("https://demoqa.com/radio-button");

  await page.locator('label[for="yesRadio"]').click();

  const yesRadio = page.locator("#yesRadio");
  await expect(yesRadio).toBeChecked();

  const resultText = page.locator(".text-success");
  await expect(resultText).toHaveText("Yes");
});

test("Dropdown validations — single and multi select", async ({ page }) => {
  await page.goto("https://www.testautomationcentral.com/demo/dropdown.html");

  const singleSelect = page.locator("#single-select");
  const multiSelect = page.locator("#multi-select");

  await singleSelect.selectOption({ label: "Option 2" });
  const selectedValue = await singleSelect.inputValue();

  expect(selectedValue).toBe("Option 2");

  await multiSelect.selectOption([
    { label: "Option 1" },
    { label: "Option 2" },
    { label: "Option 3" },
  ]);
  const selectedValues = await multiSelect.evaluate((el: HTMLSelectElement) =>
    Array.from(el.selectedOptions).map((option) => option.text)
  );

  expect(selectedValues).toEqual(["Option 1", "Option 2", "Option 3"]);
});

test("Single-Select Dropdown Validation — Select a country", async ({
  page,
}) => {
  await page.goto("https://www.qaplayground.com/practice/select");

  const countryDropdown = page.locator("select#country");
  await countryDropdown.selectOption({ label: "India" });
  const selectedValue = await countryDropdown.inputValue();

  expect(selectedValue).toBe("India");
});

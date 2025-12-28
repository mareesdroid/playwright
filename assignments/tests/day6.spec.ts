import { test, expect } from "@playwright/test";

test("Select a future date in DatePicker Enabled", async ({ page }) => {
  await page.goto("https://demo.automationtesting.in/Datepicker.html");

  const dateInput = page.locator("#datepicker1"); 

  await dateInput.click();

  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 10);

  const futureDay = futureDate.getDate();
  const futureMonth = futureDate.toLocaleString("default", { month: "long" });
  const futureYear = futureDate.getFullYear();

  while (true) {
    const displayedMonthYear = await page
      .locator(".ui-datepicker-title")
      .textContent();
    if (
      displayedMonthYear?.includes(futureMonth) &&
      displayedMonthYear.includes(futureYear.toString())
    ) {
      break;
    }
    await page.locator(".ui-datepicker-next").click();
  }

  await page.locator(`//a[text()='${futureDay}']`).click();

  const selectedDate = await dateInput.inputValue();
  const expectedDate = `${futureMonth} ${futureDay}, ${futureYear}`;
  expect(selectedDate).toContain(futureDay.toString());
});

test("Validate vertical scrolling and bottom content visibility", async ({
  page,
}) => {
  await page.goto("https://healthcaresuccess.com");

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(2000);

  const bottomElement = page.locator("footer");
  await expect(bottomElement).toBeVisible();

  await page.screenshot({
    path: "scroll_bottom_screenshot.png",
    fullPage: true,
  });
});

test("UI snapshot comparison for healthcaresuccess.com", async ({ page }) => {
  await page.goto("https://healthcaresuccess.com");

  await page.waitForSelector("header");
  await page.waitForSelector("footer");

  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
    "healthcaresuccess-homepage.png"
  );
});

test("Validate vertical scrolling and bottom content visibility", async ({
  page,
}) => {
  await page.goto("https://the-internet.herokuapp.com/large");

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(1000);

  const bottomElement = page.locator("table#large-table tr").last();
  await expect(bottomElement).toBeVisible();

  await page.screenshot({ path: "large_page_bottom.png", fullPage: true });
});

test("Validate alert functionalities on Leafground", async ({ page }) => {
  await page.goto("https://leafground.com/alert.xhtml");

  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toContain("This is a simple Alert");
    await dialog.accept();
  });

  await page.locator('button:has-text("Show")').first().click();

  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toContain("Do you confirm");
    await dialog.accept();
  });

  await page.locator('button:has-text("Show")').nth(1).click();

  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toContain("Please enter");
    await dialog.accept("Playwright Test");
  });

  await page.locator('button:has-text("Show")').nth(2).click();

  const sweetAlertButton = page.locator('button:has-text("Show")').nth(3);
  await sweetAlertButton.click();

  const sweetAlert = page.locator('.ui-dialog-title:has-text("Sweet Alert")');
  await expect(sweetAlert).toBeVisible();

  const closeButton = page.locator(".ui-dialog-titlebar-close");
  await closeButton.click();
  await expect(sweetAlert).toHaveCount(0);
});

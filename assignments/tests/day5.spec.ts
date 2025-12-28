import { test, expect } from "@playwright/test";
import path from "path";

test("Multi-Select Listbox Validation — Select multiple fruits", async ({
  page,
}) => {
  await page.goto(
    "https://testautomationcentral.com/demo/multi_select_dropdown.html"
  );

  const multiSelect = page.locator("select#fruits");
  await multiSelect.selectOption([
    { label: "Apple" },
    { label: "Banana" },
    { label: "Grapes" },
  ]);

  const selectedValues = await multiSelect.evaluate((el: HTMLSelectElement) =>
    Array.from(el.selectedOptions).map((option) => option.text)
  );

  expect(selectedValues).toEqual(["Apple", "Banana", "Grapes"]);
});

test("Range Slider Validation - Horizontal and Vertical", async ({ page }) => {
  await page.goto(
    "https://dojotoolkit.org/documentation/tutorials/1.9/sliders/demos/simple.php"
  );

  const frame = page.frameLocator("#demoFrame");

  const horizontalSlider = frame.locator(".dijitSliderBar").first();
  const horizontalHandle = frame.locator(".dijitSliderImageHandle").first();
  const horizontalValue = frame.locator("#horizontalSliderValue");

  await horizontalHandle.dragTo(horizontalSlider, {
    targetPosition: { x: 200, y: 10 },
  });

  const hValue = await horizontalValue.textContent();
  expect(Number(hValue)).toBeGreaterThan(0);

  await horizontalHandle.dragTo(horizontalSlider, {
    targetPosition: { x: 1000, y: 10 },
  });

  const hMaxValue = await horizontalValue.textContent();
  expect(Number(hMaxValue)).toBeLessThanOrEqual(100);

  const verticalSlider = frame.locator(".dijitSliderBar").nth(1);
  const verticalHandle = frame.locator(".dijitSliderImageHandle").nth(1);
  const verticalValue = frame.locator("#verticalSliderValue");

  await verticalHandle.dragTo(verticalSlider, {
    targetPosition: { x: 10, y: 200 },
  });

  const vValue = await verticalValue.textContent();
  expect(Number(vValue)).toBeGreaterThan(0);

  await verticalHandle.dragTo(verticalSlider, {
    targetPosition: { x: 10, y: -200 },
  });

  const vMinValue = await verticalValue.textContent();
  expect(Number(vMinValue)).toBeGreaterThanOrEqual(0);
});

test("W3Schools File Upload Validation", async ({ page }) => {
  await page.goto(
    "https://www.w3schools.com/howto/howto_html_file_upload_button.asp"
  );

  const fileInput = page.locator('input[type="file"]');

  const validFilePath = path.resolve("tests/test-data/sample.txt");
  await fileInput.setInputFiles(validFilePath);

  const uploadedFileName = await fileInput.evaluate(
    (el: HTMLInputElement) => el.files?.[0].name
  );

  expect(uploadedFileName).toBe("sample.txt");

  const invalidFilePath = path.resolve("tests/test-data/sample.exe");
  await fileInput.setInputFiles(invalidFilePath);

  const invalidFileName = await fileInput.evaluate(
    (el: HTMLInputElement) => el.files?.[0].name
  );

  expect(invalidFileName).toBe("sample.exe");

  const largeFilePath = path.resolve("tests/test-data/large-file.txt");
  await fileInput.setInputFiles(largeFilePath);

  const largeFileName = await fileInput.evaluate(
    (el: HTMLInputElement) => el.files?.[0].name
  );

  expect(largeFileName).toBe("large-file.txt");
});

test("LeafGround File Upload Validation", async ({ page }) => {
  await page.goto("https://leafground.com/file.xhtml");

  const fileInput = page.locator('input[type="file"]');

  const validFilePath = path.resolve("tests/test-data/sample.txt");
  await fileInput.setInputFiles(validFilePath);

  const selectedFileName = await fileInput.evaluate(
    (el: HTMLInputElement) => el.files?.[0].name
  );
  expect(selectedFileName).toBe("sample.txt");

  await page.getByRole("button", { name: "Upload" }).click();

  const successMessage = page.locator(
    ".ui-growl-title, .ui-messages-info-summary"
  );
  await expect(successMessage).toContainText("successful");
});

test("Valid File Upload Validation", async ({ page }) => {
  await page.goto("https://testautomationcentral.com/demo/file_upload.html");

  const fileInput = page.locator('input[type="file"]');

  const validFilePath = path.resolve("tests/test-data/sample.txt");
  await fileInput.setInputFiles(validFilePath);

  const uploadedFileName = await fileInput.evaluate(
    (el: HTMLInputElement) => el.files?.[0].name
  );
  expect(uploadedFileName).toBe("sample.txt");

  const errorMessage = page.locator(".error, .error-message");
  await expect(errorMessage).toHaveCount(0);

  const successMessage = page.locator(".success, .success-message");
  await expect(successMessage).toBeVisible();
});

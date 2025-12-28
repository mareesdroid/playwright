import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test("Validate nested frames content", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/nested_frames");

  const topFrame = page.frame({ name: "frame-top" });
  expect(topFrame).not.toBeNull();

  const childFrames = topFrame!.childFrames();

  const leftFrame = childFrames.find((f) => f.name() === "frame-left");
  const middleFrame = childFrames.find((f) => f.name() === "frame-middle");
  const rightFrame = childFrames.find((f) => f.name() === "frame-right");

  const leftText = await leftFrame!.locator("body").textContent();
  expect(leftText?.trim()).toBe("LEFT");

  const middleText = await middleFrame!.locator("#content").textContent();
  expect(middleText?.trim()).toBe("MIDDLE");

  const rightText = await rightFrame!.locator("body").textContent();
  expect(rightText?.trim()).toBe("RIGHT");

  const bottomFrame = page.frame({ name: "frame-bottom" });
  const bottomText = await bottomFrame!.locator("body").textContent();
  expect(bottomText?.trim()).toBe("BOTTOM");
});

test("Click button inside single embedded frame", async ({ page }) => {
  await page.goto("https://leafground.com/frame.xhtml");

  const singleFrame = page.frameLocator('iframe[src*="button"]');
  const button = singleFrame.locator("button");
  await button.click();

  await expect(button).toHaveText(/Clicked|Button/i);
});

test("Extract testimonials and save to file", async ({ page }) => {
  await page.goto("https://healthcaresuccess.com/about/testimonials");

  const testimonials = page.locator(
    ".testimonial-content, .client-testimonial"
  );
  const testimonialCount = await testimonials.count();

  const testimonialTexts = [];
  for (let i = 0; i < testimonialCount; i++) {
    const text = await testimonials.nth(i).textContent();
    if (text) testimonialTexts.push(text.trim());
  }

  const filePath = path.resolve("tests/output/testimonials.txt");
  fs.writeFileSync(filePath, testimonialTexts.join("\n\n"), "utf-8");
});

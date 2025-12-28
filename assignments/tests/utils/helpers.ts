import { Page } from "@playwright/test";

export async function login(page: Page, username: string, password: string) {
  await page.fill("#user-name", username);
  await page.fill("#password", password);
  await page.click("#login-button");
}

export async function takeScreenshot(page: Page, fileName: string) {
  await page.screenshot({ path: fileName, fullPage: true });
}

import { chromium } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();
export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.BASE_URL}`);
  console.log(`${process.env.BASE_URL}/web/index.php/auth/login`)
  await page.fill("#user-name", process.env.USERNAME!);
  await page.fill("#password", process.env.PASSWORD!);
  await page.click('input[type="submit"]');
  // Save storage state for reuse
  // await page.context().storageState({ path: "storageState.json" }); // uncomment uf required
  await browser.close();
};

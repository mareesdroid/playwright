import { test, chromium } from "@playwright/test";
import * as path from "path";

test("multiselct dropdown", async ({ page }) => {
  await page.goto("https://omayo.blogspot.com/");

  const datas = await page.selectOption("#multiselect1", ["Volvo", "Swift"]);

  for (const data of datas) {
    console.log(await data);
  }
});

test("slider", async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://the-internet.herokuapp.com/horizontal_slider");
  await page.pause();

  const sliderElement = await page.locator('//*[@id="content"]/div/div/input');
  const scroll = await sliderElement.boundingBox();

  if (!scroll) {
    console.log("Failed to locate scroll");
    return;
  }

  const startX = scroll.x + scroll.width / 2;
  const startY = scroll.y + scroll.height / 2;

  const endX = startX + 20;

  const { mouse } = page;

  await mouse.move(startX, startY);
  await mouse.down();

  await mouse.move(endX, startY);
  await mouse.up();

  await page.waitForTimeout(2000);
});

test("fileUpload", async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://the-internet.herokuapp.com/upload");
  await page.pause();

  const dirPath = path.join(__dirname, "../files");
  const filtePath = `${dirPath}/CTE\ in\ SQL\ -\ GeeksforGeeks.pdf`;

  await page.setInputFiles('input[type="file"]', filtePath);

  await page.click('input[type="submit"]');
  await page.waitForTimeout(2000);

  await page.waitForSelector("#uploaded-files");

  await page.waitForTimeout(2000);

  const uploadedFileName = await page.textContent("#uploaded-files");
  console.log("uploadedFileName", uploadedFileName);

  await browser.close();
});

test("file upload - media picker", async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://www.canva.com/features/word-to-pdf-converter/");
  await page.pause();

  const dirPath = path.join(__dirname, "../files");
  const filtePath = `${dirPath}/CTE\ in\ SQL\ -\ GeeksforGeeks.pdf`;
  
  const filePicker = page.waitForEvent("filechooser");

  //upload button
  const uploadBtn = await page.locator('text="Upload your file"').first();
  uploadBtn.click();

  await filePicker
    .then((fileChooser) => fileChooser.setFiles(filtePath))
    .catch((e) => ({ message: "Failed to set filepth", err: e }));

  await page.waitForTimeout(3000);
});

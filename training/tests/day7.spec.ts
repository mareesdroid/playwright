import { test, expect, chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test("Handling Tree view / Navigation view / Folder tree view", async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://leafground.com/tree.xhtml");

  // for debug
  await page.pause();

  // Wait for the tree to be visible
  const treeLocator = page.locator(".ui-tree").first(); // Tree container //first to fix multiple elems with same class
  await page.waitForTimeout(1000);
  console.log("treeLocator", treeLocator);
  await expect(treeLocator).toBeVisible();

  // Expand the first parent node
  const firstExpandIcon = page.locator(".ui-tree-toggler").first();
  await firstExpandIcon.click();

  // Verify child nodes are visible
  const childNodes = page.locator(".ui-treenode-content").nth(1); // Adjust index if needed
  await expect(childNodes).toBeVisible();

  // Expand deeper level (if exists) -> from parent node to 2nd child
  const secondExpandIcon = page.locator(".ui-tree-toggler").nth(1);
  await secondExpandIcon.click();

  // Retrieve all visible node texts -> extract all nested child nodes
  const allNodes = await page.locator(".ui-treenode-content").allTextContents();
  console.log("Visible Tree Nodes:", allNodes);

  // Assert that expected nodes are present
  expect(allNodes).toContain("Documents"); // Example node
  expect(allNodes).toContain("Pictures"); // Example node
});

test("iframes", async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://ui.vision/demo/webtest/frames/");

  const frames = await page.frames(); // get all frames
  console.log("Total frames: ", frames.length);

  ////// FINDING FRAMES //////

  //1. can use name or url of the frame as input param object
  const frame1 = await page.frame({
    url: "https://ui.vision/demo/webtest/frames/frame_1.html",
  });
  if (!frame1) return;

  await frame1.fill("[name='mytext1']", "Welcome");
  await page.waitForTimeout(3000);

  //2. can use frameLocator fn -> input xpatch, id,... |||| locator fn find elems after the frame found
  const frame1Alt = await page
    .frameLocator("frame[src='frame_1.html']")
    .locator("[name='mytext1']");
  await frame1Alt.fill("Hello");
  await page.waitForTimeout(3000);

  ////// NESTED FRAMES //////
  const frame3 = await page.frame({
    url: "https://ui.vision/demo/webtest/frames/frame_3.html",
  });
  if (frame3) {
    await frame3.locator("[name='mytext3']").fill("frame3");
    await page.waitForTimeout(3000);
    //get all Nested frame under frame 3
    const childFrames = frame3.childFrames();
    page.pause();
    console.log("Total childframes: ", childFrames.length);
    console.log("hildframes: ", childFrames);

    if (childFrames.length > 0) {
      // check checkbox by xpath
      await childFrames[0].locator(`//*[@id="i21"]`).check();
      await page.waitForTimeout(4000);
    } else {
      console.log("No child frames found");
    }
  } else {
    console.log("Frame3 not found");
  }
});

test("write to file", async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://the-internet.herokuapp.com/");
  await page.waitForLoadState("load");

  const testimonials = [];

  const list = await page.locator("//li/a").count();
  for (let i = 0; i < list; i++) {
    const text = await page.locator("//li/a").nth(i).textContent();
    testimonials.push(text?.trim());
  }

  const dirPath = path.join(__dirname, "../files");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Write to file
  const filePath = path.join(dirPath, "output.txt");
  fs.writeFileSync(filePath, testimonials.join("\n"), "utf8");
});

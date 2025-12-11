import { test as myBase, Page } from "@playwright/test";

type MyFixture = {
  loggedInPage: Page;
};

/**
 * fixtures Reusable pieces of setup/teardown logic
 * (Not like but kind of interceptor/middleware/singleton)
 * this exported test extends the MyFixture type
 */

export const myCustomTest = myBase.extend<MyFixture>({
  loggedInPage: async ({ page }, use) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    await page.fill("#username", "tomsmith");
    await page.fill("#password", "SuperSecretPassword");
    await page.click('button[type="submit"]');

    await use(page); // yield point
    // add cleanups if any
  },
});

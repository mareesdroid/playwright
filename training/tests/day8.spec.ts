import { test, expect, request } from "@playwright/test";
import {
  baseUrl,
  BOOKER_API,
  creds,
  getDocsUrl,
  headers,
  inputParams,
} from "../utils/helpers";
import readJsonFile from "../data/booking.json";
import { myCustomTest } from "../fixtures/login";

test("export fn", async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Docs" }).click();

  // Validate the url match
  await expect(page).toHaveURL(getDocsUrl());
});

test("HTTP GET", async () => {
  const {
    baseUrl,
    endPoints: { booking },
  } = BOOKER_API;

  // http client similar to axios & fetch
  const apicontext = await request.newContext();
  const response = await apicontext.get(`${baseUrl}/${booking}`);
  console.log(await response.json());

  expect(await response.status()).toBe(200);
});

test("HTTP POST", async () => {
  const {
    baseUrl,
    endPoints: { booking },
  } = BOOKER_API;
  const apicontext = await request.newContext();
  const options = {
    data: inputParams,
    headers,
  };
  const response = await apicontext.post(`${baseUrl}/${booking}`, options);
  console.log(await response.json());
});

test("Shared authentication between API calls", async () => {
  const {
    baseUrl,
    endPoints: { auth, booking },
  } = BOOKER_API;

  // Step 1: Generate token using /auth endpoint
  const apiContext = await request.newContext();
  const authResponse = await apiContext.post(`${baseUrl}/${auth}`, {
    data: creds,
    headers,
  });
  expect(authResponse.ok()).toBeTruthy();
  const authData = await authResponse.json();
  const token = authData.token;
  console.log("Auth Token:", token);
  // Step 2: Use token for booking creation
  const bookingResponse = await apiContext.post(`${baseUrl}/${booking}`, {
    data: inputParams,
    headers: {
      ...headers,
      Cookie: `token=${token}`,
    },
  });
  expect(bookingResponse.ok()).toBeTruthy();
  const bookingData = await bookingResponse.json();
  console.log("Booking Created:", bookingData);
  const { firstname, lastname, totalprice } = inputParams;

  // Step 3: Validate response fields
  expect(bookingData.booking.firstname).toBe(firstname);
  expect(bookingData.booking.lastname).toBe(lastname);
  expect(bookingData.booking.totalprice).toBe(totalprice);
});

test.describe("Combined API Tests", () => {
  /** Benefits

            Cleaner tests: No repeated logic for token generation or booking creation.
            Easy maintenance: Update endpoints or headers in one place.
            Scalable: Can add more helpers (e.g., updateBooking, deleteBooking)
    **/

  const {
    baseUrl,
    endPoints: { auth, booking },
  } = BOOKER_API;

  // Token-based Authentication (Data-driven)
  for (const bookingPayload of readJsonFile) {
    const {
      firstname,
      lastname,
      bookingdates: { checkin },
    } = bookingPayload;
    test(`Create booking for ${firstname} with Token Auth`, async () => {
      console.log(`my payload :::${checkin}`);

      const apiContext = await request.newContext();

      // Step 1: Generate token
      const authResponse = await apiContext.post(`${baseUrl}/${auth}`, {
        data: creds,
        headers,
      });
      expect(authResponse.ok()).toBeTruthy();
      const token = (await authResponse.json()).token;

      // Step 2: Create booking using token
      const bookingResponse = await apiContext.post(`${baseUrl}/${booking}`, {
        data: bookingPayload,
        headers: {
          ...headers,
          Cookie: `token=${token}`,
        },
      });
      expect(bookingResponse.ok()).toBeTruthy();

      const bookingData = await bookingResponse.json();
      console.log(`Booking Created for ${firstname}:`, bookingData);

      // Validate response
      expect(bookingData.booking.firstname).toBe(firstname);
      expect(bookingData.booking.lastname).toBe(lastname);
    });
  }
});

test("Login using environment variables", async ({ page }) => {
  const baseUrl = process.env.BASE_URL;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  await page.goto(baseUrl!);
  await page.getByPlaceholder("Username").fill(username!);
  await page.getByPlaceholder("Password").fill(password!);
  await page.getByRole("button", { name: "Login" }).click();
});

// fixtures
myCustomTest(
  "directly land hero page, login auto handled by fixtures",
  async ({ loggedInPage }) => {
    await loggedInPage.waitForURL(
      "https://the-internet.herokuapp.com/dashboard"
    );
    //add more assertion if needed
  }
);

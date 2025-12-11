export const baseUrl = "https://playwright.dev";
export const BOOKER_API = {
  baseUrl: "https://restful-booker.herokuapp.com",
  endPoints: {
    booking: "booking",
    auth: "auth",
  },
};
export const headers = { "Content-Type": "application/json" };
export const inputParams = {
  firstname: "Marees",
  lastname: "A",
  totalprice: 1000,
  depositpaid: false,
  bookingdates: {
    checkin: "2025-06-01",
    checkout: "2025-06-16",
  },
  food: "Breakfast",
  additionalneeds: "Non-Smoking Room",
};

export function getDocsUrl(): string {
  return `${baseUrl}/docs/intro`;
}

export const creds = {
  username: "admin",
  password: "password123",
};
